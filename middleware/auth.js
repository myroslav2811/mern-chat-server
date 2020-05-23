const jwt = require('jsonwebtoken');
const { jwtOpt } = require('../options');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'Token not drovided!' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const payload = jwt.verify(token, jwtOpt.secretKey)
        if (payload.type !== 'access') {
            return res.status(401).json({ message: 'Invalid token!' });
        }
        req.payload = payload;
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token!' });
        } else if (e instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token expired!' });
        }
    }

    next();
};