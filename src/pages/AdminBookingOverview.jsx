import { useMemo, useState, useEffect, useCallback } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  BusFront,
  ChevronDown,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  IndianRupee,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  TicketCheck,
  WalletCards,
  XCircle,
} from "lucide-react";
import AdminNavbar from "../components/AdminNavbar.jsx";
import AdminBusDetailScreen from "./AdminBusDetailScreen.jsx";
import { useAuth } from "../context/AuthContext";

const fallbackBuses = [
  {
    _id: "6ae969b4c1c1cf1fb9b98a9e",
    agentId: {
      _id: "6ae969b3c1c1cf1fb9b98a8c",
      firstName: "Senthil",
      lastName: "Nathan",
      email: "kovaiexpress.agent@gmail.com",
      phone: "+919842188818",
      isEmailVerified: true,
      createdAt: "2026-11-03T04:57:23.386Z",
    },
    busName: "Kovai Express Royal Hybrid",
    operatorName: "Kovai Super Express",
    registrationNumber: "TN66AX4321",
    internalFleetCode: "KSE-AC-03",
    manufacturer: "BharatBenz",
    model: "1624 Sleeper Coach",
    manufacturingYear: 2025,
    ownershipType: "owned",
    busType: "seater_sleeper",
    category: "AC",
    deckConfiguration: "double",
    passengerCapacity: 32,
    seatCount: 16,
    berthCount: 16,
    totalSeats: 32,
    baseFare: 650,
    status: "pending",
    commission: null,
    adminRemarks: null,
    rating: 4.5,
    submittedAt: "2026-11-03T04:57:24.582Z",
    createdAt: "2026-11-03T04:57:24.583Z",
  },
];

const statusStyles = {
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
  suspended: "border-slate-300 bg-slate-100 text-slate-700",
};

