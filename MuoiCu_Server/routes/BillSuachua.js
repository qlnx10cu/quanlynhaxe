const router = require('express').Router();
const Bill = require('../controllers/BillSuachua');

router.get('/', Bill.getList);
router.get('/mahoadon/:mahoadon', Bill.getByMa);
router.post('/', Bill.add);
router.put('/mahoadon/:mahoadon', Bill.update);
router.delete('/mahoadon/:mahoadon', Bill.delete);
router.get('/mahoadon/:mahoadon/chitiet', Bill.getChitiet);
router.get("/mahoadon/:mahoadon/export",Bill.export);
router.get("/mahoadon/:mahoadon/exportbill",Bill.exportBill);
router.get("/mahoadon/:mahoadon/exportbillNew",Bill.exportBillNew);


module.exports = router;