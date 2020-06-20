const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, '-password -personNumber');
  } catch (error) {
    return next(new HttpError(`Database error searching for users, ${error.message}`), 500);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};


const getUserById = async (req, res, next) => {
  const userId = req.params.userId;
  let user;

  try {
    user = await User.findById(userId, '-password -personNumber');
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

  /* Extract properties from the req.body and assign to an object.
   * 
   * JSON.stringify only the properties provided in the second argument [array]. 
   * JSON.parse string back to an object. 
   */
  const passedUserInfo = JSON.parse(JSON.stringify(
    req.body,
    ['name', 'personNumber', 'email', 'phoneNumber', 'streetAddress_1', 'streetAddress_2', 'postalCode', 'city', 'country', 'about', 'password']
  ));

  let existingUser;
  try {
    existingUser = await User.findOne({ email: passedUserInfo.email });
    if (!existingUser) {
      existingUser = await User.findOne({ personNumber: passedUserInfo.personNumber });
    }
  } catch (error) {
    return next(new HttpError(`Database error creating user ${error.message}`, 500));
  }

  if (existingUser) {
    return next(new HttpError(`Error creating new user`, 422));
  }

  try {
    const hashedPassword = await bcrypt.hash(passedUserInfo.password, 12);
    passedUserInfo.password = hashedPassword;
  } catch (error) {
    return next(new HttpError('Could not create new user', 500));
  }

  const newUser = new User(passedUserInfo);

  try {
    await newUser.save();
  } catch (error) {
    return next(new HttpError(`Error saving new user, ${error.message}`, 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.TOKEN_SECRET,
      { expiresIn: '3h' }
    );
  } catch (error) {
    return next(new HttpError('Could not create new user', 500));
  }

  res
    .set({ 'location': `${req.protocol}://${req.hostname}:${process.env.APP_PORT}${req.originalUrl}/${newUser.id}` })
    .status(201)
    .json({
      userId: newUser.id,
      email: newUser.email,
      token
    });
};


const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const updatedInfo = JSON.parse(JSON.stringify(
    req.body,
    ['name', 'email', 'phoneNumber', 'streetAddress_1', 'streetAddress_2', 'postalCode', 'city', 'country', 'about']
  ));
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

  if (user.id !== req.userData.userId) {
    return next(new HttpError(`You are not allowed to update this user`, 401));
  }

  user = Object.assign(user, updatedInfo);

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

  if (user.id !== req.userData.userId) {
    return next(new HttpError(`You are not allowed to delete this user`, 401));
  }

  try {
    await user.remove();
  } catch (error) {
    return next(new HttpError(`Database error deleting user: ${userId}, ${error.message}`, 500));
  }

  res.json({ message: `deleted user: ${userId}` });
};


const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError(`Login failed, please try again later`, 500));
  }

  if (!existingUser) {
    return next(new HttpError(`Invalid credentials, please try again`, 403));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(new HttpError(`Could not log you in, check your credentials and please try again`, 500));
  }

  if (!isValidPassword) {
    return next(new HttpError(`Invalid credentials, please try again`, 403));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.TOKEN_SECRET,
      { expiresIn: '3h' }
    );
  } catch (error) {
    return next(new HttpError('Login failed, please try again later', 500));
  }

  res
    .status(200)
    .json({
      userId: existingUser.id,
      email: existingUser.email,
      token
    });
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.login = login;