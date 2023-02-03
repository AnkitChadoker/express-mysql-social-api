const { check } = require('express-validator');
const connection = require('../../connection');

const rules = [
  // password validation
  check('new_password').trim().notEmpty().withMessage('new password is required.')
  .isLength({ min: 5 }).withMessage('password must be minimum of 5 characters.')
  .matches(/(?=.*?[A-Z])/).withMessage('password must contain at least one uppercase.')
  .matches(/(?=.*?[a-z])/).withMessage('password must contain at least one lowercase.')
  .matches(/(?=.*?[0-9])/).withMessage('password must contain at least one number.')
  .matches(/(?=.*?[#?!@$%^&*-])/).withMessage('password must contain at least one special character.')
  .not().matches(/^$|\s+/).withMessage('white spaces are not allowed'),

  // confirm password validation
  check('confirm_password').custom((value, { req }) => {
       if (value !== req.body.new_password) {
             throw new Error('password confirmation does not match the new password.');
        }
        return true;
   })
];

module.exports = rules;