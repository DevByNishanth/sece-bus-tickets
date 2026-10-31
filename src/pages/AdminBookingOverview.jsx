import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  BusFront,
  ChevronDown,
  ChevronRight,
  Eye,
  Filter,
  IndianRupee,
  Search,
  TicketCheck,
  WalletCards,
} from "lucide-react";
import VendorNavbar from "./vendor/VendorNavbar.jsx";
import AdminBusDetailView from "./AdminBusDetailScreen.jsx";

const sampleBookings = [
  {
    passenger: "Arun Kumar",
    initials: "AK",
    route: "Coimbatore → Chennai",
    date: "16 Oct 2026",
    seat: "U2",
    fare: "₹1,250",
    payment: "Paid (UPI)",
    status: "Confirmed",
    avatar: "bg-cyan-50 text-cyan-700",
  },
  {
    passenger: "Priya S",
    initials: "PS",
    route: "Chennai → Coimbatore",
    date: "16 Oct 2026",
    seat: "L4",
    fare: "₹1,100",
    payment: "Paid (Card)",
    status: "Confirmed",
    avatar: "bg-pink-50 text-pink-700",
  },
  {
    passenger: "Karthik R",
    initials: "KR",
    route: "Coimbatore → Bengaluru",
    date: "17 Oct 2026",
    seat: "U6",
    fare: "₹1,450",
    payment: "Pending",
    status: "Pending",
    avatar: "bg-amber-50 text-amber-700",
  },
  {
    passenger: "Divya M",
    initials: "DM",
    route: "Madurai → Chennai",
    date: "17 Oct 2026",
    seat: "L2",
    fare: "₹1,300",
    payment: "Paid (UPI)",
    status: "Confirmed",
    avatar: "bg-indigo-50 text-indigo-700",
  },
  {
    passenger: "Suresh N",
    initials: "SN",
    route: "Coimbatore → Chennai",
    date: "18 Oct 2026",
    seat: "U8",
    fare: "₹1,250",
    payment: "Refunded",
    status: "Cancelled",
    avatar: "bg-slate-100 text-slate-700",
  },
];

const statCards = [
  { label: "TOTAL BUSES", value: "21", icon: IndianRupee, color: "bg-blue-600" },
  { label: "APPROVED BUSES", value: "67", icon: BusFront, color: "bg-emerald-500" },
  { label: "PENDING BUSES", value: "78.4%", icon: TicketCheck, color: "bg-violet-600" },
  { label: "REQUEST CORRECTION", value: "67", icon: TicketCheck, color: "bg-teal-600" },
  { label: "REJECTED BUSES", value: "15", icon: WalletCards, color: "bg-orange-500" },
];

const bookingRows = Array.from({ length: 120 }, (_, index) => ({
  ...sampleBookings[index % sampleBookings.length],
  pnr: `BG${240891 + index}`,
}));

const statusStyles = {
  Confirmed: "border-teal-100 bg-teal-50 text-teal-700",
  Pending: "border-orange-100 bg-orange-50 text-orange-700",
  Cancelled: "border-rose-100 bg-rose-50 text-rose-700",
};

