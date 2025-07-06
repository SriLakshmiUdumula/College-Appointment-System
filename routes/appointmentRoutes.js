const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { bookAppointment, cancelAppointment, getStudentAppointments } = require('../controllers/appointmentController');

// Book Appointment
router.post('/', verifyToken, bookAppointment);

// Cancel Appointment
router.delete('/:id', verifyToken, cancelAppointment);

// View Student Appointments
router.get('/student', verifyToken, getStudentAppointments);

module.exports = router;
