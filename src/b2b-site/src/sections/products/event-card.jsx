

import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { images } from 'src/_mock/event-images';
import { format } from 'date-fns';

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
