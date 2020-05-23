const { User } = require('../models');

module.exports = (req, res) => {
    (req.body);
    User.find({ username: new RegExp(req.body.username, 'i'), _id: { $ne: req.payload.userId } })
        .limit(10)
        .select("-password")
        .exec()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).json(err);
        })
}