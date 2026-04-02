/* src/controller/adminController.js */
const db = require('../config/db');

exports.getSystemStats = async (req, res) => {
    try {
        // Run multiple counts in parallel for performance
        const [roomCount] = await db.execute("SELECT COUNT(*) as total FROM rooms");
        const [activeBookings] = await db.execute("SELECT COUNT(*) as total FROM bookings WHERE status = 'approved'");
        const [totalFines] = await db.execute("SELECT SUM(amount) as total FROM fines WHERE status = 'unpaid'");

        res.json({
            totalRooms: roomCount[0].total,
            activeAllocations: activeBookings[0].total,
            pendingFines: totalFines[0].total || 0
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats", error: error.message });
    }
};

exports.getAllUsersByRole = async (req, res) => {
    try {
        const { role } = req.query; // e.g., ?role=faculty
        const [users] = await db.execute("SELECT user_id, name, email, role, phone FROM users WHERE role = ?", [role]);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};