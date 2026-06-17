import express from "express";
import { getCartItems, addToCart, updateCartItem, removeFromCart, clearCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCartItems);
router.post("/", protect, addToCart);
router.put("/:id", protect, updateCartItem);
router.delete("/clear", protect, clearCart);
router.delete("/:id", protect, removeFromCart);

export default router;
