import { app, auth } from 'src/utils/firebase';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { bgGradient } from 'src/theme/css';
import firebase from 'firebase/compat/app';
import Logo from 'src/components/logo';
import * as firebaseui from 'firebaseui';
import { useEffect } from 'react';
import 'firebaseui/dist/firebaseui.css';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();
  useEffect(() => {
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    ui.start('#firebaseui-auth-container', {
      callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
          console.log(authResult);

          auth.updateCurrentUser(authResult.user);
          return false; // Prevent redirect
        },
        signInFailure: function (authResult, redirectUrl) {
          console.log(authResult);
          return false; // Prevent redirect
        },
      },
      signInOptions: [
        // This array contains all the ways an user can authenticate in your application. For this example, is only by email.
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: true,
        },
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
      signInFlow: "popup",
      credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
    });
  }, []);

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
          width: { xs: 80, md: 100 }, // Adjust the width for larger logo
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
          <div id="firebaseui-auth-container"></div>
        </Card>
      </Stack>
    </Box>
  );
}
