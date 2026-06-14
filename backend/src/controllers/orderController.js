const orderService = require('../services/orderService');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const createOrder = async (req, res) => {
  const order = await orderService.createOrder(req.user._id, req.body);
  res.status(201).json(new ApiResponse(201, order, 'Order placed successfully'));
};

const getMyOrders = async (req, res) => {
  const data = await orderService.getUserOrders(req.user._id, req.query.page, req.query.limit);
  res.json(new ApiResponse(200, data));
};

const getOrderById = async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user._id, req.user.role);
  res.json(new ApiResponse(200, order));
};

const getAllOrders = async (req, res) => {
  const data = await orderService.getAllOrders(req.query, req.query.page, req.query.limit);
  res.json(new ApiResponse(200, data));
};

const updateOrderStatus = async (req, res) => {
  const { status, note } = req.body;
  if (!status) throw new ApiError(400, 'Status is required');
  const order = await orderService.updateOrderStatus(req.params.id, status, req.user._id, note);
  res.json(new ApiResponse(200, order, `Order status updated to ${status}`));
};

const cancelOrder = async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user._id, req.user.role);
  if (!['pending', 'accepted'].includes(order.status)) throw new ApiError(400, 'Order cannot be cancelled at this stage');
  const updated = await orderService.updateOrderStatus(req.params.id, 'cancelled', req.user._id, req.body.reason || 'Cancelled by customer');
  res.json(new ApiResponse(200, updated, 'Order cancelled'));
};

const getOrderStats = async (req, res) => {
  const Order = require('../models/Order');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [total, todayOrders, byStatus, revenue] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: today } }),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
  ]);
  res.json(new ApiResponse(200, { total, todayOrders, byStatus, totalRevenue: revenue[0]?.total || 0 }));
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder, getOrderStats };
