import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from 'src/context/CartContext';
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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Cart() {
  const { cart, setCart, timers, setTimers } = useContext(CartContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleRemovePackage = async (packageItem) => {
    try {
      const removePackage = getCallable('endpoints-removePackage');
      const response = (await removePackage({ id: packageItem.id })).data;

      console.log('Remove Package Response:', response);

      if (!response.valid) {
        setSnackbarMessage('Error removing package, refresh and try again');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      setCart(cart.filter((item) => item.id !== packageItem.id));
      setSnackbarMessage('Package removed successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.log('Error removing package:', error);
      setSnackbarMessage('Error removing package, refresh and try again');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleBuyPackages = async () => {
    try {
      const buyPackage = getCallable('endpoints-buyPackage');
      const response = (await buyPackage({ data: cart })).data;
      console.log('Cart', cart);
      console.log('Buy Package Response:', response);

      if (!response.result.valid) {
        setSnackbarMessage(`Error buying packages: ${response.result.message.join(', ')}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      setCart(cart.filter(item => !response.result.ids.includes(item.id)));
      setSnackbarMessage('All packages bought successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error buying packages:', error);
      setSnackbarMessage('Error buying packages, refresh and try again');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const updatedTimers = {};

      cart.forEach(item => {
        const timeLeft = item.expiry - now;
        updatedTimers[item.id] = timeLeft > 0 ? timeLeft : 0;
      });

      setTimers(updatedTimers);
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [cart, setTimers]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      {cart.length === 0 ? (
        <Typography variant="h6">Your cart is empty.</Typography>
      ) : (
        <>
          {cart.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="h6">Event: {item.event.name}</Typography>
                    <Typography variant="body1">
                      Date: {new Date(item.event.date._seconds * 1000).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body1">Genre: {item.event.genre}</Typography>
                    <Typography variant="body1">Venue: {item.event.venue.name}</Typography>
                    <Typography variant="body1">Address: {item.event.venue.location}</Typography>
                    <Typography variant="body1">Ticket Price: {item.event.price} EUR</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="h6">Transportation</Typography>
                    <Typography variant="body1">Origin: {item.transportation.origin}</Typography>
                    <Typography variant="body1">Price: {item.transportation.price} EUR</Typography>
                    <Typography variant="body1">
                      Departure Date: {new Date(item.transportation.departure_date._seconds * 1000).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="h6">Food</Typography>
                    <Typography variant="body1">Food: {item.food.food}</Typography>
                    <Typography variant="body1">Drink: {item.food.drink}</Typography>
                    <Typography variant="body1">Description: {item.food.description}</Typography>
                    <Typography variant="body1">Price: {item.food.price} EUR</Typography>
                  </Grid>
                </Grid>
                <Box mt={2}>
                  <Typography variant="h6">
                    Total: {item.total} EUR
                  </Typography>
                  <Typography variant="body1" color="error">
                    This package is reserved for you for 7 minutes. Time left: {timers[item.id] ? `${Math.floor(timers[item.id] / 60000)}m ${Math.floor((timers[item.id] % 60000) / 1000)}s` : 'Expired'}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRemovePackage(item)}
                    sx={{ mt: 2 }}
                  >
                    Remove Package
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
          <Stack direction="row" spacing={2} mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBuyPackages}
            >
              Buy All Packages
            </Button>
          </Stack>
        </>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
