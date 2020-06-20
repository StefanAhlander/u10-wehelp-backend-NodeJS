const version = require('../package.json').version;

module.exports = {
  "baseUri": `/api/${version}`,
  "get <baseUri>/info": "get info about api endpoints",

  "get <baseUri>/users": "get all users",
  "get <baseUri>/users/:id": "get user by id",
  "post <baseUri>/users": "create new user",
  "patch <baseUri>/users/:id": "update user, authentication and authorization required",
  "delete <baseUri>/users/:id": "delete user, authentication and authorization required",

  "post <baseUri>/users/login": "login user",

  "get <baseUri>/tasks": "get all tasks",
  "get <baseUri>/tasks/:id": "get task by id",
  "post <baseUri>/tasks": "create new task, authentication and authorization required",
  "patch <baseUri>/tasks/:id": "update task, authentication and authorization required",
  "delete <baseUri>/tasks/:id": "delete task, authentication and authorization required",

  "get <baseUri>/tasks/user/:id/owner": "get all tasks that a user has created",
  "get <baseUri>/tasks/user/:id/performer": "get all tasks that a user has accepted to do",
  "get <baseUri>/tasks/user/:id/finished": "get all tasks that a user has finished"
};