import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for message in URL query parameters
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const message = query.get('message');
    if (message) {
      setError(decodeURIComponent(message));
    }
  }, [location.search]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      const { token, role } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'opticien') {
        navigate('/opticien/dashboard'); // Redirect to optician dashboard
      } else {
        navigate('/checkout'); // Redirect to checkout for clients
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Erreur lors de la connexion');
      setLoading(false);
    }
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`signin-container ${darkMode ? 'dark' : 'light'}`}
    >
      <style jsx>{`
        :root {
          --background: ${darkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(135deg, #f3e7fa 0%, #dbeafe 100%)'};
          --card-bg: ${darkMode ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.9)'};
          --card-border: ${darkMode ? 'rgba(255, 94, 142, 0.2)' : 'rgba(74, 144, 226, 0.1)'};
          --text-color: ${darkMode ? '#f1f5f9' : '#1f2937'};
          --title-color: ${darkMode ? '#ff5e8e' : '#4a90e2'};
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

        .signin-container {
          font-family: 'Inter', 'Poppins', sans-serif;
          background: var(--background);
          min-height: 100vh;
          padding: 2rem 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: background 0.4s ease;
        }

        .signin-content {
          max-width: 400px;
          width: 100%;
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

        .signin-title {
          font-size: 2.2rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 2rem;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          background: linear-gradient(90deg, var(--title-color), var(--accent-color));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .form-group {
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

        .error-text {
          font-size: 0.9rem;
          color: #f43f5e;
          text-align: center;
          margin-bottom: 1rem;
        }

        .submit-button {
          display: block;
          width: 100%;
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

        .register-link {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.9rem;
          color: var(--text-color);
        }

        .register-link a {
          color: var(--accent-color);
          text-decoration: none;
          font-weight: 600;
        }

        .register-link a:hover {
          color: ${darkMode ? '#ff8ab4' : '#e04e7e'};
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

        @media (max-width: 480px) {
          .signin-content {
            padding: 1.5rem;
            margin: 1rem;
          }

          .signin-title {
            font-size: 1.8rem;
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

      <div className="signin-content">
        <motion.h2
          className="signin-title"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Connexion
        </motion.h2>

        {error && (
          <motion.p
            className="error-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSignIn}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Adresse email"
              placeholder="votre@email.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Mot de passe"
              placeholder="********"
            />
          </div>
          <motion.button
            type="submit"
            className="submit-button"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </motion.button>
        </form>

        <p className="register-link">
          Pas de compte ? <Link to="/signup">S'inscrire</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignIn;