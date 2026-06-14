const FoodItem = require('../models/FoodItem');
const ApiError = require('../utils/ApiError');

const buildQuery = ({ category, search, minPrice, maxPrice, isVegetarian, isVegan, isGlutenFree, isAvailable, isFeatured, tags }) => {
  const query = {};
  if (category) query.category = category;
  if (search) query.$text = { $search: search };
  if (minPrice || maxPrice) query.price = {};
  if (minPrice) query.price.$gte = Number(minPrice);
  if (maxPrice) query.price.$lte = Number(maxPrice);
  if (isVegetarian === 'true') query.isVegetarian = true;
  if (isVegan === 'true') query.isVegan = true;
  if (isGlutenFree === 'true') query.isGlutenFree = true;
  if (isAvailable !== undefined) query.isAvailable = isAvailable !== 'false';
  if (isFeatured === 'true') query.isFeatured = true;
  if (tags) query.tags = { $in: tags.split(',') };
  return query;
};

const getAllFood = async (filters, page = 1, limit = 12, sort = '-createdAt') => {
  const query = buildQuery(filters);
  const skip = (page - 1) * limit;
  const sortMap = { price_asc: 'price', price_desc: '-price', rating: '-rating', popular: '-orderCount', newest: '-createdAt' };
  const sortStr = sortMap[sort] || sort;
  const [items, total] = await Promise.all([
    FoodItem.find(query).sort(sortStr).skip(skip).limit(Number(limit)),
    FoodItem.countDocuments(query),
  ]);
  return { items, total, page: Number(page), pages: Math.ceil(total / limit) };
};

const getFoodById = async (id) => {
  const item = await FoodItem.findById(id);
  if (!item) throw new ApiError(404, 'Food item not found');
  return item;
};

const createFood = async (data, images) => {
  const imageData = images?.map((img) => ({ url: img.path, publicId: img.filename })) || [];
  return FoodItem.create({ ...data, images: imageData });
};

const updateFood = async (id, data, images) => {
  const item = await FoodItem.findById(id);
  if (!item) throw new ApiError(404, 'Food item not found');
  if (images?.length) {
    const newImages = images.map((img) => ({ url: img.path, publicId: img.filename }));
    data.images = [...(item.images || []), ...newImages];
  }
  return FoodItem.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const deleteFood = async (id) => {
  const item = await FoodItem.findByIdAndDelete(id);
  if (!item) throw new ApiError(404, 'Food item not found');
  return item;
};

const getFeatured = () => FoodItem.find({ isFeatured: true, isAvailable: true }).limit(8);
const getCategories = () => FoodItem.distinct('category');
const getTopRated = () => FoodItem.find({ isAvailable: true, rating: { $gte: 4 } }).sort('-rating').limit(6);
const getSpecials = () => FoodItem.find({ isSpecial: true, isAvailable: true }).limit(6);

module.exports = { getAllFood, getFoodById, createFood, updateFood, deleteFood, getFeatured, getCategories, getTopRated, getSpecials };
