const express = require('express');
const bodyParser = require('body-parser');

const tasksRoutes = require('./routes/tasks-routes');
const usersRoutes = require('./routes/users-routes');
const authRoutes = require('./routes/auth-routes');
const infoRoutes = require('./routes/info-routes');
const HttpError = require('./models/http-error');

const pkg = require('./package.json');
const baseUri = `/api/${pkg.version}`;

const app = express();

app.use(bodyParser.json());

app.use(`${baseUri}/tasks`, tasksRoutes);
app.use(`${baseUri}/info`, infoRoutes);
app.use(`${baseUri}/users`, usersRoutes);
app.use(`${baseUri}/auth`, authRoutes);

app.use((req, res, next) => {
  throw new HttpError('could not find this route', 404);
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error has occured' });
});

app.listen(5000);