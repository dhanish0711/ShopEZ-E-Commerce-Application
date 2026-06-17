import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AdminLayout from '../../components/AdminLayout';
import API from '../../utils/api';
import { FiArrowRight, FiPackage, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { MdPeople, MdInventory, MdShoppingCart, MdAttachMoney, MdLocalShipping, MdCheckCircle, MdPendingActions } from 'react-icons/md';

const StatusBadge = ({ status }) => {
  const map = {
    'order placed': 'badge-blue', 'processing': 'badge-amber',
    'shipped': 'badge-amber', 'delivered': 'badge-green', 'cancelled': 'badge-red',
  };
  return <span className={`badge ${map[status] || 'badge-blue'}`}>{status}</span>;
};

// Mini bar chart using CSS
const BarChart = ({ data }) => {
  const entries = Object.entries(data);
  if (!entries.length) return null;
  const max = Math.max(...entries.map(([, v]) => v), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80, padding: '0 4px' }}>
      {entries.map(([label, value]) => (
        <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            ₹{value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
          </div>
          <div style={{ width: '100%', background: 'linear-gradient(180deg, var(--primary), #7C3AED)', borderRadius: '4px 4px 0 0', height: `${Math.max((value / max) * 60, 4)}px`, transition: 'height 0.5s ease', opacity: value > 0 ? 1 : 0.25 }} />
          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.2 }}>{label}</div>
        </div>
      ))}
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/admin/dashboard').catch(() => ({ data: null })),
      API.get('/orders').catch(() => ({ data: [] })),
    ]).then(([statsRes, ordersRes]) => {
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data.slice(0, 6));
      setLoading(false);
    });
  }, []);

  const mainStats = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: <MdPeople size={28} />, color: 'blue', sub: `+${stats.recentOrders || 0} active this week` },
    { label: 'Total Products', value: stats.totalProducts, icon: <MdInventory size={28} />, color: 'pink', sub: `${stats.totalProducts} in catalog` },
    { label: 'Total Orders', value: stats.totalOrders, icon: <MdShoppingCart size={28} />, color: 'green', sub: `${stats.recentOrders} in last 7 days` },
    { label: 'Total Revenue', value: `₹${parseInt(stats.totalRevenue || 0).toLocaleString('en-IN')}`, icon: <MdAttachMoney size={28} />, color: 'amber', sub: 'All time earnings' },
  ] : [];

  const orderStats = stats ? [
    { label: 'Pending', value: stats.pendingOrders || 0, icon: <MdPendingActions size={22} />, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Shipped', value: stats.shippedOrders || 0, icon: <MdLocalShipping size={22} />, color: 'var(--primary)', bg: 'rgba(79,70,229,0.1)' },
    { label: 'Delivered', value: stats.deliveredOrders || 0, icon: <MdCheckCircle size={22} />, color: 'var(--success)', bg: 'rgba(16,185,129,0.1)' },
  ] : [];

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <AdminLayout>

          {/* Header */}
          <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: 'linear-gradient(135deg, var(--primary), #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(79,70,229,0.35)' }}>
              <FiTrendingUp size={24} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>Dashboard</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Welcome back, Admin! Here's your store overview.</p>
            </div>
          </div>

          {loading ? (
            <div className="loader-container"><div className="loader" /></div>
          ) : (
            <>
              {/* Main Stats */}
              <div className="stats-grid">
                {mainStats.map((s, i) => (
                  <div key={i} className="stat-card">
                    <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                    <div>
                      <div className="stat-value">{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-trend">{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row: Order Status + Revenue Chart + Top Products */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: 20, marginBottom: 28 }}>

                {/* Order Status Breakdown */}
                <div className="card">
                  <div className="card-body">
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FiPackage size={16} color="var(--primary)" /> Order Status
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {orderStats.map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{s.label}</span>
                              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: s.color }}>{s.value}</span>
                            </div>
                            <div style={{ height: 5, borderRadius: 4, background: 'var(--border)' }}>
                              <div style={{ height: '100%', borderRadius: 4, background: s.color, width: `${stats.totalOrders > 0 ? (s.value / stats.totalOrders) * 100 : 0}%`, transition: 'width 0.6s ease' }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Payment breakdown */}
                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10 }}>Payment Methods</p>
                      {Object.entries(stats.paymentBreakdown || {}).map(([method, count]) => (
                        <div key={method} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                          <span style={{ color: 'var(--text)', fontWeight: 500, textTransform: 'capitalize' }}>{method}</span>
                          <span className="badge badge-blue">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Revenue Chart */}
                <div className="card">
                  <div className="card-body">
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MdAttachMoney size={18} color="var(--primary)" /> Monthly Revenue
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 20 }}>Last 6 months earnings</p>
                    <BarChart data={stats.monthlyRevenue || {}} />
                    <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Revenue</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>₹{parseInt(stats.totalRevenue || 0).toLocaleString('en-IN')}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avg Order Value</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--success)' }}>
                          ₹{stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString('en-IN') : 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Products */}
                <div className="card">
                  <div className="card-body">
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                      🏆 Top Products
                    </h3>
                    {stats.topProducts?.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {stats.topProducts.map((p, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 26, height: 26, borderRadius: 8, background: i === 0 ? 'linear-gradient(135deg,#F59E0B,#EF4444)' : 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: i === 0 ? '#fff' : 'var(--text-muted)', flexShrink: 0 }}>
                              {i + 1}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.count} order{p.count > 1 ? 's' : ''}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '20px 0' }}>No orders yet</p>
                    )}

                    {/* Users stats */}
                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FiUsers size={18} color="var(--primary)" />
                        <div>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Registered Users</p>
                          <p style={{ fontWeight: 800, color: 'var(--text)', fontSize: '1.1rem' }}>{stats.totalUsers}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
                {[
                  { label: 'Add New Product', to: '/admin/products/new', emoji: '➕', color: 'var(--primary)' },
                  { label: 'Manage Orders', to: '/admin/orders', emoji: '📦', color: 'var(--success)' },
                  { label: 'All Products', to: '/admin/products', emoji: '🛍️', color: 'var(--secondary)' },
                  { label: 'Visit Store', to: '/', emoji: '🏪', color: 'var(--accent)' },
                ].map((a, i) => (
                  <Link key={i} to={a.to}
                    style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', boxShadow: 'var(--shadow)', transition: 'var(--transition)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}>
                    <span style={{ fontSize: '1.3rem' }}>{a.emoji}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)' }}>{a.label}</span>
                    <FiArrowRight size={13} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                  </Link>
                ))}
              </div>

              {/* Recent Orders Table */}
              <div className="table-card">
                <div className="table-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FiPackage size={18} color="var(--primary)" />
                    <h2>Recent Orders</h2>
                  </div>
                  <Link to="/admin/orders" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    View All <FiArrowRight size={13} />
                  </Link>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr><th>Product</th><th>Customer</th><th>Amount</th><th>Payment</th><th>Date</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {recentOrders.length > 0 ? recentOrders.map(order => (
                        <tr key={order._id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <img className="table-img" src={order.mainImg || 'https://placehold.co/46x46/F1F5F9/94A3B8?text=P'} alt={order.title} onError={e => e.target.src = 'https://placehold.co/46x46'} />
                              <span style={{ fontWeight: 600, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.875rem' }}>{order.title}</span>
                            </div>
                          </td>
                          <td style={{ fontWeight: 500, fontSize: '0.875rem' }}>{order.name}</td>
                          <td><span style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{order.price}</span></td>
                          <td><span className="badge badge-blue" style={{ textTransform: 'capitalize' }}>{order.paymentMethod}</span></td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{order.orderDate || new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                          <td><StatusBadge status={order.orderStatus} /></td>
                        </tr>
                      )) : (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                          <div style={{ fontSize: '2rem', marginBottom: 8 }}>📭</div>No orders yet
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </AdminLayout>
      </div>
    </>
  );
};

export default AdminDashboard;
