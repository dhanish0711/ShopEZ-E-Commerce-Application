import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../utils/api';
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const { data } = await API.get('/cart');
      setCartItems(data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchCart(); }, []);

  const removeItem = async (id) => {
    try {
      await API.delete(`/cart/${id}`);
      fetchCart();
    } catch (err) { console.error(err); }
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.price - (item.price * (item.discount || 0)) / 100;
    return acc + price * (parseInt(item.quantity) || 1);
  }, 0);

  const shipping = subtotal > 499 ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <>
      <Navbar cartCount={cartItems.length} />
      <div className="page-wrapper">
        <div className="page-header">
          <div className="container">
            <h1>My Cart</h1>
            <p>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
          </div>
        </div>
        <div className="container" style={{ paddingBottom: 60 }}>
          {loading ? (
            <div className="loader-container"><div className="loader"></div></div>
          ) : cartItems.length > 0 ? (
            <div className="cart-layout">
              {/* Cart Items */}
              <div className="card">
                {cartItems.map(item => (
                  <div key={item._id} className="cart-item">
                    <img
                      className="cart-item-img"
                      src={item.mainImg || 'https://placehold.co/80x80?text=Item'}
                      alt={item.title}
                      onError={e => e.target.src = 'https://placehold.co/80x80?text=Item'}
                    />
                    <div className="cart-item-info">
                      <p className="cart-item-title">{item.title}</p>
                      <p className="cart-item-size">Size: {item.size || 'N/A'} · Qty: {item.quantity}</p>
                      <p className="cart-item-price">
                        ₹{(item.price - (item.price * (item.discount || 0)) / 100).toFixed(2)}
                        {item.discount > 0 && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: 8 }}>₹{item.price}</span>}
                      </p>
                    </div>
                    <button onClick={() => removeItem(item._id)} className="btn btn-danger btn-sm" style={{ flexShrink: 0 }}>
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="cart-summary">
                <h3>Order Summary</h3>
                <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : `₹${shipping}`}</span></div>
                {shipping === 0 && <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginBottom: 12 }}>🎉 You qualify for free shipping!</div>}
                <div className="summary-total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
                <button className="btn btn-primary btn-full" style={{ marginTop: 20 }} onClick={() => navigate('/products')}>
                  <FiShoppingBag /> Continue Shopping
                </button>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 16 }}>
                  Click "Shop Now" on a product to place order
                </p>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything to your cart yet</p>
              <Link to="/products" className="btn btn-primary">Start Shopping</Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
