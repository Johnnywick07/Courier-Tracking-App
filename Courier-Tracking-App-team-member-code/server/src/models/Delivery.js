import mongoose from "mongoose";

export const DELIVERY_STAGES = [
  "created",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "failed",
];

const statusLogSchema = new mongoose.Schema(
  {
    status: { type: String, enum: DELIVERY_STAGES, required: true },
    note: { type: String, trim: true },
    location: {
      lat: Number,
      lng: Number,
      label: String,
    },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const partySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  { _id: false }
);

const deliverySchema = new mongoose.Schema(
  {
    trackingId: { type: String, required: true, unique: true },
    sender: { type: partySchema, required: true },
    receiver: { type: partySchema, required: true },
    parcel: {
      description: { type: String, required: true },
      weightKg: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: DELIVERY_STAGES,
      default: "created",
    },
    assignedRider: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    statusHistory: { type: [statusLogSchema], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

deliverySchema.pre("validate", function (next) {
  if (!this.trackingId) {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    this.trackingId = `TRK-${year}-${random}`;
  }
  next();
});

export default mongoose.model("Delivery", deliverySchema);