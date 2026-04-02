/* src/routes/staffRoutes.js */
const express = require('express');
const router = express.Router();
const staffController = require('../controller/staffController');

router.get('/pending', staffController.getPendingApprovals);
router.patch('/room-status', staffController.updateRoomStatus);

module.exports = router;