/* src/controller/resourceController.js */
const db = require('../config/db');

// Get all rooms (Table 2)
exports.getAllRooms = async (req, res) => {
    try {
        const [rooms] = await db.execute("SELECT * FROM rooms");
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: "Error fetching rooms", error: error.message });
    }
};

// Get all physical resources/equipment (Table 3)
exports.getAllResources = async (req, res) => {
    try {
        const [resources] = await db.execute("SELECT * FROM resources");
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: "Error fetching resources", error: error.message });
    }
};

// Add new room (Admin only)
exports.addRoom = async (req, res) => {
    try {
        const { room_number, type, capacity, location, description } = req.body;
        const sql = `INSERT INTO rooms (room_number, type, capacity, location, description) VALUES (?, ?, ?, ?, ?)`;
        await db.execute(sql, [room_number, type, capacity, location, description]);
        res.status(201).json({ message: "Room added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error adding room", error: error.message });
    }
};