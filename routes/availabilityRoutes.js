const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { createAvailability, getAvailability } = require('../controllers/availabilityController');

// Professors create availability
router.post('/:id/availability', verifyToken, createAvailability);

// Students view availability
router.get('/:id/availability', verifyToken, getAvailability);

module.exports = router;
