import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { events } from 'src/_mock/events';
import { Container, Typography, Button, Modal, Box, Stack } from '@mui/material';

export default function EventDetails() {
  const { id } = useParams();
  const eventDetail = events.find((event) => event.id === parseInt(id, 10)); // Added radix parameter and changed variable name to avoid shadowing
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedTransportation, setSelectedTransportation] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);

  if (!eventDetail) {
    return <Typography variant="h4">Event not found</Typography>;
  }

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const addToCart = () => {
    // Add package to cart logic here
    closeModal();
  };

  const renderModalContent = () => {
    switch (step) {
      case 1:
        return (
          <Box>
            <Typography variant="h6">Step 1: Select a Seat</Typography>
            <Button onClick={() => { setSelectedSeat('Seat 1'); handleNext(); }}>Seat 1</Button>
            <Button onClick={() => { setSelectedSeat('Seat 2'); handleNext(); }}>Seat 2</Button>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6">Step 2: Select Transportation</Typography>
            <Button onClick={() => { setSelectedTransportation('Bus'); handleNext(); }}>Bus</Button>
            <Button onClick={() => { setSelectedTransportation('Car'); handleNext(); }}>Car</Button>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6">Step 3: Select Food</Typography>
            <Button onClick={() => { setSelectedFood('Pizza'); handleNext(); }}>Pizza</Button>
            <Button onClick={() => { setSelectedFood('Burger'); handleNext(); }}>Burger</Button>
          </Box>
        );
      case 4:
        return (
          <Box>
            <Typography variant="h6">Package Summary</Typography>
            <Typography>Event: {eventDetail.name}</Typography>
            <Typography>Seat: {selectedSeat}</Typography>
            <Typography>Transportation: {selectedTransportation}</Typography>
            <Typography>Food: {selectedFood}</Typography>
            <Button onClick={addToCart}>Add to Cart</Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Typography variant="h4">{eventDetail.name}</Typography>
      <Typography variant="body1">{eventDetail.description}</Typography>
      <Typography variant="body1">{eventDetail.date}</Typography>
      <Typography variant="body1">{eventDetail.location}</Typography>
      <Button onClick={openModal}>Get Package Deal</Button>
      <Modal open={modalOpen} onClose={closeModal}>
        <Box sx={{ p: 4, backgroundColor: 'white', m: 'auto', mt: 10, borderRadius: 2 }}>
          {renderModalContent()}
          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Button onClick={handleBack} disabled={step === 1}>Back</Button>
            <Button onClick={handleNext} disabled={step === 4}>Next</Button>
          </Stack>
        </Box>
      </Modal>
    </Container>
  );
}
