const inventoryService = require('../services/inventoryService');
const ApiResponse = require('../utils/ApiResponse');

const getAllInventory = async (req, res) => {
  const items = await inventoryService.getAllInventory(req.query);
  res.json(new ApiResponse(200, items));
};

const createInventoryItem = async (req, res) => {
  const item = await inventoryService.createItem(req.body);
  res.status(201).json(new ApiResponse(201, item, 'Inventory item created'));
};

const updateStock = async (req, res) => {
  const { quantity, type, note } = req.body;
  const item = await inventoryService.updateStock(req.params.id, quantity, type, note, req.user._id);
  res.json(new ApiResponse(200, item, 'Stock updated'));
};

const getLowStockAlerts = async (req, res) => {
  const items = await inventoryService.getLowStockAlerts();
  res.json(new ApiResponse(200, items));
};

const getInventoryReport = async (req, res) => {
  const report = await inventoryService.getReport();
  res.json(new ApiResponse(200, report));
};

module.exports = { getAllInventory, createInventoryItem, updateStock, getLowStockAlerts, getInventoryReport };
