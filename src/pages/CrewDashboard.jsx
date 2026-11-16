import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowDownToLine,
  ArrowRight,
  AlertTriangle,
  Bell,
  BusFront,
  Camera,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Map,
  Plus,
  Search,
  SlidersHorizontal,
  TicketCheck,
  UsersRound,
  X,
} from "lucide-react";

const bookingRows = [
  {
    pnr: "BG240891",
    passenger: "Arun Kumar",
    initials: "AK",
    route: "Coimbatore ↔ Chennai",
    date: "16 Oct, 2026",
    seat: "U2",
    fare: "₹1,250",
    payment: "Paid (UPI)",
    status: "Confirmed",
  },
  {
    pnr: "BG240892",
    passenger: "Priya S",
    initials: "PS",
    route: "Chennai ↔ Coimbatore",
    date: "16 Oct, 2026",
    seat: "L4",
    fare: "₹1,100",
    payment: "Paid (Card)",
    status: "Confirmed",
  },
  {
    pnr: "BG240893",
    passenger: "Karthik R",
    initials: "KR",
    route: "Coimbatore → Bengaluru",
    date: "17 Oct, 2026",
    seat: "U6",
    fare: "₹1,450",
    payment: "Pending",
    status: "Pending",
  },
  {
    pnr: "BG240894",
    passenger: "Divya M",
    initials: "DM",
    route: "Madurai → Chennai",
    date: "17 Oct, 2026",
    seat: "L2",
    fare: "₹1,300",
    payment: "Paid (UPI)",
    status: "Confirmed",
  },
  {
    pnr: "BG240895",
    passenger: "Suresh N",
    initials: "SN",
    route: "Coimbatore ↔ Chennai",
    date: "18 Oct, 2026",
    seat: "U8",
    fare: "₹1,250",
    payment: "Refunded",
    status: "Cancelled",
  },
  {
    pnr: "BG240896",
    passenger: "Meena P",
    initials: "MP",
    route: "Coimbatore → Madurai",
    date: "18 Oct, 2026",
    seat: "L5",
    fare: "₹950",
    payment: "Paid (UPI)",
    status: "Confirmed",
  },
  {
    pnr: "BG240897",
    passenger: "Vijay K",
    initials: "VK",
    route: "Chennai → Bengaluru",
    date: "19 Oct, 2026",
    seat: "U3",
    fare: "₹1,600",
    payment: "Pending",
    status: "Pending",
  },
  {
    pnr: "BG240898",
    passenger: "Nandhini T",
    initials: "NT",
    route: "Madurai → Coimbatore",
    date: "19 Oct, 2026",
    seat: "L1",
    fare: "₹900",
    payment: "Paid (Card)",
    status: "Confirmed",
  },
  {
    pnr: "BG240899",
    passenger: "Ramesh B",
    initials: "RB",
    route: "Coimbatore → Chennai",
    date: "20 Oct, 2026",
    seat: "U5",
    fare: "₹1,250",
    payment: "Refunded",
    status: "Cancelled",
  },
  {
    pnr: "BG240900",
    passenger: "Anitha R",
    initials: "AR",
    route: "Chennai → Coimbatore",
    date: "20 Oct, 2026",
    seat: "L3",
    fare: "₹1,100",
    payment: "Paid (UPI)",
    status: "Confirmed",
  },
];

const upcomingTrips = [
  { date: "20", month: "JUN", route: "Coimbatore → Chennai", bus: "TN 38 AJ 7782", time: "Reporting 08:30 PM" },
  { date: "20", month: "JUN", route: "Coimbatore → Chennai", bus: "TN 38 AJ 7782", time: "Reporting 08:30 PM" },
  { date: "20", month: "JUN", route: "Coimbatore → Chennai", bus: "TN 38 AJ 7782", time: "Reporting 08:30 PM" },
];

const navigation = [
  { label: "Dashboard", to: "/crew-dashboard" },
  { label: "Fleet", to: "/vendor/bus-management" },
  { label: "Routes", to: "/vendor/root-management" },
  { label: "Trips", to: "/vendor/trip-management" },
  { label: "Bookings", to: "/vendor/bookings" },
  { label: "Finance", to: "/vendor/finance" },
  { label: "Calendar", to: "/vendor/calendar" },
];

const statusClassNames = {
  Confirmed: "bg-[#e6f5f4] text-[#188d91]",
  Pending: "bg-[#fff4e5] text-[#be741c]",
  Cancelled: "bg-[#fff0ed] text-[#df6655]",
};

function exportBookingsToCsv(rows) {
  const headers = ["PNR / Ticket", "Passenger", "Route", "Travel date", "Seat berth", "Fare", "Payment", "Status"];
  const csv = [headers, ...rows.map((row) => [
    row.pnr,
    row.passenger,
    row.route,
    row.date,
    row.seat,
    row.fare,
    row.payment,
    row.status,
  ])]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "recent-bookings.csv";
  downloadLink.click();
  URL.revokeObjectURL(url);
}

