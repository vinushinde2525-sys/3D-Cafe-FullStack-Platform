const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const { uploadLimiter } = require('../middleware/rateLimitMiddleware');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const storage = new CloudinaryStorage({ cloudinary, params: (req) => ({ folder: `cafe/${req.body.folder || 'general'}`, allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'], transformation: [{ quality: 'auto' }] }) });
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/image', protect, isAdmin, uploadLimiter, upload.single('image'), (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');
  res.json(new ApiResponse(201, { url: req.file.path, publicId: req.file.filename }, 'Image uploaded'));
});

router.post('/images', protect, isAdmin, uploadLimiter, upload.array('images', 10), (req, res) => {
  if (!req.files?.length) throw new ApiError(400, 'No files uploaded');
  const files = req.files.map((f) => ({ url: f.path, publicId: f.filename }));
  res.json(new ApiResponse(201, files, 'Images uploaded'));
});

router.delete('/image', protect, isAdmin, async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) throw new ApiError(400, 'Public ID required');
  await cloudinary.uploader.destroy(publicId);
  res.json(new ApiResponse(200, null, 'Image deleted'));
});

module.exports = router;
