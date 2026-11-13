import { useEffect, useMemo, useState } from "react";
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
  Ticket,
  Users,
  Wrench,
} from "lucide-react";
import VendorNavbar from "./vendor/VendorNavbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const busDocuments = [
  ["Registration Certificate", "tn38ab4521_rc_certificate.pdf", "Verified"],
  ["Tourist Permit", "all_india_tourist_permit.pdf", "Verified"],
  ["Insurance Policy", "vehicle_insurance_policy.pdf", "Verified"],
  ["Fitness Certificate", "vehicle_fitness_certificate.pdf", "Verified"],
];

const tripStatuses = ["Scheduled", "In Progress", "Completed", "Cancelled", "Draft", "Rejected"];

const tripStatusStyles = {
  Scheduled: "bg-slate-100 text-red-900",
  "In Progress": "bg-indigo-50 text-indigo-700",
  Draft: "bg-slate-100 text-slate-600",
  Rejected: "bg-rose-50 text-rose-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-rose-50 text-rose-700",
};

function exportTrips(rows) {
  const header = ["Trip ID", "Route", "Journey Date", "Departure - Arrival", "Layout", "Booked", "Driver & Crew", "Status"];
  const content = rows.map((trip) => [trip.pnr, trip.route, trip.date, trip.time, trip.layout, trip.booked, trip.driverCrew, trip.status]);
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

function getTripDisplayText(value, fallback = "—") {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? fallback : value.toLocaleString();
  if (Array.isArray(value)) {
    return value.map((item) => getTripDisplayText(item, "")).filter(Boolean).join(" – ") || fallback;
  }
  if (typeof value === "object") {
    const label = value.routeName
      ?? value.fullName
      ?? value.name
      ?? value.label
      ?? value.title
      ?? value.city
      ?? value.registrationNumber
      ?? value._id
      ?? value.id;
    return label === undefined ? fallback : getTripDisplayText(label, fallback);
  }
  return fallback;
}

function formatTripDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? getTripDisplayText(value, "")
    : date.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      });
}

function formatTripTime(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? getTripDisplayText(value, "")
    : date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: "Asia/Kolkata",
      });
}

