import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ImageComponent from 'src/components/firebase-image';
import { mockTickets } from 'src/_mock/tickets';

export default function NonAdminIndexPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Fetch tickets or other data for the non-admin user
    const fetchTickets = async () => {
      setTickets(mockTickets);
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

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Your Purchased Tickets
      </Typography>

      <Grid container spacing={3}>
        {tickets.map(ticket => (
          <Grid xs={12} sm={6} md={4} key={ticket.id}>
            <Typography>{ticket.title}</Typography>
            <ImageComponent filePath={ticket.imageName} />
            <Typography variant="body2">Date: {ticket.date}</Typography>
            <Typography variant="body2">Venue: {ticket.venue}</Typography>
            <Typography variant="body2">Address: {ticket.venueLocation}</Typography>
            <Typography variant="body2">Price: {ticket.price} EUR</Typography>
            <Typography variant="body2">
              Transportation: {ticket.transportation.origin} - {ticket.transportation.price} EUR
            </Typography>
            <Typography variant="body2">
              Food: {ticket.food.data.food} - {ticket.food.data.price} EUR
            </Typography>
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
              <Typography variant="h6">{selectedTicket.title}</Typography>
              <Typography variant="body1">Date: {selectedTicket.date}</Typography>
              <Typography variant="body1">Venue: {selectedTicket.venue}</Typography>
              <Typography variant="body1">Address: {selectedTicket.venueLocation}</Typography>
              <Typography variant="body1">Price: {selectedTicket.price} EUR</Typography>
              <Typography variant="body1">
                Transportation: {selectedTicket.transportation.origin} - {selectedTicket.transportation.price} EUR
              </Typography>
              <Typography variant="body1">
                Food: {selectedTicket.food.data.food} - {selectedTicket.food.data.price} EUR
              </Typography>
              <Box sx={{ mt: 2 }}>
                <ImageComponent filePath={selectedTicket.qrCode} />
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
