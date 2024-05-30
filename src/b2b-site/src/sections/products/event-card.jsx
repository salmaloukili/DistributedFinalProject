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
      src={event.image}
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
      {event.date}
      <br />
      {event.location}
      <br />
      {`Price: ${event.priceRange}`}
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
          to={`/event/${event.id}`}
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
  event: PropTypes.object,
};
