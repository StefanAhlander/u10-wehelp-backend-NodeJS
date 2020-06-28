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

  /* Extract properties from the req.body and assign to an object.
   * 
   * JSON.stringify only the properties provided in the second argument [array]. 
   * JSON.parse string back to an object. 
   */
  const passedTaskInfo = JSON.parse(JSON.stringify(
    req.body,
    ['title', 'category', 'description']
  ));

  passedTaskInfo.owner = req.userData.userId;

  const newTask = new Task(passedTaskInfo);

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

  const updatedInfo = JSON.parse(JSON.stringify(
    req.body,
    ['title', 'category', 'description', 'settled']
  ));
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

  if (task.owner.toString() !== req.userData.userId) {
    return next(new HttpError(`You are not allowed to update this task`, 401));
  }

  task = Object.assign(task, updatedInfo);

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

  if (task.owner.toString() !== req.userData.userId) {
    return next(new HttpError(`You are not allowed to delete this task`, 401));
  }

  try {
    await task.remove();
  } catch (error) {
    return next(new HttpError(`Database error deleting task: ${taskId}, ${error.message}`, 500));
  }

  res.json({ message: `deleted task: ${taskId}` });
};


const getTasksByOwner = async (req, res, next) => {
  const userId = req.params.userId;
  let tasks;

  try {
    tasks = await Task.find({ owner: userId });
  } catch (error) {
    return next(new HttpError(`Database error searching for tasks owned by: ${userId}, ${error.message}`), 500);
  }

  if (!tasks) {
    return next(new HttpError(`Could not find any tasks owned by user: ${userId}`, 404));
  }

  res.json({ tasks: tasks.map(task => task.toObject({ getters: true })) });
};

const getTasksByPerformer = async (req, res, next) => {
  const userId = req.params.userId;
  let tasks;

  try {
    tasks = await Task.find({ selectedPerformer: userId });
  } catch (error) {
    return next(new HttpError(`Database error searching for tasks where: ${userId} is selected as performer, ${error.message}`), 500);
  }

  if (!tasks) {
    return next(new HttpError(`Could not find any tasks to be performed by user: ${userId}`, 404));
  }

  res.json({ tasks: tasks.map(task => task.toObject({ getters: true })) });
};

const getFinishedTasksByOwner = async (req, res, next) => {
  const userId = req.params.userId;
  let tasks;

  try {
    tasks = await Task.find({
      selectedPerformer: userId,
      settled: {
        $lte: new Date()
      }
    });
  } catch (error) {
    return next(new HttpError(`Database error searching for tasks finished by: ${userId}, ${error.message}`), 500);
  }

  if (!tasks) {
    return next(new HttpError(`Could not find any tasks finished by user: ${userId}`, 404));
  }

  res.json({ tasks: tasks.map(task => task.toObject({ getters: true })) });
};


exports.getTasks = getTasks;
exports.getTaskById = getTaskById;
exports.createTask = createTask;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
exports.getTasksByOwner = getTasksByOwner;
exports.getTasksByPerformer = getTasksByPerformer;
exports.getFinishedTasksByOwner = getFinishedTasksByOwner;