import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import heroImage1 from '../assets/images/m1.jpg';
import heroImage2 from '../assets/images/m2.jpg';
import heroImage3 from '../assets/images/m3.jpg';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const carouselImages = [heroImage1, heroImage2, heroImage3];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const location = useLocation();
  const successMessage = location.state?.successMessage || '';

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        const topProducts = response.data
          .sort((a, b) => b.stock - a.stock)
          .slice(0, 3);
        setProducts(topProducts);
      } catch (err) {
        setError('Erreur lors de la récupération des produits');
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home-container" style={styles.homeContainer}>
      <style jsx>{`
        .home-container {
          overflow-x: hidden;
          background: #fff;
        }

        .carousel-dot {
          width: 14px;
          height: 14px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .carousel-dot:hover,
        .carousel-dot.active {
          background: #4a90e2;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 20px rgba(74, 144, 226, 0.3);
        }

        .product-card {
          text-align: center;
          padding: 1.5rem;
          background: #fff;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(74, 144, 226, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(74, 144, 226, 0.2);
        }

        .testimonial-card:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 20px rgba(74, 144, 226, 0.2);
        }

        .footer-link:hover {
          color: #4a90e2;
        }

        .social-icon:hover {
          color: #4a90e2;
          transform: scale(1.2);
        }

        .majority-rating {
          font-size: 1rem;
          color: #f5e050;
          margin-bottom: 0.5rem;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.2rem;
          }

          .hero-text {
            font-size: 1rem;
          }

          .features-section,
          .products-section,
          .testimonials-section {
            grid-template-columns: 1fr;
          }

          .about-title,
          .cta-title,
          .products-title,
          .testimonials-title,
          .services-title {
            font-size: 1.8rem;
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

      {successMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="success-message"
        >
          {successMessage}
        </motion.div>
      )}
      <h1>Bienvenue chez Barbie Vision</h1>
      <style jsx>{`
        .success-message {
          font-size: 1.5rem;
          font-weight: 500;
          color: #10b981;
          text-align: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 16px;
          border: 1px solid rgba(74, 144, 226, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(12px);
          margin-bottom: 2rem;
        }
      `}</style>

      <Navbar />

      <section style={styles.heroSection}>
        <div
          style={{
            ...styles.carouselImage,
            backgroundImage: `url(${carouselImages[currentSlide]})`,
          }}
        ></div>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Sublimez votre regard avec des lunettes modernes et élégantes
          </h1>
          <p style={styles.heroText}>
            Essayage virtuel, montures personnalisées et services pour opticiens.
          </p>
          <a href="/shop" style={styles.ctaButton}>
            Découvrir la collection
          </a>
        </div>
        <div style={styles.carouselDots}>
          {carouselImages.map((_, index) => (
            <span
              key={index}
              style={{
                ...styles.carouselDot,
                ...(index === currentSlide ? styles.carouselDotActive : {}),
              }}
              onClick={() => setCurrentSlide(index)}
              className="carousel-dot"
            ></span>
          ))}
        </div>
      </section>

      <section style={styles.servicesSection}>
        <h2 style={styles.servicesTitle}>Nos services exclusifs</h2>
        <div style={styles.featuresSection}>
          <div style={styles.featureCard} className="feature-card">
            <h3 style={styles.featureTitle}>Essayage virtuel</h3>
            <p style={styles.featureText}>
              Essayez vos lunettes en ligne grâce à notre technologie de réalité augmentée.
            </p>
          </div>
          <div style={styles.featureCard} className="feature-card">
            <h3 style={styles.featureTitle}>Montage pour opticiens</h3>
            <p style={styles.featureText}>
              Commandes de montage (cadre, demi-cadre, percé, spécial) avec suivi et notifications.
            </p>
          </div>
          <div style={styles.featureCard} className="feature-card">
            <h3 style={styles.featureTitle}>Personnalisation</h3>
            <p style={styles.featureText}>
              Choisissez vos verres et montures pour une vision et un style uniques.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.productsSection}>
        <h2 style={styles.productsTitle}>Nos produits phares</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <div style={styles.productsGrid}>
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} style={styles.productCard} className="product-card">
                <img
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name}
                  style={styles.productImage}
                  onError={(e) => (e.target.src = '/path/to/fallback-image.jpg')}
                />
                <h3 style={styles.productTitle}>{product.name}</h3>
                <p style={styles.productPrice}>{product.price} TND</p>
                <p className="majority-rating">
                  {'★'.repeat(product.majorityRating)}{'☆'.repeat(5 - product.majorityRating)}
                </p>
                <p style={styles.productAvailability}>
                  {product.stock > 0 ? `En stock` : 'Rupture de stock'}
                </p>
                <a href={`/product/${product._id}`} style={styles.productButton}>
                  Voir le produit
                </a>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center' }}>Aucun produit disponible</p>
          )}
        </div>
      </section>

      <section style={styles.aboutSection}>
        <div style={styles.aboutContent}>
          <h2 style={styles.aboutTitle}>Barbie Vision : L'élégance au service de votre vision</h2>
          <p style={styles.aboutText}>
            Chez Barbie Vision, nous combinons style et expertise pour offrir des lunettes qui
            subliment votre regard. Grâce à notre technologie d'essayage virtuel, vous pouvez
            essayer vos lunettes en ligne. Nous proposons également un service dédié aux opticiens
            avec des commandes de montage (cadre, demi-cadre, percé, spécial) et des notifications
            pour suivre l'état de vos demandes.
          </p>
          <a href="/about" style={styles.secondaryButton}>
            En savoir plus
          </a>
        </div>
      </section>

      <section style={styles.testimonialsSection}>
        <h2 style={styles.testimonialsTitle}>Ce que nos clients disent</h2>
        <div style={styles.testimonialsGrid}>
          <div style={styles.testimonialCard} className="testimonial-card">
            <p style={styles.testimonialText}>
              "J'ai adoré l'essayage virtuel ! J'ai trouvé la paire parfaite en quelques clics."
            </p>
            <p style={styles.testimonialAuthor}>- Sophie M.</p>
          </div>
          <div style={styles.testimonialCard} className="testimonial-card">
            <p style={styles.testimonialText}>
              "Service rapide et professionnel pour mes commandes de montage. Les notifications sont
              très pratiques !"
            </p>
            <p style={styles.testimonialAuthor}>- Dr. Pierre L., Opticien</p>
          </div>
          <div style={styles.testimonialCard} className="testimonial-card">
            <p style={styles.testimonialText}>
              "Les lunettes sont magnifiques et le service client est au top !"
            </p>
            <p style={styles.testimonialAuthor}>- Clara D.</p>
          </div>
        </div>
      </section>

      <section style={styles.promotionsSection}>
        <h2 style={styles.promotionsTitle}>Offres spéciales</h2>
        <div style={styles.promotionsContent}>
          <div style={styles.promotionCard}>
            <h3 style={styles.promotionTitle}>2ème paire à -50%</h3>
            <p style={styles.promotionText}>
              Profitez de 50% de réduction sur une deuxième paire de lunettes jusqu'au 30 avril 2025.
            </p>
            <a href="/shop" style={styles.promotionButton}>
              Profiter de l'offre
            </a>
          </div>
          <div style={styles.promotionCard}>
            <h3 style={styles.promotionTitle}>Livraison gratuite</h3>
            <p style={styles.promotionText}>
              Livraison offerte sur toutes les commandes de plus de 100 €.
            </p>
            <a href="/shop" style={styles.promotionButton}>
              Découvrir
            </a>
          </div>
        </div>
      </section>

      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Prête à transformer votre vision ?</h2>
        <p style={styles.ctaText}>
          Essayez nos lunettes en ligne ou passez une commande de montage dès aujourd'hui.
        </p>
        <div style={styles.ctaButtons}>
          <a href="/try-on" style={styles.ctaButton}>
            Essayage virtuel
          </a>
          <a href="/contact" style={styles.ctaButtonAlt}>
            Prendre rendez-vous
          </a>
        </div>
      </section>

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
  homeContainer: {
    overflowX: 'hidden',
    background: '#fff',
  },
  heroSection: {
    height: '100vh',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#fff',
  },
  carouselImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'opacity 0.8s ease-in-out',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, rgba(74, 144, 226, 0.3), rgba(245, 224, 80, 0.5))',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: 700,
    marginBottom: '1rem',
    maxWidth: '900px',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#fff',
  },
  heroText: {
    fontSize: '1.3rem',
    marginBottom: '2rem',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#fff',
  },
  ctaButton: {
    display: 'inline-block',
    padding: '1rem 2.5rem',
    background: '#4a90e2',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1.2rem',
    borderRadius: '50px',
    boxShadow: '0 5px 15px rgba(74, 144, 226, 0.4)',
    transition: 'transform 0.3s ease',
  },
  carouselDots: {
    position: 'absolute',
    bottom: '2rem',
    display: 'flex',
    gap: '0.6rem',
    zIndex: 2,
  },
  carouselDot: {
    width: '14px',
    height: '14px',
    background: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  carouselDotActive: {
    background: '#4a90e2',
  },
  servicesSection: {
    padding: '6rem 2rem',
    background: '#f5f5f5',
  },
  servicesTitle: {
    fontSize: '2.8rem',
    marginBottom: '3rem',
    textAlign: 'center',
    color: '#4a90e2',
    fontWeight: 700,
  },
  featuresSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  featureCard: {
    textAlign: 'center',
    padding: '2.5rem',
    background: '#fff',
    borderRadius: '20px',
    border: '1px solid rgba(74, 144, 226, 0.2)',
    boxShadow: '0 5px 15px rgba(74, 144, 226, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  featureTitle: {
    fontSize: '1.6rem',
    marginBottom: '1rem',
    color: '#4a90e2',
    fontWeight: 600,
  },
  featureText: {
    fontSize: '1rem',
    color: '#666',
  },
  productsSection: {
    padding: '6rem 2rem',
    background: '#fff',
  },
  productsTitle: {
    fontSize: '2.8rem',
    marginBottom: '3rem',
    textAlign: 'center',
    color: '#4a90e2',
    fontWeight: 700,
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
    marginBottom: '0.5rem',
    color: '#f5e050',
    fontWeight: 600,
  },
  productAvailability: {
    fontSize: '1rem',
    marginBottom: '1rem',
    color: '#666',
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
  aboutSection: {
    padding: '6rem 2rem',
    maxWidth: '1400px',
    margin: '0 auto',
    textAlign: 'center',
    background: '#f5f5f5',
  },
  aboutContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  aboutTitle: {
    fontSize: '2.8rem',
    marginBottom: '1.5rem',
    color: '#4a90e2',
    fontWeight: 700,
  },
  aboutText: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    color: '#666',
  },
  secondaryButton: {
    display: 'inline-block',
    padding: '1rem 2.5rem',
    background: 'transparent',
    border: '2px solid #4a90e2',
    color: '#4a90e2',
    textDecoration: 'none',
    fontSize: '1.2rem',
    borderRadius: '50px',
    transition: 'all 0.3s ease',
  },
  testimonialsSection: {
    padding: '6rem 2rem',
    background: '#fff',
  },
  testimonialsTitle: {
    fontSize: '2.8rem',
    marginBottom: '3rem',
    textAlign: 'center',
    color: '#4a90e2',
    fontWeight: 700,
  },
  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  testimonialCard: {
    padding: '2rem',
    background: '#f9f9f9',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(74, 144, 226, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  testimonialText: {
    fontSize: '1.1rem',
    marginBottom: '1rem',
    color: '#666',
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    fontSize: '1rem',
    color: '#4a90e2',
    fontWeight: 600,
  },
  promotionsSection: {
    padding: '6rem 2rem',
    background: '#f5f5f5',
  },
  promotionsTitle: {
    fontSize: '2.8rem',
    marginBottom: '3rem',
    textAlign: 'center',
    color: '#4a90e2',
    fontWeight: 700,
  },
  promotionsContent: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
    flexWrap: 'wrap',
  },
  promotionCard: {
    flex: '1 1 300px',
    padding: '2rem',
    background: '#fff',
    borderRadius: '15px',
    textAlign: 'center',
    boxShadow: '0 5px 15px rgba(74, 144, 226, 0.1)',
  },
  promotionTitle: {
    fontSize: '1.6rem',
    marginBottom: '1rem',
    color: '#4a90e2',
    fontWeight: 600,
  },
  promotionText: {
    fontSize: '1rem',
    marginBottom: '1.5rem',
    color: '#666',
  },
  promotionButton: {
    display: 'inline-block',
    padding: '0.8rem 1.5rem',
    background: '#4a90e2',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
    borderRadius: '50px',
    transition: 'background 0.3s ease',
  },
  ctaSection: {
    padding: '6rem 2rem',
    background: '#4a90e2',
    color: '#fff',
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: '2.8rem',
    marginBottom: '1.5rem',
    fontWeight: 700,
  },
  ctaText: {
    fontSize: '1.3rem',
    marginBottom: '2rem',
  },
  ctaButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  ctaButtonAlt: {
    display: 'inline-block',
    padding: '1rem 2.5rem',
    background: '#f5e050',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1.2rem',
    borderRadius: '50px',
    boxShadow: '0 5px 15px rgba(245, 224, 80, 0.3)',
    transition: 'transform 0.3s ease',
  },
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
  },
  socialIcon: {
    color: '#666',
    textDecoration: 'none',
    fontSize: '1.2rem',
    transition: 'color 0.3s ease, transform 0.3s ease',
  },
};

export default Home;