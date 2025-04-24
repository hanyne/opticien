import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './AdminSidebar';

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    totalSales: 0,
  });
  const [pendingOpticianOrders, setPendingOpticianOrders] = useState([]);
  const [processedOpticianOrders, setProcessedOpticianOrders] = useState([]);
  const [lensStock, setLensStock] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found in localStorage');
          navigate('/signin?message=' + encodeURIComponent('Veuillez vous connecter'));
          return;
        }
        console.log('Token found:', token);

        // Fetch user data (still needed to verify authentication, but no role check)
        const userRes = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('User Response:', userRes.data);

        // Fetch client orders
        const clientOrdersRes = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Client Orders Response:', clientOrdersRes.data);
        const clientOrders = clientOrdersRes.data;

        // Fetch optician orders
        const opticianOrdersRes = await axios.get('http://localhost:5000/api/orderopt', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Optician Orders Response:', opticianOrdersRes.data);
        const opticianOrders = opticianOrdersRes.data;

        // Calculate total sales (all orders)
        const totalSales = clientOrders.length + opticianOrders.length;

        // Calculate total revenue (delivered orders only, in TND)
        const clientRevenue = clientOrders
          .filter(order => order.status === 'delivered')
          .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

        const opticianRevenue = opticianOrders
          .filter(order => order.status === 'delivered')
          .reduce((sum) => sum + 100, 0); // Placeholder price per delivered optician order

        const totalRevenue = clientRevenue + opticianRevenue;

        // Fetch unique customers
        const customerEmails = new Set(clientOrders.map(order => order.userId?.email).filter(email => email));
        const totalCustomers = customerEmails.size;

        setStats({
          totalOrders: clientOrders.length,
          totalCustomers,
          totalRevenue,
          totalSales,
        });

        // Filter pending and processed optician orders
        const pendingOrders = opticianOrders.filter(order => order.status === 'pending');
        const processedOrders = opticianOrders.filter(order =>
          ['processing', 'shipped', 'delivered', 'cancelled'].includes(order.status)
        );
        setPendingOpticianOrders(pendingOrders);
        setProcessedOpticianOrders(processedOrders);

        // Fetch lens stock
        const lensStockRes = await axios.get('http://localhost:5000/api/lens-stock', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Lens Stock Response:', lensStockRes.data);
        setLensStock(lensStockRes.data);

        // Fetch monthly sales
        const monthlySalesRes = await axios.get('http://localhost:5000/api/orders/monthly-sales', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Monthly Sales Response:', monthlySalesRes.data);
        setMonthlySales(monthlySalesRes.data);

        setLoading(false);
      } catch (err) {
        console.error('Error:', err.response?.data);
        setError(err.response?.data?.msg || 'Erreur lors de la récupération des données');
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // Données pour le graphique des ventes mensuelles
  const salesData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Ventes mensuelles (TND)',
        data: monthlySales,
        borderColor: '#1e3a8a',
        backgroundColor: 'rgba(30, 58, 138, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ventes mensuelles 2025',
        font: {
          size: 18,
          family: "'Poppins', sans-serif",
        },
        color: '#1e3a8a',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenus (TND)',
          font: {
            size: 14,
            family: "'Poppins', sans-serif",
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Mois',
          font: {
            size: 14,
            family: "'Poppins', sans-serif",
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <Sidebar />
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Poppins', sans-serif;
          color: #4b5563;
          line-height: 1.6;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #f5f5f5;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #4b5563;
          border-top: 5px solid #1e3a8a;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .main-content {
          margin-left: 250px;
          padding: 2rem;
          background: #f5f5f5;
          min-height: 100vh;
        }

        .section-title {
          font-size: 2.8rem;
          margin-bottom: 2rem;
          text-align: center;
          color: #1e3a8a;
          font-weight: 700;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          max-width: 1400px;
          margin: 0 auto 3rem;
        }

        .stat-card {
          background: #fff;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          text-align: center;
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-title {
          font-size: 1.2rem;
          font-weight: 500;
          color: #4b5563;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #1e3a8a;
        }

        .chart-container {
          background: #fff;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          max-width: 1000px;
          margin: 0 auto 3rem;
        }

        .section {
          background: #fff;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          max-width: 1400px;
          margin: 0 auto 3rem;
        }

        .sub-section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e3a8a;
          margin-bottom: 1.5rem;
        }

        .orders-table, .stock-table {
          width: 100%;
          border-collapse: collapse;
        }

        .orders-table th, .orders-table td,
        .stock-table th, .stock-table td {
          padding: 0.8rem;
          text-align: left;
          font-size: 0.9rem;
          color: #4b5563;
        }

        .orders-table th,
        .stock-table th {
          background: #1e3a8a;
          color: #fff;
          font-weight: 600;
        }

        .orders-table tr:nth-child(even),
        .stock-table tr:nth-child(even) {
          background: rgba(0, 0, 0, 0.05);
        }

        .error-text {
          color: #f43f5e;
          font-size: 1rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .no-data {
          text-align: center;
          font-size: 1rem;
          color: #4b5563;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 200px;
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .chart-container, .section {
            padding: 1rem;
          }
        }

        @media (max-width: 480px) {
          .main-content {
            margin-left: 0;
          }

          .section-title {
            font-size: 2rem;
          }

          .sub-section-title {
            font-size: 1.3rem;
          }

          .orders-table, .stock-table {
            font-size: 0.8rem;
          }
        }
      `}</style>

      {/* Main Content */}
      <div style={styles.mainContent} className="main-content">
        <h2 style={styles.sectionTitle}>Tableau de bord Admin</h2>

        {error && <p className="error-text">{error}</p>}

        {/* Statistiques clés */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard} className="stat-card">
            <h3 style={styles.statTitle}>Nombre de ventes effectuées</h3>
            <p style={styles.statValue}>{stats.totalSales}</p>
          </div>
          <div style={styles.statCard} className="stat-card">
            <h3 style={styles.statTitle}>Nombre de clients</h3>
            <p style={styles.statValue}>{stats.totalCustomers}</p>
          </div>
          <div style={styles.statCard} className="stat-card">
            <h3 style={styles.statTitle}>Revenus totaux</h3>
            <p style={styles.statValue}>{stats.totalRevenue.toFixed(2)} TND</p>
          </div>
        </div>

        {/* Graphique des ventes mensuelles */}
        <div style={styles.chartContainer} className="chart-container">
          <Line data={salesData} options={chartOptions} />
        </div>

        {/* Liste des demandes des opticiens */}
        <div className="section">
          <h3 className="sub-section-title">Liste des demandes des opticiens (en attente)</h3>
          {pendingOpticianOrders.length > 0 ? (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Opticien</th>
                  <th>Type de Montage</th>
                  <th>Type de Verre</th>
                  <th>Porteur</th>
                  <th>Date</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {pendingOpticianOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.userId?.email || 'N/A'}</td>
                    <td>{order.frameType}</td>
                    <td>{order.lensType || 'Non spécifié'}</td>
                    <td>{order.wearer.nom} {order.wearer.prenom}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">Aucune demande en attente.</p>
          )}
        </div>

        {/* Historique des demandes traitées */}
        <div className="section">
          <h3 className="sub-section-title">Historique des demandes traitées</h3>
          {processedOpticianOrders.length > 0 ? (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Opticien</th>
                  <th>Type de Montage</th>
                  <th>Type de Verre</th>
                  <th>Porteur</th>
                  <th>Date</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {processedOpticianOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.userId?.email || 'N/A'}</td>
                    <td>{order.frameType}</td>
                    <td>{order.lensType || 'Non spécifié'}</td>
                    <td>{order.wearer.nom} {order.wearer.prenom}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">Aucune demande traitée.</p>
          )}
        </div>

        {/* Stock de verres disponibles */}
        <div className="section">
          <h3 className="sub-section-title">Stock de verres disponibles</h3>
          {lensStock.length > 0 ? (
            <table className="stock-table">
              <thead>
                <tr>
                  <th>Type de Verre</th>
                  <th>Stock Disponible</th>
                </tr>
              </thead>
              <tbody>
                {lensStock.map((lens) => (
                  <tr key={lens._id}>
                    <td>{lens.name}</td>
                    <td>{lens.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">Aucun stock de verres disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    overflowX: 'hidden',
    background: '#fff',
  },
  mainContent: {
    marginLeft: '250px',
    padding: '2rem',
    background: '#f5f5f5',
    minHeight: '100vh',
  },
  sectionTitle: {
    fontSize: '2.8rem',
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#1e3a8a',
    fontWeight: 700,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    maxWidth: '1400px',
    margin: '0 auto 3rem',
  },
  statCard: {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    textAlign: 'center',
  },
  statTitle: {
    fontSize: '1.2rem',
    fontWeight: 500,
    color: '#4b5563',
    marginBottom: '0.5rem',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1e3a8a',
  },
  chartContainer: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    maxWidth: '1000px',
    margin: '0 auto',
  },
};

export default AdminDashboard;