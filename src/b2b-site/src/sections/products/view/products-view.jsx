import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { getCallable } from 'src/utils/firebase';
import EventCard from '../event-card';
import EventSort from '../event-sort';
import EventCartWidget from '../event-cart-widget';

export default function AppPage() {
  const [events, setEvents] = useState([]);
  const [sortedEvents, setSortedEvents] = useState([]);
  const [sortOption, setSortOption] = useState('dateAsc'); // Default sort option

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
          console.log(fetchedEvents);
          sortEvents(fetchedEvents, sortOption); // Initial sort
        } else {
          console.error('Error fetching events:', result.data.error);
        }
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  }, []);

  const sortEvents = (eventsToSort, sortBy) => {
    const sorted = [...eventsToSort];
    if (sortBy === 'priceAsc') {
      sorted.sort((a, b) => a.max_price - b.max_price);
    } else if (sortBy === 'priceDesc') {
      sorted.sort((a, b) => b.max_price - a.max_price);
    } else if (sortBy === 'dateAsc') {
      sorted.sort((a, b) => (a.date._seconds - b.date._seconds));
    } else if (sortBy === 'dateDesc') {
      sorted.sort((a, b) => (b.date._seconds - a.date._seconds));
    }
    setSortedEvents(sorted);
  };

  const handleSortChange = (sortBy) => {
    setSortOption(sortBy);
    sortEvents(events, sortBy);
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
          <EventSort onSortChange={handleSortChange} />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {sortedEvents.length > 0 ? (
          sortedEvents.map((event) => (
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

