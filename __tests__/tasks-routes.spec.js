const Superagent = require('superagent');
const { response } = require('express');

const version = require('../package.json').version;
const baseUri = `http://localhost:5000/api/${version}`;

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
  test('GET /users/:userId should return a 200 status and contain a body with a user property when userId is valid', (done) => {
    Superagent
      .get(`${baseUri}/users/u1`)
      .end((error, response) => {
        expect(error).toEqual(null);
        expect(response.status).toEqual(200);
        expect('user' in response.body).toEqual(true);
        done();
      });
  });
  test('GET /users/:userId should return a 404 status and contain a body with an message property when userId is valid', (done) => {
    Superagent
      .get(`${baseUri}/users/u5`)
      .end((error, response) => {
        expect(response.status).toEqual(404);
        expect('message' in error).toEqual(true);
        done();
      });
  });
  test('POST /users should return a location header field, a status of 201 and the same body that was sent', (done) => {
    const data = {
      firstName: 'Alex',
      lastName: 'Fredin',
      personNumber: '080321',
      email: 'alex@outlook.com',
      phoneNumber: '0708118825',
      streetAddress_1: 'Lapplandsresan 25B',
      streetAddress_2: '',
      postalCode: 75755,
      city: 'Uppsala',
      country: 'Sweden',
      authenticationProvider: '',
      providerId: '',
      about: 'Cool kid!'
    };

    Superagent
      .post(`${baseUri}/users`)
      .send(data)
      .end((error, response) => {
        expect(error).toEqual(null);
        expect('location' in response.header).toEqual(true);
        expect(response.status).toEqual(201);
        expect(response.body.user.firstName).toEqual(data.firstName);
        testVariable = response.body.user.id;
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
  test('PATCH /users/:userId should return a a status of 201 and the same body that was sent', (done) => {
    const data = {
      firstName: 'Julia',
      lastName: 'Fredin',
      email: 'alex@outlook.com',
      phoneNumber: '0708118825',
      streetAddress_1: 'Lapplandsresan 25B',
      streetAddress_2: '',
      postalCode: 75755,
      city: 'Uppsala',
      country: 'Sweden',
      about: 'Cool girl!'
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
  test('DELETE /users/:userId should return a 200 status and contain a body with a message property', (done) => {
    Superagent
      .delete(`${baseUri}/users/u1`)
      .end((error, response) => {
        expect(error).toEqual(null);
        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual('deleted user: u1');
        done();
      });
  });
});