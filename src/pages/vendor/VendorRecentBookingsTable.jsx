import { useState } from "react";
import { Link } from "react-router-dom";

import {
    Search,
    SlidersHorizontal,
    Download,
    ArrowRight,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const VendorRecentBookingsTable = () => {

    // Booking data
    const bookings = [
        {
            id: 1,
            pnr: "BG240891",
            passenger: "Arun Kumar",
            initials: "AK",
            avatarColor: "bg-[#E0F5F5] text-[#087F8C]",
            route: "Coimbatore → Chennai",
            travelDate: "16 Oct 2026",
            seat: "U2",
            fare: 1250,
            payment: "Paid (UPI)",
            status: "Confirmed",
        },
        {
            id: 2,
            pnr: "BG240892",
            passenger: "Priya S",
            initials: "PS",
            avatarColor: "bg-[#FCE7F3] text-[#DB2777]",
            route: "Chennai → Coimbatore",
            travelDate: "16 Oct 2026",
            seat: "L4",
            fare: 1100,
            payment: "Paid (Card)",
            status: "Confirmed",
        },
        {
            id: 3,
            pnr: "BG240893",
            passenger: "Karthik R",
            initials: "KR",
            avatarColor: "bg-[#FFF4E5] text-[#B45309]",
            route: "Coimbatore → Bengaluru",
            travelDate: "17 Oct 2026",
            seat: "U6",
            fare: 1450,
            payment: "Pending",
            status: "Pending",
        },
        {
            id: 4,
            pnr: "BG240894",
            passenger: "Divya M",
            initials: "DM",
            avatarColor: "bg-[#E8EDFF] text-[#4338CA]",
            route: "Madurai → Chennai",
            travelDate: "17 Oct 2026",
            seat: "L2",
            fare: 1300,
            payment: "Paid (UPI)",
            status: "Confirmed",
        },
        {
            id: 5,
            pnr: "BG240895",
            passenger: "Suresh N",
            initials: "SN",
            avatarColor: "bg-[#EEF2F7] text-[#334155]",
            route: "Coimbatore → Chennai",
            travelDate: "18 Oct 2026",
            seat: "U8",
            fare: 1250,
            payment: "Refunded",
            status: "Cancelled",
        },
        {
            id: 6,
            pnr: "BG240896",
            passenger: "Meena R",
            initials: "MR",
            avatarColor: "bg-[#F3E8FF] text-[#7E22CE]",
            route: "Salem → Chennai",
            travelDate: "18 Oct 2026",
            seat: "L6",
            fare: 950,
            payment: "Paid (UPI)",
            status: "Confirmed",
        },
        {
            id: 7,
            pnr: "BG240897",
            passenger: "Ravi K",
            initials: "RK",
            avatarColor: "bg-[#DCFCE7] text-[#15803D]",
            route: "Chennai → Bengaluru",
            travelDate: "19 Oct 2026",
            seat: "U4",
            fare: 1600,
            payment: "Pending",
            status: "Pending",
        },
        {
            id: 8,
            pnr: "BG240898",
            passenger: "Anitha S",
            initials: "AS",
            avatarColor: "bg-[#FEE2E2] text-[#B91C1C]",
            route: "Coimbatore → Madurai",
            travelDate: "19 Oct 2026",
            seat: "L8",
            fare: 850,
            payment: "Paid (Card)",
            status: "Confirmed",
        },
        {
            id: 9,
            pnr: "BG240899",
            passenger: "Vijay M",
            initials: "VM",
            avatarColor: "bg-[#DBEAFE] text-[#1D4ED8]",
            route: "Tiruppur → Chennai",
            travelDate: "20 Oct 2026",
            seat: "U10",
            fare: 1200,
            payment: "Refunded",
            status: "Cancelled",
        },
        {
            id: 10,
            pnr: "BG240900",
            passenger: "Lakshmi P",
            initials: "LP",
            avatarColor: "bg-[#FCE7F3] text-[#9D174D]",
            route: "Chennai → Madurai",
            travelDate: "20 Oct 2026",
            seat: "L10",
            fare: 1400,
            payment: "Paid (UPI)",
            status: "Confirmed",
        },
        {
            id: 11,
            pnr: "BG240901",
            passenger: "Sathish B",
            initials: "SB",
            avatarColor: "bg-[#E0E7FF] text-[#3730A3]",
            route: "Bengaluru → Coimbatore",
            travelDate: "21 Oct 2026",
            seat: "U12",
            fare: 1550,
            payment: "Paid (Card)",
            status: "Confirmed",
        },
        {
            id: 12,
            pnr: "BG240902",
            passenger: "Deepa K",
            initials: "DK",
            avatarColor: "bg-[#D1FAE5] text-[#065F46]",
            route: "Madurai → Coimbatore",
            travelDate: "21 Oct 2026",
            seat: "L12",
            fare: 1050,
            payment: "Pending",
            status: "Pending",
        },
    ];


    // Search input
    const [searchText, setSearchText] = useState("");


    // Current page
    const [currentPage, setCurrentPage] = useState(1);


    // Number of rows to show on each page
    const rowsPerPage = 5;


    // Search bookings
    const filteredBookings = bookings.filter((booking) => {

        const searchValue = searchText.toLowerCase().trim();

        return (
            booking.pnr.toLowerCase().includes(searchValue) ||
            booking.passenger.toLowerCase().includes(searchValue) ||
            booking.route.toLowerCase().includes(searchValue) ||
            booking.payment.toLowerCase().includes(searchValue) ||
            booking.status.toLowerCase().includes(searchValue) ||
            booking.seat.toLowerCase().includes(searchValue)
        );

    });


    // Calculate total pages
    const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);


    // Get bookings for the current page
    const startIndex = (currentPage - 1) * rowsPerPage;

    const currentBookings = filteredBookings.slice(
        startIndex,
        startIndex + rowsPerPage
    );


    // Update search and go back to page 1
    const handleSearch = (event) => {
        setSearchText(event.target.value);
        setCurrentPage(1);
    };


    // Export bookings to CSV
    const handleExportCSV = () => {

        const csvHeader = [
            "PNR",
            "Passenger",
            "Route",
            "Travel Date",
            "Seat",
            "Fare",
            "Payment",
            "Status",
        ];

        const csvRows = filteredBookings.map((booking) => [
            booking.pnr,
            booking.passenger,
            booking.route,
            booking.travelDate,
            booking.seat,
            booking.fare,
            booking.payment,
            booking.status,
        ]);

        // Convert the data into CSV format
        const csvContent = [
            csvHeader,
            ...csvRows,
        ]
            .map((row) =>
                row
                    .map((value) => `"${String(value).replace(/"/g, '""')}"`)
                    .join(",")
            )
            .join("\n");

        // Create a downloadable CSV file
        const csvFile = new Blob(
            ["\uFEFF" + csvContent],
            { type: "text/csv;charset=utf-8;" }
        );

        const downloadLink = document.createElement("a");

        const fileURL = URL.createObjectURL(csvFile);

        downloadLink.href = fileURL;
        downloadLink.download = "vendor-bookings.csv";

        document.body.appendChild(downloadLink);

        downloadLink.click();

        document.body.removeChild(downloadLink);

        URL.revokeObjectURL(fileURL);
    };


    // Go to previous page
    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };


    // Go to next page
    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };


    // Format fare as Indian Rupees
    const formatFare = (fare) => {
        return `₹${fare.toLocaleString("en-IN")}`;
    };


    // Get badge colors for each booking status
    const getStatusStyle = (status) => {

        if (status === "Confirmed") {
            return "bg-[#E4F7F5] text-[#07818A] border-[#C5EBE7]";
        }

        if (status === "Pending") {
            return "bg-[#FFF3E0] text-[#A65B00] border-[#FFE0B2]";
        }

        if (status === "Cancelled") {
            return "bg-[#FEECE9] text-[#D92D20] border-[#FDD4CD]";
        }

        return "bg-gray-100 text-gray-600 border-gray-200";
    };


    // Get badge colors for payment status
    const getPaymentStyle = (payment) => {

        if (payment === "Pending") {
            return "bg-[#FFF3E0] text-[#A65B00]";
        }

        if (payment === "Refunded") {
            return "bg-[#FFF0F2] text-[#D92D45]";
        }

        return "bg-[#F1F5F9] text-gray-700";
    };


    return (
        <div className="w-[94%] m-auto mt-4 rounded-2xl border border-[#E5ECEF] bg-white p-5 shadow-sm">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

                {/* Title */}
                <div>
                    <h2 className="text-sm font-semibold text-black">
                        Recent Bookings
                    </h2>

                    <p className="mt-0.5 text-[10px] text-gray-500">
                        Live passenger ticket reservations & payment receipts across all routes
                    </p>
                </div>


                {/* Search, Filter, Export and View All */}
                <div className="flex flex-wrap items-center gap-2">

                    {/* Search */}
                    <div className="flex h-9 w-full items-center gap-2 rounded-xl border border-[#E5ECEF] bg-[#F7F9FB] px-3 sm:w-44">

                        <Search
                            size={15}
                            className="shrink-0 text-[#627780]"
                        />

                        <input
                            type="text"
                            placeholder="Search PNR, passenger..."
                            value={searchText}
                            onChange={handleSearch}
                            className="w-full min-w-0 bg-transparent text-[10px] text-gray-700 outline-none placeholder:text-[#89979F]"
                        />

                    </div>


                    {/* Filter Button */}
                    <button
                        type="button"
                        className="flex h-9 items-center gap-1.5 rounded-xl border border-[#E5ECEF] bg-white px-3 text-[11px] font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        <SlidersHorizontal size={14} />
                        Filter
                    </button>


                    {/* Export CSV Button */}
                    <button
                        type="button"
                        onClick={handleExportCSV}
                        className="flex h-9 items-center gap-1.5 rounded-xl bg-[#087F8C] px-3 text-[11px] font-semibold text-white transition-colors hover:bg-[#066874]"
                    >
                        <Download size={14} />
                        Export CSV
                    </button>


                    {/* View All */}
                    <Link
                        to="/vendor/bookings"
                        className="flex items-center gap-1 px-1 text-[11px] font-semibold text-[#087F8C] hover:text-[#066874]"
                    >
                        View All
                        <ArrowRight size={14} />
                    </Link>

                </div>

            </div>


            {/* Table */}
            <div className="mt-4 overflow-x-auto rounded-xl border border-[#E5ECEF]">

                <table className="w-full min-w-[950px] border-collapse text-left">

                    {/* Table Header */}
                    <thead className="bg-[#F5F8FA]">

                        <tr className="text-[10px]  uppercase tracking-wide text-[#5E717D]">

                            <th className="px-4 py-3">PNR / Ticket</th>

                            <th className="px-4 py-3">Passenger</th>

                            <th className="px-4 py-3">Route</th>

                            <th className="px-4 py-3">Travel Date</th>

                            <th className="px-4 py-3">Seat Berth</th>

                            <th className="px-4 py-3">Fare</th>

                            <th className="px-4 py-3">Payment</th>

                            <th className="px-4 py-3">Status</th>

                            <th className="px-4 py-3 text-center">Actions</th>

                        </tr>

                    </thead>


                    {/* Table Body */}
                    <tbody>

                        {currentBookings.length > 0 ? (

                            currentBookings.map((booking) => (

                                <tr
                                    key={booking.id}
                                    className="border-t border-[#E9EFF2] transition-colors hover:bg-[#FAFCFD]"
                                >

                                    {/* PNR */}
                                    <td className="whitespace-nowrap px-4 py-3">

                                        <span className="text-[11px] font-semibold text-[#087F8C]">
                                            {booking.pnr}
                                        </span>

                                    </td>


                                    {/* Passenger */}
                                    <td className="whitespace-nowrap px-4 py-3">

                                        <div className="flex items-center gap-2">

                                            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold ${booking.avatarColor}`}>
                                                {booking.initials}
                                            </div>

                                            <span className="text-[10px] font-semibold text-[#172426]">
                                                {booking.passenger}
                                            </span>

                                        </div>

                                    </td>


                                    {/* Route */}
                                    <td className="whitespace-nowrap px-4 py-3">

                                        <span className="text-[11px] text-[#172426]">
                                            {booking.route}
                                        </span>

                                    </td>


                                    {/* Travel Date */}
                                    <td className="whitespace-nowrap px-4 py-3">

                                        <span className="text-[11px] text-[#627780]">
                                            {booking.travelDate}
                                        </span>

                                    </td>


                                    {/* Seat */}
                                    <td className="whitespace-nowrap px-4 py-3">

                                        <span className="text-[11px] font-semibold text-[#172426]">
                                            {booking.seat}
                                        </span>

                                    </td>


                                    {/* Fare */}
                                    <td className="whitespace-nowrap px-4 py-3">

                                        <span className="text-[11px] font-semibold text-[#172426]">
                                            {formatFare(booking.fare)}
                                        </span>

                                    </td>


                                    {/* Payment */}
                                    <td className="whitespace-nowrap px-4 py-3">

                                        <span className={`rounded-md px-2 py-1 text-[10px] font-medium ${getPaymentStyle(booking.payment)}`}>
                                            {booking.payment}
                                        </span>

                                    </td>


                                    {/* Status */}
                                    <td className="whitespace-nowrap px-4 py-3">

                                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${getStatusStyle(booking.status)}`}>
                                            {booking.status}
                                        </span>

                                    </td>


                                    {/* Actions */}
                                    <td className="px-4 py-3 text-center">

                                        <button
                                            type="button"
                                            aria-label={`Actions for booking ${booking.pnr}`}
                                            className="rounded-md p-1 text-[#627780] transition-colors hover:bg-gray-100 hover:text-gray-900"
                                        >
                                            <MoreVertical size={16} />
                                        </button>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>
                                <td
                                    colSpan="9"
                                    className="px-4 py-10 text-center text-xs text-gray-500"
                                >
                                    No bookings found.
                                </td>
                            </tr>

                        )}

                    </tbody>

                </table>

            </div>


            {/* Footer and Pagination */}
            <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                {/* Showing Count */}
                <p className="text-[11px] text-[#627780]">

                    Showing{" "}

                    <span className="font-semibold text-[#172426]">
                        {filteredBookings.length === 0 ? 0 : startIndex + 1}
                        {" - "}
                        {Math.min(startIndex + rowsPerPage, filteredBookings.length)}
                    </span>

                    {" "}of{" "}

                    <span className="font-medium text-[#172426]">
                        {filteredBookings.length}
                    </span>

                    {" "}bookings

                </p>


                {/* Pagination Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">

                    {/* Previous */}
                    <button
                        type="button"
                        onClick={handlePrevious}
                        disabled={currentPage === 1 || totalPages === 0}
                        className="flex h-8 items-center gap-1 rounded-lg border border-[#E5ECEF] px-3 text-[10px] font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronLeft size={13} />
                        Previous
                    </button>


                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                        .filter((page) => {

                            return (
                                page === 1 ||
                                page === totalPages ||
                                Math.abs(page - currentPage) <= 1
                            );

                        })
                        .map((page, index, pages) => (

                            <>

                                {/* Show dots between page groups */}
                                {index > 0 && page - pages[index - 1] > 1 && (

                                    <span className="px-1 text-[11px] text-gray-500">
                                        ...
                                    </span>

                                )}

                                <button
                                    type="button"
                                    onClick={() => setCurrentPage(page)}
                                    className={`flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-[10px] font-medium transition-colors ${currentPage === page
                                        ? "border-[#087F8C] bg-[#087F8C] text-white"
                                        : "border-[#E5ECEF] bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {page}
                                </button>

                            </>

                        ))}


                    {/* Next */}
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="flex h-8 items-center gap-1 rounded-lg border border-[#E5ECEF] px-3 text-[10px] font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next
                        <ChevronRight size={13} />
                    </button>

                </div>

            </div>

        </div>
    );
};

export default VendorRecentBookingsTable;