/* src/routes/bookingRoutes.js */
const express = require('express');
const router = express.Router();
const bookingController = require('../controller/bookingController');

router.post('/new', bookingController.createBooking);
router.get('/user/:userId', bookingController.getUserBookings);

module.exports = router;