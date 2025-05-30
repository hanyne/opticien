import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Sidebar from '../components/AdminSidebar';

const AdminOpticianOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [lensStock, setLensStock] = useState([]); // State to store lens stock
  const [selectedLens, setSelectedLens] = useState('');
  const [quantity, setQuantity] = useState('');
  const navigate = useNavigate();

  // Fetch optician orders and lens stock on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/signin?message=' + encodeURIComponent('Veuillez vous connecter'));
          return;
        }
        const userRes = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = userRes.data.user;
        if (userData.role !== 'admin') {
          navigate('/signin?message=' + encodeURIComponent('Accès non autorisé'));
          return;
        }

        // Fetch orders
        const query = {};
        if (filterDate) query.date = filterDate;
        if (filterMonth) query.month = filterMonth;
        const ordersRes = await axios.get('http://localhost:5000/api/orderopt', {
          headers: { Authorization: `Bearer ${token}` },
          params: query,
        });
        setOrders(ordersRes.data);

        // Fetch lens stock
        const lensStockRes = await axios.get('http://localhost:5000/api/lens-stock', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLensStock(lensStockRes.data);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || 'Erreur lors de la récupération des données');
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate, filterDate, filterMonth]);

  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://localhost:5000/api/orderopt/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      if (newStatus === 'delivered') {
        const lensStockRes = await axios.get('http://localhost:5000/api/lens-stock', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const lensStock = lensStockRes.data.find((lens) => lens.name === res.data.order.lensType);
        setSuccess(`Commande marquée comme livrée. Stock actuel pour ${res.data.order.lensType}: ${lensStock?.stock || 0}`);
        setLensStock(lensStockRes.data); // Update stock list
      } else if (newStatus === 'cancelled') {
        const lensStockRes = await axios.get('http://localhost:5000/api/lens-stock', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const lensStock = lensStockRes.data.find((lens) => lens.name === res.data.order.lensType);
        setSuccess(`Commande annulée. Stock restauré pour ${res.data.order.lensType}: ${lensStock?.stock || 0}`);
        setLensStock(lensStockRes.data); // Update stock list
      } else {
        setSuccess(res.data.msg);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Erreur lors de la mise à jour du statut');
    }
  };

  // Handle order deletion
  const handleDelete = async (orderId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`http://localhost:5000/api/orderopt/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      setSuccess(res.data.msg);
      // Refresh lens stock after deletion
      const lensStockRes = await axios.get('http://localhost:5000/api/lens-stock', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLensStock(lensStockRes.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Erreur lors de la suppression de la commande');
    }
  };

  // Handle adding to lens stock
  const handleAddLensStock = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/lens-stock/add',
        { name: selectedLens, quantity: Number(quantity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(res.data.msg);
      setSelectedLens('');
      setQuantity('');
      // Refresh lens stock after adding
      const lensStockRes = await axios.get('http://localhost:5000/api/lens-stock', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLensStock(lensStockRes.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Erreur lors de la mise à jour du stock');
    }
  };

  // Auto-dismiss success/error messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="page-title">Gestion des Commandes des Opticiens</h1>

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          {/* Filters */}
          <div className="filters">
            <div className="filter-group">
              <label htmlFor="filterDate">Filtrer par date:</label>
              <input
                type="date"
                id="filterDate"
                value={filterDate}
                onChange={(e) => {
                  setFilterDate(e.target.value);
                  setFilterMonth('');
                }}
              />
            </div>
            <div className="filter-group">
              <label htmlFor="filterMonth">Filtrer par mois:</label>
              <input
                type="month"
                id="filterMonth"
                value={filterMonth}
                onChange={(e) => {
                  setFilterMonth(e.target.value);
                  setFilterDate('');
                }}
              />
            </div>
          </div>

          {/* Orders Table */}
          {orders.length > 0 ? (
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Opticien</th>
                    <th>Type de Montage</th>
                    <th>Type de Verre</th>
                    <th>Porteur</th>
                    <th>Corrections OD</th>
                    <th>Corrections OG</th>
                    <th>Notes</th>
                    <th>Date</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order.userId?.email || 'N/A'}</td>
                      <td>{order.frameType}</td>
                      <td>{order.lensType || 'Non spécifié'}</td>
                      <td>
                        {order.wearer.nom} {order.wearer.prenom}<br />
                        {order.wearer.telephone}<br />
                        {order.wearer.email}
                      </td>
                      <td>
                        Sphère: {order.corrections.OD.sphere || 'N/A'}<br />
                        Cylindre: {order.corrections.OD.cylindre || 'N/A'}<br />
                        Axe: {order.corrections.OD.axe || 'N/A'}<br />
                        Addition: {order.corrections.OD.addition || 'N/A'}
                      </td>
                      <td>
                        Sphère: {order.corrections.OG.sphere || 'N/A'}<br />
                        Cylindre: {order.corrections.OG.cylindre || 'N/A'}<br />
                        Axe: {order.corrections.OG.axe || 'N/A'}<br />
                        Addition: {order.corrections.OG.addition || 'N/A'}
                      </td>
                      <td>{order.additionalNotes || 'Aucune'}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        >
                          <option value="pending">En attente</option>
                          <option value="processing">En cours</option>
                          <option value="shipped">Expédiée</option>
                          <option value="delivered">Livrée</option>
                          <option value="cancelled">Annulée</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(order._id)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Aucune commande trouvée.</p>
          )}

          {/* Lens Stock Management Section */}
          <motion.div
            className="section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="section-title">Gestion du Stock de Verres</h2>
            <form onSubmit={handleAddLensStock}>
              <div className="form-group">
                <label htmlFor="lensType">Type de verre</label>
                <select
                  id="lensType"
                  value={selectedLens}
                  onChange={(e) => setSelectedLens(e.target.value)}
                >
                  <option value="">Sélectionner un type de verre</option>
                  {lensStock.map((lens, index) => (
                    <option key={index} value={lens.name}>
                      {lens.name} (Stock actuel: {lens.stock})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="quantity">Quantité à ajouter</label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Quantité"
                  min="0"
                />
              </div>
              <button type="submit" className="submit-button">
                Ajouter au stock
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        .admin-container {
          display: flex;
        }

        .main-content {
          margin-left: 250px;
          padding: 2rem;
          flex: 1;
          background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
          min-height: 100vh;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #3182ce;
          margin-bottom: 2rem;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #2d3748;
          border-top: 5px solid #3182ce;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-group label {
          font-size: 1rem;
          font-weight: 500;
          color: #2d3748;
        }

        .filter-group input {
          padding: 0.5rem;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          font-size: 1rem;
        }

        .orders-table {
          background: rgba(255, 255, 255, 0.9);
          padding: 1rem;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 0.8rem;
          text-align: left;
          font-size: 0.9rem;
          color: #2d3748;
        }

        th {
          background: #3182ce;
          color: #fff;
          font-weight: 600;
        }

        tr:nth-child(even) {
          background: rgba(0, 0, 0, 0.05);
        }

        select {
          padding: 0.5rem;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          font-size: 0.9rem;
          width: 100%;
        }

        .delete-button {
          padding: 0.5rem 1rem;
          background: #f43f5e;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .delete-button:hover {
          background: #e11d48;
        }

        .error-text,
        .success-text {
          font-size: 1rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .error-text {
          color: #f43f5e;
        }

        .success-text {
          color: #48bb78;
        }

        .section {
          background: rgba(255, 255, 255, 0.9);
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          margin-top: 2rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #3182ce;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-size: 1rem;
          font-weight: 500;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.5rem;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          font-size: 1rem;
        }

        .submit-button {
          padding: 0.5rem 1rem;
          background: #3182ce;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .submit-button:hover {
          background: #2b6cb0;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 200px;
            padding: 1.5rem;
          }

          .page-title {
            font-size: 1.8rem;
          }

          .filters {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .main-content {
            margin-left: 0;
            padding: 1rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          th, td {
            font-size: 0.8rem;
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminOpticianOrders;