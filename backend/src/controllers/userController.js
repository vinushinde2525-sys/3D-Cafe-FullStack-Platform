const User = require('../models/User');
const Order = require('../models/Order');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const cloudinary = require('../config/cloudinary');

const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -refreshToken -resetPasswordToken -emailVerificationToken');
  res.json(new ApiResponse(200, user));
};

const updateProfile = async (req, res) => {
  const allowed = ['name', 'phone'];
  const updates = {};
  allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
  if (req.file) {
    if (req.user.avatarPublicId) await cloudinary.uploader.destroy(req.user.avatarPublicId).catch(() => {});
    updates.avatar = req.file.path;
    updates.avatarPublicId = req.file.filename;
  }
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password -refreshToken');
  res.json(new ApiResponse(200, user, 'Profile updated'));
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) throw new ApiError(401, 'Current password is incorrect');
  user.password = newPassword;
  await user.save();
  res.json(new ApiResponse(200, null, 'Password changed successfully'));
};

const addAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) user.addresses.forEach((a) => (a.isDefault = false));
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json(new ApiResponse(201, user.addresses, 'Address added'));
};

const updateAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) throw new ApiError(404, 'Address not found');
  if (req.body.isDefault) user.addresses.forEach((a) => (a.isDefault = false));
  Object.assign(address, req.body);
  await user.save();
  res.json(new ApiResponse(200, user.addresses, 'Address updated'));
};

const deleteAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId);
  await user.save();
  res.json(new ApiResponse(200, user.addresses, 'Address deleted'));
};

// Admin controllers
const getAllUsers = async (req, res) => {
  const { page = 1, limit = 20, role, search, isBlocked } = req.query;
  const query = {};
  if (role) query.role = role;
  if (isBlocked !== undefined) query.isBlocked = isBlocked === 'true';
  if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(query).select('-password -refreshToken').sort('-createdAt').skip(skip).limit(Number(limit)),
    User.countDocuments(query),
  ]);
  res.json(new ApiResponse(200, { users, total, page: Number(page), pages: Math.ceil(total / limit) }));
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -refreshToken');
  if (!user) throw new ApiError(404, 'User not found');
  const orderStats = await Order.aggregate([
    { $match: { user: user._id } },
    { $group: { _id: null, totalOrders: { $sum: 1 }, totalSpent: { $sum: '$total' } } },
  ]);
  res.json(new ApiResponse(200, { user, stats: orderStats[0] || { totalOrders: 0, totalSpent: 0 } }));
};

const toggleBlockUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.role === 'admin') throw new ApiError(403, 'Cannot block an admin');
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.json(new ApiResponse(200, { isBlocked: user.isBlocked }, `User ${user.isBlocked ? 'blocked' : 'unblocked'}`));
};

const updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!['customer', 'staff', 'admin'].includes(role)) throw new ApiError(400, 'Invalid role');
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password -refreshToken');
  if (!user) throw new ApiError(404, 'User not found');
  res.json(new ApiResponse(200, user, 'User role updated'));
};

module.exports = { getProfile, updateProfile, changePassword, addAddress, updateAddress, deleteAddress, getAllUsers, getUserById, toggleBlockUser, updateUserRole };
