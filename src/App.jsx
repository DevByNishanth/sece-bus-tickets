import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BusListing from './pages/User/BusListing.jsx';
import TicketBooking from './pages/User/TicketBooking.jsx';
import PayUCheckout from './pages/User/PayUCheckout.jsx';
// import Home from './pages/landing/Home.jsx';
// import LoginPage from './pages/LoginPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<BusListing />} />
      <Route path="/buses" element={<BusListing />} />
      <Route path="/ticket-booking" element={<TicketBooking />} />
      <Route path="/booking" element={<TicketBooking />} />
      <Route path="/checkout/payu" element={<PayUCheckout />} />
      <Route path="/payu-checkout" element={<PayUCheckout />} />
    </Routes>
  );
}

export default App;
