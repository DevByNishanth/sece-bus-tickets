import {
    Eye, Pencil, Trash2, Search,
    SlidersHorizontal,
    Download,
    ArrowRight,
} from "lucide-react";
const data = [
    {
        "id": 1,
        "initials": "AK",
        "name": "Arun Kumar",
        "route": "Coimbatore → Chennai",
        "from": "Coimbatore",
        "to": "Chennai",
        "date": "16 Oct 2026",
        "seat": "U2",
        "status": "Active"
    },
    {
        "id": 2,
        "initials": "PS",
        "name": "Priya S",
        "route": "Chennai → Coimbatore",
        "from": "Chennai",
        "to": "Coimbatore",
        "date": "16 Oct 2026",
        "seat": "L4",
        "status": "In-Active"
    },
    {
        "id": 3,
        "initials": "KR",
        "name": "Karthik R",
        "route": "Coimbatore → Bengaluru",
        "from": "Coimbatore",
        "to": "Bengaluru",
        "date": "17 Oct 2026",
        "seat": "U6",
        "status": "Pending"
    },
    {
        "id": 4,
        "initials": "DM",
        "name": "Divya M",
        "route": "Madurai → Chennai",
        "from": "Madurai",
        "to": "Chennai",
        "date": "17 Oct 2026",
        "seat": "L2",
        "status": "Available"
    },
    {
        "id": 5,
        "initials": "SN",
        "name": "Suresh N",
        "route": "Coimbatore → Chennai",
        "from": "Coimbatore",
        "to": "Chennai",
        "date": "18 Oct 2026",
        "seat": "U8",
        "status": "Rejected"
    },
    {
        "id": 6,
        "initials": "LK",
        "name": "Lokesh K",
        "route": "Chennai → Madurai",
        "from": "Chennai",
        "to": "Madurai",
        "date": "18 Oct 2026",
        "seat": "L1",
        "status": "Active"
    },
    {
        "id": 7,
        "initials": "AN",
        "name": "Ananya N",
        "route": "Bengaluru → Coimbatore",
        "from": "Bengaluru",
        "to": "Coimbatore",
        "date": "19 Oct 2026",
        "seat": "U5",
        "status": "Active"
    },
    {
        "id": 8,
        "initials": "VP",
        "name": "Vijay P",
        "route": "Coimbatore → Chennai",
        "from": "Coimbatore",
        "to": "Chennai",
        "date": "19 Oct 2026",
        "seat": "L7",
        "status": "In-Active"
    },
    {
        "id": 9,
        "initials": "RG",
        "name": "Ramesh G",
        "route": "Chennai → Bengaluru",
        "from": "Chennai",
        "to": "Bengaluru",
        "date": "20 Oct 2026",
        "seat": "U3",
        "status": "Pending"
    },
    {
        "id": 10,
        "initials": "SV",
        "name": "Sneha V",
        "route": "Madurai → Coimbatore",
        "from": "Madurai",
        "to": "Coimbatore",
        "date": "20 Oct 2026",
        "seat": "L9",
        "status": "Available"
    }
]

// Set badge colors based on driver status
const getStatusStyle = (status) => {
    switch (status) {
        case "Active":
            return "bg-teal-100 text-teal-700";

        case "In-Active":
            return "bg-red-100 text-red-600";

        case "Pending":
            return "bg-orange-100 text-orange-700";

        case "Available":
            return "bg-cyan-100 text-cyan-700";

        case "Rejected":
            return "bg-red-100 text-red-600";

        default:
            return "bg-gray-100 text-gray-600";
    }
};

// Different background colors for driver initials
const getInitialsStyle = (index) => {
    const colors = [
        "bg-teal-50 text-teal-700",
        "bg-pink-50 text-pink-600",
        "bg-amber-50 text-amber-700",
        "bg-indigo-50 text-indigo-600",
        "bg-slate-100 text-slate-700",
    ];

    return colors[index % colors.length];
};

