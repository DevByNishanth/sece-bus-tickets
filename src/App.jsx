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

function App() {
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
}

export default App;
