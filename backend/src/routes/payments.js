const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect } = require('../middleware/authMiddleware');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const Order = require('../models/Order');
const { getIO } = require('../socket');

// Create payment intent
router.post('/create-intent', protect, async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.user.toString() !== req.user._id.toString()) throw new ApiError(403, 'Access denied');

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.total * 100), // paise
    currency: 'inr',
    metadata: { orderId: order._id.toString(), orderNumber: order.orderNumber, userId: req.user._id.toString() },
    receipt_email: req.user.email,
  });

  order.stripePaymentIntentId = paymentIntent.id;
  await order.save();
  res.json(new ApiResponse(200, { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id }));
});

// Confirm payment
router.post('/confirm', protect, async (req, res) => {
  const { paymentIntentId } = req.body;
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (intent.status !== 'succeeded') throw new ApiError(400, 'Payment not completed');

  const order = await Order.findOneAndUpdate(
    { stripePaymentIntentId: paymentIntentId },
    { paymentStatus: 'paid', status: 'accepted' },
    { new: true }
  );

  const io = getIO();
  if (io && order) {
    io.to('kitchen').emit('new_order', { orderId: order._id, orderNumber: order.orderNumber });
    io.to(`order_${order._id}`).emit('order_status_update', { orderId: order._id, status: 'accepted' });
  }

  res.json(new ApiResponse(200, order, 'Payment confirmed'));
});

// Stripe webhook
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    await Order.findOneAndUpdate({ stripePaymentIntentId: intent.id }, { paymentStatus: 'paid' });
  } else if (event.type === 'payment_intent.payment_failed') {
    await Order.findOneAndUpdate({ stripePaymentIntentId: event.data.object.id }, { paymentStatus: 'failed' });
  }

  res.json({ received: true });
});

module.exports = router;
