/* src/models/staffModel.js */
const db = require('../config/db');

const Staff = {
    getManagedRooms: async (location) => {
        return await db.execute("SELECT * FROM rooms WHERE location LIKE ?", [`%${location}%`]);
    }
};

module.exports = Staff;