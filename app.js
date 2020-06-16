// Imports and config
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import routes
const tasksRoutes = require('./routes/tasks-routes');
const usersRoutes = require('./routes/users-routes');
const authRoutes = require('./routes/auth-routes');
const infoRoutes = require('./routes/info-routes');

// Import own modules and classes
const HttpError = require('./models/http-error');

// Set up variables
const pkg = require('./package.json');
const baseUri = `/api/${pkg.version}`;
const DB_URL = process.env.DB_URL
  .replace('<user>', process.env.DB_USER)
  .replace('<password>', process.env.DB_PASS)
  .replace('<dbname>', process.env.DB_NAME);

// Assign express
const app = express();

// Apply middleware
app.use(bodyParser.json());

// Routes
app.use(`${baseUri}/tasks`, tasksRoutes);
app.use(`${baseUri}/info`, infoRoutes);
app.use(`${baseUri}/users`, usersRoutes);
app.use(`${baseUri}/auth`, authRoutes);

app.use((req, res, next) => {
  throw new HttpError('could not find this route', 404);
});

// Implement error handler
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || 'An unknown error has occured' });
});

// Start Mongoose and server
mongoose
  .connect(DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => {
    app.listen(process.env.APP_PORT);
    console.log(`\n<<<###\nConnected to database at: ${new Date()}\n`);
  })
  .catch(error => {
    throw error;
  });
