import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  Bell,
  BusFront,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Eye,
  Filter,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  SlidersHorizontal,
  Users,
  Wallet,
  X,
} from "lucide-react";

const bookings = [
  {
    pnr: "BG240891",
    passenger: "Arun Kumar",
    initials: "AK",
    avatar: "bg-cyan-100 text-cyan-700",
    route: "Coimbatore → Chennai",
    date: "16 Oct 2026",
    seat: "U2",
    fare: "₹1,250",
    payment: "Paid (UPI)",
    status: "Confirmed",
  },
  {
    pnr: "BG240892",
    passenger: "Priya S",
    initials: "PS",
    avatar: "bg-pink-100 text-pink-700",
    route: "Chennai → Coimbatore",
    date: "16 Oct 2026",
    seat: "L4",
    fare: "₹1,100",
    payment: "Paid (Card)",
    status: "Confirmed",
  },
  {
    pnr: "BG240893",
    passenger: "Karthik R",
    initials: "KR",
    avatar: "bg-amber-100 text-amber-700",
    route: "Coimbatore → Bengaluru",
    date: "17 Oct 2026",
    seat: "U6",
    fare: "₹1,450",
    payment: "Pending",
    status: "Pending",
  },
  {
    pnr: "BG240894",
    passenger: "Divya M",
    initials: "DM",
    avatar: "bg-indigo-100 text-indigo-700",
    route: "Madurai → Chennai",
    date: "17 Oct 2026",
    seat: "L2",
    fare: "₹1,300",
    payment: "Paid (UPI)",
    status: "Confirmed",
  },
  {
    pnr: "BG240895",
    passenger: "Suresh N",
    initials: "SN",
    avatar: "bg-slate-100 text-slate-700",
    route: "Coimbatore → Chennai",
    date: "18 Oct 2026",
    seat: "U8",
    fare: "₹1,250",
    payment: "Refunded",
    status: "Cancelled",
  },
];

const allBookings = Array.from({ length: 120 }, (_, index) => ({
  ...bookings[index % bookings.length],
  pnr: `BG${240891 + index}`,
}));

const statusClass = {
  Confirmed: "bg-teal-50 text-teal-700",
  Pending: "bg-amber-50 text-amber-700",
  Cancelled: "bg-rose-50 text-rose-700",
};

