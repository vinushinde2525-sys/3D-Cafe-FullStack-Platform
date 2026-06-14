const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { getIO } = require('../socket');
const { sendEmail } = require('../utils/sendEmail');

const TAX_RATE = 0.05;
const DELIVERY_FEE = 40;
const FREE_DELIVERY_THRESHOLD = 500;

const calculateOrderTotals = async (items, couponCode, orderType) => {
  let subtotal = 0;
  const enrichedItems = [];

  for (const item of items) {
    const food = await FoodItem.findById(item.foodItem);
    if (!food) throw new ApiError(404, `Food item not found: ${item.foodItem}`);
    if (!food.isAvailable) throw new ApiError(400, `${food.name} is currently unavailable`);
    const customizationTotal = (item.customizations || []).reduce((s, c) => s + (c.extraPrice || 0), 0);
    const itemPrice = food.price + customizationTotal;
    subtotal += itemPrice * item.quantity;
    enrichedItems.push({ foodItem: food._id, name: food.name, price: itemPrice, quantity: item.quantity, customizations: item.customizations || [], image: food.images?.[0]?.url || '' });
  }

  const tax = subtotal * TAX_RATE;
  const deliveryFee = orderType === 'delivery' && subtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
  let discount = 0;
  let couponDiscount = 0;
  let coupon = null;

  if (couponCode) {
    coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true, expiryDate: { $gt: Date.now() }, startDate: { $lte: Date.now() } });
    if (!coupon) throw new ApiError(400, 'Invalid or expired coupon');
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) throw new ApiError(400, `Minimum order ₹${coupon.minOrderAmount} required for this coupon`);
    couponDiscount = coupon.discountType === 'percentage' ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;
    if (coupon.maxDiscountAmount) couponDiscount = Math.min(couponDiscount, coupon.maxDiscountAmount);
    discount = couponDiscount;
  }

  const total = Math.max(0, subtotal + tax + deliveryFee - discount);
  return { enrichedItems, subtotal, tax, deliveryFee, discount, couponDiscount, total, coupon };
};

const createOrder = async (userId, orderData) => {
  const { items, orderType, deliveryAddress, couponCode, specialInstructions, paymentMethod } = orderData;
  const { enrichedItems, subtotal, tax, deliveryFee, discount, couponDiscount, total, coupon } = await calculateOrderTotals(items, couponCode, orderType);

  const order = await Order.create({
    user: userId, items: enrichedItems, orderType, deliveryAddress, subtotal, tax, deliveryFee,
    discount, couponCode, couponDiscount, total, specialInstructions, paymentMethod,
    statusHistory: [{ status: 'pending', note: 'Order placed' }],
  });

  if (coupon) {
    coupon.usedCount += 1;
    coupon.usersUsed.push(userId);
    await coupon.save();
  }

  await User.findByIdAndUpdate(userId, { $inc: { totalOrders: 1 } });

  // Emit to kitchen
  const io = getIO();
  if (io) io.to('kitchen').emit('new_order', { orderId: order._id, orderNumber: order.orderNumber, total, itemCount: enrichedItems.length });

  // Email confirmation
  const user = await User.findById(userId);
  try { await sendEmail({ to: user.email, templateName: 'orderConfirmation', templateData: { name: user.name, orderNumber: order.orderNumber, total } }); } catch (_) {}

  return order.populate('user', 'name email phone');
};

const updateOrderStatus = async (orderId, status, updatedBy, note = '') => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  const validTransitions = {
    pending: ['accepted', 'rejected'],
    accepted: ['preparing'],
    preparing: ['ready'],
    ready: ['out_for_delivery', 'delivered'],
    out_for_delivery: ['delivered'],
  };

  if (validTransitions[order.status] && !validTransitions[order.status].includes(status) && status !== 'cancelled') {
    throw new ApiError(400, `Cannot transition from ${order.status} to ${status}`);
  }

  order.status = status;
  order.statusHistory.push({ status, note, updatedBy, timestamp: new Date() });
  if (status === 'delivered') {
    order.actualDeliveryTime = new Date();
    await User.findByIdAndUpdate(order.user, { $inc: { totalSpent: order.total, loyaltyPoints: Math.floor(order.total / 10) } });
    await FoodItem.updateMany({ _id: { $in: order.items.map((i) => i.foodItem) } }, { $inc: { orderCount: 1 } });
  }
  await order.save();

  const io = getIO();
  if (io) {
    io.to(`order_${orderId}`).emit('order_status_update', { orderId, orderNumber: order.orderNumber, status, timestamp: new Date(), note });
    io.to('kitchen').emit('order_updated', { orderId, status });
  }

  return order;
};

const getUserOrders = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find({ user: userId }).sort('-createdAt').skip(skip).limit(Number(limit)).populate('items.foodItem', 'name images'),
    Order.countDocuments({ user: userId }),
  ]);
  return { orders, total, page: Number(page), pages: Math.ceil(total / limit) };
};

const getAllOrders = async (filters = {}, page = 1, limit = 20) => {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.date) { const d = new Date(filters.date); query.createdAt = { $gte: d, $lt: new Date(d.getTime() + 86400000) }; }
  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find(query).sort('-createdAt').skip(skip).limit(Number(limit)).populate('user', 'name email phone').populate('items.foodItem', 'name images'),
    Order.countDocuments(query),
  ]);
  return { orders, total, page: Number(page), pages: Math.ceil(total / limit) };
};

const getOrderById = async (orderId, userId, role) => {
  const order = await Order.findById(orderId).populate('user', 'name email phone').populate('items.foodItem', 'name images category');
  if (!order) throw new ApiError(404, 'Order not found');
  if (role === 'customer' && order.user._id.toString() !== userId.toString()) throw new ApiError(403, 'Access denied');
  return order;
};

module.exports = { createOrder, updateOrderStatus, getUserOrders, getAllOrders, getOrderById, calculateOrderTotals };
