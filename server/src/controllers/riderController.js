import User from "../models/User.js";

export const getRiders = async (req, res, next) => {
  try {
    const riders = await User.find({ role: "rider" }).select("-password");
    res.json(riders);
  } catch (err) {
    next(err);
  }
};

export const updateRiderLocation = async (req, res, next) => {
  try {
    const { lat, lng } = req.body;

    if (req.user._id.toString() !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const rider = await User.findOneAndUpdate(
      { _id: req.params.id, role: "rider" },
      { currentLocation: { lat, lng } },
      { new: true }
    ).select("-password");

    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    req.app.get("io")?.emit("rider:location", { riderId: rider._id, lat, lng });

    res.json(rider);
  } catch (err) {
    next(err);
  }
};