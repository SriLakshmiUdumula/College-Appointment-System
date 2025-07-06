const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
const availabilityRoutes = require('./routes/availabilityRoutes');
app.use('/api/professors', availabilityRoutes);

const appointmentRoutes = require('./routes/appointmentRoutes');
app.use('/api/appointments', appointmentRoutes);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/appointmentSystem')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Export the app (so Jest can use it)
module.exports = app;
