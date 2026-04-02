/* src/routes/fineRoutes.js */
const express = require('express');
const router = express.Router();
const fineController = require('../controller/fineController');

router.post('/issue', fineController.issueFine);
router.get('/user/:userId', fineController.getUserFines);

module.exports = router;