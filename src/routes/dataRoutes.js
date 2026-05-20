const router = require('express').Router();
const dataController = require('../controllers/dataController');
const { authenticate } = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ dest: process.env.UPLOAD_DIR || './uploads/' });

router.get('/', authenticate, dataController.getAll);
router.post('/import', authenticate, upload.single('file'), dataController.importData);
router.get('/search', authenticate, dataController.search);
router.get('/filter', authenticate, dataController.filter);
router.get('/:id', authenticate, dataController.getById);
router.delete('/:id', authenticate, dataController.deleteDataset);

module.exports = router;