const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const ApiResponse = require('../utils/ApiResponse');

// Cart is managed client-side (Redux/localStorage) with server-side price validation
// This route validates cart items and calculates totals server-side
router.post('/validate', protect, async (req, res) => {
  const { calculateOrderTotals } = require('../services/orderService');
  const { items, couponCode, orderType = 'delivery' } = req.body;
  const result = await calculateOrderTotals(items, couponCode, orderType);
  res.json(new ApiResponse(200, {
    items: result.enrichedItems,
    subtotal: result.subtotal,
    tax: result.tax,
    deliveryFee: result.deliveryFee,
    discount: result.discount,
    couponDiscount: result.couponDiscount,
    total: result.total,
  }, 'Cart validated'));
});

module.exports = router;
