/* src/models/resourceModel.js */
const db = require('../config/db');

const Resource = {
    getAllRooms: async () => {
        return await db.execute("SELECT * FROM rooms");
    },
    updateRoomStatus: async (roomId, status) => {
        return await db.execute("UPDATE rooms SET status = ? WHERE room_id = ?", [status, roomId]);
    },
    getAvailableEquipment: async () => {
        return await db.execute("SELECT * FROM resources WHERE available_quantity > 0");
    }
};

module.exports = Resource;