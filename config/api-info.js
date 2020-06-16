const version = require('../package.json').version;

module.exports = {
  "baseUri": `/api/${version}`,
  "get <baseUri>/info": "get info about api endpoints",

  "get <baseUri>/users": "get all users",
  "get <baseUri>/users/:id": "get user by id",
  "post <baseUri>/users": "create new user",
  "put <baseUri>/users/:id": "update user",
  "delete <baseUri>/users/:id": "delete user",

  "get <baseUri>/tasks": "get all tasks",
  "get <baseUri>/tasks/:id": "get task by id",
  "post <baseUri>/tasks": "create new task",
  "put <baseUri>/tasks/:id": "update task",
  "delete <baseUri>/tasks/:id": "delete task",

  "get <baseUri>/tasks/user/:id/owner": "get all tasks that a user has created",
  "get <baseUri>/tasks/user/:id/performer": "get all tasks that a user has accepted to do",
  "get <baseUri>/tasks/user/:id/finished": "get all tasks that a user has done",

  "get <baseUri>/auth/login": "get login page",
  "get <baseUri>/auth/logout": "log out user",
  "get <baseUri>/auth/google": "endpoint for using Google OAuth 2.0",
  "get <baseUri>/auth/google/redirect": "redirect for Google OAuth 2.0"
};