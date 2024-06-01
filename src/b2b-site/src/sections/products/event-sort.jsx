

// import { useState } from 'react';
// import Menu from '@mui/material/Menu';
// import Button from '@mui/material/Button';
// import MenuItem from '@mui/material/MenuItem';
// import { listClasses } from '@mui/material/List';
// import Typography from '@mui/material/Typography';
// import Iconify from 'src/components/iconify';

// const SORT_OPTIONS = [
//   { value: 'featured', label: 'Featured' },
//   { value: 'newest', label: 'Newest' },
//   { value: 'priceDesc', label: 'Price: High-Low' },
//   { value: 'priceAsc', label: 'Price: Low-High' },
// ];

// export default function EventSort() {
//   const [open, setOpen] = useState(null);

//   const handleOpen = (event) => {
//     setOpen(event.currentTarget);
//   };

//   const handleClose = () => {
//     setOpen(null);
//   };

//   return (
//     <>
//       <Button
//         disableRipple
//         color="inherit"
//         onClick={handleOpen}
//         endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
//       >
//         Sort By:&nbsp;
//         <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
//           Newest
//         </Typography>
//       </Button>

//       <Menu
//         open={!!open}
//         anchorEl={open}
//         onClose={handleClose}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//         transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//         slotProps={{
//           paper: {
//             sx: {
//               [`& .${listClasses.root}`]: {
//                 p: 0,
//               },
//             },
//           },
//         }}
//       >
//         {SORT_OPTIONS.map((option) => (
//           <MenuItem key={option.value} selected={option.value === 'newest'} onClick={handleClose}>
//             {option.label}
//           </MenuItem>
//         ))}
//       </Menu>
//     </>
//   );
// }
import { useState } from 'react';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { listClasses } from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Iconify from 'src/components/iconify';
import PropTypes from 'prop-types';

const SORT_OPTIONS = [
  { value: 'priceAsc', label: 'Price: Low-High' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'dateAsc', label: 'Date: Soonest First' },
  { value: 'dateDesc', label: 'Date: Furthest First' },
];

EventSort.propTypes = {
  onSortChange: PropTypes.func.isRequired,
};

export default function EventSort({ onSortChange }) {
  const [open, setOpen] = useState(null);
  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0].value);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = (option) => {
    if (option) {
      setSelectedSort(option.value);
      onSortChange(option.value);
    }
    setOpen(null);
  };

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={handleOpen}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        Sort By:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {SORT_OPTIONS.find(option => option.value === selectedSort)?.label}
        </Typography>
      </Button>

      <Menu
        open={!!open}
        anchorEl={open}
        onClose={() => handleClose(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              [`& .${listClasses.root}`]: {
                p: 0,
              },
            },
          },
        }}
      >
        {SORT_OPTIONS.map((option) => (
          <MenuItem 
            key={option.value} 
            selected={option.value === selectedSort} 
            onClick={() => handleClose(option)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

