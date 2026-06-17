import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import API from '../utils/api';
import { FiSearch, FiGrid, FiList, FiX } from 'react-icons/fi';

const GENDERS = ['All', 'Men', 'Women', 'Kids', 'Unisex'];
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Biggest Discount', value: 'discount' },
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('All');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [cartCount, setCartCount] = useState(0);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    API.get('/products').then(res => {
      setProducts(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
    const g = searchParams.get('gender');
    const s = searchParams.get('search');
    const c = searchParams.get('category');
    if (g) setGender(g.charAt(0).toUpperCase() + g.slice(1));
    if (s) setSearch(s);
    if (c) setCategory(c);
  }, []);

  useEffect(() => {
    let result = [...products];
    if (search) result = result.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()));
    if (gender && gender !== 'All') result = result.filter(p => p.gender?.toLowerCase() === gender.toLowerCase());
    if (category) result = result.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sort === 'discount') result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    setFiltered(result);
  }, [search, gender, category, sort, products]);

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const clearFilters = () => { setSearch(''); setGender('All'); setCategory(''); setSort('newest'); };
  const hasFilters = search || gender !== 'All' || category || sort !== 'newest';

  return (
    <>
      <Navbar cartCount={cartCount} />
      <div className="page-wrapper">
        <div className="page-header">
          <div className="container">
            <h1>All Products</h1>
            <p>{filtered.length} products found {hasFilters ? '(filtered)' : ''}</p>
          </div>
        </div>

        <div className="container" style={{ paddingBottom: 72 }}>
          {/* Filter Bar */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid var(--border)', padding: '20px 24px', marginBottom: 32, boxShadow: 'var(--shadow)' }}>
            {/* Row 1: Search + Sort */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
              <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
                <FiSearch size={16} />
                <input placeholder="Search products, brands, categories..." value={search} onChange={e => setSearch(e.target.value)} />
                {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><FiX size={16} /></button>}
              </div>
              <select className="form-select" style={{ width: 200 }} value={sort} onChange={e => setSort(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {hasFilters && (
                <button className="btn btn-outline btn-sm" onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FiX size={14} /> Clear All
                </button>
              )}
            </div>
            {/* Row 2: Gender Chips */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: 4 }}>Gender:</span>
              <div className="filter-chips-row">
                {GENDERS.map(g => (
                  <button key={g} className={`filter-chip ${gender === g ? 'active' : ''}`} onClick={() => setGender(g)}>{g}</button>
                ))}
              </div>
              {categories.length > 0 && (
                <>
                  <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 8px' }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: 4 }}>Category:</span>
                  <div className="filter-chips-row">
                    {categories.slice(0, 8).map(c => (
                      <button key={c} className={`filter-chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(category === c ? '' : c)}>{c}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Products */}
          {loading ? (
            <div className="loader-container"><div className="loader" /></div>
          ) : filtered.length > 0 ? (
            <div className="products-grid">
              {filtered.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} onCartUpdate={() => setCartCount(c => c + 1)} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-state-icon">🔍</span>
              <h3>No products found</h3>
              <p>Try adjusting your search or remove some filters to see more products.</p>
              <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Products;
