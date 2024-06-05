import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Modal,
  Box,
  Stack,
  Card,
  CardMedia,
  CardContent,
  Grid,
} from '@mui/material';
import { CartContext } from 'src/context/CartContext';
import { getCallable } from 'src/utils/firebase';
import { mockTransportationOptions } from 'src/_mock/transportation';
import { images } from 'src/_mock/event-images';
import ImageComponent from 'src/components/firebase-image';

export default function EventDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { event } = location.state || {};
  const { addToCart } = useContext(CartContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedTransportation, setSelectedTransportation] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [transportationOptions, setTransportationOptions] = useState([]);
  const [foodOptions, setFoodOptions] = useState([]);

  const randomImage = images[Math.floor(Math.random() * images.length)].image;

  useEffect(() => {
    if (modalOpen && step === 1) {
      fetchTransportationOptions();
    }
  }, [modalOpen]);

  useEffect(() => {
    if (step === 2) {
      fetchFoodOptions();
    }
  }, [step]);

  if (!event) {
    return <Typography variant="h4">Event not found</Typography>;
  }

  const fetchTransportationOptions = async () => {
    try {
      const result = await new Promise((resolve) => {
        setTimeout(
          () => resolve({ data: { success: true, schedules: mockTransportationOptions } }),
          500
        );
      });
      if (result.data && result.data.success) {
        setTransportationOptions(result.data.schedules);
      } else {
        console.error('Error fetching transportation options:', result.data.error);
      }
    } catch (error) {
      console.error('Error fetching transportation options:', error);
    }
  };

  const fetchFoodOptions = async () => {
    const getFood = getCallable('endpoints-getFood');
    try {
      const result = await getFood();
      if (result.data) {
        setFoodOptions(result.data);
      } else {
        console.error('Error fetching food options:', result.data.error);
      }
    } catch (error) {
      console.error('Error fetching food options:', error);
    }
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setStep(1);
    setSelectedSeat(null);
    setSelectedTransportation(null);
    setSelectedFood(null);
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const addToCartHandler = () => {
    const packageItem = {
      id: `${event.id}-${Date.now()}`,
      event,
      seat: selectedSeat,
      transportation: selectedTransportation,
      food: selectedFood,
      total: selectedTransportation.data.price + selectedFood.data.price + event.max_price,
    };
    addToCart(packageItem);
    closeModal();
  };

  const renderTransportationOptions = () => (
    <Grid container spacing={2}>
      {transportationOptions.map((option) => (
        <Grid item xs={12} sm={6} key={option.id}>
          <Card
            onClick={() => {
              setSelectedTransportation(option);
              handleNext();
            }}
          >
            <CardContent>
              <Typography variant="h6">Bus Model: {option.data.bus.model}</Typography>
              <Typography variant="body1">Origin: {option.data.origin}</Typography>
              <Typography variant="body1">Price: {option.data.price} EUR</Typography>
              <Typography variant="body1">
                Departure Date:{' '}
                {new Date(option.data.departure_date._seconds * 1000).toLocaleDateString()}
              </Typography>
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid white',
                }}
              >
                <ImageComponent filePath="logo2.jpg" style={{ width: '100%', height: 'auto' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderFoodOptions = () => (
    <Grid container spacing={2}>
      {foodOptions.map((option) => (
        <Grid item xs={12} sm={6} key={option.id}>
          <Card
            onClick={() => {
              setSelectedFood(option);
              handleNext();
            }}
          >
            <CardMedia
              component="img"
              height="140"
              image={option.data.image || 'default-food-image.jpg'}
              alt={option.data.food}
            />
            <CardContent>
              <Typography variant="h6">Food: {option.data.food}</Typography>
              <Typography variant="h6">Drink: {option.data.drink}</Typography>
              <Typography variant="body1">Description: {option.data.description}</Typography>
              <Typography variant="body1">Price: {option.data.price} EUR</Typography>
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid white',
                }}
              >
                <ImageComponent filePath="logo3.webp" style={{ width: '100%', height: 'auto' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderModalContent = () => {
    switch (step) {
      case 1:
        return (
          <Box>
            <Typography variant="h6">Step 2: Select Transportation</Typography>
            {renderTransportationOptions()}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6">Step 3: Select Food</Typography>
            {renderFoodOptions()}
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6">Package Summary</Typography>
            <Typography>Event: {event.name}</Typography>
            <Typography>Ticket: {event.max_price} EUR</Typography>
            <Typography>
              Transportation: {selectedTransportation?.data.origin} -{' '}
              {selectedTransportation?.data.price} EUR
            </Typography>
            <Typography>
              Food: {selectedFood?.data.food} - {selectedFood?.data.price} EUR
            </Typography>
            <Typography>
              Total:{' '}
              {(selectedTransportation?.data?.price || 0) +
                (selectedFood?.data?.price || 0) +
                (event.max_price || 0)}{' '}
              EUR
            </Typography>
            <Button onClick={addToCartHandler} disabled={!selectedTransportation || !selectedFood}>
              Add to Cart
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Card>
        <CardMedia component="img" height="300" image={randomImage} alt={event.name} />
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 40,
            height: 40,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid white',
          }}
        >
          <ImageComponent filePath="logo1.png" style={{ width: '100%', height: 'auto' }} />
        </Box>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {event.name}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Typography variant="body1" paragraph>
                {event.description}
              </Typography>
              <Typography
                variant="body1"
                component="div"
                style={{ fontWeight: 'bold', fontSize: '1.1rem' }}
              >
                Date:{' '}
                {event.date
                  ? new Date(event.date._seconds * 1000).toLocaleDateString('en-GB')
                  : 'Date not available'}
              </Typography>
              <Typography
                variant="body1"
                component="div"
                style={{ fontWeight: 'bold', fontSize: '1.1rem' }}
              >
                Location: {event.venue_name}
              </Typography>
              <Typography
                variant="body1"
                component="div"
                style={{ fontWeight: 'bold', fontSize: '1.1rem' }}
              >
                Address: {event.venue_location}
              </Typography>
              <Typography
                variant="body1"
                component="div"
                style={{ fontWeight: 'bold', fontSize: '1.1rem' }}
              >
                Price: {event.max_price} EUR
              </Typography>
              <Typography
                variant="body1"
                component="div"
                style={{ fontWeight: 'bold', fontSize: '1.1rem' }}
              >
                Genre: {event.genre}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} display="flex" justifyContent="flex-end" alignItems="center">
              <Button
                onClick={openModal}
                variant="contained"
                size="large"
                sx={{ mt: 2, ml: 2, fontSize: '1.2rem' }}
              >
                Get Package Deal
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Modal open={modalOpen} onClose={closeModal}>
        <Box
          sx={{
            p: 4,
            backgroundColor: 'white',
            m: 'auto',
            mt: 10,
            borderRadius: 2,
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          {renderModalContent()}
          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Button onClick={handleBack} disabled={step === 1}>
              Back
            </Button>
            <Button onClick={handleNext} disabled={step === 3}>
              Next
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Container>
  );
}
