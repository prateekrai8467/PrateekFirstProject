/* src/controller/staffController.js */
const db = require('../config/db');

exports.getPendingApprovals = async (req, res) => {
    try {
        const sql = `
            SELECT b.*, u.name as user_name, r.room_number 
            FROM bookings b
            JOIN users u ON b.user_id = u.user_id
            JOIN rooms r ON b.room_id = r.room_id
            WHERE b.status = 'pending'
        `;
        const [pending] = await db.execute(sql);
        res.json(pending);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pending list" });
    }
};

// Quick status toggle for rooms (e.g., marking for maintenance)
exports.updateRoomStatus = async (req, res) => {
    try {
        const { room_id, status } = req.body;
        await db.execute("UPDATE rooms SET status = ? WHERE room_id = ?", [status, room_id]);
        res.json({ message: "Room status updated" });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};