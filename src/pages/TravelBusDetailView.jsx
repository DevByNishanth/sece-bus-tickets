import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeft,
  BusFront,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Eye,
  Filter,
  FileCheck2,
  FileText,
  Gauge,
  Layers,
  MapPin,
  Search,
  Users,
  Wrench,
} from "lucide-react";
import VendorNavbar from "./vendor/VendorNavbar.jsx";

const busDocuments = [
  ["Registration Certificate", "tn38ab4521_rc_certificate.pdf", "Verified"],
  ["Tourist Permit", "all_india_tourist_permit.pdf", "Verified"],
  ["Insurance Policy", "vehicle_insurance_policy.pdf", "Verified"],
  ["Fitness Certificate", "vehicle_fitness_certificate.pdf", "Verified"],
];

const tripStatuses = ["Scheduled", "In Progress", "Draft", "Rejected"];

const tripStatusStyles = {
  Scheduled: "bg-teal-50 text-teal-700",
  "In Progress": "bg-indigo-50 text-indigo-700",
  Draft: "bg-slate-100 text-slate-600",
  Rejected: "bg-rose-50 text-rose-700",
};

function exportTrips(rows) {
  const header = ["PNR / Ticket", "Passenger", "Route", "Travel Date", "Seat Berth", "Status"];
  const content = rows.map((trip) => [trip.pnr, trip.passenger, trip.route, trip.date, trip.seats, trip.status]);
  const csv = [header, ...content]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "bus-trip-details.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function BusTripDetails({ bus }) {
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [page, setPage] = useState(1);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const pageSize = 4;
  const trips = Array.isArray(bus.tripRecords) ? bus.tripRecords : [];
  const normalizedTrips = useMemo(() => trips.map((trip, index) => ({
    id: trip.id ?? trip._id ?? trip.tripId ?? index,
    pnr: trip.pnr ?? trip.tripId ?? trip.id ?? "—",
    passenger: trip.passengerName ?? trip.passenger?.name ?? trip.passenger ?? "—",
    route: (trip.route ?? trip.routeName ?? [trip.origin, trip.destination].filter(Boolean).join(" → ")) || "—",
    service: trip.service ?? trip.operator ?? bus.operator,
    date: trip.journeyDate ?? trip.travelDate ?? trip.date ?? "—",
    time: (trip.departureArrival ?? [trip.departureTime, trip.arrivalTime].filter(Boolean).join(" – ")) || "—",
    seats: trip.seatLayout ?? trip.seats ?? "—",
    status: trip.status ?? "Scheduled",
  })), [bus.operator, trips]);

  const filteredTrips = useMemo(() => {
    const search = query.trim().toLowerCase();
    return normalizedTrips.filter((trip) => {
      const matchesSearch = [trip.pnr, trip.passenger, trip.route]
        .some((value) => value.toLowerCase().includes(search));
      return matchesSearch && (statusFilter === "All statuses" || trip.status === statusFilter);
    });
  }, [query, statusFilter, normalizedTrips]);

  const totalPages = Math.max(1, Math.ceil(filteredTrips.length / pageSize));
  const visibleTrips = filteredTrips.slice((page - 1) * pageSize, page * pageSize);
  const firstResult = filteredTrips.length ? (page - 1) * pageSize + 1 : 0;
  const lastResult = Math.min(page * pageSize, filteredTrips.length);

  if (trips.length === 0) {
    return (
      <section className="overflow-hidden rounded-xl border border-[#e1ebee] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5 text-left">
            <thead className="bg-[#f3f7f8] text-[10px] font-semibold uppercase tracking-wide text-[#687d86]">
              <tr>
                <th className="px-4 py-3">Trip ID</th>
                <th className="px-3 py-3">Route &amp; Direction</th>
                <th className="px-3 py-3">Journey Date</th>
                <th className="px-3 py-3">Departure – Arrival</th>
                <th className="px-3 py-3">Layout</th>
                <th className="px-3 py-3">Booked</th>
                <th className="px-3 py-3">Driver &amp; Crew</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="8" className="h-72 px-4 py-8">
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e6f7f5] text-[#078a97]"><MapPin size={22} aria-hidden="true" /></span>
                    <h2 className="mt-4 text-sm font-semibold text-slate-800">No trips found</h2>
                    <p className="mt-1 text-xs text-slate-500">Try another filter or create a new trip for this bus.</p>
                    <button type="button" onClick={() => bus.onAddTrip?.()} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#078a97] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#067681]">
                      <span aria-hidden="true">+</span> Add Trip
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
        <label className="relative min-w-48 flex-1 sm:flex-none">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#617983]" aria-hidden="true" />
          <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search PNR, passenger..." className="h-9 w-full rounded-lg border border-[#e3ecef] bg-[#f7f9fa] pl-8 pr-3 text-xs outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-50" />
        </label>
        <div className="relative">
          <button type="button" onClick={() => setFilterOpen((open) => !open)} aria-expanded={filterOpen} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e3ecef] bg-[#f7f9fa] px-3 text-xs font-medium text-slate-700 hover:bg-slate-100"><Filter size={13} aria-hidden="true" /> Filter <ChevronDown size={12} aria-hidden="true" /></button>
          {filterOpen && <select aria-label="Filter trips by status" autoFocus value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} onBlur={() => setFilterOpen(false)} className="absolute right-0 top-11 z-10 w-40 rounded-lg border border-slate-200 bg-white p-2 text-sm shadow-lg outline-none"><option>All statuses</option>{tripStatuses.map((status) => <option key={status}>{status}</option>)}</select>}
        </div>
        <button type="button" onClick={() => exportTrips(filteredTrips)} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#078a97] px-3 text-xs font-medium text-white transition hover:bg-[#067681]"><ArrowDownToLine size={13} aria-hidden="true" /> Export CSV</button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#e4ecef]">
        <table className="w-full min-w-212.5 text-left">
          <thead className="bg-[#f3f7f8] text-[10px] font-semibold uppercase tracking-[0.04em] text-[#687d86]"><tr><th className="px-4 py-3">PNR / Ticket</th><th className="px-3 py-3">Passenger</th><th className="px-3 py-3">Route</th><th className="px-3 py-3">Travel Date</th><th className="px-3 py-3">Seat Berth</th><th className="px-3 py-3">Status</th><th className="px-3 py-3 text-center">Actions</th></tr></thead>
          <tbody className="divide-y divide-[#e9eff1]">
            {visibleTrips.map((trip) => (
              <tr key={trip.id} className="h-14 transition-colors hover:bg-[#f9fbfb]">
                <td className="whitespace-nowrap px-4 py-2 text-[11px] font-semibold text-teal-800">{trip.pnr}</td>
                <td className="whitespace-nowrap px-3 py-2"><p className="text-[11px] font-medium text-[#172526]">{trip.passenger}</p><p className="mt-0.5 text-[10px] text-[#94a3ad]">{trip.service}</p></td>
                <td className="whitespace-nowrap px-3 py-2 text-[11px] font-semibold text-slate-900">{trip.route}</td>
                <td className="whitespace-nowrap px-3 py-2 text-[11px] text-[#536b80]">{trip.date}<span className="block text-[10px] text-[#94a3ad]">{trip.time}</span></td>
                <td className="whitespace-nowrap px-3 py-2 text-[11px] font-semibold text-[#172526]">{trip.seats}</td>
                <td className="px-3 py-2"><span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium ${tripStatusStyles[trip.status]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />{trip.status}</span></td>
                <td className="px-3 py-2 text-center"><button type="button" onClick={() => setSelectedTrip(trip)} aria-label={`View trip ${trip.pnr}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f4f7] text-[#536b80] transition hover:bg-teal-50 hover:text-teal-700"><Eye size={15} aria-hidden="true" /></button></td>
              </tr>
            ))}
            {visibleTrips.length === 0 && <tr><td colSpan="7" className="px-4 py-10 text-center text-sm text-slate-500">No trips match your search.</td></tr>}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-col gap-3 pt-4 text-xs text-[#637980] sm:flex-row sm:items-center sm:justify-between">
        <p>Showing <span className="font-medium text-[#263638]">{firstResult}–{lastResult}</span> of {filteredTrips.length} trips</p>
        <nav aria-label="Trip pagination" className="flex items-center gap-1.5">
          <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="rounded-lg border border-[#e7edef] px-3 py-2 text-[11px] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
          {[1, 2, 3].filter((number) => number <= totalPages).map((number) => <button key={number} type="button" onClick={() => setPage(number)} aria-current={page === number ? "page" : undefined} className={`h-8 min-w-8 rounded-lg border px-2 text-[11px] font-medium ${page === number ? "border-[#078a97] bg-[#078a97] text-white" : "border-[#e7edef] bg-white text-slate-700 hover:bg-slate-50"}`}>{number}</button>)}
          {totalPages > 4 && <span className="px-1 text-slate-500">...</span>}
          {totalPages > 3 && <button type="button" onClick={() => setPage(totalPages)} aria-current={page === totalPages ? "page" : undefined} className={`h-8 min-w-8 rounded-lg border px-2 text-[11px] font-medium ${page === totalPages ? "border-[#078a97] bg-[#078a97] text-white" : "border-[#e7edef] bg-white text-slate-700 hover:bg-slate-50"}`}>{totalPages}</button>}
          <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages} className="inline-flex items-center gap-1 rounded-lg border border-[#e7edef] px-3 py-2 text-[11px] font-medium text-[#263638] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Next <ChevronRight size={14} aria-hidden="true" /></button>
        </nav>
      </footer>

      {selectedTrip && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4" onClick={() => setSelectedTrip(null)}><section role="dialog" aria-modal="true" aria-label="Trip details" className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl" onClick={(event) => event.stopPropagation()}><h2 className="text-lg font-semibold text-slate-800">{selectedTrip.pnr}</h2><dl className="mt-4 grid grid-cols-2 gap-4 text-sm">{[["Passenger", selectedTrip.passenger], ["Route", selectedTrip.route], ["Travel date", selectedTrip.date], ["Time", selectedTrip.time], ["Seat berth", selectedTrip.seats], ["Status", selectedTrip.status]].map(([label, value]) => <div key={label}><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 font-medium text-slate-800">{value}</dd></div>)}</dl></section></div>}
    </>
  );
}

export default function TravelBusDetailView({ bus, onBack }) {
  const [activeTab, setActiveTab] = useState("Bus Overview");
  const details = [
    ["BUS REGISTRATION", bus.registration, BusFront],
    ["OPERATOR", bus.operator, Users],
    ["MANUFACTURER / MODEL", bus.model, Wrench],
    ["BUS TYPE", bus.specification, BusFront],
    ["DECK CONFIGURATION", bus.deck, Layers],
    ["PASSENGER CAPACITY", bus.capacity, Users],
    ["DEPOT", bus.depot, MapPin],
    ["ODOMETER", bus.odometer, Gauge],
  ];

  return (
    <div className="min-h-screen bg-[#f5f8f9] text-sm text-[#172526]">
      <VendorNavbar />
      <main className="mx-auto w-full max-w-[1600px] px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#688080]">
            <button type="button" onClick={onBack} className="hover:text-[#078a97]">VEE VEE Travels</button>
            <ChevronRight size={14} aria-hidden="true" />
            <button type="button" onClick={onBack} className="hover:text-[#078a97]">Buses</button>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="font-medium text-[#078a97]">{bus.registration}</span>
          </nav>
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-lg border border-[#dce7e9] bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
            <ArrowLeft size={15} aria-hidden="true" /> Back to Bus Overview
          </button>
        </div>

        <section className="mb-3 flex flex-col gap-3 rounded-xl border border-[#e4ecef] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:px-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e6f7f5] text-[#078a97]"><BusFront size={24} aria-hidden="true" /></span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-[#172526]">{bus.registration}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700"><CheckCircle2 size={12} aria-hidden="true" /> Active</span>
            </div>
            <p className="mt-1 text-xs text-[#688080]">{bus.operator} <span className="px-1">·</span> {bus.specification} <span className="px-1">·</span> {bus.deck} <span className="px-1">·</span> {bus.capacity}</p>
          </div>
        </section>

        <section aria-label="Trip summary" className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
          {[
            ["Total trips", bus.totalTrips, BusFront],
            ["Upcoming", bus.trips[0][0], CalendarDays],
            ["In progress", bus.inProgress, Clock3],
            ["Completed", bus.trips[1][0], CheckCircle2],
            ["Cancelled", bus.trips[2][0], Clock3],
            ["Drafts", bus.trips[4][0], FileText],
          ].map(([label, count, Icon]) => (
            <article key={label} className="rounded-lg border border-[#e7edef] bg-white px-3 py-3 shadow-sm">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#688080]"><Icon size={13} className="text-[#078a97]" aria-hidden="true" />{label}</div>
              <p className="mt-1 text-lg font-semibold leading-none text-[#172526]">{count}</p>
            </article>
          ))}
        </section>

        <section className="rounded-xl border border-[#e1ebee] bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3"><h2 className="text-base font-semibold text-[#172526]">Bus Details</h2><p className="mt-0.5 text-xs text-[#688080]">Vehicle information, operations, and trip activity</p></div>
          <div role="tablist" aria-label="Bus detail sections" className="mb-3 flex w-full max-w-md gap-1 rounded-lg bg-[#f0f5f7] p-1">
            {["Bus Overview", "Trip Details"].map((tab) => <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition ${activeTab === tab ? "bg-white text-[#078a97] shadow-sm" : "text-[#71858c] hover:text-[#078a97]"}`}>{tab}</button>)}
          </div>

          {activeTab === "Bus Overview" ? (
            <>
              <section className="overflow-hidden rounded-xl border border-[#e1ebee]">
                <header className="flex items-center gap-3 border-b border-[#e8eef0] px-4 py-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf9f7] text-[#078a97]"><BusFront size={16} aria-hidden="true" /></span><div><h3 className="text-sm font-semibold text-[#172526]">Bus Profile</h3><p className="text-[11px] text-[#81929a]">Vehicle identity and operating details</p></div></header>
                <dl className="grid grid-cols-1 divide-y divide-[#edf1f2] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
                  {details.map(([label, value, Icon], index) => <div key={label} className={`min-w-0 border-[#edf1f2] px-4 py-3 ${index % 4 !== 0 ? "lg:border-l" : ""} ${index >= 4 ? "lg:border-t" : ""}`}><dt className="flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-[#8799a6]"><Icon size={12} aria-hidden="true" />{label}</dt><dd className="mt-1 text-xs font-medium text-[#172526]">{value}</dd></div>)}
                </dl>
              </section>
              <section className="mt-3 overflow-hidden rounded-xl border border-[#e1ebee]">
                <header className="flex items-center gap-3 border-b border-[#e8eef0] px-4 py-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf9f7] text-[#078a97]"><FileCheck2 size={16} aria-hidden="true" /></span><div><h3 className="text-sm font-semibold text-[#172526]">Document Verification</h3><p className="text-[11px] text-[#81929a]">Required vehicle documents and verification status</p></div></header>
                <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2">{busDocuments.map(([title, filename, status]) => <article key={title} className="flex items-center justify-between gap-3 rounded-lg border border-[#e5ecee] p-3"><div className="flex min-w-0 items-center gap-2.5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#effaf8] text-[#078a97]"><FileText size={15} aria-hidden="true" /></span><div className="min-w-0"><h4 className="text-xs font-semibold text-[#172526]">{title}</h4><p className="mt-0.5 truncate text-[10px] text-[#81929a]">{filename}</p></div></div><span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700">{status}</span></article>)}</div>
              </section>
            </>
          ) : (
            <BusTripDetails bus={bus} />
          )}
        </section>
      </main>
    </div>
  );
}
