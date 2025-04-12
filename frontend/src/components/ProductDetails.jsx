import React, { useState } from 'react';
import Navbar from './Navbar'; // Importer la navbar

const ProductDetails = () => {
  // Exemple de données pour le produit (vous pouvez les récupérer via une API ou les props)
  const product = {
    id: 1,
    name: 'Lunettes de soleil élégantes',
    price: 89.99,
    description:
      'Ces lunettes de soleil élégantes combinent style et protection. Fabriquées avec des matériaux de haute qualité, elles offrent une protection UV400 et un confort optimal pour un usage quotidien.',
    image: '/path/to/glass1.png',
    colors: ['Noir', 'Bleu', 'Or'],
    sizes: ['Petit', 'Moyen', 'Grand'],
  };

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Logique pour ajouter au panier (par exemple, via un contexte ou Redux)
    alert(`${quantity} ${product.name} (${selectedColor}, ${selectedSize}) ajouté(s) au panier !`);
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

        .product-details {
          display: flex;
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .color-option,
        .size-option {
          padding: 0.5rem 1rem;
          margin: 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease, border-color 0.3s ease;
        }

        .color-option.selected,
        .size-option.selected {
          border-color: #1e3a8a;
          background: #e0f2fe;
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

        .add-to-cart-button {
          background: #1e3a8a;
          color: #fff;
          border: none;
          padding: 1rem 2rem;
          border-radius: 30px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.3s ease;
        }

        .add-to-cart-button:hover {
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
          .product-details {
            flex-direction: column;
            padding: 1rem;
          }

          .product-image {
            width: 100%;
            height: 300px;
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

      {/* Product Details Section */}
      <section style={styles.productDetailsSection}>
        <div style={styles.productDetails} className="product-details">
          <div style={styles.productImageContainer}>
            <img src={product.image} alt={product.name} style={styles.productImage} />
          </div>
          <div style={styles.productInfo}>
            <h2 style={styles.productTitle}>{product.name}</h2>
            <p style={styles.productPrice}>{product.price.toFixed(2)} €</p>
            <p style={styles.productDescription}>{product.description}</p>

            {/* Sélection de la couleur */}
            <div style={styles.options}>
              <h3 style={styles.optionTitle}>Couleur :</h3>
              <div style={styles.optionList}>
                {product.colors.map((color) => (
                  <button
                    key={color}
                    style={{
                      ...styles.colorOption,
                      ...(selectedColor === color ? styles.selectedOption : {}),
                    }}
                    onClick={() => setSelectedColor(color)}
                    className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sélection de la taille */}
            <div style={styles.options}>
              <h3 style={styles.optionTitle}>Taille :</h3>
              <div style={styles.optionList}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    style={{
                      ...styles.sizeOption,
                      ...(selectedSize === size ? styles.selectedOption : {}),
                    }}
                    onClick={() => setSelectedSize(size)}
                    className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantité */}
            <div style={styles.quantitySection}>
              <h3 style={styles.optionTitle}>Quantité :</h3>
              <div style={styles.quantityControls}>
                <button
                  style={styles.quantityButton}
                  onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                  className="quantity-button"
                >
                  -
                </button>
                <span style={styles.quantity}>{quantity}</span>
                <button
                  style={styles.quantityButton}
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-button"
                >
                  +
                </button>
              </div>
            </div>

            {/* Bouton Ajouter au panier */}
            <button
              style={styles.addToCartButton}
              onClick={handleAddToCart}
              className="add-to-cart-button"
            >
              Ajouter au panier
            </button>
          </div>
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
  // Product Details Section
  productDetailsSection: {
    padding: '6rem 2rem',
    marginTop: '5rem',
    background: '#f5f5f5',
    minHeight: '100vh',
  },
  productDetails: {
    display: 'flex',
    gap: '3rem',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  productImageContainer: {
    flex: '1',
  },
  productImage: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  productInfo: {
    flex: '1',
  },
  productTitle: {
    fontSize: '2.2rem',
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: '1rem',
  },
  productPrice: {
    fontSize: '1.8rem',
    fontWeight: 600,
    color: '#1e3a8a',
    marginBottom: '1rem',
  },
  productDescription: {
    fontSize: '1.1rem',
    color: '#4b5563',
    marginBottom: '2rem',
    lineHeight: '1.8',
  },
  options: {
    marginBottom: '1.5rem',
  },
  optionTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: '0.5rem',
  },
  optionList: {
    display: 'flex',
    gap: '0.5rem',
  },
  colorOption: {
    padding: '0.5rem 1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  sizeOption: {
    padding: '0.5rem 1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  selectedOption: {
    borderColor: '#1e3a8a',
    background: '#e0f2fe',
  },
  quantitySection: {
    marginBottom: '2rem',
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
  addToCartButton: {
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

export default ProductDetails;