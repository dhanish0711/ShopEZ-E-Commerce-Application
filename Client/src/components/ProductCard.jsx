import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';

const RATINGS = [4.1, 4.3, 4.5, 4.7, 4.8, 3.9, 4.2, 4.6];

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="product-stars">
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
};

const ProductCard = ({ product, onCartUpdate, index = 0 }) => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [addingCart, setAddingCart] = useState(false);

  const rating = RATINGS[index % RATINGS.length];
  const reviewCount = 40 + (index * 17) % 200;

  const discountedPrice = product.discount
    ? (product.price - (product.price * product.discount) / 100).toFixed(2)
    : product.price;

  const savings = product.discount
    ? (product.price * product.discount / 100).toFixed(0)
    : 0;

  const handleShopNow = () => {
    if (!userInfo) { navigate('/login'); return; }
    navigate(`/order/${product._id}`, { state: { product } });
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!userInfo) { navigate('/login'); return; }
    setAddingCart(true);
    try {
      await API.post('/cart', {
        title: product.title,
        description: product.description,
        mainImg: product.mainImg,
        size: product.sizes?.[0] || 'M',
        quantity: '1',
        price: product.price,
        discount: product.discount || 0,
      });
      if (onCartUpdate) onCartUpdate();
      // brief flash feedback
      setTimeout(() => setAddingCart(false), 600);
    } catch (err) {
      setAddingCart(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-img-wrapper">
        <img
          src={product.mainImg || 'https://placehold.co/400x300?text=Product'}
          alt={product.title}
          loading="lazy"
          onError={(e) => { e.target.src = 'https://placehold.co/400x300/F1F5F9/94A3B8?text=Product'; }}
        />
        <div className="product-badges">
          {product.discount > 0 && (
            <span className="product-discount-badge">{product.discount}% OFF</span>
          )}
          <span className="product-gender-badge">{product.gender}</span>
        </div>
        <button
          className="product-wishlist"
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          style={{ color: liked ? 'var(--secondary)' : undefined }}
          title="Add to wishlist"
        >
          {liked ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="product-info">
        <p className="product-category-label">{product.category}</p>
        <h3 className="product-title">{product.title}</h3>
        <div className="product-rating">
          <StarRating rating={rating} />
          <span className="product-rating-count">({reviewCount})</span>
        </div>
        <div className="product-price-row">
          <span className="product-price">₹{discountedPrice}</span>
          {product.discount > 0 && (
            <>
              <span className="product-original-price">₹{product.price}</span>
              <span className="product-savings">Save ₹{savings}</span>
            </>
          )}
        </div>
        <div className="product-actions">
          <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={handleShopNow}>
            Shop Now
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleAddToCart}
            disabled={addingCart}
            title="Add to cart"
            style={{ width: 38, padding: 0, justifyContent: 'center' }}
          >
            {addingCart ? '✓' : <FiShoppingCart size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
