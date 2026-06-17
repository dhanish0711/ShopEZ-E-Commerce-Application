import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiShoppingCart, FiUser, FiLogOut, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';

const Navbar = ({ cartCount = 0, onSearch }) => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-logo">ShopEZ</Link>

        {/* Center: Links + Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center', maxWidth: 600, margin: '0 24px' }} className="navbar-center">
          <div className="navbar-links">
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            {userInfo?.usertype === 'admin' && <Link to="/admin">Dashboard</Link>}
          </div>
          <form onSubmit={handleSearch} className="navbar-search" style={{ flex: 1 }}>
            <FiSearch size={15} />
            <input
              placeholder="Search products..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
            />
          </form>
        </div>

        {/* Right: Actions */}
        <div className="navbar-actions">
          {userInfo ? (
            <>
              {userInfo.usertype !== 'admin' && (
                <Link to="/cart" className="cart-btn">
                  <FiShoppingCart size={17} />
                  <span>Cart</span>
                  {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </Link>
              )}
              <Link to="/profile" className="nav-btn nav-btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FiUser size={14} />
                <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userInfo.username}</span>
              </Link>
              <button onClick={handleLogout} className="nav-btn nav-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FiLogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn nav-btn-outline">Login</Link>
              <Link to="/register" className="nav-btn nav-btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
