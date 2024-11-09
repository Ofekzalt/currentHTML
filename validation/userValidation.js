// validation/userValidation.js

const { body } = require('express-validator');

exports.updateUserValidation = [
  body('email').optional().isEmail().withMessage('Please include a valid email'),
  body('isAdmin').optional().isBoolean().withMessage('isAdmin must be a boolean'),
];
