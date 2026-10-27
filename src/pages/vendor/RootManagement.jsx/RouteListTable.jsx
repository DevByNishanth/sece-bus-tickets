
import { useState } from "react";

import {
    ChevronRight,
    ChevronDown,
    Search,
    SlidersHorizontal,
    Download,
    ArrowRight,
    MoreHorizontal,
    Circle,
} from "lucide-react";

const RouteListTable = () => {
    // Store which routes are expanded
    const [openRoutes, setOpenRoutes] = useState([1]);

    // Route data
    const routes = [
        {
            id: 1,
            from: "Madurai",
            to: "Coimbatore",
            activeCount: 2,
            variants: [
                {
                    name: "Express via Dindigul",
                    code: "RTE-0771",
                    stops: 4,
                    distance: "180 km",
                    duration: "4h 15m",
                    configuration: "4 / 4 configured",
                    trips: 8,
                    status: "Active",
                    updated: "09 Jun, 12:30",
                    updatedBy: "Arun Kumar",
                },
                {
                    name: "Express via Palani",
                    code: "RTE-0772",
                    stops: 6,
                    distance: "210 km",
                    duration: "5h 00m",
                    configuration: "6 / 6 configured",
                    trips: 5,
                    status: "Active",
                    updated: "09 Jun, 13:15",
                    updatedBy: "Priya S",
                },
                {
                    name: "Regular via Dindigul",
                    code: "RTE-0773",
                    stops: 5,
                    distance: "195 km",
                    duration: "4h 45m",
                    configuration: "4 / 5 configured",
                    trips: 3,
                    status: "Inactive",
                    updated: "08 Jun, 16:20",
                    updatedBy: "Karthik R",
                },
            ],
        },
        {
            id: 2,
            from: "Chennai",
            to: "Salem",
            activeCount: 2,
            variants: [
                {
                    name: "Express via Namakkal",
                    code: "RTE-0774",
                    stops: 5,
                    distance: "345 km",
                    duration: "6h 15m",
                    configuration: "5 / 5 configured",
                    trips: 11,
                    status: "Active",
                    updated: "09 Jun, 14:05",
                    updatedBy: "Arun Kumar",
                },
                {
                    name: "Regular via Villupuram",
                    code: "RTE-0775",
                    stops: 7,
                    distance: "360 km",
                    duration: "7h 00m",
                    configuration: "7 / 7 configured",
                    trips: 6,
                    status: "Active",
                    updated: "09 Jun, 11:30",
                    updatedBy: "Priya S",
                },
            ],
        },
    ];

    // Toggle accordion
    const toggleRoute = (routeId) => {
        if (openRoutes.includes(routeId)) {
            setOpenRoutes(openRoutes.filter((id) => id !== routeId));
        } else {
            setOpenRoutes([routeId]);
        }
    };

    return (
        <div className="main-container mt-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">

            {/* Header */}
            <header className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 lg:flex-row lg:items-center">

                <div>
                    <h2 className="font-semibold text-[#17212B]">
                        Route List
                    </h2>

                    <p className="text-[12px] text-[#718096]">
                        Live passenger ticket reservations & payment receipts across all routes
                    </p>
                </div>

                {/* Header actions */}
                <div className="flex flex-wrap items-center gap-2">

                    {/* Search */}
                    <div className="flex h-9 w-[290px] items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3">
                        <Search size={14} className="text-slate-500" />

                        <input
                            type="text"
                            placeholder="Search PNR, passenger..."
                            className="w-full bg-transparent text-[14px] text-slate-700 outline-none placeholder:text-slate-400 "
                        />
                    </div>

                    {/* Filter */}
                    <button
                        type="button"
                        className="flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 text-[14px] font-medium text-black transition hover:bg-slate-100"
                    >
                        <SlidersHorizontal size={12} />
                        Filter
                    </button>

                    {/* Export */}
                    <button
                        type="button"
                        className="flex h-9 items-center gap-1.5 rounded-full bg-[#0E7A88] px-3 text-[14px] font-semibold text-white transition hover:bg-teal-800"
                    >
                        <Download size={14} />
                        Export CSV
                    </button>

                    {/* View all */}
                    <button
                        type="button"
                        className="flex h-9 items-center gap-1 rounded-full px-2 text-[14px] font-medium cursor-pointer text-teal-700 hover:text-teal-900"
                    >
                        View All
                        <ArrowRight size={12} />
                    </button>

                </div>
            </header>

            {/* Route accordion */}
            <div className="mt-3 space-y-3">

                {routes.map((route) => {
                    const isOpen = openRoutes.includes(route.id);

                    return (
                        <div
                            key={route.id}
                            className="overflow-hidden rounded-xl border border-slate-200 "
                        >

                            {/* Accordion heading */}
                            <button
                                type="button"
                                onClick={() => toggleRoute(route.id)}
                                className="flex min-h-[42px] w-full items-center justify-between gap-3 bg-slate-100 px-3 py-2 text-left transition hover:bg-slate-100"
                            >

                                <div className="flex min-w-0 items-center gap-2">

                                    {/* Expand icon */}
                                    <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500">
                                        {isOpen ? (
                                            <ChevronDown size={14} />
                                        ) : (
                                            <ChevronRight size={14} />
                                        )}
                                    </div>

                                    {/* Route name */}
                                    <span className="text-[14px] font-semibold text-slate-800">
                                        {route.from}
                                    </span>

                                    <ArrowRight
                                        size={12}
                                        className="shrink-0 text-teal-700"
                                    />

                                    <span className="text-[14px] font-semibold text-slate-800">
                                        {route.to}
                                    </span>

                                    <div className="mx-1 hidden h-4 border-l border-slate-200 sm:block" />

                                    <span className="hidden text-[11px] text-slate-500 sm:block">
                                        {route.variants.length} route variants
                                    </span>

                                </div>

                                {/* Active count */}
                                <span className="shrink-0 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[9px] font-semibold text-emerald-700">
                                    {route.activeCount} active
                                </span>

                            </button>

                            {/* Accordion content */}
                            {isOpen && (
                                <div className="w-full overflow-x-auto">

                                    <table className="w-full min-w-[750px] table-auto text-left">

                                        {/* Table headings */}
                                        <thead>
                                            <tr className="bg-white">

                                                <th className="px-5 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                                    Route Variant
                                                </th>

                                                <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                                    Stops
                                                </th>

                                                <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                                    Distance / Duration
                                                </th>

                                                <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                                    Configuration
                                                </th>

                                                <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                                    Trips
                                                </th>

                                                <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                                    Status
                                                </th>

                                                <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                                    Last Updated
                                                </th>

                                                <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                                    Actions
                                                </th>

                                            </tr>
                                        </thead>

                                        {/* Route variants */}
                                        <tbody>

                                            {route.variants.map((variant) => (
                                                <tr
                                                    key={variant.code}
                                                    className="border-t border-slate-100 transition hover:bg-slate-50/70"
                                                >

                                                    {/* Variant name */}
                                                    <td className="px-5 py-2.5">
                                                        <p className="text-[12px] font-semibold text-slate-800">
                                                            {variant.name}
                                                        </p>

                                                        <p className="mt-1 text-[9px] text-slate-400">
                                                            {variant.code}
                                                        </p>
                                                    </td>

                                                    {/* Stops */}
                                                    <td className="px-3 py-2.5">
                                                        <p className="text-[12px] font-semibold text-slate-800">
                                                            {variant.stops}
                                                        </p>

                                                        <p className="mt-1 text-[9px] text-slate-400">
                                                            stops
                                                        </p>
                                                    </td>

                                                    {/* Distance */}
                                                    <td className="px-3 py-2.5">
                                                        <p className="text-[12px] font-semibold text-slate-800">
                                                            {variant.distance}
                                                        </p>

                                                        <p className="mt-1 text-[9px] text-slate-400">
                                                            {variant.duration}
                                                        </p>
                                                    </td>

                                                    {/* Configuration */}
                                                    <td className="px-3 py-2.5">
                                                        <p className="text-[12px] font-semibold text-slate-800">
                                                            {variant.configuration}
                                                        </p>

                                                        <p className="mt-1 text-[9px] text-slate-400">
                                                            Boarding / drop
                                                        </p>
                                                    </td>

                                                    {/* Trips */}
                                                    <td className="px-3 py-2.5">
                                                        <p className="text-[12px] font-semibold text-slate-800">
                                                            {variant.trips}
                                                        </p>

                                                        <p className="mt-1 text-[9px] text-slate-400">
                                                            linked trips
                                                        </p>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-3 py-2.5">
                                                        <span
                                                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${variant.status === "Active"
                                                                ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                                                                : "border-slate-200 bg-slate-100 text-slate-500"
                                                                }`}
                                                        >
                                                            <Circle
                                                                size={5}
                                                                fill="currentColor"
                                                            />
                                                            {variant.status}
                                                        </span>
                                                    </td>

                                                    {/* Last updated */}
                                                    <td className="px-3 py-2.5">
                                                        <p className="whitespace-nowrap text-[12px] font-semibold text-slate-800">
                                                            {variant.updated}
                                                        </p>

                                                        <p className="mt-1 whitespace-nowrap text-[9px] text-slate-400">
                                                            by {variant.updatedBy}
                                                        </p>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-3 py-2.5">
                                                        <button
                                                            type="button"
                                                            aria-label={`Actions for ${variant.name}`}
                                                            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                                        >
                                                            <MoreHorizontal size={15} />
                                                        </button>
                                                    </td>

                                                </tr>
                                            ))}

                                        </tbody>

                                    </table>

                                </div>
                            )}

                        </div>
                    );
                })}

            </div>

            {/* Pagination footer */}
            <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                <p className="text-[10px] text-slate-500">
                    Showing <span className="font-semibold text-slate-800">1 - 5</span> of 120 bookings
                </p>

                <div className="flex items-center gap-1.5">

                    <button
                        type="button"
                        disabled
                        className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] text-slate-400 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    <button
                        type="button"
                        className="h-6 w-6 rounded-lg bg-teal-700 text-[10px] font-semibold text-white"
                    >
                        1
                    </button>

                    <button
                        type="button"
                        className="h-6 w-6 rounded-lg border border-slate-200 text-[10px] text-slate-700 transition hover:bg-slate-50"
                    >
                        2
                    </button>

                    <button
                        type="button"
                        className="h-6 w-6 rounded-lg border border-slate-200 text-[10px] text-slate-700 transition hover:bg-slate-50"
                    >
                        3
                    </button>

                    <span className="px-1 text-[10px] text-slate-400">
                        ...
                    </span>

                    <button
                        type="button"
                        className="h-6 rounded-lg border border-slate-200 px-2 text-[10px] text-slate-700 transition hover:bg-slate-50"
                    >
                        24
                    </button>

                    <button
                        type="button"
                        className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Next
                    </button>

                </div>

            </div>

        </div>
    );
};

export default RouteListTable;
