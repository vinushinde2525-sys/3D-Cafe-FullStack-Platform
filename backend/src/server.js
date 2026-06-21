const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
require('express-async-errors');
require('dotenv').config();

const connectDB = require('./config/database');
const { initSocket } = require('./socket');
const errorHandler = require('./middleware/errorHandler');

// ── Routes ────────────────────────────────────────────────────────────────
const authRoutes      = require('./routes/auth');
const userRoutes      = require('./routes/users');
const foodRoutes      = require('./routes/food');
const orderRoutes     = require('./routes/orders');
const cartRoutes      = require('./routes/cart');
const reviewRoutes    = require('./routes/reviews');
const couponRoutes    = require('./routes/coupons');
const inventoryRoutes = require('./routes/inventory');
const paymentRoutes   = require('./routes/payments');
const analyticsRoutes = require('./routes/analytics');
const uploadRoutes    = require('./routes/upload');

const app = express();
const server = http.createServer(app);

// Init Socket.io
initSocket(server);

// Connect to Database
connectDB();

// ── Security ──────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(mongoSanitize());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }));

app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// ── Stripe webhook needs raw body BEFORE json parser ──────────────────────
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// ── Body Parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── Passport ──────────────────────────────────────────────────────────────
require('./config/passport');
app.use(passport.initialize());

// ── Health Check ──────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ success: true, message: '☕ 3D Café API running', timestamp: new Date(), env: process.env.NODE_ENV }));

// ── API Routes ────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/food',      foodRoutes);
app.use('/api/food/:foodId/reviews', reviewRoutes);  // nested reviews
app.use('/api/orders',    orderRoutes);
app.use('/api/cart',      cartRoutes);
app.use('/api/reviews',   reviewRoutes);
app.use('/api/coupons',   couponRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/payments',  paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload',    uploadRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────
app.use('*', (req, res) => res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` }));

// ── Global Error Handler ──────────────────────────────────────────────────
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 3D Café Server  →  http://localhost:${PORT}`);
  console.log(`📡 Socket.io ready →  ws://localhost:${PORT}`);
  console.log(`🌍 Environment     →  ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = { app, server };
