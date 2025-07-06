const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');

let studentToken, professorToken, professorId, availabilityId, appointmentId;


afterAll(async () => {
    // Clean up database and close connection
    await User.deleteMany({});
    await Availability.deleteMany({});
    await Appointment.deleteMany({});
    await mongoose.connection.close();
});

describe('College Appointment System', () => {

    test('Register Student', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'student1@example.com', password: '123456', role: 'student' });

        expect(res.statusCode).toBe(201);
    });

    test('Register Professor', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'professor1@example.com', password: '123456', role: 'professor' });

        professorId = res.body.userId; // Capture professor ID
        expect(res.statusCode).toBe(201);
    });

    test('Student Login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'student1@example.com', password: '123456' });

        studentToken = res.body.token;
        expect(res.statusCode).toBe(200);
    });

    test('Professor Login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'professor1@example.com', password: '123456' });

        professorToken = res.body.token;
        professorId = res.body.userId; // Save professor ID if not already
        expect(res.statusCode).toBe(200);
    });

    test('Professor Sets Availability', async () => {
        const res = await request(app)
            .post(`/api/professors/${professorId}/availability`)
            .set('Authorization', `Bearer ${professorToken}`)
            .send({ date: '2025-07-05', time: '10:00 AM' });

        availabilityId = res.body.availability._id; // Save slot ID
        expect(res.statusCode).toBe(200);
    });

    test('Student Views Available Slots', async () => {
        const res = await request(app)
            .get(`/api/professors/${professorId}/availability`)
            .set('Authorization', `Bearer ${studentToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('Student Books Appointment', async () => {
        const res = await request(app)
            .post('/api/appointments')
            .set('Authorization', `Bearer ${studentToken}`)
            .send({ availabilityId });

        appointmentId = res.body.appointment._id;
        expect(res.statusCode).toBe(200);
    });

    test('Professor Cancels Appointment', async () => {
        const res = await request(app)
            .delete(`/api/appointments/${appointmentId}`)
            .set('Authorization', `Bearer ${professorToken}`);

        expect(res.statusCode).toBe(200);
    });

    test('Student Checks Appointments (Should be Empty)', async () => {
        const res = await request(app)
            .get('/api/appointments/student')
            .set('Authorization', `Bearer ${studentToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(0);
    });
});
