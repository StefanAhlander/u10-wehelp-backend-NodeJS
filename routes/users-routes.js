const express = require('express');
const { check } = require('express-validator');

const usersControllers = require('../controllers/users-controllers');

const router = express.Router();

router.get('/', usersControllers.getUsers);

router.get('/:userId', usersControllers.getUserById);

router.post('/', [
  check('firstName').trim().escape().notEmpty(),
  check('lastName').trim().escape().notEmpty(),
  check('personNumber').trim().escape().notEmpty(),
  check('email').isEmail().normalizeEmail(),
  check('phoneNumber').trim().escape().notEmpty(),
  check('streetAddress_1').trim().escape(),
  check('streetAddress_2').trim().escape(),
  check('postalCode').trim().escape(),
  check('city').trim().escape(),
  check('country').trim().escape(),
  check('about').trim().escape(),
], usersControllers.createUser);

router.patch('/:userId', [
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
], usersControllers.updateUser);

router.delete('/:userId', usersControllers.deleteUser);

module.exports = router;