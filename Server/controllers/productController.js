import { Product } from "../models/Schema.js";

// GET /api/products — with server-side search, filter, sort
export const getAllProducts = async (req, res) => {
  try {
    const { category, gender, search, sort, minPrice, maxPrice } = req.query;
    let filter = {};

    // Search across multiple fields
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    // Exact match filters (case-insensitive)
    if (category) filter.category = { $regex: `^${category}$`, $options: "i" };
    if (gender) filter.gender = { $regex: `^${gender}$`, $options: "i" };

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Sort
    let sortQuery = { createdAt: -1 }; // newest first by default
    if (sort === "price_asc") sortQuery = { price: 1 };
    else if (sort === "price_desc") sortQuery = { price: -1 };
    else if (sort === "discount") sortQuery = { discount: -1, price: 1 };
    else if (sort === "name_asc") sortQuery = { title: 1 };

    const products = await Product.find(filter).sort(sortQuery).lean();

    // Expose total count for frontend awareness
    res.set("X-Total-Count", products.length);
    res.set("Access-Control-Expose-Headers", "X-Total-Count");

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json(product);
  } catch (error) {
    if (error.kind === "ObjectId") return res.status(400).json({ message: "Invalid product ID" });
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/products — Admin only
export const createProduct = async (req, res) => {
  try {
    const { title, description, mainImg, carousel, sizes, price, discount, gender, category } = req.body;

    // Validation
    if (!title?.trim()) return res.status(400).json({ message: "Product title is required" });
    if (!description?.trim()) return res.status(400).json({ message: "Product description is required" });
    if (!mainImg?.trim()) return res.status(400).json({ message: "Main image URL is required" });
    if (!price || isNaN(price) || price <= 0) return res.status(400).json({ message: "Valid price is required" });
    if (!gender) return res.status(400).json({ message: "Gender is required" });
    if (!category?.trim()) return res.status(400).json({ message: "Category is required" });

    const product = await Product.create({
      title: title.trim(),
      description: description.trim(),
      mainImg: mainImg.trim(),
      carousel: carousel || [],
      sizes: sizes || [],
      price: parseFloat(price),
      discount: parseFloat(discount) || 0,
      gender,
      category: category.trim(),
    });

    return res.status(201).json(product);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    return res.status(500).json({ message: error.message });
  }
};

// PUT /api/products/:id — Admin only
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE /api/products/:id — Admin only
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.deleteOne();
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") return res.status(400).json({ message: "Invalid product ID" });
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/products/categories — Distinct categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    return res.status(200).json(categories.filter(Boolean).sort());
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
