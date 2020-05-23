const { Dialog } = require('../models');
const dialogsMod = require('../helpers/dialogsMod')

module.exports = (req, res) => {
    Dialog.findOne({ members: { $all: [req.payload.userId, req.body.id] } })
        .populate([{ path: 'members', select: '-password' }, { path: 'lastMessage' }])
        .exec()
        .then(item => {
            (item);
            if (!item) {
                Dialog.create({
                    lastMessage: null,
                    members: [req.payload.userId, req.body.id]
                })
                    .then(dialog => {
                        Dialog.findOne(dialog)
                            .populate('members')
                            .exec()
                            .then(dialog => {
                                res.json(dialogsMod(dialog, req.payload.userId));
                                (2, dialog)
                            })
                    })
                    .catch(err => {
                        res.status(500).json(err);
                    })
            }
            else {
                res.json(item);
            }
        })
}