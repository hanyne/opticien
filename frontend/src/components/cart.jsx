import React, { useState } from 'react';
import Navbar from './Navbar'; // Importer la navbar

const Cart = () => {
  // Exemple de données pour le panier (vous pouvez les connecter à un état global comme Redux ou un contexte)
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Lunettes de soleil élégantes', price: 89.99, quantity: 1, image: '/path/to/glass1.png' },
    { id: 2, name: 'Lunettes de vue modernes', price: 129.99, quantity: 2, image: '/path/to/glass2.png' },
  ]);

  // Calcul du total
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Fonction pour modifier la quantité
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return; // Empêche la quantité d'être inférieure à 1
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Fonction pour supprimer un article
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
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

        .cart-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
          transition: background 0.3s ease;
        }

        .cart-item:hover {
          background: #f9fafb;
        }

        .quantity-button {
          padding: 0.3rem 0.8rem;
          background: #e5e7eb;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .quantity-button:hover {
          background: #d1d5db;
        }

        .remove-button {
          background: #ef4444;
          color: #fff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .remove-button:hover {
          background: #dc2626;
        }

        .checkout-button {
          background: #1e3a8a;
          color: #fff;
          border: none;
          padding: 1rem 2rem;
          border-radius: 30px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.3s ease;
        }

        .checkout-button:hover {
          background: #3b82f6;
          transform: translateY(-2px);
        }

        .footer-link:hover {
          color: #1e3a8a;
        }

        .social-icon:hover {
          color: #1e3a8a;
          transform: scale(1.2);
        }

        @media (max-width: 768px) {
          .cart-section {
            padding: 3rem 1rem;
          }

          .cart-item {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .cart-item img {
            width: 100px;
            height: 100px;
          }

          .quantity-controls {
            margin: 1rem 0;
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

      {/* Cart Section */}
      <section style={styles.cartSection}>
        <h2 style={styles.sectionTitle}>Votre Panier</h2>
        {cartItems.length === 0 ? (
          <p style={styles.emptyCartText}>Votre panier est vide.</p>
        ) : (
          <>
            <div style={styles.cartItems}>
              {cartItems.map((item) => (
                <div key={item.id} style={styles.cartItem} className="cart-item">
                  <img src={item.image} alt={item.name} style={styles.cartItemImage} />
                  <div style={styles.cartItemDetails}>
                    <h3 style={styles.cartItemName}>{item.name}</h3>
                    <p style={styles.cartItemPrice}>{(item.price * item.quantity).toFixed(2)} €</p>
                    <div style={styles.quantityControls}>
                      <button
                        style={styles.quantityButton}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="quantity-button"
                      >
                        -
                      </button>
                      <span style={styles.quantity}>{item.quantity}</span>
                      <button
                        style={styles.quantityButton}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="quantity-button"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    style={styles.removeButton}
                    onClick={() => removeItem(item.id)}
                    className="remove-button"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
            <div style={styles.cartSummary}>
              <h3 style={styles.summaryTitle}>Total : {total.toFixed(2)} €</h3>
              <button style={styles.checkoutButton} className="checkout-button">
                Passer à la caisse
              </button>
            </div>
          </>
        )}
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
  // Cart Section
  cartSection: {
    padding: '6rem 2rem',
    marginTop: '5rem',
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
  emptyCartText: {
    fontSize: '1.2rem',
    textAlign: 'center',
    color: '#4b5563',
  },
  cartItems: {
    maxWidth: '1000px',
    margin: '0 auto',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    borderBottom: '1px solid #e5e7eb',
  },
  cartItemImage: {
    width: '120px',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginRight: '1.5rem',
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: '0.5rem',
  },
  cartItemPrice: {
    fontSize: '1.1rem',
    color: '#1e3a8a',
    fontWeight: 500,
    marginBottom: '0.5rem',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  quantityButton: {
    padding: '0.3rem 0.8rem',
    background: '#e5e7eb',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  quantity: {
    fontSize: '1rem',
    fontWeight: 500,
    color: '#4b5563',
    margin: '0 0.5rem',
  },
  removeButton: {
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cartSummary: {
    maxWidth: '1000px',
    margin: '2rem auto',
    textAlign: 'right',
  },
  summaryTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: '1rem',
  },
  checkoutButton: {
    background: '#1e3a8a',
    color: '#fff',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '30px',
    fontSize: '1.1rem',
    cursor: 'pointer',
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

export default Cart;