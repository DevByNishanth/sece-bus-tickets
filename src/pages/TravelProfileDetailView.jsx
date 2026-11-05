import { useState } from "react";
import {
  ArrowLeft,
  AlertTriangle,
  Banknote,
  BusFront,
  Building2,
  Check,
  ChevronRight,
  Clock3,
  Ellipsis,
  FileCheck2,
  FileText,
  MapPin,
  Phone,
  Mail,
  X,
} from "lucide-react";
import VendorNavbar from "./vendor/VendorNavbar.jsx";
import TravelBusDetailView from "./TravelBusDetailView.jsx";

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

const fleetSummary = [
  { label: "Authorized fleet", count: "24 buses", icon: BusFront, tone: "bg-[#eaf9f7] text-[#078a97]" },
  { label: "Available today", count: "16 buses", icon: Check, tone: "bg-emerald-50 text-emerald-600" },
  { label: "On trip now", count: "5 buses", icon: MapPin, tone: "bg-orange-50 text-orange-500" },
  { label: "Under maintenance", count: "3 buses", icon: Clock3, tone: "bg-slate-100 text-slate-500" },
];

const sampleTripRecords = [
  {
    tripId: "TRP-24103",
    passengerName: "S. Kannan",
    route: "Coimbatore → Madurai",
    journeyDate: "13 Jun 2025",
    departureTime: "22:00",
    arrivalTime: "05:45 +1",
    seatLayout: "36 / 36",
    service: "Highway Express",
    status: "Scheduled",
  },
  {
    tripId: "TRP-24104",
    passengerName: "R. Kumar",
    route: "Coimbatore → Madurai",
    journeyDate: "13 Jun 2025",
    departureTime: "22:00",
    arrivalTime: "05:45 +1",
    seatLayout: "36 / 36",
    service: "Highway Express",
    status: "In Progress",
  },
  {
    tripId: "TRP-24105",
    passengerName: "M. Priya",
    route: "Coimbatore → Madurai",
    journeyDate: "14 Jun 2025",
    departureTime: "22:00",
    arrivalTime: "05:45 +1",
    seatLayout: "36 / 36",
    service: "Highway Express",
    status: "Draft",
  },
  {
    tripId: "TRP-24106",
    passengerName: "K. Suresh",
    route: "Coimbatore → Madurai",
    journeyDate: "14 Jun 2025",
    departureTime: "22:00",
    arrivalTime: "05:45 +1",
    seatLayout: "36 / 36",
    service: "Highway Express",
    status: "Rejected",
  },
];

const fleet = [
  {
    registration: "TN 38 AB 4521",
    operator: "Emerald Express",
    specification: "AC Sleeper",
    deck: "Double deck",
    capacity: "36 seats",
    model: "Volvo 9400 Tourist",
    depot: "Chennai Central Depot",
    odometer: "125,000 km",
    totalTrips: "138",
    inProgress: "1",
    pending: "2",
    tripRecords: sampleTripRecords,
    trips: [["4", "Upcoming"], ["128", "Completed"], ["3", "Cancelled"], ["2", "Rejected"], ["2", "Drafts"]],
  },
  {
    registration: "TN 58 N 9912",
    operator: "Vaigai Cruiser",
    specification: "AC Seater",
    deck: "Single deck",
    capacity: "42 seats",
    model: "Ashok Leyland Viking",
    depot: "Madurai Central Depot",
    odometer: "98,400 km",
    totalTrips: "101",
    inProgress: "2",
    pending: "1",
    trips: [["3", "Upcoming"], ["94", "Completed"], ["0", "Cancelled"], ["0", "Rejected"], ["2", "Drafts"]],
  },
  {
    registration: "KA 01 AF 7824",
    operator: "City Connect",
    specification: "Non-AC Seater",
    deck: "Single deck",
    capacity: "48 seats",
    model: "BharatBenz 1624",
    depot: "Bengaluru Depot",
    odometer: "76,200 km",
    totalTrips: "83",
    inProgress: "1",
    pending: "0",
    trips: [["2", "Upcoming"], ["76", "Completed"], ["4", "Cancelled"], ["1", "Rejected"], ["0", "Drafts"]],
  },
];

const reviewChecklist = [
  "Company information reviewed",
  "Business identity documents verified",
  "Owner details and contact information verified",
  "PAN and GST registration verified",
  "Fleet permits and operating locations verified",
  "Settlement bank account proof verified",
];

const statusStyles = {
  Approved: "bg-emerald-50 text-emerald-700",
  Pending: "border border-amber-200 bg-amber-50 text-amber-700",
  Rejected: "bg-rose-50 text-rose-700",
};

