const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwtAuth = require('socketio-jwt-auth');
const { jwtOpt } = require('./options')
const { User, Message, Dialog } = require('./models');
const dialogsMod = require('./helpers/dialogsMod');

const { auth, refreshTokens, signUp, logOut, getDialogs, searchContacts, checkToken, getMessages, createDialog } = require('./controllers')
const { checkAuth } = require('./middleware');
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/diplomaChat', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

app.use(cors());
app.use(bodyParser.json());

app.get('/dialogs', checkAuth, getDialogs);
app.get('/check-auth', checkAuth, checkToken);
app.get('/messages/:id', checkAuth, getMessages)

app.post('/signup', signUp);
app.post('/signin', auth);
app.post('/refresh-tokens', refreshTokens);
app.post('/logout', checkAuth, logOut);
app.post('/search-contacts', checkAuth, searchContacts);
app.post('/create-dialog', checkAuth, createDialog);

io.use(jwtAuth.authenticate({
    secret: jwtOpt.secretKey
}, (payload, done) => {
    User.findOne({ _id: payload.userId })
        .select("-password")
        .exec()
        .then(user => {
            if (!user) {
                return done(null, false, 'user does not exist');
            }
            return done(null, user);
        })
        .catch(err => {
            return done(err);
        })
}));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static( 'client/build' ));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}

const users = {};

io.on('connection', function (socket) {
    users[socket.request.user._id] = socket.id;
    socket.emit('success', {
        message: 'success logged in!',
        user: socket.request.user
    });

    socket.on('join', data => {
        socket.join(data)
    })

    socket.on('leave', data => {
        socket.leave(data)
    })

    socket.on('createMessage', data => {
        Message.create(data)
            .then(message => {
                io.to(data.dialog).emit('newMessage', message);
                Dialog.findOneAndUpdate({ _id: message.dialog }, { lastMessage: message._id }, { new: true })
                    .populate([{ path: 'members', select: '-password' }, { path: 'lastMessage' }])
                    .exec()
                    .then(dialog => {
                        if (users[message.author])
                            io.to(users[message.author]).emit('updateDialog', dialogsMod(dialog, message.author.toString()));
                        if (users[message.to])
                            io.to(users[message.to]).emit('updateDialog', dialogsMod(dialog, message.to.toString()));
                    })
            })
    })

    socket.on('disconnect', () => {
        delete users[socket.request.user._id];
    })
});

server.listen(PORT, (err) => {
    if (err) {
        throw err;
    }
    console.log(`listening on port ${PORT}`);
});