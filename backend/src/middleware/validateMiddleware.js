const { validationResult, body, param, query } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return next(new ApiError(400, messages[0], errors.array()));
  }
  next();
};

const validators = {
  register: [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  ],
  login: [
    body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password required'),
  ],
  forgotPassword: [body('email').trim().isEmail().withMessage('Valid email required')],
  resetPassword: [
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('confirmPassword').custom((val, { req }) => {
      if (val !== req.body.password) throw new Error('Passwords do not match');
      return true;
    }),
  ],
  createFood: [
    body('name').trim().notEmpty().withMessage('Food name required'),
    body('description').trim().notEmpty().withMessage('Description required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price required'),
    body('category').notEmpty().withMessage('Category required'),
  ],
  createOrder: [
    body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
    body('orderType').isIn(['delivery', 'pickup']).withMessage('Invalid order type'),
  ],
  createReview: [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
    body('comment').optional().isLength({ max: 2000 }),
  ],
  createCoupon: [
    body('code').trim().notEmpty().toUpperCase(),
    body('discountType').isIn(['percentage', 'fixed']).withMessage('Invalid discount type'),
    body('discountValue').isFloat({ min: 0 }).withMessage('Valid discount value required'),
    body('expiryDate').isISO8601().withMessage('Valid expiry date required'),
  ],
  objectId: (field) => param(field).isMongoId().withMessage(`Invalid ${field}`),
  pagination: [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
};

module.exports = { validate, validators };
