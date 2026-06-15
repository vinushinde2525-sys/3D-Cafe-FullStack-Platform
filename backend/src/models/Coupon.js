const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  description: String,
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscountAmount: Number,
  usageLimit: { type: Number, default: null },
  usedCount: { type: Number, default: 0 },
  usersUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
  applicableCategories: [String],
  applicableItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' }],
}, { timestamps: true });

couponSchema.index({ expiryDate: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
