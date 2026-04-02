/* src/models/allocationModel.js */
const db = require('../config/db');

const Allocation = {
    logApproval: async (bookingId, adminId, status, remarks) => {
        const sql = `INSERT INTO approvals (booking_id, approved_by, approval_status, remarks) VALUES (?, ?, ?, ?)`;
        return await db.execute(sql, [bookingId, adminId, status, remarks]);
    },
    getPendingRequests: async () => {
        const sql = `SELECT b.*, u.name, r.room_number FROM bookings b 
                     JOIN users u ON b.user_id = u.user_id 
                     JOIN rooms r ON b.room_id = r.room_id 
                     WHERE b.status = 'pending'`;
        return await db.execute(sql);
    }
};

module.exports = Allocation;