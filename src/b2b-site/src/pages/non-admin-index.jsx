// import { useEffect, useState } from 'react';
// import Container from '@mui/material/Container';
// import Typography from '@mui/material/Typography';
// import Grid from '@mui/material/Unstable_Grid2';

// export default function NonAdminIndexPage() {
//   const [tickets, setTickets] = useState([]);

//   useEffect(() => {
//     // Fetch tickets or other data for the non-admin user
//     // Example fetch function, replace with your own data fetching logic
//     const fetchTickets = async () => {
//       // const response = await fetch('/api/tickets');
//       // const data = await response.json();
//       // setTickets(data);
//     };

//     fetchTickets();
//   }, []);

//   return (
//     <Container maxWidth="xl">
//       <Typography variant="h4" sx={{ mb: 5 }}>
//         Your Purchased Tickets
//       </Typography>

//       <Grid container spacing={3}>
//         {tickets.map(ticket => (
//           <Grid xs={12} sm={6} md={4} key={ticket.id}>
//             <Typography>{ticket.title}</Typography>
//             {/* Add more ticket details here */}
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// }




import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import ImageComponent from 'src/components/firebase-image'; 

export default function NonAdminIndexPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // Fetch tickets or other data for the non-admin user
    // Example fetch function, replace with your own data fetching logic
    const fetchTickets = async () => {
      // Example static data, replace this with your actual data fetching logic
      const data = [
        { id: 1, title: 'Concert A', imageName: 'logo1.png' },
        { id: 2, title: 'Concert B', imageName: 'logo2.jpg' },
        { id: 3, title: 'Concert C', imageName: 'logo3.webp' }
      ];
      setTickets(data);
    };

    fetchTickets();
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Your Purchased Tickets
      </Typography>

      <Grid container spacing={3}>
        {tickets.map(ticket => (
          <Grid xs={12} sm={6} md={4} key={ticket.id}>
            <Typography>{ticket.title}</Typography>
            {/* Display image using ImageComponent */}
            <ImageComponent fileName={ticket.imageName} />
            {/* Add more ticket details here if needed */}
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