export default function TravelProfileDetailView({
  onBack,
  status: initialStatus = "Pending",
  onStatusChange,
  buses = fleet,
  Navbar = VendorNavbar,
}) {
  const [activeTab, setActiveTab] = useState("Travels Overview");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [status, setStatus] = useState(initialStatus);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [correctionItem, setCorrectionItem] = useState("Document correction");
  const [correctionRemarks, setCorrectionRemarks] = useState("");
  const [notice, setNotice] = useState("");

  function changeStatus(nextStatus) {
    setStatus(nextStatus);
    onStatusChange?.(nextStatus);
    setReviewOpen(false);
    setRejectConfirmOpen(false);
  }

  function submitCorrection(event) {
    event.preventDefault();
    if (!correctionRemarks.trim()) return;

    setCorrectionOpen(false);
    setCorrectionRemarks("");
    setNotice("Correction request sent to VEE VEE Travels.");
  }

  if (selectedBus) {
    return <TravelBusDetailView bus={selectedBus} onBack={() => setSelectedBus(null)} Navbar={Navbar} />;
  }

  return (
    <div className="min-h-screen bg-[#f5f8f9] text-sm text-[#172526]">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] px-4 pb-8 pt-3 sm:px-6 lg:px-8">
        <div className="mb-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#dce7e9] bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={15} aria-hidden="true" /> Back
          </button>
        </div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 xl:flex-nowrap">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-[#172526]">VEE VEE Travels</h1>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status] || statusStyles.Pending}`}>
                {status}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#688080]">Live passenger ticket reservations &amp; payment receipts across all routes</p>
          </div>
          <div className="flex w-full flex-wrap items-center justify-end gap-1.5 xl:w-auto xl:flex-nowrap">
            {status === "Pending" && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setCheckedItems([]);
                    setReviewOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#078A97] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#067580]"
                >
                  <Check size={16} aria-hidden="true" />
                  Approve Travel Company
                </button>
                <button
                  type="button"
                  onClick={() => setCorrectionOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#b8d5d7] bg-white px-4 py-2 text-sm font-semibold text-[#176d73] transition hover:bg-[#f4fbfa]"
                >
                  <AlertTriangle size={16} aria-hidden="true" />
                  Request Corrections
                </button>
                <button
                  type="button"
                  onClick={() => setRejectConfirmOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-400 bg-white px-4 py-2 text-sm font-semibold text-rose-500 transition hover:bg-rose-50"
                >
                  <X size={16} aria-hidden="true" />
                  Reject Application
                </button>
              </>
            )}
          </div>
        </div>

        {notice && (
          <div role="status" className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800">
            {notice}
          </div>
        )}

        <section className="rounded-xl border border-[#e1ebee] bg-white p-3 shadow-sm sm:p-4">
          <div role="tablist" aria-label="Travel profile sections" className="mb-3 flex w-full max-w-md gap-1 rounded-lg bg-[#f0f5f7] p-1">
            {["Travels Overview", "Bus Overview"].map((tab) => (
              <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition ${activeTab === tab ? "bg-white text-[#078a97] shadow-sm" : "text-[#71858c] hover:text-[#078a97]"}`}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Travels Overview" ? (
            <>
              <section className="overflow-hidden rounded-xl border border-[#e1ebee]">
                <header className="flex items-center gap-3 border-b border-[#e8eef0] px-4 py-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf9f7] text-[#078a97]"><Building2 size={16} aria-hidden="true" /></span>
                  <div><h2 className="text-sm font-semibold text-[#172526]">Company Profile</h2><p className="text-[11px] text-[#81929a]">Legal identity and operating information</p></div>
                </header>
                <dl className="grid grid-cols-1 divide-y divide-[#edf1f2] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
                  {profileFields.map(([label, value, variant], index) => (
                    <div key={label} className={`min-w-0 border-[#edf1f2] px-4 py-3 ${index % 3 !== 0 ? "lg:border-l" : ""} ${index >= 3 ? "lg:border-t" : ""} ${variant === "wide" ? "sm:col-span-2 lg:col-span-3" : ""}`}>
                      <dt className="text-[10px] font-medium tracking-wide text-[#8799a6]">{label}</dt>
                      <dd className={`mt-1 wrap-break-word text-xs font-medium ${variant === "verified" ? "text-emerald-700" : "text-[#172526]"}`}>
                        {label === "PHONE VERIFICATION" && <Phone size={12} className="mr-1 inline" aria-hidden="true" />}
                        {label === "EMAIL VERIFICATION" && <Mail size={12} className="mr-1 inline" aria-hidden="true" />}
                        {label === "OPERATING LOCATIONS" && <MapPin size={12} className="mr-1 inline" aria-hidden="true" />}
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className="mt-3 overflow-hidden rounded-xl border border-[#e1ebee]">
                <header className="flex items-center gap-3 border-b border-[#e8eef0] px-4 py-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf9f7] text-[#078a97]"><FileCheck2 size={16} aria-hidden="true" /></span>
                  <div><h2 className="text-sm font-semibold text-[#172526]">Document Verification</h2><p className="text-[11px] text-[#81929a]">Requirements shown are configured for this business type</p></div>
                </header>
                <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2">
                  {documents.map(({ title, filename, date, icon: Icon }) => (
                    <article key={title} className="rounded-lg border border-[#e5ecee] p-3">
                      <div className="flex items-start gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#effaf8] text-[#078a97]"><Icon size={15} aria-hidden="true" /></span>
                        <div className="min-w-0 flex-1"><h3 className="text-xs font-semibold text-[#172526]">{title}</h3><p className="mt-0.5 text-[10px] text-[#81929a]">Required document</p></div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-end justify-between gap-2 border-t border-[#edf1f2] pt-2.5">
                        <div className="min-w-0"><p className="truncate text-[10px] font-medium text-[#536b80]">{filename}</p><p className="mt-0.5 text-[10px] text-[#94a3ad]">{date}</p></div>
                        <button type="button" onClick={() => setSelectedDocument({ title, filename })} className="shrink-0 text-[11px] font-medium text-[#078a97] hover:underline">Review</button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div>
              <section aria-label="Fleet availability" className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                {fleetSummary.map(({ label, count, icon: Icon, tone }) => (
                  <article key={label} className="flex items-center gap-3 rounded-xl border border-[#e5ecee] bg-white p-3 sm:p-4">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone}`}><Icon size={17} aria-hidden="true" /></span>
                    <div className="min-w-0"><p className="text-[11px] text-[#71858c]">{label}</p><p className="mt-0.5 text-base font-semibold leading-tight text-[#172526]">{buses.length === 0 ? "0 buses" : count}</p></div>
                  </article>
                ))}
              </section>

              <section aria-label="Registered buses" className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                {buses.length === 0 ? (
                  <div className="col-span-full flex min-h-72 flex-col items-center justify-center rounded-xl border border-[#e1ebee] bg-white px-4 py-8 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e6f7f5] text-[#078a97]">
                      <BusFront size={22} aria-hidden="true" />
                    </span>
                    <h2 className="mt-4 text-sm font-semibold text-slate-800">No bus Available</h2>
                    <p className="mt-1 text-xs text-slate-500">Registered buses will appear here.</p>
                  </div>
                ) : buses.map((bus) => (
                  <article key={bus.registration} className="rounded-xl border border-[#e3ebee] bg-white p-3 sm:p-4">
                    <div className="flex items-start gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eaf9f7] text-[#078a97]"><BusFront size={16} aria-hidden="true" /></span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h2 className="text-xs font-semibold text-[#172526]">{bus.registration}</h2>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Active</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-[#81929a]">{bus.operator}</p>
                      </div>
                      <button type="button" aria-label={`More actions for ${bus.registration}`} className="rounded p-1 text-[#94a3ad] hover:bg-slate-100"><Ellipsis size={16} /></button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5 border-b border-[#edf1f2] pb-3">
                      {[bus.specification, bus.deck, bus.capacity].map((detail) => <span key={detail} className="rounded bg-[#f3f6f8] px-2 py-1 text-[10px] text-[#60777b]">{detail}</span>)}
                    </div>

                    <div className="grid grid-cols-5 gap-1 py-3 text-center">
                      {bus.trips.map(([count, label]) => (
                        <div key={label}>
                          <p className="text-xs font-semibold text-[#263638]">{count}</p>
                          <p className="mt-1 text-[9px] leading-tight text-[#94a3ad]">{label}</p>
                        </div>
                      ))}
                    </div>

                    <button type="button" onClick={() => setSelectedBus(bus)} className="flex w-full items-center justify-center gap-1 rounded-lg border border-[#e4ecef] py-2 text-[11px] font-medium text-[#078a97] transition hover:bg-[#f4fbfa]">
                      View in detail <ChevronRight size={13} aria-hidden="true" />
                    </button>
                  </article>
                ))}
              </section>
            </div>
          )}
        </section>
      </main>

      {(selectedDocument || selectedBus) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4" onClick={() => { setSelectedDocument(null); setSelectedBus(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="document-title" className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#078a97]">{selectedDocument ? "Document review" : "Bus details"}</p><h2 id="document-title" className="mt-1 text-lg font-semibold text-slate-800">{selectedDocument?.title || selectedBus?.registration}</h2></div><button type="button" aria-label="Close details" onClick={() => { setSelectedDocument(null); setSelectedBus(null); }} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"><X size={17} /></button></div>
            {selectedDocument ? (
              <div className="mt-4 flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center"><FileText size={28} className="text-[#078a97]" aria-hidden="true" /><p className="mt-3 text-sm font-medium text-slate-800">{selectedDocument.filename}</p><p className="mt-1 text-xs text-slate-500">Document preview is not available in this sample.</p></div>
            ) : (
              <div className="mt-4 space-y-3 text-sm"><p className="text-slate-600">{selectedBus?.operator}</p><p className="text-slate-600">{selectedBus?.specification} · {selectedBus?.deck} · {selectedBus?.capacity}</p><div className="grid grid-cols-2 gap-3">{selectedBus?.trips.map(([count, label]) => <div key={label} className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-semibold text-slate-800">{count}</p></div>)}</div></div>
            )}
          </section>
        </div>
      )}

      {reviewOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4"
          onClick={() => setReviewOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-summary-title"
            className="flex max-h-[min(90vh,760px)] w-full max-w-[460px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#078a97]">Admin decision</p>
                <h2 id="review-summary-title" className="mt-1 text-lg font-semibold text-slate-900">Review Summary</h2>
                <p className="mt-1 text-xs text-slate-500">Complete the checklist before approving this travel company.</p>
              </div>
              <button type="button" aria-label="Close review summary" onClick={() => setReviewOpen(false)} className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200">
                <X size={16} />
              </button>
            </header>

            <div className="overflow-y-auto px-6 py-5">
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Checklist</span>
                  <span>{checkedItems.length} / {reviewChecklist.length}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#078a97] transition-all"
                    style={{ width: `${(checkedItems.length / reviewChecklist.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                {reviewChecklist.map((item, index) => {
                  const checked = checkedItems.includes(index);
                  return (
                    <label key={item} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3.5 py-3 text-xs font-medium text-slate-700 hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => setCheckedItems((items) =>
                          checked ? items.filter((value) => value !== index) : [...items, index],
                        )}
                        className="h-4 w-4 rounded border-slate-300 accent-[#078a97]"
                      />
                      {item}
                    </label>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={checkedItems.length !== reviewChecklist.length}
                onClick={() => changeStatus("Approved")}
                className="mt-4 w-full rounded-xl bg-[#078a97] px-4 py-3 text-sm font-semibold text-white hover:bg-[#067580] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Approve Travel Company
              </button>
            </div>
          </section>
        </div>
      )}

      {correctionOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-md"
          onClick={() => setCorrectionOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="correction-title"
            className="w-full max-w-[540px] rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex rounded-lg bg-amber-50 p-2.5 text-amber-600">
                  <AlertTriangle size={18} />
                </span>
                <h2 id="correction-title" className="mt-3 text-lg font-semibold text-slate-800">Request corrections</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Specify what Kovai Express Travels (TRV-2026-0012) must correct before resubmission.
                </p>
              </div>
              <button type="button" aria-label="Close correction request" onClick={() => setCorrectionOpen(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
                <X size={17} />
              </button>
            </header>

            <form onSubmit={submitCorrection} className="mt-5">
              <label htmlFor="correction-item" className="mb-1.5 block text-xs font-semibold text-slate-800">Correction item</label>
              <select
                id="correction-item"
                value={correctionItem}
                onChange={(event) => setCorrectionItem(event.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#078a97] focus:ring-2 focus:ring-teal-100"
              >
                {["Document correction", "Company information", "Owner details", "Fleet permits", "Bank account proof", "Other"].map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>

              <label htmlFor="correction-remarks" className="mb-1.5 mt-4 block text-xs font-semibold text-slate-800">Detailed remarks</label>
              <textarea
                id="correction-remarks"
                value={correctionRemarks}
                onChange={(event) => setCorrectionRemarks(event.target.value)}
                required
                rows={4}
                placeholder="Explain exactly what needs attention..."
                className="w-full resize-y rounded-lg border border-slate-300 px-3 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#078a97] focus:ring-2 focus:ring-teal-100"
              />

              <div className="mt-5 flex justify-end gap-3">
                <button type="button" onClick={() => setCorrectionOpen(false)} className="rounded-lg px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-[#078a97] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#067580]">
                  Send Correction Request
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {rejectConfirmOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4"
          onClick={() => setRejectConfirmOpen(false)}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="reject-confirm-title"
            aria-describedby="reject-confirm-description"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="inline-flex rounded-lg bg-rose-50 p-2.5 text-rose-600">
              <AlertTriangle size={18} aria-hidden="true" />
            </span>
            <h2 id="reject-confirm-title" className="mt-3 text-lg font-semibold text-slate-800">
              Reject this application?
            </h2>
            <p id="reject-confirm-description" className="mt-1 text-sm text-slate-500">
              This will mark VEE VEE Travels as rejected. You can cancel to keep the application pending.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRejectConfirmOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => changeStatus("Rejected")}
                className="rounded-lg bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-rose-700"
              >
                OK, Reject Application
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
