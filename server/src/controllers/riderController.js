const User = require('../models/User');
const Delivery = require('../models/Delivery');

const getAvailableRiders = async (req, res) => {
  try {
    const riders = await User.find({ role: 'rider', isActive: true });
    res.json(riders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignDeliveryToRider = async (req, res) => {
  try {
    const { riderId } = req.body;
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { rider: riderId, status: 'assigned' },
      { new: true }
    );

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAvailableRiders,
  assignDeliveryToRider,
};
