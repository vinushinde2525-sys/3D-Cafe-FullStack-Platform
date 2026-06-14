const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, maxlength: 200 },
  comment: { type: String, maxlength: 2000 },
  images: [{ url: String, publicId: String }],
  isVerifiedPurchase: { type: Boolean, default: false },
  helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  helpfulCount: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: true },
  adminReply: { body: String, date: Date },
}, { timestamps: true });

reviewSchema.index({ foodItem: 1, user: 1 }, { unique: true });
reviewSchema.index({ foodItem: 1, rating: -1 });

// Update food item rating after save
reviewSchema.post('save', async function() {
  const FoodItem = mongoose.model('FoodItem');
  const stats = await mongoose.model('Review').aggregate([
    { $match: { foodItem: this.foodItem } },
    { $group: { _id: '$foodItem', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await FoodItem.findByIdAndUpdate(this.foodItem, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
