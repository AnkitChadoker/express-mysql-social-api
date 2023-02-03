const { check } = require('express-validator');

const rules = [
  check('otp').trim().notEmpty().withMessage('OTP is required.')
];

module.exports = rules;