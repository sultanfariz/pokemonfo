const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
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
app.post('/users', async (req, res) => {
  try {
    // Extract data from the request body
    const { name } = req.body;

    // Create a new user in the database
    const newUser = await User.create({ name });

    // Return the newly created user as the response
    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
