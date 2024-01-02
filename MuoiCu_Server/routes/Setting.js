const router = require('express').Router();
const Setting = require('../controllers/Setting');

router.get('/remote', Setting.openRemote);
router.get('/capture', Setting.capture);


module.exports = router;