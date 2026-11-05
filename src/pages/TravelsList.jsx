import AdminBookingOverview from "./AdminBookingOverview.jsx";
import TravelProfileDetailView from "./TravelProfileDetailView.jsx";
import AdminNavbar from "../components/AdminNavbar.jsx";

function AdminTravelProfileDetailView(props) {
  return <TravelProfileDetailView {...props} Navbar={AdminNavbar} />;
}

export default function TravelsList() {
  return <AdminBookingOverview listType="travels" detailView={AdminTravelProfileDetailView} />;
}
