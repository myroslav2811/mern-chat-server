const router = require('express').Router();
const { auth, refreshTokens, signUp } = require('./controllers');

router.post('/signup', signUp);
router.post('/signin', auth);
router.post('/refresh-tokens', refreshTokens);

module.exports = router;