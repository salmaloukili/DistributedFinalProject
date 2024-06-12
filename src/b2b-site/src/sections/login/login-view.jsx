
import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from 'src/utils/firebase';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
          width: { xs: 80, md: 100 },  // Adjust the width for larger logo
          height: { xs: 80, md: 100 }, // Adjust the height for larger logo
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
            textAlign: 'center', // Center align text
          }}
        >
          <Logo
            sx={{
              width: { xs: 120, md: 150 }, // Set logo size for larger display
              height: { xs: 120, md: 150 }, // Set logo size for larger display
              mb: 2, // Add some margin at the bottom
            }}
          />

          <Typography variant="h4">Sign in to Ticket Fusion</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Sign in with Google
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
              onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
            >
              <Iconify icon="eva:google-fill" color="#DF3E30" />
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}

