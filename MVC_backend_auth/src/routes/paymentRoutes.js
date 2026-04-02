/* src/routes/paymentRoutes.js */
const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');

router.post('/record', paymentController.recordPayment);
router.get('/history/:userId', paymentController.getPaymentHistory);

module.exports = router;