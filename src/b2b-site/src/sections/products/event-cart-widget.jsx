// import Badge from '@mui/material/Badge';
// import { styled } from '@mui/material/styles';
// import Iconify from 'src/components/iconify';

// const StyledRoot = styled('div')(({ theme }) => ({
//   zIndex: 999,
//   display: 'flex',
//   cursor: 'pointer',
//   alignItems: 'center',
//   paddingLeft: theme.spacing(2),
//   paddingRight: theme.spacing(2),
//   paddingTop: theme.spacing(1.25),
//   color: theme.palette.text.primary,
//   backgroundColor: theme.palette.background.paper,
//   transition: theme.transitions.create('opacity'),
//   '&:hover': { opacity: 0.72 },
// }));

// export default function EventCartWidget() {
//   return (
//     <StyledRoot>
//       <Badge showZero badgeContent={0} color="error" max={99}>
//         <Iconify icon="eva:shopping-cart-fill" width={24} height={24} />
//       </Badge>
//     </StyledRoot>
//   );
// }
import React, { useContext } from 'react';
import { Badge, Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import { CartContext } from 'src/context/CartContext';
import { Link } from 'react-router-dom';

const StyledRoot = styled('div')(({ theme }) => ({
  zIndex: 999,
  display: 'flex',
  cursor: 'pointer',
  alignItems: 'center',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1.25),
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  transition: theme.transitions.create('opacity'),
  '&:hover': { opacity: 0.72 },
}));

export default function EventCartWidget() {
  const { cart } = useContext(CartContext);

  return (
    <StyledRoot>
      <Badge showZero badgeContent={cart.length} color="error" max={99}>
        <Iconify icon="eva:shopping-cart-fill" width={24} height={24} />
      </Badge>
      <Link to="/cart" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Box sx={{ ml: 2 }}>
          <Typography variant="body1">Cart</Typography>
        </Box>
      </Link>
    </StyledRoot>
  );
}
