import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import { v4 as uuidv4 } from 'uuid';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [reviewsByProduct, setReviewsByProduct] = useState({}); // Product-specific review state

  const getGuestId = () => {
    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
      guestId = uuidv4();
      localStorage.setItem('guestId', guestId);
    }
    return guestId;
  };

  useEffect(() => {
    const fetchCategoriesAndAuth = async () => {
      try {
        const catResponse = await axios.get('http://localhost:5000/api/categories');
        setCategories(catResponse.data);

        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userResponse = await axios.get('http://localhost:5000/api/auth/me', {
              headers: { Authorization: `Bearer ${token}` },
            });
            setIsAuthenticated(true);
            setUser(userResponse.data.user);
          } catch (err) {
            console.error('Auth error:', err);
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching categories or auth:', err);
        setError('Erreur lors de la récupération des filtres');
      }
    };
    fetchCategoriesAndAuth();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams();
        if (filters.category) query.append('category', filters.category);
        if (filters.brand) query.append('brand', filters.brand);
        if (filters.minPrice) query.append('minPrice', filters.minPrice);
        if (filters.maxPrice) query.append('maxPrice', filters.maxPrice);

        const response = await axios.get(`http://localhost:5000/api/products?${query.toString()}`);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Erreur lors de la récupération des produits');
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const headers = isAuthenticated
        ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
        : { 'x-guest-id': getGuestId() };
      await axios.post(
        'http://localhost:5000/api/cart',
        { productId, quantity },
        { headers }
      );
      window.dispatchEvent(new Event('cartUpdated'));
      alert('Produit ajouté au panier');
    } catch (err) {
      console.error('Add to cart error:', err);
      alert('Erreur lors de l\'ajout au panier');
    }
  };

  const handleReviewChange = (productId, field, value) => {
    setReviewsByProduct((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleReviewSubmit = async (productId) => {
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour laisser un avis');
      return;
    }

    const review = reviewsByProduct[productId] || { rating: 0, comment: '' };
    if (!review.rating || review.rating < 1 || review.rating > 5) {
      alert('Veuillez sélectionner une note entre 1 et 5');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token manquant, veuillez vous reconnecter');
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/reviews',
        {
          rating: review.rating,
          comment: review.comment,
          productId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId
            ? {
                ...p,
                reviews: [...p.reviews, response.data.review],
                majorityRating: response.data.review.rating,
              }
            : p
        )
      );

      setReviewsByProduct((prev) => ({
        ...prev,
        [productId]: { rating: 0, comment: '' },
      }));

      alert('Avis soumis avec succès');
    } catch (err) {
      console.error('Error submitting review:', err.response?.data);
      alert(err.response?.data?.msg || 'Erreur lors de la soumission de l\'avis');
    }
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`shop-container ${darkMode ? 'dark' : 'light'}`}
    >
      <style jsx>{`
        :root {
          --background: ${darkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : '#fff'};
          --card-bg: ${darkMode ? 'rgba(30, 41, 59, 0.85)' : '#fff'};
          --card-border: ${darkMode ? 'rgba(255, 94, 142, 0.2)' : 'rgba(74, 144, 226, 0.1)'};
          --text-color: ${darkMode ? '#f1f5f9' : '#333'};
          --title-color: ${darkMode ? '#ff5e8e' : '#4a90e2'};
          --price-color: ${darkMode ? '#4a90e2' : '#f5e050'};
          --button-bg: ${darkMode ? '#334155' : '#4a90e2'};
          --button-hover: ${darkMode ? '#475569' : '#3b82f6'};
          --input-bg: ${darkMode ? '#1e293b' : '#ffffff'};
          --input-shadow: ${darkMode ? 'inset 0 2px 6px rgba(0, 0, 0, 0.4)' : 'inset 0 2px 6px rgba(0, 0, 0, 0.1)'};
          --accent-color: #ff5e8e;
          --star-color: #f5e050;
        }

        .shop-container {
          font-family: 'Poppins', sans-serif;
          background: var(--background);
          min-height: 100vh;
          padding: 2rem 1rem;
          overflow-x: hidden;
          transition: background 0.4s ease;
        }

        .shop-content {
          max-width: 1400px;
          margin: 3rem auto;
          padding: 2rem;
        }

        .shop-title {
          font-size: 2.8rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 2rem;
          color: var(--title-color);
          text-transform: uppercase;
          letter-spacing: 1.2px;
        }

        .filter-section {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 3rem;
          background: var(--card-bg);
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--card-border);
        }

        .filter-group {
          flex: 1 1 200px;
        }

        .filter-group label {
          display: block;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-color);
          margin-bottom: 0.5rem;
        }

        .filter-group select,
        .filter-group input,
        .filter-group textarea {
          width: 100%;
          padding: 0.8rem;
          background: var(--input-bg);
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          color: var(--text-color);
          box-shadow: var(--input-shadow);
          transition: box-shadow 0.3s ease;
        }

        .filter-group select:focus,
        .filter-group input:focus,
        .filter-group textarea:focus {
          outline: none;
          box-shadow: 0 0 10px rgba(255, 94, 142, 0.5);
        }

        .price-filter {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .product-card {
          text-align: center;
          padding: 1.5rem;
          background: var(--card-bg);
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--card-border);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(74, 144, 226, 0.2);
        }

        .product-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 1rem;
        }

        .product-title {
          font-size: 1.4rem;
          margin-bottom: 0.5rem;
          color: var(--text-color);
        }

        .product-price {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          color: var(--price-color);
          font-weight: 600;
        }

        .product-availability {
          font-size: 1rem;
          margin-bottom: 1rem;
          color: ${darkMode ? '#9ca3af' : '#666'};
        }

        .product-button {
          display: inline-block;
          padding: 0.8rem 1.5rem;
          background: var(--button-bg);
          color: #fff;
          text-decoration: none;
          font-size: 1rem;
          border-radius: 50px;
          transition: background 0.3s ease;
          margin: 0.5rem;
        }

        .product-button:hover {
          background: var(--button-hover);
        }

        .error-text {
          font-size: 1.2rem;
          color: #f43f5e;
          text-align: center;
          margin: 2rem 0;
        }

        .loading-text {
          font-size: 1.5rem;
          color: var(--text-color);
          text-align: center;
          margin: 2rem 0;
        }

        .dark-mode-toggle {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 0.8rem;
          background: ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          border: none;
          border-radius: 50%;
          cursor: pointer;
          color: var(--text-color);
          font-size: 1.3rem;
          transition: background 0.3s ease, transform 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .dark-mode-toggle:hover {
          background: ${darkMode ? 'rgba(255, 94, 142, 0.3)' : 'rgba(74, 144, 226, 0.2)'};
          transform: scale(1.1);
        }

        .reviews-section {
          margin-top: 1.5rem;
          padding: 1rem;
          background: ${darkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.5)'};
          border-radius: 10px;
        }

        .review-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .rating-stars {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .star {
          font-size: 1.5rem;
          cursor: pointer;
          color: ${darkMode ? '#4a90e2' : '#ccc'};
          transition: color 0.2s ease;
        }

        .star.filled {
          color: var(--star-color);
        }

        .review-comment {
          resize: vertical;
          min-height: 80px;
          padding: 0.8rem;
          background: var(--input-bg);
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          color: var(--text-color);
          box-shadow: var(--input-shadow);
        }

        .submit-review-button {
          align-self: flex-start;
          padding: 0.8rem 1.5rem;
          background: var(--button-bg);
          color: #fff;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .submit-review-button:hover {
          background: var(--button-hover);
        }

        .review-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .review-item {
          padding: 1rem;
          background: ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
          border-radius: 8px;
        }

        .review-rating {
          font-size: 1rem;
          color: var(--star-color);
          margin-bottom: 0.5rem;
        }

        .review-comment {
          font-size: 0.9rem;
          color: var(--text-color);
          margin-bottom: 0.5rem;
        }

        .review-user {
          font-size: 0.9rem;
          color: ${darkMode ? '#9ca3af' : '#666'};
          font-style: italic;
        }

        .review-date {
          font-size: 0.8rem;
          color: ${darkMode ? '#9ca3af' : '#666'};
        }

        .majority-rating {
          font-size: 1rem;
          color: var(--star-color);
          margin-bottom: 0.5rem;
        }

        @media (max-width: 768px) {
          .shop-content {
            padding: 1.5rem;
            margin: 2rem 1rem;
          }

          .filter-section {
            flex-direction: column;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }

          .shop-title {
            font-size: 2.2rem;
          }

          .reviews-section {
            padding: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          .shop-title {
            font-size: 1.8rem;
          }

          .product-title {
            font-size: 1.2rem;
          }

          .product-price {
            font-size: 1rem;
          }

          .product-button,
          .submit-review-button {
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
          }

          .review-comment {
            font-size: 0.8rem;
          }

          .review-user,
          .review-date {
            font-size: 0.7rem;
          }
        }
      `}</style>

      <Navbar />

      <button
        onClick={toggleDarkMode}
        className="dark-mode-toggle"
        aria-label={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      <section className="shop-content">
        <motion.h2
          className="shop-title"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Nos Produits
        </motion.h2>

        <motion.div
          className="filter-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="filter-group">
            <label htmlFor="category">Catégorie</label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="brand">Marque</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={filters.brand}
              onChange={handleFilterChange}
              placeholder="Ex: Ray-Ban"
            />
          </div>
          <div className="filter-group">
            <label>Prix</label>
            <div className="price-filter">
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min"
                min="0"
              />
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max"
                min="0"
              />
            </div>
          </div>
        </motion.div>

        {loading ? (
          <p className="loading-text">Chargement des produits...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : products.length === 0 ? (
          <p className="error-text">Aucun produit trouvé</p>
        ) : (
          <motion.div
            className="products-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {products.map((product, index) => {
              const review = reviewsByProduct[product._id] || { rating: 0, comment: '' };
              return (
                <motion.div
                  key={product._id}
                  className="product-card"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={`http://localhost:5000${product.image}`}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => (e.target.src = '/path/to/fallback-image.jpg')}
                  />
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-price">{product.price} TND</p>
                  <p className="majority-rating">
                    {'★'.repeat(product.majorityRating)}{'☆'.repeat(5 - product.majorityRating)}
                  </p>
                  <p className="product-availability">
                    {product.stock > 0 ? `En stock` : 'Rupture de stock'}
                  </p>
                  <Link to={`/product/${product._id}`} className="product-button">
                    Voir le produit
                  </Link>
                  <button
                    className="product-button"
                    onClick={() => addToCart(product._id)}
                    disabled={product.stock === 0}
                  >
                    Ajouter au panier
                  </button>

                  <div className="reviews-section">
                    {isAuthenticated && (
                      <motion.div
                        className="review-form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="rating-stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`star ${star <= review.rating ? 'filled' : ''}`}
                              onClick={() => handleReviewChange(product._id, 'rating', star)}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <textarea
                          className="review-comment"
                          value={review.comment}
                          onChange={(e) =>
                            handleReviewChange(product._id, 'comment', e.target.value)
                          }
                          placeholder="Votre commentaire..."
                        />
                        <button
                          className="submit-review-button"
                          onClick={() => handleReviewSubmit(product._id)}
                        >
                          Soumettre l'avis
                        </button>
                      </motion.div>
                    )}
                    {product.reviews.length > 0 ? (
                      <div className="review-list">
                        {product.reviews.map((review, idx) => (
                          <motion.div
                            key={review._id}
                            className="review-item"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + idx * 0.1 }}
                          >
                            <p className="review-rating">
                              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                            </p>
                            {review.comment && <p className="review-comment">{review.comment}</p>}
                            <p className="review-user">Par {review.user?.name || 'Utilisateur'}</p>
                            <p className="review-date">
                              {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="review-comment">Aucun avis pour ce produit.</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>
    </motion.div>
  );
};

export default Shop;