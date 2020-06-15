const { check } = require('express-validator');

const updateUserValidators = [
  check('firstName').trim().escape().notEmpty(),
  check('lastName').trim().escape().notEmpty(),
  check('email').isEmail().normalizeEmail(),
  check('phoneNumber').trim().escape().notEmpty(),
  check('streetAddress_1').trim().escape(),
  check('streetAddress_2').trim().escape(),
  check('postalCode').trim().escape(),
  check('city').trim().escape(),
  check('country').trim().escape(),
  check('about').trim().escape(),
];

const createUserValidators = [...updateUserValidators, check('personNumber').trim().escape().notEmpty(),
];

module.exports = {
  updateUserValidators,
  createUserValidators
};