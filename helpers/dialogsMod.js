module.exports = (dialogs, id) => {
    (2, id);
    if (Array.isArray(dialogs)) {
        return dialogs.map(item => {
            (1, item.members)
            return {
                to: item.members.filter(memb => memb._id.toString() !== id)[0],
                ...item._doc
            }
        })
    }
    else {
        return {
            to: dialogs.members.filter(memb => memb._id.toString() !== id)[0],
            ...dialogs._doc
        }
    }
}