require('dotenv').config();
const Superagent = require('superagent');

const version = require('../package.json').version;
const baseUri = `http://localhost:${process.env.APP_PORT}/api/${version}`;

let testVariable;

describe('users-routes api endpoints', () => {
  test('GET /users should return a status of 200 and contain a body with a users property', (done) => {
    Superagent
      .get(`${baseUri}/users`)
      .end((error, response) => {
        expect(error).toEqual(null);
        expect(response.status).toEqual(200);
        expect('users' in response.body).toEqual(true);
        done();
      });
  });
  test('GET /users/:userId should return a 404 status and contain a body with an message property when userId is valid', (done) => {
    Superagent
      .get(`${baseUri}/users/u5`)
      .end((error, response) => {
        expect(response.status).not.toEqual(200);
        expect('message' in error).toEqual(true);
        done();
      });
  });
  test('POST /users should return a location header field, a status of 201 and the same body that was sent', (done) => {
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
  test('POST /users for duplicate emails should return a status of 500 and the error should contain a message', (done) => {
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
        expect(response.status).toEqual(500);
        expect('message' in error).toEqual(true);
        done();
      });
  });
  test('POST /users with invalid data should return a status of 422 and the error should contain a message', (done) => {
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
  test('GET /users/:userId (new user) should return a 200 status and contain a body with a user property', (done) => {
    Superagent
      .get(`${baseUri}/users/${testVariable}`)
      .end((error, response) => {
        expect(error).toEqual(null);
        expect(response.status).toEqual(200);
        expect('user' in response.body).toEqual(true);
        done();
      });
  });
  test('PATCH /users/:userId should return a a status of 201 and the same body that was sent with changed fields', (done) => {
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
  test('PATCH /users/:userId with invalid data should return a a status of 422 and the error should have a message property', (done) => {
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
  test('DELETE /users/:userId should return a 200 status and contain a body with a message property', (done) => {
    Superagent
      .delete(`${baseUri}/users/${testVariable}`)
      .end((error, response) => {
        expect(error).toEqual(null);
        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual(`deleted user: ${testVariable}`);
        done();
      });
  });
  test('GET /users/:userId (deleted user) should return a 404 status and error message', (done) => {
    Superagent
      .get(`${baseUri}/users/${testVariable}`)
      .end((error, response) => {
        expect(error).not.toEqual(null);
        expect(response.status).toEqual(404);
        expect('message' in error).toEqual(true);
        done();
      });
  });
  test('DELETE /users/:userId for invalid userId should return a 404 status and contain an error with a message property', (done) => {
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