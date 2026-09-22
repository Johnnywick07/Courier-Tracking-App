import express from "express";
import {
  createDelivery,
  getDeliveries,
  getDeliveryByTrackingId,
  assignRider,
  updateStatus,
} from "../controllers/deliveryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/track/:trackingId", getDeliveryByTrackingId);

router.use(protect);

router.post("/", authorize("admin"), createDelivery);
router.get("/", authorize("admin", "rider"), getDeliveries);
router.patch("/:id/assign", authorize("admin"), assignRider);
router.patch("/:id/status", authorize("admin", "rider"), updateStatus);

export default router;