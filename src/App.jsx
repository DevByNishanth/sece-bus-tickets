<<<<<<< HEAD
import { Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/landing/Home.jsx'
import LoginPage from './pages/LoginPage.jsx'
import Signup from './pages/Signup.jsx'
import AgentSignup from './pages/AgentSignup.jsx'
import TravelAgentDashboard from './pages/TravelAgentDashboard.jsx'
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'
=======
import { Route, Routes } from "react-router-dom";
import Home from "./pages/landing/Home.jsx";
import Dashboard from "./pages/vendor/Dashboard.jsx";
import SeatGenerationPage from "./pages/vendor/SeatGenerationPage.jsx";
import { VendorDeckSelectionPage } from "./pages/vendor/VendorDeckSelectionPage.jsx";
import VendorDeckRowsPage from "./pages/vendor/VendorDeckRowsPage.jsx";
import VendorDeckArrangementPage from "./pages/vendor/VendorDeckArrangementPage.jsx";
import DriverManagementDashboard from "./pages/vendor/DriverManagement/DriverManagementDashboard.jsx";
import BusManagementDashboard from "./pages/vendor/BusManagement/BusManagementDashboard.jsx";
import RoomManagementDashboard from "./pages/vendor/RootManagement.jsx/RoomManagementDashboard.jsx";
import BusDetailsPage from "./pages/vendor/BusManagement/BusDetailsPage.jsx";
import BusReviewPage from "./pages/vendor/BusManagement/BusReviewPage.jsx";
import AddRoutepage from "./pages/vendor/RootManagement.jsx/AddRoutepage.jsx";
>>>>>>> fe2d383d392fec00a492e17396f7d767da092260

/**
 * The landing page always renders as the "background" at /, /login and /signup
 * so the modal overlays appear on top of it — no nested <Routes> needed.
 */
function App() {
<<<<<<< HEAD
  const location = useLocation()

  // Routes that show an auth modal on top of the landing page
  const isAuthOverlay = ['/', '/login', '/signup', '/agent-signup'].includes(location.pathname)

  if (!isAuthOverlay) {
    // Other standalone routes (e.g. admin, travelagent, crew)
    return (
      <AuthProvider>
        <Routes>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/travelagent" element={<TravelAgentDashboard />} />
          <Route path="/agent-signup" element={<AgentSignup />} />
        </Routes>
      </AuthProvider>
    )
  }

  return (
    <AuthProvider>
      {/* Landing always visible as background */}
      <Home />

      {/* Auth modals rendered conditionally on top */}
      {location.pathname === '/login' && <LoginPage />}
      {location.pathname === '/signup' && <Signup />}
      {location.pathname === '/agent-signup' && <AgentSignup />}
    </AuthProvider>
  )
=======
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* --------------------------------------- vendor routes ------------------------ */}
        <Route path="/vendor" element={<Dashboard />} />
        <Route
          path="/vendor/seatGeneration/:busId"
          element={<SeatGenerationPage />}
        />
        <Route
          path="/vendor/seatGeneration/:busId/deckSelection/:deckType"
          element={<VendorDeckSelectionPage />}
        />
        <Route
          path="/vendor/seat-layout/rows/:deckType"
          element={<VendorDeckRowsPage />}
        />
        <Route
          path="/vendor/seat-layout/arrangements/:deckType"
          element={<VendorDeckArrangementPage />}
        />

        {/*  vendor driver management routes  */}
        <Route
          path="/vendor/driver-management"
          element={<DriverManagementDashboard />}
        />

        {/*  vendor bus management routes  */}
        <Route
          path="/vendor/bus-management"
          element={<BusManagementDashboard />}
        />
        <Route path="/vendor/buses/new" element={<BusDetailsPage />} />
        <Route path="/vendor/buses/:busId/review" element={<BusReviewPage />} />
        {/*  vendor route management routes  */}
        <Route
          path="/vendor/root-management"
          element={<RoomManagementDashboard />}
        />
        <Route
          path="/vendor/root-management/add-route"
          element={<AddRoutepage />}
        />

      </Routes>
    </>
  );
>>>>>>> fe2d383d392fec00a492e17396f7d767da092260
}

export default App;
