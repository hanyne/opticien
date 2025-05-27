import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import VirtualTryOn from './VirtualTryOn';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [showTryOn, setShowTryOn] = useState(false);

  const getGuestId = () => {
    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
      guestId = uuidv4();
      localStorage.setItem('guestId', guestId);
    }
    return guestId;
  };

  useEffect(() => {
    const fetchProductAndAuth = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        const productData = response.data;
        const reviewsResponse = await axios.get(`http://localhost:5000/api/reviews/product/${id}`);
        setProduct({ ...productData, reviews: reviewsResponse.data });

        const token = localStorage.getItem('token');
        if (token) {
          try {
            await axios.get('http://localhost:5000/api/auth/me', {
              headers: { Authorization: `Bearer ${token}` },
            });
            setIsAuthenticated(true);
          } catch (err) {
            console.error('Auth error:', err);
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }

        setLoading(false);
      } catch (err) {
        setError(
          err.response?.status === 404
            ? 'Produit non trouvé'
            : 'Erreur lors de la récupération du produit'
        );
        setLoading(false);
        console.error(err);
      }
    };
    fetchProductAndAuth();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      const headers = isAuthenticated
        ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
        : { 'x-guest-id': getGuestId() };
      await axios.post(
        'http://localhost:5000/api/cart',
        {
          productId: product._id,
          quantity,
        },
        { headers }
      );
      window.dispatchEvent(new Event('cartUpdated'));
      alert(`Ajouté ${quantity} x ${product.name} au panier`);
    } catch (err) {
      console.error('Erreur lors de l\'ajout au panier:', err);
      alert('Erreur lors de l\'ajout au panier');
    }
  };

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(product?.stock || 1, Number(value)));
    setQuantity(newQuantity);
  };

  const handleReviewSubmit = async () => {
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour laisser un avis');
      navigate('/login');
      return;
    }
    if (!newReview.rating || newReview.rating < 1 || newReview.rating > 5) {
      alert('Veuillez sélectionner une note entre 1 et 5');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Session expirée, veuillez vous reconnecter');
      setIsAuthenticated(false);
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/reviews',
        {
          rating: newReview.rating,
          comment: newReview.comment,
          productId: product._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProduct((prev) => ({
        ...prev,
        reviews: [...prev.reviews, response.data.review],
        majorityRating: response.data.review.rating,
      }));
      setNewReview({ rating: 0, comment: '' });
      alert('Avis soumis avec succès');
    } catch (err) {
      console.error('Error submitting review:', err.response?.data);
      const errorMsg = err.response?.data?.msg || 'Erreur lors de la soumission de l\'avis';
      if (errorMsg === 'Utilisateur non authentifié' || errorMsg === 'Token invalide') {
        alert('Session expirée ou token invalide, veuillez vous reconnecter');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
      } else {
        alert(errorMsg);
      }
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const images = product?.image
    ? [`http://localhost:5000${product.image}`]
    : ['/assets/images/fallback.jpg'];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="error-container"
      >
        <p className="error-text">{error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`product-detail-container ${darkMode ? 'dark' : 'light'}`}
    >
      <style jsx>{`
        :root {
          --background: ${darkMode ? 'linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)' : 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)'};
          --card-bg: ${darkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
          --card-border: ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          --text-color: ${darkMode ? '#e5e5e5' : '#333'};
          --title-color: ${darkMode ? '#f5e050' : '#4a90e2'};
          --price-color: ${darkMode ? '#4a90e2' : '#f5e050'};
          --desc-color: ${darkMode ? '#b0b0b0' : '#666'};
          --category-color: ${darkMode ? '#888' : '#888'};
          --button-bg: ${darkMode ? '#444' : '#f5f5f5'};
          --button-color: ${darkMode ? '#fff' : '#4a90e2'};
          --input-bg: ${darkMode ? '#333' : '#fff'};
          --input-shadow: ${darkMode ? 'inset 0 2px 5px rgba(0, 0, 0, 0.3)' : 'inset 0 2px 5px rgba(0, 0, 0, 0.1)'};
          --disabled-bg: ${darkMode ? '#333' : '#ccc'};
          --disabled-color: ${darkMode ? '#666' : '#999'};
          --toggle-bg: ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          --toggle-hover: ${darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
          --star-color: #f5e050;
          --accent-color: #ff5e8e;
        }

        .product-detail-container {
          font-family: 'Poppins', sans-serif;
          background: var(--background);
          min-height: 100vh;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          transition: background 0.3s ease;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: var(--background);
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid var(--text-color);
          border-top: 5px solid var(--title-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: var(--background);
        }

        .error-text {
          font-size: 1.5rem;
          color: #f43f5e;
          text-align: center;
        }

        .product-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          padding: 2rem;
          background: var(--card-bg);
          border-radius: 20px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--card-border);
        }

        .image-section {
          position: relative;
        }

        .main-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 15px;
          transition: opacity 0.3s ease;
        }

        .thumbnail-container {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
          justify-content: center;
        }

        .thumbnail {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: border 0.3s ease;
        }

        .thumbnail.active {
          border: 2px solid var(--title-color);
        }

        .details-section {
          padding: 1rem;
        }

        .product-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--title-color);
          margin-bottom: 1rem;
        }

        .product-price {
          font-size: 1.8rem;
          font-weight: 600;
          color: var(--price-color);
          margin-bottom: 1rem;
        }

        .product-description {
          font-size: 1rem;
          color: var(--desc-color);
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .product-meta {
          font-size: 0.9rem;
          color: var(--category-color);
          margin-bottom: 0.5rem;
        }

        .majority-rating {
          font-size: 1rem;
          color: var(--star-color);
          margin-bottom: 1rem;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .quantity-input {
          width: 60px;
          padding: 0.5rem;
          background: var(--input-bg);
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          color: var(--text-color);
          box-shadow: var(--input-shadow);
          text-align: center;
        }

        .quantity-input:focus {
          outline: none;
          box-shadow: 0 0 8px var(--accent-color);
        }

        .action-button {
          display: inline-block;
          padding: 0.8rem 2rem;
          background: var(--button-bg);
          color: var(--button-color);
          text-decoration: none;
          font-size: 1rem;
          border-radius: 50px;
          border: 2px solid var(--button-color);
          transition: background 0.3s ease, color 0.3s ease;
          cursor: pointer;
        }

        .action-button:hover {
          background: var(--button-color);
          color: #fff;
        }

        .action-button:disabled {
          background: var(--disabled-bg);
          color: var(--disabled-color);
          cursor: not-allowed;
          border-color: var(--disabled-color);
        }

        .reviews-section {
          margin-top: 2rem;
          padding: 1.5rem;
          background: ${darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
          border-radius: 15px;
        }

        .reviews-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--title-color);
          margin-bottom: 1rem;
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
        }

        .star {
          font-size: 1.5rem;
          cursor: pointer;
          color: ${darkMode ? '#666' : '#ccc'};
          transition: color 0.2s ease;
        }

        .star.filled {
          color: var(--star-color);
        }

        .review-comment {
          resize: vertical;
          min-height: 100px;
          padding: 0.8rem;
          background: var(--input-bg);
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          color: var(--text-color);
          box-shadow: var(--input-shadow);
        }

        .review-comment:focus {
          outline: none;
          box-shadow: 0 0 8px var(--accent-color);
        }

        .submit-review-button {
          align-self: flex-start;
          padding: 0.8rem 1.5rem;
          background: var(--button-bg);
          color: var(--button-color);
          border: 2px solid var(--button-color);
          border-radius: 50px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s ease, color 0.3s ease;
        }

        .submit-review-button:hover {
          background: var(--button-color);
          color: #fff;
        }

        .review-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .review-item {
          padding: 1rem;
          background: ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
          border-radius: 10px;
        }

        .review-rating {
          font-size: 1rem;
          color: var(--star-color);
          margin-bottom: 0.5rem;
        }

        .review-comment-text {
          font-size: 0.9rem;
          color: var(--text-color);
          margin-bottom: 0.5rem;
        }

        .review-user {
          font-size: 0.9rem;
          color: var(--category-color);
          font-style: italic;
        }

        .review-date {
          font-size: 0.8rem;
          color: var(--category-color);
        }

        .dark-mode-toggle {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 0.8rem;
          background: var(--toggle-bg);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          color: var(--text-color);
          font-size: 1.3rem;
          transition: background 0.3s ease, transform 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .dark-mode-toggle:hover {
          background: var(--toggle-hover);
          transform: scale(1.1);
        }

        .back-button {
          display: inline-block;
          margin-bottom: 1rem;
          font-size: 1rem;
          color: var(--title-color);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .back-button:hover {
          color: var(--accent-color);
        }

        @media (max-width: 768px) {
          .product-content {
            grid-template-columns: 1fr;
            padding: 1.5rem;
          }

          .main-image {
            height: 300px;
          }

          .product-title {
            font-size: 1.8rem;
          }

          .product-price {
            font-size: 1.5rem;
          }

          .reviews-section {
            padding: 1rem;
          }
        }

        @media (max-width: 480px) {
          .product-title {
            font-size: 1.5rem;
          }

          .product-price {
            font-size: 1.3rem;
          }

          .action-button,
          .submit-review-button {
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
          }

          .main-image {
            height: 250px;
          }

          .thumbnail {
            width: 60px;
            height: 60px;
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

      <section className="product-content">
        <div className="image-section">
          <motion.img
            src={images[currentImageIndex]}
            alt={product.name}
            className="main-image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onError={(e) => (e.target.src = '/assets/images/fallback.jpg')}
          />
          <div className="thumbnail-container">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index}`}
                className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="details-section">
          <Link to="/shop" className="back-button">
            ← Retour à la boutique
          </Link>
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price">{product.price} TND</p>
          <p className="majority-rating">
            {'★'.repeat(product.majorityRating)}{'☆'.repeat(5 - product.majorityRating)}
          </p>
          <p className="product-meta">Marque: {product.brand || 'N/A'}</p>
          <p className="product-meta">
            Catégorie: {product.category?.name || 'Non spécifiée'}
          </p>
          <p className="product-meta">
            Disponibilité: {product.stock > 0 ? `En stock (${product.stock})` : 'Rupture de stock'}
          </p>
          <p className="product-description">{product.description || 'Aucune description disponible'}</p>

          {product.stock > 0 && (
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantité:</label>
              <input
                type="number"
                id="quantity"
                className="quantity-input"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                min="1"
                max={product.stock}
              />
            </div>
          )}

          {product.model3D && (
            <button
              className="action-button"
              onClick={() => setShowTryOn(!showTryOn)}
            >
              {showTryOn ? "Masquer l'essayage virtuel" : 'Essayer virtuellement'}
            </button>
          )}
          {showTryOn && <VirtualTryOn model3DUrl={`http://localhost:5000${product.model3D}`} />}

          <button
            className="action-button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            Ajouter au panier
          </button>

          {/* Removed the second VirtualTryOn instance */}
          <div className="reviews-section">
            <h2 className="reviews-title">Avis des clients</h2>
            {isAuthenticated && (
              <motion.div
                className="review-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= newReview.rating ? 'filled' : ''}`}
                      onClick={() => setNewReview((prev) => ({ ...prev, rating: star }))}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea
                  className="review-comment"
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview((prev) => ({ ...prev, comment: e.target.value }))
                  }
                  placeholder="Votre commentaire..."
                />
                <button
                  className="submit-review-button"
                  onClick={handleReviewSubmit}
                >
                  Soumettre l'avis
                </button>
              </motion.div>
            )}
            {product.reviews.length > 0 ? (
              <div className="review-list">
                {product.reviews.map((review, index) => (
                  <motion.div
                    key={review._id}
                    className="review-item"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <p className="review-rating">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </p>
                    {review.comment && (
                      <p className="review-comment-text">{review.comment}</p>
                    )}
                    <p className="review-user">Par {review.user?.name || 'Utilisateur'}</p>
                    <p className="review-date">
                      {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="review-comment-text">Aucun avis pour ce produit.</p>
            )}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default ProductDetail;