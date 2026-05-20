const router = require('express').Router();
const reportController = require('../controllers/reportController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, reportController.getAll);
router.post('/', authenticate, reportController.create);
router.get('/:id', authenticate, reportController.getById);
router.delete('/:id', authenticate, reportController.deleteReport);
router.post('/:id/export', authenticate, reportController.exportReport);

module.exports = router;