const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = (req, res) => {
    const { username, password, passwordRepeat, avatar } = req.body;
    if (password == passwordRepeat && password.length >= 6) {
        const user = new User({ username, password: bcrypt.hashSync(password, 12), avatar });
        user.save((err, item) => {
            if (err) {
                if (err.code == 11000) {
                    return res.status(409).json({ message: 'User already exist' });
                }
                return res.status(409).json({ message: err });
            }
            return res.status(201).json({ message: 'user created', username: item.username });
        })
    }
    else {
        return res.status(400).json({ message: 'Wrong credentials' });
    }
}