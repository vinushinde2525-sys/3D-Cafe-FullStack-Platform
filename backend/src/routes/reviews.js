const router = require('express').Router({ mergeParams: true });
const ctrl = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { validate, validators } = require('../middleware/validateMiddleware');

router.get('/', ctrl.getReviews);
router.post('/', protect, validators.createReview, validate, ctrl.createReview);
router.patch('/:id/helpful', protect, ctrl.markHelpful);
router.delete('/:id', protect, ctrl.deleteReview);

module.exports = router;
