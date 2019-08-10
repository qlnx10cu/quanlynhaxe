const router = require('express').Router();
const Statistic = require('../controllers/Statistic');

router.get('/bill', Statistic.getBill);
router.get('/bill/export', Statistic.getBillExport);
router.get('/employee', Statistic.getEmployee);
router.get('/chamcong/employee', Statistic.getBangCongEmployee);
router.get('/chamcong/employee/execl', Statistic.getBangCongEmployeeExecl);

router.get('/execl', Statistic.getExeclBangCongEmployee);

router.get('/layfile/', Statistic.getTonKhoItem);


module.exports = router;