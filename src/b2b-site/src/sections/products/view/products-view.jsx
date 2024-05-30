import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { getCallable } from 'src/utils/firebase';
import EventCard from '../event-card';
import EventSort from '../event-sort';
import EventFilters from '../event-filters';
import EventCartWidget from '../event-cart-widget';

export default function AppPage() {
  const [events, setEvents] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  useEffect(() => {
    const getEvents = getCallable('endpoints-getEvents');

    getEvents()
      .then((result) => {
        if (result.data && result.data.success) {
          const fetchedEvents = result.data.events.map(event => ({
            id: event.id,
            ...event.data,
          }));
          setEvents(fetchedEvents);
        } else {
          console.error('Error fetching events:', result.data.error);
        }
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  }, []);

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
        {events.length > 0 ? (
          events.map((event) => (
            <Grid key={event.id} xs={12} sm={6} md={3}>
              <EventCard event={event} />
            </Grid>
          ))
        ) : (
          <Typography variant="body1">Loading events...</Typography>
        )}
      </Grid>

      <EventCartWidget />
    </Container>
  );
}













// import React, { useState, useEffect } from 'react';
// import { getFunctions, httpsCallable } from 'firebase/functions'; 
// import { getCallable } from 'src/utils/firebase';
// import EventCard from '../event-card';
// import EventSort from '../event-sort';
// import EventFilters from '../event-filters';
// import EventCartWidget from '../event-cart-widget';

// export default function AppPage() {
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     const getEvents = getCallable('endpoints-getEvents');

//     getEvents()
//       .then((result) => {
//         if (result.data && result.data.success) {
//           setEvents(result.data.events);
//         } else {
//           console.error('Error fetching events:', result.data.error);
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching events:', error);
//       });
//   }, []);

//   return (
//     <div>
//       {events.length > 0 ? (
//         events.map((eventWrapper) => {
//           const event = eventWrapper.data;
//           const eventDate = new Date(event.date._seconds * 1000); // Convert Firestore timestamp to Date
          
//           return (
//             <div key={eventWrapper.id}>
//               <h2>{event.name}</h2>
//               <p><strong>Date:</strong> {eventDate.toDateString()}</p>
//               <p><strong>Location:</strong> {event.location}</p>
//               <p><strong>Price Range:</strong> {event.max_price}</p>
//               <img src={event.image} alt={event.name} style={{ width: '200px' }} />
//               <p>{event.description}</p>
//             </div>
//           );
//         })
//       ) : (
//         <p>Loading events...</p>
//       )}
//     </div>
//   );
// }



// import { useState } from 'react';
// import Stack from '@mui/material/Stack';
// import Container from '@mui/material/Container';
// import Grid from '@mui/material/Unstable_Grid2';
// import Typography from '@mui/material/Typography';

// import { events } from 'src/_mock/events'; 
// import EventCard from '../event-card';
// import EventSort from '../event-sort';
// import EventFilters from '../event-filters';
// import EventCartWidget from '../event-cart-widget';

// export default function ProductsView() {
//   const [openFilter, setOpenFilter] = useState(false);

//   const handleOpenFilter = () => {
//     setOpenFilter(true);
//   };

//   const handleCloseFilter = () => {
//     setOpenFilter(false);
//   };

//   return (
//     <Container>
//       <Typography variant="h4" sx={{ mb: 5 }}>
//         Events Near You
//       </Typography>

//       <Stack
//         direction="row"
//         alignItems="center"
//         flexWrap="wrap-reverse"
//         justifyContent="flex-end"
//         sx={{ mb: 5 }}
//       >
//         <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
//           <EventFilters
//             openFilter={openFilter}
//             onOpenFilter={handleOpenFilter}
//             onCloseFilter={handleCloseFilter}
//           />
//           <EventSort />
//         </Stack>
//       </Stack>

//       <Grid container spacing={3}>
//         {events.map((event) => (
//           <Grid key={event.id} xs={12} sm={6} md={3}>
//             <EventCard event={event} />
//           </Grid>
//         ))}
//       </Grid>

//       <EventCartWidget />
//     </Container>
//   );
// }
