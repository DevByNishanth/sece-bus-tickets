import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Building2,
  BusFront,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  LayoutGrid,
  List,
  MapPin,
  RefreshCw,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Ticket,
  Users,
  X,
  XCircle,
} from "lucide-react";
import AdminNavbar from "../components/AdminNavbar.jsx";
import { useAuth } from "../context/AuthContext";

// Helper to get initials
function getInitials(name) {
  if (!name) return "BK";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// Status badge pill styling matching screenshot
function getStatusBadge(status, displayStatus) {
  const effective = (displayStatus || status || "").toLowerCase();

  if (effective.includes("sched") || effective === "confirmed") {
    return {
      label: "Scheduled",
      dot: "bg-emerald-500",
      pill: "bg-emerald-50 text-emerald-700 border-emerald-100",
    };
  }
  if (effective.includes("progress")) {
    return {
      label: "In Progress",
      dot: "bg-indigo-500",
      pill: "bg-indigo-50 text-indigo-700 border-indigo-100",
    };
  }
  if (effective.includes("draft") || effective.includes("pending_payment")) {
    return {
      label: "Draft",
      dot: "bg-slate-400",
      pill: "bg-slate-100 text-slate-600 border-slate-200",
    };
  }
  if (effective.includes("reject") || effective === "cancelled" || effective === "failed") {
    return {
      label: "Rejected",
      dot: "bg-rose-500",
      pill: "bg-rose-50 text-rose-600 border-rose-100",
    };
  }
  // Pending default
  return {
    label: "Pending",
    dot: "bg-amber-500",
    pill: "bg-amber-50 text-amber-700 border-amber-100",
  };
}

// Format time range
function formatTimeRange(dep, arr) {
  const dTime = dep
    ? new Date(dep).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
    : "22:00";
  const aTime = arr
    ? new Date(arr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
    : "05:45";
  return `${dTime} - ${aTime} +1`;
}

export default function AdminBookingsPage() {
  const { BASE_URL, TOKEN_KEY } = useAuth();
  const tokenKeyName = TOKEN_KEY || "exte_key";

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [agencyFilter, setAgencyFilter] = useState("all");
  const [busFilter, setBusFilter] = useState("all");

  // Options for Agency & Bus dropdowns
  const [agencies, setAgencies] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [isGridView, setIsGridView] = useState(true); // Toggle between Grid & Table
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null); // Detail modal
  const pageSize = 12;

  // 1. Fetch Agencies list for Agency filter
  useEffect(() => {
    async function loadAgencies() {
      try {
        const token = localStorage.getItem(tokenKeyName);
        const res = await fetch(`${BASE_URL}/admin/agents?limit=100`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.agents)) {
            setAgencies(data.agents);
          }
        }
      } catch {
        // Ignore
      }
    }
    loadAgencies();
  }, [BASE_URL, tokenKeyName]);

  // 2. Fetch Buses list based on selected Agency
  useEffect(() => {
    async function loadBuses() {
      try {
        setLoadingOptions(true);
        const token = localStorage.getItem(tokenKeyName);
        const queryParams = new URLSearchParams({ limit: "100" });

        // If an agency is selected, filter buses only for that agency
        if (agencyFilter !== "all") {
          // Check if selected agency has userId or _id
          const selectedAgencyObj = agencies.find(
            (a) => a._id === agencyFilter || a.userId?._id === agencyFilter
          );
          const agentId = selectedAgencyObj?.userId?._id || selectedAgencyObj?.userId || agencyFilter;
          queryParams.append("agentId", agentId);
        }

        const res = await fetch(`${BASE_URL}/admin/buses?${queryParams.toString()}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.buses)) {
            setBuses(data.buses);
          } else {
            setBuses([]);
          }
        } else {
          setBuses([]);
        }
      } catch {
        setBuses([]);
      } finally {
        setLoadingOptions(false);
      }
    }

    loadBuses();
  }, [BASE_URL, tokenKeyName, agencyFilter, agencies]);

  // Fetch bookings from backend API
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem(tokenKeyName);

    try {
      const queryParams = new URLSearchParams({
        page: "1",
        limit: "100",
      });
      if (statusFilter !== "all") {
        queryParams.append("status", statusFilter);
      }
      if (agencyFilter !== "all") {
        queryParams.append("agencyId", agencyFilter);
      }
      if (busFilter !== "all") {
        queryParams.append("busId", busFilter);
      }
      if (search.trim()) {
        queryParams.append("search", search.trim());
      }

      const res = await fetch(`${BASE_URL}/admin/bookings?${queryParams.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        } else {
          setBookings([]);
        }
      } else {
        setBookings([]);
      }
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [BASE_URL, tokenKeyName, statusFilter, agencyFilter, busFilter, search]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Client-side filtering
  const filteredBookings = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      const passengerName = (
        b.passengerDetails?.[0]?.name ||
        b.contactDetails?.name ||
        `${b.user?.firstName || ""} ${b.user?.lastName || ""}`
      ).toLowerCase();
      const pnr = (b.bookingNumber || "").toLowerCase();
      const bus = (b.busName || "").toLowerCase();
      const routeStr = `${b.source || ""} ${b.destination || ""}`.toLowerCase();

      const matchesSearch =
        !q ||
        passengerName.includes(q) ||
        pnr.includes(q) ||
        bus.includes(q) ||
        routeStr.includes(q);

      const rawStatus = (b.status || "").toLowerCase();
      const matchesStatus =
        statusFilter === "all" ||
        rawStatus === statusFilter.toLowerCase() ||
        (statusFilter === "scheduled" && (rawStatus === "confirmed" || b.displayStatus === "Scheduled")) ||
        (statusFilter === "pending" && (rawStatus === "pending" || b.displayStatus === "Pending")) ||
        (statusFilter === "rejected" && (rawStatus === "cancelled" || rawStatus === "failed" || b.displayStatus === "Rejected"));

      // Agency matching
      const matchesAgency =
        agencyFilter === "all" ||
        b.busId?.agentId?._id === agencyFilter ||
        b.busId?.agentId === agencyFilter;

      // Bus matching
      const matchesBus =
        busFilter === "all" ||
        b.busId?._id === busFilter ||
        b.busId === busFilter;

      return matchesSearch && matchesStatus && matchesAgency && matchesBus;
    });
  }, [bookings, search, statusFilter, agencyFilter, busFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleBookings = filteredBookings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-[#f5f8f9] text-[#172526]">
      <AdminNavbar />

      <main className="mx-auto w-full max-w-[1600px] px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        {/* Page Header matching Figma screenshot */}
        <div className="mb-5">
          <h1 className="text-xl font-bold tracking-tight text-[#172526] sm:text-2xl">
            Bookings
          </h1>
          <p className="mt-0.5 text-xs text-[#688080]">
            Review and manage passenger bookings.
          </p>
        </div>

        {/* Toolbar: Search input, status filter, and Grid/Table Switch */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2.5 ">
            {/* Search Bar matching screenshot */}
            <div className="relative flex-1 min-w-[260px] max-w-md">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by passenger name or route..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#078A97] focus:ring-1 focus:ring-[#078A97]"
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-[#078A97]"
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled / Confirmed</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected / Cancelled</option>
              </select>
              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {/* Travel Agency Filter Dropdown */}
            <div className="relative">
              <select
                value={agencyFilter}
                onChange={(e) => {
                  setAgencyFilter(e.target.value);
                  setBusFilter("all"); // Reset bus filter when agency changes
                  setPage(1);
                }}
                className="h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-[#078A97] max-w-[180px] truncate"
              >
                <option value="all">All Travel Agencies</option>
                {agencies.map((agency) => {
                  const name =
                    agency.registeredBusinessName ||
                    agency.operatorDisplayName ||
                    `${agency.userId?.firstName || ""} ${agency.userId?.lastName || ""}`.trim() ||
                    "Unnamed Agency";
                  // Pass userId._id if present, else agency._id
                  const val = agency.userId?._id || agency.userId || agency._id;
                  return (
                    <option key={agency._id} value={val}>
                      {name}
                    </option>
                  );
                })}
              </select>
              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {/* Bus Filter Dropdown (Filtered by selected Agency) */}
            <div className="relative">
              <select
                value={busFilter}
                onChange={(e) => {
                  setBusFilter(e.target.value);
                  setPage(1);
                }}
                className="h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-[#078A97] max-w-[180px] truncate"
              >
                <option value="all">
                  {agencyFilter !== "all" ? "All Agency Buses" : "All Buses"}
                </option>
                {buses.map((bus) => (
                  <option key={bus._id} value={bus._id}>
                    {bus.busName} ({bus.registrationNumber})
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {/* Reset Filters Button */}
            {(search || statusFilter !== "all" || agencyFilter !== "all" || busFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setAgencyFilter("all");
                  setBusFilter("all");
                  setPage(1);
                }}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                title="Reset all filters"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}

            {/* Refresh */}
            <button
              type="button"
              onClick={fetchBookings}
              disabled={loading}
              className="inline-flex h-10 px-3.5 items-center justify-center rounded-xl gap-1.5 text-xs font-semibold border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 disabled:opacity-60"
              title="Refresh Bookings"
            >
              <RefreshCw size={13} className={loading ? "animate-spin text-[#078A97]" : ""} /> <span>Refresh</span>
            </button>
          </div>

          {/* Grid View / Table View Toggle Switch */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              {isGridView ? <LayoutGrid size={14} /> : <List size={14} />}
              <span>{isGridView ? "Grid View" : "Table View"}</span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isGridView}
              onClick={() => setIsGridView((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isGridView ? "bg-[#078A97]" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isGridView ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* --- 1. GRID VIEW (Matching Uploaded Image) --- */}
        {isGridView ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleBookings.map((b) => {
              const pName =
                b.passengerDetails?.[0]?.name ||
                b.contactDetails?.name ||
                `${b.user?.firstName || ""} ${b.user?.lastName || ""}` ||
                "Passenger";
              const initials = getInitials(pName);
              const pnr = b.bookingNumber || "BG240890";
              const badge = getStatusBadge(b.status, b.displayStatus);
              const busName = b.busName || "Super Fast Exp";
              const origin = b.source || "Bangalore";
              const dest = b.destination || "Coorg";
              const dateStr = b.journeyDate
                ? new Date(b.journeyDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "12 Feb 2026";
              const timeStr = formatTimeRange(b.departureTime, b.arrivalTime);
              const fare = b.totalAmount || 290;
              const distance = b.distanceKm || 350;

              return (
                <div
                  key={b._id}
                  onClick={() => setSelectedBooking(b)}
                  className="group relative cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition hover:border-[#078A97]/40 hover:shadow-md"
                >
                  {/* Card Header: Initials Avatar, Name & PNR, Status Pill */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {/* Teal Avatar */}
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0e4e55] text-xs font-bold text-white shadow-2xs">
                        {initials}
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate text-xs font-bold text-slate-900 group-hover:text-[#078A97] transition-colors">
                          {pName}
                        </h3>
                        <p className="text-[11px] font-medium text-slate-400">
                          PNR: #{pnr}
                        </p>
                      </div>
                    </div>

                    {/* Status Pill matching screenshot */}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10.5px] font-semibold ${badge.pill}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                      {badge.label}
                    </span>
                  </div>

                  {/* Bus Name & Distance */}
                  <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="truncate">{busName}</span>
                    <span className="shrink-0">~ {distance} km</span>
                  </div>

                  {/* Route Track: Origin to Destination */}
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      <span>Origin</span>
                      <span>Destination</span>
                    </div>

                    <div className="relative mt-1 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                        <MapPin size={12} className="text-slate-500" />
                        <span>{origin}</span>
                      </div>

                      {/* Connecting Line */}
                      <div className="mx-2 h-0.5 flex-1 bg-slate-100" />

                      <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                        <MapPin size={12} className="text-slate-500" />
                        <span>{dest}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Date, Time & Total Fare */}
                  <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3 text-xs">
                    <div className="space-y-0.5 text-slate-500">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium">
                        <Calendar size={12} className="text-slate-400" />
                        <span>{dateStr}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400">
                        <Clock size={11} className="text-slate-400" />
                        <span>{timeStr}</span>
                      </div>
                    </div>

                    {/* Fare */}
                    <div className="text-right">
                      <span className="text-base font-extrabold text-slate-900">
                        ₹ {fare}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* --- 2. TABLE VIEW --- */
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[840px] border-collapse text-left">
                <thead className="bg-[#f5f8f9] text-[9.5px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5">PNR / Ticket</th>
                    <th className="px-4 py-3.5">Passenger</th>
                    <th className="px-4 py-3.5">Bus &amp; Route</th>
                    <th className="px-4 py-3.5">Journey Date &amp; Time</th>
                    <th className="px-4 py-3.5">Seats</th>
                    <th className="px-4 py-3.5">Fare</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {visibleBookings.map((b) => {
                    const pName =
                      b.passengerDetails?.[0]?.name ||
                      b.contactDetails?.name ||
                      `${b.user?.firstName || ""} ${b.user?.lastName || ""}` ||
                      "Passenger";
                    const badge = getStatusBadge(b.status, b.displayStatus);
                    const origin = b.source || "Bangalore";
                    const dest = b.destination || "Coorg";
                    const dateStr = b.journeyDate
                      ? new Date(b.journeyDate).toLocaleDateString()
                      : "12 Feb 2026";

                    return (
                      <tr
                        key={b._id}
                        className="group transition-colors hover:bg-slate-50/70"
                      >
                        <td className="whitespace-nowrap px-5 py-3 font-semibold text-[#078A97]">
                          #{b.bookingNumber}
                          {b.ticketNumber && (
                            <span className="block text-[10px] text-slate-400 font-normal">
                              {b.ticketNumber}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-900 block">
                            {pName}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {b.contactDetails?.phone || b.user?.phone || "—"}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className="font-medium text-slate-800 block">
                            {b.busName}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            {origin} → {dest}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                          <span>{dateStr}</span>
                          <span className="block text-[10.5px] text-slate-400">
                            {formatTimeRange(b.departureTime, b.arrivalTime)}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-4 py-3">
                          <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            {Array.isArray(b.seats) ? b.seats.join(", ") : "—"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 font-bold text-slate-900">
                          ₹ {b.totalAmount || 0}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10.5px] font-semibold ${badge.pill}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                            {badge.label}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedBooking(b)}
                            title="View Booking Details"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-[#078A97] hover:text-[#078A97]"
                          >
                            <Eye size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {visibleBookings.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-5 py-10 text-center text-sm text-slate-500">
                        No bookings match your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty state for grid */}
        {isGridView && visibleBookings.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            <Ticket size={32} className="mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-semibold">No bookings found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search query or status filter.
            </p>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="mt-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-[11px] text-slate-500">
            Showing{" "}
            <strong className="text-slate-700">
              {filteredBookings.length ? (currentPage - 1) * pageSize + 1 : 0}–
              {Math.min(currentPage * pageSize, filteredBookings.length)}
            </strong>{" "}
            of {filteredBookings.length} bookings
          </p>
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] text-slate-600 disabled:opacity-40"
            >
              <ChevronLeft size={13} /> Previous
            </button>
            <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#078A97] px-2 text-xs font-bold text-white">
              {currentPage}
            </span>
            <span className="px-1 text-xs text-slate-400">of {totalPages}</span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] text-slate-600 disabled:opacity-40"
            >
              Next <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </main>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#078A97]">
                  BOOKING DETAILS
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  PNR #{selectedBooking.bookingNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-2.5">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                    Bus Service
                  </span>
                  <span className="font-bold text-slate-800 block mt-0.5">
                    {selectedBooking.busName}
                  </span>
                  <span className="text-[10.5px] text-slate-500 font-mono">
                    {selectedBooking.busNumber || "N/A"}
                  </span>
                </div>

                <div className="rounded-xl bg-slate-50 p-2.5">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                    Route &amp; Distance
                  </span>
                  <span className="font-bold text-slate-800 block mt-0.5">
                    {selectedBooking.source} → {selectedBooking.destination}
                  </span>
                  <span className="text-[10.5px] text-slate-500">
                    ~ {selectedBooking.distanceKm || 350} km
                  </span>
                </div>
              </div>

              {/* Passengers */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Passengers &amp; Allocated Seats
                </span>
                <div className="space-y-1.5">
                  {selectedBooking.passengerDetails?.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border border-slate-100 p-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-50 text-[10px] font-bold text-[#078A97]">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-slate-800">{p.name}</span>
                        <span className="text-slate-400 text-[10.5px]">
                          ({p.gender}, {p.age} yrs)
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#078A97] bg-teal-50 px-2 py-0.5 rounded">
                        Seat {p.seatNumber}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact Person</span>
                  <span className="font-semibold text-slate-800">
                    {selectedBooking.contactDetails?.name || selectedBooking.user?.firstName || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone</span>
                  <span className="font-medium text-slate-700">
                    {selectedBooking.contactDetails?.phone || selectedBooking.user?.phone || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email</span>
                  <span className="font-medium text-slate-700">
                    {selectedBooking.contactDetails?.email || selectedBooking.user?.email || "N/A"}
                  </span>
                </div>
              </div>

              {/* Fare Summary */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                    Payment Status
                  </span>
                  <span className="font-bold text-emerald-700 capitalize">
                    {selectedBooking.paymentStatus || "PAID"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                    Total Fare
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    ₹ {selectedBooking.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-3 text-right">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-xl bg-[#078A97] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#06747f]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

