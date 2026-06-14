const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const Order = require('../models/Order');
const User = require('../models/User');
const FoodItem = require('../models/FoodItem');
const ApiResponse = require('../utils/ApiResponse');

router.get('/dashboard', protect, isAdmin, async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));

  const [totalRevenue, monthRevenue, todayOrders, totalUsers, totalItems, recentOrders, topItems, salesByDay, ordersByStatus] = await Promise.all([
    Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    Order.aggregate([{ $match: { paymentStatus: 'paid', createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    Order.countDocuments({ createdAt: { $gte: startOfDay } }),
    User.countDocuments({ role: 'customer' }),
    FoodItem.countDocuments({ isAvailable: true }),
    Order.find().sort('-createdAt').limit(5).populate('user', 'name email').select('orderNumber total status createdAt'),
    Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.foodItem', name: { $first: '$items.name' }, totalOrders: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
      { $sort: { totalOrders: -1 } }, { $limit: 8 },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, orders: { $sum: 1 }, revenue: { $sum: '$total' } } },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
  ]);

  res.json(new ApiResponse(200, {
    totalRevenue: totalRevenue[0]?.total || 0,
    monthRevenue: monthRevenue[0]?.total || 0,
    todayOrders,
    totalUsers,
    totalItems,
    recentOrders,
    topItems,
    salesByDay,
    ordersByStatus,
  }));
});

router.get('/sales', protect, isAdmin, async (req, res) => {
  const { period = '30d' } = req.query;
  const days = period === '7d' ? 7 : period === '90d' ? 90 : period === '1y' ? 365 : 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const data = await Order.aggregate([
    { $match: { createdAt: { $gte: since }, paymentStatus: 'paid' } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  res.json(new ApiResponse(200, data));
});

module.exports = router;
