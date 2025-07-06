const Availability = require('../models/Availability');

// Create availability slot
exports.createAvailability = async (req, res) => {
    try {
        const { date, time } = req.body;

        const newAvailability = new Availability({
            professorId: req.user.id, // From JWT token
            date,
            time
        });

        await newAvailability.save();
        res.json({ message: 'Availability slot created successfully', availability: newAvailability });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get professor's available slots
exports.getAvailability = async (req, res) => {
    try {
        const professorId = req.params.id;

        const availableSlots = await Availability.find({ professorId, isBooked: false });
        res.json(availableSlots);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};
