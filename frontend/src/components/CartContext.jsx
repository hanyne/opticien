import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // Fetch initial cart count on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cart');
        const count = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      } catch (err) {
        console.error('Erreur lors de la récupération du panier:', err);
      }
    };
    fetchCart();
  }, []);

  // Function to update cart count after actions
  const updateCartCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cart');
      const count = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du panier:', err);
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};