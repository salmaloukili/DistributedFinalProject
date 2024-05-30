
// import React, { useState, useEffect } from 'react';
// import { getFunctions, httpsCallable } from 'firebase/functions'; 
// import { getCallable } from 'src/utils/firebase';

// export default function AppPage() {
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     const functions = getFunctions();
//     const getEvents = httpsCallable(functions, 'getEvents');

//     getEvents()
//       .then((result) => {
//         setEvents(result.data);
//       })
//       .catch((error) => {
//         console.error('Error fetching events:', error);
//       });
//   }, []);

//   return (
//     <div>
//       {events.length > 0 ? (
//         events.map((event) => (
//           <div key={event.id}>
//             <h2>{event.name}</h2>
//             <p><strong>Date:</strong> {event.date}</p>
//             <p><strong>Location:</strong> {event.location}</p>
//             <p><strong>Price Range:</strong> {event.price}</p>
//             <img src={event.image} alt={event.name} style={{ width: '200px' }} />
//             <p>{event.description}</p>
//           </div>
//         ))
//       ) : (
//         <p>Loading events...</p>
//       )}
//     </div>
//   );
// }



import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { events } from 'src/_mock/events'; 
import EventCard from '../event-card';
import EventSort from '../event-sort';
import EventFilters from '../event-filters';
import EventCartWidget from '../event-cart-widget';

export default function ProductsView() {
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Events Near You
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <EventFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
          />
          <EventSort />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid key={event.id} xs={12} sm={6} md={3}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>

      <EventCartWidget />
    </Container>
  );
}
