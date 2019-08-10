const router = require('express').Router();
const Salary = require('../controllers/Salary');

router.get('/', Salary.getList);
router.get('/ma/:ma', Salary.getByMa);
router.post('/', Salary.add);
router.put('/ma/:ma', Salary.update);
router.delete('/ma/:ma', Salary.delete);

module.exports = router;