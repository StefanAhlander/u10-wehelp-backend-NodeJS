const express = require('express');

const tasksControllers = require('../controllers/tasks-controllers');
const { updateTaskValidators, createTaskValidators } = require('../validators/tasks-routes-validators');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/', tasksControllers.getTasks);

router.get('/:taskId', tasksControllers.getTaskById);

router.get('/user/:userId/owner', tasksControllers.getTasksByOwner);

router.get('/user/:userId/performer', tasksControllers.getTasksByPerformer);

router.get('/user/:userId/finished', tasksControllers.getFinishedTasksByOwner);

router.use(checkAuth);

router.post('/', createTaskValidators, tasksControllers.createTask);

router.patch('/:taskId', updateTaskValidators, tasksControllers.updateTask);

router.delete('/:taskId', tasksControllers.deleteTask);

module.exports = router;