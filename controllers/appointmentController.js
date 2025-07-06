const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');

// Book Appointment
exports.bookAppointment = async (req, res) => {
    try {
        const { availabilityId } = req.body;

        // Check if slot is already booked
        const availability = await Availability.findById(availabilityId);
        if (!availability || availability.isBooked) {
            return res.status(400).json({ message: 'Time slot is not available' });
        }

        // Create appointment
        const appointment = new Appointment({
            studentId: req.user.id, // From token
            professorId: availability.professorId,
            availabilityId: availability._id
        });

        await appointment.save();

        // Mark the slot as booked
        availability.isBooked = true;
        await availability.save();

        res.json({ message: 'Appointment booked successfully', appointment });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Cancel Appointment
exports.cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate('availabilityId');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Only the professor who owns this appointment can cancel it
        if (appointment.professorId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to cancel this appointment' });
        }

        // Mark availability as not booked
        const availability = await Availability.findById(appointment.availabilityId._id);
        availability.isBooked = false;
        await availability.save();

        // Delete appointment
        await Appointment.findByIdAndDelete(req.params.id);

        res.json({ message: 'Appointment cancelled successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};


// Get Student's Appointments
exports.getStudentAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ studentId: req.user.id }).populate('availabilityId professorId');
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};
