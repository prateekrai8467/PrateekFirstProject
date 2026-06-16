/* src/controller/adminController.js */
const db = require('../config/db');

exports.getSystemStats = async (req, res) => {
    try {
        // Basic Counts
        const [resourceCount] = await db.execute("SELECT COUNT(*) as total FROM resources");
        const [allocationCount] = await db.execute("SELECT COUNT(*) as total FROM bookings");
        const [userCount] = await db.execute("SELECT COUNT(*) as total FROM users WHERE role = 'student'");
        const [staffCount] = await db.execute("SELECT COUNT(*) as total FROM users WHERE role = 'faculty'");
        const [roomCount] = await db.execute("SELECT COUNT(*) as total FROM rooms");

        // Utilization %
        const [utilizationData] = await db.execute("SELECT SUM(total_quantity) as total_qty, SUM(total_quantity - available_quantity) as allocated_qty FROM resources");
        let utilizationPercent = 0;
        if (utilizationData[0].total_qty > 0) {
            utilizationPercent = ((utilizationData[0].allocated_qty / utilizationData[0].total_qty) * 100).toFixed(1);
        }

        // Most Used Room
        const [mostUsedRoom] = await db.execute(`
            SELECT r.room_number, COUNT(b.booking_id) as uses 
            FROM bookings b 
            JOIN rooms r ON b.room_id = r.room_id 
            GROUP BY r.room_id 
            ORDER BY uses DESC LIMIT 1
        `);

        // Most Used Resource
        const [mostUsedResource] = await db.execute(`
            SELECT res.resource_name, COALESCE(SUM(br.quantity_used), 0) as uses 
            FROM booking_resources br 
            JOIN resources res ON br.resource_id = res.resource_id 
            GROUP BY br.resource_id 
            ORDER BY uses DESC LIMIT 1
        `);

        // Monthly Bookings
        const [monthlyBookings] = await db.execute(`
            SELECT MONTH(booking_date) as month, COUNT(*) as count 
            FROM bookings 
            WHERE YEAR(booking_date) = YEAR(CURRENT_DATE) 
            GROUP BY MONTH(booking_date)
            ORDER BY month ASC
        `);

        res.json({
            totalResources: resourceCount[0].total,
            totalAllocations: allocationCount[0].total,
            totalUsers: userCount[0].total,
            totalStaff: staffCount[0].total,
            totalRooms: roomCount[0].total,
            utilizationPercent: utilizationPercent,
            mostUsedRoom: mostUsedRoom.length > 0 ? mostUsedRoom[0].room_number : 'N/A',
            mostUsedResource: mostUsedResource.length > 0 ? mostUsedResource[0].resource_name : 'N/A',
            monthlyBookings: monthlyBookings
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
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