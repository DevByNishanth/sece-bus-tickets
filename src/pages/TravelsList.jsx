import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  Building2,
  ChevronDown,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  Mail,
  Phone,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import AdminNavbar from "../components/AdminNavbar.jsx";
import TravelProfileDetailView from "./TravelProfileDetailView.jsx";
import { useAuth } from "../context/AuthContext";

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
    primaryContactDesignation: "Managing Director",
    businessMobile: "+919842188818",
    businessEmail: "kovaiexpress.agent@gmail.com",
    registrationNumber: "CIN-U60221TZ2021PTC028456",
    businessPan: "AAECK1234F",
    gstin: "33AAECK1234F1Z9",
    yearEstablished: 2021,
    registeredAddress: {
      street: "145 Cross Cut Road, Gandhipuram",
      city: "Coimbatore",
      state: "Tamil Nadu",
      postalCode: "641012",
      country: "India",
    },
    operatingAddress: {
      street: "145 Cross Cut Road, Gandhipuram",
      city: "Coimbatore",
      state: "Tamil Nadu",
      postalCode: "641012",
      country: "India",
    },
    businessRegistrationDoc: {
      title: "Certificate of Incorporation",
      url: "/files/docs.pdf",
      fileName: "docs.pdf",
      uploadedAt: "2026-11-03T04:57:23.515Z",
    },
    panDoc: {
      title: "Company PAN Card",
      url: "/files/docs.pdf",
      fileName: "docs.pdf",
      uploadedAt: "2026-11-03T04:57:23.515Z",
    },
    addressProofDoc: {
      title: "Registered Office Proof & Rental Agreement",
      url: "/files/docs.pdf",
      fileName: "docs.pdf",
      uploadedAt: "2026-11-03T04:57:23.515Z",
    },
    bankDetails: {
      accountHolderName: "Kovai Super Express Travels Pvt Ltd",
      accountNumber: "50200088991122",
      ifscCode: "HDFC0000249",
      bankName: "HDFC Bank",
      branchName: "Gandhipuram Coimbatore",
    },
    status: "approved",
    adminRemarks: "Travel agency credentials, commercial permits, and GST registration verified.",
    reviewedBy: {
      _id: "6acf204cd9e02ec09b4e0a76",
      firstName: "System",
      lastName: "Administrator",
      email: "hrms@sece.ac.in",
    },
    reviewedAt: "2026-11-03T04:57:23.514Z",
    createdAt: "2026-11-03T04:57:23.515Z",
    updatedAt: "2026-11-03T04:57:23.515Z",
  },
];

const statusBadgeStyles = {
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
  suspended: "border-slate-300 bg-slate-100 text-slate-700",
};

