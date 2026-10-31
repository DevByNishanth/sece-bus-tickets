import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeft,
  Banknote,
  Building2,
  BusFront,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import VendorNavbar from "./vendor/VendorNavbar.jsx";

const tripStats = [
  ["Total trips", "138", BusFront],
  ["Upcoming", "4", CalendarDays],
  ["In progress", "1", Clock3],
  ["Completed", "128", CheckCircle2],
  ["Cancelled", "3", X],
  ["Drafts", "1", FileText],
];

const profileFields = [
  ["APPLICATION ID", "TRV-2026-0012"],
  ["COMPANY ID", "CMP-0084"],
  ["LEGAL BUSINESS NAME", "Kovai Express Travels"],
  ["TRADE NAME", "Kovai Express"],
  ["BUSINESS TYPE", "Private Limited Company"],
  ["OWNER / AUTHORIZED PERSON", "R. Karthikeyan"],
  ["PHONE VERIFICATION", "+91 98765 42018 · Verified", "verified"],
  ["EMAIL VERIFICATION", "admin@kovaiexpress.in · Verified", "verified"],
  ["PAN", "AABCK4821G"],
  ["GSTIN", "33AABCK4821G1ZX"],
  ["REGISTERED DATE", "18 Mar 2017"],
  ["OPERATING LOCATIONS", "Coimbatore, Madurai, Salem"],
  ["REGISTERED ADDRESS", "42, Avinashi Road, Peelamedu, Coimbatore 641004", "wide"],
];

const documents = [
  { title: "PAN & Business Identity", filename: "kovai_express_pan_card.pdf", date: "Uploaded 12 Mar 2026 · 2.4 MB", icon: FileText },
  { title: "GST Registration Certificate", filename: "gst_reg_cert_form06.pdf", date: "Uploaded 14 Mar 2026 · 1.8 MB", icon: FileCheck2 },
  { title: "Stage Carriage Fleet Permits", filename: "tamilnadu_pb_permits_batch.pdf", date: "Uploaded 15 Mar 2026 · 4.1 MB", icon: BusFront },
  { title: "Settlement Bank Account Proof", filename: "hdfc_cancelled_cheque.pdf", date: "Uploaded 12 Mar 2026 · 960 KB", icon: Banknote },
];

const tripTypes = ["Scheduled", "In Progress", "Draft", "Rejected"];
const trips = Array.from({ length: 120 }, (_, index) => ({
  id: `TRP-24103-${index + 1}`,
  reference: "TRP-24103",
  passenger: "S. Kannan +2",
  route: "Coimbatore → Madurai",
  service: "Highway Express",
  date: "13 Jun 2025",
  time: "22:00 – 05:45 +1",
  seats: "36 / 36",
  status: tripTypes[index % tripTypes.length],
}));

const statusStyles = {
  Scheduled: "bg-teal-50 text-teal-700",
  "In Progress": "bg-indigo-50 text-indigo-700",
  Draft: "bg-slate-100 text-slate-600",
  Rejected: "bg-rose-50 text-rose-700",
};

