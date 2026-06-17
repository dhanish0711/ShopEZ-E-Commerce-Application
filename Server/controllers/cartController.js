import { Cart } from "../models/Schema.js";

export const getCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user._id });
    return res.status(200).json(cartItems);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { title, description, mainImg, size, quantity, price, discount } = req.body;
    if (!title || !price)
      return res.status(400).json({ message: "Title and price are required" });
    const cartItem = await Cart.create({ userId: req.user._id, title, description, mainImg, size, quantity: quantity || 1, price, discount: discount || 0 });
    return res.status(201).json(cartItem);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const cartItem = await Cart.findOne({ _id: req.params.id, userId: req.user._id });
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });
    cartItem.quantity = req.body.quantity || cartItem.quantity;
    cartItem.size = req.body.size || cartItem.size;
    const updated = await cartItem.save();
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const cartItem = await Cart.findOne({ _id: req.params.id, userId: req.user._id });
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });
    await cartItem.deleteOne();
    return res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user._id });
    return res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
