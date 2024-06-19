/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ImageComponent from 'src/components/firebase-image';

export default function EventCard({ event }) {
  return (
    <Card sx={{ minHeight: '20rem' }}>
      <Box sx={{ position: 'relative' }}>
        <Link
          component={RouterLink}
          to={`/event/${event.id}`}
          state={{ event }}
          sx={{ display: 'block', height: '100%' }}
        >
          <Box
            sx={{
              top: 0,
              width: 1,
              height: 1,

              objectFit: 'cover',
              position: 'absolute',
            }}
          >
            <ImageComponent
              filePath={event.image_url}
              style={{ display: 'block', height: '10rem', width: '100%' }}
            />
          </Box>
        </Link>
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 40,
            height: 40,
            background: 'white',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid white',
          }}
        >
          <ImageComponent
            filePath={event.vendor.logo_url}
            style={{ width: '100%', height: 'auto' }}
          />
        </Box>
      </Box>

      <Stack spacing={2} sx={{ p: 3, pt: '11rem' }}>
        <Link
          component={RouterLink}
          to={`/event/${event.id}`}
          state={{ event }}
          color="inherit"
          underline="hover"
          variant="subtitle2"
        >
          {event.name}
        </Link>
        <Typography variant="subtitle1">
          {event.date && event.date._seconds
            ? new Date(event.date._seconds * 1000).toLocaleDateString('en-GB')
            : 'Date not available'}
          <br />
          {`Price: ${event.price} EUR`}
          <br />
          {`Venue: ${event.venue.name} EUR`}
        </Typography>
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
      _seconds: PropTypes.number.isRequired,
    }).isRequired,
    venue_id: PropTypes.any.isRequired,
    max_price: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};