function exportTrips(rows) {
  const header = ["Trip ID", "Passenger", "Route", "Travel Date", "Time", "Seat Berth", "Status"];
  const lines = rows.map((trip) => [trip.reference, trip.passenger, trip.route, trip.date, trip.time, trip.seats, trip.status]);
  const csv = [header, ...lines]
    .map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "bus-trips.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function TripDetails({ onSelectTrip }) {
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const filteredTrips = useMemo(() => {
    const search = query.trim().toLowerCase();
    return trips.filter((trip) => {
      const matchesSearch = [trip.reference, trip.passenger, trip.route]
        .some((value) => value.toLowerCase().includes(search));
      return matchesSearch && (statusFilter === "All statuses" || trip.status === statusFilter);
    });
  }, [query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTrips.length / pageSize));
  const visibleTrips = filteredTrips.slice((page - 1) * pageSize, page * pageSize);
  const firstResult = filteredTrips.length ? (page - 1) * pageSize + 1 : 0;
  const lastResult = Math.min(page * pageSize, filteredTrips.length);

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
        <label className="relative min-w-48 flex-1 sm:flex-none">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#617983]" aria-hidden="true" />
          <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search trip, passenger..." className="h-9 w-full rounded-lg border border-[#e3ecef] bg-[#f7f9fa] pl-8 pr-3 text-xs outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-50" />
        </label>
        <div className="relative">
          <button type="button" onClick={() => setFilterOpen((open) => !open)} aria-expanded={filterOpen} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e3ecef] bg-[#f7f9fa] px-3 text-xs font-medium text-slate-700 hover:bg-slate-100">
            <Filter size={13} aria-hidden="true" /> Filter <ChevronDown size={12} aria-hidden="true" />
          </button>
          {filterOpen && <select aria-label="Filter trips by status" autoFocus value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} onBlur={() => setFilterOpen(false)} className="absolute right-0 top-11 z-10 w-40 rounded-lg border border-slate-200 bg-white p-2 text-sm shadow-lg outline-none"><option>All statuses</option>{tripTypes.map((status) => <option key={status}>{status}</option>)}</select>}
        </div>
        <button type="button" onClick={() => exportTrips(filteredTrips)} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#078a97] px-3 text-xs font-medium text-white transition hover:bg-[#067681]"><ArrowDownToLine size={13} aria-hidden="true" /> Export CSV</button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#e4ecef]">
        <table className="w-full min-w-212.5 text-left">
          <thead className="bg-[#f3f7f8] text-[10px] font-semibold uppercase tracking-[0.04em] text-[#687d86]">
            <tr>
              <th className="px-4 py-3">PNR / Ticket</th>
              <th className="px-3 py-3">Passenger</th>
              <th className="px-3 py-3">Route</th>
              <th className="px-3 py-3">Travel Date</th>
              <th className="px-3 py-3">Seat Berth</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e9eff1]">
            {visibleTrips.map((trip) => (
              <tr key={trip.id} className="h-14 transition-colors hover:bg-[#f9fbfb]">
                <td className="whitespace-nowrap px-4 py-2 text-[11px] font-semibold text-teal-800">{trip.reference}</td>
                <td className="whitespace-nowrap px-3 py-2"><p className="text-[11px] font-medium text-[#172526]">{trip.passenger}</p><p className="mt-0.5 text-[10px] text-[#94a3ad]">{trip.service}</p></td>
                <td className="whitespace-nowrap px-3 py-2 text-[11px] font-semibold text-slate-900">{trip.route}</td>
                <td className="whitespace-nowrap px-3 py-2 text-[11px] text-[#536b80]">{trip.date}<span className="block text-[10px] text-[#94a3ad]">{trip.time}</span></td>
                <td className="whitespace-nowrap px-3 py-2 text-[11px] font-semibold text-[#172526]">{trip.seats}</td>
                <td className="px-3 py-2"><span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium ${statusStyles[trip.status]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />{trip.status}</span></td>
                <td className="px-3 py-2 text-center"><button type="button" onClick={() => onSelectTrip(trip)} aria-label={`View trip ${trip.reference}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f4f7] text-[#536b80] transition hover:bg-teal-50 hover:text-teal-700"><Eye size={15} aria-hidden="true" /></button></td>
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
    </>
  );
}

export default function AdminBusDetailScreen({ booking, onBack }) {
  const [activeTab, setActiveTab] = useState("Bus Overview");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const busNumber = booking.busNumber || "TN 38 AB 4521";

  return (
    <div className="min-h-screen bg-[#f5f8f9] text-sm text-[#172526]">
      <VendorNavbar />
      <main className="mx-auto w-full max-w-[1600px] px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#688080]"><button type="button" onClick={onBack} className="hover:text-[#078a97]">My Buses</button><ChevronRight size={14} aria-hidden="true" /><span className="font-medium text-[#078a97]">{busNumber} / ABT Travels</span></nav>
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-lg border border-[#dce7e9] bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"><ArrowLeft size={15} aria-hidden="true" /> Back to Bus List</button>
        </div>

        <section className="mb-3 flex flex-col gap-3 rounded-xl border border-[#e4ecef] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:px-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e6f7f5] text-[#078a97]"><BusFront size={24} aria-hidden="true" /></span>
          <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h1 className="text-xl font-semibold text-[#172526]">{busNumber}</h1><span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700"><CheckCircle2 size={12} aria-hidden="true" /> Active</span></div><p className="mt-1 text-xs text-[#688080]">Emerald Express <span className="px-1">·</span> AC Sleeper <span className="px-1">·</span> Double deck <span className="px-1">·</span> 36 seats</p></div>
        </section>

        <section aria-label="Trip summary" className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {tripStats.map(([label, count, Icon]) => <article key={label} className="rounded-lg border border-[#e7edef] bg-white px-3 py-3 shadow-sm"><div className="flex items-center gap-1.5 text-[10px] font-medium text-[#688080]"><Icon size={13} className="text-[#078a97]" aria-hidden="true" /> {label}</div><p className="mt-1 text-lg font-semibold leading-none text-[#172526]">{count}</p></article>)}
        </section>

        <section className="rounded-xl border border-[#e1ebee] bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3"><h2 className="text-base font-semibold text-[#172526]">Bus Details</h2><p className="mt-0.5 text-xs text-[#688080]">Live passenger ticket reservations &amp; payment receipts across all routes</p></div>
          <div role="tablist" aria-label="Bus detail sections" className="mb-3 flex w-full max-w-md gap-1 rounded-lg bg-[#f0f5f7] p-1">
            {["Bus Overview", "Trip Details"].map((tab) => <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition ${activeTab === tab ? "bg-white text-[#078a97] shadow-sm" : "text-[#71858c] hover:text-[#078a97]"}`}>{tab}</button>)}
          </div>

          {activeTab === "Bus Overview" ? (
            <>
              <section className="overflow-hidden rounded-xl border border-[#e1ebee]">
                <header className="flex items-center gap-3 border-b border-[#e8eef0] px-4 py-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf9f7] text-[#078a97]"><Building2 size={16} aria-hidden="true" /></span><div><h3 className="text-sm font-semibold text-[#172526]">Bus Profile</h3><p className="text-[11px] text-[#81929a]">Legal identity and operating information</p></div></header>
                <dl className="grid grid-cols-1 divide-y divide-[#edf1f2] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
                  {profileFields.map(([label, value, variant], index) => <div key={label} className={`min-w-0 border-[#edf1f2] px-4 py-3 ${index % 3 !== 0 ? "lg:border-l" : ""} ${index >= 3 ? "lg:border-t" : ""} ${variant === "wide" ? "sm:col-span-2 lg:col-span-3" : ""}`}><dt className="text-[10px] font-medium tracking-wide text-[#8799a6]">{label}</dt><dd className={`mt-1 wrap-break-word text-xs font-medium ${variant === "verified" ? "text-emerald-700" : "text-[#172526]"}`}>{label === "PHONE VERIFICATION" && <Phone size={12} className="mr-1 inline" aria-hidden="true" />}{label === "EMAIL VERIFICATION" && <Mail size={12} className="mr-1 inline" aria-hidden="true" />}{label === "OPERATING LOCATIONS" && <MapPin size={12} className="mr-1 inline" aria-hidden="true" />}{value}</dd></div>)}
                </dl>
              </section>

              <section className="mt-3 overflow-hidden rounded-xl border border-[#e1ebee]">
                <header className="flex items-center gap-3 border-b border-[#e8eef0] px-4 py-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf9f7] text-[#078a97]"><FileCheck2 size={16} aria-hidden="true" /></span><div><h3 className="text-sm font-semibold text-[#172526]">Document Verification</h3><p className="text-[11px] text-[#81929a]">Requirements shown are configured for this business type</p></div></header>
                <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2">
                  {documents.map(({ title, filename, date, icon: Icon }) => <article key={title} className="rounded-lg border border-[#e5ecee] p-3"><div className="flex items-start gap-2.5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#effaf8] text-[#078a97]"><Icon size={15} aria-hidden="true" /></span><div className="min-w-0 flex-1"><h4 className="text-xs font-semibold text-[#172526]">{title}</h4><p className="mt-0.5 text-[10px] text-[#81929a]">Required document</p></div></div><div className="mt-3 flex flex-wrap items-end justify-between gap-2 border-t border-[#edf1f2] pt-2.5"><div className="min-w-0"><p className="truncate text-[10px] font-medium text-[#536b80]">{filename}</p><p className="mt-0.5 text-[10px] text-[#94a3ad]">{date}</p></div><button type="button" onClick={() => setSelectedDocument({ title, filename })} className="shrink-0 text-[11px] font-medium text-[#078a97] hover:underline">Review</button></div></article>)}
                </div>
              </section>
            </>
          ) : (
            <TripDetails onSelectTrip={setSelectedTrip} />
          )}
        </section>
      </main>

      {(selectedDocument || selectedTrip) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4" onClick={() => { setSelectedDocument(null); setSelectedTrip(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="detail-modal-title" className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#078a97]">{selectedDocument ? "Document review" : "Trip details"}</p><h2 id="detail-modal-title" className="mt-1 text-lg font-semibold text-slate-800">{selectedDocument?.title || selectedTrip?.reference}</h2></div><button type="button" aria-label="Close details" onClick={() => { setSelectedDocument(null); setSelectedTrip(null); }} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"><X size={17} /></button></div>
            {selectedDocument ? <div className="mt-4 flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center"><FileText size={28} className="text-[#078a97]" aria-hidden="true" /><p className="mt-3 text-sm font-medium text-slate-800">{selectedDocument.filename}</p><p className="mt-1 text-xs text-slate-500">Document preview is not available in this sample.</p></div> : <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">{[["Passenger", selectedTrip?.passenger], ["Route", selectedTrip?.route], ["Travel date", selectedTrip?.date], ["Departure / arrival", selectedTrip?.time], ["Seat berth", selectedTrip?.seats], ["Status", selectedTrip?.status]].map(([label, value]) => <div key={label}><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 font-medium text-slate-800">{value}</dd></div>)}</dl>}
          </section>
        </div>
      )}
    </div>
  );
}
