const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');

const { jwtOpt } = require('../options');
const { Token } = require('../models');

const generateAccessToken = (userId) => {
    const payload = {
        userId,
        type: jwtOpt.token.access.type
    }

    const options = { expiresIn: jwtOpt.token.access.expiresIn };

    return jwt.sign(payload, jwtOpt.secretKey, options);
};

const generateRefreshToken = () => {
    const payload = {
        id: uuid(),
        type: jwtOpt.token.refresh.type
    }

    const options = { expiresIn: jwtOpt.token.refresh.expiresIn };

    return {
        id: payload.id,
        token: jwt.sign(payload, jwtOpt.secretKey, options)
    }
};

const replaceDbRefreshToken = (tokenId, userId) =>
    Token.findOneAndRemove({ userId })
        .exec()
        .then(() => Token.create({ tokenId, userId }));

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    replaceDbRefreshToken
}