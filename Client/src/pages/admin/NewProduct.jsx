import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AdminLayout from '../../components/AdminLayout';
import API from '../../utils/api';
import { FiPlus, FiX, FiCheck } from 'react-icons/fi';

const NewProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  const [carouselInput, setCarouselInput] = useState('');

  const [form, setForm] = useState({
    title: '', description: '', mainImg: '', carousel: [],
    sizes: [], category: '', gender: 'men', price: '', discount: 0,
  });

  const addSize = () => {
    const s = sizeInput.trim().toUpperCase();
    if (s && !form.sizes.includes(s)) {
      setForm({ ...form, sizes: [...form.sizes, s] });
    }
    setSizeInput('');
  };

  const removeSize = (s) => setForm({ ...form, sizes: form.sizes.filter(x => x !== s) });

  const addCarousel = () => {
    const url = carouselInput.trim();
    if (url && !form.carousel.includes(url)) {
      setForm({ ...form, carousel: [...form.carousel, url] });
    }
    setCarouselInput('');
  };

  const removeCarousel = (url) => setForm({ ...form, carousel: form.carousel.filter(x => x !== url) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await API.post('/products', { ...form, price: parseFloat(form.price), discount: parseFloat(form.discount) });
      setSuccess(true);
      setTimeout(() => navigate('/admin/products'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <AdminLayout>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>Add New Product</h1>
            <p style={{ color: 'var(--text-muted)' }}>Fill in the details to add a product to the catalog</p>
          </div>

          {success && (
            <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <FiCheck /> Product created successfully! Redirecting...
            </div>
          )}
          {error && <div className="alert alert-error">{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, alignItems: 'start' }}>
            {/* Form */}
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <h3 className="section-title">Basic Information</h3>

                  <div className="form-group">
                    <label className="form-label">Product Title *</label>
                    <input className="form-input" placeholder="e.g. Classic Cotton T-Shirt" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description *</label>
                    <textarea className="form-input" rows={4} placeholder="Describe the product in detail..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required style={{ resize: 'vertical' }} />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <input className="form-input" placeholder="e.g. T-Shirts, Jeans, Shoes" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender *</label>
                      <select className="form-select" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="unisex">Unisex</option>
                        <option value="kids">Kids</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Price (₹) *</label>
                      <input className="form-input" type="number" min="0" step="0.01" placeholder="0.00" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Discount (%)</label>
                      <input className="form-input" type="number" min="0" max="100" placeholder="0" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} />
                    </div>
                  </div>

                  <h3 className="section-title" style={{ marginTop: 8 }}>Images</h3>

                  <div className="form-group">
                    <label className="form-label">Main Image URL *</label>
                    <input className="form-input" type="url" placeholder="https://example.com/image.jpg" value={form.mainImg} onChange={e => setForm({ ...form, mainImg: e.target.value })} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Carousel Images</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input className="form-input" type="url" placeholder="Add image URL..." value={carouselInput} onChange={e => setCarouselInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCarousel())} />
                      <button type="button" className="btn btn-outline btn-sm" onClick={addCarousel}><FiPlus /></button>
                    </div>
                    {form.carousel.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                        {form.carousel.map((url, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg)', padding: '4px 10px', borderRadius: 8, fontSize: '0.8rem', border: '1px solid var(--border)' }}>
                            <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</span>
                            <button type="button" onClick={() => removeCarousel(url)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', padding: 0 }}><FiX size={14} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <h3 className="section-title" style={{ marginTop: 8 }}>Sizes</h3>

                  <div className="form-group">
                    <label className="form-label">Available Sizes</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => (
                        <button
                          key={s} type="button"
                          onClick={() => form.sizes.includes(s) ? removeSize(s) : setForm({ ...form, sizes: [...form.sizes, s] })}
                          style={{ padding: '8px 16px', borderRadius: 8, border: `2px solid ${form.sizes.includes(s) ? 'var(--primary)' : 'var(--border)'}`, background: form.sizes.includes(s) ? 'rgba(79,70,229,0.1)' : '#fff', color: form.sizes.includes(s) ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'var(--transition)' }}
                        >{s}</button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input className="form-input" placeholder="Custom size (e.g. 42, 6.5)" value={sizeInput} onChange={e => setSizeInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSize())} />
                      <button type="button" className="btn btn-outline btn-sm" onClick={addSize}><FiPlus /></button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                      {loading ? 'Creating...' : '✅ Create Product'}
                    </button>
                    <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/products')}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>

            {/* Live Preview */}
            <div style={{ position: 'sticky', top: 90 }}>
              <div className="card">
                <div className="card-body">
                  <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Live Preview</h3>
                  <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 16 }}>
                    {form.mainImg ? (
                      <img src={form.mainImg} alt="preview" style={{ width: '100%', height: 200, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                    ) : (
                      <div style={{ width: '100%', height: 200, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        No image URL yet
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 6 }}>{form.category || 'Category'} · {form.gender}</p>
                  <h4 style={{ fontWeight: 700, marginBottom: 10, color: 'var(--text)' }}>{form.title || 'Product Title'}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                      ₹{form.price && form.discount ? (form.price - (form.price * form.discount) / 100).toFixed(2) : form.price || '0'}
                    </span>
                    {form.discount > 0 && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{form.price}</span>
                    )}
                    {form.discount > 0 && (
                      <span style={{ background: 'rgba(244,63,94,0.1)', color: 'var(--secondary)', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 50 }}>{form.discount}% OFF</span>
                    )}
                  </div>
                  {form.sizes.length > 0 && (
                    <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {form.sizes.map(s => (
                        <span key={s} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 600 }}>{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </AdminLayout>
      </div>
    </>
  );
};

export default NewProduct;
