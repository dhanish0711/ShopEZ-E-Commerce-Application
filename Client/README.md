# 💻 ShopEZ — Frontend Client (React + Vite)

This is the frontend single page application (SPA) for **ShopEZ**, built using **React 18** and **Vite** for optimized development speed and asset bundling.

---

## 📂 Directory Structure

```
Client/
├── 📁 public/                # Static assets (site favicon, etc.)
├── 📁 src/
│   ├── 📁 assets/            # Global images and logos
│   ├── 📁 components/        # Reusable presentation components
│   │   ├── AdminLayout.jsx   # Sidebar & Header wrapper for admin dashboard
│   │   ├── Footer.jsx        # App footer with copyright and quick links
│   │   ├── Navbar.jsx        # Navigation bar (conditional auth links)
│   │   └── ProductCard.jsx   # Catalog item with rating, wishlist toggle, and cart add
│   ├── 📁 context/
│   │   └── AuthContext.jsx   # Global Context provider for auth & user state
│   ├── 📁 pages/             # Route-specific page views
│   │   ├── Home.jsx          # Main landing page
│   │   ├── Products.jsx      # Product listing with search, filters & sort
│   │   ├── Login.jsx         # Sign-in page
│   │   ├── Register.jsx      # Sign-up page
│   │   ├── Cart.jsx          # Cart review page
│   │   ├── Profile.jsx       # Customer profile and order tracking list
│   │   ├── OrderDetails.jsx  # Finalize shipping address and payment method
│   │   └── 📁 admin/         # Administrative views
│   │       ├── AdminDashboard.jsx # Sales analytics charts, revenue stats
│   │       ├── AllOrders.jsx      # Global order list management
│   │       ├── AllProducts.jsx    # Complete product list editor
│   │       └── NewProduct.jsx     # Add new product form with live preview
│   ├── 📁 utils/
│   │   └── api.js            # Axios client instance with JWT request interceptor
│   ├── App.jsx               # Main router structure & route guards
│   ├── main.jsx              # Application mount point
│   └── index.css             # Vanilla CSS design system, typography & variables
├── index.html                # Page entrypoint HTML
├── vite.config.js            # Vite configuration with backend API proxy setup
└── package.json              # Client dependencies and npm scripts
```

---

## 🛠️ Tech Stack & Key Libraries

- **React 18 (SPA):** Leverages modern hook-based architecture (`useState`, `useEffect`, `useContext`, `useRef`, `useMemo`).
- **Vite:** High-performance dev server with Instant Hot Module Replacement (HMR) and optimized Rollup production builds.
- **React Router v6:** Declares routing paths and implements:
  - **ProtectedRoute:** Limits access to logged-in users only.
  - **AdminRoute:** Limits dashboard access to users with `usertype === 'admin'`.
- **Axios:** Handles HTTP requests, configured with an interceptor to automatically attach the JWT token (stored in `localStorage`) to all requests:
  ```js
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  ```
- **React Context API (`AuthContext`):** Shares authentication token, user information, and authentication status globally without prop drilling.

---

## 🎨 CSS Design System (`index.css`)

The application's aesthetics are custom-tailored using pure **Vanilla CSS** centered around CSS Custom Properties (Variables) for light/dark elements, responsive grids, and interactive transitions.

### Key Tokens (CSS Variables)
- **Primary Indigo Color:** `--primary: #4f46e5`
- **Secondary Pink Accent:** `--secondary: #ec4899`
- **Dark Text:** `--text-primary: #111827`
- **Light Slate Border:** `--border-color: #e5e7eb`
- **Layout Max Width:** `--max-width: 1280px`

### Design Techniques Used:
- **Glassmorphism:** Navigation menus and modals utilize semi-transparent backdrops (`backdrop-filter: blur(12px)`) for a modern premium feel.
- **Flexbox & CSS Grid:** Flexible grid layouts adapt flawlessly between mobile, tablet, and widescreen views.
- **Interactive Micro-animations:** Product cards, buttons, and navigation options feature subtle transitions (`transition: all 0.3s ease`) on user interaction.

---

## 🚀 Development Setup

Make sure the backend server is running, then start the Vite development server:

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Developer Mode
```bash
npm run dev
```

The app will launch at: `http://localhost:5173/`

### 3. Build for Production
To bundle the frontend application into optimized static assets (`dist/` folder):
```bash
npm run build
```

---

## 🔌 API Proxy Configuration

The file `vite.config.js` is preconfigured to bypass CORS issues during local development. All frontend requests initiated to `/api` are automatically proxied to the backend server at `http://localhost:5000`:

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    }
  }
}
```
