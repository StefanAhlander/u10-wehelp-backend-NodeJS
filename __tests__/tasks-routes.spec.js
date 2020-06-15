const Superagent = require('superagent');

const version = require('../package.json').version;
const baseUri = `http://localhost:5000/api/${version}`;

let testVariable;

describe('tasks-routes api endpoints', () => {
  test('GET /tasks should return a status of 200 and contain a body with a tasks property', (done) => {
    Superagent
      .get(`${baseUri}/tasks`)
      .end((error, response) => {
        expect(error).toEqual(null);
        expect(response.status).toEqual(200);
        expect('tasks' in response.body).toEqual(true);
        done();
      });
  });
  test('GET /tasks/:taskId should return a 200 status and contain a body with a user property when taskId is valid', (done) => {
    Superagent
      .get(`${baseUri}/tasks/t1`)
      .end((error, response) => {
        expect(error).toEqual(null);
        expect(response.status).toEqual(200);
        expect('task' in response.body).toEqual(true);
        done();
      });
  });
  test('GET /tasks/:taskId should return a 404 status and contain a body with an message property when taskId is valid', (done) => {
    Superagent
      .get(`${baseUri}/tasks/t5`)
      .end((error, response) => {
        expect(response.status).toEqual(404);
        expect('message' in error).toEqual(true);
        done();
      });
  });
  test('POST /tasks should return a location header field, a status of 201 and the same body that was sent', (done) => {
    const data = {
      title: 'Help shopping',
      category: 'Shopping',
      description: 'I need help buying groceries from the local ICA',
      owner: 'u2'
    };

    Superagent
      .post(`${baseUri}/tasks`)
      .send(data)
      .end((error, response) => {
        expect(error).toEqual(null);
        expect(response.header.location).toEqual(`${baseUri}/tasks/${response.body.task.id}`);
        expect(response.status).toEqual(201);
        expect(response.body.task.owner).toEqual(data.owner);
        testVariable = response.body.task.id;
        done();
      });
  });
  test('POST /tasks with invalid data should return a status of 422 and the error should contain a message', (done) => {
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
  test('GET /tasks/:taskId (new user) should return a 200 status and contain a body with a user property', (done) => {
    Superagent
      .get(`${baseUri}/tasks/${testVariable}`)
      .end((error, response) => {
        expect(error).toEqual(null);
        expect(response.status).toEqual(200);
        expect('task' in response.body).toEqual(true);
        done();
      });
  });
  test('PATCH /tasks/:taskId should return a a status of 201 and the same body that was sent with changed fields', (done) => {
    const data = {
      title: 'Need help Cleaning',
      category: 'Houshold choirs',
      description: 'I need help cleaning my appartment'
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
  test('PATCH /tasks/:taskId with invalid data should return a a status of 422 and the error should have a message property', (done) => {
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
  test('DELETE /tasks/:taskId should return a 200 status and contain a body with a message property', (done) => {
    Superagent
      .delete(`${baseUri}/tasks/${testVariable}`)
      .end((error, response) => {
        expect(error).toEqual(null);
        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual(`deleted task: ${testVariable}`);
        done();
      });
  });
  test('GET /tasks/:taskId (deleted user) should return a 404 status and error message', (done) => {
    Superagent
      .get(`${baseUri}/tasks/${testVariable}`)
      .end((error, response) => {
        expect(error).not.toEqual(null);
        expect(response.status).toEqual(404);
        expect('message' in error).toEqual(true);
        done();
      });
  });
  test('DELETE /tasks/:taskId for invalid taskId should return a 404 status and contain an error with a message property', (done) => {
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