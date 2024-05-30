import { Helmet } from 'react-helmet-async';

import { ProductsView } from 'src/sections/products/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Products | Minimal UI </title>
      </Helmet>
      <ProductsView />
    </>
  );
}




// import React, { useState, useContext } from 'react';
// import { useHistory } from 'react-router-dom';
// import Modal from 'react-modal';
// import PackageContext from '../context/PackageContext';

// Modal.setAppElement('#root');

// const Products = () => {
//   const { packageDetails, updatePackage } = useContext(PackageContext);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [selectedSeat, setSelectedSeat] = useState(null);
//   const [selectedTransportation, setSelectedTransportation] = useState(null);
//   const [selectedFood, setSelectedFood] = useState(null);
//   const history = useHistory();

//   const events = [
//     { id: 1, name: 'Concert A', location: 'Venue A' },
//     { id: 2, name: 'Concert B', location: 'Venue B' },
//   ];

//   const openModal = (event) => {
//     setSelectedEvent(event);
//     setModalIsOpen(true);
//   };

//   const closeModal = () => {
//     setModalIsOpen(false);
//   };

//   const selectSeat = (seat) => {
//     setSelectedSeat(seat);
//     closeModal();
//   };

//   const selectTransportation = (transportation) => {
//     setSelectedTransportation(transportation);
//   };

//   const selectFood = (food) => {
//     setSelectedFood(food);
//   };

//   const addToCart = () => {
//     updatePackage('event', selectedEvent);
//     updatePackage('seat', selectedSeat);
//     updatePackage('transportation', selectedTransportation);
//     updatePackage('food', selectedFood);

//     history.push('/cart');
//   };

//   const calculatePrice = () => {
//     const basePrice = 100;
//     return basePrice + (selectedSeat ? 20 : 0) + (selectedTransportation ? 10 : 0) + (selectedFood ? 15 : 0);
//   };

//   return (
//     <div>
//       <h1>Events Near You</h1>
//       <div>
//         {events.map(event => (
//           <div key={event.id}>
//             <h2>{event.name}</h2>
//             <p>{event.location}</p>
//             <button type="button" onClick={() => openModal(event)}>Select Ticket</button>
//           </div>
//         ))}
//       </div>

//       <Modal
//         isOpen={modalIsOpen}
//         onRequestClose={closeModal}
//         contentLabel="Select a Seat"
//       >
//         <h2>Select a Seat for {selectedEvent?.name}</h2>
//         <button type="button" onClick={() => selectSeat('Seat 1')}>Seat 1</button>
//         <button type="button" onClick={() => selectSeat('Seat 2')}>Seat 2</button>
//         <button type="button" onClick={closeModal}>Cancel</button>
//       </Modal>

//       {selectedSeat && (
//         <div>
//           <h3>Transportation</h3>
//           <button type="button" onClick={() => selectTransportation('Bus')}>Bus</button>
//           <button type="button" onClick={() => selectTransportation('Car')}>Car</button>
//         </div>
//       )}

//       {selectedTransportation && (
//         <div>
//           <h3>Food</h3>
//           <button type="button" onClick={() => selectFood('Pizza')}>Pizza</button>
//           <button type="button" onClick={() => selectFood('Burger')}>Burger</button>
//         </div>
//       )}

//       {selectedEvent && selectedSeat && selectedTransportation && selectedFood && (
//         <div>
//           <h3>Package Summary</h3>
//           <p>Event: {selectedEvent.name}</p>
//           <p>Seat: {selectedSeat}</p>
//           <p>Transportation: {selectedTransportation}</p>
//           <p>Food: {selectedFood}</p>
//           <p>Total Price: ${calculatePrice()}</p>
//           <button type="button" onClick={addToCart}>Add to Cart</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Products;
