import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { EyeIcon } from '@heroicons/react/24/solid';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Veuillez vous connecter');
        }
        const response = await axios.get('http://localhost:5000/api/orders/my-orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch orders error:', err.response?.data || err.message);
        setError('Erreur lors de la récupération de l\'historique des commandes');
        setLoading(false);
        if (err.message.includes('connecter')) {
          navigate('/signIn');
        }
      }
    };
    fetchOrders();
  }, [navigate]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const openOrderDetails = (order) => setSelectedOrder(order);
  const closeOrderDetails = () => setSelectedOrder(null);

  const getStatusMessage = (order) => {
    if (order.status === 'en attente') {
      return 'En cours de traitement';
    }
    if (order.status === 'validée') {
      const now = new Date();
      const updatedAt = new Date(order.updatedAt);
      const hoursSinceUpdate = (now - updatedAt) / (1000 * 60 * 60);
      if (hoursSinceUpdate <= 24) {
        return 'Validée, la livraison sera demain. Le livreur vous appellera, soyez joignable. Merci !';
      }
      return 'Livrée avec succès';
    }
    return 'Statut inconnu';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <motion.div
          className="spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`order-history-container ${darkMode ? 'dark' : 'light'}`}
    >
      <style jsx>{`
        :root {
          --background: ${darkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(135deg, #f3e7fa 0%, #dbeafe 100%)'};
          --card-bg: ${darkMode ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.9)'};
          --card-border: ${darkMode ? 'rgba(255, 94, 142, 0.2)' : 'rgba(74, 144, 226, 0.1)'};
          --text-color: ${darkMode ? '#f1f5f9' : '#1f2937'};
          --title-color: ${darkMode ? '#ff5e8e' : '#4a90e2'};
          --price-color: ${darkMode ? '#4a90e2' : '#ff5e8e'};
          --toggle-bg: ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          --toggle-hover: ${darkMode ? 'rgba(255, 94, 142, 0.3)' : 'rgba(74, 144, 226, 0.2)'};
          --accent-color: #ff5e8e;
        }

        .order-history-container {
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

        .order-history-content {
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

        .order-history-title {
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

        .orders-table {
          width: 100%;
          border-collapse: collapse;
        }

        .orders-table th,
        .orders-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
        }

        .orders-table th {
          font-size: 1rem;
          font-weight: 600;
          color: var(--title-color);
        }

        .orders-table td {
          font-size: 0.95rem;
          color: var(--text-color);
        }

        .status-message {
          font-size: 0.9rem;
          color: ${darkMode ? '#60a5fa' : '#2563eb'};
        }

        .action-button {
          color: ${darkMode ? '#60a5fa' : '#2563eb'};
          transition: color 0.3s ease;
        }

        .action-button:hover {
          color: ${darkMode ? '#93c5fd' : '#1d4ed8'};
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

        .modal-content {
          background: ${darkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
          border-radius: 16px;
          padding: 2rem;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          border: 1px solid var(--card-border);
          backdrop-filter: blur(12px);
        }

        .modal-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--title-color);
          margin-bottom: 1.5rem;
        }

        .modal-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: ${darkMode ? 'rgba(51, 65, 85, 0.6)' : 'rgba(255, 255, 255, 0.7)'};
          border-radius: 12px;
          border: 1px solid var(--card-border);
          margin-bottom: 1rem;
        }

        .modal-item-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
        }

        .modal-item-info {
          flex: 1;
          color: var(--text-color);
        }

        .close-button {
          display: block;
          width: 150px;
          margin: 1rem auto 0;
          padding: 0.8rem;
          background: linear-gradient(90deg, #4a90e2, var(--accent-color));
          color: #ffffff;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          text-align: center;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 94, 142, 0.4);
        }

        .close-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 94, 142, 0.6);
        }

        @media (max-width: 768px) {
          .order-history-content {
            padding: 1.5rem;
            margin: 2rem 1rem;
          }

          .order-history-title {
            font-size: 2.2rem;
          }

          .orders-table th,
          .orders-table td {
            font-size: 0.85rem;
            padding: 0.8rem;
          }

          .modal-content {
            padding: 1.5rem;
          }

          .modal-title {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .order-history-title {
            font-size: 1.8rem;
          }

          .orders-table th,
          .orders-table td {
            font-size: 0.8rem;
            padding: 0.6rem;
          }

          .modal-item {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .modal-item-image {
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

      <section className="order-history-content">
        <motion.h2
          className="order-history-title"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Historique des Commandes
        </motion.h2>

        {orders.length > 0 ? (
          <motion.table
            className="orders-table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <thead>
              <tr>
                <th>ID Commande</th>
                <th>Date</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <motion.tr
                  key={order._id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <td>{order._id.slice(-6)}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td>{order.total.toFixed(2)} TND</td>
                  <td>
                    <p className="status-message">{getStatusMessage(order)}</p>
                  </td>
                  <td>
                    <button
                      onClick={() => openOrderDetails(order)}
                      className="action-button"
                      title="Voir les détails"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-gray-500"
          >
            Aucune commande trouvée. <Link to="/" className="text-blue-500 hover:underline">Retourner à la boutique</Link>
          </motion.p>
        )}
      </section>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={closeOrderDetails}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="modal-title">Détails de la Commande #{selectedOrder._id.slice(-6)}</h3>
              <div className="space-y-4">
                <p>
                  <strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR')}
                </p>
                <p>
                  <strong>Total:</strong> {selectedOrder.total.toFixed(2)} TND
                </p>
                <p>
                  <strong>Statut:</strong> {getStatusMessage(selectedOrder)}
                </p>
                <p>
                  <strong>Adresse de livraison:</strong>{' '}
                  {`${selectedOrder.shipping.address}, ${selectedOrder.shipping.city}, ${selectedOrder.shipping.postalCode}`}
                </p>
                <p>
                  <strong>Méthode de paiement:</strong> {selectedOrder.paymentMethod}
                </p>
                <div>
                  <strong>Articles:</strong>
                  {selectedOrder.cartId?.items?.length > 0 ? (
                    <div className="space-y-2 mt-2">
                      {selectedOrder.cartId.items.map((item, index) => (
                        <motion.div
                          key={index}
                          className="modal-item"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <img
                            src={`http://localhost:5000${item.product.image}`}
                            alt={item.product.name}
                            className="modal-item-image"
                            onError={(e) => (e.target.src = '/assets/images/fallback.jpg')}
                          />
                          <div className="modal-item-info">
                            <p className="font-semibold">{item.product.name}</p>
                            <p>Quantité: {item.quantity}</p>
                            <p>Prix: {(item.product.price * item.quantity).toFixed(2)} TND</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucun article trouvé dans cette commande.</p>
                  )}
                </div>
              </div>
              <motion.button
                onClick={closeOrderDetails}
                className="close-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Fermer
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrderHistory;