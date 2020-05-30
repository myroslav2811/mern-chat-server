const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User, Token } = require('../models');
const { secretKey } = require('../options').jwtOpt;
const authHelper = require('../helpers/authHelper');

const updateTokens = (userId) => {
    const accessToken = authHelper.generateAccessToken(userId);
    const refreshToken = authHelper.generateRefreshToken();

    return authHelper.replaceDbRefreshToken(refreshToken.id, userId)
        .then(() => ({
            accessToken,
            refreshToken: refreshToken.token
        }));
};

const refreshTokens = (req, res) => {
    const { refreshToken } = req.body;

    let payload;

    try {
        payload = jwt.verify(refreshToken, secretKey);
        if (payload.type !== 'refresh') {
            return res.status(400).json({ message: 'Invalid token!' });
        }
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            return res.status(400).json({ message: 'Token expired!' });
        } else if (e instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({ message: 'Invalid token!' });
        }
    }


    Token.findOne({ tokenId: payload.id })
        .exec()
        .then((token) => {
            if (token === null) {
                throw 'Invalid token';
            }

            return updateTokens(token.userId);
        })
        .then((tokens) => {
            res.status(201).json(tokens)
        })
        .catch((err) => {
            return res.status(400).json({ message: err })
        });
};

const auth = (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username })
        .exec()
        .then((user) => {
            (user);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isValid = bcrypt.compareSync(password, user.password);

            if (isValid) {
                updateTokens(user._id).then((tokens) => {
                    return res.json({ tokens, user });
                });
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        })
        .catch((err) => {
            return res.status(500).json({ message: err });
        })
};


module.exports = {
    auth,
    refreshTokens
};