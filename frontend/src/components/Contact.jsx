import React from 'react';
import Navbar from './Navbar';
const Contact = () => {
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
          color: #333;
          line-height: 1.6;
        }

        .nav-link:hover {
          color: #4a90e2;
          transform: scale(1.1);
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 0.8rem;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 1rem;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #4a90e2;
          box-shadow: 0 0 5px rgba(74, 144, 226, 0.3);
        }

        .submit-button:hover {
          background: #3a80d2;
        }

        .footer-link:hover {
          color: #4a90e2;
        }

        .social-icon:hover {
          color: #4a90e2;
          transform: scale(1.2);
        }

        @media (max-width: 768px) {
          .navbar {
            flex-direction: column;
            padding: 1rem;
          }

          .nav-links {
            margin-top: 1rem;
            flex-direction: column;
            gap: 1rem;
          }

          .contact-section,
          .location-section {
            padding: 3rem 1rem;
          }

          .contact-content {
            flex-direction: column;
            gap: 2rem;
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

      {/* Navbar */}
      <Navbar />

      {/* Contact Section */}
      <section style={styles.contactSection}>
        <h2 style={styles.sectionTitle}>Nous contacter</h2>
        <div style={styles.contactContent}>
          <div style={styles.contactInfo}>
            <h3 style={styles.infoTitle}>Informations de contact</h3>
            <p style={styles.infoText}>123 Rue de la Mode, 75001 Paris</p>
            <p style={styles.infoText}>Tél : +33 1 23 45 67 89</p>
            <p style={styles.infoText}>Email : contact@barbievision.fr</p>
          </div>
          <form style={styles.contactForm}>
            <input
              type="text"
              placeholder="Votre nom"
              style={styles.formInput}
              className="form-input"
            />
            <input
              type="email"
              placeholder="Votre email"
              style={styles.formInput}
              className="form-input"
            />
            <textarea
              placeholder="Votre message"
              rows="5"
              style={styles.formTextarea}
              className="form-textarea"
            ></textarea>
            <button type="submit" style={styles.submitButton} className="submit-button">
              Envoyer
            </button>
          </form>
        </div>
      </section>

      {/* Location Section */}
      <section style={styles.locationSection}>
        <h2 style={styles.sectionTitle}>Où nous trouver</h2>
        <p style={styles.locationText}>
          Nous sommes situés au cœur de Paris, à l'adresse suivante : <br />
          <strong>123 Rue de la Mode, 75001 Paris</strong>
        </p>
        <div style={styles.mapContainer}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.991625693759!2d2.342104315674!3d48.858844079287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sEiffel%20Tower!5e0!3m2!1sen!2sfr!4v1634567890123!5m2!1sen!2sfr"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Google Map"
          ></iframe>
        </div>
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
  // Navbar
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    background: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 3rem',
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  logo: {
    color: '#333',
    fontSize: '2rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  navLinks: {
    display: 'flex',
    gap: '2.5rem',
  },
  navLink: {
    color: '#666',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 500,
    transition: 'color 0.3s ease, transform 0.3s ease',
  },
  // Contact Section
  contactSection: {
    padding: '6rem 2rem',
    background: '#f5f5f5',
    marginTop: '5rem',
  },
  sectionTitle: {
    fontSize: '2.8rem',
    marginBottom: '3rem',
    textAlign: 'center',
    color: '#4a90e2',
    fontWeight: 700,
  },
  contactContent: {
    display: 'flex',
    justifyContent: 'center',
    gap: '3rem',
    maxWidth: '1200px',
    margin: '0 auto',
    flexWrap: 'wrap',
  },
  contactInfo: {
    flex: '1 1 300px',
  },
  infoTitle: {
    fontSize: '1.6rem',
    marginBottom: '1rem',
    color: '#333',
    fontWeight: 600,
  },
  infoText: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
    color: '#666',
  },
  contactForm: {
    flex: '1 1 400px',
  },
  formInput: {
    width: '100%',
    padding: '0.8rem',
    marginBottom: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  formTextarea: {
    width: '100%',
    padding: '0.8rem',
    marginBottom: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  submitButton: {
    display: 'inline-block',
    padding: '0.8rem 2rem',
    background: '#4a90e2',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  // Location Section
  locationSection: {
    padding: '6rem 2rem',
    background: '#fff',
    textAlign: 'center',
  },
  locationText: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    color: '#666',
  },
  mapContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  // Footer
  footer: {
    padding: '4rem 2rem',
    background: '#f5f5f5',
    color: '#666',
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
    color: '#4a90e2',
    fontWeight: 600,
  },
  footerText: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
    color: '#666',
  },
  footerLink: {
    display: 'block',
    color: '#666',
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
    color: '#666',
    textDecoration: 'none',
    fontSize: '1.2rem',
    transition: 'color 0.3s ease, transform 0.3s ease',
  },
};

export default Contact;