export default function AdminBookingOverview({
  listType = "buses",
  detailView: DetailView,
}) {
  const { BASE_URL, TOKEN_KEY } = useAuth();
  const tokenKeyName = TOKEN_KEY || "exte_key";

  const [buses, setBuses] = useState(fallbackBuses);
  const [totalCount, setTotalCount] = useState(fallbackBuses.length);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedBusId, setSelectedBusId] = useState(null);

  const fetchBuses = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem(tokenKeyName);

    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: "20",
      });

      if (statusFilter && statusFilter !== "all") {
        queryParams.append("status", statusFilter);
      }
      if (search.trim()) {
        queryParams.append("search", search.trim());
      }

      const url = `${BASE_URL}/admin/buses?${queryParams.toString()}`;
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.buses)) {
          setBuses(data.buses);
          setTotalCount(data.total ?? data.buses.length);
        } else if (Array.isArray(data)) {
          setBuses(data);
          setTotalCount(data.length);
        }
      } else {
        console.warn("Failed to fetch /admin/buses, using fallback dataset");
      }
    } catch (err) {
      console.warn("Error fetching /admin/buses:", err);
    } finally {
      setLoading(false);
    }
  }, [BASE_URL, tokenKeyName, page, statusFilter, search]);

  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  // Statistics cards calculation
  const stats = useMemo(() => {
    const total = buses.length;
    const approved = buses.filter((b) => b.status?.toLowerCase() === "approved").length;
    const pending = buses.filter((b) => b.status?.toLowerCase() === "pending").length;
    const rejected = buses.filter((b) => b.status?.toLowerCase() === "rejected").length;
    const suspended = buses.filter((b) => b.status?.toLowerCase() === "suspended").length;
    return { total, approved, pending, rejected, suspended };
  }, [buses]);

  const handleExportCSV = () => {
    const columns = [
      "Bus Name",
      "Registration Number",
      "Operator Name",
      "Bus Type",
      "Category",
      "Deck",
      "Capacity",
      "Base Fare",
      "Status",
    ];
    const rows = buses.map((b) => [
      b.busName || "",
      b.registrationNumber || "",
      b.operatorName || "",
      b.busType || "",
      b.category || "",
      b.deckConfiguration || "",
      b.passengerCapacity || b.totalSeats || "",
      b.baseFare ? `₹${b.baseFare}` : "",
      b.status || "",
    ]);

    const csv = [columns, ...rows]
      .map((line) => line.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `admin-buses-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (selectedBusId) {
    const BusDetail = DetailView || AdminBusDetailScreen;
    return (
      <BusDetail
        busId={selectedBusId}
        onBack={() => {
          setSelectedBusId(null);
          fetchBuses();
        }}
        onStatusChange={() => {
          fetchBuses();
        }}
        Navbar={AdminNavbar}
      />
    );
    console.log("hai")
  }

  return (
    <div className="min-h-screen bg-[#f5f8f9] text-[#172526]">
      <AdminNavbar />

      <main className="mx-auto w-full max-w-[1600px] px-4 pb-8 pt-5 sm:px-6 lg:px-8">
        {/* Header section */}
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#078A97] text-white shadow-sm">
                <BusFront size={18} />
              </span>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-[#172526] sm:text-2xl">
                  Bus List Overview
                </h1>
                <p className="mt-0.5 text-xs text-[#688080]">
                  Inspect fleet specifications, compliance documents, and review vehicle approvals
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchBuses()}
              disabled={loading}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#d6e3e6] bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw size={13} className={loading ? "animate-spin text-[#078A97]" : ""} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#078A97] px-3.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#067681]"
            >
              <ArrowDownToLine size={13} /> Export CSV
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <section
          aria-label="Bus summary"
          className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4"
        >
          <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                TOTAL BUSES
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-[#078A97]">
                <BusFront size={15} />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stats.total}</p>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                APPROVED BUSES
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck size={15} />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-600">{stats.approved}</p>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                PENDING BUSES
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Clock size={15} />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-amber-600">{stats.pending}</p>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                REJECTED / SUSPENDED
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                <ShieldAlert size={15} />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-rose-600">
              {stats.rejected + stats.suspended}
            </p>
          </div>
        </section>

        {/* Table Section */}
        <section className="overflow-hidden rounded-2xl border border-[#dbe6e9] bg-white shadow-sm">
          {/* Table Header controls */}
          <div className="flex flex-col gap-3 border-b border-[#e7eff1] px-4 py-3.5 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#172526]">Bus List</h2>
              <p className="text-[11px] text-[#657d84]">
                Showing {buses.length} registered vehicles across all operators
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search input */}
              <div className="relative min-w-[240px] flex-1 sm:w-72 lg:flex-none">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search bus name, registration, operator..."
                  className="h-9 w-full rounded-xl border border-[#dce7e9] bg-[#f8fafb] pl-9 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#078A97] focus:bg-white focus:ring-2 focus:ring-teal-50"
                />
              </div>

              {/* Status filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setFilterOpen((o) => !o)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#dce7e9] bg-[#f8fafb] px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <Filter size={13} className="text-[#078A97]" />
                  <span className="capitalize">
                    {statusFilter === "all" ? "All Statuses" : statusFilter}
                  </span>
                  <ChevronDown size={12} />
                </button>

                {filterOpen && (
                  <div className="absolute right-0 top-11 z-20 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                    {["all", "pending", "approved", "rejected", "suspended"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          setStatusFilter(st);
                          setFilterOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium capitalize transition ${
                          statusFilter === st
                            ? "bg-teal-50 font-bold text-[#078A97]"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span>{st === "all" ? "All Statuses" : st}</span>
                        {statusFilter === st && <CheckCircle2 size={12} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-[#f4f8f9] text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Bus Name &amp; Operator</th>
                  <th className="px-4 py-3">Registration No</th>
                  <th className="px-4 py-3">Type &amp; Deck</th>
                  <th className="px-4 py-3">Capacity</th>
                  <th className="px-4 py-3">Base Fare</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf3f5] text-xs">
                {buses.map((bus) => {
                  const statusKey = (bus.status || "pending").toLowerCase();
                  const badgeClass =
                    statusStyles[statusKey] || statusStyles.pending;
                  const regNo = bus.registrationNumber || "N/A";
                  const busTitle = bus.busName || "Unnamed Bus";
                  const operator =
                    bus.operatorName || bus.agentId?.firstName
                      ? `${bus.agentId?.firstName || ""} ${bus.agentId?.lastName || ""}`.trim()
                      : "Operator";

                  return (
                    <tr
                      key={bus._id}
                      className="group transition-colors hover:bg-[#f8fbfb]"
                    >
                      {/* Bus Name & Operator */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[13px] font-bold text-[#078A97] border border-teal-100/80">
                            <BusFront size={16} />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-800 max-w-[280px]">
                              {busTitle}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[240px]">
                              {operator} · {bus.model || bus.manufacturer || "Coach"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Registration No */}
                      <td className="px-4 py-3.5">
                        <span className="inline-block rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] font-bold text-slate-700">
                          {regNo}
                        </span>
                        {bus.internalFleetCode && (
                          <span className="block text-[9.5px] text-slate-400 mt-0.5">
                            Fleet: {bus.internalFleetCode}
                          </span>
                        )}
                      </td>

                      {/* Type & Deck */}
                      <td className="px-4 py-3.5 text-slate-700">
                        <span className="font-medium capitalize">
                          {bus.busType?.replace("_", " ") || "Standard"}
                        </span>
                        <span className="block text-[10px] text-slate-400 capitalize">
                          {bus.deckConfiguration || "Single"} Deck · {bus.category || "AC"}
                        </span>
                      </td>

                      {/* Capacity */}
                      <td className="px-4 py-3.5 text-slate-700">
                        <span className="font-semibold text-slate-800">
                          {bus.passengerCapacity || bus.totalSeats || 0} Seats
                        </span>
                        {(bus.seatCount || bus.berthCount) && (
                          <span className="block text-[9.5px] text-slate-400">
                            {bus.seatCount || 0}S + {bus.berthCount || 0}B
                          </span>
                        )}
                      </td>

                      {/* Base Fare */}
                      <td className="px-4 py-3.5 font-semibold text-slate-800">
                        {bus.baseFare ? `₹${bus.baseFare}` : "—"}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider ${badgeClass}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              statusKey === "approved"
                                ? "bg-emerald-500"
                                : statusKey === "pending"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                          />
                          {bus.status || "Pending"}
                        </span>
                      </td>

                      {/* View Action */}
                      <td className="px-4 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedBusId(bus._id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#d6e3e6] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#078A97] shadow-2xs transition hover:border-[#078A97] hover:bg-teal-50"
                          title="View bus details and review"
                        >
                          <Eye size={13} />
                          <span>View Detail</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {buses.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                      <BusFront size={32} className="mx-auto mb-2 text-slate-300" />
                      <p className="font-semibold text-slate-600 text-sm">
                        No buses found
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        No vehicles found matching current search or status filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
