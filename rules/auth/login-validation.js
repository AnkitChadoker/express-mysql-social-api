const { check } = require('express-validator');

const rules = [
  check('email').notEmpty().withMessage('email address is required.').normalizeEmail().isEmail().withMessage('it must be a valid email address.'),

  check('password').trim().notEmpty().withMessage('password is required.')
];

module.exports = rules;