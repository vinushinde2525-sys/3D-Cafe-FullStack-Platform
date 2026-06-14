const router = require('express').Router();
const ctrl = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({ cloudinary, params: { folder: 'cafe/avatars', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], transformation: [{ width: 400, height: 400, crop: 'fill' }] } });
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

// Profile routes (authenticated)
router.get('/profile', protect, ctrl.getProfile);
router.put('/profile', protect, upload.single('avatar'), ctrl.updateProfile);
router.put('/change-password', protect, ctrl.changePassword);
router.post('/addresses', protect, ctrl.addAddress);
router.put('/addresses/:addressId', protect, ctrl.updateAddress);
router.delete('/addresses/:addressId', protect, ctrl.deleteAddress);

// Admin routes
router.get('/', protect, isAdmin, ctrl.getAllUsers);
router.get('/:id', protect, isAdmin, ctrl.getUserById);
router.patch('/:id/toggle-block', protect, isAdmin, ctrl.toggleBlockUser);
router.patch('/:id/role', protect, isAdmin, ctrl.updateUserRole);

module.exports = router;
