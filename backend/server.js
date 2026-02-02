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
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✓ Connected to MongoDB Atlas');
    }).catch(err => {
        console.error('✗ MongoDB connection error:', err);
        process.exit(1);
    });

// Mongoose Schema
const registrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    event: { type: String, required: true },
    contact: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', registrationSchema);

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Event Registration API is running',
        version: '1.0.0',
        endpoints: {
            register: 'POST /api/register',
            getRegistrations: 'GET /api/registrations'
        }
    });
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
        console.log(`✓ New registration: ${name} for ${event}`);

        res.status(201).json({
            message: 'Registration successful',
            data: {
                id: newRegistration._id,
                name: newRegistration.name,
                email: newRegistration.email,
                event: newRegistration.event,
                contact: newRegistration.contact,
                date: newRegistration.date
            }
        });
    } catch (error) {
        console.error('✗ Error saving registration:', error);
        res.status(500).json({ error: 'Server error saving registration' });
    }
});

// Get all registrations (Admin)
app.get('/api/registrations', async (req, res) => {
    try {
        const registrations = await Registration.find().sort({ date: -1 });
        console.log(`✓ Fetched ${registrations.length} registrations`);

        const formattedRegistrations = registrations.map((reg, index) => ({
            id: index + 1,
            _id: reg._id,
            name: reg.name,
            email: reg.email,
            event: reg.event,
            contact: reg.contact,
            date: reg.date
        }));

        res.json(formattedRegistrations);
    } catch (error) {
        console.error('✗ Error fetching registrations:', error);
        res.status(500).json({ error: 'Server error fetching registrations' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`✓ Server is running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});
