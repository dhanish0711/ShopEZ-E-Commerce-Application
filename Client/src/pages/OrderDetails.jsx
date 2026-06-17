import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { FiCheckCircle, FiMapPin, FiCreditCard } from 'react-icons/fi';

const OrderDetails = () => {
  const { state } = useLocation();
  const product = state?.product;
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: userInfo?.username || '', email: userInfo?.email || '',
    mobile: '', address: '', pincode: '', size: product?.sizes?.[0] || '',
    quantity: 1, paymentMethod: 'COD',
    orderDate: new Date().toLocaleDateString(), deliveryDate: new Date(Date.now() + 7 * 86400000).toLocaleDateString(),
  });
  const [payment, setPayment] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!product) {
    navigate('/products');
    return null;
  }

  const discountedPrice = product.discount
    ? (product.price - (product.price * product.discount) / 100).toFixed(2)
    : product.price;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await API.post('/orders', {
        ...form, paymentMethod: payment,
        title: product.title, description: product.description,
        mainImg: product.mainImg, price: parseFloat(discountedPrice),
        discount: product.discount || 0,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.');
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <div style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: '5rem', marginBottom: 24, color: 'var(--success)', animation: 'fadeUp 0.5s ease' }}>
              <FiCheckCircle />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>Order Placed Successfully!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>Thank you for your order, <strong>{form.name}</strong>!</p>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Expected delivery: <strong>{form.deliveryDate}</strong></p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => navigate('/profile')}>View My Orders</button>
              <button className="btn btn-outline" onClick={() => navigate('/products')}>Continue Shopping</button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-header">
          <div className="container">
            <h1>Order Details</h1>
            <p>Fill in your shipping and payment details</p>
          </div>
        </div>
        <div className="container" style={{ paddingBottom: 60 }}>
          <div className="order-layout">
            {/* Form */}
            <div className="card">
              <div className="card-body">
                {error && <div className="alert alert-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <h3 className="section-title"><FiMapPin style={{ marginRight: 8 }} />Shipping Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Mobile Number</label>
                      <input className="form-input" type="tel" placeholder="10-digit number" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Pincode</label>
                      <input className="form-input" placeholder="6-digit pincode" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full Address</label>
                    <textarea className="form-input" rows={3} placeholder="House no., Street, City, State" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required style={{ resize: 'vertical' }} />
                  </div>
                  <div className="form-row">
                    {product.sizes?.length > 0 && (
                      <div className="form-group">
                        <label className="form-label">Size</label>
                        <select className="form-select" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })}>
                          {product.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    )}
                    <div className="form-group">
                      <label className="form-label">Quantity</label>
                      <input className="form-input" type="number" min={1} value={form.quantity} onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) })} />
                    </div>
                  </div>

                  <h3 className="section-title" style={{ marginTop: 8 }}><FiCreditCard style={{ marginRight: 8 }} />Payment Method</h3>
                  <div className="payment-options" style={{ marginBottom: 24 }}>
                    {['COD', 'online'].map(method => (
                      <div key={method} className={`payment-option ${payment === method ? 'selected' : ''}`} onClick={() => setPayment(method)}>
                        {method === 'COD' ? '💵 Cash on Delivery' : '💳 Online Payment'}
                      </div>
                    ))}
                  </div>

                  <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                    {loading ? 'Placing Order...' : '🛍️ Place Order'}
                  </button>
                </form>
              </div>
            </div>

            {/* Product Summary */}
            <div>
              <div className="card" style={{ position: 'sticky', top: 90 }}>
                <div className="card-body">
                  <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Order Summary</h3>
                  <img
                    src={product.mainImg || 'https://placehold.co/400x300?text=Product'}
                    alt={product.title}
                    style={{ width: '100%', borderRadius: 12, marginBottom: 16, objectFit: 'cover', maxHeight: 200 }}
                    onError={e => e.target.src = 'https://placehold.co/400x300?text=Product'}
                  />
                  <h4 style={{ fontWeight: 700, marginBottom: 8 }}>{product.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>{product.description}</p>
                  <div className="divider" />
                  <div className="summary-row"><span>Price</span><span>₹{product.price}</span></div>
                  {product.discount > 0 && <div className="summary-row"><span>Discount</span><span style={{ color: 'var(--success)' }}>-{product.discount}%</span></div>}
                  <div className="summary-total"><span>Total</span><span>₹{discountedPrice}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetails;
