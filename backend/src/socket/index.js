const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Auth middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('_id name role');
        if (user) socket.user = user;
      }
      next();
    } catch {
      next(); // allow unauthenticated connections (public order tracking)
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id} | user: ${socket.user?.name || 'guest'}`);

    // ─── CUSTOMER: Track specific order ───────────────────────────────
    socket.on('track_order', (orderId) => {
      if (orderId) {
        socket.join(`order_${orderId}`);
        socket.emit('tracking_started', { orderId, message: 'Tracking started' });
      }
    });

    socket.on('untrack_order', (orderId) => {
      if (orderId) socket.leave(`order_${orderId}`);
    });

    // ─── STAFF/ADMIN: Join kitchen room ───────────────────────────────
    socket.on('join_kitchen', () => {
      if (socket.user && ['staff', 'admin'].includes(socket.user.role)) {
        socket.join('kitchen');
        socket.emit('kitchen_joined', { message: 'Joined kitchen channel' });
        console.log(`👨‍🍳 ${socket.user.name} joined kitchen`);
      } else {
        socket.emit('error', { message: 'Unauthorized' });
      }
    });

    socket.on('leave_kitchen', () => {
      socket.leave('kitchen');
    });

    // ─── DELIVERY: Track delivery location ────────────────────────────
    socket.on('delivery_location_update', ({ orderId, lat, lng }) => {
      if (socket.user && ['staff', 'admin'].includes(socket.user.role)) {
        io.to(`order_${orderId}`).emit('delivery_location', { orderId, lat, lng, timestamp: new Date() });
      }
    });

    // ─── KITCHEN: Staff acknowledges order ────────────────────────────
    socket.on('kitchen_ack', ({ orderId }) => {
      if (socket.user && ['staff', 'admin'].includes(socket.user.role)) {
        io.to('kitchen').emit('order_acknowledged', { orderId, staffName: socket.user.name });
      }
    });

    // ─── KITCHEN: Estimated time update ───────────────────────────────
    socket.on('update_eta', ({ orderId, minutes }) => {
      if (socket.user && ['staff', 'admin'].includes(socket.user.role)) {
        const eta = new Date(Date.now() + minutes * 60 * 1000);
        io.to(`order_${orderId}`).emit('eta_updated', { orderId, estimatedMinutes: minutes, eta });
      }
    });

    // ─── PING/PONG health ─────────────────────────────────────────────
    socket.on('ping_server', () => socket.emit('pong_server', { time: Date.now() }));

    socket.on('disconnect', (reason) => {
      console.log(`🔌 Socket disconnected: ${socket.id} | reason: ${reason}`);
    });

    socket.on('error', (err) => {
      console.error('Socket error:', err);
    });
  });

  console.log('✅ Socket.io initialized');
  return io;
};

const getIO = () => {
  if (!io) console.warn('⚠️  Socket.io not initialized');
  return io;
};

// Utility: emit to all kitchen staff
const emitToKitchen = (event, data) => {
  if (io) io.to('kitchen').emit(event, data);
};

// Utility: emit order status to customer tracking room
const emitOrderUpdate = (orderId, data) => {
  if (io) io.to(`order_${orderId}`).emit('order_status_update', data);
};

module.exports = { initSocket, getIO, emitToKitchen, emitOrderUpdate };
