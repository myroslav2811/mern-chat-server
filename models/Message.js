const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    author: mongoose.Types.ObjectId,
    to: mongoose.Types.ObjectId,
    dialog: mongoose.Types.ObjectId
}, { timestamps: { createdAt: 'createdAt' } })

module.exports = mongoose.model('Message', MessageSchema);