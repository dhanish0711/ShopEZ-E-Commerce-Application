import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);                            // GET all (with filters/sort/search)
router.get("/categories", getCategories);                  // GET distinct categories
router.get("/:id", getProductById);                        // GET single product
router.post("/", protect, adminOnly, createProduct);       // CREATE — admin only
router.put("/:id", protect, adminOnly, updateProduct);     // UPDATE — admin only
router.delete("/:id", protect, adminOnly, deleteProduct);  // DELETE — admin only

export default router;
