const HttpError = require('../models/http-error');

const DUMMY_TASKS = require('../placeholder/DUMMY_TASKS');

const getTasks = (req, res, next) => {
  res.json({ tasks: DUMMY_TASKS });
};

const getTaskById = (req, res, next) => {
  const taskId = req.params.taskId;
  const task = DUMMY_TASKS.find(task => task._id === taskId);

  if (!task) {
    return next(new HttpError('could not find a task for the provided id', 404));
  }

  res.json({ task });
};

exports.getTasks = getTasks;
exports.getTaskById = getTaskById;