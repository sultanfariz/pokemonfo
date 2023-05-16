const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());

const sequelize = new Sequelize('kata_pokemonfo', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

// Define a model for the table
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define a route to handle POST requests for creating a user
app.post('/api/users', async (req, res) => {
  try {
    // Extract data from the request body
    const { name } = req.body;

    // Check if the name is not empty
    if (!name) {
      return res.status(400).json({ error: 'Name cannot be empty' });
    }

    // Check if the user already exists
    if (await User.findOne({ where: { name } })) {
      // Update the existing user with the new name
      await User.update({ name }, { where: { name } });
      return res.json({ message: 'User updated' });
    }

    // Create a new user in the database
    const newUser = await User.create({ name });

    // Return the newly created user as the response
    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Define a route to handle GET requests for getting all users
app.get('/api/users', async (req, res) => {
  try {
    // Get all users from the database
    const users = await User.findAll();

    // Return all users as the response
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

sequelize.sync().then(() => {
  console.log('Database & tables created!');
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
