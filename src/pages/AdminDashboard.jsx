import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import TravelProfileDetailView from "./TravelProfileDetailView.jsx";
import AdminNavbar from "../components/AdminNavbar.jsx";
import { useAuth } from "../context/AuthContext";
import {
  ArrowDownToLine,
  ArrowRight,
  Building2,
  BusFront,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Eye,
  Filter,
  Mail,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";

// Fallback travel agents in case backend is loading / empty
const fallbackAgents = [
  {
    _id: "6ae969b3c1c1cf1fb9b98a8d",
    userId: {
      _id: "6ae969b3c1c1cf1fb9b98a8c",
      firstName: "Senthil",
      lastName: "Nathan",
      email: "kovaiexpress.agent@gmail.com",
      phone: "+919842188818",
      isEmailVerified: true,
      createdAt: "2026-11-03T04:57:23.386Z",
    },
    businessType: "Private Limited",
    registeredBusinessName: "Kovai Super Express Travels Private Limited",
    operatorDisplayName: "Kovai Super Express",
    primaryContactPerson: "Senthil Nathan",
    businessMobile: "+919842188818",
    businessEmail: "kovaiexpress.agent@gmail.com",
    registrationNumber: "CIN-U60221TZ2021PTC028456",
    status: "approved",
    createdAt: "2026-11-03T04:57:23.515Z",
  },
];

const statusBadgeStyles = {
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
  suspended: "border-slate-200 bg-slate-50 text-slate-700",
};

function exportAgentsToCsv(agents) {
  const headers = [
    "Registered Business Name",
    "Registration Number",
    "Business Email",
    "Business Mobile",
    "Business Type",
    "Status",
    "Registered Date",
  ];
  const rows = agents.map((agent) => [
    agent.registeredBusinessName || agent.operatorDisplayName || "N/A",
    agent.registrationNumber || "N/A",
    agent.businessEmail || agent.userId?.email || "N/A",
    agent.businessMobile || agent.userId?.phone || "N/A",
    agent.businessType || "N/A",
    (agent.status || "pending").toUpperCase(),
    agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : "N/A",
  ]);

  const csv = [headers, ...rows]
    .map((r) => r.map((val) => `"${String(val).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `travel-registrations-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function RevenueChart() {
  return (
    <div className="relative mt-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[168px] flex-col justify-between">
        {[0, 1, 2, 3].map((line) => (
          <div key={line} className="border-t border-dashed border-slate-100" />
        ))}
      </div>
      <svg
        viewBox="0 0 600 190"
        role="img"
        aria-label="Revenue and bookings trend chart"
        className="relative z-10 h-[180px] w-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0d8792" stopOpacity=".22" />
            <stop offset="100%" stopColor="#0d8792" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 116 C38 90 60 70 102 62 S168 65 205 92 S260 115 302 57 S365 52 405 70 S485 91 530 79 S575 61 600 48 L600 165 L0 165 Z"
          fill="url(#revenue-fill)"
        />
        <path
          d="M0 116 C38 90 60 70 102 62 S168 65 205 92 S260 115 302 57 S365 52 405 70 S485 91 530 79 S575 61 600 48"
          fill="none"
          stroke="#0d8792"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0 136 C42 151 69 143 105 122 S175 110 210 116 S266 127 306 105 S355 82 390 99 S450 155 490 147 S560 115 600 73"
          fill="none"
          stroke="#7779ff"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="375"
          y1="20"
          x2="375"
          y2="165"
          stroke="#70c2c7"
          strokeDasharray="4 5"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx="375" cy="72" r="5" fill="#0d8792" stroke="white" strokeWidth="3" />
        <circle cx="375" cy="96" r="5" fill="#7779ff" stroke="white" strokeWidth="3" />
        <line
          x1="0"
          y1="165"
          x2="600"
          y2="165"
          stroke="#e4ecee"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="mt-2 flex justify-between text-[10px] font-medium text-slate-400 sm:text-[11px]">
        {["Sep 20", "Sep 25", "Sep 30", "Oct 05", "Oct 10", "Oct 14", "Oct 18", "Today"].map(
          (date) => (
            <span
              key={date}
              className={date === "Oct 14" ? "rounded-full bg-cyan-50 px-2 py-0.5 text-teal-700" : ""}
            >
              {date}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

function TravelStatusChart({ stats }) {
  const circumference = 2 * Math.PI * 43;
  
  const total = stats?.total ?? 67;
  const approved = stats?.approved ?? 52;
  const pending = stats?.pending ?? 9;
  const rejected = stats?.rejected ?? 6;

  const totalSum = (approved + pending + rejected) || 1;

  const segments = [
    {
      label: "Approved",
      count: approved.toLocaleString(),
      percent: `${((approved / totalSum) * 100).toFixed(1)}%`,
      value: (approved / totalSum) * 100,
      color: "#0d8792",
    },
    {
      label: "Pending",
      count: pending.toLocaleString(),
      percent: `${((pending / totalSum) * 100).toFixed(1)}%`,
      value: (pending / totalSum) * 100,
      color: "#f4a43a",
    },
    {
      label: "Rejected",
      count: rejected.toLocaleString(),
      percent: `${((rejected / totalSum) * 100).toFixed(1)}%`,
      value: (rejected / totalSum) * 100,
      color: "#ff7858",
    },
  ];

  let offset = 0;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 120" className="mt-2 h-36 w-36" role="img" aria-label="Travel status breakdown">
        <circle cx="60" cy="60" r="43" fill="none" stroke="#edf3f4" strokeWidth="12" />
        {segments.map((segment) => {
          const length = (segment.value / 100) * circumference;
          const circle = (
            <circle
              key={segment.label}
              cx="60"
              cy="60"
              r="43"
              fill="none"
              stroke={segment.color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 60 60)"
            />
          );
          offset += length;
          return circle;
        })}
        <text x="60" y="58" textAnchor="middle" className="fill-slate-800 text-[15px] font-bold">
          {total}
        </text>
        <text x="60" y="72" textAnchor="middle" className="fill-slate-400 text-[7px]">
          Total Travels
        </text>
      </svg>
      <div className="mt-2 w-full space-y-3 border-t border-slate-100 pt-3">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center justify-between gap-2 text-[11px]">
            <span className="flex items-center gap-2 font-medium text-slate-600">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: segment.color }} />
              {segment.label}
            </span>
            <span className="flex items-center gap-2 font-semibold text-slate-700">
              {segment.count}
              <span className="w-10 text-right font-normal text-slate-400">{segment.percent}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { BASE_URL, TOKEN_KEY } = useAuth();
  const tokenKeyName = TOKEN_KEY || "exte_key";

  // Dashboard stats from backend API
  const [statsData, setStatsData] = useState({
    totalTravelCompanies: 67,
    totalBuses: 21,
    grossCommissionValue: "₹48.6L",
    travelStatus: {
      total: 67,
      approved: 52,
      pending: 9,
      rejected: 6,
    },
  });

  // Agents list from backend API
  const [agents, setAgents] = useState(fallbackAgents);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const pageSize = 5;

  // 1. Fetch Dashboard Stats from backend API: GET /api/admin/dashboard/stats
  const fetchDashboardStats = useCallback(async () => {
    try {
      const token = localStorage.getItem(tokenKeyName);
      const res = await fetch(`${BASE_URL}/admin/dashboard/stats`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.stats) {
          setStatsData(data.stats);
        }
      }
    } catch {
      // Keep initial/fallback stats
    }
  }, [BASE_URL, tokenKeyName]);

  // 2. Fetch Recent Travel Agents from backend API: GET /api/admin/agents
  const fetchTravelAgents = useCallback(async () => {
    setLoadingAgents(true);
    try {
      const token = localStorage.getItem(tokenKeyName);
      const res = await fetch(`${BASE_URL}/admin/agents?page=1&limit=50`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.agents)) {
          setAgents(data.agents);
        }
      }
    } catch {
      // Keep fallbacks
    } finally {
      setLoadingAgents(false);
    }
  }, [BASE_URL, tokenKeyName]);

  useEffect(() => {
    fetchDashboardStats();
    fetchTravelAgents();
  }, [fetchDashboardStats, fetchTravelAgents]);

  // Filter travel agents
  const filteredAgents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return agents.filter((agent) => {
      const bName = (agent.registeredBusinessName || agent.operatorDisplayName || "").toLowerCase();
      const regNo = (agent.registrationNumber || "").toLowerCase();
      const email = (agent.businessEmail || agent.userId?.email || "").toLowerCase();
      const phone = (agent.businessMobile || agent.userId?.phone || "").toLowerCase();

      const matchesSearch = !q || bName.includes(q) || regNo.includes(q) || email.includes(q) || phone.includes(q);
      const status = (agent.status || "pending").toLowerCase();
      const matchesStatus = statusFilter === "all" || status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [agents, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredAgents.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleAgents = filteredAgents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function updateSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function updateStatus(value) {
    setStatusFilter(value);
    setPage(1);
  }

  // Handle agent detail view transition
  if (selectedAgent) {
    return (
      <TravelProfileDetailView
        Navbar={AdminNavbar}
        agentId={selectedAgent._id}
        onBack={() => {
          setSelectedAgent(null);
          fetchTravelAgents();
          fetchDashboardStats();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f8] text-slate-800">
      <AdminNavbar />

      <main className="mx-auto w-full max-w-[1500px] px-3 pb-8 pt-5 sm:px-5 lg:px-6">
        <div className="mb-4">
          <h1 className="text-xl font-semibold tracking-tight text-[#233235] sm:text-2xl">
            Admin Dashboard Overview
          </h1>
          <p className="mt-1 text-xs text-[#718586] sm:text-sm">
            Live bus tracking, intercity routes, and passenger booking engine
          </p>
        </div>

        {/* 1st 2 cards from API: Total Travel Companies & Total Buses */}
        <section aria-label="Dashboard summary" className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <article className="rounded-xl border border-slate-100 bg-white p-4 shadow-[0_3px_12px_rgba(27,54,54,0.06)] sm:min-h-[90px] sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold tracking-wide text-[#718582]">TOTAL TRAVEL COMPANIES</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
                <Users size={15} aria-hidden="true" />
              </span>
            </div>
            <p className="mt-1 text-2xl font-semibold leading-none text-[#273537]">
              {statsData.totalTravelCompanies}
            </p>
            <p className="mt-1 text-[10px] text-[#839394]">Registered</p>
          </article>

          <article className="rounded-xl border border-slate-100 bg-white p-4 shadow-[0_3px_12px_rgba(27,54,54,0.06)] sm:min-h-[90px] sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold tracking-wide text-[#718582]">TOTAL BUSES</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <BusFront size={15} aria-hidden="true" />
              </span>
            </div>
            <p className="mt-1 text-2xl font-semibold leading-none text-[#273537]">
              {statsData.totalBuses}
            </p>
            <p className="mt-1 text-[10px] text-[#839394]">Registered</p>
          </article>

          <article className="rounded-xl border border-slate-100 bg-white p-4 shadow-[0_3px_12px_rgba(27,54,54,0.06)] sm:min-h-[90px] sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold tracking-wide text-[#718582]">GROSS COMMISSION VALUE</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Wallet size={15} aria-hidden="true" />
              </span>
            </div>
            <p className="mt-1 text-2xl font-semibold leading-none text-[#273537]">
              {statsData.grossCommissionValue || "₹48.6L"}
            </p>
            <p className="mt-1 text-[10px] text-[#839394]">Today</p>
          </article>
        </section>

        {/* Analytics Section: Revenue & Travel Status from API */}
        <section aria-label="Travel analytics" className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-[2fr_1fr]">
          <article className="rounded-xl border border-[#e7edef] bg-white p-4 shadow-[0_3px_12px_rgba(27,54,54,0.05)] sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Revenue &amp; Booking Trends</h2>
                <p className="mt-0.5 text-[10px] text-slate-500">Daily gross ticket collections vs total reservations</p>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-medium text-slate-600">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#0d8792]" />Revenue (₹)</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#7779ff]" />Bookings</span>
              </div>
            </div>
            <RevenueChart />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#0d8792]" />Highest Revenue: <strong className="text-slate-700">₹1.84L on Oct 14</strong></span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#7779ff]" />Average Daily Bookings: <strong className="text-slate-700">428 tickets</strong></span>
            </div>
          </article>

          {/* Travel Status Chart connected to API counts */}
          <article className="rounded-xl border border-[#e7edef] bg-white p-4 shadow-[0_3px_12px_rgba(27,54,54,0.05)] sm:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">Travels Status</h2>
              <button
                type="button"
                onClick={fetchDashboardStats}
                title="Refresh stats"
                className="rounded-md p-1 text-slate-400 hover:bg-slate-50 hover:text-teal-700"
              >
                <RefreshCw size={13} />
              </button>
            </div>
            <TravelStatusChart stats={statsData.travelStatus} />
          </article>
        </section>

        {/* Recent Travel Approval: Shows Travel Registrations with fields matching Travels List */}
        <section className="overflow-hidden rounded-xl border border-[#e7edef] bg-white shadow-[0_3px_12px_rgba(27,54,54,0.05)]">
          <div className="flex flex-col gap-3 px-4 pb-3 pt-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Recent Travel Approval</h2>
              <p className="mt-0.5 text-[10px] text-slate-500 sm:text-[11px]">
                Travel agency partner registrations, business verifications &amp; operating status
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="relative min-w-40 flex-1 sm:flex-none">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => updateSearch(event.target.value)}
                  placeholder="Search name, CIN, email..."
                  className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-2 text-[10px] outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 sm:w-44"
                />
              </label>

              <label className="relative">
                <Filter size={12} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                <select
                  value={statusFilter}
                  onChange={(event) => updateStatus(event.target.value)}
                  aria-label="Filter travels by status"
                  className="h-8 appearance-none rounded-lg border border-slate-200 bg-white pl-7 pr-7 text-[10px] font-medium capitalize text-slate-600 outline-none focus:border-teal-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended</option>
                </select>
                <SlidersHorizontal size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
              </label>

              <button
                type="button"
                onClick={() => exportAgentsToCsv(filteredAgents)}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#0e8290] px-2.5 text-[10px] font-semibold text-white transition hover:bg-[#096e79]"
              >
                <ArrowDownToLine size={13} /> Export CSV
              </button>

              <button
                type="button"
                onClick={() => navigate("/travel-list")}
                className="inline-flex h-8 items-center gap-1 text-[10px] font-semibold text-teal-700 hover:text-teal-900"
              >
                View All <ArrowRight size={12} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead className="bg-[#f5f8f9] text-[9px] font-bold uppercase tracking-wide text-[#77898b]">
                <tr>
                  <th className="px-5 py-3">Registered Business Name</th>
                  <th className="px-4 py-3">Registration Number</th>
                  <th className="px-4 py-3">Business Email</th>
                  <th className="px-4 py-3">Status</th>
                  {/* <th className="px-4 py-3 text-center">Action</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {visibleAgents.map((agent) => {
                  const statusKey = (agent.status || "pending").toLowerCase();
                  const badgeClass = statusBadgeStyles[statusKey] || statusBadgeStyles.pending;
                  const email = agent.businessEmail || agent.userId?.email || "—";
                  const businessName = agent.registeredBusinessName || agent.operatorDisplayName || "Unnamed Agency";
                  const regNo = agent.registrationNumber || "N/A";

                  return (
                    <tr key={agent._id} className="transition hover:bg-slate-50/70">
                      {/* Registered Business Name */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-teal-100 bg-teal-50 text-[12px] font-bold text-[#078A97]">
                            {businessName[0]?.toUpperCase() || "T"}
                          </span>
                          <div className="min-w-0">
                            <p className="max-w-[260px] truncate text-xs font-semibold text-slate-800">
                              {businessName}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {agent.businessType || "Travel Operator"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Registration Number */}
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] font-medium text-slate-600">
                        {regNo}
                      </td>

                      {/* Business Email */}
                      <td className="whitespace-nowrap px-4 py-3 text-[11px] text-slate-600">
                        {email}
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold capitalize ${badgeClass}`}>
                          {statusKey === "approved" && <CheckCircle2 size={10} />}
                          {statusKey === "pending" && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                          {statusKey === "rejected" && <XCircle size={10} />}
                          {statusKey}
                        </span>
                      </td>

                      {/* Actions */}
                      {/* <td className="whitespace-nowrap px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedAgent(agent)}
                          aria-label={`View details of ${businessName}`}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-teal-50 hover:text-teal-700"
                        >
                          <Eye size={13} />
                        </button>
                      </td> */}
                    </tr>
                  );
                })}

                {visibleAgents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-500">
                      {loadingAgents ? "Loading travel agency records..." : "No travel registrations match your search."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:px-5">
            <p className="text-[10px] text-slate-500">
              Showing <strong className="text-slate-700">{filteredAgents.length ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filteredAgents.length)}</strong> of {filteredAgents.length} travel registrations
            </p>
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                type="button"
                aria-label="Previous page"
                disabled={currentPage === 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2 text-[10px] text-slate-600 disabled:opacity-40"
              >
                <ChevronLeft size={13} /> <span className="hidden sm:inline">Previous</span>
              </button>
              <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#0e8290] px-2 text-[10px] font-semibold text-white">
                {currentPage}
              </span>
              <span className="px-0.5 text-[10px] text-slate-400">of {totalPages}</span>
              <button
                type="button"
                aria-label="Next page"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2 text-[10px] text-slate-600 disabled:opacity-40"
              >
                <span className="hidden sm:inline">Next</span> <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
