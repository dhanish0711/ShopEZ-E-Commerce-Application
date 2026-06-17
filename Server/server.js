import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// ─── Compression ─────────────────────────────────────────────────────────────
app.use(compression());

// ─── HTTP Logging ─────────────────────────────────────────────────────────────
app.use(morgan("dev"));

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["X-Total-Count"],
}));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests from this IP, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please wait 15 minutes before trying again." },
});

app.use("/api", apiLimiter);
app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK ✅",
    app: "ShopEZ API",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(1)}s`,
    environment: process.env.NODE_ENV || "development",
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// ─── Root ─────────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "🛒 ShopEZ API v2.0",
    endpoints: {
      health: "GET /api/health",
      users: "POST /api/users/register | POST /api/users/login",
      products: "GET /api/products | POST /api/products (admin)",
      cart: "GET /api/cart | POST /api/cart",
      orders: "POST /api/orders | GET /api/orders/myorders",
      admin: "GET /api/admin/dashboard (admin only)",
    },
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route '${req.originalUrl}' not found.` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const statusCode = err.status || (res.statusCode === 200 ? 500 : res.statusCode);
  console.error(`💥 [${new Date().toISOString()}] ${err.message}`);
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("\n" + "═".repeat(52));
  console.log(`  🚀  ShopEZ API v2.0 → http://localhost:${PORT}`);
  console.log(`  🏥  Health Check  → http://localhost:${PORT}/api/health`);
  console.log("═".repeat(52) + "\n");
});
