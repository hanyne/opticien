import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const OpticienDashboard = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('order');
  const [totalPrice, setTotalPrice] = useState(null); // State to store total price after submission
  const navigate = useNavigate();

  // Pricing data for lenses and frames
  const lensPrices = {
    'Galaxy® CR Dark G15 D70 B6': 50,
    'Galaxy® CR Brun D70 B6': 50,
    'Galaxy® CR Dark Gray D70 B6': 50,
    'Galaxy® CR Dark G15 D80 B6': 60,
    'Galaxy® CR Brun D80 B6': 60,
    'Galaxy® Gris (0.00) 0.00 D70': 40,
    'Galaxy® Gris "New" (0.00) 0.00 D70': 45,
    'Galaxy® 56 Blue Max (0.00) 0.00 D70': 55,
    'Galaxy® Brun Blue Max (0.00) 0.00 D70': 55,
    'Galaxy® Gris Blue Max (0.00) 0.00 D70': 55,
    'Galaxy® 56 Asph Blue Max (0.00) 0.00 D72': 60,
  };

  const framePrices = {
    'montage cadre': 30,
    'demi cadre': 25,
    'percé': 20,
    'spécial': 35,
  };

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login?message=' + encodeURIComponent('Veuillez vous connecter'));
          return;
        }
        const userRes = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = userRes.data.user;
        if (userData.role !== 'opticien') {
          navigate('/login?message=' + encodeURIComponent('Accès non autorisé'));
          return;
        }
        setUser(userData);

        const ordersRes = await axios.get('http://localhost:5000/api/orderopt/my-orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(ordersRes.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || 'Erreur lors de la récupération des données');
        localStorage.removeItem('token');
        navigate('/login?message=' + encodeURIComponent('Session invalide, veuillez vous reconnecter'));
      }
    };
    fetchUserAndOrders();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/signin');
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const [orderForm, setOrderForm] = useState({
    frameType: '',
    additionalNotes: '',
    corrections: {
      OD: { sphere: '', cylindre: '', axe: '', addition: '' },
      OG: { sphere: '', cylindre: '', axe: '', addition: '' },
    },
    wearer: { nom: '', prenom: '', telephone: '', email: '' },
    lensType: '',
  });
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');

  const lensOptions = Object.keys(lensPrices);

  const calculateTotalPrice = () => {
    const lensPrice = lensPrices[orderForm.lensType] || 0;
    const framePrice = framePrices[orderForm.frameType] || 0;
    return lensPrice + framePrice;
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setOrderError('');
    setOrderSuccess('');
    setTotalPrice(null);

    if (!orderForm.frameType) {
      setOrderError('Veuillez sélectionner un type de montage');
      return;
    }
    if (!orderForm.wearer.nom || !orderForm.wearer.prenom || !orderForm.wearer.telephone || !orderForm.wearer.email) {
      setOrderError('Veuillez remplir toutes les informations du porteur');
      return;
    }
    if (!orderForm.lensType) {
      setOrderError('Veuillez sélectionner un type de verre');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const totalPrice = calculateTotalPrice();
      const res = await axios.post(
        'http://localhost:5000/api/orderopt',
        {
          frameType: orderForm.frameType,
          additionalNotes: orderForm.additionalNotes,
          corrections: orderForm.corrections,
          wearer: orderForm.wearer,
          lensType: orderForm.lensType,
          status: 'pending',
          totalPrice: totalPrice, // Add total price to the order
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrderSuccess('Commande soumise avec succès');
      setTotalPrice(totalPrice); // Display total price after submission
      setOrders((prev) => [...prev, { ...res.data.order, totalPrice }]);
      setOrderForm({
        frameType: '',
        additionalNotes: '',
        corrections: {
          OD: { sphere: '', cylindre: '', axe: '', addition: '' },
          OG: { sphere: '', cylindre: '', axe: '', addition: '' },
        },
        wearer: { nom: '', prenom: '', telephone: '', email: '' },
        lensType: '',
      });
    } catch (err) {
      setOrderError(err.response?.data?.msg || 'Erreur lors de la soumission de la commande');
    }
  };

  const handleCorrectionChange = (eye, field, value) => {
    setOrderForm((prev) => ({
      ...prev,
      corrections: {
        ...prev.corrections,
        [eye]: {
          ...prev.corrections[eye],
          [field]: value,
        },
      },
    }));
  };

  const handleWearerChange = (field, value) => {
    setOrderForm((prev) => ({
      ...prev,
      wearer: {
        ...prev.wearer,
        [field]: value,
      },
    }));
  };

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
      className={`dashboard-container ${darkMode ? 'dark' : 'light'}`}
    >
      <style jsx>{`
        :root {
          --background: ${darkMode ? 'linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)' : 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)'};
          --sidebar-bg: ${darkMode ? '#2d3748' : '#f7fafc'};
          --card-bg: ${darkMode ? 'rgba(45, 55, 72, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
          --text-color: ${darkMode ? '#e2e8f0' : '#2d3748'};
          --title-color: ${darkMode ? '#63b3ed' : '#3182ce'};
          --button-bg: ${darkMode ? '#4a5568' : '#edf2f7'};
          --button-color: ${darkMode ? '#e2e8f0' : '#3182ce'};
          --input-bg: ${darkMode ? '#4a5568' : '#ffffff'};
          --input-shadow: ${darkMode ? 'inset 0 2px 5px rgba(0, 0, 0, 0.3)' : 'inset 0 2px 5px rgba(0, 0, 0, 0.1)'};
          --accent-color: #63b3ed;
        }

        .dashboard-container {
          font-family: 'Poppins', sans-serif;
          background: var(--background);
          min-height: 100vh;
          display: flex;
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

        .sidebar {
          width: 250px;
          background: var(--sidebar-bg);
          padding: 2rem;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        }

        .sidebar-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--title-color);
          margin-bottom: 2rem;
        }

        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .menu-item {
          padding: 0.8rem 1rem;
          color: var(--text-color);
          text-decoration: none;
          border-radius: 8px;
          transition: background 0.3s ease;
          font-size: 1rem;
          cursor: pointer;
        }

        .menu-item:hover {
          background: ${darkMode ? '#4a5568' : '#edf2f7'};
        }

        .menu-item.active {
          background: var(--title-color);
          color: #ffffff;
        }

        .logout-button {
          margin-top: auto;
          padding: 0.8rem 1rem;
          background: var(--button-bg);
          color: var(--button-color);
          border: 2px solid var(--button-color);
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          transition: background 0.3s ease, color 0.3s ease;
        }

        .logout-button:hover {
          background: var(--button-color);
          color: #ffffff;
        }

        .main-content {
          margin-left: 250px;
          padding: 2rem;
          flex: 1;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .dashboard-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--title-color);
        }

        .dark-mode-toggle {
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
          background: ${darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
          transform: scale(1.1);
        }

        .section {
          background: var(--card-bg);
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--title-color);
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-color);
          margin-bottom: 0.5rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.8rem;
          background: var(--input-bg);
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          color: var(--text-color);
          box-shadow: var(--input-shadow);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          box-shadow: 0 0 8px var(--accent-color);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        .eye-section {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .eye-section div {
          flex: 1;
        }

        .wearer-section {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .submit-button {
          padding: 0.8rem 2rem;
          background: var(--button-bg);
          color: var(--button-color);
          border: 2px solid var(--button-color);
          border-radius: 50px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s ease, color 0.3s ease;
        }

        .submit-button:hover {
          background: var(--button-color);
          color: #ffffff;
        }

        .order-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .order-item {
          padding: 1rem;
          background: ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
          border-radius: 10px;
        }

        .order-detail {
          font-size: 0.9rem;
          color: var(--text-color);
          margin-bottom: 0.5rem;
        }

        .order-status {
          font-size: 0.9rem;
          color: ${darkMode ? '#48bb78' : '#2f855a'};
        }

        .error-text,
        .success-text,
        .total-price {
          font-size: 0.9rem;
          margin-top: 1rem;
          text-align: center;
        }

        .error-text {
          color: #f43f5e;
        }

        .success-text {
          color: #48bb78;
        }

        .total-price {
          color: ${darkMode ? '#63b3ed' : '#3182ce'};
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 200px;
          }

          .main-content {
            margin-left: 200px;
            padding: 1.5rem;
          }

          .dashboard-title {
            font-size: 1.8rem;
          }

          .section-title {
            font-size: 1.3rem;
          }

          .wearer-section {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .sidebar {
            width: 100%;
            height: auto;
            position: relative;
            padding: 1rem;
          }

          .main-content {
            margin-left: 0;
            padding: 1rem;
          }

          .dashboard-title {
            font-size: 1.5rem;
          }

          .submit-button {
            width: 100%;
            padding: 0.8rem;
          }

          .eye-section {
            flex-direction: column;
          }
        }
      `}</style>

      <br className='mt-5'></br>
      <div className="sidebar mt-5"> 
        <br className='mt-5 '></br>
        <h2 className="sidebar-title mt-5 ">Tableau de bord Opticien</h2>
        <div className="sidebar-menu">
          <div
            className={`menu-item ${activeSection === 'order' ? 'active' : ''}`}
            onClick={() => setActiveSection('order')}
          >
            Nouvelle commande
          </div>
          <div
            className={`menu-item ${activeSection === 'my-orders' ? 'active' : ''}`}
            onClick={() => setActiveSection('my-orders')}
          >
            Mes commandes
          </div>
          <div className="logout-button" onClick={handleLogout}>
            Déconnexion
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Bienvenue, {user?.email}
          </h1>
          <button
            onClick={toggleDarkMode}
            className="dark-mode-toggle"
            aria-label={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {activeSection === 'order' && (
          <motion.div
            className="section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title">Formulaire de commande de montage</h2>
            <form onSubmit={handleOrderSubmit}>
              <div className="form-group">
                <label htmlFor="frameType">Type de montage (Prix: Montage cadre: 30 TND, Demi cadre: 25 TND, Percé: 20 TND, Spécial: 35 TND)</label>
                <select
                  id="frameType"
                  value={orderForm.frameType}
                  onChange={(e) =>
                    setOrderForm((prev) => ({ ...prev, frameType: e.target.value }))
                  }
                >
                  <option value="">Sélectionner un type</option>
                  <option value="montage cadre">Montage cadre (30 TND)</option>
                  <option value="demi cadre">Demi cadre (25 TND)</option>
                  <option value="percé">Percé (20 TND)</option>
                  <option value="spécial">Spécial (35 TND)</option>
                </select>
              </div>

              <h3>Valeurs Corrections</h3>
              <div className="eye-section">
                <div>
                  <label>OD (Œil Droit)</label>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Sphère"
                      value={orderForm.corrections.OD.sphere}
                      onChange={(e) => handleCorrectionChange('OD', 'sphere', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Cylindre"
                      value={orderForm.corrections.OD.cylindre}
                      onChange={(e) => handleCorrectionChange('OD', 'cylindre', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Axe"
                      value={orderForm.corrections.OD.axe}
                      onChange={(e) => handleCorrectionChange('OD', 'axe', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Addition"
                      value={orderForm.corrections.OD.addition}
                      onChange={(e) => handleCorrectionChange('OD', 'addition', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label>OG (Œil Gauche)</label>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Sphère"
                      value={orderForm.corrections.OG.sphere}
                      onChange={(e) => handleCorrectionChange('OG', 'sphere', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Cylindre"
                      value={orderForm.corrections.OG.cylindre}
                      onChange={(e) => handleCorrectionChange('OG', 'cylindre', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Axe"
                      value={orderForm.corrections.OG.axe}
                      onChange={(e) => handleCorrectionChange('OG', 'axe', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Addition"
                      value={orderForm.corrections.OG.addition}
                      onChange={(e) => handleCorrectionChange('OG', 'addition', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <h3>Porteur</h3>
              <div className="wearer-section">
                <div className="form-group">
                  <label htmlFor="nom">Nom</label>
                  <input
                    id="nom"
                    type="text"
                    value={orderForm.wearer.nom}
                    onChange={(e) => handleWearerChange('nom', e.target.value)}
                    placeholder="Nom du porteur"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="prenom">Prénom</label>
                  <input
                    id="prenom"
                    type="text"
                    value={orderForm.wearer.prenom}
                    onChange={(e) => handleWearerChange('prenom', e.target.value)}
                    placeholder="Prénom du porteur"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telephone">Téléphone</label>
                  <input
                    id="telephone"
                    type="text"
                    value={orderForm.wearer.telephone}
                    onChange={(e) => handleWearerChange('telephone', e.target.value)}
                    placeholder="Numéro de téléphone"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={orderForm.wearer.email}
                    onChange={(e) => handleWearerChange('email', e.target.value)}
                    placeholder="Adresse email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="lensType">Type de verre (Prix: Dark G15/Brun/Dark Gray D70: 50 TND, D80: 60 TND, Gris 0.00: 40 TND, Gris New: 45 TND, Blue Max: 55 TND, Asph Blue Max: 60 TND)</label>
                <select
                  id="lensType"
                  value={orderForm.lensType}
                  onChange={(e) =>
                    setOrderForm((prev) => ({ ...prev, lensType: e.target.value }))
                  }
                >
                  <option value="">Sélectionner un type de verre</option>
                  {lensOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option} ({lensPrices[option]} TND)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="additionalNotes">Notes supplémentaires</label>
                <textarea
                  id="additionalNotes"
                  value={orderForm.additionalNotes}
                  onChange={(e) =>
                    setOrderForm((prev) => ({ ...prev, additionalNotes: e.target.value }))
                  }
                  placeholder="Notes ou spécifications supplémentaires..."
                />
              </div>

              <button type="submit" className="submit-button">
                Soumettre la commande
              </button>
              {orderError && <p className="error-text">{orderError}</p>}
              {orderSuccess && <p className="success-text">{orderSuccess}</p>}
              {totalPrice !== null && (
                <p className="total-price">Prix total de la commande: {totalPrice} TND</p>
              )}
            </form>
          </motion.div>
        )}

        {activeSection === 'my-orders' && (
          <motion.div
            className="section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title">Mes commandes</h2>
            {orders.length > 0 ? (
              <div className="order-list">
                {orders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    className="order-item"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <p className="order-detail">Type de montage: {order.frameType}</p>
                    <p className="order-detail">Type de verre: {order.lensType || 'Non spécifié'}</p>
                    <p className="order-detail">
                      Porteur: {order.wearer.nom} {order.wearer.prenom}
                    </p>
                    <p className="order-detail">Téléphone: {order.wearer.telephone}</p>
                    <p className="order-detail">Email: {order.wearer.email}</p>
                    <p className="order-detail">
                      OD - Sphère: {order.corrections.OD.sphere || 'N/A'}, 
                      Cylindre: {order.corrections.OD.cylindre || 'N/A'}, 
                      Axe: {order.corrections.OD.axe || 'N/A'}, 
                      Addition: {order.corrections.OD.addition || 'N/A'}
                    </p>
                    <p className="order-detail">
                      OG - Sphère: {order.corrections.OG.sphere || 'N/A'}, 
                      Cylindre: {order.corrections.OG.cylindre || 'N/A'}, 
                      Axe: {order.corrections.OG.axe || 'N/A'}, 
                      Addition: {order.corrections.OG.addition || 'N/A'}
                    </p>
                    {order.additionalNotes && (
                      <p className="order-detail">Notes: {order.additionalNotes}</p>
                    )}
                    <p className="order-detail">
                      Date: {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="order-status">Statut: {order.status}</p>
                    <p className="order-detail">Prix total: {order.totalPrice || 'N/A'} TND</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="order-detail">Aucune commande trouvée.</p>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default OpticienDashboard;