require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');
const taskData = require('./task-data');
const userData = require('./user-data');
const bcrypt = require('bcryptjs');

const userIdArray = [];

const DB_URL = process.env.DB_URL
  .replace('<user>', process.env.DB_USER)
  .replace('<password>', process.env.DB_PASS)
  .replace('<dbname>', process.env.DB_NAME);

const getRandomItemFromArray = (arr) => arr[Math.floor(Math.random() * userIdArray.length)];

const clearCollection = async (collection, name) => {
  try {
    await collection.deleteMany({});
    console.log(`Cleared the ${name} collection`);
  } catch (error) {
    console.error(`Error clearing the ${name} collection, ${error.message}`);
  }
};

const seedCollection = async (collection, name, data) => {
  for (const item of data) {
    if (name === 'user') {
      const hashedPassword = await bcrypt.hash(item.password, 12);
      item.password = hashedPassword;
    }

    const Item = new collection(item);

    if (name === 'user') {
      userIdArray.push(Item.id);
    } else if (name === 'task') {
      const owner = getRandomItemFromArray(userIdArray);
      Item.owner = owner;
      const numberOfPerformers = Math.floor(Math.random() * userIdArray.length) + 1;
      for (let i = 0; i < numberOfPerformers; i++) {
        const performer = getRandomItemFromArray(userIdArray);
        if ((performer === owner) || Item.performers.includes(performer)) {
          continue;
        }
        Item.performers.push(performer);
      }
      if ((Item.performers.length > 0) && (Math.random() > 0.3)) {
        Item.selectedPerformer = getRandomItemFromArray(Item.performers);
      }
    }

    try {
      await Item.save();
      console.log(`Saved a new ${name}`);
    } catch (error) {
      console.error(`Error saving a new ${name}, ${error.message}`);
    }
  }
};

const seed = async () => {
  await clearCollection(Task, 'Tasks');
  await clearCollection(User, 'Users');
  await seedCollection(User, 'user', userData);
  await seedCollection(Task, 'task', taskData);
  mongoose.connection.close();
  console.log(`Connection to database closed`);
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
