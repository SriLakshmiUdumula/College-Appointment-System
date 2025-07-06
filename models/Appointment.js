const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    availabilityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Availability', required: true }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
