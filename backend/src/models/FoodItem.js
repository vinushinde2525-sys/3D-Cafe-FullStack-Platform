const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  fiber: Number,
}, { _id: false });

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 2000 },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  category: {
    type: String,
    required: true,
    enum: ['Coffee', 'Tea', 'Burgers', 'Pizza', 'Sandwiches', 'Desserts', 'Beverages', 'Breakfast', 'Pasta', 'Salads'],
  },
  images: [{ url: String, publicId: String }],
  model3dUrl: { type: String, default: '' },
  ingredients: [String],
  allergens: [String],
  nutrition: nutritionSchema,
  isVegetarian: { type: Boolean, default: false },
  isVegan: { type: Boolean, default: false },
  isGlutenFree: { type: Boolean, default: false },
  isSpicy: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isSpecial: { type: Boolean, default: false },
  preparationTime: { type: Number, default: 15 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  orderCount: { type: Number, default: 0 },
  stock: { type: Number, default: 100 },
  tags: [String],
  customizations: [{
    name: String,
    options: [{ label: String, extraPrice: { type: Number, default: 0 } }],
  }],
}, { timestamps: true });

foodItemSchema.index({ category: 1 });
foodItemSchema.index({ name: 'text', description: 'text', tags: 'text' });
foodItemSchema.index({ rating: -1 });
foodItemSchema.index({ price: 1 });
foodItemSchema.index({ isFeatured: 1 });
foodItemSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('FoodItem', foodItemSchema);
