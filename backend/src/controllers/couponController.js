const couponService = require('../services/couponService');
const ApiResponse = require('../utils/ApiResponse');

const createCoupon = async (req, res) => {
  const coupon = await couponService.createCoupon(req.body);
  res.status(201).json(new ApiResponse(201, coupon, 'Coupon created'));
};

const getAllCoupons = async (req, res) => {
  const coupons = await couponService.getAllCoupons(req.query.active);
  res.json(new ApiResponse(200, coupons));
};

const validateCoupon = async (req, res) => {
  const { code, orderAmount } = req.body;
  const result = await couponService.validateCoupon(code, req.user._id, orderAmount);
  res.json(new ApiResponse(200, result, 'Coupon valid'));
};

const updateCoupon = async (req, res) => {
  const coupon = await couponService.updateCoupon(req.params.id, req.body);
  res.json(new ApiResponse(200, coupon, 'Coupon updated'));
};

const deleteCoupon = async (req, res) => {
  await couponService.deleteCoupon(req.params.id);
  res.json(new ApiResponse(200, null, 'Coupon deleted'));
};

module.exports = { createCoupon, getAllCoupons, validateCoupon, updateCoupon, deleteCoupon };
