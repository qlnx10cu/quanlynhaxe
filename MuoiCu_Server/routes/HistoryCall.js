const router = require('express').Router();
const HistoryCall = require('../controllers/HistoryCall');

router.get('/', HistoryCall.getList);
router.get('/ma/:ma', HistoryCall.getByMa);
router.get('/log', HistoryCall.log);
router.post('/', HistoryCall.add);
router.put('/ma/:ma', HistoryCall.update);
router.delete('/ma/:ma', HistoryCall.delete);


module.exports = router;