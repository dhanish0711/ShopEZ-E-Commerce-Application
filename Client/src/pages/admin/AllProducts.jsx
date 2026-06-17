import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AdminLayout from '../../components/AdminLayout';
import API from '../../utils/api';
import { FiSearch, FiPlus, FiTrash2, FiEdit } from 'react-icons/fi';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products');
      setProducts(data);
      setFiltered(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!search) { setFiltered(products); return; }
    setFiltered(products.filter(p =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, products]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setDeletingId(id);
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) { console.error(err); }
    finally { setDeletingId(null); }
  };

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <AdminLayout>
          <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>All Products</h1>
              <p style={{ color: 'var(--text-muted)' }}>{filtered.length} products in catalog</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="search-bar" style={{ width: 240 }}>
                <FiSearch size={16} />
                <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Link to="/admin/products/new" className="btn btn-primary">
                <FiPlus /> Add Product
              </Link>
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
                      <th>Category</th>
                      <th>Gender</th>
                      <th>Sizes</th>
                      <th>Price</th>
                      <th>Discount</th>
                      <th>Final Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0 ? filtered.map(product => {
                      const finalPrice = product.discount
                        ? (product.price - (product.price * product.discount) / 100).toFixed(2)
                        : product.price;
                      return (
                        <tr key={product._id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <img
                                className="table-img"
                                src={product.mainImg || 'https://placehold.co/44x44?text=P'}
                                alt={product.title}
                                onError={e => e.target.src = 'https://placehold.co/44x44?text=P'}
                              />
                              <div>
                                <div style={{ fontWeight: 700, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.title}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.description}</div>
                              </div>
                            </div>
                          </td>
                          <td><span className="badge badge-blue">{product.category}</span></td>
                          <td style={{ textTransform: 'capitalize' }}>{product.gender}</td>
                          <td style={{ fontSize: '0.82rem' }}>{product.sizes?.join(', ') || 'N/A'}</td>
                          <td>₹{product.price}</td>
                          <td>
                            {product.discount > 0
                              ? <span className="badge badge-green">{product.discount}%</span>
                              : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{finalPrice}</td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(product._id)}
                              disabled={deletingId === product._id}
                            >
                              <FiTrash2 size={14} /> {deletingId === product._id ? '...' : 'Delete'}
                            </button>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '48px' }}>No products found</td></tr>
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

export default AllProducts;
