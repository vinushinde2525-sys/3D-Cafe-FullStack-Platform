const foodService = require('../services/foodService');
const ApiResponse = require('../utils/ApiResponse');

const getAllFood = async (req, res) => {
  const { page, limit, sort, category, search, minPrice, maxPrice, isVegetarian, isVegan, isGlutenFree, isAvailable, isFeatured, tags } = req.query;
  const data = await foodService.getAllFood({ category, search, minPrice, maxPrice, isVegetarian, isVegan, isGlutenFree, isAvailable, isFeatured, tags }, page, limit, sort);
  res.json(new ApiResponse(200, data));
};

const getFoodById = async (req, res) => {
  const item = await foodService.getFoodById(req.params.id);
  res.json(new ApiResponse(200, item));
};

const createFood = async (req, res) => {
  const item = await foodService.createFood(req.body, req.files);
  res.status(201).json(new ApiResponse(201, item, 'Food item created'));
};

const updateFood = async (req, res) => {
  const item = await foodService.updateFood(req.params.id, req.body, req.files);
  res.json(new ApiResponse(200, item, 'Food item updated'));
};

const deleteFood = async (req, res) => {
  await foodService.deleteFood(req.params.id);
  res.json(new ApiResponse(200, null, 'Food item deleted'));
};

const getFeatured = async (req, res) => {
  const items = await foodService.getFeatured();
  res.json(new ApiResponse(200, items));
};

const getCategories = async (req, res) => {
  const cats = await foodService.getCategories();
  res.json(new ApiResponse(200, cats));
};

const getTopRated = async (req, res) => {
  const items = await foodService.getTopRated();
  res.json(new ApiResponse(200, items));
};

const getSpecials = async (req, res) => {
  const items = await foodService.getSpecials();
  res.json(new ApiResponse(200, items));
};

module.exports = { getAllFood, getFoodById, createFood, updateFood, deleteFood, getFeatured, getCategories, getTopRated, getSpecials };
