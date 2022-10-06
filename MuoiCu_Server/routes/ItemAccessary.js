const router = require('../lib/router').Router();
const Item = require('../controllers/Item');

router.get('/', Item.getList);
router.get('/maphutung/:maphutung', Item.getByMa);
router.post('/', Item.add);
router.put('/maphutung/:maphutung', Item.update);
router.delete('/maphutung/:maphutung', Item.delete);
router.post('/import/', Item.addMutil);

module.exports = router.router;