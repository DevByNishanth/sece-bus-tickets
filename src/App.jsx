import { AuthProvider } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage.jsx";
import Signup from "./pages/Signup.jsx";
import AgentSignup from "./pages/AgentSignup.jsx";

import TravelAgentDashboard from "./pages/TravelAgentDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminBookingOverview from "./pages/AdminBookingOverview.jsx";
import TravelsList from "./pages/TravelsList.jsx";
import AdminCouponsPage from "./pages/AdminCouponsPage.jsx";
import AdminBookingsPage from "./pages/AdminBookingsPage.jsx";

import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/landing/Home.jsx";

// Vendor pages
import Dashboard from "./pages/vendor/Dashboard.jsx";
import SeatGenerationPage from "./pages/vendor/SeatGenerationPage.jsx";
import { VendorDeckSelectionPage } from "./pages/vendor/VendorDeckSelectionPage.jsx";
import VendorDeckRowsPage from "./pages/vendor/VendorDeckRowsPage.jsx";
import VendorDeckArrangementPage from "./pages/vendor/VendorDeckArrangementPage.jsx";

import DriverManagementDashboard from "./pages/vendor/DriverManagement/DriverManagementDashboard.jsx";

import BusManagementDashboard from "./pages/vendor/BusManagement/BusManagementDashboard.jsx";
import BusDetailsPage from "./pages/vendor/BusManagement/BusDetailsPage.jsx";
import BusReviewPage from "./pages/vendor/BusManagement/BusReviewPage.jsx";

import RoomManagementDashboard from "./pages/vendor/RootManagement.jsx/RoomManagementDashboard.jsx";
import AddRoutepage from "./pages/vendor/RootManagement.jsx/AddRoutepage.jsx";
import BusDetailView from "./pages/vendor/BusManagement/BusDetailView.jsx";
import TripsManagmentDashboard from "./pages/vendor/TripsManagment/TripsManagmentDashboard.jsx";
import StaffManagementDashboard from "./pages/vendor/CrewManagement/StaffManagementDashboard.jsx";
import FinanceDashboard from "./pages/vendor/Finance/FinanceDashboard.jsx";
import CalendarDashboard from "./pages/vendor/Calendar/CalendarDashboard.jsx";
import BookingsDashboard from "./pages/vendor/Bookings/BookingsDashboard.jsx";
import BusListing from './pages/User/BusListing.jsx';
import TicketBooking from './pages/User/TicketBooking.jsx';
import PayUCheckout from './pages/User/PayUCheckout.jsx';
import PaymentResult from './pages/User/PaymentResult.jsx';
import MyBookings from './pages/User/MyBookings.jsx';

function App() {
  const location = useLocation();

  const isAuthOverlay = [
    "/",
    "/login",
    "/signup",
    "/agent-signup",
  ].includes(location.pathname);

  return (
    <AuthProvider>
      {isAuthOverlay ? (
        <>
          {/* Landing page stays visible behind authentication modals */}
          <Home />

          {/* Authentication modals */}
          {location.pathname === "/login" && <LoginPage />}

          {location.pathname === "/signup" && <Signup />}

          {location.pathname === "/agent-signup" && <AgentSignup />}
        </>
      ) : (
        <Routes>
          {/* Admin routes */}
          <Route
            path="/admin"
            element={<AdminBookingOverview />}
          />
          <Route
            path="/admin-dashboard"
            element={<AdminDashboard />}
          />
          <Route
            path="/travel-list"
            element={<TravelsList />}
          />
          <Route
            path="/admin-coupons"
            element={<AdminCouponsPage />}
          />
          <Route
            path="/admin-bookings"
            element={<AdminBookingsPage />}
          />

          {/* Travel agent routes */}
          <Route
            path="/travelagent"
            element={<TravelAgentDashboard />}
          />

          {/* Vendor dashboard */}
          <Route
            path="/vendor"
            element={<Dashboard />}
          />

          {/* Vendor seat generation */}
          <Route
            path="/vendor/seatGeneration/:busId"
            element={<SeatGenerationPage />}
          />

          <Route
            path="/vendor/seatGeneration/:busId/deckSelection/:deckType"
            element={<VendorDeckSelectionPage />}
          />

          {/* Vendor seat layout */}
          <Route
            path="/vendor/seat-layout/rows/:deckType"
            element={<VendorDeckRowsPage />}
          />

          <Route
            path="/vendor/seat-layout/arrangements/:deckType"
            element={<VendorDeckArrangementPage />}
          />

          {/* Vendor driver management */}
          <Route
            path="/vendor/driver-management"
            element={<DriverManagementDashboard />}
          />

          {/* Vendor bus management */}
          <Route
            path="/vendor/bus-management"
            element={<BusManagementDashboard />}
          />

          <Route
            path="/vendor/bus-management/buses/busDetailView/:busId"
            element={<BusDetailView />}
          />
          <Route
            path="/vendor/buses/new"
            element={<BusDetailsPage />}
          />

          <Route
            path="/vendor/buses/:busId/review"
            element={<BusReviewPage />}
          />


          {/* Vendor route management */}
          <Route
            path="/vendor/root-management"
            element={<RoomManagementDashboard />}
          />

          <Route
            path="/vendor/root-management/add-route"
            element={<AddRoutepage />}
          />

          <Route path="/vendor/trip-management" element={<TripsManagmentDashboard />} />
          <Route path="/vendor/crew-management" element={<DriverManagementDashboard />} />
          <Route path="/vendor/-staff-management" element={<StaffManagementDashboard />} />
          <Route path="/vendor/finance" element={<FinanceDashboard />} />
          <Route path="/vendor/calendar" element={<CalendarDashboard />} />
          <Route path="/vendor/bookings" element={<BookingsDashboard />} />

          <Route path="/" element={<BusListing />} />
      <Route path="/buses" element={<BusListing />} />
      <Route path="/ticket-booking" element={<TicketBooking />} />
      <Route path="/booking" element={<TicketBooking />} />
      <Route path="/checkout/payu" element={<PayUCheckout />} />
      <Route path="/payu-checkout" element={<PayUCheckout />} />
      <Route path="/booking/payment-result" element={<PaymentResult />} />
      <Route path="/payment-result" element={<PaymentResult />} />
      <Route path="/my-bookings" element={<MyBookings />} />

          {/* Standalone agent signup route */}
          <Route
            path="/agent-signup"
            element={<AgentSignup />}
          />

          {/* Fallback */}
          <Route
            path="*"
            element={<Home />}
          />
        </Routes>
      )}
    </AuthProvider>
  );
}

export default App;
