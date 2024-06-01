import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

export default function NonAdminIndexPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // Fetch tickets or other data for the non-admin user
    // Example fetch function, replace with your own data fetching logic
    const fetchTickets = async () => {
      // const response = await fetch('/api/tickets');
      // const data = await response.json();
      // setTickets(data);
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
            {/* Add more ticket details here */}
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
