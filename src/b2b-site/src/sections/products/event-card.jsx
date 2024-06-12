/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ImageComponent from 'src/components/firebase-image';
import { useEffect, useState } from 'react';
import { storage } from 'src/utils/firebase';
import { getDownloadURL, ref } from 'firebase/storage';

export default function EventCard({ event }) {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const storageRef = ref(storage, event.image_url);
        const url = await getDownloadURL(storageRef);
        setImageUrl(url);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, [event.image_url]);

  const [logoURL, setLogoURL] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const storageRef = ref(storage, event.vendor.logo_url);
        const url = await getDownloadURL(storageRef);
        setLogoURL(url);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, [event.vendor.logo_url]);

  const renderImg = (
    <Box
      component="img"
      alt={event.name}
      src={imageUrl}
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
          <ImageComponent filePath={logoURL} style={{ width: '100%', height: 'auto' }} />
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
