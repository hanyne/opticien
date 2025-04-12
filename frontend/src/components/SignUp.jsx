// client/src/pages/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        fullName,
        email,
        password,
        role: 'client', // Rôle défini par défaut à "client"
      });
      setSuccess(res.data.msg);
      setError('');
      // Rediriger vers la page de connexion après une inscription réussie
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || "Erreur lors de l'inscription");
      setSuccess('');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 0.8rem;
          margin-bottom: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 5px;
          font-size: 1rem;
          font-family: 'Poppins', sans-serif;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #1e3a8a;
          box-shadow: 0 0 5px rgba(30, 58, 138, 0.3);
        }

        .submit-button {
          display: inline-block;
          padding: 0.8rem 2rem;
          background: #1e3a8a;
          color: #fff;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.3s ease;
        }

        .submit-button:hover {
          background: #3b82f6;
          transform: translateY(-2px);
        }

        .link {
          color: #1e3a8a;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .link:hover {
          color: #3b82f6;
        }

        .error-message {
          color: #ef4444;
          text-align: center;
          margin-bottom: 1rem;
        }

        .success-message {
          color: #10b981;
          text-align: center;
          margin-bottom: 1rem;
        }

        .footer-link:hover {
          color: #1e3a8a;
        }

        .social-icon:hover {
          color: #1e3a8a;
          transform: scale(1.2);
        }

        @media (max-width: 768px) {
          .signup-section {
            padding: 3rem 1rem;
          }

          .footer-content {
            flex-direction: column;
            gap: 2rem;
            text-align: center;
          }

          .social-icons {
            justify-content: center;
          }
        }
      `}</style>

      <Navbar />

      {/* Sign Up Section */}
      <section style={styles.signupSection}>
        <h2 style={styles.sectionTitle}>Inscription</h2>
        <form style={styles.form} onSubmit={handleSignUp}>
          {error && <p style={styles.errorMessage} className="error-message">{error}</p>}
          {success && <p style={styles.successMessage} className="success-message">{success}</p>}
          <input
            type="text"
            placeholder="Nom complet"
            style={styles.formInput}
            className="form-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            style={styles.formInput}
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            style={styles.formInput}
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" style={styles.submitButton} className="submit-button">
            S'inscrire
          </button>
          <p style={styles.formText}>
            Déjà un compte ?{' '}
            <a href="/signin" style={styles.link} className="link">
              Connectez-vous ici
            </a>
          </p>
        </form>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>Barbie Vision</h3>
            <p style={styles.footerText}>
              Votre opticien de choix pour des lunettes élégantes et des services professionnels.
            </p>
          </div>
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>Contact</h3>
            <p style={styles.footerText}>123 Rue de la Mode, 75001 Paris</p>
            <p style={styles.footerText}>Tél : +33 1 23 45 67 89</p>
            <p style={styles.footerText}>Email : contact@barbievision.fr</p>
          </div>
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>Horaires</h3>
            <p style={styles.footerText}>Lun-Ven : 10h-19h</p>
            <p style={styles.footerText}>Sam : 10h-17h</p>
            <p style={styles.footerText}>Dim : Fermé</p>
          </div>
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>Liens utiles</h3>
            <a href="/shop" style={styles.footerLink} className="footer-link">
              Boutique
            </a>
            <a href="/about" style={styles.footerLink} className="footer-link">
              À propos
            </a>
            <a href="/contact" style={styles.footerLink} className="footer-link">
              Contact
            </a>
            <a href="/try-on" style={styles.footerLink} className="footer-link">
              Essayage virtuel
            </a>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <div style={styles.socialIcons}>
            <a href="https://facebook.com" style={styles.socialIcon} className="social-icon">
              Facebook
            </a>
            <a href="https://instagram.com" style={styles.socialIcon} className="social-icon">
              Instagram
            </a>
            <a href="https://twitter.com" style={styles.socialIcon} className="social-icon">
              Twitter
            </a>
          </div>
          <p style={styles.footerText}>
            © 2025 Barbie Vision. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  pageContainer: {
    overflowX: 'hidden',
    background: '#fff',
  },
  // Sign Up Section
  signupSection: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5rem 2rem',
    background: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: '2.8rem',
    marginBottom: '2rem',
    color: '#1e3a8a',
    fontWeight: 700,
  },
  form: {
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
  },
  formInput: {
    width: '100%',
    padding: '0.8rem',
    marginBottom: '1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  submitButton: {
    display: 'inline-block',
    padding: '0.8rem 2rem',
    background: '#1e3a8a',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  formText: {
    fontSize: '1rem',
    marginTop: '1rem',
    color: '4b5563',
  },
  link: {
    color: '#1e3a8a',
    textDecoration: 'none',
  },
  errorMessage: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  successMessage: {
    color: '#10b981',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  // Footer
  footer: {
    padding: '4rem 2rem',
    background: '#f5f5f5',
    color: '#4b5563',
  },
  footerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '1400px',
    margin: '0 auto',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  footerSection: {
    flex: '1 1 200px',
    padding: '0 1rem',
  },
  footerTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#1e3a8a',
    fontWeight: 600,
  },
  footerText: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
    color: '#4b5563',
  },
  footerLink: {
    display: 'block',
    color: '#4b5563',
    textDecoration: 'none',
    fontSize: '1rem',
    marginBottom: '0.5rem',
    transition: 'color 0.3s ease',
  },
  footerBottom: {
    textAlign: 'center',
    paddingTop: '2rem',
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  },
  socialIcons: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    justifyContent: 'center',
  },
  socialIcon: {
    color: '#4b5563',
    textDecoration: 'none',
    fontSize: '1.2rem',
    transition: 'color 0.3s ease, transform 0.3s ease',
  },
};

export default SignUp;