/* src/routes/userRoutes.js */
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/profile/:userId', userController.getProfile);
router.put('/update/:userId', userController.updateProfile);
router.get('/bookings/:userId', userController.getMyActiveBookings);
router.get('/summary/:userId', userController.getDashboardSummary);

module.exports = router;