const ApiError = require('../utils/ApiError');

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return next(new ApiError(401, 'Authentication required'));
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, `Role '${req.user.role}' is not authorized for this action`));
  }
  next();
};

const isAdmin = authorize('admin');
const isStaff = authorize('admin', 'staff');
const isCustomer = authorize('admin', 'staff', 'customer');

module.exports = { authorize, isAdmin, isStaff, isCustomer };
