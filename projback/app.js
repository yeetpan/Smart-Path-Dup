const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./user.model');

const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://userinname:<xSc2zxIZenXf6Ohg>@dbcluster.abovn5l.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());

// Registration route
app.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).send('Authentication failed');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send('Authentication failed');
    }

    const token = jwt.sign({ username, role: user.role }, 'your-secret-key');
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during login');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
