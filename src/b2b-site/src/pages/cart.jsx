


import React, { useContext, useState } from 'react';
import { Container, Box, Typography, Button, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { CartContext } from 'src/context/CartContext';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CartPage() {
  const { cart, removeFromCart, clearCart, sendConfirmationEmail } = useContext(CartContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleRemove = (id) => {
    removeFromCart(id);
    setSnackbarMessage('Item removed from cart');
    setSnackbarOpen(true);
  };

  const handleBuy = async () => {
    await sendConfirmationEmail();
    clearCart();
    setSnackbarMessage('Purchase successful! Confirmation email sent.');
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      {cart.length === 0 ? (
        <Typography variant="body1">Your cart is empty.</Typography>
      ) : (
        <Box>
          {cart.map((item) => (
            <Box key={item.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
              <Typography variant="h6">{item.event.name}</Typography>
              <Typography variant="body2">
                Date:{' '}
                {item.event.date
                  ? new Date(item.event.date._seconds * 1000).toLocaleDateString('en-GB')
                  : 'Date not available'}
              </Typography>
              <Typography variant="body2">Location: {item.event.venue_name}</Typography>
              <Typography variant="body2">Address: {item.event.venue_location}</Typography>
              <Typography variant="body2">Ticket: {item.event.max_price} EUR</Typography>
              <Typography variant="body2">
                Transportation: {item.transportation?.origin || 'N/A'} - {item.transportation?.price || 'N/A'} EUR
              </Typography>
              <Typography variant="body2">
                Food: {item.food?.data?.food || 'N/A'} - {item.food?.data?.price || 'N/A'} EUR
              </Typography>
              <Typography variant="body2">Total: {item.total} EUR</Typography>
              <Button
                onClick={() => handleRemove(item.id)}
                variant="contained"
                color="secondary"
                sx={{ mt: 1 }}
              >
                Remove
              </Button>
            </Box>
          ))}
          <Button onClick={handleBuy} variant="contained" color="primary" sx={{ mt: 2 }}>
            Buy
          </Button>
        </Box>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
