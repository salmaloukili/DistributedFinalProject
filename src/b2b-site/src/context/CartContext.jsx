import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { getCallable } from 'src/utils/firebase';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
  Stack,
  Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

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

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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
      const response = (await removePackage({ id: item.id })).data;

      console.log('Remove Package Response:', response);

      if (!response.valid) {
        setSnackbarMessage('Error removing package, refresh and try again');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      setCart(cart.filter((item) => item.id !== item.id));
      setSnackbarMessage('Your time to buy the package is up');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.log('Error removing package:', error);
      setSnackbarMessage('Error removing package, refresh and try again');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
          // try {
          //   const removePackage = getCallable('endpoints-removePackage');
          //   await removePackage({ id: item.id });
          // } catch (error) {
          //   console.error('Error removing package:', error);
          // }
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
    cart, addToCart, removeFromCart, clearCart, sendConfirmationEmail, timers, setCart, setTimers
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
