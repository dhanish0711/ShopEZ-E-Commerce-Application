import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdInventory, MdShoppingCart } from 'react-icons/md';
import { FiPlus, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/admin', icon: <MdDashboard size={18} />, label: 'Dashboard' },
    { to: '/admin/orders', icon: <MdShoppingCart size={18} />, label: 'All Orders' },
    { to: '/admin/products', icon: <MdInventory size={18} />, label: 'All Products' },
    { to: '/admin/products/new', icon: <FiPlus size={18} />, label: 'Add Product' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div>
          <div className="admin-sidebar-brand">ShopEZ</div>
          <div className="admin-sidebar-subtitle">Admin Control Panel</div>
        </div>

        <p className="admin-section-label">Navigation</p>
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`admin-nav-link ${pathname === item.to ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <p className="admin-section-label">Account</p>
        <Link to="/" className="admin-nav-link">
          <span className="nav-icon"><FiSettings size={18} /></span>
          View Store
        </Link>
        <button
          className="admin-nav-link"
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          onClick={() => { logout(); navigate('/login'); }}
        >
          <span className="nav-icon"><FiLogOut size={18} /></span>
          Logout
        </button>
      </aside>
      <main className="admin-content">{children}</main>
    </div>
  );
};

export default AdminLayout;