export default function TravelsList() {
  const { BASE_URL, TOKEN_KEY } = useAuth();
  const [agents, setAgents] = useState(fallbackAgents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalAgents, setTotalAgents] = useState(fallbackAgents.length);

  const tokenKeyName = TOKEN_KEY || "exte_key";

  const fetchAgents = useCallback(
    async (targetStatus = statusFilter) => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem(tokenKeyName);

      try {
        const queryParams = new URLSearchParams({
          page: String(page),
          limit: "20",
        });
        if (targetStatus && targetStatus !== "all") {
          queryParams.append("status", targetStatus);
        }

        const url = `${BASE_URL}/admin/agents?${queryParams.toString()}`;
        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.agents)) {
            setAgents(data.agents);
            setTotalAgents(data.total ?? data.agents.length);
          } else if (Array.isArray(data)) {
            setAgents(data);
            setTotalAgents(data.length);
          }
        } else {
          // Keep fallback data if API returns an error
          console.warn("API response not ok, falling back to local dataset:", res.status);
        }
      } catch (err) {
        console.warn("Failed to fetch /admin/agents:", err);
      } finally {
        setLoading(false);
      }
    },
    [BASE_URL, tokenKeyName, page, statusFilter]
  );

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const filteredAgents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return agents.filter((agent) => {
      const matchSearch =
        !q ||
        agent.registeredBusinessName?.toLowerCase().includes(q) ||
        agent.registrationNumber?.toLowerCase().includes(q) ||
        agent.businessEmail?.toLowerCase().includes(q) ||
        agent.operatorDisplayName?.toLowerCase().includes(q) ||
        agent.primaryContactPerson?.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "all" ||
        agent.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [agents, search, statusFilter]);

  // Statistics cards calculation
  const stats = useMemo(() => {
    const total = agents.length;
    const approved = agents.filter((a) => a.status?.toLowerCase() === "approved").length;
    const pending = agents.filter((a) => a.status?.toLowerCase() === "pending").length;
    const rejected = agents.filter((a) => a.status?.toLowerCase() === "rejected").length;
    const suspended = agents.filter((a) => a.status?.toLowerCase() === "suspended").length;
    return { total, approved, pending, rejected, suspended };
  }, [agents]);

  const handleExportCSV = () => {
    const headers = [
      "Registered Business Name",
      "Registration Number",
      "Status",
      "Business Email",
      "Contact Person",
      "Contact Mobile",
      "GSTIN",
      "PAN",
    ];
    const rows = filteredAgents.map((a) => [
      a.registeredBusinessName || "",
      a.registrationNumber || "",
      a.status || "",
      a.businessEmail || a.userId?.email || "",
      a.primaryContactPerson || "",
      a.businessMobile || a.userId?.phone || "",
      a.gstin || "",
      a.businessPan || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `travel-agents-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (selectedAgentId) {
    return (
      <TravelProfileDetailView
        agentProfileId={selectedAgentId}
        onBack={() => {
          setSelectedAgentId(null);
          fetchAgents();
        }}
        Navbar={AdminNavbar}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8f9] text-[#172526]">
      <AdminNavbar />

      <main className="mx-auto w-full max-w-[1600px] px-4 pb-8 pt-5 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#078A97] text-white shadow-sm">
                <Building2 size={18} />
              </span>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-[#172526] sm:text-2xl">
                  Travel Agency Directory
                </h1>
                <p className="mt-0.5 text-xs text-[#688080]">
                  Manage registered travel operators, registration credentials, and verification status
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchAgents()}
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

        {/* Stats Row */}
        <section
          aria-label="Travel agent status summary"
          className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4"
        >
          <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Total Agencies
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-[#078A97]">
                <Building2 size={15} />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stats.total}</p>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Approved
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
                Pending Review
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
                Rejected / Suspended
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

        {/* Table Card */}
        <section className="overflow-hidden rounded-2xl border border-[#dbe6e9] bg-white shadow-sm">
          {/* Table Toolbar */}
          <div className="flex flex-col gap-3 border-b border-[#e7eff1] px-4 py-3.5 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#172526]">Travels List</h2>
              <p className="text-[11px] text-[#657d84]">
                Showing {filteredAgents.length} of {agents.length} registered agencies
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
                  placeholder="Search agency, registration no, email..."
                  className="h-9 w-full rounded-xl border border-[#dce7e9] bg-[#f8fafb] pl-9 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#078A97] focus:bg-white focus:ring-2 focus:ring-teal-50"
                />
              </div>

              {/* Status Filter */}
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

          {/* Table with required fields: registeredBusinessName, registrationNumber, status, businessEmail */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-[#f4f8f9] text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Registered Business Name</th>
                  <th className="px-4 py-3">Registration Number</th>
                  <th className="px-4 py-3">Business Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf3f5] text-xs">
                {filteredAgents.map((agent) => {
                  const statusKey = (agent.status || "pending").toLowerCase();
                  const badgeClass =
                    statusBadgeStyles[statusKey] || statusBadgeStyles.pending;
                  const email =
                    agent.businessEmail || agent.userId?.email || "—";
                  const businessName =
                    agent.registeredBusinessName || agent.operatorDisplayName || "Unnamed Agency";
                  const regNo =
                    agent.registrationNumber || "N/A";

                  return (
                    <tr
                      key={agent._id}
                      className="group transition-colors hover:bg-[#f8fbfb]"
                    >
                      {/* registeredBusinessName */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[13px] font-bold text-[#078A97] border border-teal-100/80">
                            {businessName[0]?.toUpperCase() || "T"}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-800 max-w-[280px]">
                              {businessName}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[240px]">
                              {agent.operatorDisplayName && agent.operatorDisplayName !== businessName
                                ? `${agent.operatorDisplayName} · `
                                : ""}
                              {agent.businessType || "Travel Operator"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* registrationNumber */}
                      <td className="px-4 py-3.5">
                        <span className="inline-block rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] font-medium text-slate-700">
                          {regNo}
                        </span>
                      </td>

                      {/* businessEmail */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Mail size={12} className="text-slate-400 shrink-0" />
                          <span className="truncate max-w-[200px]" title={email}>
                            {email}
                          </span>
                        </div>
                      </td>

                      {/* status */}
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
                          {agent.status || "Pending"}
                        </span>
                      </td>

                      {/* Detail action */}
                      <td className="px-4 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedAgentId(agent._id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#d6e3e6] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#078A97] shadow-2xs transition hover:border-[#078A97] hover:bg-teal-50"
                          title="View agent profile details"
                        >
                          <Eye size={13} />
                          <span>View Detail</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredAgents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                      <Building2 size={32} className="mx-auto mb-2 text-slate-300" />
                      <p className="font-semibold text-slate-600 text-sm">
                        No travel agents found
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Try adjusting your search criteria or filter.
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
