import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User, Product, Orders, Cart, Admin } from './models/Schema.js';

dotenv.config();

// ─── 30 Products ────────────────────────────────────────────────────────────
const products = [
  // ── MEN ──
  {
    title: "Classic White Cotton T-Shirt",
    description: "Premium 100% organic cotton t-shirt with a comfortable relaxed fit. Breathable fabric perfect for everyday casual wear. Pre-shrunk and fade-resistant for lasting quality.",
    mainImg: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    carousel: ["https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&q=80"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    category: "T-Shirts", gender: "men", price: 599, discount: 10
  },
  {
    title: "Navy Blue Polo Shirt",
    description: "Classic pique-knit polo shirt in rich navy blue. Features a 3-button placket, ribbed collar, and cuffs. Versatile enough for casual and semi-formal occasions.",
    mainImg: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&q=80",
    carousel: [],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "Polo Shirts", gender: "men", price: 849, discount: 0
  },
  {
    title: "Oxford Formal Cotton Shirt",
    description: "Classic Oxford formal shirt from premium 2-ply cotton. Button-down collar, tailored slim fit, and double-button adjustable cuffs. Perfect for the office.",
    mainImg: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80",
    carousel: [],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "Shirts", gender: "men", price: 899, discount: 10
  },
  {
    title: "Slim Fit Stretch Jeans",
    description: "Modern slim fit jeans crafted from premium stretch denim for all-day comfort. Classic 5-pocket design with clean finishing. Machine washable and durable.",
    mainImg: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80",
    carousel: [],
    sizes: ["28", "30", "32", "34", "36", "38"],
    category: "Jeans", gender: "men", price: 1499, discount: 20
  },
  {
    title: "Cargo Jogger Pants",
    description: "Versatile cargo jogger pants with elastic waistband and multiple utility pockets. Made from soft cotton-blend fabric. Great for workouts or casual outings.",
    mainImg: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500&q=80",
    carousel: [],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "Trousers", gender: "men", price: 1199, discount: 15
  },
  {
    title: "Cozy Fleece Hoodie",
    description: "Ultra-soft polar fleece hoodie. Kangaroo pocket, adjustable drawstring hood, and ribbed cuffs. Great layering piece for any season.",
    mainImg: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&q=80",
    carousel: [],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    category: "Hoodies", gender: "men", price: 1299, discount: 15
  },
  {
    title: "Classic Denim Jacket",
    description: "Timeless stonewashed denim jacket with relaxed fit. Button front closure, chest pockets, and adjustable side tabs. A wardrobe essential for every man.",
    mainImg: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500&q=80",
    carousel: [],
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Jackets", gender: "men", price: 1899, discount: 12
  },
  {
    title: "Pro Runner Athletic Shoes",
    description: "High-performance running shoes with responsive foam cushioning and breathable knit upper. Anti-slip rubber outsole provides superior traction on all terrains.",
    mainImg: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80",
    carousel: [],
    sizes: ["UK6", "UK7", "UK8", "UK9", "UK10", "UK11"],
    category: "Footwear", gender: "men", price: 2999, discount: 20
  },
  {
    title: "Leather Formal Derby Shoes",
    description: "Premium genuine leather derby shoes with cushioned insole and non-slip rubber outsole. Classic cap-toe design with fine stitching. Ideal for formal occasions.",
    mainImg: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=500&q=80",
    carousel: [],
    sizes: ["UK6", "UK7", "UK8", "UK9", "UK10"],
    category: "Footwear", gender: "men", price: 3499, discount: 25
  },
  {
    title: "Sports Performance Shorts",
    description: "Lightweight moisture-wicking shorts engineered for peak athletic performance. Built-in compression liner and zip pocket. Perfect for gym and outdoor sports.",
    mainImg: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=500&q=80",
    carousel: [],
    sizes: ["S", "M", "L", "XL"],
    category: "Activewear", gender: "men", price: 549, discount: 0
  },

  // ── WOMEN ──
  {
    title: "Floral Wrap Summer Dress",
    description: "Beautiful floral wrap dress for summer outings. Flattering V-neckline, midi length, and lightweight chiffon fabric. Makes a statement at any outdoor event.",
    mainImg: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80",
    carousel: [],
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Dresses", gender: "women", price: 1299, discount: 15
  },
  {
    title: "Embroidered Anarkali Kurta",
    description: "Hand-embroidered Anarkali kurta with intricate floral motifs. Breathable cotton-silk blend with flared silhouette. Comes with matching dupatta. Festival perfect.",
    mainImg: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&q=80",
    carousel: [],
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Ethnic Wear", gender: "women", price: 1599, discount: 20
  },
  {
    title: "Handwoven Banarasi Silk Saree",
    description: "Traditional handwoven Banarasi silk saree with intricate zari gold border. Crafted by master weavers. Comes with matching unstitched blouse piece.",
    mainImg: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80",
    carousel: [],
    sizes: ["Free Size"],
    category: "Sarees", gender: "women", price: 3999, discount: 15
  },
  {
    title: "Premium Leather Tote Bag",
    description: "Spacious full-grain leather tote bag. Multiple interior pockets, magnetic closure, adjustable shoulder strap. From boardroom to brunch, effortlessly stylish.",
    mainImg: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80",
    carousel: [],
    sizes: ["One Size"],
    category: "Bags", gender: "women", price: 2499, discount: 25
  },
  {
    title: "Gold Drop Earrings Set",
    description: "Elegant gold-plated drop earring set — 3 pairs of varying lengths. Hypoallergenic, nickel-free, tarnish-resistant. Presented in a premium gift box.",
    mainImg: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80",
    carousel: [],
    sizes: ["One Size"],
    category: "Jewelry", gender: "women", price: 399, discount: 0
  },
  {
    title: "High-Waist Yoga Leggings",
    description: "Performance compression yoga leggings from 4-way stretch moisture-wicking fabric. Hidden waistband pocket, flatlock seams. Squat-proof and ultra comfortable.",
    mainImg: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&q=80",
    carousel: [],
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Activewear", gender: "women", price: 899, discount: 5
  },
  {
    title: "Silk Blend Printed Scarf",
    description: "Luxurious silk-blend scarf with hand-rolled edges and vibrant digital print. Wear as headscarf, necktie, or bag accessory. A versatile wardrobe staple.",
    mainImg: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&q=80",
    carousel: [],
    sizes: ["One Size"],
    category: "Accessories", gender: "women", price: 699, discount: 0
  },
  {
    title: "Block Print Cotton Kurti",
    description: "Traditional block-print cotton kurti with mandarin collar. Hand-crafted by artisans using natural dyes. Breathable for all-day comfort. Pair with jeans or palazzos.",
    mainImg: "https://images.unsplash.com/photo-1564596489416-13b2bf07c34a?w=500&q=80",
    carousel: [],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    category: "Ethnic Wear", gender: "women", price: 799, discount: 10
  },
  {
    title: "Power Formal Blazer",
    description: "Sharp tailored blazer in structured ponte fabric. Single-button closure, notch lapel, and side pockets. Elevates any outfit from casual to boardroom-ready.",
    mainImg: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=500&q=80",
    carousel: [],
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Jackets", gender: "women", price: 2199, discount: 20
  },
  {
    title: "Block Heel Platform Pumps",
    description: "Elegant block heel platform pumps in faux leather. 3-inch heel with cushioned insole for all-day comfort. Available in classic black with pointed toe.",
    mainImg: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80",
    carousel: [],
    sizes: ["UK3", "UK4", "UK5", "UK6", "UK7"],
    category: "Footwear", gender: "women", price: 1999, discount: 30
  },

  // ── UNISEX ──
  {
    title: "Unisex Fleece Zip-Up Hoodie",
    description: "Gender-neutral zip-up hoodie in premium fleece. Full-length zipper, kangaroo pockets, and drawstring hood. The ultimate cozy layering piece.",
    mainImg: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80",
    carousel: [],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    category: "Hoodies", gender: "unisex", price: 1199, discount: 15
  },
  {
    title: "Canvas Travel Backpack",
    description: "Spacious 30L canvas backpack with padded laptop sleeve (fits 15\"), multiple organizer pockets, and reinforced base. Waterproof-coated exterior. Perfect for travel and college.",
    mainImg: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
    carousel: [],
    sizes: ["One Size"],
    category: "Bags", gender: "unisex", price: 1299, discount: 10
  },
  {
    title: "Polarized Sports Sunglasses",
    description: "UV400 polarized lenses in lightweight TR90 frames. Scratch-resistant coating, wraparound design, and rubberized nose pads for secure fit. Ideal for outdoor activities.",
    mainImg: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80",
    carousel: [],
    sizes: ["One Size"],
    category: "Accessories", gender: "unisex", price: 599, discount: 0
  },
  {
    title: "Smart Fitness Tracker Band",
    description: "Advanced fitness tracker with heart rate monitor, step counter, sleep tracking, and 7-day battery life. Water-resistant (IP67). Compatible with iOS and Android.",
    mainImg: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80",
    carousel: [],
    sizes: ["S/M", "L/XL"],
    category: "Electronics", gender: "unisex", price: 1499, discount: 20
  },
  {
    title: "Cotton Graphic Printed Cap",
    description: "Adjustable structured cap in 100% brushed cotton twill. Embroidered logo, curved brim, and moisture-wicking sweatband. One size fits most.",
    mainImg: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80",
    carousel: [],
    sizes: ["One Size"],
    category: "Accessories", gender: "unisex", price: 349, discount: 0
  },

  // ── KIDS ──
  {
    title: "Kids Canvas Sneakers",
    description: "Durable canvas sneakers for active kids. Non-slip rubber sole for excellent grip. Easy velcro closure for quick on/off. Available in fun colors.",
    mainImg: "https://images.unsplash.com/photo-1555661530-68c8e98db4e6?w=500&q=80",
    carousel: [],
    sizes: ["UK2", "UK3", "UK4", "UK5", "UK6"],
    category: "Footwear", gender: "kids", price: 799, discount: 10
  },
  {
    title: "Kids Puffer Winter Jacket",
    description: "Super warm puffer jacket with water-resistant ripstop outer shell and high-loft insulation. Detachable hood and zippered pockets. Built for cold adventures.",
    mainImg: "https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=500&q=80",
    carousel: [],
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
    category: "Jackets", gender: "kids", price: 1999, discount: 30
  },
  {
    title: "Boys Dino Graphic T-Shirt",
    description: "Fun vibrant dinosaur-print t-shirt for boys. Soft cotton jersey with crew neck and short sleeves. Colorfast, machine washable, and sized for active play.",
    mainImg: "https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=500&q=80",
    carousel: [],
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y"],
    category: "T-Shirts", gender: "kids", price: 349, discount: 0
  },
  {
    title: "Girls Floral Frock Dress",
    description: "Adorable floral-print frock dress for girls. Features a smocked bodice, flutter sleeves, and full skirt. Soft cotton fabric for all-day comfort at parties or school.",
    mainImg: "https://images.unsplash.com/photo-1476234251651-f353703a034d?w=500&q=80",
    carousel: [],
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
    category: "Dresses", gender: "kids", price: 549, discount: 15
  },
  {
    title: "Kids School Trolley Bag",
    description: "Ergonomic trolley school bag with padded shoulder straps, extendable handle, and smooth-glide wheels. Multiple compartments. Lightweight and durable for daily use.",
    mainImg: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
    carousel: [],
    sizes: ["One Size"],
    category: "Bags", gender: "kids", price: 999, discount: 20
  },
  {
    title: "Kids Waterproof Rain Jacket",
    description: "Fully waterproof and windproof rain jacket for kids. Sealed seams, adjustable hood, and reflective strips for safety. Folds into its own pocket for easy packing.",
    mainImg: "https://images.unsplash.com/photo-1503455637927-730bce8583c0?w=500&q=80",
    carousel: [],
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y"],
    category: "Jackets", gender: "kids", price: 1299, discount: 20
  },
];

// ─── Sample Users ───────────────────────────────────────────────────────────
const sampleUsers = [
  { username: 'Rahul Sharma', email: 'rahul@example.com', password: 'user123', usertype: 'user' },
  { username: 'Priya Patel', email: 'priya@example.com', password: 'user123', usertype: 'user' },
  { username: 'Arjun Mehta', email: 'arjun@example.com', password: 'user123', usertype: 'user' },
];

// ─── Sample Orders (after products/users are inserted) ──────────────────────
const buildOrders = (users, prods) => {
  const now = new Date();
  const daysAgo = (n) => new Date(now - n * 86400000).toLocaleDateString('en-IN');
  const deliveryDate = (n) => new Date(now.getTime() + n * 86400000).toLocaleDateString('en-IN');

  return [
    {
      userId: users[0]._id, name: 'Rahul Sharma', email: 'rahul@example.com',
      mobile: '9876543210', address: '12, MG Road, Koramangala', pincode: '560034',
      title: prods[0].title, description: prods[0].description, mainImg: prods[0].mainImg,
      size: 'L', quantity: 2, price: 539, discount: prods[0].discount,
      paymentMethod: 'COD', orderDate: daysAgo(10), deliveryDate: daysAgo(3),
      orderStatus: 'delivered',
    },
    {
      userId: users[0]._id, name: 'Rahul Sharma', email: 'rahul@example.com',
      mobile: '9876543210', address: '12, MG Road, Koramangala', pincode: '560034',
      title: prods[7].title, description: prods[7].description, mainImg: prods[7].mainImg,
      size: 'UK9', quantity: 1, price: 2399, discount: prods[7].discount,
      paymentMethod: 'online', orderDate: daysAgo(5), deliveryDate: deliveryDate(2),
      orderStatus: 'shipped',
    },
    {
      userId: users[0]._id, name: 'Rahul Sharma', email: 'rahul@example.com',
      mobile: '9876543210', address: '12, MG Road, Koramangala', pincode: '560034',
      title: prods[3].title, description: prods[3].description, mainImg: prods[3].mainImg,
      size: '32', quantity: 1, price: 1199, discount: prods[3].discount,
      paymentMethod: 'online', orderDate: daysAgo(1), deliveryDate: deliveryDate(6),
      orderStatus: 'order placed',
    },
    {
      userId: users[1]._id, name: 'Priya Patel', email: 'priya@example.com',
      mobile: '9123456789', address: '45, Bandra West, Mumbai', pincode: '400050',
      title: prods[10].title, description: prods[10].description, mainImg: prods[10].mainImg,
      size: 'M', quantity: 1, price: 1104, discount: prods[10].discount,
      paymentMethod: 'online', orderDate: daysAgo(15), deliveryDate: daysAgo(8),
      orderStatus: 'delivered',
    },
    {
      userId: users[1]._id, name: 'Priya Patel', email: 'priya@example.com',
      mobile: '9123456789', address: '45, Bandra West, Mumbai', pincode: '400050',
      title: prods[13].title, description: prods[13].description, mainImg: prods[13].mainImg,
      size: 'One Size', quantity: 1, price: 1874, discount: prods[13].discount,
      paymentMethod: 'online', orderDate: daysAgo(20), deliveryDate: daysAgo(13),
      orderStatus: 'delivered',
    },
    {
      userId: users[1]._id, name: 'Priya Patel', email: 'priya@example.com',
      mobile: '9123456789', address: '45, Bandra West, Mumbai', pincode: '400050',
      title: prods[11].title, description: prods[11].description, mainImg: prods[11].mainImg,
      size: 'S', quantity: 1, price: 1279, discount: prods[11].discount,
      paymentMethod: 'COD', orderDate: daysAgo(3), deliveryDate: deliveryDate(4),
      orderStatus: 'processing',
    },
    {
      userId: users[1]._id, name: 'Priya Patel', email: 'priya@example.com',
      mobile: '9123456789', address: '45, Bandra West, Mumbai', pincode: '400050',
      title: prods[18].title, description: prods[18].description, mainImg: prods[18].mainImg,
      size: 'S', quantity: 1, price: 1759, discount: prods[18].discount,
      paymentMethod: 'online', orderDate: daysAgo(2), deliveryDate: deliveryDate(5),
      orderStatus: 'order placed',
    },
    {
      userId: users[2]._id, name: 'Arjun Mehta', email: 'arjun@example.com',
      mobile: '9988776655', address: '78, Connaught Place, New Delhi', pincode: '110001',
      title: prods[6].title, description: prods[6].description, mainImg: prods[6].mainImg,
      size: 'L', quantity: 1, price: 1671, discount: prods[6].discount,
      paymentMethod: 'COD', orderDate: daysAgo(8), deliveryDate: daysAgo(1),
      orderStatus: 'delivered',
    },
    {
      userId: users[2]._id, name: 'Arjun Mehta', email: 'arjun@example.com',
      mobile: '9988776655', address: '78, Connaught Place, New Delhi', pincode: '110001',
      title: prods[21].title, description: prods[21].description, mainImg: prods[21].mainImg,
      size: 'One Size', quantity: 2, price: 1169, discount: prods[21].discount,
      paymentMethod: 'online', orderDate: daysAgo(12), deliveryDate: daysAgo(5),
      orderStatus: 'delivered',
    },
    {
      userId: users[2]._id, name: 'Arjun Mehta', email: 'arjun@example.com',
      mobile: '9988776655', address: '78, Connaught Place, New Delhi', pincode: '110001',
      title: prods[23].title, description: prods[23].description, mainImg: prods[23].mainImg,
      size: 'S/M', quantity: 1, price: 1199, discount: prods[23].discount,
      paymentMethod: 'online', orderDate: daysAgo(4), deliveryDate: deliveryDate(3),
      orderStatus: 'shipped',
    },
    {
      userId: users[2]._id, name: 'Arjun Mehta', email: 'arjun@example.com',
      mobile: '9988776655', address: '78, Connaught Place, New Delhi', pincode: '110001',
      title: prods[4].title, description: prods[4].description, mainImg: prods[4].mainImg,
      size: 'XL', quantity: 1, price: 1019, discount: prods[4].discount,
      paymentMethod: 'COD', orderDate: daysAgo(0), deliveryDate: deliveryDate(7),
      orderStatus: 'order placed',
    },
    {
      userId: users[0]._id, name: 'Rahul Sharma', email: 'rahul@example.com',
      mobile: '9876543210', address: '12, MG Road, Koramangala, Bengaluru', pincode: '560034',
      title: prods[25].title, description: prods[25].description, mainImg: prods[25].mainImg,
      size: '6-7Y', quantity: 1, price: 1399, discount: prods[25].discount,
      paymentMethod: 'online', orderDate: daysAgo(30), deliveryDate: daysAgo(23),
      orderStatus: 'delivered',
    },
    {
      userId: users[1]._id, name: 'Priya Patel', email: 'priya@example.com',
      mobile: '9123456789', address: '45, Bandra West, Mumbai', pincode: '400050',
      title: prods[12].title, description: prods[12].description, mainImg: prods[12].mainImg,
      size: 'Free Size', quantity: 1, price: 3399, discount: prods[12].discount,
      paymentMethod: 'online', orderDate: daysAgo(7), deliveryDate: deliveryDate(1),
      orderStatus: 'shipped',
    },
    {
      userId: users[2]._id, name: 'Arjun Mehta', email: 'arjun@example.com',
      mobile: '9988776655', address: '78, Connaught Place, New Delhi', pincode: '110001',
      title: prods[2].title, description: prods[2].description, mainImg: prods[2].mainImg,
      size: 'L', quantity: 2, price: 809, discount: prods[2].discount,
      paymentMethod: 'COD', orderDate: daysAgo(25), deliveryDate: daysAgo(18),
      orderStatus: 'delivered',
    },
    {
      userId: users[1]._id, name: 'Priya Patel', email: 'priya@example.com',
      mobile: '9123456789', address: '45, Bandra West, Mumbai', pincode: '400050',
      title: prods[17].title, description: prods[17].description, mainImg: prods[17].mainImg,
      size: 'M', quantity: 2, price: 719, discount: prods[17].discount,
      paymentMethod: 'COD', orderDate: daysAgo(6), deliveryDate: deliveryDate(1),
      orderStatus: 'processing',
    },
  ];
};

// ─── Admin Document ─────────────────────────────────────────────────────────
const adminDoc = {
  banner: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80",
  categories: ["T-Shirts", "Jeans", "Dresses", "Ethnic Wear", "Hoodies", "Jackets", "Footwear", "Bags", "Jewelry", "Accessories", "Activewear", "Sarees", "Electronics", "Trousers", "Polo Shirts"]
};

// ─── Main Seed Function ─────────────────────────────────────────────────────
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('\n✅ MongoDB Connected\n');

    // Clear all collections
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      Product.deleteMany({}),
      Orders.deleteMany({}),
      Cart.deleteMany({}),
      Admin.deleteMany({}),
    ]);

    // Preserve admin user, clear sample users
    await User.deleteMany({ usertype: 'user' });
    console.log('   ✓ Cleared products, orders, cart, admin docs, sample users');

    // ── Create Admin User ──
    let adminUser = await User.findOne({ email: 'admin@shopez.com' });
    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      adminUser = await User.create({
        username: 'ShopEZ Admin',
        email: 'admin@shopez.com',
        password: await bcrypt.hash('admin123', salt),
        usertype: 'admin'
      });
      console.log('   ✓ Admin user created: admin@shopez.com / admin123');
    } else {
      console.log('   ✓ Admin user already exists');
    }

    // ── Create Sample Users ──
    console.log('\n👥 Creating sample users...');
    const salt = await bcrypt.genSalt(10);
    const createdUsers = [];
    for (const u of sampleUsers) {
      const user = await User.create({
        ...u,
        password: await bcrypt.hash(u.password, salt)
      });
      createdUsers.push(user);
      console.log(`   ✓ ${u.username} (${u.email})`);
    }

    // ── Insert Products ──
    console.log('\n🛍️  Inserting products...');
    const createdProducts = await Product.insertMany(products);
    console.log(`   ✓ ${createdProducts.length} products inserted`);

    // ── Create Admin Document ──
    await Admin.create(adminDoc);
    console.log('\n⚙️   Admin document created (banner + categories)');

    // ── Create Orders ──
    console.log('\n📦 Creating sample orders...');
    const ordersData = buildOrders(createdUsers, createdProducts);
    const createdOrders = await Orders.insertMany(ordersData);
    console.log(`   ✓ ${createdOrders.length} orders created`);

    // ── Summary ──
    console.log('\n' + '═'.repeat(50));
    console.log('🚀 Database seeded successfully!\n');
    console.log('📊 Summary:');
    console.log(`   • Products   : ${createdProducts.length}`);
    console.log(`   • Users      : ${createdUsers.length} sample + 1 admin`);
    console.log(`   • Orders     : ${createdOrders.length}`);
    console.log('\n🔑 Login Credentials:');
    console.log('   Admin  → admin@shopez.com / admin123');
    console.log('   User 1 → rahul@example.com / user123');
    console.log('   User 2 → priya@example.com / user123');
    console.log('   User 3 → arjun@example.com / user123');
    console.log('═'.repeat(50) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seedDB();
