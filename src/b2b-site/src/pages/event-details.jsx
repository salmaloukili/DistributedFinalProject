// import React, { useState } from 'react';
// import { useParams, useLocation } from 'react-router-dom';
// import { images } from 'src/_mock/event-images';
// import { Container, Typography, Button, Modal, Box, Stack, Card, CardMedia, CardContent, Grid } from '@mui/material';

// export default function EventDetails() {
//   const { id } = useParams();


//   const location = useLocation();
//   const { event } = location.state || {}; 
  


//   const [modalOpen, setModalOpen] = useState(false);
//   const [step, setStep] = useState(1);
//   const [selectedSeat, setSelectedSeat] = useState(null);
//   const [selectedTransportation, setSelectedTransportation] = useState(null);
//   const [selectedFood, setSelectedFood] = useState(null);

//   if (!event) {
//     return <Typography variant="h4">Event not found</Typography>;
//   }

//   const openModal = () => setModalOpen(true);
//   const closeModal = () => setModalOpen(false);

//   const handleNext = () => {
//     if (step < 4) setStep(step + 1);
//   };

//   const handleBack = () => {
//     if (step > 1) setStep(step - 1);
//   };

//   const addToCart = () => {
//     // Add package to cart logic here
//     closeModal();
//   };

//   const randomImage = images[Math.floor(Math.random() * images.length)].image;

//   const renderModalContent = () => {
//     switch (step) {

//       case 1:
//         return (
//           <Box>
//             <Typography variant="h6">Step 2: Select Transportation</Typography>
//             <Button onClick={() => { setSelectedTransportation('Bus'); handleNext(); }}>Bus</Button>
//             <Button onClick={() => { setSelectedTransportation('Car'); handleNext(); }}>Car</Button>
//           </Box>
//         );
//       case 2:
//         return (
//           <Box>
//             <Typography variant="h6">Step 3: Select Food</Typography>
//             <Button onClick={() => { setSelectedFood('Pizza'); handleNext(); }}>Pizza</Button>
//             <Button onClick={() => { setSelectedFood('Burger'); handleNext(); }}>Burger</Button>
//           </Box>
//         );
//       case 3:
//         return (
//           <Box>
//             <Typography variant="h6">Package Summary</Typography>
//             <Typography>Event: {event.name}</Typography>
//             <Typography>Seat: {selectedSeat}</Typography>
//             <Typography>Transportation: {selectedTransportation}</Typography>
//             <Typography>Food: {selectedFood}</Typography>
//             <Button onClick={addToCart}>Add to Cart</Button>
//           </Box>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <Container>
//       <Card>
//         <CardMedia
//           component="img"
//           height="300"
//           image={randomImage}
//           alt={event.name}
//         />
//         <CardContent>
//           <Typography variant="h4" gutterBottom>{event.name}</Typography>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={8}>
//               <Typography variant="body1" paragraph>hoi hoi</Typography>
//               <Typography variant="body1" component="div" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
//                 Date: hhe
//               </Typography>
//               <Typography variant="body1" component="div" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
//                 Location: {event.venue_id}
//               </Typography>
//               <Typography variant="body1" component="div" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
//                 Address: Av. Victor Rousseau 208, 1190 Forest
//               </Typography>
//               <Typography variant="body1" component="div" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
//                 Opening Doors Time: 19h
//               </Typography>
//               <Typography variant="body1" component="div" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
//                 Price: {event.max_price}
//               </Typography>
              
