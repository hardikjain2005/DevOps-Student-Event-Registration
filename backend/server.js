require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Mongoose Schema
const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    event: String,
    contact: String,
    date: { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', registrationSchema);

// Routes
app.get('/', (req, res) => {
    res.send('Event Registration API is running');
});

// Register for an event
app.post('/api/register', async (req, res) => {
    const { name, email, event, contact } = req.body;

    if (!name || !email || !event || !contact) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newRegistration = new Registration({
            name,
            email,
            event,
            contact
        });

        await newRegistration.save();
        res.status(201).json({ message: 'Registration successful', data: newRegistration });
    } catch (error) {
        res.status(500).json({ error: 'Server error saving registration' });
    }
});

// Get all registrations (Admin)
app.get('/api/registrations', async (req, res) => {
    try {
        const registrations = await Registration.find().sort({ date: -1 });
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching registrations' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
