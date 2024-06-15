import React, { useContext } from 'react';
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
} from '@mui/material';

export default function Cart() {
  const { cart, setCart } = useContext(CartContext);

  const handleRemovePackage = async (packageId) => {
    try {
      const removePackage = getCallable('endpoints-removePackage');
      await removePackage({ packageId });
      setCart(cart.filter((item) => item.id !== packageId));
    } catch (error) {
      console.error('Error removing package:', error);
    }
  };

  const handleBuyPackage = async (packageItem) => {
    try {
      const buyPackage = getCallable('endpoints-buyPackage');
      await buyPackage({ package: packageItem });
      setCart(cart.filter((item) => item.id !== packageItem.id));
    } catch (error) {
      console.error('Error buying package:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      {cart.length === 0 ? (
        <Typography variant="h6">Your cart is empty.</Typography>
      ) : (
        cart.map((item) => (
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
                <Stack direction="row" spacing={2} mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleBuyPackage(item)}
                  >
                    Buy Package
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRemovePackage(item.id)}
                  >
                    Remove Package
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}
