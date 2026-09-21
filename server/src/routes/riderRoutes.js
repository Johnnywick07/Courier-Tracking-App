const express = require('express');
const { getAvailableRiders, assignDeliveryToRider } = require('../controllers/riderController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/available', protect, authorize('admin'), getAvailableRiders);
router.put('/assign/:id', protect, authorize('admin'), assignDeliveryToRider);

module.exports = router;
