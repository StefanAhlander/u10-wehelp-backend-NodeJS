const express = require('express');
const DUMMY_TASKS = require('../placeholder/DUMMY_TASKS');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({ tasks: DUMMY_TASKS });
});

router.get('/:taskId', (req, res, next) => {
  const taskId = req.params.taskId;
  const task = DUMMY_TASKS.find(task => task._id === taskId);
  res.json({ task });
});

module.exports = router;