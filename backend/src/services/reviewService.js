const Review = require('../models/Review');
const Order = require('../models/Order');
const ApiError = require('../utils/ApiError');

const createReview = async (userId, foodItemId, data) => {
  const existing = await Review.findOne({ user: userId, foodItem: foodItemId });
  if (existing) throw new ApiError(409, 'You have already reviewed this item');
  const purchaseOrder = await Order.findOne({ user: userId, 'items.foodItem': foodItemId, status: 'delivered' });
  return Review.create({ user: userId, foodItem: foodItemId, isVerifiedPurchase: !!purchaseOrder, ...data });
};

const getReviews = async (foodItemId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    Review.find({ foodItem: foodItemId, isApproved: true }).sort('-createdAt').skip(skip).limit(Number(limit)).populate('user', 'name avatar'),
    Review.countDocuments({ foodItem: foodItemId, isApproved: true }),
  ]);
  const stats = await Review.aggregate([
    { $match: { foodItem: require('mongoose').Types.ObjectId.createFromHexString(foodItemId) } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
  ]);
  return { reviews, total, page: Number(page), pages: Math.ceil(total / limit), stats };
};

const markHelpful = async (reviewId, userId) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new ApiError(404, 'Review not found');
  const idx = review.helpful.indexOf(userId);
  if (idx > -1) { review.helpful.splice(idx, 1); review.helpfulCount = Math.max(0, review.helpfulCount - 1); }
  else { review.helpful.push(userId); review.helpfulCount += 1; }
  return review.save();
};

const deleteReview = async (reviewId, userId, role) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new ApiError(404, 'Review not found');
  if (role !== 'admin' && review.user.toString() !== userId.toString()) throw new ApiError(403, 'Access denied');
  await review.deleteOne();
};

module.exports = { createReview, getReviews, markHelpful, deleteReview };
