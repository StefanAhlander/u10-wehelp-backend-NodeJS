const express = require('express');
const router = express.Router();
const info = require('../config/api-info.js');

router.get('/', (req, res, next) => {
  res.json(info);
});

module.exports = router;