function downloadBookings(rows) {
  const columns = ["PNR / Ticket", "Passenger", "Route", "Travel Date", "Seat / Berth", "Fare", "Payment", "Status"];
  const values = rows.map((row) => [row.pnr, row.passenger, row.route, row.date, row.seat, row.fare, row.payment, row.status]);
  const csv = [columns, ...values]
    .map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "bus-bookings.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminBookingOverview({ listType = "buses", detailView: DetailView }) {
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const pageSize = 5;
  const isTravelList = listType === "travels";

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();
    return bookingRows.filter((booking) => {
      const matchesSearch = [booking.pnr, booking.passenger, booking.route]
        .some((value) => value.toLowerCase().includes(query));
      return matchesSearch && (statusFilter === "All statuses" || booking.status === statusFilter);
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / pageSize));
  const visibleBookings = filteredBookings.slice((page - 1) * pageSize, page * pageSize);
  const firstResult = filteredBookings.length ? (page - 1) * pageSize + 1 : 0;
  const lastResult = Math.min(page * pageSize, filteredBookings.length);

  function updateSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function updateFilter(value) {
    setStatusFilter(value);
    setPage(1);
  }

  if (selectedBooking) {
    const BookingDetail = DetailView || AdminBusDetailView;
    return <BookingDetail booking={selectedBooking} onBack={() => setSelectedBooking(null)} />;
  }

  return (
    <div className="min-h-screen text-3xl bg-[#f5f8f9] text-[#172526]">
      <VendorNavbar />
      <main className="mx-auto w-full max-w-[1600px] px-4 pb-8 pt-5 sm:px-6 lg:px-8">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold tracking-normal text-[#172526]">{isTravelList ? "Travels List Overview" : "Bus List Overview"}</h1>
          <p className="mt-1 text-sm text-[#688080]">Live bus tracking, intercity routes, and passenger booking engine</p>
        </header>

        <section aria-label={isTravelList ? "Travel summary" : "Bus summary"} className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {statCards.map(({ label, value, icon: Icon, color }, index) => (
            <article key={label} className="min-h-24 rounded-xl border border-slate-100 bg-white p-4 shadow-[0_3px_12px_rgba(27,54,54,0.06)]">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold tracking-[0.04em] text-[#66807d]">{isTravelList ? ["TOTAL TRAVELS", "APPROVED", "PENDING", "REQUEST CORRECTION", "REJECTED"][index] : label}</p>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color} text-white`}>
                  <Icon size={16} aria-hidden="true" />
                </span>
              </div>
              <p className="mt-2 text-[26px] font-semibold leading-none text-[#1c2b2b]">{value}</p>
            </article>
          ))}
        </section>

        <section className="overflow-hidden rounded-xl border border-[#e1ebee] bg-white shadow-[0_4px_14px_rgba(27,54,54,0.06)]">
          <div className="flex flex-col gap-3 px-4 pb-3 pt-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#172526]">{isTravelList ? "Travels List" : "Bus List"}</h2>
              <p className="mt-0.5 text-xs text-[#60777b]">Live passenger ticket reservations &amp; payment receipts across all routes</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="relative min-w-47.5 flex-1 lg:w-40 lg:flex-none">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#617983]" aria-hidden="true" />
                <input
                  value={search}
                  onChange={(event) => updateSearch(event.target.value)}
                  placeholder="Search PNR, passenger..."
                  className="h-9 w-full rounded-lg border border-[#e3ecef] bg-[#f7f9fa] pl-8 pr-3 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-50"
                />
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setFilterOpen((open) => !open)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e3ecef] bg-[#f7f9fa] px-3 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  aria-expanded={filterOpen}
                >
                  <Filter size={13} aria-hidden="true" /> Filter <ChevronDown size={12} aria-hidden="true" />
                </button>
                {filterOpen && (
                  <select
                    aria-label="Filter by booking status"
                    autoFocus
                    value={statusFilter}
                    onChange={(event) => updateFilter(event.target.value)}
                    onBlur={() => setFilterOpen(false)}
                    className="absolute right-0 top-11 z-10 w-40 rounded-lg border border-slate-200 bg-white p-2 text-sm shadow-lg outline-none"
                  >
                    <option>All statuses</option>
                    <option>Confirmed</option>
                    <option>Pending</option>
                    <option>Cancelled</option>
                  </select>
                )}
              </div>
              <button
                type="button"
                onClick={() => downloadBookings(filteredBookings)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#078a97] px-3 text-xs font-medium text-white transition hover:bg-[#067681]"
              >
                <ArrowDownToLine size={13} aria-hidden="true" /> Export CSV
              </button>
              <button
                type="button"
                onClick={() => { updateSearch(""); updateFilter("All statuses"); }}
                className="inline-flex h-9 items-center gap-1 text-xs font-semibold text-[#078a97] hover:text-[#056975]"
              >
                View All <ArrowRight size={13} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mx-3 overflow-x-auto rounded-lg border border-[#e4ecef] sm:mx-4">
            <table className="w-full min-w-212.5 text-left">
              <thead className="bg-[#f3f7f8] text-[10px] font-semibold uppercase tracking-[0.04em] text-[#687d86]">
                <tr>
                  <th className="px-4 py-3">PNR / Ticket</th>
                  <th className="px-3 py-3">Passenger</th>
                  <th className="px-3 py-3">Route</th>
                  <th className="px-3 py-3">Travel Date</th>
                  <th className="px-3 py-3">Seat Berth</th>
                  <th className="px-3 py-3 text-right">Fare</th>
                  <th className="px-3 py-3">Payment</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e9eff1]">
                {visibleBookings.map((booking) => (
                  <tr key={booking.pnr} className="h-13.5 transition-colors hover:bg-[#f9fbfb]">
                    <td className="whitespace-nowrap px-4 py-2 text-[11px] font-semibold text-[#078a97]">{booking.pnr}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ${booking.avatar}`}>{booking.initials}</span>
                        <span className="text-[11px] font-medium text-[#1c292a]">{booking.passenger}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-[11px] text-[#172526]">{booking.route}</td>
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-[11px] text-[#617983]">{booking.date}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-[11px] font-semibold text-[#172526]">{booking.seat}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-right text-[11px] font-semibold text-[#172526]">{booking.fare}</td>
                    <td className="px-3 py-2">
                      <span className={`whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-medium ${booking.payment === "Pending" ? "bg-orange-50 text-orange-700" : booking.payment === "Refunded" ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-700"}`}>
                        {booking.payment}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`whitespace-nowrap rounded-full border px-2 py-1 text-[10px] font-medium ${statusStyles[booking.status]}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedBooking(booking)}
                        aria-label={`View booking ${booking.pnr}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f0f4f7] text-[#536b80] transition hover:bg-teal-50 hover:text-teal-700"
                      >
                        <Eye size={14} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
                {visibleBookings.length === 0 && (
                  <tr><td colSpan="9" className="px-4 py-10 text-center text-sm text-slate-500">No bookings match your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className="flex flex-col gap-3 px-4 py-4 text-xs text-[#637980] sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p>Showing <span className="font-medium text-[#263638]">{firstResult}–{lastResult}</span> of {filteredBookings.length} bookings</p>
            <nav aria-label="Bookings pagination" className="flex items-center gap-1.5">
              <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="rounded-lg border border-[#e7edef] px-3 py-2 text-[11px] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
              {[1, 2, 3].filter((number) => number <= totalPages).map((number) => (
                <button key={number} type="button" onClick={() => setPage(number)} aria-current={page === number ? "page" : undefined} className={`h-8 min-w-8 rounded-lg border px-2 text-[11px] font-medium ${page === number ? "border-[#078a97] bg-[#078a97] text-white" : "border-[#e7edef] bg-white text-slate-700 hover:bg-slate-50"}`}>{number}</button>
              ))}
              {totalPages > 4 && <span className="px-1 text-slate-500">...</span>}
              {totalPages > 3 && <button type="button" onClick={() => setPage(totalPages)} aria-current={page === totalPages ? "page" : undefined} className={`h-8 min-w-8 rounded-lg border px-2 text-[11px] font-medium ${page === totalPages ? "border-[#078a97] bg-[#078a97] text-white" : "border-[#e7edef] bg-white text-slate-700 hover:bg-slate-50"}`}>{totalPages}</button>}
              <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages} className="inline-flex items-center gap-1 rounded-lg border border-[#e7edef] px-3 py-2 text-[11px] font-medium text-[#263638] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Next <ChevronRight size={14} aria-hidden="true" /></button>
            </nav>
          </footer>
        </section>
      </main>

    </div>
  );
}
