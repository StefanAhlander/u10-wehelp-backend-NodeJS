const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

const Task = require('../models/Task');

const getTasks = async (req, res, next) => {
  let tasks;

  try {
    tasks = await Task.find();
  } catch (error) {
    return next(new HttpError(`Database error searching for tasks, ${error.message}`), 500);
  }
  res.json({ tasks: tasks.map(task => task.toObject({ getters: true })) });
};

const getTaskById = async (req, res, next) => {
  const taskId = req.params.taskId;
  let task;

  try {
    task = await Task.findById(taskId);
  } catch (error) {
    return next(new HttpError(`Database error searching for task: ${taskId}, ${error.message}`), 500);
  }

  if (!task) {
    return next(new HttpError(`Could not find a task with taskId: ${taskId}`, 404));
  }

  res.json({ task: task.toObject({ getters: true }) });
};

const createTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { title, category, description, owner } = req.body;

  const newTask = new Task({ title, category, description, owner });

  try {
    await newTask.save();
  } catch (error) {
    return next(new HttpError(`Error saving new task, ${error.message}`, 500));
  }

  res
    .set({ 'location': `${req.protocol}://${req.hostname}:${process.env.APP_PORT}${req.originalUrl}/${newTask.id}` })
    .status(201)
    .json({ task: newTask.toObject({ getters: true }) });
};

const updateTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { title, category, description } = req.body;
  const taskId = req.params.taskId;
  let task;

  try {
    task = await Task.findById(taskId);
  } catch (error) {
    return next(new HttpError(`Database error finding task: ${taskId} to update, ${error.message}`), 500);
  }

  if (!task) {
    return next(new HttpError(`Could not find a task with taskId: ${taskId} to update`, 404));
  }

  task.title = title;
  task.category = category;
  task.description = description;

  try {
    await task.save();
  } catch (error) {
    return next(new HttpError(`Database error updating task: ${taskId}, ${error.message}`, 500));
  }

  res.json({ task: task.toObject({ getters: true }) });
};

const deleteTask = async (req, res, next) => {
  const taskId = req.params.taskId;
  let task;

  try {
    task = await Task.findById(taskId);
  } catch (error) {
    return next(new HttpError(`Database error finding task: ${taskId} to delete, ${error.message}`), 500);
  }

  if (!task) {
    return next(new HttpError(`Could not find a task with taskId: ${taskId} to delete`, 404));
  }

  try {
    await task.remove();
  } catch (error) {
    return next(new HttpError(`Database error deleting task: ${taskId}, ${error.message}`, 500));
  }

  res.json({ message: `deleted task: ${taskId}` });
};

exports.getTasks = getTasks;
exports.getTaskById = getTaskById;
exports.createTask = createTask;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;