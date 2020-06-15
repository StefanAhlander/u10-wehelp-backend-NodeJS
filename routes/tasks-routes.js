const express = require('express');

const tasksControllers = require('../controllers/tasks-controllers');

const router = express.Router();

router.get('/', tasksControllers.getTasks);

router.get('/:taskId', tasksControllers.getTaskById);

module.exports = router;