
import React, { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    CalendarDays,
    Clock,
    MapPin,
    Bus,
    Users,
    Plus,
    MoreHorizontal,
    CheckCircle2,
    CircleDot,
    X,
    Search,
    Filter,
    ArrowRight,
    UserRound,
    CalendarCheck,
} from "lucide-react";

const VendorCalendar = () => {
    const [selectedView, setSelectedView] = useState("Week");
    const [selectedDate, setSelectedDate] = useState(17);
    const [showTripDetails, setShowTripDetails] = useState(true);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All Trips");

    const weekDays = [
        { day: "Sunday", date: 16 },
        { day: "Monday", date: 17 },
        { day: "Tuesday", date: 18 },
        { day: "Wednesday", date: 19 },
        { day: "Thursday", date: 20 },
        { day: "Friday", date: 21 },
        { day: "Saturday", date: 22 },
    ];

    const hours = [
        "6am", "7am", "8am", "9am",
        "10am", "11am", "12pm", "1pm",
    ];

    const trips = [
        {
            id: 1,
            day: 1,
            start: 0,
            duration: 1,
            title: "Coimbatore → Chennai",
            bus: "TN 38 AB 1234",
            driver: "Raj Kumar",
            time: "06:00 - 07:00",
            seats: "32 / 40",
            status: "Scheduled",
            color: "teal",
        },
        {
            id: 2,
            day: 1,
            start: 3,
            duration: 1,
            title: "Erode → Bangalore",
            bus: "TN 33 CD 5678",
            driver: "Arun Kumar",
            time: "09:00 - 10:00",
            seats: "24 / 40",
            status: "Boarding",
            color: "blue",
        },
        {
            id: 3,
            day: 2,
            start: 1,
            duration: 2,
            title: "Salem → Chennai",
            bus: "TN 54 EF 9012",
            driver: "Karthik",
            time: "07:00 - 09:00",
            seats: "35 / 45",
            status: "Scheduled",
            color: "green",
        },
        {
            id: 4,
            day: 2,
            start: 4,
            duration: 2,
            title: "Madurai → Coimbatore",
            bus: "TN 58 GH 3456",
            driver: "Suresh",
            time: "10:00 - 12:00",
            seats: "18 / 40",
            status: "Scheduled",
            color: "amber",
        },
        {
            id: 5,
            day: 3,
            start: 0,
            duration: 2,
            title: "Chennai → Erode",
            bus: "TN 01 JK 7890",
            driver: "Vijay",
            time: "06:00 - 08:00",
            seats: "28 / 40",
            status: "Departed",
            color: "purple",
        },
        {
            id: 6,
            day: 3,
            start: 4,
            duration: 1,
            title: "Bangalore → Salem",
            bus: "KA 05 LM 1234",
            driver: "Manoj",
            time: "10:00 - 11:00",
            seats: "30 / 40",
            status: "Scheduled",
            color: "pink",
        },
        {
            id: 7,
            day: 4,
            start: 2,
            duration: 2,
            title: "Coimbatore → Bangalore",
            bus: "TN 38 NP 4567",
            driver: "Ramesh",
            time: "08:00 - 10:00",
            seats: "36 / 40",
            status: "Boarding",
            color: "orange",
        },
        {
            id: 8,
            day: 5,
            start: 1,
            duration: 2,
            title: "Chennai → Madurai",
            bus: "TN 09 QR 8901",
            driver: "Prakash",
            time: "07:00 - 09:00",
            seats: "20 / 40",
            status: "Scheduled",
            color: "blue",
        },
        {
            id: 9,
            day: 5,
            start: 4,
            duration: 2,
            title: "Erode → Chennai",
            bus: "TN 33 ST 2345",
            driver: "Dinesh",
            time: "10:00 - 12:00",
            seats: "15 / 40",
            status: "Scheduled",
            color: "amber",
        },
    ];

    const colorStyles = {
        teal: "bg-teal-100 border-teal-200 text-teal-900",
        blue: "bg-blue-100 border-blue-200 text-blue-900",
        green: "bg-emerald-100 border-emerald-200 text-emerald-900",
        amber: "bg-amber-100 border-amber-200 text-amber-900",
        purple: "bg-violet-100 border-violet-200 text-violet-900",
        pink: "bg-pink-100 border-pink-200 text-pink-900",
        orange: "bg-orange-100 border-orange-200 text-orange-900",
    };

    const statusStyles = {
        Scheduled: "bg-teal-50 text-teal-700",
        Boarding: "bg-blue-50 text-blue-700",
        Departed: "bg-violet-50 text-violet-700",
        Completed: "bg-gray-100 text-gray-600",
        Cancelled: "bg-red-50 text-red-700",
    };

    const filteredTrips =
        activeFilter === "All Trips"
            ? trips
            : trips.filter((trip) => trip.status === activeFilter);

    const handlePrevious = () => {
        setSelectedDate((prev) => Math.max(1, prev - 1));
    };

    const handleNext = () => {
        setSelectedDate((prev) => Math.min(31, prev + 1));
    };

    const handleToday = () => {
        setSelectedDate(17);
    };

    const handleTripClick = (trip) => {
        setSelectedTrip(trip);
        setShowTripDetails(true);
    };

    return (
        <div className="flex h-[calc(100vh-80px)] min-h-[680px] w-full overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-800 shadow-sm">

            {/* ================= LEFT SIDEBAR ================= */}
            <aside className="hidden w-[245px] shrink-0 flex-col border-r border-gray-200 bg-white p-4 lg:flex">

                {/* Vendor Profile */}
                <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                            <Bus size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                Travel Operator
                            </p>
                            <p className="text-xs text-gray-500">Vendor Dashboard</p>
                        </div>
                    </div>
                    <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                        <MoreHorizontal size={18} />
                    </button>
                </div>

                {/* Mini Calendar */}
                <div className="rounded-xl border border-gray-200 p-3">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold">December 2023</p>
                        <div className="flex gap-1">
                            <button className="rounded-md p-1 hover:bg-gray-100">
                                <ChevronLeft size={14} />
                            </button>
                            <button className="rounded-md p-1 hover:bg-gray-100">
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-y-2 text-center">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                            <span key={i} className="text-[10px] font-medium text-gray-400">
                                {day}
                            </span>
                        ))}

                        {Array.from({ length: 35 }, (_, i) => {
                            const date = i - 4;
                            const isCurrentMonth = date >= 1 && date <= 31;
                            const isSelected = date === selectedDate;

                            return (
                                <button
                                    key={i}
                                    onClick={() => isCurrentMonth && setSelectedDate(date)}
                                    className={`flex h-6 items-center justify-center rounded-md text-[10px]
                    ${isSelected
                                            ? "bg-teal-600 font-semibold text-white"
                                            : isCurrentMonth
                                                ? "text-gray-600 hover:bg-teal-50 hover:text-teal-700"
                                                : "text-gray-300"
                                        }`}
                                >
                                    {isCurrentMonth ? date : ""}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Upcoming Trips */}
                <div className="mt-4 rounded-xl bg-teal-50 p-3">
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-semibold text-teal-900">
                            Upcoming Departure
                        </p>
                        <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] text-teal-700">
                            Today
                        </span>
                    </div>

                    <p className="text-sm font-semibold text-gray-900">
                        Coimbatore → Chennai
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <Clock size={12} />
                        09:00 PM
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] text-gray-500">TN 38 AB 1234</span>
                        <span className="rounded-md bg-white px-2 py-1 text-[10px] font-medium text-teal-700">
                            32 / 40 seats
                        </span>
                    </div>
                </div>

                {/* My Fleet */}
                <div className="mt-5">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold">My Fleet</p>
                        <ChevronDown size={15} className="text-gray-400" />
                    </div>

                    <div className="space-y-2">
                        {[
                            ["TN 38 AB 1234", "Active"],
                            ["TN 33 CD 5678", "Active"],
                            ["TN 54 EF 9012", "Inactive"],
                        ].map(([bus, status]) => (
                            <label
                                key={bus}
                                className="flex cursor-pointer items-center justify-between gap-2 text-xs"
                            >
                                <span className="flex items-center gap-2 text-gray-600">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-3.5 w-3.5 accent-teal-600"
                                    />
                                    {bus}
                                </span>
                                <span
                                    className={`text-[10px] ${status === "Active" ? "text-teal-600" : "text-gray-400"
                                        }`}
                                >
                                    {status}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Trip Status */}
                <div className="mt-5">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold">Trip Status</p>
                        <ChevronDown size={15} className="text-gray-400" />
                    </div>

                    <div className="space-y-2">
                        {[
                            ["Scheduled", "bg-teal-500"],
                            ["Boarding", "bg-blue-500"],
                            ["Departed", "bg-violet-500"],
                            ["Completed", "bg-gray-400"],
                            ["Cancelled", "bg-red-500"],
                        ].map(([status, dot]) => (
                            <button
                                key={status}
                                onClick={() => setActiveFilter(status)}
                                className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs ${activeFilter === status
                                    ? "bg-teal-50 text-teal-700"
                                    : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className={`h-2 w-2 rounded-full ${dot}`} />
                                    {status}
                                </span>
                                <span className="text-gray-400">
                                    {trips.filter((trip) => trip.status === status).length}
                                </span>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setActiveFilter("All Trips")}
                        className={`mt-2 w-full rounded-lg px-2 py-1.5 text-left text-xs ${activeFilter === "All Trips"
                            ? "bg-teal-50 font-medium text-teal-700"
                            : "text-gray-500 hover:bg-gray-50"
                            }`}
                    >
                        All Trips
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-auto border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <CalendarCheck size={14} className="text-teal-600" />
                        Fleet Schedule
                    </div>
                    <p className="mt-1 text-[10px] text-gray-400">
                        Manage your daily operations
                    </p>
                </div>
            </aside>

            {/* ================= MAIN CALENDAR ================= */}
            <main className="flex min-w-0 flex-1 flex-col bg-gray-50/70">

                {/* Header */}
                <div className="border-b border-gray-200 bg-white px-4 py-4 md:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight text-gray-900">
                                December, 2023
                            </h1>
                            <p className="mt-1 text-xs text-gray-500">
                                Manage and monitor your bus trips
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {/* View Switcher */}
                            <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                                {["Month", "Week", "Day"].map((view) => (
                                    <button
                                        key={view}
                                        onClick={() => setSelectedView(view)}
                                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${selectedView === view
                                            ? "bg-white text-teal-700 shadow-sm"
                                            : "text-gray-500 hover:text-gray-800"
                                            }`}
                                    >
                                        {view}
                                    </button>
                                ))}
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handlePrevious}
                                    className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-50"
                                >
                                    <ChevronLeft size={15} />
                                </button>

                                <button
                                    onClick={handleToday}
                                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Today
                                </button>

                                <button
                                    onClick={handleNext}
                                    className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-50"
                                >
                                    <ChevronRight size={15} />
                                </button>
                            </div>

                            {/* Add Trip */}
                            <button className="flex items-center gap-2 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-700">
                                <Plus size={15} />
                                Add Trip
                            </button>
                        </div>
                    </div>

                    {/* Week Days */}
                    <div className="mt-4 grid grid-cols-7 gap-2">
                        {weekDays.map((day) => (
                            <button
                                key={day.date}
                                onClick={() => setSelectedDate(day.date)}
                                className={`rounded-xl border p-2 text-center transition ${selectedDate === day.date
                                    ? "border-teal-600 bg-teal-600 text-white shadow-sm"
                                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-teal-200 hover:bg-teal-50"
                                    }`}
                            >
                                <p className="text-[10px] font-medium">{day.day}</p>
                                <p className="mt-1 text-sm font-semibold">{day.date}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 overflow-auto bg-white">
                    <div className="min-w-[850px]">

                        {/* Time Grid */}
                        <div className="relative grid grid-cols-[42px_repeat(7,minmax(0,1fr))]">

                            {/* Time Labels */}
                            <div className="relative">
                                {hours.map((hour, index) => (
                                    <div
                                        key={hour}
                                        className="relative h-[90px] border-b border-gray-100"
                                    >
                                        <span className="absolute -top-2 right-2 text-[10px] text-gray-400">
                                            {hour}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Day Columns */}
                            {weekDays.map((day, dayIndex) => (
                                <div
                                    key={day.date}
                                    className="relative border-l border-gray-100"
                                >
                                    {/* Hour Lines */}
                                    {hours.map((hour) => (
                                        <div
                                            key={hour}
                                            className="h-[90px] border-b border-gray-100"
                                        />
                                    ))}

                                    {/* Trip Cards */}
                                    {filteredTrips
                                        .filter((trip) => trip.day === dayIndex)
                                        .map((trip) => (
                                            <button
                                                key={trip.id}
                                                onClick={() => handleTripClick(trip)}
                                                style={{
                                                    top: `${trip.start * 90 + 6}px`,
                                                    height: `${trip.duration * 90 - 12}px`,
                                                }}
                                                className={`absolute left-1 right-1 z-10 overflow-hidden rounded-lg border p-2 text-left shadow-sm transition hover:z-20 hover:shadow-md ${colorStyles[trip.color]
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between gap-1">
                                                    <Bus size={12} className="shrink-0" />
                                                    <span className="truncate text-[9px] font-semibold">
                                                        {trip.bus}
                                                    </span>
                                                </div>

                                                <p className="mt-2 line-clamp-2 text-[10px] font-semibold leading-4">
                                                    {trip.title}
                                                </p>

                                                <p className="mt-1 text-[9px] opacity-75">
                                                    {trip.time}
                                                </p>

                                                {trip.duration > 1 && (
                                                    <div className="mt-2 flex items-center gap-1 text-[9px]">
                                                        <Users size={10} />
                                                        {trip.seats}
                                                    </div>
                                                )}

                                                <span
                                                    className={`mt-2 inline-flex rounded-full px-1.5 py-0.5 text-[8px] font-medium ${statusStyles[trip.status]
                                                        }`}
                                                >
                                                    {trip.status}
                                                </span>
                                            </button>
                                        ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trip Details Popup */}
                    {showTripDetails && (
                        <>
                            <div className="tint fixed inset-0 bg-black/40 backdrop-blur-[4px] z-20"></div>
                            <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-30 w-[500px] max-w-[calc(100%-24px)] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-xs font-semibold text-gray-400">
                                        TRIP DETAILS
                                    </p>
                                    <button
                                        onClick={() => setShowTripDetails(false)}
                                        className="rounded-md p-1 text-gray-400 hover:bg-gray-100"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                <h3 className="text-sm font-semibold text-gray-900">
                                    {selectedTrip?.title || "Coimbatore → Chennai"}
                                </h3>

                                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                    <Bus size={14} className="text-teal-600" />
                                    {selectedTrip?.bus || "TN 38 AB 1234"}
                                </div>

                                <div className="mt-3 space-y-3">
                                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                                        <CalendarDays size={15} className="text-teal-600" />
                                        <span className="text-xs text-gray-700">
                                            Tuesday, 18 December
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="rounded-lg border border-gray-200 p-3">
                                            <p className="text-[10px] text-gray-400">Departure</p>
                                            <p className="mt-1 text-xs font-semibold text-gray-800">
                                                {selectedTrip?.time?.split(" - ")[0] || "09:00 PM"}
                                            </p>
                                        </div>
                                        <div className="rounded-lg border border-gray-200 p-3">
                                            <p className="text-[10px] text-gray-400">Arrival</p>
                                            <p className="mt-1 text-xs font-semibold text-gray-800">
                                                {selectedTrip?.time?.split(" - ")[1] || "06:00 AM"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                                        <UserRound size={15} className="text-teal-600" />
                                        <div>
                                            <p className="text-[10px] text-gray-400">Assigned Driver</p>
                                            <p className="mt-1 text-xs font-medium text-gray-800">
                                                {selectedTrip?.driver || "Raj Kumar"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                                        <Users size={15} className="text-teal-600" />
                                        <div>
                                            <p className="text-[10px] text-gray-400">Seat Occupancy</p>
                                            <p className="mt-1 text-xs font-medium text-gray-800">
                                                {selectedTrip?.seats || "32 / 40"} Seats Booked
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span
                                            className={`rounded-full px-2 py-1 text-[10px] font-medium ${statusStyles[selectedTrip?.status || "Scheduled"]
                                                }`}
                                        >
                                            {selectedTrip?.status || "Scheduled"}
                                        </span>
                                        <button className="text-xs font-medium text-teal-700 hover:text-teal-800">
                                            View Full Trip <ArrowRight size={12} className="inline" />
                                        </button>
                                    </div>
                                </div>

                                <button className="mt-4 w-full rounded-lg bg-teal-600 py-2.5 text-xs font-semibold text-white hover:bg-teal-700">
                                    Manage Trip
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default VendorCalendar;
