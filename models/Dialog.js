const mongoose = require('mongoose');

const DialogSchema = mongoose.Schema({
    lastMessage: {
        type: mongoose.Types.ObjectId,
        ref: 'Message'
    },
    members: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
}, { timestamps: { createdAt: 'createdAt' } })


module.exports = mongoose.model('Dialog', DialogSchema);