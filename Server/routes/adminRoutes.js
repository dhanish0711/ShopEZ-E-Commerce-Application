import express from "express";
import {
  getAdminData,
  updateBanner,
  updateCategories,
  getDashboardStats,
  getAllUsers,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAdminData);                                  // Public admin data
router.get("/dashboard", protect, adminOnly, getDashboardStats); // Rich stats
router.get("/users", protect, adminOnly, getAllUsers);           // All users list
router.put("/banner", protect, adminOnly, updateBanner);        // Update banner
router.put("/categories", protect, adminOnly, updateCategories); // Update categories

export default router;
