const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    mainImg: {
      type: String,
    },
    size: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "online"],
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    deliveryDate: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
