import React from 'react';
import logo from '../assets/images/logo.png'; // Remplacez par votre image de logo

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <style jsx>{`
        /* Importation de FontAwesome pour l'icône */
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

        .nav-link {
          position: relative;
          transition: color 0.3s ease;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -6px;
          left: 0;
          background: #1e3a8a;
          transition: width 0.4s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-link:hover {
          color: #1e3a8a;
        }

        .login-button {
          background: #1e3a8a;
          transition: background 0.3s ease, transform 0.3s ease;
        }

        .login-button:hover {
          background: #3b82f6;
          transform: translateY(-2px);
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
          }
        }
      `}</style>

      {/* Conteneur centré pour la navbar */}
      <div style={styles.navbarContainer}>
        {/* Logo et Nom de l'optique */}
        <div style={styles.logoSection}>
          <a href="/">
            <img src={logo} alt="Barbie Vision Logo" style={styles.logoImage} />
          </a>
          <span style={styles.optiqueName}>BARBIE VISION</span>
        </div>

        {/* Liens de navigation */}
        <div style={styles.navLinks}>
          <a href="/" style={styles.navLink} className="nav-link">
            Accueil
          </a>
          <a href="/shop" style={styles.navLink} className="nav-link">
            Boutique
          </a>
          <a href="/about" style={styles.navLink} className="nav-link">
            À propos
          </a>
          <a href="/contact" style={styles.navLink} className="nav-link">
            Contact
          </a>
        </div>

        {/* Bouton de connexion */}
        <div style={styles.loginSection}>
          <a href="/signin" style={styles.loginButton} className="login-button">
            <i className="fas fa-user" style={styles.loginIcon}></i> Se connecter
          </a>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    background: 'rgba(255, 255, 255, 0.95)', // Fond blanc translucide
    backdropFilter: 'blur(8px)', // Effet de flou moderne
    WebkitBackdropFilter: 'blur(8px)', // Support pour Safari
    zIndex: 1000,
    boxShadow: '0 2px 15px rgba(0, 0, 0, 0.05)',
  },
  navbarContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1400px', // Limite la largeur pour éviter que le contenu ne s'étende trop
    margin: '0 auto',
    padding: '1.2rem 2rem',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
  },
  logoImage: {
    height: '40px', // Ajustez selon la taille de votre logo
    width: 'auto',
  },
  optiqueName: {
    fontSize: '1.5rem',
    fontWeight: 700,
    fontFamily: "'Poppins', sans-serif",
    color: '#1e3a8a', // Bleu foncé comme dans l'image
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
  },
  navLinks: {
    display: 'flex',
    gap: '2.5rem',
  },
  navLink: {
    color: '#4b5563', // Gris foncé pour le texte
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 500,
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: '0.5px',
  },
  loginSection: {
    display: 'flex',
    alignItems: 'center',
  },
  loginButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.6rem 1.5rem',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    fontFamily: "'Poppins', sans-serif",
    borderRadius: '25px',
    boxShadow: '0 2px 8px rgba(30, 58, 138, 0.2)',
  },
  loginIcon: {
    fontSize: '1.2rem',
  },
};

export default Navbar;