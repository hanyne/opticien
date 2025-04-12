import React from 'react';
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
import logo from '../assets/images/logo.png';

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  // Données simulées pour les statistiques
  const stats = {
    totalOrders: 120,
    totalCustomers: 85,
    totalRevenue: 15250.50,
  };

  // Données pour le graphique des ventes mensuelles
  const salesData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Ventes mensuelles (€)',
        data: [1200, 1500, 1800, 2200, 1900, 2500, 3000, 2800, 3200, 3500, 4000, 4200],
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
          text: 'Revenus (€)',
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

  return (
    <div style={styles.pageContainer}>
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

        /* Sidebar */
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 250px;
          background: #1e3a8a;
          padding: 2rem 1rem;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 3rem;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          color: #fff;
          text-decoration: none;
          font-size: 1.1rem;
          font-weight: 500;
          border-radius: 8px;
          transition: background 0.3s ease, transform 0.3s ease;
        }

        .sidebar-link:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
        }

        .sidebar-link.active {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Main Content */
        .main-content {
          margin-left: 250px;
          padding: 2rem;
          background: #f5f5f5;
          min-height: 100vh;
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

        .chart-container {
          background: #fff;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          max-width: 1000px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 200px;
          }

          .main-content {
            margin-left: 200px;
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .chart-container {
            padding: 1rem;
          }
        }

        @media (max-width: 480px) {
          .sidebar {
            width: 100%;
            height: auto;
            position: relative;
          }

          .main-content {
            margin-left: 0;
          }
        }
      `}</style>

      {/* Sidebar */}
      <div style={styles.sidebar} className="sidebar">
        <div style={styles.sidebarLogo} className="sidebar-logo">
          <img src={logo} alt="Barbie Vision Logo" style={styles.logoImage} />
          <span style={styles.optiqueName}>BARBIE VISION</span>
        </div>
        <a href="/admin/dashboard" style={styles.sidebarLink} className="sidebar-link active">
          <span style={styles.sidebarIcon}>📊</span> Tableau de bord
        </a>
        <a href="/admin/products" style={styles.sidebarLink} className="sidebar-link">
          <span style={styles.sidebarIcon}>🛍️</span> Produits
        </a>
        <a href="/admin/orders" style={styles.sidebarLink} className="sidebar-link">
          <span style={styles.sidebarIcon}>📦</span> Commandes
        </a>
        <a href="/admin/users" style={styles.sidebarLink} className="sidebar-link">
          <span style={styles.sidebarIcon}>👥</span> Utilisateurs
        </a>
        <a href="/logout" style={styles.sidebarLink} className="sidebar-link">
          <span style={styles.sidebarIcon}>🚪</span> Déconnexion
        </a>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent} className="main-content">
        <h2 style={styles.sectionTitle}>Tableau de bord Admin</h2>

        {/* Statistiques clés */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard} className="stat-card">
            <h3 style={styles.statTitle}>Nombre de commandes</h3>
            <p style={styles.statValue}>{stats.totalOrders}</p>
          </div>
          <div style={styles.statCard} className="stat-card">
            <h3 style={styles.statTitle}>Nombre de clients</h3>
            <p style={styles.statValue}>{stats.totalCustomers}</p>
          </div>
          <div style={styles.statCard} className="stat-card">
            <h3 style={styles.statTitle}>Revenus totaux</h3>
            <p style={styles.statValue}>{stats.totalRevenue.toFixed(2)} €</p>
          </div>
        </div>

        {/* Graphique des ventes mensuelles */}
        <div style={styles.chartContainer} className="chart-container">
          <Line data={salesData} options={chartOptions} />
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
  // Sidebar
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '250px',
    background: '#1e3a8a',
    padding: '2rem 1rem',
    boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    marginBottom: '3rem',
  },
  logoImage: {
    height: '40px',
    width: 'auto',
  },
  optiqueName: {
    fontSize: '1.5rem',
    fontWeight: 700,
    fontFamily: "'Poppins', sans-serif",
    color: '#fff',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
  },
  sidebarLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 500,
    borderRadius: '8px',
  },
  sidebarIcon: {
    fontSize: '1.2rem',
  },
  // Main Content
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