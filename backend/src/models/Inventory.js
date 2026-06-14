const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  ingredient: { type: String, required: true },
  unit: { type: String, required: true, enum: ['kg', 'g', 'liter', 'ml', 'pieces', 'dozen'] },
  currentStock: { type: Number, required: true, min: 0 },
  minimumStock: { type: Number, required: true, min: 0 },
  maximumStock: Number,
  costPerUnit: { type: Number, min: 0 },
  supplier: { name: String, contact: String, email: String },
  lastRestocked: Date,
  category: { type: String, enum: ['produce', 'dairy', 'meat', 'beverages', 'dry_goods', 'spices', 'other'] },
  isLowStock: { type: Boolean, default: false },
  usedInItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' }],
  stockHistory: [{
    quantity: Number,
    type: { type: String, enum: ['restock', 'usage', 'adjustment', 'waste'] },
    note: String,
    date: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }],
}, { timestamps: true });

inventorySchema.pre('save', function(next) {
  this.isLowStock = this.currentStock <= this.minimumStock;
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);
