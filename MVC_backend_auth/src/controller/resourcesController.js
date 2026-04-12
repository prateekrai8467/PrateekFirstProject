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

// Add new resource item (Admin only)
exports.addResource = async (req, res) => {
    try {
        const { resource_name, total_quantity, description } = req.body;
        const sql = `INSERT INTO resources (resource_name, total_quantity, available_quantity, description) VALUES (?, ?, ?, ?)`;
        await db.execute(sql, [resource_name, total_quantity, total_quantity, description]);
        res.status(201).json({ message: "Resource added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error adding resource", error: error.message });
    }
};

// Edit resource
exports.updateResource = async (req, res) => {
    try {
        const resourceId = req.params.id;
        const { total_quantity } = req.body;
        const sql = `UPDATE resources SET total_quantity = ?, available_quantity = ? WHERE resource_id = ?`;
        await db.execute(sql, [total_quantity, total_quantity, resourceId]);
        res.json({ message: "Resource updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating resource", error: error.message });
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