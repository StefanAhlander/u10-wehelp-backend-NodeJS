const HttpError = require('../models/http-error');
const { request } = require('express');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw new Error('Authentication failed');
    }
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return next(new HttpError('Authentication failed', 403));
  }
};