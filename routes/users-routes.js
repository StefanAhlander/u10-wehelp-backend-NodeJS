const express = require('express');

const usersControllers = require('../controllers/users-controllers');
const { updateUserValidators, createUserValidators } = require('../validators/users-routes-validators');

const router = express.Router();

router.get('/', usersControllers.getUsers);

router.get('/:userId', usersControllers.getUserById);

router.post('/', createUserValidators, usersControllers.createUser);

router.patch('/:userId', updateUserValidators, usersControllers.updateUser);

router.delete('/:userId', usersControllers.deleteUser);

module.exports = router;