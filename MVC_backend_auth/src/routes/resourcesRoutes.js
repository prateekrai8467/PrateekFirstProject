/* src/routes/resourceRoutes.js */
const express = require('express');
const router = express.Router();
const resourceController = require('../controller/resourceController');

router.get('/rooms', resourceController.getAllRooms);
router.get('/items', resourceController.getAllResources);
router.post('/add-room', resourceController.addRoom); // Admin/Staff use

module.exports = router;