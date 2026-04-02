/* src/routes/allocationRoutes.js */
const express = require('express');
const router = express.Router();
const allocationController = require('../controller/allocationController');

router.post('/action', allocationController.approveOrRejectBooking);

module.exports = router;