// import PropTypes from 'prop-types';
// import { Link as RouterLink } from 'react-router-dom';
// import Box from '@mui/material/Box';
// import Link from '@mui/material/Link';
// import Card from '@mui/material/Card';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';

// export default function EventCard({ event }) {
//   const renderImg = (
//     <Box
//       component="img"
//       alt={event.name}
//       src={event.image}
//       sx={{
//         top: 0,
//         width: 1,
//         height: 1,
//         objectFit: 'cover',
//         position: 'absolute',
//       }}
//     />
//   );

//   const renderDetails = (
//     <Typography variant="subtitle1">
//       {event.date}
//       <br />
//       {event.location}
//       <br />
//       {`Price: ${event.priceRange}`}
//     </Typography>
//   );

//   return (
//     <Card>
//       <Box sx={{ pt: '100%', position: 'relative' }}>
//         {renderImg}
//       </Box>

//       <Stack spacing={2} sx={{ p: 3 }}>
//         <Link
//           component={RouterLink}
//           to={`/event/${event.id}`}
//           color="inherit"
//           underline="hover"
//           variant="subtitle2"
//           noWrap
//         >
//           {event.name}
//         </Link>
//         {renderDetails}
//       </Stack>
//     </Card>
//   );
// }

// EventCard.propTypes = {
//   event: PropTypes.object,
// };





import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function EventCard({ event }) {
  const renderImg = (
    <Box
      component="img"
      alt={event.name}
      src={event.image || 'https://via.placeholder.com/150'} // Hardcoded image or placeholder
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderDetails = (
    <Typography variant="subtitle1">
      {new Date(event.date.seconds * 1000).toLocaleDateString()} {/* Convert Firestore timestamp to Date string */}
      <br />
      {event.venue_id}
      <br />
      {`Price: ${event.max_price} EUR`}
    </Typography>
  );

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {renderImg}
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link
          component={RouterLink}
          to={`/event/${event.id}`} // Use event id for routing
          color="inherit"
          underline="hover"
          variant="subtitle2"
          noWrap
        >
          {event.name}
        </Link>
        {renderDetails}
      </Stack>
    </Card>
  );
}

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    image: PropTypes.string,
    name: PropTypes.string.isRequired,
    date: PropTypes.shape({
      seconds: PropTypes.number.isRequired,
    }).isRequired,
    venue_id: PropTypes.string.isRequired,
    max_price: PropTypes.number.isRequired,
  }).isRequired,
};