//             </Grid>
//             <Grid item xs={12} sm={4} display="flex" justifyContent="flex-end" alignItems="center">
//               <Button
//                 onClick={openModal}
//                 variant="contained"
//                 size="large"
//                 sx={{ mt: 2, ml: 2, fontSize: '1.2rem' }}
//               >
//                 Get Package Deal
//               </Button>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>
//       <Modal open={modalOpen} onClose={closeModal}>
//         <Box sx={{ p: 4, backgroundColor: 'white', m: 'auto', mt: 10, borderRadius: 2 }}>
//           {renderModalContent()}
//           <Stack direction="row" justifyContent="space-between" mt={2}>
//             <Button onClick={handleBack} disabled={step === 1}>Back</Button>
//             <Button onClick={handleNext} disabled={step === 4}>Next</Button>
//           </Stack>
//         </Box>
//       </Modal>
//     </Container>
//   );
// }








import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container, Typography, Button, Modal, Box, Stack, Card, CardMedia, CardContent, Grid } from '@mui/material';
import { getCallable } from 'src/utils/firebase';  
import { images } from 'src/_mock/event-images';

export default function EventDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { event } = location.state || {}; 

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
    const getTransportation = getCallable('get-transportation');
    try {
      const result = await getTransportation({ eventId: id });
      if (result.data && result.data.success) {
        setTransportationOptions(result.data.transportation);
      } else {
        console.error('Error fetching transportation options:', result.data.error);
      }
    } catch (error) {
      console.error('Error fetching transportation options:', error);
    }
  };

  const fetchFoodOptions = async () => {
    const getFood = getCallable('get-food');
    try {
      const result = await getFood({ eventId: id });
      if (result.data && result.data.success) {
        setFoodOptions(result.data.food);
      } else {
        console.error('Error fetching food options:', result.data.error);
      }
    } catch (error) {
      console.error('Error fetching food options:', error);
    }
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const addToCart = async () => {
    // Implement add to cart logic here
    closeModal();
  };

  const renderTransportationOptions = () => (
    <Grid container spacing={2}>
      {transportationOptions.map((option) => (
        <Grid item xs={12} sm={6} key={option.busID}>
          <Card onClick={() => { setSelectedTransportation(option); handleNext(); }}>
            <CardContent>
              <Typography variant="h6">Bus ID: {option.busID}</Typography>
              <Typography variant="body1">Origin: {option.origin}</Typography>
              <Typography variant="body1">Price: {option.price} EUR</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderFoodOptions = () => (
    <Grid container spacing={2}>
      {foodOptions.map((option) => (
        <Grid item xs={12} sm={6} key={option.foodID}>
          <Card onClick={() => { setSelectedFood(option); handleNext(); }}>
            <CardContent>
              <Typography variant="h6">Food: {option.name}</Typography>
              <Typography variant="body1">Price: {option.price} EUR</Typography>
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
            <Typography>Seat: {selectedSeat}</Typography>
            <Typography>Transportation: {selectedTransportation?.origin} - {selectedTransportation?.price} EUR</Typography>
            <Typography>Food: {selectedFood?.name} - {selectedFood?.price} EUR</Typography>
            <Button onClick={addToCart}>Add to Cart</Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={randomImage}
          alt={event.name}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>{event.name}</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Typography variant="body1" paragraph>{event.description}</Typography>
              <Typography variant="body1" component="div" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                Date: {event.date ? new Date(event.date._seconds * 1000).toLocaleDateString('en-GB') : 'Date not available'}
              </Typography>
              <Typography variant="body1" component="div" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                Location: {event.venue_id}
              </Typography>
              <Typography variant="body1" component="div" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                Address: Av. Victor Rousseau 208, 1190 Forest
              </Typography>
              <Typography variant="body1" component="div" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                Opening Doors Time: 19h
              </Typography>
              <Typography variant="body1" component="div" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                Price: {event.max_price} EUR
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
        <Box sx={{ p: 4, backgroundColor: 'white', m: 'auto', mt: 10, borderRadius: 2 }}>
          {renderModalContent()}
          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Button onClick={handleBack} disabled={step === 1}>Back</Button>
            <Button onClick={handleNext} disabled={step === 3}>Next</Button>
          </Stack>
        </Box>
      </Modal>
    </Container>
  );
}
