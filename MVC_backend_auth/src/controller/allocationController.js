/* src/controller/allocationController.js */
const db = require('../config/db');

exports.approveOrRejectBooking = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { booking_id, approved_by, status, remarks } = req.body;

        // 1. Update the main bookings table status
        await connection.execute(
            "UPDATE bookings SET status = ? WHERE booking_id = ?", 
            [status, booking_id]
        );

        // 2. Log the action in the approvals table (Table 6)
        await connection.execute(
            "INSERT INTO approvals (booking_id, approved_by, approval_status, remarks) VALUES (?, ?, ?, ?)",
            [booking_id, approved_by, status, remarks]
        );

        await connection.commit();

        // Emit real-time notification
        const io = req.app.get('socketio');
        if (io) {
            io.emit('booking_status_updated', {
                booking_id,
                status,
                remarks,
                message: `Booking has been ${status}`
            });
        }

        res.json({ message: `Booking ${status} successfully` });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: "Action failed", error: error.message });
    } finally {
        connection.release();
    }
};