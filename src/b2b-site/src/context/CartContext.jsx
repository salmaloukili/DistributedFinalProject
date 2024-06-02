
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCart((prevCart) =>
        prevCart.filter(item => item.expiry > Date.now())
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const addToCart = useCallback((packageItem) => {
    setCart((prevCart) => [
      ...prevCart,
      { ...packageItem, expiry: Date.now() + 15 * 60 * 1000 }
    ]);
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const contextValue = useMemo(() => ({
    cart, addToCart, removeFromCart, clearCart
  }), [cart, addToCart, removeFromCart, clearCart]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
