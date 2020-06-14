const express = require('express');

const router = express.Router();

const DUMMY_USERS = require('../placeholder/DUMMY_USERS');

router.get('/', (req, res, next) => {
  res.json({ users: DUMMY_USERS });
});

router.get('/:userId', (req, res, next) => {
  const userId = req.params.userId;
  const user = DUMMY_USERS.find(user => user._id === userId);
  res.json({ user });
}
);

module.exports = router;