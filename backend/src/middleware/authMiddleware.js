const ApiError = require('../utils/ApiError');
const { verifyAccessToken, verifyRefreshToken, generateTokens, setTokenCookies } = require('../utils/generateTokens');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.accessToken;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) throw new ApiError(401, 'Authentication required');

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      // Try refresh token rotation
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) throw new ApiError(401, 'Session expired, please login again');
      const refreshDecoded = verifyRefreshToken(refreshToken);
      const user = await User.findById(refreshDecoded.id);
      if (!user || user.refreshToken !== refreshToken) throw new ApiError(401, 'Invalid session');
      const tokens = generateTokens(user);
      user.refreshToken = tokens.refreshToken;
      await user.save({ validateBeforeSave: false });
      setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
      decoded = { id: user._id, role: user.role };
    }

    const user = await User.findById(decoded.id).select('-password -refreshToken');
    if (!user) throw new ApiError(401, 'User not found');
    if (user.isBlocked) throw new ApiError(403, 'Your account has been suspended');
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.accessToken;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = verifyAccessToken(token);
      req.user = await User.findById(decoded.id).select('-password -refreshToken');
    }
    next();
  } catch {
    next();
  }
};

module.exports = { protect, optionalAuth };
