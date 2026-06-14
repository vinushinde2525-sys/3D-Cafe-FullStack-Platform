const reviewService = require('../services/reviewService');
const ApiResponse = require('../utils/ApiResponse');

const createReview = async (req, res) => {
  const review = await reviewService.createReview(req.user._id, req.params.foodId, req.body);
  res.status(201).json(new ApiResponse(201, review, 'Review posted'));
};

const getReviews = async (req, res) => {
  const data = await reviewService.getReviews(req.params.foodId, req.query.page, req.query.limit);
  res.json(new ApiResponse(200, data));
};

const markHelpful = async (req, res) => {
  const review = await reviewService.markHelpful(req.params.id, req.user._id);
  res.json(new ApiResponse(200, review));
};

const deleteReview = async (req, res) => {
  await reviewService.deleteReview(req.params.id, req.user._id, req.user.role);
  res.json(new ApiResponse(200, null, 'Review deleted'));
};

module.exports = { createReview, getReviews, markHelpful, deleteReview };
