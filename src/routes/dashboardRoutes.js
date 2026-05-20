const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, dashboardController.getDashboard);
router.get('/stats', authenticate, dashboardController.getStats);
router.get('/widgets', authenticate, dashboardController.getWidgetsConfig);

module.exports = router;