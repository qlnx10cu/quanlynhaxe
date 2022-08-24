const router = require('express').Router();
const ApiController = require('../controllers/Api');

router.get('/webhook', ApiController.webhook);
router.post('/webhook', ApiController.webhook);

module.exports = router;