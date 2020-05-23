const { Token } = require('../models');

module.exports = (req, res) => {
    Token.findOneAndRemove({ userId: req.payload.userId })
        .exec()
        .then(() => {
            res.status(200).json({ message: 'OK' });
        })
        .catch(err => {
            res.status(500).json({ message: err });
        });
}

