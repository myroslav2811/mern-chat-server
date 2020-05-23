const { User } = require('../models/')

module.exports = (req, res) => {
    User.findOne({ _id: req.payload.userId })
        .exec()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(500).json({ message: err });
        })
}