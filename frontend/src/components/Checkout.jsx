import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [shipping, setShipping] = useState({ address: '', city: '', postalCode: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found in localStorage');
        }
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.user) {
          setIsAuthenticated(true);
          await fetchCart();
        } else {
          throw new Error('Invalid user data');
        }
      } catch (err) {
        console.error('Authentication error:', err.message, err.response?.data);
        setError('Veuillez vous connecter pour passer la commande');
        setLoading(false);
      }
    };

    const fetchCart = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cart');
        setCart(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Cart fetch error:', err.message, err.response?.data);
        setError('Erreur lors de la récupération du panier');
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const orderData = {
        cartId: cart._id,
        shipping,
        paymentMethod: 'cash_on_delivery',
        total: cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      };

      // Create order
      await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      // Do not delete cart to preserve reference for orders
      alert('Commande passée avec succès ! Paiement à la livraison.');
      navigate('/');
    } catch (err) {
      console.error('Order submission error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(`Erreur lors de la soumission de la commande: ${err.response?.data?.msg || err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const total = cart?.items?.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  ) || 0;

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
        <p className="error-text">
          {error}.{' '}
          {error.includes('connecter') && (
            <Link to="/signIn" className="signin-link">
              Se connecter
            </Link>
          )}
        </p>
      </motion.div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`checkout-container ${darkMode ? 'dark' : 'light'}`}
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

        .checkout-container {
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

        .signin-link {
          color: var(--accent-color);
          text-decoration: none;
          font-weight: 600;
        }

        .signin-link:hover {
          color: ${darkMode ? '#ff8ab4' : '#e04e7e'};
        }

        .checkout-content {
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

        .checkout-title {
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

        .checkout-section {
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--title-color);
          margin-bottom: 1rem;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .cart-item {
          display: flex;
          gap: 2rem;
          padding: 1.5rem;
          background: ${darkMode ? 'rgba(51, 65, 85, 0.6)' : 'rgba(255, 255, 255, 0.7)'};
          border-radius: 16px;
          border: 1px solid var(--card-border);
          transition: box-shadow 0.3s ease;
        }

        .cart-item:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .cart-item-image {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 12px;
        }

        .cart-item-info {
          flex: 1;
          color: var(--text-color);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .cart-item-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--title-color);
        }

        .cart-item-price {
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--price-color);
        }

        .cart-item-quantity {
          font-size: 1rem;
          color: var(--text-color);
        }

        .form-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group label {
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-color);
          margin-bottom: 0.5rem;
          display: block;
        }

        .form-group input {
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

        .form-group input:focus {
          outline: none;
          box-shadow: 0 0 10px rgba(255, 94, 142, 0.5);
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

        .payment-info {
          font-size: 1rem;
          color: var(--text-color);
          background: ${darkMode ? 'rgba(51, 65, 85, 0.6)' : 'rgba(255, 255, 255, 0.7)'};
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid var(--card-border);
          margin-bottom: 1.5rem;
        }

        .submit-button {
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

        .submit-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(255, 94, 142, 0.6);
        }

        .submit-button:disabled {
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
          .checkout-content {
            padding: 1.5rem;
            margin: 2rem 1rem;
          }

          .form-group {
            grid-template-columns: 1fr;
          }

          .cart-item {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 1.5rem;
          }

          .cart-item-image {
            width: 80px;
            height: 80px;
          }

          .checkout-title {
            font-size: 2.2rem;
          }

          .section-title {
            font-size: 1.5rem;
          }

          .cart-total {
            font-size: 1.5rem;
          }

          .submit-button {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .checkout-title {
            font-size: 1.8rem;
          }

          .section-title {
            font-size: 1.3rem;
          }

          .cart-item-title {
            font-size: 1.3rem;
          }

          .cart-item-price {
            font-size: 1.1rem;
          }

          .cart-total {
            font-size: 1.3rem;
          }

          .form-group input {
            font-size: 0.9rem;
            padding: 0.7rem;
          }

          .submit-button {
            font-size: 1.1rem;
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

      <section className="checkout-content">
        <motion.h2
          className="checkout-title"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Finaliser la Commande
        </motion.h2>

        <div className="checkout-section">
          <h3 className="section-title">Résumé de la commande</h3>
          {cart?.items?.length > 0 ? (
            <div className="cart-items">
              {cart.items.map((item, index) => (
                <motion.div
                  key={item.product._id}
                  className="cart-item"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <img
                    src={`http://localhost:5000${item.product.image}`}
                    alt={item.product.name}
                    className="cart-item-image"
                    onError={(e) => (e.target.src = '/assets/images/fallback.jpg')}
                  />
                  <div className="cart-item-info">
                    <h4 className="cart-item-title">{item.product.name}</h4>
                    <p className="cart-item-price">{(item.product.price * item.quantity).toFixed(2)} TND</p>
                    <p className="cart-item-quantity">Quantité: {item.quantity}</p>
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
            </div>
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
        </div>

        {cart?.items?.length > 0 && (
          <>
            <div className="checkout-section">
              <h3 className="section-title">Adresse de livraison</h3>
              <form>
                <div className="form-group">
                  <div>
                    <label htmlFor="address">Adresse</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={shipping.address}
                      onChange={handleShippingChange}
                      required
                      aria-label="Adresse de livraison"
                    />
                  </div>
                  <div>
                    <label htmlFor="city">Ville</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shipping.city}
                      onChange={handleShippingChange}
                      required
                      aria-label="Ville"
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode">Code postal</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={shipping.postalCode}
                      onChange={handleShippingChange}
                      required
                      aria-label="Code postal"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="checkout-section">
              <h3 className="section-title">Méthode de paiement</h3>
              <div className="payment-info">
                <p>Paiement à la livraison (à domicile)</p>
                <p>Vous paierez le montant total ({total.toFixed(2)} TND) en espèces lors de la livraison.</p>
              </div>
              <form onSubmit={handleSubmitOrder}>
                <motion.button
                  type="submit"
                  className="submit-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={cart.items.length === 0}
                >
                  Confirmer la commande
                </motion.button>
              </form>
            </div>
          </>
        )}
      </section>
    </motion.div>
  );
};

export default Checkout;