import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import AdminLayout from '../../components/AdminLayout';
import API from '../../utils/api';
import { FiSearch } from 'react-icons/fi';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders');
      setOrders(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!search) { setFiltered(orders); return; }
    setFiltered(orders.filter(o =>
      o.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.title?.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, orders]);

  const updateStatus = async (id, orderStatus) => {
    setUpdatingId(id);
    try {
      await API.put(`/orders/${id}/status`, { orderStatus });
      fetchOrders();
    } catch (err) {
      console.error(err);
    } finally { setUpdatingId(null); }
  };

  const getStatusColor = (s) => ({
    'order placed': 'badge-blue', 'processing': 'badge-amber',
    'shipped': 'badge-amber', 'delivered': 'badge-green', 'cancelled': 'badge-red'
  }[s] || 'badge-blue');

  const statuses = ['order placed', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <AdminLayout>
          <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>All Orders</h1>
              <p style={{ color: 'var(--text-muted)' }}>{filtered.length} total orders</p>
            </div>
            <div className="search-bar" style={{ width: 280 }}>
              <FiSearch size={16} />
              <input placeholder="Search by name, product..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {loading ? (
            <div className="loader-container"><div className="loader"></div></div>
          ) : (
            <div className="table-card">
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Customer</th>
                      <th>Contact</th>
                      <th>Address</th>
                      <th>Qty</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0 ? filtered.map(order => (
                      <tr key={order._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img className="table-img" src={order.mainImg || 'https://placehold.co/44x44?text=P'} alt={order.title} onError={e => e.target.src = 'https://placehold.co/44x44?text=P'} />
                            <div>
                              <div style={{ fontWeight: 600, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.title}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Size: {order.size || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{order.name}</td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          <div>{order.email}</div>
                          <div>{order.mobile}</div>
                        </td>
                        <td style={{ fontSize: '0.82rem', maxWidth: 160, color: 'var(--text-muted)' }}>
                          {order.address}, {order.pincode}
                        </td>
                        <td style={{ fontWeight: 600 }}>{order.quantity}</td>
                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{order.price}</td>
                        <td><span className="badge badge-blue">{order.paymentMethod}</span></td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {order.orderDate || new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <select
                            className="form-select"
                            style={{ padding: '6px 10px', fontSize: '0.8rem', width: 140, borderRadius: 8 }}
                            value={order.orderStatus}
                            onChange={e => updateStatus(order._id, e.target.value)}
                            disabled={updatingId === order._id}
                          >
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '48px' }}>No orders found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </AdminLayout>
      </div>
    </>
  );
};

export default AllOrders;
