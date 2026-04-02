/* src/models/userModel.js */
const db = require('../config/db');

const User = {
    create: async (name, email, password, role, phone) => {
        const sql = `INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)`;
        return await db.execute(sql, [name, email, password, role, phone]);
    },
    findByEmail: async (email) => {
        const sql = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await db.execute(sql, [email]);
        return rows[0];
    },
    findById: async (id) => {
        const sql = `SELECT user_id, name, email, role, phone FROM users WHERE user_id = ?`;
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }
};

module.exports = User;