const router = require('express').Router();
const AccountController = require('../controllers/Account');

router.post('/signup', AccountController.signup);
router.post('/login', AccountController.login);

module.exports = router;