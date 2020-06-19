require('dotenv').config();
const Superagent = require('superagent');
const mongoose = require('mongoose');
var tcpPortUsed = require('tcp-port-used');

const { boot, shutdown } = require('../app');

const version = require('../package.json').version;
const port = +process.env.APP_PORT + 1;
const baseUri = `http://localhost:${port}/api/${version}`;

let testVariable;

beforeAll((done) => {
  boot(port);
  done();
});

describe('tasks-routes api endpoints', () => {
  test('1 GET /tasks should return a status of 200 and contain a body with a tasks property', (done) => {
    Superagent
      .get(`${baseUri}/tasks`)
      .end((error, response) => {
        expect(error).toEqual(null);
        expect(response.status).toEqual(200);
        expect('tasks' in response.body).toEqual(true);
        done();
      });
  });
  test('2 GET /tasks/:taskId should return a 404 status and contain a body with an message property when taskId is invalid', (done) => {
    Superagent
      .get(`${baseUri}/tasks/t5`)
      .end((error, response) => {
        expect(error).not.toEqual(null);
        done();
      });
  });
  test('3 POST /tasks should return a location header field, a status of 201 and the same body that was sent', (done) => {
    const data = {
      title: 'Help shopping',
      category: 'Shopping',
      description: 'I need help buying groceries from the local ICA',
      owner: mongoose.Types.ObjectId()
    };

    Superagent
      .post(`${baseUri}/tasks`)
      .send(data)
      .end((error, response) => {
        expect(error).toEqual(null);
        expect('location' in response.header).toEqual(true);
        expect(response.status).toEqual(201);
        expect(response.body.task.title).toEqual(data.title);
        testVariable = response.body.task._id;
        done();
      });
  });
  test('4 POST /tasks with invalid data should return a status of 422 and the error should contain a message', (done) => {
    const data = {
      title: '',
      category: 'Shopping',
      description: 'I need help buying groceries from the local ICA',
      owner: ''
    };

    Superagent
      .post(`${baseUri}/tasks`)
      .send(data)
      .end((error, response) => {
        expect(error).not.toEqual(null);
        expect(response.status).toEqual(422);
        expect('message' in error).toEqual(true);
        done();
      });
  });
  test('5 GET /tasks/:taskId (new user) should return a 200 status and contain a body with a user property', (done) => {
    Superagent
      .get(`${baseUri}/tasks/${testVariable}`)
      .end((error, response) => {
        expect(error).toEqual(null);
        expect(response.status).toEqual(200);
        expect('task' in response.body).toEqual(true);
        done();
      });
  });
  test('6 PATCH /tasks/:taskId should return a a status of 201 and the same body that was sent with changed fields', (done) => {
    const data = {
      title: 'Need help Cleaning',
      category: 'Houshold choirs',
      description: 'I need help cleaning my vacation home'
    };

    Superagent
      .patch(`${baseUri}/tasks/${testVariable}`)
      .send(data)
      .end((error, response) => {
        expect(error).toEqual(null);
        expect(response.status).toEqual(200);
        expect(response.body.task.title).toEqual(data.title);
        done();
      });
  });
  test('7 PATCH /tasks/:taskId with invalid data should return a a status of 422 and the error should have a message property', (done) => {
    const data = {
      title: 'Need help Cleaning',
      category: '',
      description: 'I need help cleaning my appartment'
    };

    Superagent
      .patch(`${baseUri}/tasks/${testVariable}`)
      .send(data)
      .end((error, response) => {
        expect(error).not.toEqual(null);
        expect(response.status).toEqual(422);
        expect('message' in error).toEqual(true);
        done();
      });
  });
  test('8 DELETE /tasks/:taskId should return a 200 status and contain a body with a message property', (done) => {
    Superagent
      .delete(`${baseUri}/tasks/${testVariable}`)
      .end((error, response) => {
        expect(error).toEqual(null);
        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual(`deleted task: ${testVariable}`);
        done();
      });
  });
  test('9 GET /tasks/:taskId (deleted user) should return a 404 status and error message', (done) => {
    Superagent
      .get(`${baseUri}/tasks/${testVariable}`)
      .end((error, response) => {
        expect(error).not.toEqual(null);
        expect(response.status).toEqual(404);
        expect('message' in error).toEqual(true);
        done();
      });
  });
  test('10 DELETE /tasks/:taskId for invalid taskId should return a 404 status and contain an error with a message property', (done) => {
    Superagent
      .delete(`${baseUri}/tasks/${testVariable}`)
      .end((error, response) => {
        expect(error).not.toEqual(null);
        expect(response.status).toEqual(404);
        expect("message" in error).toEqual(true);
        done();
      });
  });
});

