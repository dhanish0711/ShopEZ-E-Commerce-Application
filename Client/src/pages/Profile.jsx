import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { FiUser, FiMail, FiPackage, FiCalendar, FiMapPin } from 'react-icons/fi';

const Profile = () => {
  const { userInfo } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/myorders').then(res => {
      setOrders(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const getStatusColor = (status) => {
    const map = { 'order placed': 'badge-blue', 'processing': 'badge-amber', 'shipped': 'badge-amber', 'delivered': 'badge-green', 'cancelled': 'badge-red' };
    return map[status] || 'badge-blue';
  };

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-header">
          <div className="container">
            <h1>My Profile</h1>
            <p>Manage your account and view your orders</p>
          </div>
        </div>
        <div className="container" style={{ paddingBottom: 60 }}>
          <div className="profile-layout">
            {/* Profile Card */}
            <div>
              <div className="profile-card" style={{ marginBottom: 20 }}>
                <div className="profile-avatar">{userInfo?.username?.[0]?.toUpperCase()}</div>
                <p className="profile-name">{userInfo?.username}</p>
                <p className="profile-email">{userInfo?.email}</p>
                <div className="profile-badge">
                  <span className={`badge ${userInfo?.usertype === 'admin' ? 'badge-amber' : 'badge-blue'}`}>
                    {userInfo?.usertype === 'admin' ? '👑 Admin' : '👤 Customer'}
                  </span>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Account Details</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <FiUser /> <span>{userInfo?.username}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <FiMail /> <span>{userInfo?.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontWeight: 800, fontSize: '1.3rem' }}>My Orders</h2>
                <span className="badge badge-blue">{orders.length} orders</span>
              </div>

              {loading ? (
                <div className="loader-container"><div className="loader"></div></div>
              ) : orders.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {orders.map(order => (
                    <div key={order._id} className="card">
                      <div className="card-body">
                        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                          <img
                            src={order.mainImg || 'https://placehold.co/80x80?text=Item'}
                            alt={order.title}
                            style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
                            onError={e => e.target.src = 'https://placehold.co/80x80?text=Item'}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                              <h4 style={{ fontWeight: 700, color: 'var(--text)' }}>{order.title}</h4>
                              <span className={`badge ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 20, fontSize: '0.85rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                              <span>Qty: {order.quantity}</span>
                              <span>Size: {order.size || 'N/A'}</span>
                              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{order.price}</span>
                              <span>{order.paymentMethod}</span>
                            </div>
                            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              <FiMapPin size={12} /> {order.address}, {order.pincode}
                            </div>
                            <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              <FiCalendar size={12} /> Ordered: {order.orderDate || new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon"><FiPackage size={48} /></div>
                  <h3>No orders yet</h3>
                  <p>Start shopping to see your orders here</p>
                  <a href="/products" className="btn btn-primary">Shop Now</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
