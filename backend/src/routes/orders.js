const router = require('express').Router();
const ctrl = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { isStaff, isAdmin } = require('../middleware/roleMiddleware');
const { validate, validators } = require('../middleware/validateMiddleware');

router.post('/', protect, validators.createOrder, validate, ctrl.createOrder);
router.get('/my-orders', protect, ctrl.getMyOrders);
router.get('/stats', protect, isAdmin, ctrl.getOrderStats);
router.get('/:id', protect, ctrl.getOrderById);
router.get('/', protect, isStaff, ctrl.getAllOrders);
router.patch('/:id/status', protect, isStaff, ctrl.updateOrderStatus);
router.patch('/:id/cancel', protect, ctrl.cancelOrder);

module.exports = router;
