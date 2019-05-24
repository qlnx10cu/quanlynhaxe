const router = require('express').Router();
const Bill = require('../controllers/BillLe');

router.get('/', Bill.getList);
router.get('/mahoadon/:mahoadon', Bill.getByMa);
router.post('/', Bill.add);
router.get('/mahoadon/:mahoadon/chitiet', Bill.getChitiet);
// router.delete('/mahoadon/:mahoadon', Bill.delete);


module.exports = router;