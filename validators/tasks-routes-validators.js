const { check } = require('express-validator');

const updateTaskValidators = [
  check('title').trim().escape().notEmpty(),
  check('category').trim().escape().notEmpty(),
  check('description').trim().escape().isLength({ min: 5 })
];

const createTaskValidators = [
  ...updateTaskValidators,
  check('owner').trim().escape().notEmpty()
];

module.exports = {
  updateTaskValidators,
  createTaskValidators
};