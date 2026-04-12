/* src/routes/resourceRoutes.js */
const express = require('express');
const router = express.Router();
const resourceController = require('../controller/resourcesController');

router.get('/rooms', resourceController.getAllRooms);
router.get('/items', resourceController.getAllResources);
router.post('/add-room', resourceController.addRoom); // Admin/Staff use
router.post('/add-item', resourceController.addResource);
router.put('/items/:id', resourceController.updateResource); // Edit resource

module.exports = router;