const express = require('express');

const tasksControllers = require('../controllers/tasks-controllers');
const { updateTaskValidators, createTaskValidators } = require('../validators/tasks-routes-validators');

const router = express.Router();

router.get('/', tasksControllers.getTasks);

router.get('/:taskId', tasksControllers.getTaskById);

router.post('/', createTaskValidators, tasksControllers.createTask);

router.patch('/:taskId', updateTaskValidators, tasksControllers.updateTask);

router.delete('/:taskId', tasksControllers.deleteTask);

module.exports = router;