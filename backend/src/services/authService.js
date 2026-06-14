const crypto = require('crypto');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { generateTokens } = require('../utils/generateTokens');
const { sendEmail } = require('../utils/sendEmail');

const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already registered');
  const user = await User.create({ name, email, password });
  const emailToken = user.generateEmailToken();
  await user.save({ validateBeforeSave: false });
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${emailToken}`;
  try {
    await sendEmail({ to: email, templateName: 'verifyEmail', templateData: { name, url: verifyUrl } });
  } catch (_) {}
  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });
  return { user, tokens };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) throw new ApiError(401, 'Invalid email or password');
  if (user.isBlocked) throw new ApiError(403, 'Account suspended');
  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });
  return { user, tokens };
};

const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'No account with that email');
  const token = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  await sendEmail({ to: email, templateName: 'resetPassword', templateData: { name: user.name, url: resetUrl } });
};

const resetPassword = async (token, password) => {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ resetPasswordToken: hashed, resetPasswordExpire: { $gt: Date.now() } });
  if (!user) throw new ApiError(400, 'Invalid or expired reset token');
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  return user;
};

const verifyEmail = async (token) => {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ emailVerificationToken: hashed, emailVerificationExpire: { $gt: Date.now() } });
  if (!user) throw new ApiError(400, 'Invalid or expired verification token');
  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save();
  return user;
};

const handleGoogleUser = async (googleUser) => {
  const tokens = generateTokens(googleUser);
  googleUser.refreshToken = tokens.refreshToken;
  googleUser.lastLogin = Date.now();
  await googleUser.save({ validateBeforeSave: false });
  return { user: googleUser, tokens };
};

module.exports = { register, login, logout, forgotPassword, resetPassword, verifyEmail, handleGoogleUser };
