import express from "express";
import { getRiders, updateRiderLocation } from "../controllers/riderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", authorize("admin"), getRiders);
router.patch("/:id/location", authorize("admin", "rider"), updateRiderLocation);

export default router;