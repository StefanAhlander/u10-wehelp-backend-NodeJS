const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const uuid = require('uuid').v4;

let DUMMY_USERS = require('../placeholder/DUMMY_USERS');
const PORT = 5000;

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const createUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const {
    firstName,
    lastName,
    personNumber,
    email,
    phoneNumber,
    streetAddress_1,
    streetAddress_2,
    postalCode,
    city,
    country,
    authenticationProvider,
    providerId,
    about
  } = req.body;

  const hasUser = DUMMY_USERS.find(user => user.email === email);
  if (hasUser) {
    throw new HttpError('Could not create user, email already exists', 422);
  }

  const createdUser = {
    id: uuid(),
    firstName,
    lastName,
    personNumber,
    email,
    phoneNumber,
    streetAddress_1,
    streetAddress_2,
    postalCode,
    city,
    country,
    authenticationProvider,
    providerId,
    about,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  DUMMY_USERS.push(createdUser);

  res
    .set({ 'location': `${req.protocol}://${req.hostname}:${PORT}${req.originalUrl}/u3` })
    .status(201)
    .json({ user: createdUser });
};

const getUserById = (req, res, next) => {
  const userId = req.params.userId;
  const user = DUMMY_USERS.find(user => user.id === userId);

  if (!user) {
    return next(new HttpError(`could not find a user with userId: ${userId}`, 404));
  }

  res.json({ user });
};

const updateUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    streetAddress_1,
    streetAddress_2,
    postalCode,
    city,
    country,
    about
  } = req.body;
  const userId = req.params.userId;
  const updatedUser = { ...DUMMY_USERS.find(user => user.id === userId) };
  const userIndex = DUMMY_USERS.findIndex(user => user.id === userId);

  if (userIndex === -1) {
    return next(new HttpError(`could not find a user to update with userId: ${userId}`, 404));
  }

  updatedUser.firstName = firstName;
  updatedUser.lastName = lastName;
  updatedUser.email = email;
  updatedUser.phoneNumber = phoneNumber;
  updatedUser.streetAddress_1 = streetAddress_1;
  updatedUser.streetAddress_2 = streetAddress_2;
  updatedUser.postalCode = postalCode;
  updatedUser.city = city;
  updatedUser.country = country;
  updatedUser.about = about;

  DUMMY_USERS[userIndex] = updatedUser;

  res.json({ user: updatedUser });
};

const deleteUser = (req, res, next) => {
  const userId = req.params.userId;
  DUMMY_USERS = DUMMY_USERS.filter(user => user.id !== userId);

  res.json({ message: `deleted user: ${userId}` });
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;