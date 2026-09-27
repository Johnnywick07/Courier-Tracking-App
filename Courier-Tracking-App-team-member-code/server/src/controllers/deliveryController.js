import Delivery, { DELIVERY_STAGES } from "../models/Delivery.js";
import User from "../models/User.js";

export const createDelivery = async (req, res, next) => {
  try {
    const { sender, receiver, parcel } = req.body;

    const delivery = await Delivery.create({
      sender,
      receiver,
      parcel,
      createdBy: req.user._id,
      statusHistory: [{ status: "created", note: "Delivery created" }],
    });

    req.app.get("io")?.emit("delivery:created", delivery);

    res.status(201).json(delivery);
  } catch (err) {
    next(err);
  }
};

export const getDeliveries = async (req, res, next) => {
  try {
    const { status, rider } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (rider) filter.assignedRider = rider;

    if (req.user.role === "rider") {
      filter.assignedRider = req.user._id;
    }

    const deliveries = await Delivery.find(filter)
      .populate("assignedRider", "name phone")
      .sort({ createdAt: -1 });

    res.json(deliveries);
  } catch (err) {
    next(err);
  }
};

export const getDeliveryByTrackingId = async (req, res, next) => {
  try {
    const delivery = await Delivery.findOne({
      trackingId: req.params.trackingId,
    }).populate("assignedRider", "name phone");

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.json(delivery);
  } catch (err) {
    next(err);
  }
};

export const assignRider = async (req, res, next) => {
  try {
    const { riderId } = req.body;

    const rider = await User.findOne({ _id: riderId, role: "rider" });
    if (!rider) {
      return res.status(400).json({ message: "Invalid rider" });
    }

    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    delivery.assignedRider = rider._id;
    delivery.statusHistory.push({
      status: delivery.status,
      note: `Assigned to rider ${rider.name}`,
    });
    await delivery.save();

    req.app.get("io")?.emit("delivery:updated", delivery);

    res.json(delivery);
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status, note, location } = req.body;

    if (!DELIVERY_STAGES.includes(status)) {
      return res.status(400).json({ message: "Invalid status stage" });
    }

    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    if (
      req.user.role === "rider" &&
      (!delivery.assignedRider || delivery.assignedRider.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: "Not your assigned delivery" });
    }

    delivery.status = status;
    delivery.statusHistory.push({ status, note, location });
    await delivery.save();

    req.app.get("io")?.emit("delivery:updated", delivery);
    req.app.get("io")?.to(delivery.trackingId).emit("tracking:update", delivery);

    res.json(delivery);
  } catch (err) {
    next(err);
  }
};