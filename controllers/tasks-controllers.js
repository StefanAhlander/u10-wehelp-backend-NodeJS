const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const uuid = require('uuid').v4;

let DUMMY_TASKS = require('../placeholder/DUMMY_TASKS');
const PORT = 5000;

const getTasks = (req, res, next) => {
  res.json({ tasks: DUMMY_TASKS });
};

const getTaskById = (req, res, next) => {
  const taskId = req.params.taskId;
  const task = DUMMY_TASKS.find(task => task.id === taskId);

  if (!task) {
    return next(new HttpError(`could not find a task with taskId: ${taskId}`, 404));
  }

  res.json({ task });
};

const createTask = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const {
    title,
    category,
    description,
    owner
  } = req.body;

  const createdTask = {
    id: uuid(),
    title,
    category,
    description,
    owner,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  DUMMY_TASKS.push(createdTask);

  res
    .set({ 'location': `${req.protocol}://${req.hostname}:${PORT}${req.originalUrl}/${createdTask.id}` })
    .status(201)
    .json({ task: createdTask });
};

const updateTask = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const {
    title,
    category,
    description
  } = req.body;
  const taskId = req.params.taskId;
  const updatedTask = { ...DUMMY_TASKS.find(task => task.id === taskId) };
  const taskIndex = DUMMY_TASKS.findIndex(task => task.id === taskId);

  if (taskIndex === -1) {
    return next(new HttpError(`could not find a user to update with taskId: ${userId}`, 404));
  }

  updatedTask.title = title;
  updatedTask.category = category;
  updatedTask.description = description;

  DUMMY_TASKS[taskIndex] = updatedTask;

  res.json({ task: updatedTask });
};

const deleteTask = (req, res, next) => {
  const taskId = req.params.taskId;

  if (!DUMMY_TASKS.find(task => task.id === taskId)) {
    return next(new HttpError(`Could not find task ${taskId} to delete`, 404));
  }

  DUMMY_TASKS = DUMMY_TASKS.filter(task => task.id !== taskId);

  res.json({ message: `deleted task: ${taskId}` });
};

exports.getTasks = getTasks;
exports.getTaskById = getTaskById;
exports.createTask = createTask;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;