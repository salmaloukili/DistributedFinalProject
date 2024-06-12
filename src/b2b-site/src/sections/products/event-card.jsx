


// EventCard.js
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import {images} from 'src/_mock/event-images';
import ImageComponent from 'src/components/firebase-image';

export default function EventCard({ event }) {
  const randomImage = images[Math.floor(Math.random() * images.length)].image;
  const renderImg = (
    <Box
      component="img"
      alt={event.name}
      src={randomImage || 'https://via.placeholder.com/150'} 
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
      {event.date && event.date._seconds
        ? new Date(event.date._seconds * 1000).toLocaleDateString('en-GB')
        : 'Date not available'}
      <br />
      {`Price: ${event.max_price} EUR`}
    </Typography>
  );

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <Link
          component={RouterLink}
          to={`/event/${event.id}`}
          state={{ event }}
          sx={{ display: 'block', height: '100%' }}
        >
          {renderImg}
        </Link>
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 40,
            height: 40,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid white',
          }}
        >
          <ImageComponent filePath="logo1.png" style={{ width: '100%', height: 'auto' }} />
        </Box>
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link
          component={RouterLink}
          to={`/event/${event.id}`}
          state={{ event }}
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
      _seconds: PropTypes.number.isRequired,
    }).isRequired,
    venue_id: PropTypes.string.isRequired,
    max_price: PropTypes.number.isRequired,
  }).isRequired,
};
