const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

const Task = require('../models/Task');
let DUMMY_TASKS = require('../placeholder/DUMMY_TASKS');

const getTasks = async (req, res, next) => {
  res.json({ tasks: DUMMY_TASKS });
};

const getTaskById = async (req, res, next) => {
  const taskId = req.params.taskId;
  let task;

  try {
    task = await Task.findById(taskId);
  } catch (error) {
    return next(new HttpError(`Database error searching for task: ${taskId}`), 500);
  }

  if (!task) {
    return next(new HttpError(`could not find a task with taskId: ${taskId}`, 404));
  }

  res.json({ task });
};

const createTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { title, category, description, owner } = req.body;

  const newTask = new Task({ title, category, description, owner });

  try {
    newTask.save();
  } catch (error) {
    return next(new HttpError('Error saving new task', 500));
  }

  res
    .set({ 'location': `${req.protocol}://${req.hostname}:${process.env.APP_PORT}${req.originalUrl}/${newTask.id}` })
    .status(201)
    .json({ task: newTask.toJSON() });
};

const updateTask = async (req, res, next) => {
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
    return next(new HttpError(`could not find a user to update with taskId: ${taskId}`, 404));
  }

  updatedTask.title = title;
  updatedTask.category = category;
  updatedTask.description = description;

  DUMMY_TASKS[taskIndex] = updatedTask;

  res.json({ task: updatedTask });
};

const deleteTask = async (req, res, next) => {
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