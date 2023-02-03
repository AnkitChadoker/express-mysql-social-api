const router = require('express').Router();
const authController = require('../controllers/auth-controller');

const validateRequest = require('../middlewares/validation-middleware');
const auth = require('../middlewares/auth-middleware');

const loginValidationRules = require('../rules/auth/login-validation');
const signupValidationRules = require('../rules/auth/signup-validation');
const verifyEmailValidationRules = require('../rules/auth/verify-email-validation');
const resendOtpValidationRules = require('../rules/auth/resend-otp-validation');
const forgotPasswordValidationRules = require('../rules/auth/forgot-password-validation');
const verifyOtpValidationRules = require('../rules/auth/verify-otp-validation');
const resetPasswordValidationRules = require('../rules/auth/reset-password-validation');

router.post('/login', [loginValidationRules, validateRequest], authController.login);
router.post('/signup', [signupValidationRules, validateRequest], authController.signup);
router.post('/verify-email', [verifyEmailValidationRules, validateRequest], authController.verifyEmail);
router.post('/resend-otp', [resendOtpValidationRules, validateRequest], authController.resendOtp);
router.post('/forgot-password', [forgotPasswordValidationRules, validateRequest], authController.forgotPassword);
router.post('/verify-otp', [verifyOtpValidationRules, validateRequest], authController.verifyOtp);
router.post('/reset-password', [resetPasswordValidationRules, validateRequest], authController.resetPassword);
router.post('/logout', [auth], authController.logout);
// router.post('/refresh-token', [auth], authController.refresh);

module.exports = router;