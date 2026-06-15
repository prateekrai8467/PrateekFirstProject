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
        
        // Fetch old values for audit trail
        const [oldRoom] = await db.execute("SELECT status, room_number FROM rooms WHERE room_id = ?", [room_id]);
        if (oldRoom.length === 0) return res.status(404).json({ message: "Room not found" });
        
        const oldStatus = oldRoom[0].status;
        const roomNumber = oldRoom[0].room_number;

        // Perform update
        await db.execute("UPDATE rooms SET status = ? WHERE room_id = ?", [status, room_id]);
        
        // Audit Trail implementation
        const userId = req.user ? req.user.user_id : null; 
        // We assume User ID 3 (Riya Verma - Admin) if req.user is undefined in a test scenario
        const logUserId = userId || 3; 
        const action = `Admin modified Room ${roomNumber}`;
        
        await db.execute(
            "INSERT INTO audit_logs (user_id, action, old_value, new_value) VALUES (?, ?, ?, ?)",
            [logUserId, action, oldStatus, status]
        );

        res.json({ message: "Room status updated" });
    } catch (error) {
        console.error("Audit log error:", error);
        res.status(500).json({ message: "Update failed" });
    }
};