describe('users-routes api endpoints', () => {
  test('1 GET /users should return a status of 200 and contain a body with a users property', (done) => {
    Superagent
      .get(`${baseUri}/users`)
      .end((error, response) => {
        expect(error).toEqual(null);
        expect(response.status).toEqual(200);
        expect('users' in response.body).toEqual(true);
        done();
      });
  });
  test('2 GET /users/:userId should return a 404 status and contain a body with an message property when userId is valid', (done) => {
    Superagent
      .get(`${baseUri}/users/u5`)
      .end((error, response) => {
        expect(error).not.toEqual(null);
        done();
      });
  });
  test('3 POST /users should return a location header field, a status of 201 and the same body that was sent', (done) => {
    const data = {
      pronoun: "",
      name: "Alex Fredin",
      personNumber: 20080321,
      email: "alex@outlook.com",
      phoneNumber: "0725100580",
      streetAddress_1: "Lapplandsresan 25B",
      streetAddress_2: "",
      postalCode: 75755,
      city: "Uppsala",
      country: "Sweden",
      about: "Good boy"
    };

    Superagent
      .post(`${baseUri}/users`)
      .send(data)
      .end((error, response) => {
        expect(error).toEqual(null);
        expect('location' in response.header).toEqual(true);
        expect(response.status).toEqual(201);
        expect(response.body.user.name).toEqual(data.name);
        testVariable = response.body.user.id;
        done();
      });
  });
  test('4 POST /users for duplicate emails should return a status of 422 and the error should contain a message', (done) => {
    const data = {
      pronoun: "",
      name: "Alex Fredin",
      personNumber: 20080321,
      email: "alex@outlook.com",
      phoneNumber: "0725100580",
      streetAddress_1: "Lapplandsresan 25B",
      streetAddress_2: "",
      postalCode: 75755,
      city: "Uppsala",
      country: "Sweden",
      about: "Good boy"
    };

    Superagent
      .post(`${baseUri}/users`)
      .send(data)
      .end((error, response) => {
        expect(error).not.toEqual(null);
        expect(response.status).toEqual(422);
        expect('message' in error).toEqual(true);
        done();
      });
  });
  test('5 POST /users with invalid data should return a status of 422 and the error should contain a message', (done) => {
    const data = {
      pronoun: "",
      name: "",
      personNumber: 20080321,
      email: "",
      phoneNumber: "0725100580",
      streetAddress_1: "Lapplandsresan 25B",
      streetAddress_2: "",
      postalCode: 75755,
      city: "Uppsala",
      country: "Sweden",
      about: "Good boy"
    };

    Superagent
      .post(`${baseUri}/users`)
      .send(data)
      .end((error, response) => {
        expect(error).not.toEqual(null);
        expect(response.status).toEqual(422);
        expect('message' in error).toEqual(true);
        done();
      });
  });
  test('6 GET /users/:userId (new user) should return a 200 status and contain a body with a user property', (done) => {
    Superagent
      .get(`${baseUri}/users/${testVariable}`)
      .end((error, response) => {
        expect(error).toEqual(null);
        expect(response.status).toEqual(200);
        expect('user' in response.body).toEqual(true);
        done();
      });
  });
  test('7 PATCH /users/:userId should return a a status of 201 and the same body that was sent with changed fields', (done) => {
    const data = {
      pronoun: "",
      name: "Julia Fredin",
      email: "alex@outlook.com",
      phoneNumber: "0725100580",
      streetAddress_1: "Lapplandsresan 25B",
      streetAddress_2: "",
      postalCode: 75755,
      city: "Uppsala",
      country: "Sweden",
      about: "Good boy"
    };

    Superagent
      .patch(`${baseUri}/users/${testVariable}`)
      .send(data)
      .end((error, response) => {
        expect(error).toEqual(null);
        expect(response.status).toEqual(200);
        expect(response.body.user.firstName).toEqual(data.firstName);
        done();
      });
  });
  test('8 PATCH /users/:userId with invalid data should return a a status of 422 and the error should have a message property', (done) => {
    const data = {
      pronoun: "",
      name: "",
      email: "alex@outlook.com",
      phoneNumber: "0725100580",
      streetAddress_1: "Lapplandsresan 25B",
      streetAddress_2: "",
      postalCode: 75755,
      city: "Uppsala",
      country: "Sweden",
      about: "Good boy"
    };

    Superagent
      .patch(`${baseUri}/users/${testVariable}`)
      .send(data)
      .end((error, response) => {
        expect(error).not.toEqual(null);
        expect(response.status).toEqual(422);
        expect('message' in error).toEqual(true);
        done();
      });
  });
  test('9 DELETE /users/:userId should return a 200 status and contain a body with a message property', (done) => {
    Superagent
      .delete(`${baseUri}/users/${testVariable}`)
      .end((error, response) => {
        expect(error).toEqual(null);
        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual(`deleted user: ${testVariable}`);
        done();
      });
  });
  test('10 GET /users/:userId (deleted user) should return a 404 status and error message', (done) => {
    Superagent
      .get(`${baseUri}/users/${testVariable}`)
      .end((error, response) => {
        expect(error).not.toEqual(null);
        expect(response.status).toEqual(404);
        expect('message' in error).toEqual(true);
        done();
      });
  });
  test('11 DELETE /users/:userId for invalid userId should return a 404 status and contain an error with a message property', (done) => {
    Superagent
      .delete(`${baseUri}/users/${testVariable}`)
      .end((error, response) => {
        expect(error).not.toEqual(null);
        expect(response.status).toEqual(404);
        expect("message" in error).toEqual(true);
        done();
      });
  });
});

afterAll(() => {
  shutdown();
});