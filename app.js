const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const User = require('./models/User');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://evaw0929:Ilovecats1314@cluster0.pt8pr8x.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  // Read and insert data from UserData.json
  await insertUserData();
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

// Define route to create a new user
app.post('/users', async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
async function insertUserData() {
  try {
    // Read UserData.json
    const userData = JSON.parse(fs.readFileSync('UsersData.json', 'utf8'));

    // Insert each user into the database
    for (const user of userData) {
      const newUser = new User(user);
      await newUser.save();
      console.log(`User ${user.username} inserted successfully`);
    }

    console.log('All users inserted successfully');
  } catch (error) {
    console.error('Error inserting users into MongoDB:', error);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
