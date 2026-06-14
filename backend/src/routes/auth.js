const router = require('express').Router();
const passport = require('passport');
const ctrl = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate, validators } = require('../middleware/validateMiddleware');

router.post('/register', validators.register, validate, ctrl.register);
router.post('/login', validators.login, validate, ctrl.login);
router.post('/logout', protect, ctrl.logout);
router.post('/refresh-token', ctrl.refreshToken);
router.post('/forgot-password', validators.forgotPassword, validate, ctrl.forgotPassword);
router.post('/reset-password/:token', validators.resetPassword, validate, ctrl.resetPassword);
router.get('/verify-email/:token', ctrl.verifyEmail);
router.get('/me', protect, ctrl.getMe);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed` }), ctrl.googleCallback);

module.exports = router;
