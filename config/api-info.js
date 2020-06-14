const version = require('../package.json').version;

module.exports = {
  "baseUri": `/api/${version}`,
  "get <baseUri>/info": "get info about api endpoints",
  "get <baseUri>/users": "get all users",
  "post <baseUri>/users": "create new user",
  "get <baseUri>/users /:id": "get user by id",
  "put <baseUri>/users /:id": "update user",
  "delete <baseUri>/users/:id": "delete user",
  "get <baseUri>/users/:id/tasks/owner": "get all tasks that a user has created",
  "get <baseUri>/users/:id/tasks/performer": "get all tasks that a user has accepted to do",
  "get <baseUri>/users/:id/tasks/finished": "get all tasks that a user has done",

  "get <baseUri>/tasks": "get all tasks",
  "post <baseUri>/tasks": "create new task",
  "get <baseUri>/tasks/:id": "get task by id",
  "put <baseUri>/tasks/:id": "update task",
  "delete <baseUri>/tasks/:id": "delete task",

  "get <baseUri>/auth/login": "get login page",
  "get <baseUri>/auth/logout": "log out user",
  "get <baseUri>/auth/google": "endpoint for using Google OAuth 2.0",
  "get <baseUri>/auth/google/redirect": "redirect for Google OAuth 2.0"
};