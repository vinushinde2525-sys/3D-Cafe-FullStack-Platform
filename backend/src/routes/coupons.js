const router = require('express').Router();
const ctrl = require('../controllers/couponController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const { validate, validators } = require('../middleware/validateMiddleware');

router.post('/validate', protect, ctrl.validateCoupon);
router.get('/', protect, isAdmin, ctrl.getAllCoupons);
router.post('/', protect, isAdmin, validators.createCoupon, validate, ctrl.createCoupon);
router.put('/:id', protect, isAdmin, ctrl.updateCoupon);
router.delete('/:id', protect, isAdmin, ctrl.deleteCoupon);

module.exports = router;
