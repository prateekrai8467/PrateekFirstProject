/* src/routes/adminRoutes.js */
const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/stats', adminController.getSystemStats);
router.get('/users', adminController.getAllUsersByRole);
// Only logged-in Admins can see stats(ADDEd by middleware)
router.get('/stats', protect, authorize('admin'), adminController.getSystemStats);

// Faculty AND Admin can see users(ADDED BY MIDDLEWARE)
router.get('/users', protect, authorize('admin', 'faculty'), adminController.getAllUsersByRole);

module.exports = router;