// import React, { useEffect, useState } from 'react';
// import Container from '@mui/material/Container';
// import Typography from '@mui/material/Typography';
// import Grid from '@mui/material/Unstable_Grid2';
// import Modal from '@mui/material/Modal';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import { functions, httpsCallable, auth } from 'src/utils/firebase'; 
// import ImageComponent from 'src/components/firebase-image';

// export default function NonAdminIndexPage() {
//   const [tickets, setTickets] = useState([]);
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);

//   useEffect(() => {
//     const fetchTickets = async () => {
//       if (auth.currentUser) {
//         try {
//           const getUserPackages = httpsCallable(functions, 'getUserPackages');
//           const response = await getUserPackages();
//           if (response.data) {
//             setTickets(response.data);
//           } else {
//             console.error('Error fetching user packages:', response.data.error);
//           }
//         } catch (error) {
//           console.error('Error fetching user packages:', error);
//         }
//       }
//     };

//     fetchTickets();
//   }, []);

//   const handleOpenModal = (ticket) => {
//     setSelectedTicket(ticket);
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setSelectedTicket(null);
//     setModalOpen(false);
//   };

//   return (
//     <Container maxWidth="xl">
//       <Typography variant="h4" sx={{ mb: 5 }}>
//         Your Purchased Tickets
//       </Typography>

//       <Grid container spacing={3}>
//         {tickets.map((ticket) => (
//           <Grid xs={12} sm={6} md={4} key={ticket.id}>
//             <Typography>{ticket.event.name}</Typography>
//             <ImageComponent filePath={ticket.event.image_url} />
//             <Typography variant="body2">Date: {new Date(ticket.event.date._seconds * 1000).toLocaleDateString()}</Typography>
//             <Typography variant="body2">Venue: {ticket.event.venue.name}</Typography>
//             <Typography variant="body2">Address: {ticket.event.venue.location}</Typography>
//             <Typography variant="body2">Price: {ticket.ticket.price} EUR</Typography>
//             <Typography variant="body2">
//               Transportation: {ticket.transportation.origin} - {ticket.transportation.price} EUR
//             </Typography>
//             <Typography variant="body2">
//               Food: {ticket.food.food} - {ticket.food.price} EUR
//             </Typography>
//             <Button variant="contained" sx={{ mt: 2 }} onClick={() => handleOpenModal(ticket)}>
//               View Details
//             </Button>
//           </Grid>
//         ))}
//       </Grid>

//       <Modal open={modalOpen} onClose={handleCloseModal}>
//         <Box
//           sx={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             width: 400,
//             bgcolor: 'background.paper',
//             boxShadow: 24,
//             p: 4,
//           }}
//         >
//           {selectedTicket && (
//             <>
//               <Typography variant="h6">{selectedTicket.event.name}</Typography>
//               <Typography variant="body1">Date: {new Date(selectedTicket.event.date._seconds * 1000).toLocaleDateString()}</Typography>
//               <Typography variant="body1">Venue: {selectedTicket.event.venue.name}</Typography>
//               <Typography variant="body1">Address: {selectedTicket.event.venue.location}</Typography>
//               <Typography variant="body1">Price: {selectedTicket.ticket.price} EUR</Typography>
//               <Typography variant="body1">
//                 Transportation: {selectedTicket.transportation.origin} - {selectedTicket.transportation.price} EUR
//               </Typography>
//               <Typography variant="body1">
//                 Food: {selectedTicket.food.food} - {selectedTicket.food.price} EUR
//               </Typography>
//               <Box sx={{ mt: 2 }}>
//                 <ImageComponent filePath={selectedTicket.ticket.qrCode} />
//               </Box>
//               <Button variant="contained" sx={{ mt: 2 }} onClick={handleCloseModal}>
//                 Close
//               </Button>
//             </>
//           )}
//         </Box>
//       </Modal>
//     </Container>
//   );
// }




import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { getCallable, auth } from 'src/utils/firebase'; 
import ImageComponent from 'src/components/firebase-image';

export default function NonAdminIndexPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tokenResult, setTokenResult] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
     
        try {
        
          const getUserPackages = getCallable('endpoints-getUserPackages');
          const response = (await getUserPackages());
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

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Your Purchased Tickets
      </Typography>

      <Grid container spacing={3}>
        {tickets.map((ticket) => (
          <Grid xs={12} sm={6} md={4} key={ticket.id}>
            <Typography>{ticket.event.name}</Typography>
            <ImageComponent filePath={ticket.event.image_url} />
            <Typography variant="body2">Date: {new Date(ticket.event.date._seconds * 1000).toLocaleDateString()}</Typography>
            <Typography variant="body2">Venue: {ticket.event.venue.name}</Typography>
            <Typography variant="body2">Address: {ticket.event.venue.location}</Typography>
            <Typography variant="body2">Price: {ticket.ticket.price} EUR</Typography>
            <Typography variant="body2">
              Transportation: {ticket.transportation.origin} - {ticket.transportation.price} EUR
            </Typography>
            <Typography variant="body2">
              Food: {ticket.food.food} - {ticket.food.price} EUR
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
              <Typography variant="h6">{selectedTicket.event.name}</Typography>
              <Typography variant="body1">Date: {new Date(selectedTicket.event.date._seconds * 1000).toLocaleDateString()}</Typography>
              <Typography variant="body1">Venue: {selectedTicket.event.venue.name}</Typography>
              <Typography variant="body1">Address: {selectedTicket.event.venue.location}</Typography>
              <Typography variant="body1">Price: {selectedTicket.ticket.price} EUR</Typography>
              <Typography variant="body1">
                Transportation: {selectedTicket.transportation.origin} - {selectedTicket.transportation.price} EUR
              </Typography>
              <Typography variant="body1">
                Food: {selectedTicket.food.food} - {selectedTicket.food.price} EUR
              </Typography>
              <Box sx={{ mt: 2 }}>
                <ImageComponent filePath={selectedTicket.ticket.qrCode} />
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