import { Admin, User, Product, Orders } from "../models/Schema.js";

// GET /api/admin/data
export const getAdminData = async (req, res) => {
  try {
    let adminData = await Admin.findOne();
    if (!adminData) adminData = await Admin.create({ banner: "", categories: [] });
    return res.status(200).json(adminData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/banner
export const updateBanner = async (req, res) => {
  try {
    let adminData = await Admin.findOne();
    if (!adminData) adminData = new Admin({ banner: "", categories: [] });
    adminData.banner = req.body.banner || adminData.banner;
    const updated = await adminData.save();
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/categories
export const updateCategories = async (req, res) => {
  try {
    let adminData = await Admin.findOne();
    if (!adminData) adminData = new Admin({ banner: "", categories: [] });
    adminData.categories = req.body.categories || adminData.categories;
    const updated = await adminData.save();
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/dashboard — Rich stats
export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, allOrders] = await Promise.all([
      User.countDocuments({ usertype: "user" }),
      Product.countDocuments(),
      Orders.find({}).lean(),
    ]);

    const totalOrders = allOrders.length;

    // Total revenue (applying discounts)
    const totalRevenue = allOrders.reduce((acc, o) => {
      const finalPrice = o.price - (o.price * (o.discount || 0)) / 100;
      return acc + finalPrice * (parseInt(o.quantity) || 1);
    }, 0);

    // Order status breakdown
    const statusBreakdown = allOrders.reduce((acc, o) => {
      const status = o.orderStatus || "order placed";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Orders in last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentOrders = allOrders.filter(
      (o) => o.createdAt && new Date(o.createdAt) > sevenDaysAgo
    ).length;

    // Monthly revenue (last 6 months)
    const monthlyRevenue = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
      monthlyRevenue[key] = 0;
    }
    allOrders.forEach((o) => {
      if (!o.createdAt) return;
      const d = new Date(o.createdAt);
      const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
      if (monthlyRevenue[key] !== undefined) {
        const finalPrice = o.price - (o.price * (o.discount || 0)) / 100;
        monthlyRevenue[key] += finalPrice * (parseInt(o.quantity) || 1);
      }
    });

    // Payment method breakdown
    const paymentBreakdown = allOrders.reduce((acc, o) => {
      const method = o.paymentMethod || "unknown";
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {});

    // Top sold products (by occurrence in orders)
    const productCount = {};
    allOrders.forEach((o) => {
      if (o.title) productCount[o.title] = (productCount[o.title] || 0) + 1;
    });
    const topProducts = Object.entries(productCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([title, count]) => ({ title, count }));

    return res.status(200).json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: Math.round(totalRevenue),
      statusBreakdown,
      recentOrders,
      monthlyRevenue,
      paymentBreakdown,
      topProducts,
      pendingOrders: (statusBreakdown["order placed"] || 0) + (statusBreakdown["processing"] || 0),
      deliveredOrders: statusBreakdown["delivered"] || 0,
      shippedOrders: statusBreakdown["shipped"] || 0,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/users — List all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ usertype: "user" })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
