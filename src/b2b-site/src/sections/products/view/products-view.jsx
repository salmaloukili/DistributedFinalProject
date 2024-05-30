// import { useState } from 'react';

// import Stack from '@mui/material/Stack';
// import Container from '@mui/material/Container';
// import Grid from '@mui/material/Unstable_Grid2';
// import Typography from '@mui/material/Typography';

// import { products } from 'src/_mock/products';

// import ProductCard from '../product-card';
// import ProductSort from '../product-sort';
// import ProductFilters from '../product-filters';
// import ProductCartWidget from '../product-cart-widget';



// // ----------------------------------------------------------------------

// export default function ProductsView() {
//   const [openFilter, setOpenFilter] = useState(false);

//   const handleOpenFilter = () => {
//     setOpenFilter(true);
//   };

//   const handleCloseFilter = () => {
//     setOpenFilter(false);
//   };

//   return (
//     <Container>
//       <Typography variant="h4" sx={{ mb: 5 }}>
//         Products
//       </Typography>

//       <Stack
//         direction="row"
//         alignItems="center"
//         flexWrap="wrap-reverse"
//         justifyContent="flex-end"
//         sx={{ mb: 5 }}
//       >
//         <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
//           <ProductFilters
//             openFilter={openFilter}
//             onOpenFilter={handleOpenFilter}
//             onCloseFilter={handleCloseFilter}
//           />

//           <ProductSort />
//         </Stack>
//       </Stack>

//       <Grid container spacing={3}>
//         {products.map((product) => (
//           <Grid key={product.id} xs={12} sm={6} md={3}>
//             <ProductCard product={product} />
//           </Grid>
//         ))}
//       </Grid>

//       <ProductCartWidget />
//     </Container>
//   );
// }




import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { events } from 'src/_mock/events'; 
import EventCard from '../event-card';
import EventSort from '../event-sort';
import EventFilters from '../event-filters';
import EventCartWidget from '../event-cart-widget';

export default function ProductsView() {
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Events Near You
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <EventFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
          />
          <EventSort />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid key={event.id} xs={12} sm={6} md={3}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>

      <EventCartWidget />
    </Container>
  );
}
