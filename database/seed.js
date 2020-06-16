require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');
const taskData = require('./task-data');
const userData = require('./user-data');

const DB_URL = process.env.DB_URL
  .replace('<user>', process.env.DB_USER)
  .replace('<password>', process.env.DB_PASS)
  .replace('<dbname>', process.env.DB_NAME);

const clearCollection = async (collection, name) => {
  try {
    await collection.deleteMany({});
    console.log(`cleared ${name} collection`);
  } catch (error) {
    console.error(`Error clearing ${name} collection`);
  }
};

const seedCollection = async (collection, name, data) => {
  for (const item of data) {
    const Item = new collection(item);

    try {
      await Item.save();
      console.log(`saved a new ${name}`);
    } catch {
      console.error(`Error saving a new ${name}`);
    }
  }
};


const seed = async () => {
  await clearCollection(Task, 'Tasks');
  await clearCollection(User, 'Users');
  await seedCollection(User, 'user', userData);
  await seedCollection(Task, 'task', taskData);
  mongoose.connection.close();
};

mongoose
  .connect(DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => {
    console.log('Connected to database');
    seed();
  })
  .catch(error => {
    throw new Error('Error connecting to database');
  });
