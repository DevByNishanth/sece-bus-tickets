import AdminBookingOverview from "./AdminBookingOverview.jsx";
import TravelProfileDetailView from "./TravelProfileDetailView.jsx";

export default function TravelsList() {
  return <AdminBookingOverview listType="travels" detailView={TravelProfileDetailView} />;
}
