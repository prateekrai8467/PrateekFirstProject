/* src/controller/fineController.js */
const db = require('../config/db');

exports.issueFine = async (req, res) => {
    try {
        const { booking_id, user_id, reason, amount, issued_by } = req.body;
        const sql = `INSERT INTO fines (booking_id, user_id, reason, amount, issued_by) VALUES (?, ?, ?, ?, ?)`;
        await db.execute(sql, [booking_id, user_id, reason, amount, issued_by]);
        res.status(201).json({ message: "Fine issued successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error issuing fine", error: error.message });
    }
};

exports.getUserFines = async (req, res) => {
    try {
        const userId = req.params.userId;
        const [fines] = await db.execute("SELECT * FROM fines WHERE user_id = ?", [userId]);
        res.json(fines);
    } catch (error) {
        res.status(500).json({ message: "Error fetching fines" });
    }
};