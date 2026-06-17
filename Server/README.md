# ⚙️ ShopEZ — Backend API Server (Node + Express)

This is the backend API server for **ShopEZ**, built using **Node.js**, **Express.js (v5)**, and **MongoDB Atlas** for database management. It follows the MVC (Model-View-Controller) design pattern and features authentication guards, request rate-limiters, security headers, and compression.

---

## 📂 Directory Structure

```
Server/
├── 📁 config/
│   └── db.js                 # MongoDB database connection configuration
├── 📁 controllers/           # MVC Controllers (contains business logic)
│   ├── adminController.js    # Store statistics, revenue charts, user administration
│   ├── cartController.js     # Add, edit, remove items, and checkout carts
│   ├── orderController.js    # Place orders, view myorders, update order status
│   ├── productController.js  # Query all products, filter, search, CRUD operations
│   └── userController.js     # User registration, login verification, profile details
├── 📁 middleware/            # Custom express middlewares
│   └── authMiddleware.js     # Route protectors: jwt validation & admin check
├── 📁 models/                # Database schemas & ODM representations
│   └── Schema.js             # User, Admin, Product, Order, and Cart models
├── 📁 routes/                # Endpoint routers
│   ├── adminRoutes.js        # /api/admin/* paths
│   ├── cartRoutes.js         # /api/cart/* paths
│   ├── orderRoutes.js        # /api/orders/* paths
│   ├── productRoutes.js      # /api/products/* paths
│   └── userRoutes.js         # /api/users/* paths
├── server.js                 # Server entrypoint (Express instance & global middlewares)
├── seed.js                   # Seed script to populate initial mock database data
├── .env.example              # Template config file for environment variables
└── package.json              # Backend dependencies and node scripts
```

---

## 🏗️ Core Architecture (MVC Pattern)

Requests to the backend API navigate through a modular architecture:

```
[HTTP Request] ──> [server.js] ──> [Routes Router] ──> [Middlewares (Auth/Rate-Limit)] ──> [Controller] ──> [Mongoose Models] ──> [MongoDB Database]
```

1. **Routing Layer (`/routes`):** Receives HTTP request and directs it to the appropriate controller based on endpoint path and method.
2. **Middleware Layer (`/middleware`):** Validates authentication tokens, verifies scopes (e.g. check if user has admin privileges), and enforces rate-limits before hitting route controllers.
3. **Controller Layer (`/controllers`):** Houses the core business logic. Extracts request body parameters, issues queries, and formats the response.
4. **Data Layer (`/models`):** Structures MongoDB documents using Mongoose schemas. Handles validations and data hooks.

---

## 🛡️ Middlewares & Security Pipeline

The server applies standard production safeguards:

- **Authentication Guard (`authMiddleware.js`):**
  - **`protect` Middleware:** Decodes and verifies the incoming JSON Web Token (JWT) sent via the `Authorization: Bearer <token>` header, attaching the user payload to the request (`req.user`).
  - **`adminOnly` Middleware:** Blocks requests if `req.user.usertype !== 'admin'`, returning a `403 Forbidden` response.
- **HTTP Security Headers (`helmet`):** Secures HTTP response headers to prevent clickjacking, XSS, and MIME-sniffing attacks.
- **Request Rate Limiter (`express-rate-limit`):** 
  - Restricts general API requests to **300 queries per 15 minutes** per IP address.
  - Restricts auth-heavy routes (login/register) to **30 queries per 15 minutes** to prevent brute-force attacks.
- **Compression (`compression`):** Optimizes performance by utilizing Gzip algorithm on response payloads.

---

## 🌱 Database Seeding (`seed.js`)

To easily test the application's features (such as user histories, active wishlists, and sales charts), a seed script is provided.

```bash
# Run from Server/ or root directory
npm run seed
```

### What the Seed Script Accomplishes:
1. **Clears Existing Data:** Wipes the Mongoose collections to avoid unique validation conflicts.
2. **Populates Products:** Inserts 31 distinct products across categories like Fashion, Electronics, Footwear, and Accessories.
3. **Registers Users:** Generates three default users with hashed passwords and one admin profile.
4. **Fills Orders & Cart:** Places historical orders linked to users, establishing metrics for dashboard charts.

---

## 🚀 Server Setup

### 1. Configure Environment Variables
Create a `.env` file in the `Server/` directory and configure the variables:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shopez
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Backend (Development Mode)
Starts the backend using `nodemon` for hot-reloads on file changes:
```bash
npm run dev
```

The server will launch at: `http://localhost:5000/`
Health status checking is available at: `http://localhost:5000/api/health`
