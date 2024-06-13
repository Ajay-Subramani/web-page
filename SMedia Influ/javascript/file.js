const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb+srv://ajaysubramani16:$$mmIImmaa@cluster0.1mhy0ec.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// User model
const userSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true },
    mobilenumber: { type: String, required: true },
    location: { type: String, required: true },
    comment: { type: String, required: true },
    gender: { type: String, required: true },
    person: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// POST route to add a new user
app.post('mongodb+srv://ajaysubramani16:$$mmIImmaa@cluster0.1mhy0ec.mongodb.net/', async (req, res) => {
    try {
        const { fname, lname, email, mobilenumber, location, comment, gender, person } = req.body;

        const newUser = new User({
            fname,
            lname,
            email,
            mobilenumber,
            location,
            comment,
            gender,
            person,
        });

        await newUser.save();
        res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

// GET route to list all users
app.get('mongodb+srv://ajaysubramani16:$$mmIImmaa@cluster0.1mhy0ec.mongodb.net/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Client-side form submission handling
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('mongodb+srv://ajaysubramani16:$$mmIImmaa@cluster0.1mhy0ec.mongodb.net/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert('User added successfully');
                loadUsers();  // Reload users list after adding a new user
            } else {
                alert('Error adding user');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Function to load and display users
    async function loadUsers() {
        try {
            const response = await fetch('mongodb+srv://ajaysubramani16:$$mmIImmaa@cluster0.1mhy0ec.mongodb.net/');
            const users = await response.json();

            const userList = document.getElementById('user-list');
            userList.innerHTML = '';

            users.forEach(user => {
                const listItem = document.createElement('li');
                listItem.textContent = `${user.fname} ${user.lname} - ${user.email}`;
                userList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    loadUsers();  // Load users when the page loads
});

