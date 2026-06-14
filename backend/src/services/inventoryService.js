const Inventory = require('../models/Inventory');
const ApiError = require('../utils/ApiError');

const getAllInventory = (filters = {}) => {
  const query = {};
  if (filters.lowStock === 'true') query.isLowStock = true;
  if (filters.category) query.category = filters.category;
  return Inventory.find(query).sort('ingredient');
};

const createItem = (data) => Inventory.create(data);

const updateStock = async (id, quantity, type, note, userId) => {
  const item = await Inventory.findById(id);
  if (!item) throw new ApiError(404, 'Inventory item not found');
  if (type === 'usage' && item.currentStock < quantity) throw new ApiError(400, 'Insufficient stock');
  item.currentStock = type === 'restock' || type === 'adjustment' ? quantity : item.currentStock - quantity;
  item.stockHistory.push({ quantity, type, note, updatedBy: userId });
  if (type === 'restock') item.lastRestocked = new Date();
  return item.save();
};

const getLowStockAlerts = () => Inventory.find({ isLowStock: true }).select('ingredient currentStock minimumStock unit supplier');
const getReport = () => Inventory.aggregate([
  { $group: { _id: '$category', totalItems: { $sum: 1 }, lowStockItems: { $sum: { $cond: ['$isLowStock', 1, 0] } }, totalValue: { $sum: { $multiply: ['$currentStock', '$costPerUnit'] } } } },
]);

module.exports = { getAllInventory, createItem, updateStock, getLowStockAlerts, getReport };
