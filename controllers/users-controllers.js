const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

const User = require('../models/User');

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find();
  } catch (error) {
    return next(new HttpError(`Database error searching for users, ${error.message}`), 500);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const getUserById = async (req, res, next) => {
  const userId = req.params.userId;
  let user;

  try {
    user = await User.findById(userId);
  } catch (error) {
    return next(new HttpError(`Database error searching for user: ${userId}, ${error.message}`), 500);
  }

  if (!user) {
    return next(new HttpError(`could not find a user with userId: ${userId}`, 404));
  }

  res.json({ user: user.toObject({ getters: true }) });
};

const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const {
    name,
    personNumber,
    email,
    phoneNumber,
    streetAddress_1,
    streetAddress_2,
    postalCode,
    city,
    country,
    about
  } = req.body;

  const newUser = new User({
    name,
    personNumber,
    email,
    phoneNumber,
    streetAddress_1,
    streetAddress_2,
    postalCode,
    city,
    country,
    about
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(new HttpError(`Error saving new user, ${error.message}`, 500));
  }

  res
    .set({ 'location': `${req.protocol}://${req.hostname}:${process.env.APP_PORT}${req.originalUrl}/${newUser.id}` })
    .status(201)
    .json({ user: newUser.toObject({ getters: true }) });
};

const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const {
    name,
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
  let user;

  try {
    user = await User.findById(userId);
  } catch (error) {
    return next(new HttpError(`Database error finding user: ${userId} to update, ${error.message}`), 500);
  }

  if (!user) {
    return next(new HttpError(`Could not find a user with userId: ${userId} to update`, 404));
  }

  user.name = name;
  user.email = email;
  user.phoneNumber = phoneNumber;
  user.streetAddress_1 = streetAddress_1;
  user.streetAddress_2 = streetAddress_2;
  user.postalCode = postalCode;
  user.city = city;
  user.country = country;
  user.about = about;

  try {
    await user.save();
  } catch (error) {
    return next(new HttpError(`Database error updating user: ${userId}, ${error.message}`, 500));
  }

  res.json({ user: user.toObject({ getters: true }) });
};

const deleteUser = async (req, res, next) => {
  const userId = req.params.userId;
  let user;

  try {
    user = await User.findById(userId);
  } catch (error) {
    return next(new HttpError(`Database error finding user: ${userId} to delete, ${error.message}`), 500);
  }

  if (!user) {
    return next(new HttpError(`Could not find a user with userId: ${userId} to delete`, 404));
  }

  try {
    await user.remove();
  } catch (error) {
    return next(new HttpError(`Database error deleting user: ${userId}, ${error.message}`, 500));
  }

  res.json({ message: `deleted user: ${userId}` });
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;