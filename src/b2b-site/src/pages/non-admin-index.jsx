




import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { getCallable } from 'src/utils/firebase';
import ImageComponent from 'src/components/firebase-image';

export default function NonAdminIndexPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const getUserPackages = getCallable('endpoints-getUserPackages');
        const response = await getUserPackages();
        console.log("get user packages response", response.data);
        if (response.data) {
          setTickets(response.data);
        } else {
          console.error('Error fetching user packages:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching user packages:', error);
      }
    };

    fetchTickets();
  }, []);

  const handleOpenModal = (ticket) => {
    setSelectedTicket(ticket);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
    setModalOpen(false);
  };

  const getTotalPrice = (ticket) => {
    const eventPrice = ticket?.others?.event?.price || 0;
    const transportPrice = ticket?.others?.transportation?.price || 0;
    const foodPrice = ticket?.others?.food?.price || 0;
    return parseFloat(eventPrice) + parseFloat(transportPrice) + parseFloat(foodPrice);
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Your Purchased Tickets
      </Typography>

      <Grid container spacing={3}>
        {tickets.map((ticket) => (
          <Grid xs={12} sm={6} md={4} key={ticket.id}>
            <Typography variant="h6">Event: {ticket?.others?.event?.name}</Typography>
            <Typography variant="body2">
              Purchase Date: {ticket?.ticket?.sold_date?._seconds
                ? new Date(ticket.ticket.sold_date._seconds * 1000).toLocaleDateString()
                : 'N/A'}
            </Typography>
            <Typography variant="body2">
              Event Date: {ticket?.others?.event?.date?._seconds
                ? new Date(ticket.others.event.date._seconds * 1000).toLocaleDateString()
                : 'N/A'}
            </Typography>
            <Typography variant="body2">Total Price: {getTotalPrice(ticket)} EUR</Typography>
            <Typography variant="body2">Status: {ticket?.status}</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => handleOpenModal(ticket)}>
              View Details
            </Button>
          </Grid>
        ))}
      </Grid>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedTicket && (
            <>
              <Typography variant="h6">{selectedTicket?.others?.event?.name}</Typography>
              <Typography variant="body1">
                Purchase Date: {selectedTicket?.ticket?.sold_date?._seconds
                  ? new Date(selectedTicket.ticket.sold_date._seconds * 1000).toLocaleDateString()
                  : 'N/A'}
              </Typography>
              <Typography variant="body1">
                Event Date: {selectedTicket?.others?.event?.date?._seconds
                  ? new Date(selectedTicket.others.event.date._seconds * 1000).toLocaleDateString()
                  : 'N/A'}
              </Typography>
              <Typography variant="body1">Ticket ID: {selectedTicket?.ticket?.id}</Typography>
              <Typography variant="body1">Event Price: {selectedTicket?.others?.event?.price || 'N/A'} EUR</Typography>
              <Typography variant="body1">
                Transportation: {selectedTicket?.others.transportation?.origin || 'N/A'} - {selectedTicket?.others.transportation?.price || 'N/A'} EUR
              </Typography>
              <Typography variant="body1">
                Food: {selectedTicket?.others.food?.food || 'N/A'} - {selectedTicket?.others.food?.price || 'N/A'} EUR
              </Typography>
              <Typography variant="body1">Status: {selectedTicket?.status}</Typography>
              <Box sx={{ mt: 2 }}>
                <ImageComponent filePath={selectedTicket?.others?.event?.image_url} />
              </Box>
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleCloseModal}>
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
}

