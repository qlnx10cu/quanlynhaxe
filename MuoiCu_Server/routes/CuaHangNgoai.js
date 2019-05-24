const router = require('express').Router();
const CuaHangNgoai = require('../controllers/CuaHangNgoai');

router.get('/', CuaHangNgoai.getList);
router.get('/tenphutung/:tenphutung/nhacungcap/:nhacungcap', CuaHangNgoai.getByMa);
router.post('/', CuaHangNgoai.add);
router.put('/tenphutung/:tenphutung/nhacungcap/:nhacungcap', CuaHangNgoai.update);
router.delete('/tenphutung/:tenphutung/nhacungcap/:nhacungcap', CuaHangNgoai.delete);

module.exports = router;