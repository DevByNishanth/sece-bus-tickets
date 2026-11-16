
import React from "react";
import VendorNavbar from "../VendorNavbar";

import {
    BusFront,
    Plus,
    Search,
    SlidersHorizontal,
    Download,
    Eye,
    ChevronRight,
    ChevronLeft,
    CalendarDays,
    Clock,
    CircleCheck,
    CircleX,
    Archive,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function BusDetail() {

    // Trip Statistics
    const stats = [
        { title: "Total trips", value: 138, icon: BusFront },
        { title: "Upcoming", value: 4, icon: CalendarDays },
        { title: "In progress", value: 1, icon: Clock },
        { title: "Completed", value: 128, icon: CircleCheck },
        { title: "Cancelled", value: 3, icon: CircleX },
        { title: "Drafts", value: 1, icon: Archive },
    ];

    // Trip Table Data
    const trips = [
        {
            ticket: "TRP-24103",
            passenger: "Coimbatore → Madurai",
            route: "Highway Express",
            date: "13 Jun 2025",
            time: "22:00 – 05:45 +1",
            seat: "36 / 36",
            status: "Scheduled",
        },
        {
            ticket: "TRP-24104",
            passenger: "Coimbatore → Madurai",
            route: "Highway Express",
            date: "14 Jun 2025",
            time: "22:00 – 05:45 +1",
            seat: "28 / 36",
            status: "In Progress",
        },
        {
            ticket: "TRP-24105",
            passenger: "Coimbatore → Madurai",
            route: "Highway Express",
            date: "15 Jun 2025",
            time: "22:00 – 05:45 +1",
            seat: "0 / 36",
            status: "Draft",
        },
        {
            ticket: "TRP-24106",
            passenger: "Coimbatore → Madurai",
            route: "Highway Express",
            date: "16 Jun 2025",
            time: "22:00 – 05:45 +1",
            seat: "12 / 36",
            status: "Rejected",
        },
    ];

    return (
        <>
            {/* Navbar */}
            <VendorNavbar />

            <main className="min-h-screen bg-[#F7F9FA] py-3">

                <div className="mx-auto w-[94%] min-h-screen p-4 space-y-4">

                    {/* Breadcrumb */}
                    <div className="flex items-center -mt-4 gap-2 text-[12px] text-slate-400">
                        <Link to="/vendor/trip-management">My Buses</Link>
                        <ChevronRight size={12} />
                        <span className="text-teal-700 font-medium">
                            TN 38 AB 4521
                        </span>
                    </div>

                    {/* Bus Header */}
                    <div className="bg-white border border-slate-100 rounded-xl p-3 flex items-center justify-between">

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                                <BusFront size={18} className="text-teal-700" />
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-sm font-semibold text-slate-800">
                                        TN 38 AB 4521
                                    </h2>

                                    <span className="bg-green-50 text-green-600 text-[9px] px-2 py-0.5 rounded-full">
                                        ● Active
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                                    <span>Emerald Express</span>
                                    <span>AC Sleeper</span>
                                    <span>Double deck</span>
                                    <span>36 seats</span>
                                </div>
                            </div>
                        </div>

                        <Link to="/vendor/trip-management/:busId/createNewTrip" className="flex items-center gap-1 bg-[#0e7a88] hover:bg-[#024a53] text-white text-[12px] px-3 py-1.5 rounded-md transition-colors">
                            <Plus size={16} />
                            Add Trip
                        </Link>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">

                        {stats.map((stat) => {
                            const Icon = stat.icon;

                            return (
                                <div
                                    key={stat.title}
                                    className="bg-white border border-slate-100 rounded-lg p-3"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-10 h-10 rounded-md bg-teal-50 flex items-center justify-center">
                                            <Icon size={14} className="text-teal-700" />
                                        </div>

                                        <span className="text-[12px] text-slate-500">
                                            {stat.title}
                                        </span>
                                    </div>

                                    <p className="text-lg font-semibold text-slate-800 text-center">
                                        {stat.value}
                                    </p>
                                </div>
                            );
                        })}

                    </div>

                    {/* Trip Details Table */}
                    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">

                        {/* Table Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">

                            <div>
                                <h2 className="text- font-semibold text-slate-800">
                                    Trip Details
                                </h2>

                                <p className="text-[12px] text-slate-400 mt-1">
                                    Live passenger ticket reservations & payment receipts across all routes
                                </p>
                            </div>

                            {/* Search / Filter / Export */}
                            <div className="flex items-center gap-2">

                                <div className="flex w-[340px] items-center gap-1.5 border border-slate-200 rounded-md px-2 py-1.5">
                                    <Search size={14} className="text-slate-400" />

                                    <input
                                        type="text"
                                        placeholder="Search PNR, passenger..."
                                        className="text-[12px] outline-none w-full"
                                    />
                                </div>

                                <button className="flex items-center gap-1 border border-slate-200 rounded-md px-2 py-1.5 text-[12px] text-slate-600">
                                    <SlidersHorizontal size={12} />
                                    Filter
                                </button>

                                <button className="flex items-center gap-1 bg-[#0e7a88] hover:bg-[#024a53] text-white rounded-md px-2 py-1.5 text-[12px] transition-colors">
                                    <Download size={14} />
                                    Export CSV
                                </button>

                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto border border-slate-100 rounded-lg">

                            <table className="w-full text-left whitespace-nowrap">

                                <thead className="bg-slate-50 text-[12px] text-slate-500 uppercase">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">PNR / Ticket</th>
                                        <th className="px-4 py-3 font-medium">Passenger</th>
                                        <th className="px-4 py-3 font-medium">Travel Date</th>
                                        <th className="px-4 py-3 font-medium">Travel Time</th>
                                        <th className="px-4 py-3 font-medium">Seat / Bth</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">

                                    {trips.map((trip, index) => (

                                        <tr
                                            key={trip.ticket}
                                            className="hover:bg-slate-50 transition-colors"
                                        >

                                            <td className="px-4 py-4 text-[11px] font-medium text-teal-700">
                                                {trip.ticket}
                                            </td>

                                            <td className="px-4 py-4">
                                                <p className="text-[11px] font-medium text-slate-700">
                                                    {trip.passenger}
                                                </p>

                                                <p className="text-[9px] text-slate-400 mt-1">
                                                    {trip.route}
                                                </p>
                                            </td>

                                            <td className="px-4 py-4 text-[11px] text-slate-600">
                                                {trip.date}
                                            </td>

                                            <td className="px-4 py-4 text-[11px] text-slate-600">
                                                {trip.time}
                                            </td>

                                            <td className="px-4 py-4 text-[11px] font-medium text-slate-700">
                                                {trip.seat}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-[11px] font-medium
                                             ${trip.status === "Scheduled"
                                                            ? "bg-teal-50 text-teal-600"
                                                            : trip.status === "In Progress"
                                                                ? "bg-indigo-50 text-indigo-600"
                                                                : trip.status === "Draft"
                                                                    ? "bg-slate-100 text-slate-600"
                                                                    : "bg-red-50 text-red-500"
                                                        }`}
                                                >
                                                    ● {trip.status}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <button className="bg-slate-100 p-1.5 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
                                                    <Eye size={14} />
                                                </button>
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>
                            </table>

                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 text-[12px] text-slate-500">

                            <p>Showing 1–4 of 120 bookings</p>

                            <div className="flex items-center gap-1">

                                <button className="px-2 py-1 border rounded-md border-slate-200 flex items-center">
                                    <ChevronLeft size={12} />
                                    Previous
                                </button>

                                <button className="px-2.5 py-1 rounded-md bg-teal-700 text-white">
                                    1
                                </button>

                                <button className="px-2 py-1 border rounded-md border-slate-200">
                                    2
                                </button>

                                <button className="px-2 py-1 border rounded-md border-slate-200">
                                    3
                                </button>

                                <span className="px-1">...</span>

                                <button className="px-2 py-1 border rounded-md border-slate-200">
                                    24
                                </button>

                                <button className="px-2 py-1 border rounded-md border-slate-200 flex items-center">
                                    Next
                                    <ChevronRight size={12} />
                                </button>

                            </div>
                        </div>

                    </div>

                </div>
            </main>
        </>
    );
}