function exportBookings(rows) {
  const headers = [
    "PNR / Ticket",
    "Passenger",
    "Route",
    "Travel Date",
    "Seat / Berth",
    "Fare",
    "Payment",
    "Status",
  ];
  const csvRows = rows.map((row) => [
    row.pnr,
    row.passenger,
    row.route,
    row.date,
    row.seat,
    row.fare,
    row.payment,
    row.status,
  ]);
  const csv = [headers, ...csvRows]
    .map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "bus-bookings.csv";
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

function TravelStatusChart() {
  const circumference = 2 * Math.PI * 43;
  const segments = [
    { label: "Approved", count: "9,820", percent: "76.4%", value: 76.4, color: "#0d8792" },
    { label: "Cancelled", count: "1,324", percent: "10.3%", value: 10.3, color: "#ff7858" },
    { label: "Pending", count: "1,146", percent: "8.9%", value: 8.9, color: "#f4a43a" },
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
          679
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pageSize = 5;

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allBookings.filter((booking) => {
      const matchesSearch = [
        booking.pnr,
        booking.passenger,
        booking.route,
      ].some((value) => value.toLowerCase().includes(query));
      const matchesStatus =
        statusFilter === "All statuses" || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleBookings = filteredBookings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function updateSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function updateStatus(value) {
    setStatusFilter(value);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-[#f4f7f8] text-slate-800">
      <header className="sticky top-0 z-30 px-3 pt-3 sm:px-5">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 rounded-full border border-white bg-white/95 px-4 py-2.5 shadow-[0_6px_20px_rgba(27,54,54,0.07)] sm:px-5">
          <a href="/admin" className="flex min-w-fit items-center gap-2.5" aria-label="BusGo Admin home">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0e8290] text-white">
              <BusFront size={18} />
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-xs font-bold text-slate-800">BusGo</span>
              <span className="block text-[9px] font-medium uppercase tracking-wide text-slate-400">Partner Hub</span>
            </span>
          </a>

          <nav aria-label="Main navigation" className="hidden items-center gap-1 rounded-full bg-[#f1f6f6] p-1 lg:flex">
            <a href="/admin" aria-current="page" className="flex items-center gap-1.5 rounded-full bg-[#0e8290] px-4 py-2 text-[11px] font-semibold text-white shadow-sm">
              <LayoutDashboard size={13} /> Dashboard
            </a>
            {["Fleet", "Routes", "Trips", "Bookings", "Finance", "Calendar"].map((item) => (
              <button key={item} type="button" className="flex items-center gap-1 rounded-full px-3 py-2 text-[11px] font-medium text-slate-500 transition hover:bg-white hover:text-teal-700">
                {item}
                {["Fleet", "Routes", "Trips"].includes(item) && <ChevronDown size={11} />}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" aria-label="Add new" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0e8290] text-white transition hover:bg-[#096e79]">
              <Plus size={19} />
            </button>
            <button type="button" aria-label="Search" className="hidden h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 sm:flex">
              <Search size={16} />
            </button>
            <button type="button" aria-label="Notifications" className="relative hidden h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 sm:flex">
              <Bell size={16} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            <button type="button" className="hidden items-center gap-2 rounded-full bg-[#f2f6f5] py-1 pl-1 pr-2.5 sm:flex">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0e8290] text-[10px] font-semibold text-white">V</span>
              <span className="text-left leading-tight">
                <span className="block text-[10px] font-semibold text-slate-700">Venkateshwaran</span>
                <span className="block text-[9px] text-slate-400">Fleet Owner</span>
              </span>
              <ChevronDown size={12} className="text-slate-500" />
            </button>
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-600 lg:hidden"
            >
              {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav aria-label="Mobile navigation" className="mx-auto mt-2 grid max-w-[1500px] grid-cols-2 gap-1 rounded-2xl border border-slate-100 bg-white p-3 shadow-lg sm:grid-cols-3">
            {["Dashboard", "Fleet", "Routes", "Trips", "Bookings", "Finance", "Calendar"].map((item) => (
              <a key={item} href={item === "Dashboard" ? "/admin" : "#"} className={`rounded-lg px-3 py-2 text-sm ${item === "Dashboard" ? "bg-teal-50 font-semibold text-teal-700" : "text-slate-600 hover:bg-slate-50"}`}>
                {item}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-[1500px] px-3 pb-8 pt-5 sm:px-5 lg:px-6">
        <div className="mb-4">
          <h1 className="text-xl font-semibold tracking-tight text-[#233235] sm:text-2xl">Dashboard Overview</h1>
          <p className="mt-1 text-xs text-[#718586] sm:text-sm">Live bus tracking, intercity routes, and passenger booking engine</p>
        </div>

        <section aria-label="Dashboard summary" className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: "TOTAL TRAVEL COMPANIES", value: "67", detail: "Registered", icon: Users, color: "bg-emerald-500" },
            { label: "TOTAL BUSES", value: "21", detail: "Registered", icon: BusFront, color: "bg-blue-600" },
            { label: "GROSS COMMISSION VALUE", value: "₹48.6L", detail: "Today", icon: Wallet, color: "bg-blue-600" },
          ].map(({ label, value, detail, icon: Icon, color }) => (
            <article key={label} className="rounded-xl border border-slate-100 bg-white p-4 shadow-[0_3px_12px_rgba(27,54,54,0.06)] sm:min-h-[90px] sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-semibold tracking-wide text-[#718582]">{label}</p>
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${color} text-white`}>
                  <Icon size={15} aria-hidden="true" />
                </span>
              </div>
              <p className="mt-1 text-2xl font-semibold leading-none text-[#273537]">{value}</p>
              <p className="mt-1 text-[10px] text-[#839394]">{detail}</p>
            </article>
          ))}
        </section>

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

          <article className="rounded-xl border border-[#e7edef] bg-white p-4 shadow-[0_3px_12px_rgba(27,54,54,0.05)] sm:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">Travels Status</h2>
              <button type="button" aria-label="Travel status options" className="rounded-md p-1 text-slate-400 hover:bg-slate-50">
                <CircleHelp size={15} />
              </button>
            </div>
            <TravelStatusChart />
          </article>
        </section>

        <section className="overflow-hidden rounded-xl border border-[#e7edef] bg-white shadow-[0_3px_12px_rgba(27,54,54,0.05)]">
          <div className="flex flex-col gap-3 px-4 pb-3 pt-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Recent Bookings</h2>
              <p className="mt-0.5 text-[10px] text-slate-500 sm:text-[11px]">Live passenger ticket reservations &amp; payment receipts across all routes</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="relative min-w-40 flex-1 sm:flex-none">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => updateSearch(event.target.value)}
                  placeholder="Search PNR, passenger..."
                  className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-2 text-[10px] outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 sm:w-40"
                />
              </label>
              <label className="relative">
                <Filter size={12} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                <select
                  value={statusFilter}
                  onChange={(event) => updateStatus(event.target.value)}
                  aria-label="Filter bookings by status"
                  className="h-8 appearance-none rounded-lg border border-slate-200 bg-white pl-7 pr-7 text-[10px] font-medium text-slate-600 outline-none focus:border-teal-500"
                >
                  {["All statuses", "Confirmed", "Pending", "Cancelled"].map((status) => (
                    <option key={status} value={status}>{status === "All statuses" ? "Filter" : status}</option>
                  ))}
                </select>
                <SlidersHorizontal size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
              </label>
              <button
                type="button"
                onClick={() => exportBookings(filteredBookings)}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#0e8290] px-2.5 text-[10px] font-semibold text-white transition hover:bg-[#096e79]"
              >
                <ArrowDownToLine size={13} /> Export CSV
              </button>
              <button type="button" onClick={() => setPage(1)} className="inline-flex h-8 items-center gap-1 text-[10px] font-semibold text-teal-700 hover:text-teal-900">
                View All <ArrowRight size={12} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[790px] border-collapse text-left">
              <thead className="bg-[#f5f8f9] text-[9px] font-semibold uppercase tracking-wide text-[#77898b]">
                <tr>
                  {["PNR / TICKET", "PASSENGER", "ROUTE", "TRAVEL DATE", "SEAT BERTH", "FARE", "PAYMENT", "STATUS", "ACTIONS"].map((heading) => (
                    <th key={heading} className="whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleBookings.map((booking) => (
                  <tr key={booking.pnr} className="text-[10px] transition hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-3 py-3 pl-5 font-semibold text-[#168296]">{booking.pnr}</td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <span className="flex items-center gap-2 font-medium text-slate-700">
                        <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-semibold ${booking.avatar}`}>{booking.initials}</span>
                        {booking.passenger}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-medium text-slate-700">{booking.route}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-500">{booking.date}</td>
                    <td className="whitespace-nowrap px-3 py-3 font-semibold text-slate-700">{booking.seat}</td>
                    <td className="whitespace-nowrap px-3 py-3 font-semibold text-slate-700">{booking.fare}</td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <span className={`rounded-full px-2 py-1 text-[9px] font-medium ${booking.payment === "Pending" ? "bg-amber-50 text-amber-700" : booking.payment === "Refunded" ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-600"}`}>{booking.payment}</span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${statusClass[booking.status]}`}>{booking.status}</span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 pr-5">
                      <button type="button" onClick={() => setSelectedBooking(booking)} aria-label={`View booking ${booking.pnr}`} className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-teal-50 hover:text-teal-700">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {visibleBookings.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-5 py-10 text-center text-sm text-slate-500">No bookings match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:px-5">
            <p className="text-[10px] text-slate-500">
              Showing <strong className="text-slate-700">{filteredBookings.length ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filteredBookings.length)}</strong> of {filteredBookings.length} bookings
            </p>
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2 text-[10px] text-slate-600 disabled:opacity-40">
                <ChevronLeft size={13} /> <span className="hidden sm:inline">Previous</span>
              </button>
              <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#0e8290] px-2 text-[10px] font-semibold text-white">{currentPage}</span>
              <span className="px-0.5 text-[10px] text-slate-400">of {totalPages}</span>
              <button type="button" aria-label="Next page" disabled={currentPage >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2 text-[10px] text-slate-600 disabled:opacity-40">
                <span className="hidden sm:inline">Next</span> <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          role="presentation"
          onClick={() => setSelectedBooking(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-detail-title"
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 id="booking-detail-title" className="text-lg font-semibold text-slate-800">
                  Booking Details
                </h2>
                <p className="mt-1 text-sm font-medium text-teal-700">{selectedBooking.pnr}</p>
              </div>
              <button
                type="button"
                aria-label="Close booking details"
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {[
                ["Passenger", selectedBooking.passenger],
                ["Route", selectedBooking.route],
                ["Travel date", selectedBooking.date],
                ["Seat / berth", selectedBooking.seat],
                ["Fare", selectedBooking.fare],
                ["Payment", selectedBooking.payment],
                ["Status", selectedBooking.status],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm last:border-0"
                >
                  <span className="text-slate-500">{label}</span>
                  <span className="text-right font-medium text-slate-800">{value}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
