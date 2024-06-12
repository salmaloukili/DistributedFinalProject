


import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getAuth, sendEmailVerification } from 'firebase/auth';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCart((prevCart) => prevCart.filter(item => item.expiry > Date.now()));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const addToCart = useCallback((packageItem) => {
    setCart((prevCart) => [
      ...prevCart,
      { ...packageItem, expiry: Date.now() + 7 * 60 * 1000 } // 7 minutes
    ]);
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const sendConfirmationEmail = async () => {
    const auth = getAuth();
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        console.log('Confirmation email sent successfully.');
      } catch (error) {
        console.error('Error sending confirmation email:', error);
      }
    }
  };

  const contextValue = useMemo(() => ({
    cart, addToCart, removeFromCart, clearCart, sendConfirmationEmail
  }), [cart, addToCart, removeFromCart, clearCart, sendConfirmationEmail]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