function BusTripDetails({ trips, loading, error, onViewTrip }) {
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const normalizedTrips = useMemo(() => trips.map((trip, index) => {
    const route = trip.route && typeof trip.route === "object" ? trip.route : {};
    const routeValue = typeof trip.route === "string"
      ? trip.route
      : route.routeName ?? trip.routeName;
    const routeCities = [
      trip.origin ?? trip.source ?? trip.from ?? route.originCity ?? route.origin,
      trip.destination ?? trip.destinationCity ?? trip.to ?? route.destinationCity ?? route.destination,
    ].map((value) => getTripDisplayText(value, "")).filter(Boolean).join(" → ");
    const seatLayout = trip.seatLayout && typeof trip.seatLayout === "object" ? trip.seatLayout : {};
    const seatRows = [
      seatLayout.lowerDeck,
      seatLayout.upperDeck,
      ...(Array.isArray(seatLayout.decks) ? seatLayout.decks : []),
    ].filter(Boolean).flatMap((deck) => Array.isArray(deck.rows) ? deck.rows : []);
    const seats = [
      ...(Array.isArray(seatLayout.seats) ? seatLayout.seats : []),
      ...seatRows.flatMap((row) => [
        ...(Array.isArray(row.seats) ? row.seats : []),
        ...(Array.isArray(row.berths) ? row.berths : []),
      ]),
    ];
    const explicitBooked = trip.bookedSeats ?? trip.bookedCount ?? trip.booked;
    const hasAvailability = seats.some((seat) =>
      seat && (typeof seat.available === "boolean" || typeof seat.isBooked === "boolean" || seat.status),
    );
    const bookedCount = Array.isArray(explicitBooked)
      ? explicitBooked.length
      : explicitBooked ?? seats.filter((seat) =>
          seat && (seat.available === false || seat.isBooked === true || String(seat.status).toLowerCase() === "booked"),
        ).length;
    const totalSeats = seatLayout.totalPassengerCapacity ?? seats.length;
    const hasBookedData = explicitBooked !== undefined || hasAvailability;
    const crewNames = [
      ...(Array.isArray(trip.drivers) ? trip.drivers : []),
      ...(Array.isArray(trip.crews) ? trip.crews : []),
    ].map((member) => getTripDisplayText(member, "")).filter(Boolean).join(", ");
    const driverCrew = trip.driverCrew
      ?? trip.driverAndCrew
      ?? (crewNames || trip.driver?.fullName || trip.driver?.name);
    const tripId = trip.id ?? trip._id ?? trip.tripId?._id ?? trip.tripId ?? index;
    return {
      id: getTripDisplayText(tripId, String(index)),
      sourceTrip: trip,
      pnr: getTripDisplayText(
        trip.pnr
          ?? trip.tripNumber
          ?? (typeof trip.tripId === "object" ? trip.tripId?.tripNumber ?? trip.tripId?._id : trip.tripId)
          ?? trip.id
          ?? trip._id,
      ),
      route: getTripDisplayText(routeValue ?? routeCities),
      date: getTripDisplayText(formatTripDate(trip.journeyDate ?? trip.travelDate ?? trip.departureDateTime ?? trip.date)),
      time: getTripDisplayText(
        trip.departureArrival
          ?? [formatTripTime(trip.departureDateTime ?? trip.departureTime), formatTripTime(trip.arrivalDateTime ?? trip.arrivalTime)].filter(Boolean).join(" – "),
      ),
      layout: getTripDisplayText(trip.layout ?? seatLayout.layoutType ?? seatLayout.name ?? (typeof trip.seatLayout === "string" ? trip.seatLayout : null)),
      booked: hasBookedData
        ? `${getTripDisplayText(bookedCount, "0")}${totalSeats ? ` / ${totalSeats}` : ""}`
        : "—",
      driverCrew: getTripDisplayText(driverCrew),
      status: String(trip.status ?? "Scheduled").toLowerCase().replaceAll("_", " ").replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
    };
  }), [trips]);

  const filteredTrips = useMemo(() => {
    const search = query.trim().toLowerCase();
    return normalizedTrips.filter((trip) => {
      const matchesSearch = [trip.pnr, trip.route, trip.driverCrew]
        .some((value) => String(value).toLowerCase().includes(search));
      return matchesSearch && (statusFilter === "All statuses" || trip.status === statusFilter);
    });
  }, [query, statusFilter, normalizedTrips]);

  const totalPages = Math.max(1, Math.ceil(filteredTrips.length / pageSize));
  const visibleTrips = filteredTrips.slice((page - 1) * pageSize, page * pageSize);
  const firstResult = filteredTrips.length ? (page - 1) * pageSize + 1 : 0;
  const lastResult = Math.min(page * pageSize, filteredTrips.length);

  if (normalizedTrips.length === 0) {
    return (
      <section className="overflow-hidden rounded-xl border border-[#e1ebee] bg-white">
        {error && <p role="alert" className="border-b border-rose-100 bg-rose-50 px-4 py-2 text-xs text-rose-700">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5 text-left">
            <thead className="bg-[#f3f7f8] text-[10px] font-semibold uppercase tracking-wide text-[#687d86]">
              <tr>
                <th className="px-3 py-3">Route &amp; Direction</th>
                <th className="px-3 py-3">Journey Date</th>
                <th className="px-3 py-3">Departure – Arrival</th>
                <th className="px-3 py-3">Layout</th>
                <th className="px-3 py-3">Booked</th>
                <th className="px-3 py-3">Driver &amp; Crew</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="8" className="h-72 px-4 py-8">
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e6f7f5] text-[#078a97]"><MapPin size={22} aria-hidden="true" /></span>
                    <h2 className="mt-4 text-sm font-semibold text-slate-800">{loading ? "Loading trips..." : "No trips found"}</h2>
                    {!loading && <p className="mt-1 text-xs text-slate-500">No trips have been allocated to this bus yet.</p>}
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
          <thead className="bg-[#f3f7f8] text-[10px] font-semibold uppercase tracking-[0.04em] text-[#687d86]"><tr><th className="px-3 py-3">Route &amp; Direction</th><th className="px-3 py-3">Journey Date</th><th className="px-3 py-3">Departure – Arrival</th><th className="px-3 py-3">Layout</th><th className="px-3 py-3">Booked</th><th className="px-3 py-3">Driver &amp; Crew</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Action</th></tr></thead>
          <tbody className="divide-y divide-[#e9eff1]">
            {visibleTrips.map((trip) => (
              <tr key={trip.id} className="h-14 transition-colors hover:bg-[#f9fbfb]">
                <td className="whitespace-nowrap px-3 py-2 text-[11px] font-semibold text-slate-900">{trip.route}</td>
                <td className="whitespace-nowrap px-3 py-2 text-[11px] text-[#536b80]">{trip.date}</td>
                <td className="whitespace-nowrap px-3 py-2 text-[11px] text-[#536b80]">{trip.time}</td>
                <td className="whitespace-nowrap px-3 py-2 text-[11px] font-medium text-[#172526]">{trip.layout}</td>
                <td className="whitespace-nowrap px-3 py-2 text-[11px] font-medium text-[#172526]">{trip.booked}</td>
                <td className="whitespace-nowrap px-3 py-2 text-[11px] text-[#536b80]">{trip.driverCrew}</td>
                <td className="px-3 py-2"><span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium ${tripStatusStyles[trip.status] || "bg-slate-100 text-slate-600"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />{trip.status}</span></td>
                <td className="px-3 py-2"><button type="button" onClick={() => onViewTrip?.(trip.sourceTrip)} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#078a97] hover:bg-teal-50" aria-label={`View trip details for ${trip.route}`} title={`View trip details for ${trip.route}`}><Eye size={15} aria-hidden="true" /></button></td>
              </tr>
            ))}
            {visibleTrips.length === 0 && <tr><td colSpan="8" className="px-4 py-10 text-center text-sm text-slate-500">No trips match your search.</td></tr>}
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

export default function TravelBusDetailView({
  bus,
  onBack,
  Navbar = VendorNavbar,
  agencyId,
  initialTab = "Bus Overview",
  onViewTrip,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { BASE_URL, TOKEN_KEY } = useAuth();
  const busId = bus._id ?? bus.id ?? bus.busId;
  const [busOverview, setBusOverview] = useState(bus);
  const [overviewStats, setOverviewStats] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewError, setOverviewError] = useState("");
  const [trips, setTrips] = useState([]);
  const [tripStats, setTripStats] = useState(null);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [tripsError, setTripsError] = useState("");
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState("");
  const normalizedTripStatuses = trips.map((trip) =>
    String(trip.status || "").toLowerCase().replaceAll("_", " ").replaceAll("-", " ").trim(),
  );
  const tripListLoaded = activeTab === "Trip Details" && !tripsLoading && !tripsError;
  const tripSummary = overviewStats
    ?? busOverview.tripStats
    ?? busOverview.tripSummary
    ?? busOverview.stats
    ?? tripStats
    ?? busOverview;
  const tripCounts = {
    total: tripListLoaded ? normalizedTripStatuses.length : tripSummary.totalTrips ?? tripSummary.total ?? tripSummary.tripCount ?? normalizedTripStatuses.length,
    upcoming: tripListLoaded ? normalizedTripStatuses.filter((status) => ["upcoming", "scheduled", "confirmed"].includes(status)).length : tripSummary.upcoming ?? tripSummary.upcomingTrips ?? tripSummary.scheduled ?? normalizedTripStatuses.filter((status) => ["upcoming", "scheduled", "confirmed"].includes(status)).length,
    inProgress: tripListLoaded ? normalizedTripStatuses.filter((status) => status === "in progress").length : tripSummary.inProgress ?? tripSummary.inProgressTrips ?? tripSummary.in_progress ?? normalizedTripStatuses.filter((status) => status === "in progress").length,
    completed: tripListLoaded ? normalizedTripStatuses.filter((status) => status === "completed").length : tripSummary.completed ?? tripSummary.completedTrips ?? normalizedTripStatuses.filter((status) => status === "completed").length,
    cancelled: tripListLoaded ? normalizedTripStatuses.filter((status) => ["cancelled", "canceled"].includes(status)).length : tripSummary.cancelled ?? tripSummary.cancelledTrips ?? tripSummary.canceled ?? normalizedTripStatuses.filter((status) => ["cancelled", "canceled"].includes(status)).length,
    drafts: tripListLoaded ? normalizedTripStatuses.filter((status) => status === "draft").length : tripSummary.drafts ?? tripSummary.draftTrips ?? normalizedTripStatuses.filter((status) => status === "draft").length,
  };
  const registration = busOverview.registration ?? busOverview.registrationNumber ?? bus.registration ?? bus.busName;
  const operator = busOverview.operator ?? busOverview.operatorName ?? bus.operator;
  const manufacturerModel = [busOverview.manufacturer, busOverview.model]
    .filter(Boolean)
    .join(" ") || busOverview.modelName || bus.model;
  const busType = busOverview.busType ?? busOverview.category ?? busOverview.specification ?? bus.specification;
  const deck = busOverview.deckConfiguration ?? busOverview.deck ?? bus.deck;
  const passengerCapacity = busOverview.passengerCapacity ?? busOverview.totalSeats;
  const capacity = passengerCapacity
    ? `${passengerCapacity} seats`
    : busOverview.capacity ?? bus.capacity;
  const depot = busOverview.depot?.city ?? busOverview.depot?.name ?? busOverview.depot ?? bus.depot;
  const busStatus = busOverview.status || bus.status || "Active";
  const details = [
    ["BUS REGISTRATION", registration, BusFront],
    ["OPERATOR", operator, Users],
    ["MANUFACTURER / MODEL", manufacturerModel, Wrench],
    ["BUS TYPE", busType, BusFront],
    ["DECK CONFIGURATION", deck, Layers],
    ["PASSENGER CAPACITY", capacity, Users],
    ["DEPOT", depot, MapPin],
    ["ODOMETER", busOverview.odometer ? `${busOverview.odometer} km` : bus.odometer, Gauge],
  ];

  useEffect(() => {
    if (!busId) {
      setOverviewError("Bus details are unavailable because this bus has no ID.");
      return undefined;
    }

    let active = true;
    async function loadBusOverview() {
      setOverviewLoading(true);
      setOverviewError("");
      try {
        const token = localStorage.getItem(TOKEN_KEY || "exte_key");
        const response = await fetch(
          `${BASE_URL}/admin/buses/${encodeURIComponent(busId)}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );
        if (!response.ok) throw new Error(`Unable to load bus overview (HTTP ${response.status}).`);
        const data = await response.json();
        const payload = data.data ?? data;
        const busData = data.bus ?? payload.bus ?? payload;
        if (!busData || typeof busData !== "object" || Array.isArray(busData)) {
          throw new Error(data.message || "Unexpected bus overview response.");
        }
        if (active) {
          setBusOverview((current) => ({ ...current, ...busData }));
          setOverviewStats(data.stats ?? payload.stats ?? busData.tripStats ?? busData.stats ?? null);
        }
      } catch (error) {
        if (active) setOverviewError(error.message || "Unable to load bus overview.");
      } finally {
        if (active) setOverviewLoading(false);
      }
    }

    loadBusOverview();
    return () => {
      active = false;
    };
  }, [busId, BASE_URL, TOKEN_KEY]);

  useEffect(() => {
    if (activeTab !== "Trip Details") return undefined;
    if (!busId) {
      setTrips([]);
      setTripStats(null);
      setTripsError("Trips are unavailable because this bus has no ID.");
      return undefined;
    }

    let active = true;
    async function loadBusTrips() {
      setTripsLoading(true);
      setTripsError("");
      try {
        const token = localStorage.getItem(TOKEN_KEY || "exte_key");
        const tripsUrl = agencyId
          ? `${BASE_URL}/admin/trips?${new URLSearchParams({
              agencyId: String(agencyId),
              page: "1",
              limit: "100",
            })}`
          : `${BASE_URL}/admin/trips/bus/${encodeURIComponent(busId)}`;
        const response = await fetch(
          tripsUrl,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );
        if (!response.ok) throw new Error(`Unable to load trips for this bus (HTTP ${response.status}).`);
        const data = await response.json();
        const payload = data.data ?? data;
        const agencyTrips = Array.isArray(data.trips)
          ? data.trips
          : Array.isArray(payload.trips)
            ? payload.trips
            : Array.isArray(payload)
              ? payload
              : null;
        if (!agencyTrips) throw new Error(data.message || "Unexpected bus trips response.");
        const busTrips = agencyId
          ? agencyTrips.filter((trip) => {
              const reference = trip.busId ?? trip.bus ?? trip.vehicleId;
              const tripBusId = reference && typeof reference === "object"
                ? reference._id ?? reference.id ?? reference.busId
                : reference;
              return tripBusId != null && String(tripBusId) === String(busId);
            })
          : agencyTrips;
        if (active) {
          setTrips(busTrips);
          setTripStats(agencyId ? null : data.stats ?? payload.stats ?? data.summary ?? payload.summary ?? payload);
        }
      } catch (error) {
        if (active) {
          setTrips([]);
          setTripStats(null);
          setTripsError(error.message || "Unable to load trips for this bus.");
        }
      } finally {
        if (active) setTripsLoading(false);
      }
    }

    loadBusTrips();
    return () => {
      active = false;
    };
  }, [activeTab, busId, agencyId, BASE_URL, TOKEN_KEY]);

  useEffect(() => {
    if (activeTab !== "Bookings") return undefined;
    if (!busId) {
      setBookings([]);
      setBookingsError("Bookings are unavailable for this bus.");
      return undefined;
    }

    let active = true;
    async function loadBookings() {
      setBookingsLoading(true);
      setBookingsError("");
      try {
        const token = localStorage.getItem(TOKEN_KEY || "exte_key");
        const params = new URLSearchParams({ page: "1", limit: "100", busId: String(busId) });
        const response = await fetch(`${BASE_URL}/admin/bookings?${params}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!response.ok) throw new Error("Unable to load bookings for this bus.");
        const data = await response.json();
        const busBookings = Array.isArray(data.bookings)
          ? data.bookings
          : Array.isArray(data)
            ? data
            : [];
        if (active) setBookings(busBookings);
      } catch (error) {
        if (active) setBookingsError(error.message || "Unable to load bus bookings.");
      } finally {
        if (active) setBookingsLoading(false);
      }
    }

    loadBookings();
    return () => {
      active = false;
    };
  }, [activeTab, busId, BASE_URL, TOKEN_KEY]);

  return (
    <div className="min-h-screen bg-[#f5f8f9] text-sm text-[#172526]">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#688080]">
            <button type="button" onClick={onBack} className="hover:text-[#078a97]">VEE VEE Travels</button>
            <ChevronRight size={14} aria-hidden="true" />
            <button type="button" onClick={onBack} className="hover:text-[#078a97]">Buses</button>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="font-medium text-[#078a97]">{registration}</span>
          </nav>
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-lg border border-[#dce7e9] bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
            <ArrowLeft size={15} aria-hidden="true" /> Back to Bus Overview
          </button>
        </div>

        <section className="mb-3 flex flex-col gap-3 rounded-xl border border-[#e4ecef] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:px-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e6f7f5] text-[#078a97]"><BusFront size={24} aria-hidden="true" /></span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-[#172526]">{registration}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700"><CheckCircle2 size={12} aria-hidden="true" /> {busStatus}</span>
            </div>
            <p className="mt-1 text-xs text-[#688080]">{operator} <span className="px-1">·</span> {busType} <span className="px-1">·</span> {deck} <span className="px-1">·</span> {capacity}</p>
          </div>
        </section>

        <section aria-label="Trip summary" className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
          {[
            ["Total trips", tripCounts.total, BusFront],
            ["Upcoming", tripCounts.upcoming, CalendarDays],
            ["In progress", tripCounts.inProgress, Clock3],
            ["Completed", tripCounts.completed, CheckCircle2],
            ["Cancelled", tripCounts.cancelled, Clock3],
            ["Drafts", tripCounts.drafts, FileText],
          ].map(([label, count, Icon]) => (
            <article key={label} className="rounded-lg border border-[#e7edef] bg-white px-3 py-3 shadow-sm">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#688080]"><Icon size={13} className="text-[#078a97]" aria-hidden="true" />{label}</div>
              <p className="mt-1 text-lg font-semibold leading-none text-[#172526]">{count}</p>
            </article>
          ))}
        </section>
        {overviewLoading && <p role="status" className="mb-3 text-xs text-slate-500">Loading bus overview...</p>}
        {overviewError && <p role="alert" className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{overviewError}</p>}

        <section className="rounded-xl border border-[#e1ebee] bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3"><h2 className="text-base font-semibold text-[#172526]">Bus Details</h2><p className="mt-0.5 text-xs text-[#688080]">Vehicle information, operations, and trip activity</p></div>
          <div role="tablist" aria-label="Bus detail sections" className="mb-3 flex w-full max-w-md gap-1 rounded-lg bg-[#f0f5f7] p-1">
            {["Bus Overview", "Trip Details", "Bookings"].map((tab) => <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition ${activeTab === tab ? "bg-white text-[#078a97] shadow-sm" : "text-[#71858c] hover:text-[#078a97]"}`}>{tab}</button>)}
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
          ) : activeTab === "Trip Details" ? (
            <BusTripDetails trips={trips} loading={tripsLoading} error={tripsError} onViewTrip={onViewTrip} />
          ) : (
            <section aria-label="Bus bookings" className="overflow-hidden rounded-lg border border-[#e1ebee]">
              <header className="flex items-center justify-between border-b border-[#e8eef0] px-4 py-3">
                <div>
                  <h3 className="text-sm font-semibold text-[#172526]">Bookings</h3>
                  <p className="mt-0.5 text-[11px] text-[#81929a]">Passenger reservations for this bus</p>
                </div>
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-medium text-teal-700">{bookings.length}</span>
              </header>
              {bookingsLoading ? (
                <p className="px-4 py-10 text-center text-xs text-slate-500">Loading bookings...</p>
              ) : bookingsError ? (
                <p role="alert" className="px-4 py-10 text-center text-xs text-rose-600">{bookingsError}</p>
              ) : bookings.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left">
                    <thead className="bg-[#f3f7f8] text-[10px] font-semibold uppercase tracking-wide text-[#687d86]">
                      <tr>
                        <th className="px-4 py-3">Booking / PNR</th>
                        <th className="px-3 py-3">Passenger</th>
                        <th className="px-3 py-3">Route</th>
                        <th className="px-3 py-3">Journey date</th>
                        <th className="px-3 py-3">Seats</th>
                        <th className="px-3 py-3">Fare</th>
                        <th className="px-3 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e9eff1]">
                      {bookings.map((booking) => {
                        const passengerName =
                          booking.passengerDetails?.[0]?.name ||
                          booking.contactDetails?.name ||
                          `${booking.user?.firstName || ""} ${booking.user?.lastName || ""}`.trim() ||
                          "Passenger";
                        const journeyDate = booking.journeyDate || booking.createdAt;
                        const status = booking.displayStatus || booking.status || "Pending";
                        return (
                          <tr key={booking._id || booking.bookingNumber} className="text-xs hover:bg-[#f9fbfb]">
                            <td className="whitespace-nowrap px-4 py-3 font-semibold text-teal-800">#{booking.bookingNumber || "—"}</td>
                            <td className="px-3 py-3 font-medium text-slate-800">{passengerName}</td>
                            <td className="whitespace-nowrap px-3 py-3 text-slate-600">{booking.source || "—"} → {booking.destination || "—"}</td>
                            <td className="whitespace-nowrap px-3 py-3 text-slate-600">{journeyDate ? new Date(journeyDate).toLocaleDateString() : "—"}</td>
                            <td className="whitespace-nowrap px-3 py-3 text-slate-600">{Array.isArray(booking.seats) ? booking.seats.join(", ") : "—"}</td>
                            <td className="whitespace-nowrap px-3 py-3 font-semibold text-slate-800">₹{booking.totalAmount || 0}</td>
                            <td className="whitespace-nowrap px-3 py-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-700">{status}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-4 py-12 text-center">
                  <Ticket size={26} className="mx-auto text-slate-300" aria-hidden="true" />
                  <p className="mt-2 text-sm font-medium text-slate-700">No bookings for this bus</p>
                  <p className="mt-1 text-xs text-slate-500">Bookings will appear here when passengers reserve seats.</p>
                </div>
              )}
            </section>
          )}
        </section>
      </main>
    </div>
  );
}
