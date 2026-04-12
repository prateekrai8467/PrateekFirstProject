/* src/controller/userController.js */
const db = require('../config/db');

exports.getProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const [user] = await db.execute(
            "SELECT user_id, name, email, role, phone, created_at FROM users WHERE user_id = ?", 
            [userId]
        );
        if (user.length === 0) return res.status(404).json({ message: "User not found" });
        res.json(user[0]);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile" });
    }
};

exports.updateProfile = async (req, res) => {
    res.status(501).json({ message: "Not Implemented" });
};

exports.getMyActiveBookings = async (req, res) => {
    res.status(501).json({ message: "Not Implemented" });
};

exports.getDashboardSummary = async (req, res) => {
    res.status(501).json({ message: "Not Implemented" });
};