const DriverListTable = () => {
    return (
        <>
            <div className="main-container mt-3 border border-slate-200 shadow-md bg-white rounded-2xl p-6">

                {/* header  */}
                <header className="flex flex-col gap-4 border-b border-slate-100 pb-6 lg:flex-row lg:items-center lg:justify-between">

                    {/* Heading */}
                    <div className="flex flex-col ">
                        <h1 className="font-semibold text-[#17212B]">
                            Driver List
                        </h1>

                        <p className="text-[12px] text-[#718096]">
                            Live passenger ticket reservations &amp; payment receipts across all routes
                        </p>
                    </div>

                    {/* Search and Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">

                        {/* Search */}
                        <div className="relative w-[280px]">
                            <Search
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                            />

                            <input
                                type="text"
                                placeholder="Search PNR, passenger..."
                                className="w-full rounded-full border border-slate-200 bg-slate-100/80 py-1.5 pl-7 pr-3 text-[14px] text-slate-700 outline-none placeholder:text-slate-400 "
                            />
                        </div>

                        {/* Filter */}
                        <button
                            type="button"
                            className="inline-flex items-center gap-1.5 border border-slate-200 rounded-full bg-slate-100/80 px-3 py-1.5 text-[14px] text-black "
                        >
                            <SlidersHorizontal size={13} />
                            <span>Filter</span>
                        </button>

                        {/* Export CSV */}
                        <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#0E7A88] hover:bg-[#046b79] px-3 py-2 text-[14px] font-semibold text-white sm:text-xs"
                        >
                            <Download size={13} />
                            <span>Export CSV</span>
                        </button>

                        {/* View All */}
                        <button
                            type="button"
                            className="group inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-[10px] font-semibold text-[#0d7d85] sm:text-xs"
                        >
                            <span>View All</span>
                            <ArrowRight
                                size={13}
                                className="transition-transform group-hover:translate-x-0.5"
                            />
                        </button>

                    </div>
                </header>

                {/* table  */}
                <div className="w-full overflow-x-auto  rounded-lg max-h-[calc(100vh-180px)] border border-slate-200 bg-white">
                    <table className="w-full border-collapse text-">

                        {/* Table Header */}
                        <thead className="bg-[#E5EBEF] sticky top-0">
                            <tr className="text-[10px] text-left font-medium uppercase text-slate-700">
                                <th className="px-5 py-3 font-medium">
                                    Route
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    Driver Name
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    Travel Date
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    Seat Berth
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    Status
                                </th>

                                <th className="px-4 py-3 text-center font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {data.map((driver, index) => (
                                <tr
                                    key={driver.id}
                                    className="border-t border-slate-100 transition-colors hover:bg-slate-50"
                                >

                                    {/* Route */}
                                    <td className="px-5 py-3 text-">
                                        <span className="whitespace-nowrap text-xs text-slate-700">
                                            {driver.route}
                                        </span>
                                    </td>

                                    {/* Driver Name */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 whitespace-nowrap">

                                            <div
                                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${getInitialsStyle(index)}`}
                                            >
                                                {driver.initials}
                                            </div>

                                            <span className="text-xs font-medium text-slate-800">
                                                {driver.name}
                                            </span>

                                        </div>
                                    </td>

                                    {/* Travel Date */}
                                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                                        {driver.date}
                                    </td>

                                    {/* Seat Berth */}
                                    <td className="px-4 py-3 text-xs font-semibold text-slate-800">
                                        {driver.seat}
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium ${getStatusStyle(driver.status)}`}
                                        >
                                            {driver.status}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">

                                            {/* View */}
                                            <button
                                                type="button"
                                                title="View driver"
                                                onClick={() => console.log("View driver:", driver.id)}
                                                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
                                            >
                                                <Eye size={14} />
                                            </button>

                                            {/* Edit */}
                                            <button
                                                type="button"
                                                title="Edit driver"
                                                onClick={() => console.log("Edit driver:", driver.id)}
                                                className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition-colors hover:bg-emerald-200"
                                            >
                                                <Pencil size={14} />
                                            </button>

                                            {/* Delete */}
                                            <button
                                                type="button"
                                                title="Delete driver"
                                                onClick={() => console.log("Delete driver:", driver.id)}
                                                className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600 transition-colors hover:bg-rose-200"
                                            >
                                                <Trash2 size={14} />
                                            </button>

                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>
        </>
    )
}

export default DriverListTable
