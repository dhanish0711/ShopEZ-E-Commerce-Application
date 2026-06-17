import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube } from 'react-icons/fi';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div>
          <div className="footer-logo">ShopEZ</div>
          <p className="footer-desc">Your one-stop destination for effortless online shopping. Discover thousands of products at unbeatable prices, delivered to your doorstep.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            {[FiInstagram, FiTwitter, FiFacebook, FiYoutube].map((Icon, i) => (
              <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', transition: 'var(--transition)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(79,70,229,0.3)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="footer-title">Shop</p>
          <ul className="footer-links">
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/products?gender=men">Men's Fashion</Link></li>
            <li><Link to="/products?gender=women">Women's Fashion</Link></li>
            <li><Link to="/products?gender=kids">Kids' Collection</Link></li>
            <li><Link to="/products?category=Footwear">Footwear</Link></li>
            <li><Link to="/products?category=Jewelry">Jewelry</Link></li>
          </ul>
        </div>

        <div>
          <p className="footer-title">Account</p>
          <ul className="footer-links">
            <li><Link to="/profile">My Profile</Link></li>
            <li><Link to="/cart">My Cart</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Create Account</Link></li>
          </ul>
        </div>

        <div>
          <p className="footer-title">Support</p>
          <ul className="footer-links">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Track Order</a></li>
            <li><a href="#">Returns & Refunds</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 ShopEZ. All rights reserved. Made with ❤️ in India</p>
        <div className="footer-badges">
          <span className="footer-badge">🔒 Secure Payment</span>
          <span className="footer-badge">🚚 Fast Delivery</span>
          <span className="footer-badge">✅ Verified Sellers</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
