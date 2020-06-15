const express = require('express');

const usersControllers = require('../controllers/users-controllers');

const router = express.Router();

router.get('/', usersControllers.getUsers);

router.get('/:userId', usersControllers.getUserById);

router.post('/', usersControllers.createUser);

router.patch('/:userId', usersControllers.updateUser);

router.delete('/:userId', usersControllers.deleteUser);

module.exports = router;