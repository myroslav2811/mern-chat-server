module.exports = {
    signUp: require('./signUp'),
    logOut: require('./logOut'),
    auth: require('./auth').auth,
    refreshTokens: require('./auth').refreshTokens,
    checkToken: require('./checkToken.js'),
    getDialogs: require('./getDialogs'),
    searchContacts: require('./searchContacts'),
    createDialog: require('./createDialog'),
    getMessages: require('./getMessages'),
}