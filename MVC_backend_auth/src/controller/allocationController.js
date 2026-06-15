/* src/controller/allocationController.js */
const db = require('../config/db');
const { sendBookingDecisionEmail } = require('../utils/emailService');

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

        // Fetch user email to send professional email notification
        try {
            const [userResult] = await db.execute(`
                SELECT u.email, u.name 
                FROM users u
                JOIN bookings b ON u.user_id = b.user_id
                WHERE b.booking_id = ?
            `, [booking_id]);

            if (userResult.length > 0) {
                const user = userResult[0];
                // Dispatch email asynchronously (we don't await blocking here so the response is fast)
                sendBookingDecisionEmail(user.email, user.name, booking_id, status, remarks);
            }
        } catch (emailErr) {
            console.error("Error fetching user for email notification:", emailErr);
        }

        res.json({ message: `Booking ${status} successfully` });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: "Action failed", error: error.message });
    } finally {
        connection.release();
    }
};