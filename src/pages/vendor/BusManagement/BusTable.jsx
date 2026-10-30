import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Search, SlidersHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import komban from '../../../assets/komban.jfif'

const PAGE_SIZE = 10;
const STATUS_OPTIONS = [
    ["all", "All statuses"],
    ["pending", "Pending"],
    ["approved", "Approved"],
    ["rejected", "Rejected"],
    ["suspended", "Suspended"],
];

const getBusList = (body) => {
    const data = body?.data ?? body;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.buses)) return data.buses;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(body?.buses)) return body.buses;
    return [];
};

const formatDate = (dateValue) => {
    if (!dateValue) return "—";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const statusClass = (status) => {
    switch (String(status || "").toLowerCase()) {
        case "approved": return "border-emerald-100 bg-emerald-50 text-emerald-700";
        case "pending": return "border-amber-100 bg-amber-50 text-amber-700";
        case "rejected": return "border-rose-100 bg-rose-50 text-rose-700";
        case "suspended": return "border-slate-200 bg-slate-100 text-slate-600";
        default: return "border-slate-200 bg-slate-50 text-slate-600";
    }
};

const BusTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [showFilter, setShowFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [buses, setBuses] = useState([]);
    const [pagination, setPagination] = useState({ total: null, totalPages: null, hasNextPage: null });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const timeout = window.setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
        return () => window.clearTimeout(timeout);
    }, [searchTerm]);

    useEffect(() => {
        const controller = new AbortController();
        const loadBuses = async () => {
            setIsLoading(true);
            setError("");
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
                if (!baseUrl) throw new Error("VITE_API_BASE_URL is not configured.");
                const token = window.localStorage.getItem("ext-key");
                if (!token) throw new Error("Authentication token was not found. Please sign in again.");

                const query = new URLSearchParams({ page: String(currentPage), limit: String(PAGE_SIZE), search: debouncedSearch });
                if (selectedStatus !== "all") query.set("status", selectedStatus);
                const response = await fetch(`${baseUrl}/agent/buses?${query.toString()}`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                    signal: controller.signal,
                });
                const responseText = await response.text();
                let body;
                try { body = responseText ? JSON.parse(responseText) : {}; } catch { body = { message: responseText }; }
                if (!response.ok) throw new Error(body?.message || `Could not load buses (${response.status}).`);

                const list = getBusList(body);
                const root = body?.data ?? body;
                const meta = root?.pagination || root?.meta || body?.pagination || body?.meta || {};
                const total = Number(meta.total ?? meta.totalItems ?? meta.totalBuses ?? root?.total ?? body?.total);
                const totalPages = Number(meta.totalPages ?? meta.pages ?? root?.totalPages ?? body?.totalPages);
                const hasNextPage = meta.hasNextPage ?? root?.hasNextPage ?? body?.hasNextPage;
                setBuses(list);
                setPagination({
                    total: Number.isFinite(total) && total >= 0 ? total : null,
                    totalPages: Number.isFinite(totalPages) && totalPages > 0 ? totalPages : null,
                    hasNextPage: typeof hasNextPage === "boolean" ? hasNextPage : null,
                });
            } catch (loadError) {
                if (loadError.name !== "AbortError") {
                    setBuses([]);
                    setError(loadError.message || "Could not load buses. Please try again.");
                }
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        };

        loadBuses();
        return () => controller.abort();
    }, [currentPage, debouncedSearch, selectedStatus]);

    const canGoNext = pagination.totalPages
        ? currentPage < pagination.totalPages
        : pagination.hasNextPage ?? buses.length === PAGE_SIZE;

    const handleExport = () => {
        const headers = ["Bus name", "Operator", "Registration number", "Bus type", "Category", "Capacity", "Status", "Submitted"];
        const escapeCsv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
        const rows = buses.map((bus) => [
            bus.busName,
            bus.operatorName,
            bus.registrationNumber,
            bus.busType,
            bus.category,
            bus.passengerCapacity ?? bus.totalSeats,
            bus.status,
            formatDate(bus.submittedAt || bus.createdAt),
        ]);
        const content = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
        const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = `buses-page-${currentPage}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const showing = useMemo(() => {
        if (!buses.length) return { from: 0, to: 0 };
        return { from: (currentPage - 1) * PAGE_SIZE + 1, to: (currentPage - 1) * PAGE_SIZE + buses.length };
    }, [buses.length, currentPage]);

    return (
        <section className="mt-4 w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="bus-list-title">
            <div className="mb-4 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
                <div>
                    <h2 id="bus-list-title" className="text-lg font-semibold text-slate-900">Bus List</h2>
                    <p className="mt-0.5 text-xs text-slate-500">Search and review your registered buses.</p>
                </div>
                <div className="flex max-w-full items-center gap-2 overflow-visible pb-1">
                    <label className="flex h-9 w-64 shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3">
                        <Search size={15} className="shrink-0 text-slate-500" />
                        <input type="search" placeholder="Search bus, operator, registration" value={searchTerm} onChange={(event) => { setSearchTerm(event.target.value); setCurrentPage(1); }} className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400" />
                    </label>
                    <div className="relative shrink-0">
                        <button type="button" aria-expanded={showFilter} onClick={() => setShowFilter((visible) => !visible)} className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50"><SlidersHorizontal size={14} />Filter</button>
                        {showFilter && <div className="absolute right-0 top-11 z-50  rounded-lg border border-slate-200 bg-white p-3 shadow-xl">
                            <label className="mb-2 block text-xs font-semibold text-slate-700 whitespace-nowrap" htmlFor="bus-status-filter">Filter by status</label>
                            <select id="bus-status-filter" value={selectedStatus} onChange={(event) => { setSelectedStatus(event.target.value); setCurrentPage(1); setShowFilter(false); }} className="w-[200px] rounded-md border border-slate-200 p-2 text-xs outline-none">
                                {STATUS_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                            </select>
                        </div>}
                    </div>
                    <button type="button" onClick={handleExport} disabled={!buses.length} className="flex h-9 shrink-0 items-center gap-2 rounded-lg bg-cyan-700 px-3 text-xs font-medium text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-50"><Download size={14} />Export CSV</button>
                    <button type="button" onClick={() => { setSearchTerm(""); setSelectedStatus("all"); setCurrentPage(1); }} className="flex h-9 shrink-0 items-center gap-1 whitespace-nowrap px-1 text-xs font-medium text-cyan-700 transition hover:text-cyan-900">View All</button>
                </div>
            </div>

            <div className="w-full overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[950px] border-collapse text-left">
                    <thead className="bg-slate-50"><tr className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        <th className="px-5 py-3">Bus</th><th className="px-5 py-3">Registration</th><th className="px-5 py-3">Bus type</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Capacity</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-center">Actions</th>
                    </tr></thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-500">Loading buses…</td></tr>
                            : error ? <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-rose-700">{error}</td></tr>
                                : buses.length ? buses.map((bus, index) => <tr key={bus._id || bus.id || bus.registrationNumber || index} className="transition hover:bg-slate-50/70">
                                    <td className="px-5 py-3 flex gap-3">
                                        <img className="w-10 h-10 rounded-lg" src={komban} />
                                        <div>
                                            <p className="font-medium text-md text-gray-800">{bus.busName || "Unnamed bus"}</p>
                                            <p className="-mt-1 text-[11px] text-slate-500">{bus.operatorName || "Operator not specified"}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-3 text-xs font-medium text-slate-700">{bus.registrationNumber || "—"}</td>
                                    <td className="whitespace-nowrap px-5 py-3 text-xs capitalize text-slate-700">{String(bus.busType || "—").replaceAll("_", " ")}</td>
                                    <td className="whitespace-nowrap px-5 py-3 text-xs text-slate-700">{bus.category || "—"}</td>
                                    <td className="whitespace-nowrap px-5 py-3 text-xs text-slate-700">{bus.passengerCapacity ?? bus.totalSeats ?? "—"}</td>
                                    <td className="whitespace-nowrap px-5 py-3"><span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize ${statusClass(bus.status)}`}>{bus.status || "Unknown"}</span></td>
                                    <td className="px-5 py-2"><div className="flex items-center justify-center gap-2">
                                        <button type="button" title="View bus" aria-label={`View ${bus.busName || "bus"}`} className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600 transition hover:bg-slate-200"><Eye size={14} /></button>
                                        <button type="button" title="Edit bus" aria-label={`Edit ${bus.busName || "bus"}`} className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200 bg-emerald-100 text-emerald-700 transition hover:bg-emerald-200"><Pencil size={13} /></button>
                                        <button type="button" title="Delete bus" aria-label={`Delete ${bus.busName || "bus"}`} className="flex h-8 w-8 items-center justify-center rounded-full border border-rose-200 bg-rose-100 text-rose-600 transition hover:bg-rose-200"><Trash2 size={13} /></button>
                                    </div></td>
                                </tr>)
                                    : <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400">No buses found for these filters.</td></tr>}
                    </tbody>
                </table>
            </div>

            <div className="mt-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <p className="text-xs text-slate-500">Showing <span className="font-medium text-slate-700">{showing.from}–{showing.to}</span>{pagination.total !== null && <> of <span className="font-medium text-slate-700">{pagination.total}</span></>} buses</p>
                <div className="flex items-center gap-3">
                    <button type="button" disabled={currentPage <= 1 || isLoading} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={13} />Previous</button>
                    <span className="text-xs text-slate-600">Page {currentPage}{pagination.totalPages ? ` of ${pagination.totalPages}` : ""}</span>
                    <button type="button" disabled={!canGoNext || isLoading} onClick={() => setCurrentPage((page) => page + 1)} className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Next<ChevronRight size={13} /></button>
                </div>
            </div>
        </section>
    );
};

export default BusTable;
