import React, { useState } from 'react';
import Navbar from './Navbar'; // Importer la navbar
import productImage1 from '../assets/images/glass1.png';
import productImage2 from '../assets/images/glass1.png';
import productImage3 from '../assets/images/glass1.png';

const Shop = () => {
  const products = [
    { id: 1, name: 'Lunettes de soleil élégantes', price: 89.99, image: productImage1 },
    { id: 2, name: 'Lunettes de vue modernes', price: 129.99, image: productImage2 },
    { id: 3, name: 'Lentilles de contact', price: 29.99, image: productImage3 },
    { id: 4, name: 'Lunettes de soleil élégantes', price: 89.99, image: productImage1 },
    { id: 5, name: 'Lunettes de vue modernes', price: 129.99, image: productImage2 },
    { id: 6, name: 'Lentilles de contact', price: 29.99, image: productImage3 },
  ];

  const [filter, setFilter] = useState('all');

  const filteredProducts = products.filter((product) => {
    if (filter === 'all') return true;
    if (filter === 'sunglasses' && product.name.includes('soleil')) return true;
    if (filter === 'glasses' && product.name.includes('vue')) return true;
    if (filter === 'lenses' && product.name.includes('Lentilles')) return true;
    return false;
  });

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

        .filter-button:hover {
          background: #4a90e2;
          color: #fff;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(74, 144, 226, 0.2);
        }

        .product-button:hover {
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
          .shop-section {
            padding: 3rem 1rem;
          }

          .filter-buttons {
            flex-direction: column;
            gap: 1rem;
          }

          .products-grid {
            grid-template-columns: 1fr;
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

      {/* Utiliser la Navbar centralisée */}
      <Navbar />

      {/* Shop Section */}
      <section style={styles.shopSection}>
        <h2 style={styles.sectionTitle}>Notre Boutique</h2>
        <div style={styles.filterButtons}>
          <button
            style={{
              ...styles.filterButton,
              ...(filter === 'all' ? styles.filterButtonActive : {}),
            }}
            onClick={() => setFilter('all')}
            className="filter-button"
          >
            Tout
          </button>
          <button
            style={{
              ...styles.filterButton,
              ...(filter === 'sunglasses' ? styles.filterButtonActive : {}),
            }}
            onClick={() => setFilter('sunglasses')}
            className="filter-button"
          >
            Lunettes de soleil
          </button>
          <button
            style={{
              ...styles.filterButton,
              ...(filter === 'glasses' ? styles.filterButtonActive : {}),
            }}
            onClick={() => setFilter('glasses')}
            className="filter-button"
          >
            Lunettes de vue
          </button>
          <button
            style={{
              ...styles.filterButton,
              ...(filter === 'lenses' ? styles.filterButtonActive : {}),
            }}
            onClick={() => setFilter('lenses')}
            className="filter-button"
          >
            Lentilles
          </button>
        </div>
        <div style={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <div key={product.id} style={styles.productCard} className="product-card">
              <img src={product.image} alt={product.name} style={styles.productImage} />
              <h3 style={styles.productTitle}>{product.name}</h3>
              <p style={styles.productPrice}>{product.price.toFixed(2)} €</p>
              <a href={`/product/${product.id}`} style={styles.productButton} className="product-button">
                Voir le produit
              </a>
            </div>
          ))}
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
  // Shop Section
  shopSection: {
    padding: '6rem 2rem',
    marginTop: '5rem',
    background: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: '2.8rem',
    marginBottom: '3rem',
    textAlign: 'center',
    color: '#4a90e2',
    fontWeight: 700,
  },
  filterButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '3rem',
    flexWrap: 'wrap',
  },
  filterButton: {
    padding: '0.8rem 1.5rem',
    background: '#fff',
    border: '1px solid #4a90e2',
    borderRadius: '25px',
    color: '#4a90e2',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.3s ease, color 0.3s ease',
  },
  filterButtonActive: {
    background: '#4a90e2',
    color: '#fff',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  productCard: {
    textAlign: 'center',
    padding: '1.5rem',
    background: '#fff',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(74, 144, 226, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  productImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '10px',
    marginBottom: '1rem',
  },
  productTitle: {
    fontSize: '1.4rem',
    marginBottom: '0.5rem',
    color: '#333',
  },
  productPrice: {
    fontSize: '1.2rem',
    marginBottom: '1rem',
    color: '#f5e050',
    fontWeight: 600,
  },
  productButton: {
    display: 'inline-block',
    padding: '0.8rem 1.5rem',
    background: '#4a90e2',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
    borderRadius: '50px',
    transition: 'background 0.3s ease',
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

export default Shop;