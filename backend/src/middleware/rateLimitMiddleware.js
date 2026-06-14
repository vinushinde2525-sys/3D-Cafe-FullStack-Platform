const rateLimit = require('express-rate-limit');

const createLimiter = (windowMs, max, message) =>
  rateLimit({ windowMs, max, message: { success: false, message }, standardHeaders: true, legacyHeaders: false });

module.exports = {
  authLimiter: createLimiter(60 * 60 * 1000, 20, 'Too many auth attempts'),
  apiLimiter: createLimiter(15 * 60 * 1000, 200, 'Too many requests'),
  orderLimiter: createLimiter(60 * 1000, 10, 'Too many order requests'),
  uploadLimiter: createLimiter(60 * 1000, 5, 'Too many upload requests'),
};
