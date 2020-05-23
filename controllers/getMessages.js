const { Message } = require('../models');

module.exports = (req, res) => {
    Message.find({ dialog: req.params.id })
    //     .sort({ date: -1 })
    //     .skip(parseInt(req.params.skip))
    //     .limit(20)
        .exec()
        .then(messages => {
            res.json(messages);
        })
        .catch(err => {
            res.status(500).json(err);
        })
}