import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { getCallable } from 'src/utils/firebase';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [timers, setTimers] = useState(() => {
    const savedTimers = localStorage.getItem('timers');
    return savedTimers ? JSON.parse(savedTimers) : {};
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('timers', JSON.stringify(timers));
  }, [timers]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const now = Date.now();
      const newCart = [];
      const newTimers = {};

      for (const item of cart) {
        const timeLeft = item.expiry - now;
        if (timeLeft > 0) {
          newCart.push(item);
          newTimers[item.id] = timeLeft;
        } else {
          try {
            const removePackage = getCallable('endpoints-removePackage');
            await removePackage({ id: item.id });
          } catch (error) {
            console.error('Error removing package:', error);
          }
        }
      }

      setCart(newCart);
      setTimers(newTimers);
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [cart]);

  const addToCart = useCallback((packageItem) => {
    setCart((prevCart) => [
      ...prevCart,
      { ...packageItem, expiry: Date.now() + 7 * 60 * 1000 } // 7 minutes
    ]);
    setTimers((prevTimers) => ({
      ...prevTimers,
      [packageItem.id]: 7 * 60 * 1000 // 7 minutes
    }));
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
    setTimers((prevTimers) => {
      const { [id]: _, ...rest } = prevTimers;
      return rest;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setTimers({});
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
    cart, addToCart, removeFromCart, clearCart, sendConfirmationEmail, timers
  }), [cart, addToCart, removeFromCart, clearCart, sendConfirmationEmail, timers]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
