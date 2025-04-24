import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import logo from '../assets/images/logo.png'; // Your logo

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // To store user role
  const navigate = useNavigate();

  // Check authentication, fetch user role, and cart count on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token and fetch user data with backend
          const userRes = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsAuthenticated(true);
          setUserRole(userRes.data.user.role); // Set the user role (admin, client, or other)

          // Fetch cart for authenticated user (admin and client can see cart)
          if (userRes.data.user.role === 'admin' || userRes.data.user.role === 'client') {
            const cartResponse = await axios.get('http://localhost:5000/api/cart', {
              headers: { Authorization: `Bearer ${token}` },
            });
            const count = cartResponse.data.items.reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(count);
          }
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
          setCartCount(0);
        }
      } catch (err) {
        console.error('Erreur lors de la vérification de l\'authentification ou du panier:', err);
        setIsAuthenticated(false);
        setUserRole(null);
        setCartCount(0);
      }
    };
    checkAuth();
  }, []);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole(null);
    setCartCount(0);
    navigate('/signin');
  };

  // Determine if the user can see the "Mes Commandes" link
  const canSeeOrders = () => {
    return isAuthenticated; // Only authenticated users (admin or client) can see "Mes Commandes"
  };

  // Determine if the user can see the "Panier" link
  const canSeeCart = () => {
    if (!isAuthenticated) return true; // Visitors can see the cart link (but not the count)
    return userRole === 'admin' || userRole === 'client'; // Admin and client can see cart
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`navbar ${darkMode ? 'dark' : 'light'}`}
    >
      <style jsx>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

        :root {
          --background: ${darkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
          --text-color: ${darkMode ? '#e5e5e5' : '#333'};
          --link-color: ${darkMode ? '#f5e050' : '#4a90e2'};
          --hover-color: ${darkMode ? '#f5e050' : '#1e3a8a'};
          --border-color: ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          --toggle-bg: ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          --toggle-hover: ${darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
          --button-bg: ${darkMode ? '#444' : '#1e3a8a'};
          --button-hover: ${darkMode ? '#666' : '#3b82f6'};
        }

        .navbar {
          font-family: 'Poppins', sans-serif;
          background: var(--background);
          backdrop-filter: blur(10px);
          padding: 1.2rem 2rem;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          border-bottom: 1px solid var(--border-color);
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
        }

        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .logo-image {
          height: 40px;
          width: auto;
          transition: transform 0.3s ease;
        }

        .logo-image:hover {
          transform: scale(1.1);
        }

        .optique-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--link-color);
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2.5rem;
        }

        .nav-link {
          position: relative;
          color: var(--text-color);
          text-decoration: none;
          font-size: 1.1rem;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -6px;
          left: 0;
          background: var(--hover-color);
          transition: width 0.4s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-link:hover {
          color: var(--hover-color);
        }

        .cart-icon {
          position: relative;
          font-size: 1.5rem;
          color: var(--text-color);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .cart-icon:hover {
          color: var(--hover-color);
        }

        .cart-count {
          position: absolute;
          top: -10px;
          right: -10px;
          background: #ef4444;
          color: #fff;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.8rem;
          font-weight: 600;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        .login-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .login-button,
        .logout-button {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 1.5rem;
          background: var(--button-bg);
          color: #fff;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          border-radius: 25px;
          box-shadow: 0 2px 8px rgba(30, 58, 138, 0.2);
          transition: background 0.3s ease, transform 0.3s ease;
          cursor: pointer;
        }

        .login-button:hover,
        .logout-button:hover {
          background: var(--button-hover);
          transform: translateY(-2px);
        }

        .login-icon {
          font-size: 1.2rem;
        }

        .dark-mode-toggle {
          padding: 0.5rem;
          background: var(--toggle-bg);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          color: var(--text-color);
          font-size: 1.2rem;
          transition: background 0.3s ease;
          margin-left: 1rem;
        }

        .dark-mode-toggle:hover {
          background: var(--toggle-hover);
        }

        @media (max-width: 768px) {
          .navbar-container {
            flex-direction: column;
            padding: 1rem;
          }

          .logo-section {
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }

          .nav-links {
            margin-top: 1.5rem;
            flex-direction: column;
            gap: 1.5rem;
          }

          .login-section {
            margin-top: 1.5rem;
            flex-direction: column;
            gap: 1rem;
          }

          .dark-mode-toggle {
            margin-left: 0;
          }
        }

        @media (max-width: 480px) {
          .optique-name {
            font-size: 1.2rem;
          }

          .nav-link {
            font-size: 1rem;
          }

          .login-button,
          .logout-button {
            padding: 0.5rem 1.2rem;
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div className="navbar-container">
        {/* Logo and Optique Name */}
        <div className="logo-section">
          <Link to="/">
            <motion.img
              src={logo}
              alt="Barbie Vision Logo"
              className="logo-image"
              whileHover={{ scale: 1.1 }}
            />
          </Link>
          <span className="optique-name">BARBIE VISION</span>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link to="/" className="nav-link">
            Accueil
          </Link>
          <Link to="/shop" className="nav-link">
            Boutique
          </Link>
          <Link to="/about" className="nav-link">
            À propos
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
          {canSeeOrders() && (
            <Link to="/orders" className="nav-link">
              Mes Commandes
            </Link>
          )}
          {canSeeCart() && (
            <Link to="/cart" className="cart-icon">
              🛒
              {cartCount > 0 && (userRole === 'admin' || userRole === 'client') && (
                <span className="cart-count">{cartCount}</span>
              )}
            </Link>
          )}
        </div>

        {/* Login/Logout and Dark Mode */}
        <div className="login-section">
          {isAuthenticated ? (
            <>
              <button onClick={handleLogout} className="logout-button">
                <i className="fas fa-sign-out-alt login-icon"></i> Déconnexion
              </button>
            </>
          ) : (
            <Link to="/signin" className="login-button">
              <i className="fas fa-user login-icon"></i> Se connecter
            </Link>
          )}
          <button
            onClick={toggleDarkMode}
            className="dark-mode-toggle"
            aria-label={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;