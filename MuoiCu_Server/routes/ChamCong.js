const router = require('express').Router();
const ChamCong = require('../controllers/ChamCong');

router.get('/', ChamCong.getList);
router.get('/theongay/ngay/:ngay', ChamCong.getByNgay);
router.get('/theongay/ngay', ChamCong.getByNgay);
router.post('/theongay/ngay/:ngay', ChamCong.addChamCong);
router.post('/theongay/ngay', ChamCong.addChamCong);
router.get('/ma/:ma', ChamCong.getByMa);
router.post('/', ChamCong.add);
router.put('/ma/:ma', ChamCong.update);
router.delete('/ma/:ma', ChamCong.delete);
router.get('/test', ChamCong.test);

module.exports = router;