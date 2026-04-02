/* src/controller/bookingController.js */
const db = require('../config/db');

exports.createBooking = async (req, res) => {
    const connection = await db.getConnection(); // Use connection for Transaction
    try {
        await connection.beginTransaction();

        const { user_id, room_id, booking_date, start_time, end_time, purpose, resources } = req.body;

        // 1. Insert into bookings table
        const [bookingResult] = await connection.execute(
            `INSERT INTO bookings (user_id, room_id, booking_date, start_time, end_time, purpose) VALUES (?, ?, ?, ?, ?, ?)`,
            [user_id, room_id, booking_date, start_time, end_time, purpose]
        );

        const bookingId = bookingResult.insertId;

        // 2. If resources (equipment) are requested, link them
        if (resources && resources.length > 0) {
            for (let item of resources) {
                // Insert into booking_resources (Table 5)
                await connection.execute(
                    `INSERT INTO booking_resources (booking_id, resource_id, quantity_used) VALUES (?, ?, ?)`,
                    [bookingId, item.resource_id, item.quantity]
                );

                // Update available_quantity in resources (Table 3)
                await connection.execute(
                    `UPDATE resources SET available_quantity = available_quantity - ? WHERE resource_id = ?`,
                    [item.quantity, item.resource_id]
                );
            }
        }

        await connection.commit();
        res.status(201).json({ message: "Booking request submitted", bookingId });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: "Booking failed", error: error.message });
    } finally {
        connection.release();
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const userId = req.params.userId;
        const [bookings] = await db.execute(
            `SELECT b.*, r.room_number FROM bookings b 
             JOIN rooms r ON b.room_id = r.room_id 
             WHERE b.user_id = ?`, [userId]
        );
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching history" });
    }
};