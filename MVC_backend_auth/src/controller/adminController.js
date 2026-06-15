/* src/controller/adminController.js */
const db = require('../config/db');

exports.getSystemStats = async (req, res) => {
    try {
        // Run multiple counts in parallel for performance
        const [resourceCount] = await db.execute("SELECT COUNT(*) as total FROM resources");
        const [allocationCount] = await db.execute("SELECT COUNT(*) as total FROM bookings");
        const [userCount] = await db.execute("SELECT COUNT(*) as total FROM users WHERE role = 'student'");
        const [staffCount] = await db.execute("SELECT COUNT(*) as total FROM users WHERE role = 'faculty'");

        res.json({
            totalResources: resourceCount[0].total,
            totalAllocations: allocationCount[0].total,
            totalUsers: userCount[0].total,
            totalStaff: staffCount[0].total
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

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await db.execute("DELETE FROM users WHERE user_id = ?", [userId]);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};

exports.getAllAllocations = async (req, res) => {
    try {
        const sql = `
            SELECT b.booking_id, b.status, b.booking_date, b.start_time, b.end_time, 
                   r.room_number, u.name as user_name 
            FROM bookings b 
            JOIN rooms r ON b.room_id = r.room_id 
            JOIN users u ON b.user_id = u.user_id 
            ORDER BY b.created_at DESC
        `;
        const [allocations] = await db.execute(sql);
        res.json(allocations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching allocations", error: error.message });
    }
};