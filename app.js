const express = require('express');
const bodyParser = require('body-parser');

const tasksRoutes = require('./routes/tasks-routes');
const usersRoutes = require('./routes/users-routes');
const authRoutes = require('./routes/auth-routes');
const infoRoutes = require('./routes/info-routes');

const pkg = require('./package.json');
const baseUri = `/api/${pkg.version}`;

const app = express();

app.use(`${baseUri}/tasks`, tasksRoutes);
app.use(`${baseUri}/info`, infoRoutes);
app.use(`${baseUri}/users`, usersRoutes);

app.listen(5000);