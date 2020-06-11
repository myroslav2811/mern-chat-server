const router = require('express').Router();
const { logOut, getDialogs, searchContacts, checkToken, getMessages, createDialog } = require('./controllers')
const { checkAuth } = require('./middleware');

router.use(checkAuth)

router.get('/dialogs', getDialogs);
router.get('/check-auth', checkToken);
router.get('/messages/:id', getMessages)

router.post('/logout', logOut);
router.post('/search-contacts', searchContacts);
router.post('/create-dialog', createDialog);

module.exports = router;