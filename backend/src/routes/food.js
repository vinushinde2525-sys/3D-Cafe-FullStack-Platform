const router = require('express').Router();
const ctrl = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin, isStaff } = require('../middleware/roleMiddleware');
const { validate, validators } = require('../middleware/validateMiddleware');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({ cloudinary, params: { folder: 'cafe/food', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], transformation: [{ width: 800, height: 600, crop: 'fill', quality: 'auto' }] } });
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', ctrl.getAllFood);
router.get('/featured', ctrl.getFeatured);
router.get('/categories', ctrl.getCategories);
router.get('/top-rated', ctrl.getTopRated);
router.get('/specials', ctrl.getSpecials);
router.get('/:id', ctrl.getFoodById);
router.post('/', protect, isAdmin, upload.array('images', 5), validators.createFood, validate, ctrl.createFood);
router.put('/:id', protect, isAdmin, upload.array('images', 5), ctrl.updateFood);
router.delete('/:id', protect, isAdmin, ctrl.deleteFood);

module.exports = router;
