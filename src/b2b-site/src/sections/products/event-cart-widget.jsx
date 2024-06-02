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
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  const handleRemove = (id) => {
    removeFromCart(id);
  };

  const handleBuy = () => {
    // Implement buy logic here
    clearCart();
  };

  return (
    <StyledRoot>
      <Badge showZero badgeContent={cart.length} color="error" max={99}>
        <Iconify icon="eva:shopping-cart-fill" width={24} height={24} />
      </Badge>
      {cart.length > 0 && (
        <Box sx={{ ml: 2 }}>
          {cart.map((item) => (
            <Box key={item.id} sx={{ mb: 1 }}>
              <Typography variant="body1">{item.event.name}</Typography>
              <Typography variant="body2">Total: {item.total} EUR</Typography>
              <Button onClick={() => handleRemove(item.id)}>Remove</Button>
            </Box>
          ))}
          <Button onClick={handleBuy} variant="contained">Buy</Button>
        </Box>
      )}
    </StyledRoot>
  );
}

