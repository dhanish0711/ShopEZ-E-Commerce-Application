# 📋 System & Software Requirements — ShopEZ

This document outlines the software versions, hardware specifications, and system environments required to develop, build, and deploy the **ShopEZ** E-Commerce Application.

---

## 🛠️ Software Prerequisites

Ensure you have the following software installed on your development machine:

### 1. Runtime Environment
* **Node.js**: `v18.0.0` or higher (LTS recommended).
  * *To check your version, run:* `node -v`

### 2. Package Manager
* **npm (Node Package Manager)**: `v9.0.0` or higher (comes bundled with Node.js).
  * *To check your version, run:* `npm -v`

### 3. Database
* **MongoDB**:
  * **MongoDB Atlas (Cloud)**: Shared cluster tier (M0) or higher (Recommended).
  * **MongoDB Community Server (Local)**: `v6.0` or higher (if running database locally on port `27017`).

### 4. Version Control
* **Git**: `v2.30.0` or higher (for cloning the repository and managing branches).

---

## 💻 Hardware Requirements

### Minimum Specifications:
* **Processor**: Dual-Core CPU 2.0 GHz
* **RAM**: 4 GB (8 GB recommended for running both Vite HMR and Express dev servers concurrently with MongoDB connections)
* **Disk Space**: ~500 MB free space (excluding `node_modules` cache)
* **Network**: Active internet connection (required for MongoDB Atlas connection and API package installations)

---

## 🚦 Network & Port Configurations

Ensure the following local ports are free and not occupied by other services:

| Port | Service | Description |
|---|---|---|
| **`5173`** | React Client | Local development server for the Vite frontend |
| **`5000`** | Express Server | Local REST API server (can be overridden via `PORT` in `.env`) |
| **`27017`** | MongoDB Local | Only required if you are not using MongoDB Atlas cloud URI |

---

## 🌐 Browser Compatibility

The frontend is built using standard responsive design patterns and modern CSS/ES6 features. It is fully compatible with the latest stable versions of:

* **Google Chrome** (v90+)
* **Mozilla Firefox** (v90+)
* **Apple Safari** (v14+)
* **Microsoft Edge** (v90+)
