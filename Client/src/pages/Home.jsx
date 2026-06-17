import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import API from '../utils/api';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiHeadphones, FiStar } from 'react-icons/fi';

const HERO_IMGS = [
  { src: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80', label: 'Hoodies' },
  { src: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80', label: 'Dresses' },
  { src: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80', label: 'Jeans' },
  { src: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80', label: 'Shoes' },
];

const CATEGORIES = [
  { name: 'Men', icon: '👔', sub: 'Shirts, Jeans & More', gender: 'men' },
  { name: 'Women', icon: '👗', sub: 'Dresses, Ethnic & More', gender: 'women' },
  { name: 'Kids', icon: '🧒', sub: 'Fun & Comfortable', gender: 'kids' },
  { name: 'Unisex', icon: '✨', sub: 'For Everyone', gender: 'unisex' },
  { name: 'Footwear', icon: '👟', sub: 'Shoes & Sneakers', cat: 'Footwear' },
  { name: 'Jewelry', icon: '💍', sub: 'Accessories', cat: 'Jewelry' },
];

const FEATURES = [
  { icon: <FiTruck size={22} />, title: 'Free Shipping', desc: 'On orders above ₹499' },
  { icon: <FiShield size={22} />, title: 'Secure Payment', desc: '100% safe & protected' },
  { icon: <FiRefreshCw size={22} />, title: 'Easy Returns', desc: '7-day hassle-free returns' },
  { icon: <FiHeadphones size={22} />, title: '24/7 Support', desc: 'Always here to help' },
];

const TESTIMONIALS = [
  { text: '"ShopEZ transformed my shopping experience! Found the perfect gift for my friend in minutes. Absolutely love it!"', name: 'Sarah K.', role: 'Regular Customer', rating: 5, init: 'S' },
  { text: '"Best deals and fastest delivery. The quality of products is exactly as described. Highly recommend to everyone!"', name: 'Rahul M.', role: 'Verified Buyer', rating: 5, init: 'R' },
  { text: '"The admin dashboard is incredibly powerful. Managing my store has never been this easy and efficient."', name: 'Priya D.', role: 'Seller Partner', rating: 5, init: 'P' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/products').then(res => {
      setProducts(res.data.slice(0, 8));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar cartCount={cartCount} />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg-orbs">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>
        <div className="container">
          <div>
            <div className="hero-badge animate-fade-up">🛍️ New Season — Up to 30% Off</div>
            <h1 className="hero-title animate-fade-up animate-delay-1">
              Shop Smarter.<br />Live <span className="gradient-text">Better.</span>
            </h1>
            <p className="hero-subtitle animate-fade-up animate-delay-2">
              Discover thousands of premium products at unbeatable prices — fashion, footwear, accessories, and more. Your perfect style is just a click away.
            </p>
            <div className="hero-actions animate-fade-up animate-delay-3">
              <Link to="/products" className="btn btn-primary btn-lg">
                Explore Now <FiArrowRight />
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Join Free
              </Link>
            </div>
            <div className="hero-stats animate-fade-up animate-delay-4">
              <div><div className="hero-stat-num">16+</div><div className="hero-stat-label">Products</div></div>
              <div><div className="hero-stat-num">10K+</div><div className="hero-stat-label">Happy Shoppers</div></div>
              <div><div className="hero-stat-num">4.9★</div><div className="hero-stat-label">App Rating</div></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-img-grid">
              {HERO_IMGS.map((img, i) => (
                <div key={i} className={`hero-img-card ${i % 2 === 1 ? 'offset' : ''}`}>
                  <img src={img.src} alt={img.label} onError={e => e.target.src = 'https://placehold.co/300x200/1a1040/818CF8?text=ShopEZ'} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Strip ── */}
      <div className="features-strip">
        <div className="container">
          <div className="features-strip-inner">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-item">
                <div className="feature-icon-wrap">{f.icon}</div>
                <div>
                  <p className="feature-title">{f.title}</p>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Categories ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Browse</span>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Explore our curated collections designed for every lifestyle and occasion</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat, i) => (
              <div
                key={i}
                className="category-card"
                onClick={() => navigate(cat.gender ? `/products?gender=${cat.gender}` : `/products?category=${cat.cat}`)}
              >
                <span className="category-emoji">{cat.icon}</span>
                <p className="category-name">{cat.name}</p>
                <p className="category-sub">{cat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="section" style={{ background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Trending</span>
            <h2 className="section-title">Handpicked For You</h2>
            <p className="section-subtitle">Bestsellers loved by thousands of happy customers across India</p>
          </div>
          {loading ? (
            <div className="loader-container"><div className="loader" /></div>
          ) : products.length > 0 ? (
            <>
              <div className="products-grid">
                {products.map((p, i) => (
                  <ProductCard key={p._id} product={p} index={i} onCartUpdate={() => setCartCount(c => c + 1)} />
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 48 }}>
                <Link to="/products" className="btn btn-primary btn-lg">
                  View All 16 Products <FiArrowRight />
                </Link>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <span className="empty-state-icon">🛍️</span>
              <h3>No products yet</h3>
              <p>Check back soon for amazing deals!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Promo Banner ── */}
      <section style={{ background: 'linear-gradient(135deg, #0f0826, #1e1b4b)', padding: '72px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(79,70,229,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(244,63,94,0.15) 0%, transparent 50%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <span className="section-tag" style={{ background: 'rgba(244,63,94,0.2)', color: '#F87171', borderColor: 'rgba(244,63,94,0.3)' }}>Limited Time Offer</span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', marginTop: 16, marginBottom: 16, letterSpacing: '-1px', lineHeight: 1.1 }}>
                Get Up To <span style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>30% OFF</span> This Season
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 32, lineHeight: 1.7, fontSize: '1rem' }}>
                Don't miss our biggest sale of the season. Shop premium fashion, footwear, and accessories at incredible prices.
              </p>
              <Link to="/products" className="btn btn-primary btn-lg">Shop the Sale <FiArrowRight /></Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Fashion', emoji: '👗', discount: '20% OFF', color: '#818CF8' },
                { label: 'Footwear', emoji: '👟', discount: '20% OFF', color: '#F472B6' },
                { label: 'Kids', emoji: '🧒', discount: '30% OFF', color: '#34D399' },
                { label: 'Accessories', emoji: '💍', discount: '15% OFF', color: '#FBBF24' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '24px', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 10 }}>{item.emoji}</div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.8rem', color: item.color, fontWeight: 700, marginTop: 4 }}>{item.discount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Reviews</span>
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Trusted by thousands of satisfied shoppers across the country</p>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">{'★'.repeat(t.rating)}</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.init}</div>
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="newsletter-section">
        <div className="container">
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)', marginBottom: 16, display: 'inline-block' }}>Newsletter</span>
          <h2>Get Exclusive Deals in Your Inbox</h2>
          <p>Subscribe to receive early access to new arrivals and special discounts</p>
          <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
            <input className="newsletter-input" type="email" placeholder="Enter your email address..." />
            <button type="submit" className="newsletter-btn">Subscribe</button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
