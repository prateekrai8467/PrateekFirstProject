/* src/controller/paymentController.js */
const db = require('../config/db');

exports.recordPayment = async (req, res) => {
    try {
        const { booking_id, user_id, amount, method } = req.body;
        const sql = `
            INSERT INTO payments (booking_id, user_id, amount, payment_status, payment_method, payment_date) 
            VALUES (?, ?, ?, 'paid', ?, CURRENT_TIMESTAMP)
        `;
        await db.execute(sql, [booking_id, user_id, amount, method]);
        res.status(201).json({ message: "Payment recorded successfully" });
    } catch (error) {
        res.status(500).json({ message: "Payment error", error: error.message });
    }
};

exports.getPaymentHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const [history] = await db.execute("SELECT * FROM payments WHERE user_id = ?", [userId]);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: "Error fetching payments" });
    }
};