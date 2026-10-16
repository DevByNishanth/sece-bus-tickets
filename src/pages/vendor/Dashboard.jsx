import Navbar from "../../components/Navbar"
import VendorBookingPiechart from "./VendorBookingPiechart"
import VendorFleetAvailability from "./VendorFleetAvailability"
import VendorNavbar from "./VendorNavbar"
import VendorRecentBookingsTable from "./VendorRecentBookingsTable"
import VendorRevenueChart from "./VendorRevenueChart"
import VendorStatcard from "./VendorStatcard"
import VendorTripOperation from "./VendorTripOperation"

const Dashboard = () => {
    return (
        <>
        {console.log("working on vendor dashboard")}
            <div className="main-container py-3 bg-[#F7F9FA] min-h-screen ">
                <VendorNavbar />
                <div className="content-container w-[94%] mt-3 m-auto">
                    <header className="">
                        <h1 className="font-medium text-xl">Dashboard Overview</h1>
                        <h1 className="text-[#627B77] mt-1 text-sm">Live bus tracking, intercity routes, and passenger booking engine</h1>
                    </header>

                    <VendorStatcard />
                </div>

                <div className="chart-container w-[94%] m-auto mt-4 grid grid-cols-12 gap-4">
                    <VendorRevenueChart />
                    <VendorBookingPiechart />
                </div>

                <div className="trip-operation-and-fleet-availability-container w-[94%] m-auto mt-4 grid grid-cols-12 gap-4">
                    <VendorTripOperation />
                    <VendorFleetAvailability />
                </div>

                <div className="recent-bookings-table-container">
                    <VendorRecentBookingsTable />
                </div>


            </div>
        </>
    )
}

export default Dashboard