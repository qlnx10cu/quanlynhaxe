const router = require('express').Router();
const ChamSoc = require('../controllers/ChamSoc');

router.get('/', ChamSoc.getList);
router.get('/ma/:ma', ChamSoc.getByMa);
router.get('/bydate', ChamSoc.bydate);
router.post('/', ChamSoc.add);
router.put('/ma/:ma', ChamSoc.update);
router.delete('/ma/:ma', ChamSoc.delete);


module.exports = router;