/**
 * Unit tests — no DB, no HTTP.
 * Tests core utilities, middleware logic, and validators in isolation.
 */

// ── ApiError ──────────────────────────────────────────────────────────────────
describe('ApiError', () => {
  const ApiError = require('../utils/ApiError');

  it('sets statusCode, message, and success=false', () => {
    const err = new ApiError(404, 'Not found');
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Not found');
    expect(err.success).toBe(false);
    expect(err).toBeInstanceOf(Error);
  });

  it('stores errors array', () => {
    const errs = [{ msg: 'Email invalid' }];
    const err = new ApiError(400, 'Validation failed', errs);
    expect(err.errors).toEqual(errs);
  });

  it('defaults errors to empty array', () => {
    const err = new ApiError(500, 'Server error');
    expect(err.errors).toEqual([]);
  });
});

// ── ApiResponse ───────────────────────────────────────────────────────────────
describe('ApiResponse', () => {
  const ApiResponse = require('../utils/ApiResponse');

  it('success=true for 2xx status codes', () => {
    const res = new ApiResponse(200, { id: 1 }, 'OK');
    expect(res.success).toBe(true);
    expect(res.statusCode).toBe(200);
    expect(res.data).toEqual({ id: 1 });
    expect(res.message).toBe('OK');
  });

  it('success=false for 4xx status codes', () => {
    const res = new ApiResponse(400, null, 'Bad request');
    expect(res.success).toBe(false);
  });

  it('defaults message to "Success"', () => {
    const res = new ApiResponse(201, {});
    expect(res.message).toBe('Success');
  });
});

// ── errorHandler middleware ───────────────────────────────────────────────────
describe('errorHandler middleware', () => {
  const errorHandler = require('../middleware/errorHandler');

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('uses ApiError statusCode and message', () => {
    const ApiError = require('../utils/ApiError');
    const err = new ApiError(422, 'Unprocessable');
    const res = mockRes();
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Unprocessable' }));
  });

  it('handles Mongoose CastError as 404', () => {
    const err = { name: 'CastError', message: 'bad id' };
    const res = mockRes();
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('handles Mongoose duplicate key (code 11000) as 409', () => {
    const err = { code: 11000, keyValue: { email: 'x@x.com' }, message: 'dup' };
    const res = mockRes();
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('email') }));
  });

  it('handles JWT JsonWebTokenError as 401', () => {
    const err = { name: 'JsonWebTokenError', message: 'invalid' };
    const res = mockRes();
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('handles JWT TokenExpiredError as 401', () => {
    const err = { name: 'TokenExpiredError', message: 'expired' };
    const res = mockRes();
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('defaults to 500 for unknown errors', () => {
    const err = { message: 'Something went wrong' };
    const res = mockRes();
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ── roleMiddleware ────────────────────────────────────────────────────────────
describe('roleMiddleware', () => {
  const { authorize, isAdmin, isStaff, isCustomer } = require('../middleware/roleMiddleware');

  const makeReq = (role) => ({ user: { role } });
  const next = jest.fn();

  beforeEach(() => next.mockClear());

  it('authorize allows a matching role', () => {
    const mw = authorize('admin');
    mw(makeReq('admin'), {}, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('authorize blocks a non-matching role with 403', () => {
    const mw = authorize('admin');
    mw(makeReq('customer'), {}, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });

  it('authorize returns 401 when no user on req', () => {
    const mw = authorize('admin');
    mw({}, {}, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  it('isAdmin allows admin only', () => {
    isAdmin(makeReq('admin'), {}, next);
    expect(next).toHaveBeenCalledWith();
    next.mockClear();
    isAdmin(makeReq('staff'), {}, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });

  it('isStaff allows admin and staff', () => {
    isStaff(makeReq('admin'), {}, next);
    expect(next).toHaveBeenCalledWith();
    next.mockClear();
    isStaff(makeReq('staff'), {}, next);
    expect(next).toHaveBeenCalledWith();
    next.mockClear();
    isStaff(makeReq('customer'), {}, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });

  it('isCustomer allows all valid roles', () => {
    ['admin', 'staff', 'customer'].forEach((role) => {
      next.mockClear();
      isCustomer(makeReq(role), {}, next);
      expect(next).toHaveBeenCalledWith();
    });
  });
});

// ── generateTokens utilities ──────────────────────────────────────────────────
describe('generateTokens utilities', () => {
  const { verifyAccessToken, verifyRefreshToken, setTokenCookies, clearTokenCookies } = require('../utils/generateTokens');
  const jwt = require('jsonwebtoken');

  const mockUser = (role = 'customer') => ({
    _id: 'user123',
    role,
    generateAccessToken() {
      return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    },
    generateRefreshToken() {
      return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    },
  });

  it('verifyAccessToken returns decoded payload for a valid token', () => {
    const token = mockUser().generateAccessToken();
    const decoded = verifyAccessToken(token);
    expect(decoded.id).toBe('user123');
    expect(decoded.role).toBe('customer');
  });

  it('verifyAccessToken throws on invalid token', () => {
    expect(() => verifyAccessToken('bad.token.here')).toThrow();
  });

  it('verifyRefreshToken returns decoded payload for valid token', () => {
    const token = mockUser().generateRefreshToken();
    const decoded = verifyRefreshToken(token);
    expect(decoded.id).toBe('user123');
  });

  it('setTokenCookies calls res.cookie twice', () => {
    const res = { cookie: jest.fn() };
    setTokenCookies(res, 'access123', 'refresh456');
    expect(res.cookie).toHaveBeenCalledTimes(2);
    expect(res.cookie).toHaveBeenCalledWith('accessToken', 'access123', expect.any(Object));
    expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'refresh456', expect.any(Object));
  });

  it('clearTokenCookies sets cookies with maxAge 0', () => {
    const res = { cookie: jest.fn() };
    clearTokenCookies(res);
    expect(res.cookie).toHaveBeenCalledWith('accessToken', '', expect.objectContaining({ maxAge: 0 }));
    expect(res.cookie).toHaveBeenCalledWith('refreshToken', '', expect.objectContaining({ maxAge: 0 }));
  });
});

// ── validateMiddleware — validate() ───────────────────────────────────────────
describe('validateMiddleware — validate()', () => {
  const { validate } = require('../middleware/validateMiddleware');
  const { validationResult } = require('express-validator');

  it('calls next() with no args when there are no validation errors', () => {
    // Simulate a request that already passed all validators
    const req = { body: { email: 'a@b.com', password: '123456' } };
    // Attach an empty errors bag the way express-validator would
    req[Symbol.for('express-validator#contexts')] = [];
    const next = jest.fn();
    validate(req, {}, next);
    expect(next).toHaveBeenCalledWith();
  });
});