function OverviewCard({ icon: Icon, value, label, caption }) {
  return (
    <article className="flex min-h-[72px] items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-[0_3px_12px_rgba(27,65,75,0.03)]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e7f6f7] text-[#178c99]">
        <Icon size={18} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold leading-none text-[#26394b]">{value}</span>
          <span className="truncate text-[13px] font-medium text-[#526271]">{label}</span>
        </div>
        <p className="mt-1 text-[12px] text-slate-400">{caption}</p>
      </div>
    </article>
  );
}

const initialAttendance = [
  { id: "BG082741", name: "Priya Raman", initials: "PR", seat: "L1", route: "Coimbatore → Madurai", contact: "+91  ••••  4821", status: "Boarded" },
  { id: "BG082742", name: "Arun Prakash", initials: "AP", seat: "L2", route: "Coimbatore → Dindigul", contact: "+91  ••••  1934", status: "Boarded" },
  { id: "BG082743", name: "Meena S", initials: "MS", seat: "L3", route: "Coimbatore → Madurai", contact: "+91  ••••  7632", status: "Pending" },
  { id: "BG082744", name: "Vijay Kumar", initials: "VK", seat: "L4", route: "Coimbatore → Karur", contact: "+91  ••••  2955", status: "Boarded" },
  { id: "BG082745", name: "Nandhini R", initials: "NR", seat: "L5", route: "Tiruppur → Madurai", contact: "+91  ••••  8510", status: "Pending" },
];

function PassengerAttendance({ onBack }) {
  const [passengers, setPassengers] = useState(initialAttendance);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [routeFilter, setRouteFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState("Boarded");

  const filteredPassengers = useMemo(() => passengers.filter((passenger) => {
    const matchesSearch = `${passenger.name} ${passenger.id} ${passenger.seat}`
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    const matchesStatus = statusFilter === "All" || passenger.status === statusFilter;
    const matchesRoute = routeFilter === "All" || passenger.route === routeFilter;
    return matchesSearch && matchesStatus && matchesRoute;
  }), [passengers, search, statusFilter, routeFilter]);

  const boardedInSample = passengers.filter((passenger) => passenger.status === "Boarded").length;
  const pendingInSample = passengers.filter((passenger) => passenger.status === "Pending").length;
  const boardedCount = 17 + boardedInSample - 3;
  const pendingCount = 5 + pendingInSample - 2;
  const notBoardedCount = 2;

  const togglePassenger = (passengerId) => {
    setSelectedIds((ids) => ids.includes(passengerId)
      ? ids.filter((id) => id !== passengerId)
      : [...ids, passengerId]);
  };

  const toggleVisiblePassengers = () => {
    const visibleIds = filteredPassengers.map((passenger) => passenger.id);
    const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
    setSelectedIds((ids) => allVisibleSelected
      ? ids.filter((id) => !visibleIds.includes(id))
      : [...new Set([...ids, ...visibleIds])]);
  };

  const updatePassengerStatus = (passengerId) => {
    setPassengers((rows) => rows.map((passenger) => passenger.id === passengerId
      ? { ...passenger, status: passenger.status === "Boarded" ? "Pending" : "Boarded" }
      : passenger));
    setIsSubmitted(false);
  };

  const confirmBulkAttendance = () => {
    setPassengers((rows) => rows.map((passenger) => selectedIds.includes(passenger.id)
      ? { ...passenger, status: bulkStatus }
      : passenger));
    setIsSubmitted(false);
    setSelectedIds([]);
    setIsBulkModalOpen(false);
  };

  const allVisibleSelected = filteredPassengers.length > 0
    && filteredPassengers.every((passenger) => selectedIds.includes(passenger.id));
  const selectedPassengers = passengers.filter((passenger) => selectedIds.includes(passenger.id));

  return (
    <main className="min-h-screen bg-[#f5f8f9] px-4 py-6 text-[#27394b] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-none">
        <button type="button" onClick={onBack} className="mb-2 inline-flex items-center gap-1 text-[12px] font-medium text-slate-400 hover:text-[#138795]">
          <ArrowLeft size={12} /> Trip details
        </button>
        <div className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-[#138795]">BUS-TRIP-2026-001</div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#202f40] sm:text-4xl">Passenger Attendance</h1>
            <p className="mt-1 text-[13px] text-slate-400">Coimbatore → Madurai · 18 Jun 2026</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setIsPreviewOpen(true);
            }}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-[#106d69] px-4 text-[13px] font-semibold text-white transition hover:bg-[#0b5956]"
          >
            Submit Attendance Summary
          </button>
        </div>

        {isSubmitted && (
          <p role="status" className="mt-3 text-[13px] font-medium text-[#168f7e]">Attendance summary submitted successfully.</p>
        )}

        <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_2.2fr]">
          <article className="flex min-h-[72px] items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f8f5] text-[#139992]"><UsersRound size={17} /></span>
            <div><p className="text-xl font-semibold leading-none">{25}</p><p className="mt-1 text-[12px] text-slate-400">Total booked</p></div>
          </article>
          <article className="flex min-h-[72px] items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8faf6] text-[#13a895]"><Check size={17} /></span>
            <div><p className="text-xl font-semibold leading-none">{boardedCount}</p><p className="mt-1 text-[12px] text-slate-400">Boarded</p></div>
          </article>
          <article className="flex min-h-[72px] items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#effaf8] text-[#16a99c]"><X size={17} /></span>
            <div><p className="text-xl font-semibold leading-none">{notBoardedCount}</p><p className="mt-1 text-[12px] text-slate-400">Not boarded</p></div>
          </article>
          <article className="flex min-h-[72px] items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eefaf7] text-[#13a895]"><Clock3 size={17} /></span>
            <div><p className="text-xl font-semibold leading-none">{pendingCount}</p><p className="mt-1 text-[12px] text-slate-400">Pending</p></div>
          </article>
          <article className="rounded-xl border border-slate-100 bg-white px-3 py-3">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-slate-500">Boarding progress</span>
              <span className="font-semibold text-[#334454]">{Math.round((boardedCount / 25) * 100)}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#edf1f3]">
              <div className="h-full rounded-full bg-[#108b80] transition-all" style={{ width: `${(boardedCount / 25) * 100}%` }} />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">{boardedCount} of 25 passengers boarded</p>
          </article>
        </section>

        <section className="mt-4 flex flex-col gap-2 rounded-xl border border-slate-100 bg-white p-3 sm:flex-row sm:items-center">
          <label className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-[#fbfcfd] px-3">
            <Search size={14} className="shrink-0 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, PNR or seat"
              aria-label="Search passenger attendance"
              className="w-full bg-transparent text-[13px] outline-none placeholder:text-slate-400"
            />
          </label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by attendance status"
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[12px] text-slate-600 outline-none"
          >
            <option>All</option>
            <option>Boarded</option>
            <option>Pending</option>
          </select>
          <select
            value={routeFilter}
            onChange={(event) => setRouteFilter(event.target.value)}
            aria-label="Filter by route"
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[12px] text-slate-600 outline-none"
          >
            <option>All</option>
            {[...new Set(passengers.map((passenger) => passenger.route))].map((route) => (
              <option key={route}>{route}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setIsBulkModalOpen(true)}
            disabled={selectedIds.length === 0}
            className="h-9 whitespace-nowrap rounded-lg bg-[#108b93] px-3 text-[12px] font-semibold text-white transition hover:bg-[#0b737b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Bulk Attendance
          </button>
        </section>

        <section className="mt-4 overflow-hidden rounded-xl border border-slate-100 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="bg-white text-[11px] font-semibold uppercase tracking-wide text-[#84939d]">
                  <th className="w-10 px-4 py-3">
                    <input type="checkbox" checked={allVisibleSelected} onChange={toggleVisiblePassengers} aria-label="Select all visible passengers" className="accent-[#138795]" />
                  </th>
                  <th className="px-3 py-3">S.No</th>
                  <th className="px-3 py-3">Passenger</th>
                  <th className="px-3 py-3">PNR / Seat</th>
                  <th className="px-3 py-3">Boarding → Dropping</th>
                  <th className="px-3 py-3">Contact</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPassengers.map((passenger, index) => (
                  <tr key={passenger.id} className="text-[12px] text-[#526271]">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selectedIds.includes(passenger.id)} onChange={() => togglePassenger(passenger.id)} aria-label={`Select ${passenger.name}`} className="accent-[#138795]" />
                    </td>
                    <td className="px-3 py-3 text-slate-400">{index + 1}</td>
                    <td className="whitespace-nowrap px-3 py-3 font-semibold text-[#334454]">{passenger.name}</td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <p className="font-semibold text-[#334454]">{passenger.id}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">Seat {passenger.seat}</p>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">{passenger.route}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-500">{passenger.contact}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        passenger.status === "Boarded" ? "bg-[#e7faf3] text-[#168f7e]" : "bg-[#fff7e8] text-[#bf7b1d]"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${passenger.status === "Boarded" ? "bg-[#18aa91]" : "bg-[#efad42]"}`} />
                        {passenger.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => updatePassengerStatus(passenger.id)}
                        className={`inline-flex min-w-[72px] items-center justify-center gap-1 rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition ${
                          passenger.status === "Boarded" ? "border-slate-200 bg-white text-[#526271] hover:bg-slate-50" : "border-[#d7ece6] bg-white text-[#168f7e] hover:bg-[#f1faf7]"
                        }`}
                      >
                        {passenger.status === "Boarded" ? "Correct" : <><Check size={11} /> Boarded</>}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPassengers.length === 0 && (
                  <tr><td colSpan="8" className="px-4 py-8 text-center text-[13px] text-slate-400">No passengers match your search or filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {isPreviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="attendance-preview-title"
              className="w-full max-w-[540px] rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="attendance-preview-title" className="text-xl font-semibold text-[#202f40]">Submit attendance summary?</h2>
                  <p className="mt-1 text-[13px] text-slate-500">Review all passenger counts before submitting.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  aria-label="Close attendance preview"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f1f5f8] text-slate-400 transition hover:bg-slate-200"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-4 divide-x divide-slate-200 rounded-xl border border-slate-200">
                {[
                  ["25", "Booked"],
                  [String(boardedCount), "Boarded"],
                  [String(notBoardedCount), "Not boarded"],
                  [String(pendingCount), "Pending"],
                ].map(([value, label]) => (
                  <div key={label} className="px-2 py-3 text-center">
                    <p className="text-2xl font-semibold text-[#26394b]">{value}</p>
                    <p className="mt-1 text-[11px] text-slate-400">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-[12px] leading-relaxed text-amber-800">
                <AlertTriangle size={17} className="shrink-0 text-amber-600" />
                <p>Pending passengers will remain pending. They are never automatically marked.</p>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPreviewOpen(false);
                    setIsSubmitted(true);
                  }}
                  className="h-10 rounded-lg bg-[#108b93] px-5 text-[13px] font-semibold text-white transition hover:bg-[#0b737b]"
                >
                  Submit Summary
                </button>
              </div>
            </section>
          </div>
        )}

        {isBulkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="bulk-attendance-title"
              className="w-full max-w-[540px] rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="bulk-attendance-title" className="text-xl font-semibold text-[#233b45]">Bulk attendance update</h2>
                  <p className="mt-1 text-[13px] text-slate-500">{selectedPassengers.length} passengers selected</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  aria-label="Close bulk attendance update"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f1f5f8] text-slate-500 transition hover:bg-slate-200"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-5 flex max-h-28 flex-wrap gap-2 overflow-y-auto">
                {selectedPassengers.map((passenger) => (
                  <span key={passenger.id} className="rounded-md border border-slate-200 bg-[#f4f7f8] px-2.5 py-1.5 text-[11px] text-[#526675]">
                    {passenger.id}
                  </span>
                ))}
              </div>

              <label htmlFor="bulk-attendance-status" className="mt-5 block text-[12px] font-semibold text-[#334f59]">
                New attendance status
              </label>
              <select
                id="bulk-attendance-status"
                value={bulkStatus}
                onChange={(event) => setBulkStatus(event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-[14px] font-medium text-[#334f59] outline-none focus:border-[#138795]"
              >
                <option>Boarded</option>
                <option>Pending</option>
              </select>

              <div className="-mx-5 -mb-5 mt-6 flex justify-end gap-2 border-t border-slate-100 bg-[#fbfcfd] px-5 py-4 sm:-mx-6 sm:-mb-6 sm:px-6">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="h-10 rounded-xl border border-slate-300 bg-white px-5 text-[13px] font-semibold text-[#50636d] transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmBulkAttendance}
                  className="h-10 rounded-xl bg-[#108b93] px-5 text-[13px] font-semibold text-white transition hover:bg-[#0b737b]"
                >
                  Confirm Update
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function CrewTripDetails({ onBack }) {
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [currentTripStatus, setCurrentTripStatus] = useState("Boarding Started");
  const [newTripStatus, setNewTripStatus] = useState("");
  const [statusDate, setStatusDate] = useState("2026-06-18");
  const [statusTime, setStatusTime] = useState("06:55");
  const [statusRemarks, setStatusRemarks] = useState("");
  const [statusPhoto, setStatusPhoto] = useState(null);
  const [statusPhotoError, setStatusPhotoError] = useState("");
  const stops = [
    { name: "Coimbatore Omni Bus Stand", detail: "Origin", time: "07:30 AM", state: "done" },
    { name: "Tiruppur New Bus Stand", detail: "Boarding", time: "08:35 AM", state: "current" },
    { name: "Karur Bus Stand", detail: "Halt · 10 min", time: "11:10 AM", state: "upcoming" },
    { name: "Madurai Mattuthavani", detail: "Destination", time: "02:00 PM", state: "upcoming" },
  ];

  const crew = [
    { initials: "RK", name: "Rajesh Kumar", role: "Driver · On duty" },
    { initials: "SK", name: "Suresh Kumar", role: "Conductor · On duty" },
    { initials: "M", name: "Mani", role: "Cleaner · On duty" },
  ];

  if (isAttendanceOpen) {
    return <PassengerAttendance onBack={() => setIsAttendanceOpen(false)} />;
  }

  const handleStatusPhotoChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (!file) {
      setStatusPhoto(null);
      setStatusPhotoError("");
      return;
    }

    const isSupportedType = ["image/jpeg", "image/png"].includes(file.type);
    if (!isSupportedType || file.size > 5 * 1024 * 1024) {
      setStatusPhoto(null);
      setStatusPhotoError("Choose a JPG or PNG image up to 5 MB.");
      event.target.value = "";
      return;
    }

    setStatusPhoto(file);
    setStatusPhotoError("");
  };

  const confirmTripStatus = (event) => {
    event.preventDefault();
    if (!newTripStatus || !statusRemarks.trim()) return;
    setCurrentTripStatus(newTripStatus);
    setIsStatusModalOpen(false);
    setNewTripStatus("");
    setStatusRemarks("");
    setStatusPhoto(null);
    setStatusPhotoError("");
  };

  return (
    <main className="min-h-screen bg-[#f5f8f9] px-4 py-4 text-[#27394b] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-none">
        <button type="button" onClick={onBack} className="mb-3 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#687c88] transition hover:text-[#138795]">
          <ArrowLeft size={14} /> Back
        </button>

        <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#138795]">BUS-TRIP-2026-001</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#27394b] sm:text-4xl">Coimbatore → Madurai</h1>
            <p className="mt-1 text-[13px] text-slate-400">18 Jun 2026 · TN 38 AB 1234</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setIsStatusModalOpen(true)} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#108894] px-3 text-[13px] font-medium text-white transition hover:bg-[#0b6975]">
              <TicketCheck size={14} /> Update Status
            </button>
            <button type="button" onClick={() => setIsAttendanceOpen(true)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-medium text-[#536777] transition hover:bg-slate-50">
              <UsersRound size={14} /> Passenger Attendance
            </button>
            <span className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-100 bg-white px-3 text-[12px] font-medium text-[#7778db]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8988ed]" />
              {currentTripStatus}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.8fr_0.9fr]">
          <div className="space-y-4">
            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_12px_rgba(27,65,75,0.04)]">
              <h2 className="text-[16px] font-semibold text-[#334454]">Trip overview</h2>
              <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Departure</p>
                  <p className="mt-1 text-2xl font-semibold text-[#27394b]">07:30 AM</p>
                  <p className="mt-1 text-[13px] font-medium text-[#46596a]">Coimbatore</p>
                  <p className="text-[11px] text-slate-400">Omni Bus Stand</p>
                </div>
                <div className="flex min-w-[90px] flex-col items-center sm:min-w-[180px]">
                  <span className="mb-1 text-[11px] font-medium text-slate-400">214 km · 6h 30m</span>
                  <div className="relative h-px w-full bg-[#dce7eb]">
                    <span className="absolute left-1/2 top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#d9efed] bg-white text-[#128f96]">
                      <BusFront size={13} />
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Expected arrival</p>
                  <p className="mt-1 text-2xl font-semibold text-[#27394b]">02:00 PM</p>
                  <p className="mt-1 text-[13px] font-medium text-[#46596a]">Madurai</p>
                  <p className="text-[11px] text-slate-400">Mattuthavani</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-4">
                {[
                  ["Reporting", "07:00 AM"],
                  ["Actual departure", "Not departed"],
                  ["Service", "Express"],
                  ["Platform", "Bay 06"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[11px] text-slate-400">{label}</p>
                    <p className="mt-1 text-[13px] font-semibold text-[#46596a]">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_12px_rgba(27,65,75,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-[#334454]">Route &amp; stops</h2>
                <span className="text-[12px] font-medium text-slate-400">4 stops</span>
              </div>
              <ol className="mt-4 space-y-0">
                {stops.map((stop, index) => (
                  <li key={stop.name} className="relative flex min-h-[48px] gap-3">
                    {index < stops.length - 1 && <span className="absolute left-[5px] top-3 h-full border-l border-dashed border-[#d8e3e7]" />}
                    <span className={`relative z-10 mt-1 h-3 w-3 shrink-0 rounded-full border-2 bg-white ${
                      stop.state === "current" ? "border-[#18aa9a] ring-2 ring-[#e0f6f2]" : stop.state === "done" ? "border-[#d4e0e5]" : "border-[#cad8de]"
                    }`} />
                    <div className="flex flex-1 items-start justify-between gap-3">
                      <div>
                        <p className="text-[13px] font-semibold text-[#46596a]">{stop.name}</p>
                        <p className="mt-0.5 text-[11px] text-slate-400">{stop.detail}</p>
                      </div>
                      <span className="text-[12px] font-semibold text-[#46596a]">{stop.time}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_12px_rgba(27,65,75,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-[#334454]">Passenger overview</h2>
                <button type="button" className="text-[12px] font-medium text-[#148994] hover:underline">Manage</button>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-around gap-5">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full" style={{ background: "conic-gradient(#138c95 0% 68%, #e1f3f5 68% 100%)" }}>
                  <div className="flex h-[74px] w-[74px] flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-xl font-semibold text-[#334454]">68%</span>
                    <span className="text-[11px] text-slate-400">boarded</span>
                  </div>
                </div>
                <div className="grid flex-1 grid-cols-3 gap-3 text-center">
                  {[["25", "Booked"], ["17", "Boarded"], ["5", "Pending"]].map(([value, label]) => (
                    <div key={label}>
                      <p className="text-xl font-semibold text-[#334454]">{value}</p>
                      <p className="mt-1 text-[12px] text-slate-400">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_12px_rgba(27,65,75,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-[#334454]">Bus information</h2>
                <BusFront size={18} className="text-slate-400" />
              </div>
              <p className="mt-3 text-base font-semibold text-[#334454]">TN 38 AB 1234</p>
              <p className="mt-1 text-[12px] text-slate-400">Volvo 9600 · AC Sleeper</p>
              <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">
                <div className="flex justify-between gap-3 text-[12px]">
                  <span className="text-slate-400">Capacity</span><span className="font-semibold text-[#46596a]">36 berths</span>
                </div>
                <div className="flex justify-between gap-3 text-[12px]">
                  <span className="text-slate-400">Depot</span><span className="font-semibold text-[#46596a]">Coimbatore Central</span>
                </div>
                <div className="flex justify-between gap-3 text-[12px]">
                  <span className="text-slate-400">Last inspection</span><span className="font-semibold text-[#168f7e]">Passed · Today</span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_12px_rgba(27,65,75,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-[#334454]">Assigned crew</h2>
                <span className="text-[11px] text-slate-400">3 members</span>
              </div>
              <div className="mt-3 space-y-3">
                {crew.map((member) => (
                  <div key={member.name} className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef2f5] text-[10px] font-semibold text-[#617483]">{member.initials}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-semibold text-[#46596a]">{member.name}</p>
                      <p className="text-[11px] text-slate-400">{member.role}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f8f4] px-2 py-1 text-[10px] font-medium text-[#168f7e]">
                      <span className="h-1 w-1 rounded-full bg-[#18aa91]" /> Active
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_12px_rgba(27,65,75,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-[#334454]">Status timeline</h2>
                <span className="text-[11px] text-slate-400">Live updates</span>
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#138c95] text-white"><BusFront size={11} /></span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[12px] font-semibold text-[#46596a]">Boarding Started</p>
                      <span className="text-[11px] text-slate-400">06:48 AM</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-400">Boarding opened at Bay 06 · Suresh Kumar</p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eef3f6] text-[#7d909d]"><CheckCircle2 size={12} /></span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[12px] font-semibold text-[#46596a]">Preparing for Departure</p>
                      <span className="text-[11px] text-slate-400">06:32 AM</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-400">Pre-trip checks completed · Rajesh Kumar</p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eef3f6] text-[#7d909d]"><CheckCircle2 size={12} /></span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[12px] font-semibold text-[#46596a]">Scheduled</p>
                      <span className="text-[11px] text-slate-400">Yesterday</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-400">Trip assigned to crew · Operations Desk</p>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4">
          <form
            onSubmit={confirmTripStatus}
            className="w-full max-w-[600px] rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-[#202b3d]">Update bus status</h2>
                <p className="mt-1 text-[13px] text-slate-500">TN 38 AB 1234 · BUS-TRIP-2026-001</p>
              </div>
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                aria-label="Close update bus status"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f1f5f8] text-slate-400 transition hover:bg-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            <label className="mt-5 block text-[12px] font-semibold text-[#334454]">Current status</label>
            <div className="mt-2 flex h-10 items-center rounded-lg border border-slate-200 bg-[#f7f9fb] px-3 text-[12px] text-[#526271]">
              {currentTripStatus}
            </div>

            <label htmlFor="trip-new-status" className="mt-4 block text-[12px] font-semibold text-[#334454]">
              New status <span className="text-rose-500">*</span>
            </label>
            <select
              id="trip-new-status"
              value={newTripStatus}
              onChange={(event) => setNewTripStatus(event.target.value)}
              required
              className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[12px] text-[#46596a] outline-none focus:border-[#138795]"
            >
              <option value="">Select new status</option>
              <option>Scheduled</option>
              <option>Preparing for Departure</option>
              <option>Boarding Started</option>
              <option>Departed</option>
              <option>Delayed</option>
              <option>Arrived</option>
            </select>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block text-[12px] font-semibold text-[#334454]">
                Date
                <input
                  type="date"
                  value={statusDate}
                  onChange={(event) => setStatusDate(event.target.value)}
                  required
                  className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 font-normal text-[#46596a] outline-none focus:border-[#138795]"
                />
              </label>
              <label className="block text-[12px] font-semibold text-[#334454]">
                Time
                <input
                  type="time"
                  value={statusTime}
                  onChange={(event) => setStatusTime(event.target.value)}
                  required
                  className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 font-normal text-[#46596a] outline-none focus:border-[#138795]"
                />
              </label>
            </div>

            <label htmlFor="trip-status-remarks" className="mt-4 block text-[12px] font-semibold text-[#334454]">
              Remarks <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="trip-status-remarks"
              value={statusRemarks}
              onChange={(event) => setStatusRemarks(event.target.value)}
              required
              rows={3}
              placeholder="Add a concise operational update..."
              className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[12px] font-normal text-[#46596a] outline-none placeholder:text-slate-400 focus:border-[#138795]"
            />

            <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-slate-200 px-4 py-3 transition hover:border-[#9dd5d2]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#effbf8] text-[#138f88]">
                <Camera size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-semibold text-[#16867e]">
                  {statusPhoto ? statusPhoto.name : "Add supporting photo"}
                </span>
                <span className="mt-0.5 block text-[11px] text-slate-400">Optional · JPG or PNG up to 5 MB</span>
              </span>
              <input type="file" accept="image/jpeg,image/png" onChange={handleStatusPhotoChange} className="sr-only" />
            </label>
            {statusPhotoError && <p role="alert" className="mt-1 text-[11px] text-rose-600">{statusPhotoError}</p>}

            <div className="-mx-5 -mb-5 mt-5 flex justify-end gap-2 border-t border-slate-100 bg-[#fbfcfd] px-5 py-4 sm:-mx-6 sm:-mb-6 sm:px-6">
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-5 text-[13px] font-semibold text-[#526271] transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 rounded-lg bg-[#07818a] px-5 text-[13px] font-semibold text-white transition hover:bg-[#066d75]"
              >
                Confirm Update
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

function CrewDashboard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showCrew, setShowCrew] = useState(false);
  const [isTripDetailsOpen, setIsTripDetailsOpen] = useState(false);
  const pageSize = 5;

  const filteredBookings = useMemo(() => bookingRows.filter((booking) => {
    const matchesSearch = `${booking.pnr} ${booking.passenger} ${booking.route}`
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    const matchesStatus = statusFilter === "All statuses" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [search, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredBookings.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleBookings = filteredBookings.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const updateSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const updateStatusFilter = (status) => {
    setStatusFilter(status);
    setPage(1);
    setIsFilterOpen(false);
  };

  if (isTripDetailsOpen) {
    return <CrewTripDetails onBack={() => setIsTripDetailsOpen(false)} />;
  }

  return (
    <main className="min-h-screen bg-[#f5f8f9] px-4 py-4 text-[#27394b] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-none">
        {/* <header className="flex min-h-[58px] items-center justify-between gap-4 rounded-full border border-slate-100 bg-white px-4 shadow-[0_5px_20px_rgba(23,61,72,0.06)] sm:px-5">
          <Link to="/crew-dashboard" className="flex shrink-0 items-center gap-2.5" aria-label="BusGo home">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#108592] text-white">
              <BusFront size={17} />
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-[14px] font-bold tracking-tight text-[#233548]">BusGo</span>
              <span className="block text-[12px] font-medium tracking-wide text-slate-400">PARTNER HUB</span>
            </span>
          </Link>

          <nav className="no-scrollbar flex min-w-0 flex-1 items-center justify-center gap-0.5 overflow-x-auto rounded-full bg-[#f1f7f7] p-1 sm:mx-5 sm:max-w-[620px] sm:gap-1">
            {navigation.map((item, index) => (
              <Link
                key={item.label}
                to={item.to}
                className={`shrink-0 rounded-full px-3 py-2 text-[14px] font-medium transition-colors ${
                  index === 0
                    ? "bg-[#138795] text-white shadow-sm"
                    : "text-[#637579] hover:bg-white hover:text-[#138795]"
                }`}
              >
                {item.label}
                {["Fleet", "Routes", "Trips"].includes(item.label) && (
                  <ChevronDown className="ml-1 inline-block" size={10} />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button type="button" aria-label="Add new item" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#138795] text-white transition hover:bg-[#0b6975]">
              <Plus size={16} />
            </button>
            <button type="button" aria-label="Search" className="hidden h-8 w-8 items-center justify-center rounded-full bg-[#f3f7f8] text-[#789096] sm:flex">
              <Search size={15} />
            </button>
            <button type="button" aria-label="Notifications" className="relative hidden h-8 w-8 items-center justify-center rounded-full bg-[#f3f7f8] text-[#789096] sm:flex">
              <Bell size={15} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full border border-white bg-[#f36c68]" />
            </button>
            <button type="button" className="flex items-center gap-2 rounded-full bg-[#f6f8f8] py-1 pl-1 pr-2.5 text-left">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0e8791] text-[13px] font-semibold text-white">V</span>
              <span className="hidden leading-tight md:block">
                <span className="block text-[13px] font-semibold text-[#334657]">Venkateshwaran</span>
                <span className="block text-[12px] text-slate-400">Fleet Owner</span>
              </span>
              <ChevronDown size={12} className="hidden text-slate-400 md:block" />
            </button>
          </div>
        </header> */}

        <section className="mt-7">
          <h1 className="text-3xl font-semibold tracking-tight text-[#27394b]">Crew Dashboard Overview</h1>
          <p className="mt-1 text-[15px] text-[#718286]">Live bus tracking, intercity routes, and passenger booking engine</p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <OverviewCard icon={Map} value="2" label="Today’s trips" caption="1 ongoing now" />
            <OverviewCard icon={CalendarDays} value="3" label="Upcoming trips" caption="Next 20 Jun" />
            <OverviewCard icon={BusFront} value="1" label="Ongoing trip" caption="Boarding window" />
            <OverviewCard icon={Check} value="18" label="Completed trips" caption="This month" />
          </div>
        </section>

        <section className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[1.55fr_1fr]">
          <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_12px_rgba(27,65,75,0.04)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[13px] font-semibold uppercase tracking-wide text-[#fa6b77]">Live duty</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1f1ff] px-2.5 py-1 text-[13px] font-medium text-[#7373d9]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8585f1]" />
                Boarding Started
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#293b4e] sm:text-3xl">Coimbatore → Madurai</h2>
            <p className="mt-0.5 text-[13px] text-slate-400">Kovai Express Travels · BUS-TRIP-2026-001</p>

            <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div>
                <p className="text-[13px] font-semibold text-[#15949c]">CBE</p>
                <p className="mt-1 text-lg font-semibold">Coimbatore</p>
                <p className="mt-0.5 text-[13px] text-slate-400">07:30 AM</p>
              </div>
              <div className="w-full min-w-[72px] sm:min-w-[130px]">
                <p className="mb-1 text-center text-[12px] text-slate-400">6h 30m</p>
                <div className="relative h-px bg-[#dce7eb]">
                  <span className="absolute left-1/2 top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#e1edef] bg-white text-[#198a97]">
                    <BusFront size={11} />
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-semibold text-[#fb735f]">MDU</p>
                <p className="mt-1 text-lg font-semibold">Madurai</p>
                <p className="mt-0.5 text-[13px] text-slate-400">02:00 PM</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-[#fbfcfd] px-2.5 py-2">
                <BusFront size={14} className="shrink-0 text-[#15949c]" />
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Bus registration</p>
                  <p className="mt-0.5 truncate text-[13px] font-semibold">TN 38 AB 1234</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-[#fbfcfd] px-2.5 py-2">
                <Clock3 size={14} className="shrink-0 text-[#15949c]" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Reporting time</p>
                  <p className="mt-0.5 text-[13px] font-semibold">07:00 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-[#fbfcfd] px-2.5 py-2">
                <UsersRound size={14} className="shrink-0 text-[#15949c]" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Passengers</p>
                  <p className="mt-0.5 text-[13px] font-semibold">25 booked</p>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {["RK", "SK", "M"].map((initials) => (
                    <span key={initials} className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#e8eef2] text-[10px] font-semibold text-[#556979]">
                      {initials}
                    </span>
                  ))}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#435465]">Rajesh, Suresh &amp; Mani</p>
                  <p className="text-[12px] text-slate-400">Driver · Conductor · Cleaner</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowCrew((isOpen) => !isOpen)} className="text-[13px] font-medium text-[#148994] hover:text-[#0b6570]">
                {showCrew ? "Hide crew" : "View crew"}
              </button>
            </div>
            {showCrew && (
              <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-[#f4f9fa] p-3 text-[13px]">
                <div><p className="font-semibold">Rajesh K</p><p className="mt-0.5 text-slate-400">Driver</p></div>
                <div><p className="font-semibold">Suresh S</p><p className="mt-0.5 text-slate-400">Conductor</p></div>
                <div><p className="font-semibold">Mani</p><p className="mt-0.5 text-slate-400">Cleaner</p></div>
              </div>
            )}
          </article>

          <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_12px_rgba(27,65,75,0.04)]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[16px] font-semibold text-[#334454]">Next upcoming trip</h2>
                <p className="mt-0.5 text-[13px] text-slate-400">Friday, 20 June</p>
              </div>
              <Link to="/vendor/trip-management" className="text-[13px] font-medium text-[#148994] hover:underline">View all</Link>
            </div>
            <div className="mt-2 space-y-2">
              {upcomingTrips.map((trip, index) => (
                <div key={`${trip.bus}-${index}`} className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-[#fbfdfd] px-2.5 py-2">
                  <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg bg-[#e8f7f6] text-[#138e91]">
                    <span className="text-[15px] font-semibold leading-none">{trip.date}</span>
                    <span className="mt-0.5 text-[11px] font-semibold">{trip.month}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-[#3e4e5d]">{trip.route}</p>
                    <p className="mt-0.5 truncate text-[12px] text-slate-400">{trip.bus} · {trip.time}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#e9f8f7] px-2 py-1 text-[12px] font-medium text-[#138e91]">Upcoming</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-3 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_3px_12px_rgba(27,65,75,0.04)]">
          <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 className="text-[17px] font-semibold text-[#334454]">Recent Trips</h2>
              <p className="mt-0.5 text-[13px] text-slate-400">Live passenger ticket reservations &amp; payment receipts across all routes</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex h-8 min-w-[160px] flex-1 items-center gap-1.5 rounded-full border border-slate-100 bg-[#fbfcfd] px-2.5 sm:flex-none">
                <Search size={12} className="shrink-0 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={updateSearch}
                  placeholder="Search PNR, passenger..."
                  aria-label="Search bookings"
                  className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-slate-400"
                />
              </label>
              <div className="relative">
                <button type="button" onClick={() => setIsFilterOpen((isOpen) => !isOpen)} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-slate-100 px-2.5 text-[13px] font-medium text-[#526271] hover:bg-slate-50">
                  <SlidersHorizontal size={12} />
                  Filter
                </button>
                {isFilterOpen && (
                  <div className="absolute right-0 top-9 z-10 w-36 rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg">
                    {["All statuses", "Confirmed", "Pending", "Cancelled"].map((status) => (
                      <button key={status} type="button" onClick={() => updateStatusFilter(status)} className={`block w-full rounded-lg px-2.5 py-2 text-left text-[14px] hover:bg-[#f1f7f7] ${statusFilter === status ? "font-semibold text-[#138795]" : "text-slate-600"}`}>
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button type="button" onClick={() => exportBookingsToCsv(filteredBookings)} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#138795] px-2.5 text-[13px] font-medium text-white transition hover:bg-[#0d6d77]">
                <ArrowDownToLine size={12} />
                Export CSV
              </button>
              <Link to="/vendor/bookings" className="hidden items-center gap-1 text-[13px] font-medium text-[#148994] sm:inline-flex">
                View All <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left">
              <thead>
                <tr className="bg-[#f7fafb] text-[12px] font-medium uppercase tracking-wide text-[#87979d]">
                  <th className="px-4 py-2.5 font-medium sm:px-5">PNR / Ticket</th>
                  <th className="px-3 py-2.5 font-medium">Passenger</th>
                  <th className="px-3 py-2.5 font-medium">Route</th>
                  <th className="px-3 py-2.5 font-medium">Travel date</th>
                  <th className="px-3 py-2.5 font-medium">Seat berth</th>
                  <th className="px-3 py-2.5 font-medium">Fare</th>
                  <th className="px-3 py-2.5 font-medium">Payment</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 text-center font-medium sm:px-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleBookings.map((booking) => (
                  <tr key={booking.pnr} className="text-[13px] text-[#566978] transition-colors hover:bg-[#fbfdfd]">
                    <td className="whitespace-nowrap px-4 py-2.5 font-semibold text-[#138795] sm:px-5">{booking.pnr}</td>
                    <td className="whitespace-nowrap px-3 py-2.5">
                      <span className="inline-flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e5f5f5] text-[10px] font-semibold text-[#138795]">{booking.initials}</span>
                        <span className="font-medium text-[#425465]">{booking.passenger}</span>
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5">{booking.route}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-slate-400">{booking.date}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-[#46596a]">{booking.seat}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-[#425465]">{booking.fare}</td>
                    <td className="whitespace-nowrap px-3 py-2.5">
                      <span className={`rounded-full px-2 py-1 text-[12px] font-medium ${booking.payment === "Pending" ? "bg-[#fff4e5] text-[#be741c]" : booking.payment === "Refunded" ? "bg-[#fff0f3] text-[#d66a82]" : "bg-[#f0f3f4] text-[#65777e]"}`}>
                        {booking.payment}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5">
                      <span className={`rounded-full px-2 py-1 text-[12px] font-medium ${statusClassNames[booking.status]}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center sm:px-5">
                      <button type="button" onClick={() => setIsTripDetailsOpen(true)} aria-label={`View trip details for ${booking.pnr}`} className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f0f4f6] text-[#718391] transition hover:bg-[#e2f1f2] hover:text-[#138795]">
                        <Eye size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
                {visibleBookings.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center text-[14px] text-slate-400">No bookings match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className="flex flex-col gap-3 px-4 py-3 text-[13px] text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p>
              Showing {filteredBookings.length ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filteredBookings.length)} of {filteredBookings.length} bookings
            </p>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1} className="inline-flex h-7 items-center gap-1 rounded-full border border-slate-100 px-2 text-[13px] disabled:cursor-not-allowed disabled:opacity-40">
                <ChevronLeft size={12} /> Previous
              </button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} className={`h-7 min-w-7 rounded-full border px-2 text-[13px] ${pageNumber === currentPage ? "border-[#138795] bg-[#138795] font-semibold text-white" : "border-slate-100 text-[#60717d] hover:bg-slate-50"}`}>
                  {pageNumber}
                </button>
              ))}
              <button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={currentPage === pageCount} className="inline-flex h-7 items-center gap-1 rounded-full border border-slate-100 px-2 text-[13px] disabled:cursor-not-allowed disabled:opacity-40">
                Next <ChevronRight size={12} />
              </button>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}

export default CrewDashboard;
