const router = require('../lib/router').Router();
const Bill = require('../controllers/BillLe');

router.get('/', Bill.getList);
router.get('/mahoadon/:mahoadon', Bill.getByMa);
router.post('/', Bill.add);
router.get('/mahoadon/:mahoadon/chitiet', Bill.getChitiet);
router.put('/mahoadon/:mahoadon', Bill.update);
router.get("/mahoadon/:mahoadon/export", Bill.export);
router.get("/mahoadon/:mahoadon/exportbill", Bill.exportBill);
router.delete('/mahoadon/:mahoadon', Bill.delete);

module.exports = router.router;