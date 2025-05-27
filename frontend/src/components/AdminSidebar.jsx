// client/src/components/Sidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/signin');
  };

  return (
    <div style={styles.sidebar} className="sidebar">
      <div style={styles.sidebarLogo} className="sidebar-logo">
        <img src={logo} alt="Barbie Vision Logo" style={styles.logoImage} />
        <span style={styles.optiqueName}>BARBIE VISION</span>
      </div>
      <a href="/admin/dashboard" style={styles.sidebarLink} className="sidebar-link">
        <span style={styles.sidebarIcon}>📊</span> Tableau de bord
      </a>
      <a href="/admin/products" style={styles.sidebarLink} className="sidebar-link">
        <span style={styles.sidebarIcon}>🛍️</span> Gestion des produits
      </a>
      <a href="/admin/categories" style={styles.sidebarLink} className="sidebar-link">
        <span style={styles.sidebarIcon}>📋</span> Gestion des catégories
      </a>
      <a href="/admin/orders" style={styles.sidebarLink} className="sidebar-link">
        <span style={styles.sidebarIcon}>📦</span> Commandes clients
      </a>
      <a href="/admin/optician-orders" style={styles.sidebarLink} className="sidebar-link">
        <span style={styles.sidebarIcon}>👥</span> Commandes opticiens
      </a>
      <a href="/admin/users" style={styles.sidebarLink} className="sidebar-link"> {/* New link added */}
        <span style={styles.sidebarIcon}>👤</span> Gestion des utilisateurs
      </a>
      <button onClick={handleLogout} style={styles.sidebarLink} className="sidebar-link">
        <span style={styles.sidebarIcon}>🚪</span> Déconnexion
      </button>
    </div>
  );
};

const styles = {
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
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
  },
  sidebarIcon: {
    fontSize: '1.2rem',
  },
};

export default Sidebar;