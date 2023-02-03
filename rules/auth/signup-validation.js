const { check } = require('express-validator');
const connection = require('../../connection');

const rules = [
  // first Name validation
  check('first_name').trim().notEmpty().withMessage('first name is required.')
  .matches(/^[a-zA-Z ]*$/).withMessage('Only Characters with white space are allowed'),

 // last Name validation
  check('last_name').notEmpty().withMessage('last name is required.')
  .matches(/^[a-zA-Z ]*$/).withMessage('Only Characters with white space are allowed.'),

  // email address validation
  check('email').notEmpty().withMessage('email address is required.').normalizeEmail().isEmail().withMessage('it must be a valid email address.')
  .custom( (value) => {
    return new Promise((resolve, reject) => {
      connection.query('select id from users where email = ?', [value], function (err, results) {
           if (err)
              reject(new Error('something went wrong at our end, please try again after sometime.'))
           if (results.length>0)
              reject(new Error('email address has already been taken please use another email address.'))
           resolve()
        })
     })
  }),

  // Username validation
  check('username').notEmpty().withMessage('username is required.')
  .not().matches(/^$|\s+/).withMessage('white spaces are not allowed')
  .custom( (value) => {
    return new Promise((resolve, reject) => {
      connection.query('select id from users where username = ?', [value], function (err, results) {
           if (err)
              reject(new Error('something went wrong at our end, please try again after sometime.'))
           if (results.length>0)
              reject(new Error('username has already been taken please create another username.'))
           resolve()
        })
     })
  }),

  // password validation
  check('password').trim().notEmpty().withMessage('password is required.')
  .isLength({ min: 5 }).withMessage('password must be minimum of 5 characters.')
  .matches(/(?=.*?[A-Z])/).withMessage('password must contain at least one uppercase.')
  .matches(/(?=.*?[a-z])/).withMessage('password must contain at least one lowercase.')
  .matches(/(?=.*?[0-9])/).withMessage('password must contain at least one number.')
  .matches(/(?=.*?[#?!@$%^&*-])/).withMessage('password must contain at least one special character.')
  .not().matches(/^$|\s+/).withMessage('white spaces are not allowed'),

  // confirm password validation
  check('confirm_password').custom((value, { req }) => {
       if (value !== req.body.password) {
             throw new Error('password confirmation does not match the password.');
        }
        return true;
   })
];

module.exports = rules;