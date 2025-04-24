import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cart');
        setCart(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors de la récupération du panier');
        setLoading(false);
        console.error(err);
      }
    };
    fetchCart();
  }, []);

  const handleRemoveItem = async (productId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/cart/item/${productId}`);
      setCart(response.data);
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'article:', err);
      alert('Erreur lors de la suppression de l\'article');
    }
  };

  const handleQuantityChange = async (productId, quantity) => {
    try {
      const response = await axios.post('http://localhost:5000/api/cart', {
        productId,
        quantity,
      });
      setCart(response.data);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la quantité:', err);
      alert('Erreur lors de la mise à jour de la quantité');
    }
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  if (loading) {
    return (
      <div className="loading-container">
        <motion.div
          className="spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="error-container"
      >
        <p className="error-text">{error}</p>
      </motion.div>
    );
  }

  const total = cart?.items?.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  ) || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`cart-container ${darkMode ? 'dark' : 'light'}`}
    >
      <style jsx>{`
        :root {
          --background: ${darkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(135deg, #f3e7fa 0%, #dbeafe 100%)'};
          --card-bg: ${darkMode ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.9)'};
          --card-border: ${darkMode ? 'rgba(255, 94, 142, 0.2)' : 'rgba(74, 144, 226, 0.1)'};
          --text-color: ${darkMode ? '#f1f5f9' : '#1f2937'};
          --title-color: ${darkMode ? '#ff5e8e' : '#4a90e2'};
          --price-color: ${darkMode ? '#4a90e2' : '#ff5e8e'};
          --button-bg: ${darkMode ? '#334155' : '#eff6ff'};
          --button-color: ${darkMode ? '#f1f5f9' : '#4a90e2'};
          --input-bg: ${darkMode ? '#1e293b' : '#ffffff'};
          --input-shadow: ${darkMode ? 'inset 0 2px 6px rgba(0, 0, 0, 0.4)' : 'inset 0 2px 6px rgba(0, 0, 0, 0.1)'};
          --disabled-bg: ${darkMode ? '#1f2937' : '#e5e7eb'};
          --disabled-color: ${darkMode ? '#6b7280' : '#9ca3af'};
          --toggle-bg: ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          --toggle-hover: ${darkMode ? 'rgba(255, 94, 142, 0.3)' : 'rgba(74, 144, 226, 0.2)'};
          --accent-color: #ff5e8e;
        }

        .cart-container {
          font-family: 'Inter', 'Poppins', sans-serif;
          background: var(--background);
          min-height: 100vh;
          padding: 2rem 1rem;
          position: relative;
          overflow-x: hidden;
          transition: background 0.4s ease;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: var(--background);
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid ${darkMode ? '#334155' : '#e5e7eb'};
          border-top: 4px solid var(--accent-color);
          border-radius: 50%;
        }

        .error-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: var(--background);
        }

        .error-text {
          font-size: 1.5rem;
          font-weight: 500;
          color: #f43f5e;
          text-align: center;
          padding: 2rem;
          background: var(--card-bg);
          border-radius: 16px;
          border: 1px solid var(--card-border);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(12px);
        }

        .cart-content {
          max-width: 1200px;
          margin: 3rem auto;
          padding: 2rem;
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border-radius: 24px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          border: 1px solid var(--card-border);
          animation: slideIn 0.7s ease-out;
        }

        @keyframes slideIn {
          from { transform: translateY(60px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .cart-title {
          font-size: 2.8rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 2.5rem;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          background: linear-gradient(90deg, var(--title-color), var(--price-color));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .cart-item {
          display: flex;
          gap: 2rem;
          padding: 1.5rem;
          background: ${darkMode ? 'rgba(51, 65, 85, 0.6)' : 'rgba(255, 255, 255, 0.7)'};
          border-radius: 16px;
          margin-bottom: 1.5rem;
          border: 1px solid var(--card-border);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .cart-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .cart-item-image {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 12px;
          transition: transform 0.3s ease;
        }

        .cart-item-image:hover {
          transform: scale(1.05);
        }

        .cart-item-info {
          flex: 1;
          color: var(--text-color);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .cart-item-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--title-color);
        }

        .cart-item-price {
          font-size: 1.3rem;
          font-weight: 500;
          color: var(--price-color);
        }

        .quantity-container {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: var(--input-bg);
          padding: 0.5rem 1rem;
          border-radius: 12px;
          box-shadow: var(--input-shadow);
          margin-bottom: 1rem;
        }

        .quantity-button {
          width: 36px;
          height: 36px;
          background: var(--button-bg);
          color: var(--button-color);
          border: none;
          border-radius: 50%;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .quantity-button:hover {
          background: var(--accent-color);
          color: #ffffff;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(255, 94, 142, 0.3);
        }

        .quantity-button:disabled {
          background: var(--disabled-bg);
          color: var(--disabled-color);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .quantity-input {
          width: 50px;
          padding: 0.5rem;
          background: var(--input-bg);
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          text-align: center;
          color: var(--text-color);
          box-shadow: var(--input-shadow);
          transition: box-shadow 0.3s ease;
        }

        .quantity-input:focus {
          outline: none;
          box-shadow: 0 0 10px rgba(255, 94, 142, 0.5);
        }

        .remove-button {
          padding: 0.6rem 1.8rem;
          background: linear-gradient(90deg, #f43f5e, #e11d48);
          color: #ffffff;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 3px 10px rgba(244, 63, 94, 0.3);
        }

        .remove-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 15px rgba(244, 63, 94, 0.4);
        }

        .cart-total {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--price-color);
          text-align: right;
          margin-top: 2rem;
          padding: 1rem;
          background: ${darkMode ? 'rgba(51, 65, 85, 0.6)' : 'rgba(255, 255, 255, 0.7)'};
          border-radius: 12px;
          border: 1px solid var(--card-border);
        }

        .empty-cart {
          font-size: 1.5rem;
          font-weight: 500;
          color: var(--text-color);
          text-align: center;
          padding: 2.5rem;
          background: ${darkMode ? 'rgba(51, 65, 85, 0.6)' : 'rgba(255, 255, 255, 0.7)'};
          border-radius: 16px;
          border: 1px solid var(--card-border);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(12px);
        }

        .empty-cart a {
          color: var(--accent-color);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .empty-cart a:hover {
          color: ${darkMode ? '#ff8ab4' : '#e04e7e'};
        }

        .checkout-button {
          display: block;
          width: 220px;
          margin: 2rem auto;
          padding: 1rem;
          background: linear-gradient(90deg, #4a90e2, var(--accent-color));
          color: #ffffff;
          border: none;
          border-radius: 50px;
          font-size: 1.2rem;
          font-weight: 600;
          text-align: center;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 94, 142, 0.4);
        }

        .checkout-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(255, 94, 142, 0.6);
        }

        .checkout-button:disabled {
          background: var(--disabled-bg);
          color: var(--disabled-color);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
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

        @media (max-width: 768px) {
          .cart-content {
            padding: 1.5rem;
            margin: 2rem 1rem;
          }

          .cart-item {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 1.5rem;
          }

          .cart-item-image {
            width: 100px;
            height: 100px;
          }

          .cart-title {
            font-size: 2.2rem;
          }

          .cart-total {
            font-size: 1.5rem;
          }

          .checkout-button {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .cart-title {
            font-size: 1.8rem;
          }

          .cart-item-title {
            font-size: 1.4rem;
          }

          .cart-item-price {
            font-size: 1.1rem;
          }

          .cart-total {
            font-size: 1.3rem;
          }

          .empty-cart {
            font-size: 1.2rem;
            padding: 2rem;
          }

          .quantity-button {
            width: 32px;
            height: 32px;
            font-size: 1rem;
          }

          .quantity-input {
            width: 45px;
            font-size: 0.9rem;
          }

          .remove-button {
            padding: 0.5rem 1.2rem;
            font-size: 0.9rem;
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

      <section className="cart-content">
        <motion.h2
          className="cart-title"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Votre Panier
        </motion.h2>
        {cart?.items?.length > 0 ? (
          <>
            {cart.items.map((item, index) => (
              <motion.div
                key={item.product._id}
                className="cart-item"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={`http://localhost:5000${item.product.image}`}
                  alt={item.product.name}
                  className="cart-item-image"
                  onError={(e) => (e.target.src = '/assets/images/fallback.jpg')}
                />
                <div className="cart-item-info">
                  <h3 className="cart-item-title">{item.product.name}</h3>
                  <p className="cart-item-price">{(item.product.price * item.quantity).toFixed(2)} TND</p>
                  <div className="quantity-container">
                    <motion.button
                      className="quantity-button"
                      onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Diminuer la quantité"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      -
                    </motion.button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.product._id, Number(e.target.value))}
                      className="quantity-input"
                      min="1"
                      max={item.product.stock}
                      aria-label="Quantité"
                    />
                    <motion.button
                      className="quantity-button"
                      onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      aria-label="Augmenter la quantité"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      +
                    </motion.button>
                  </div>
                  <motion.button
                    className="remove-button"
                    onClick={() => handleRemoveItem(item.product._id)}
                    aria-label="Supprimer l'article"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Supprimer
                  </motion.button>
                </div>
              </motion.div>
            ))}
            <motion.p
              className="cart-total"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Total: {total.toFixed(2)} TND
            </motion.p>
            <Link to="/checkout">
              <motion.button
                className="checkout-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={cart.items.length === 0}
              >
                Passer à la caisse
              </motion.button>
            </Link>
          </>
        ) : (
          <motion.p
            className="empty-cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Votre panier est vide. <Link to="/">Retourner à la boutique</Link>
          </motion.p>
        )}
      </section>
    </motion.div>
  );
};

export default Cart;