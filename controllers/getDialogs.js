const { Dialog } = require('../models')
const dialogsMod = require('../helpers/dialogsMod')

module.exports = (req, res) => {
    Dialog.find({ members: { $in: [req.payload.userId] } })
        .sort({ updatedAt: -1 })
        .populate([{ path: 'members', select: '-password' }, { path: 'lastMessage' }])
        .exec()
        .then(dialogs => {
            res.json(dialogsMod(dialogs, req.payload.userId));
        })
        .catch(err => {
            res.status(500).json({ 'message': err })
        })
}