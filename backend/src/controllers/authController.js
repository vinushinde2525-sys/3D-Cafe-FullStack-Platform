const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { setTokenCookies, clearTokenCookies, verifyRefreshToken, generateTokens } = require('../utils/generateTokens');
const authService = require('../services/authService');
const User = require('../models/User');

const register = async (req, res) => {
  const { user, tokens } = await authService.register(req.body);
  setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
  const safe = { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, isVerified: user.isVerified };
  res.status(201).json(new ApiResponse(201, { user: safe, ...tokens }, 'Registration successful'));
};

const login = async (req, res) => {
  const { user, tokens } = await authService.login(req.body);
  setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
  const safe = { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, isVerified: user.isVerified };
  res.json(new ApiResponse(200, { user: safe, ...tokens }, 'Login successful'));
};

const logout = async (req, res) => {
  await authService.logout(req.user._id);
  clearTokenCookies(res);
  res.json(new ApiResponse(200, null, 'Logged out successfully'));
};

const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (!token) throw new ApiError(401, 'Refresh token required');
  const decoded = verifyRefreshToken(token);
  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== token) throw new ApiError(401, 'Invalid refresh token');
  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });
  setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
  res.json(new ApiResponse(200, tokens, 'Tokens refreshed'));
};

const forgotPassword = async (req, res) => {
  await authService.forgotPassword(req.body.email);
  res.json(new ApiResponse(200, null, 'Password reset email sent'));
};

const resetPassword = async (req, res) => {
  const user = await authService.resetPassword(req.params.token, req.body.password);
  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });
  setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
  res.json(new ApiResponse(200, tokens, 'Password reset successful'));
};

const verifyEmail = async (req, res) => {
  await authService.verifyEmail(req.params.token);
  res.json(new ApiResponse(200, null, 'Email verified successfully'));
};

const googleCallback = async (req, res) => {
  const { tokens } = await authService.handleGoogleUser(req.user);
  setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
  res.redirect(`${process.env.FRONTEND_URL}/auth/google/success?token=${tokens.accessToken}`);
};

const getMe = async (req, res) => {
  res.json(new ApiResponse(200, req.user, 'User profile fetched'));
};

module.exports = { register, login, logout, refreshToken, forgotPassword, resetPassword, verifyEmail, googleCallback, getMe };
