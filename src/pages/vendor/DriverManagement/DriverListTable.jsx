import {
    Eye, Pencil, Trash2, Search,
    SlidersHorizontal,
    Download,
    ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import DriverDeleteModal from "./DriverDeleteModal";
import DriverDetailsModal from "./DriverDetailsModal";
import AddDriverForm from "./AddDriverForm";
import axios from "axios";
import { toast } from "react-toastify";


// Set badge colors based on driver status
const getStatusStyle = (status) => {
    switch (status) {
        case "available":
            return "bg-teal-100 text-teal-700";

        case "not-available":
            return "bg-pink-100 text-pink-700";
        case "assigned":
            return "bg-green-100 text-green-700";

        case "leave":
            return "bg-amber-100 text-amber-600";

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

const DriverListTable = ({ refreshKey = 0, onDriversChanged }) => {

    // Auth
    const token = localStorage.getItem("exte_key");

    const [deleteDriver, setDeleteDriver] = useState(null);
    const [editDriver, setEditDriver] = useState(null);
    const [viewDriver, setViewDriver] = useState(null);
    const [drivers, setDrivers] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    // functions

    useEffect(() => {
        const controller = new AbortController();
        const timer = window.setTimeout(async () => {
            setIsLoading(true);
            setLoadError("");
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
                if (!baseUrl) throw new Error("API URL is not configured.");
                const res = await axios.get(`${baseUrl}/agent/drivers`, {
                    params: { page: 1, limit: 10, status, search: search.trim() },
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    signal: controller.signal,
                });
                const result = res.data?.drivers ?? res.data?.data?.drivers ?? res.data?.data;
                setDrivers(Array.isArray(result) ? result : []);
            } catch (err) {
                if (err.code === "ERR_CANCELED") return;
                setDrivers([]);
                setLoadError(err.response?.data?.message || err.message || "Could not load drivers.");
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        }, search.trim() ? 350 : 0);

        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [token, search, status, refreshKey]);

    const confirmDelete = async (driver) => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
        const driverId = driver._id || driver.id;
        if (!baseUrl || !driverId) throw new Error("Driver ID or API URL is missing.");
        const response = await axios.delete(`${baseUrl}/agent/drivers/${driverId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        toast.success(response.data?.message || "Driver deleted successfully.");
        setDrivers((current) => current.filter((item) => (item._id || item.id) !== driverId));
        setDeleteDriver(null);
        onDriversChanged?.();
    };

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
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search name, mobile, license..."
                                aria-label="Search drivers"
                                className="w-full rounded-full border border-slate-200 bg-slate-100/80 py-1.5 pl-7 pr-3 text-[14px] text-slate-700 outline-none placeholder:text-slate-400 "
                            />
                        </div>

                        {/* Filter */}
                        <div className="relative">
                            <button
                                type="button"
                                aria-expanded={isFilterOpen}
                                onClick={() => setIsFilterOpen((open) => !open)}
                                className="inline-flex items-center gap-1.5 border border-slate-200 rounded-full bg-slate-100/80 px-3 py-1.5 text-[14px] text-black"
                            >
                                <SlidersHorizontal size={13} />
                                <span>{status ? status.replace("-", " ") : "Filter"}</span>
                            </button>
                            {isFilterOpen && (
                                <div className="absolute right-0 top-full z-20 mt-2 min-w-40 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                                    {[["", "All drivers"], ["available", "Available"], ["assigned", "Assigned"], ["leave", "On leave"]].map(([value, label]) => (
                                        <button key={value || "all"} type="button" onClick={() => { setStatus(value); setIsFilterOpen(false); }} className={`block w-full rounded-lg px-3 py-2 text-left text-xs capitalize hover:bg-slate-50 ${status === value ? "font-semibold text-teal-700" : "text-slate-700"}`}>
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

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
                <div className="w-full overflow-x-auto  rounded-lg max-h-[calc(100vh-180px)] custom-scroll border border-slate-200 bg-white">
                    <table className="w-full border-collapse ">

                        {/* Table Header */}
                        <thead className="bg-[#E5EBEF] sticky top-0">
                            <tr className="text-[10px] text-left font-medium uppercase text-slate-700">
                                <th className="px-5 py-3 font-medium">
                                    Driver Name
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    Mobile
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    License No
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    Employee code
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
                            {isLoading ? Array.from({ length: 5 }, (_, index) => (
                                <tr key={`skeleton-${index}`} className="animate-pulse border-t border-slate-100">
                                    {Array.from({ length: 6 }, (_, cell) => <td key={cell} className="px-4 py-4"><div className="h-3 rounded bg-slate-100" /></td>)}
                                </tr>
                            )) : loadError ? (
                                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-rose-700">{loadError}</td></tr>
                            ) : drivers.length === 0 ? (
                                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">No drivers found. Try a different search or status filter.</td></tr>
                            ) : drivers.map((driver, index) => (
                                <tr
                                    key={driver._id || driver.id}
                                    className="border-t border-slate-100 transition-colors hover:bg-slate-50"
                                >
                                    {/* Route */}


                                    {/* Driver Name */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 whitespace-nowrap">

                                            <div
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold ${getInitialsStyle(index)}`}
                                            >
                                                {driver?.profilePhoto?.url ? <img className="w-10 h-10 rounded-full object-cover" src={driver?.profilePhoto?.url} /> : <p>{driver?.fullName?.slice(0, 1)}</p>}

                                            </div>

                                            <span className="text-xs font-medium text-slate-800">
                                                {driver.fullName}
                                            </span>

                                        </div>
                                    </td>

                                    {/* mobile  */}
                                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                                        {driver.mobile}
                                    </td>

                                    {/* Seat Berth */}
                                    <td className="px-4 py-3 text-xs font-semibold text-slate-800">
                                        {driver.drivingLicenseNumber}
                                    </td>
                                    <td className="px-4 py-3 text-xs font-semibold text-slate-800">
                                        {driver.employeeCode}
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium ${getStatusStyle(driver.status)}`}
                                        >
                                            {driver?.status?.toUpperCase()}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">

                                            {/* View */}
                                            <button
                                                type="button"
                                                title="View driver"
                                                onClick={() => setViewDriver(driver)}
                                                className="flex h-8 w-8 items-center justify-center rounded-full  text-slate-600 transition-colors hover:bg-slate-200"
                                            >
                                                <Eye size={14} />
                                            </button>

                                            {/* Edit */}
                                            <button
                                                type="button"
                                                title="Edit driver"
                                                onClick={() => setEditDriver(driver)}
                                                className="flex h-8 w-8 items-center justify-center rounded-full  text-emerald-700 transition-colors hover:bg-emerald-200"
                                            >
                                                <Pencil size={14} />
                                            </button>

                                            {/* Delete */}
                                            <button
                                                type="button"
                                                title="Delete driver"
                                                onClick={() => setDeleteDriver(driver)}
                                                className="flex h-8 w-8 items-center justify-center rounded-full  text-rose-600 transition-colors hover:bg-rose-200"
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

            {deleteDriver && <DriverDeleteModal driver={deleteDriver} onClose={() => setDeleteDriver(null)} onConfirm={confirmDelete} />}
            {editDriver && <AddDriverForm key={editDriver._id || editDriver.id} driver={editDriver} onClose={() => setEditDriver(null)} onSuccess={onDriversChanged} />}
            {viewDriver && <DriverDetailsModal driver={viewDriver} onClose={() => setViewDriver(null)} />}
        </>
    )
}

export default DriverListTable
