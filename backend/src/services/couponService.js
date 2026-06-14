const Coupon = require('../models/Coupon');
const ApiError = require('../utils/ApiError');

const createCoupon = async (data) => {
  const existing = await Coupon.findOne({ code: data.code.toUpperCase() });
  if (existing) throw new ApiError(409, 'Coupon code already exists');
  return Coupon.create({ ...data, code: data.code.toUpperCase() });
};

const validateCoupon = async (code, userId, orderAmount) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  if (coupon.expiryDate < Date.now()) throw new ApiError(400, 'Coupon expired');
  if (coupon.startDate > Date.now()) throw new ApiError(400, 'Coupon not yet active');
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw new ApiError(400, 'Coupon usage limit reached');
  if (coupon.usersUsed.includes(userId)) throw new ApiError(400, 'You have already used this coupon');
  if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) throw new ApiError(400, `Minimum order ₹${coupon.minOrderAmount} required`);
  let discount = coupon.discountType === 'percentage' ? (orderAmount * coupon.discountValue) / 100 : coupon.discountValue;
  if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
  return { coupon, discount: Math.round(discount * 100) / 100 };
};

const getAllCoupons = (active) => {
  const query = {};
  if (active === 'true') query.isActive = true;
  return Coupon.find(query).sort('-createdAt');
};

const updateCoupon = async (id, data) => {
  const coupon = await Coupon.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  return coupon;
};

const deleteCoupon = async (id) => {
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) throw new ApiError(404, 'Coupon not found');
};

module.exports = { createCoupon, validateCoupon, getAllCoupons, updateCoupon, deleteCoupon };
