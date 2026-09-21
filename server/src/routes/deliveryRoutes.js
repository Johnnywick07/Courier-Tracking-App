const express = require('express');
const {
  createDelivery,
  getAllDeliveries,
  getDeliveryById,
  updateDeliveryStatus,
} = require('../controllers/deliveryController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const router = express.Router();

router.route('/').post(protect, authorize('admin', 'customer'), createDelivery).get(protect, getAllDeliveries);
router.route('/:id').get(protect, getDeliveryById).put(protect, authorize('admin', 'rider'), updateDeliveryStatus);

module.exports = router;
