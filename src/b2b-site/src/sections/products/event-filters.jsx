

// import PropTypes from 'prop-types';
// import Box from '@mui/material/Box';
// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import Drawer from '@mui/material/Drawer';
// import Divider from '@mui/material/Divider';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import TextField from '@mui/material/TextField';

// import Iconify from 'src/components/iconify';
// import Scrollbar from 'src/components/scrollbar';

// export default function EventFilters({ openFilter, onOpenFilter, onCloseFilter }) {
//   const renderDateFilter = (
//     <Stack spacing={1}>
//       <Typography variant="subtitle2">Date</Typography>
//       <TextField
//         type="date"
//         variant="outlined"
//         fullWidth
//         InputLabelProps={{
//           shrink: true,
//         }}
//       />
//     </Stack>
//   );

//   const renderLocationFilter = (
//     <Stack spacing={1}>
//       <Typography variant="subtitle2">Location</Typography>
//       <TextField variant="outlined" fullWidth placeholder="Enter location" />
//     </Stack>
//   );

//   return (
//     <>
//       <Button
//         disableRipple
//         color="inherit"
//         endIcon={<Iconify icon="ic:round-filter-list" />}
//         onClick={onOpenFilter}
//       >
//         Filters&nbsp;
//       </Button>

//       <Drawer
//         anchor="right"
//         open={openFilter}
//         onClose={onCloseFilter}
//         PaperProps={{
//           sx: { width: 280, border: 'none', overflow: 'hidden' },
//         }}
//       >
//         <Stack
//           direction="row"
//           alignItems="center"
//           justifyContent="space-between"
//           sx={{ px: 1, py: 2 }}
//         >
//           <Typography variant="h6" sx={{ ml: 1 }}>
//             Filters
//           </Typography>
//           <IconButton onClick={onCloseFilter}>
//             <Iconify icon="eva:close-fill" />
//           </IconButton>
//         </Stack>

//         <Divider />

//         <Scrollbar>
//           <Stack spacing={3} sx={{ p: 3 }}>
//             {renderDateFilter}
//             {renderLocationFilter}
//           </Stack>
//         </Scrollbar>

//         <Box sx={{ p: 3 }}>
//           <Button
//             fullWidth
//             size="large"
//             type="submit"
//             color="inherit"
//             variant="outlined"
//             startIcon={<Iconify icon="ic:round-clear-all" />}
//           >
//             Clear All
//           </Button>
//         </Box>
//       </Drawer>
//     </>
//   );
// }

// EventFilters.propTypes = {
//   openFilter: PropTypes.bool,
//   onOpenFilter: PropTypes.func,
//   onCloseFilter: PropTypes.func,
// };
