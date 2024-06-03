import React, { useContext } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { CartContext } from 'src/context/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  const handleRemove = (id) => {
    removeFromCart(id);
  };

  const handleBuy = () => {
    // Implement buy logic here
    clearCart();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      {cart.length === 0 ? (
        <Typography variant="body1">Your cart is empty.</Typography>
      ) : (
        <Box>
          {cart.map((item) => (
            <Box key={item.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
              <Typography variant="h6">{item.event.name}</Typography>
              <Typography variant="body2">Date: {item.event.date ? new Date(item.event.date._seconds * 1000).toLocaleDateString('en-GB') : 'Date not available'}</Typography>
              <Typography variant="body2">Location: {item.event.venue_name}</Typography>
              <Typography variant="body2">Address: {item.event.venue_location}</Typography>
              <Typography variant="body2">Ticket: {item.event.max_price} EUR</Typography>
              <Typography variant="body2">Transportation: {item.transportation?.data.origin} - {item.transportation?.data.price} EUR</Typography>
              <Typography variant="body2">Food: {item.food?.data.food} - {item.food?.data.price} EUR</Typography>
              <Typography variant="body2">Total: {item.total} EUR</Typography>
              <Button onClick={() => handleRemove(item.id)} variant="contained" color="secondary" sx={{ mt: 1 }}>Remove</Button>
            </Box>
          ))}
          <Button onClick={handleBuy} variant="contained" color="primary" sx={{ mt: 2 }}>Buy</Button>
        </Box>
      )}
    </Container>
  );
}
