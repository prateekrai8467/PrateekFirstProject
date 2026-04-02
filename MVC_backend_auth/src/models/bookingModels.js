/* src/models/bookingModel.js */
const db = require('../config/db');

const Booking = {
    create: async (userId, roomId, date, start, end, purpose) => {
        const sql = `INSERT INTO bookings (user_id, room_id, booking_date, start_time, end_time, purpose) VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [userId, roomId, date, start, end, purpose]);
        return result.insertId;
    },
    linkResource: async (bookingId, resourceId, qty) => {
        const sql = `INSERT INTO booking_resources (booking_id, resource_id, quantity_used) VALUES (?, ?, ?)`;
        return await db.execute(sql, [bookingId, resourceId, qty]);
    }
};

module.exports = Booking;