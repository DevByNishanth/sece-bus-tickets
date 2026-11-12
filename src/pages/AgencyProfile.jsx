import { useEffect, useState } from "react";
import {
  Building2,
  BusFront,
  CheckCircle2,
  Eye,
  FileCheck2,
  FileText,
  MapPin,
  Search,
  Wrench,
} from "lucide-react";
import AdminNavbar from "../components/AdminNavbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import TravelBusDetailView from "./TravelBusDetailView.jsx";

function getAgencyName(agency) {
  return (
    agency?.operatorDisplayName ||
    agency?.tradeName ||
    agency?.registeredBusinessName ||
    agency?.businessName ||
    agency?.name ||
    "Unnamed agency"
  );
}

function getAddress(address) {
  if (!address) return "Not provided";
  if (typeof address === "string") return address;
  return [
    address.street,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ") || "Not provided";
}

function InfoItem({ label, value, className = "" }) {
  return (
    <div className={`min-w-0 px-3 py-3 ${className}`}>
      <dt className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 break-words text-[11px] font-medium text-slate-800">
        {value || "Not provided"}
      </dd>
    </div>
  );
}

function getBusStatus(bus) {
  return String(bus.status || bus.availabilityStatus || "pending").toLowerCase();
}

function getBusCount(bus, ...keys) {
  const value = keys.map((key) => bus[key]).find((item) => item !== undefined && item !== null);
  return Number(value) || 0;
}

function getBusType(bus) {
  return String(bus.busType || bus.category || "Standard")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatTripDateTime(value) {
  if (!value) return "Not provided";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
}

function AgencyFleetOverview({ agency, buses, loading, error, onSelectBus }) {
  const stats = [
    ["Authorized fleet", buses.length, BusFront, "bg-teal-50 text-[#078A97]", "buses"],
    ["Available today", buses.filter((bus) => ["approved", "active", "available"].includes(getBusStatus(bus))).length, CheckCircle2, "bg-emerald-50 text-emerald-600", "buses"],
    ["On trip now", buses.filter((bus) => ["on_trip", "in_progress", "on trip"].includes(getBusStatus(bus))).length, MapPin, "bg-orange-50 text-orange-500", ""],
    ["Under maintenance", buses.filter((bus) => ["maintenance", "under_maintenance", "under maintenance"].includes(getBusStatus(bus))).length, Wrench, "bg-slate-100 text-slate-500", ""],
  ];

  return (
    <section className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map(([label, count, Icon, iconClass, suffix]) => (
          <article key={label} className="flex items-center gap-2.5 rounded-lg border border-[#dbe6e9] bg-white p-3">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
              <Icon size={16} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs text-slate-500">{label}</p>
              <p className="text-lg font-semibold leading-tight text-slate-800">{count} {suffix}</p>
            </div>
          </article>
        ))}
      </div>

      {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>}
      {loading ? (
        <div className="rounded-xl border border-[#dbe6e9] bg-white px-4 py-12 text-center text-xs text-slate-500">Loading agency buses...</div>
      ) : buses.length ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {buses.map((bus) => {
            const status = getBusStatus(bus);
            const isActive = ["active", "approved", "available"].includes(status);
            const registration = bus.registrationNumber || bus.busName || "Unnamed bus";
            const capacity = bus.passengerCapacity || bus.totalSeats || 0;
            const counters = [
              ["Upcoming", getBusCount(bus, "upcomingTrips", "upcomingTripCount")],
              ["Completed", getBusCount(bus, "completedTrips", "completedTripCount")],
              ["Cancelled", getBusCount(bus, "cancelledTrips", "cancelledTripCount")],
              ["Rejected", getBusCount(bus, "rejectedTrips", "rejectedTripCount")],
              ["Drafts", getBusCount(bus, "draftTrips", "draftCount")],
            ];
            return (
              <article key={bus._id || registration} className="rounded-xl border border-[#dbe6e9] bg-white p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-[#078A97]"><BusFront size={17} /></span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className="text-sm font-semibold text-slate-800">{registration}</h3>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${isActive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {isActive ? "Active" : bus.status || "Pending"}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-slate-500">{bus.operatorName || bus.agentId?.firstName || getAgencyName(agency)}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => onSelectBus(bus)} aria-label={`View details for ${registration}`} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-teal-50 hover:text-teal-700"><Eye size={14} /></button>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] text-slate-600">
                  {[bus.category || getBusType(bus), `${bus.deckConfiguration || "Single"} deck`, `${capacity} seats`].map((spec) => (
                    <span key={spec} className="rounded-full bg-slate-50 px-2 py-1">{spec}</span>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-5 border-t border-slate-100 pt-2 text-center">
                  {counters.map(([label, count]) => (
                    <div key={label}>
                      <p className="text-xs font-semibold text-slate-700">{count}</p>
                      <p className="text-[10px] text-slate-400">{label}</p>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => onSelectBus(bus)} className="mt-3 flex h-9 w-full items-center justify-center gap-1 rounded-md border border-[#e4ecef] text-xs font-medium text-[#078A97] hover:bg-teal-50">
                  View details <Eye size={12} />
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-[#dbe6e9] bg-white px-4 py-12 text-center">
          <BusFront size={28} className="mx-auto text-slate-300" />
          <p className="mt-2 text-sm font-semibold text-slate-700">No buses registered</p>
          <p className="mt-1 text-xs text-slate-500">There are no buses associated with this agency yet.</p>
        </div>
      )}
    </section>
  );
}

function AgencyBookingsOverview({
  bookings,
  page,
  total,
  totalPages,
  stats,
  loading,
  error,
  onPageChange,
}) {
  const summaries = [
    ["Total bookings", stats?.total ?? total],
    ["Confirmed", stats?.confirmed ?? 0],
    ["Pending", stats?.pending ?? 0],
    ["Cancelled", stats?.cancelled ?? 0],
    ["Failed", stats?.failed ?? 0],
    ["Total revenue", `₹${Number(stats?.totalRevenue) || 0}`],
  ];

  return (
    <section className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
        {summaries.map(([label, value]) => (
          <article key={label} className="rounded-lg border border-[#dbe6e9] bg-white p-3">
            <p className="text-[10px] text-slate-500">{label}</p>
            <p className="mt-1 text-base font-semibold text-slate-800">{value}</p>
          </article>
        ))}
      </div>

      <section className="overflow-hidden rounded-xl border border-[#dbe6e9] bg-white">
        {error && (
          <p role="alert" className="border-b border-rose-100 bg-rose-50 px-4 py-2 text-xs text-rose-700">
            {error}
          </p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
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
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-slate-500">Loading agency bookings...</td>
                </tr>
              ) : bookings.length ? (
                bookings.map((booking) => {
                  const passenger =
                    booking.passengerDetails?.[0]?.name ||
                    booking.contactDetails?.name ||
                    `${booking.user?.firstName || ""} ${booking.user?.lastName || ""}`.trim() ||
                    "Passenger";
                  const route =
                    [booking.source || booking.tripId?.origin, booking.destination || booking.tripId?.destination]
                      .filter(Boolean)
                      .join(" → ") || "Not provided";
                  const seats = Array.isArray(booking.seats)
                    ? booking.seats.join(", ")
                    : Array.isArray(booking.seatNumbers)
                      ? booking.seatNumbers.join(", ")
                      : "—";
                  const status = String(booking.status || "Pending")
                    .replaceAll("_", " ")
                    .replace(/\b\w/g, (letter) => letter.toUpperCase());
                  return (
                    <tr key={booking._id || booking.bookingNumber} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-teal-800">#{booking.bookingNumber || booking.pnr || booking._id || "—"}</td>
                      <td className="px-3 py-3 text-slate-700">{passenger}</td>
                      <td className="px-3 py-3 text-slate-700">{route}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-slate-600">{formatTripDateTime(booking.journeyDate || booking.tripId?.departureDateTime)}</td>
                      <td className="px-3 py-3 text-slate-600">{seats}</td>
                      <td className="whitespace-nowrap px-3 py-3 font-medium text-slate-800">₹{Number(booking.totalAmount ?? booking.totalFare ?? booking.fare) || 0}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-slate-600">{status}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-slate-500">No bookings found for this agency.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <footer className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          <p>
            Showing {bookings.length ? (page - 1) * 20 + 1 : 0}–
            {(page - 1) * 20 + bookings.length} of {total} bookings
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange((current) => Math.max(1, current - 1))}
              disabled={loading || page <= 1}
              className="rounded-md border border-slate-200 px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            <span>{page} / {totalPages}</span>
            <button
              type="button"
              onClick={() => onPageChange((current) => Math.min(totalPages, current + 1))}
              disabled={loading || page >= totalPages}
              className="rounded-md border border-slate-200 px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </footer>
      </section>
    </section>
  );
}

function AgencyNavbar() {
  return <AdminNavbar />;
}

export default function AgencyProfile() {
  const { BASE_URL, TOKEN_KEY } = useAuth();
  const [search, setSearch] = useState("");
  const [agencies, setAgencies] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loadingAgencies, setLoadingAgencies] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [error, setError] = useState("");
  const [activeAgencyTab, setActiveAgencyTab] = useState("Travels Overview");
  const [buses, setBuses] = useState([]);
  const [loadingBuses, setLoadingBuses] = useState(false);
  const [busError, setBusError] = useState("");
  const [trips, setTrips] = useState([]);
  const [tripsPage, setTripsPage] = useState(1);
  const [tripsTotalPages, setTripsTotalPages] = useState(1);
  const [tripsTotal, setTripsTotal] = useState(0);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [tripsError, setTripsError] = useState("");
  const [bookings, setBookings] = useState([]);
  const [bookingsPage, setBookingsPage] = useState(1);
  const [bookingsTotalPages, setBookingsTotalPages] = useState(1);
  const [bookingsTotal, setBookingsTotal] = useState(0);
  const [bookingStats, setBookingStats] = useState(null);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState("");
  const [selectedBus, setSelectedBus] = useState(null);
  const tokenKeyName = TOKEN_KEY || "exte_key";

  useEffect(() => {
    const query = search.trim();
    if (!searchOpen || !query) {
      setAgencies([]);
      setLoadingAgencies(false);
      return undefined;
    }

    let active = true;

    async function loadAgencies() {
      setLoadingAgencies(true);
      try {
        const token = localStorage.getItem(tokenKeyName);
        const params = new URLSearchParams({ q: query });
        const response = await fetch(`${BASE_URL}/admin/agencies/search?${params}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!response.ok) throw new Error("Unable to search agencies.");
        const data = await response.json();
        if (!Array.isArray(data.agencies)) {
          throw new Error(data.message || "Unexpected agency search response.");
        }
        if (active) {
          setAgencies(data.agencies);
        }
      } catch (loadError) {
        if (active) {
          setAgencies([]);
          setError(loadError.message || "Unable to search agencies.");
        }
      } finally {
        if (active) setLoadingAgencies(false);
      }
    }

    loadAgencies();
    return () => {
      active = false;
    };
  }, [BASE_URL, search, searchOpen, tokenKeyName]);

  async function selectAgency(agency) {
    const agencyId = agency.agencyId || agency._id || agency.id;
    setSearch(getAgencyName(agency));
    setSearchOpen(false);
    setSelectedAgency(agency);
    setTripsPage(1);
    setBookingsPage(1);
    setError("");
    if (!agencyId) return;

    setLoadingProfile(true);
    try {
      const token = localStorage.getItem(tokenKeyName);
      const response = await fetch(`${BASE_URL}/admin/agents/${agencyId}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!response.ok) throw new Error("Unable to load this agency profile.");
      const data = await response.json();
      if (!data.agent) {
        throw new Error(data.message || "Agency profile was missing from the response.");
      }
      setSelectedAgency(data.agent);
    } catch (loadError) {
      setError(loadError.message || "Unable to load this agency profile.");
    } finally {
      setLoadingProfile(false);
    }
  }

  const updateSearch = (value) => {
    setSearch(value);
    setSearchOpen(true);
    setSelectedAgency(null);
    setSelectedBus(null);
    setTripsPage(1);
    setBookingsPage(1);
    setActiveAgencyTab("Travels Overview");
    setError("");
  };

  useEffect(() => {
    if (!selectedAgency) {
      setBuses([]);
      setBusError("");
      return;
    }

    let active = true;
    async function loadAgencyBuses() {
      setLoadingBuses(true);
      setBusError("");
      try {
        const token = localStorage.getItem(tokenKeyName);
        const agencyId =
          selectedAgency.userId?._id ||
          selectedAgency.user?._id ||
          selectedAgency.userId ||
          selectedAgency.agencyId ||
          selectedAgency._id ||
          selectedAgency.id;
        if (!agencyId) throw new Error("Unable to load buses because this agency has no ID.");
        const params = new URLSearchParams({
          page: "1",
          limit: "20",
          status: "",
          search: "",
        });
        const response = await fetch(
          `${BASE_URL}/admin/buses/agent/${encodeURIComponent(agencyId)}?${params}`,
          {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!response.ok) throw new Error("Unable to load buses for this agency.");
        const data = await response.json();
        const agencyBuses =
          [data.buses, data.data?.buses, data.results, data.data, data]
            .find(Array.isArray) || [];
        if (active) setBuses(agencyBuses);
      } catch (loadError) {
        if (active) setBusError(loadError.message || "Unable to load agency buses.");
      } finally {
        if (active) setLoadingBuses(false);
      }
    }

    loadAgencyBuses();
    return () => {
      active = false;
    };
  }, [BASE_URL, selectedAgency, tokenKeyName]);

  useEffect(() => {
    if (!selectedAgency || activeAgencyTab !== "Trips") {
      setTrips([]);
      setTripsError("");
      setLoadingTrips(false);
      return undefined;
    }

    const agencyId =
      selectedAgency.userId?._id ||
      selectedAgency.user?._id ||
      selectedAgency.userId ||
      selectedAgency.agencyId;
    if (!agencyId) {
      setTrips([]);
      setTripsError("Unable to load trips because this agency has no ID.");
      return undefined;
    }

    let active = true;
    async function loadAgencyTrips() {
      setLoadingTrips(true);
      setTripsError("");
      try {
        const token = localStorage.getItem(tokenKeyName);
        const params = new URLSearchParams({
          agencyId,
          page: String(tripsPage),
          limit: "20",
        });
        const response = await fetch(`${BASE_URL}/admin/trips?${params}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!response.ok) throw new Error("Unable to load trips for this agency.");
        const data = await response.json();
        if (!Array.isArray(data.trips)) {
          throw new Error(data.message || "Unexpected trips response.");
        }
        if (active) {
          setTrips(data.trips);
          setTripsTotalPages(Math.max(1, Number(data.totalPages) || 1));
          setTripsTotal(Number(data.total) || 0);
        }
      } catch (loadError) {
        if (active) {
          setTrips([]);
          setTripsError(loadError.message || "Unable to load trips for this agency.");
        }
      } finally {
        if (active) setLoadingTrips(false);
      }
    }

    loadAgencyTrips();
    return () => {
      active = false;
    };
  }, [BASE_URL, activeAgencyTab, selectedAgency, tokenKeyName, tripsPage]);

  useEffect(() => {
    if (!selectedAgency || activeAgencyTab !== "Bookings") {
      setBookings([]);
      setBookingsError("");
      setLoadingBookings(false);
      return undefined;
    }

    const agencyId =
      selectedAgency.userId?._id ||
      selectedAgency.userId ||
      selectedAgency.user?._id ||
      selectedAgency.agencyId ||
      selectedAgency._id;
    if (!agencyId) {
      setBookings([]);
      setBookingsError("Unable to load bookings because this agency has no ID.");
      return undefined;
    }

    let active = true;
    async function loadAgencyBookings() {
      setLoadingBookings(true);
      setBookingsError("");
      try {
        const token = localStorage.getItem(tokenKeyName);
        const params = new URLSearchParams({
          page: String(bookingsPage),
          limit: "20",
        });
        const response = await fetch(
          `${BASE_URL}/admin/bookings/agent/${encodeURIComponent(agencyId)}?${params}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );
        if (!response.ok) throw new Error("Unable to load bookings for this agency.");
        const data = await response.json();
        if (!Array.isArray(data.bookings)) {
          throw new Error(data.message || "Unexpected bookings response.");
        }
        if (active) {
          setBookings(data.bookings);
          setBookingsTotal(Number(data.total) || 0);
          setBookingsTotalPages(Math.max(1, Number(data.totalPages) || 1));
          setBookingStats(data.stats || null);
        }
      } catch (loadError) {
        if (active) {
          setBookings([]);
          setBookingStats(null);
          setBookingsError(loadError.message || "Unable to load bookings for this agency.");
        }
      } finally {
        if (active) setLoadingBookings(false);
      }
    }

    loadAgencyBookings();
    return () => {
      active = false;
    };
  }, [BASE_URL, activeAgencyTab, bookingsPage, selectedAgency, tokenKeyName]);

  const registeredAddress = getAddress(selectedAgency?.registeredAddress);
  const agencyContactName = [
    selectedAgency?.user?.firstName || selectedAgency?.userId?.firstName,
    selectedAgency?.user?.lastName || selectedAgency?.userId?.lastName,
  ]
    .filter(Boolean)
    .join(" ");
  const ownerName =
    selectedAgency?.primaryContactPerson ||
    agencyContactName ||
    selectedAgency?.operatorDisplayName;
  const documents = selectedAgency
    ? [
        {
          title: "PAN & Business Identity",
          doc: selectedAgency.panDoc || selectedAgency.businessRegistrationDoc,
        },
        {
          title: "GST Registration Certificate",
          doc: selectedAgency.gstDoc,
        },
        {
          title: "Stage Carriage Fleet Permits",
          doc: selectedAgency.fleetPermitDoc || selectedAgency.permitDoc,
        },
        {
          title: "Settlement Bank Account Proof",
          doc: selectedAgency.bankProofDoc || selectedAgency.bankDetails?.proofDoc,
        },
      ]
    : [];
  const busStats = {
    total: buses.length,
    available: buses.filter((bus) => ["approved", "active", "available"].includes(getBusStatus(bus))).length,
    onTrip: buses.filter((bus) => ["on_trip", "in_progress", "on trip"].includes(getBusStatus(bus))).length,
    maintenance: buses.filter((bus) => ["maintenance", "under_maintenance", "under maintenance"].includes(getBusStatus(bus))).length,
  };
  const detailBus = selectedBus
    ? {
        _id: selectedBus._id || selectedBus.id || selectedBus.busId,
        registration: selectedBus.registrationNumber || selectedBus.busName || "Bus details",
        operator: selectedBus.operatorName || getAgencyName(selectedAgency),
        model: [selectedBus.manufacturer, selectedBus.model].filter(Boolean).join(" ") || "Not provided",
        specification: getBusType(selectedBus),
        deck: `${selectedBus.deckConfiguration || "Single"} deck`,
        capacity: `${selectedBus.passengerCapacity || selectedBus.totalSeats || 0} seats`,
        depot: selectedBus.depot || selectedAgency?.operatingAddress?.city || "Not provided",
        odometer: selectedBus.odometer ? `${selectedBus.odometer} km` : "Not provided",
        totalTrips: getBusCount(selectedBus, "totalTrips", "tripCount"),
        upcomingTrips: getBusCount(selectedBus, "upcomingTrips", "upcomingTripCount"),
        inProgressTrips: getBusCount(selectedBus, "inProgressTrips", "inProgress"),
        completedTrips: getBusCount(selectedBus, "completedTrips", "completedTripCount"),
        cancelledTrips: getBusCount(selectedBus, "cancelledTrips", "cancelledTripCount"),
        draftTrips: getBusCount(selectedBus, "draftTrips", "draftCount"),
      }
    : null;

  if (detailBus) {
    return (
      <TravelBusDetailView
        bus={detailBus}
        onBack={() => {
          setSelectedBus(null);
          setActiveAgencyTab("Bus Overview");
        }}
        Navbar={AgencyNavbar}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8f9] text-[#172526]">
      {selectedAgency ? <AgencyNavbar /> : <AdminNavbar />}

      <main className="mx-auto w-full max-w-[1600px] px-4 pb-8 pt-5 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#172526] sm:text-2xl">
              {selectedAgency ? `${getAgencyName(selectedAgency)} Overview` : "Agency Profile Overview"}
            </h1>
            <p className="mt-1 text-xs text-[#688080]">
              {selectedAgency
                ? "Live passenger ticket reservations & payment receipts across all routes"
                : "Live bus tracking, intercity routes, and passenger booking engine"}
            </p>
          </div>

          <div className="relative w-full sm:w-[290px]">
            <label className="flex h-9 items-center gap-2 rounded-lg border border-[#d6e3e6] bg-white px-3 text-slate-500 shadow-sm">
              <Search size={14} className="shrink-0" />
              <input
                type="search"
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                placeholder="Search agency name"
                aria-label="Search agency name"
                aria-expanded={searchOpen && Boolean(search.trim())}
                aria-controls="agency-search-results"
                className="min-w-0 flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
              />
            </label>
            {searchOpen && search.trim() && (
              <div
                id="agency-search-results"
                className="absolute left-0 right-0 top-full z-40 mt-1 max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
              >
                {loadingAgencies ? (
                  <p className="px-3 py-2 text-xs text-slate-500">Loading agencies...</p>
                ) : agencies.length ? (
                  agencies.map((agency) => (
                    <button
                      key={agency.agencyId || agency._id || agency.id || getAgencyName(agency)}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectAgency(agency)}
                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-teal-50"
                    >
                      <Building2 size={14} className="shrink-0 text-[#0e8290]" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{getAgencyName(agency)}</span>
                        <span className="block truncate text-[10px] text-slate-400">
                          {agency.registeredBusinessName || agency.businessEmail || agency.user?.email}
                        </span>
                      </span>
                      <span className="shrink-0 text-right text-[10px] text-slate-400">
                        <span className="block">{agency.status || "Agency"}</span>
                        <span className="block">{agency.busCount ?? 0} buses · {agency.driverCount ?? 0} drivers · {agency.crewCount ?? 0} crew</span>
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-xs text-slate-500">
                    No agencies found matching “{search}”.
                  </p>
                )}
              </div>
            )}
          </div>
        </header>

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {error}
          </p>
        )}

        {loadingProfile && !selectedAgency ? (
          <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-500">
            Loading agency profile...
          </div>
        ) : selectedAgency ? (
          <div className="mt-5 space-y-3">
            <nav aria-label="Agency profile sections" role="tablist" className="flex h-12 w-full max-w-[880px] gap-1 rounded-lg bg-[#edf2f6] p-1">
              {["Travels Overview", "Bus Overview", "Trips", "Bookings"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeAgencyTab === tab}
                  onClick={() => setActiveAgencyTab(tab)}
                  className={`h-10 min-w-fit flex-1 rounded-md px-4 text-[10px] font-medium ${
                    activeAgencyTab === tab ? "bg-white text-[#087f95] shadow-sm" : "text-slate-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>

            {activeAgencyTab === "Travels Overview" ? (<>
            <section className="overflow-hidden rounded-xl border border-[#dbe6e9] bg-white">
              <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-[#078A97]">
                  <Building2 size={16} />
                </span>
                <div>
                  <h2 className="text-xs font-semibold text-slate-800">Company Profile</h2>
                  <p className="text-[9px] text-slate-400">Legal identity and operating information</p>
                </div>
              </div>
              <dl className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
                <InfoItem label="Registration Number" value={selectedAgency.registrationNumber} />
                <InfoItem label="Legal Business Name" value={selectedAgency.registeredBusinessName || selectedAgency.businessName} />
                <InfoItem label="Trade Name" value={selectedAgency.tradeName || selectedAgency.operatingName || selectedAgency.operatorDisplayName} />
                <InfoItem label="Business Type" value={selectedAgency.businessType} />
                <InfoItem label="Owner / Authorized Person" value={ownerName} />
                <InfoItem
                  label="Phone Verification"
                  value={selectedAgency.businessMobile || selectedAgency.user?.phone || selectedAgency.userId?.phone}
                  className="text-emerald-700"
                />
                <InfoItem
                  label="Email Verification"
                  value={selectedAgency.businessEmail || selectedAgency.user?.email || selectedAgency.userId?.email}
                />
                <InfoItem label="Bus Pan" value={selectedAgency.businessPan} />
                <InfoItem label="GSTIN" value={selectedAgency.gstin} />
                <InfoItem
                  label="Registered Date"
                  value={selectedAgency.createdAt ? new Date(selectedAgency.createdAt).toLocaleDateString() : "Not provided"}
                />
                <InfoItem
                  label="Operating Locations"
                  value={Array.isArray(selectedAgency.operatingLocations)
                    ? selectedAgency.operatingLocations.join(", ")
                    : selectedAgency.operatingLocations || selectedAgency.operatingAddress?.city}
                />
                <InfoItem
                  label="Registered Address"
                  value={registeredAddress}
                  className="border-t border-slate-100 sm:col-span-2 lg:col-span-3"
                />
              </dl>
            </section>

            <section className="rounded-xl border border-[#dbe6e9] bg-white p-4">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-[#078A97]">
                  <FileCheck2 size={15} />
                </span>
                <div>
                  <h2 className="text-xs font-semibold text-slate-800">Document Verification</h2>
                  <p className="text-[9px] text-slate-400">Requirements shown are configured for this business type</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {documents.map(({ title, doc }) => {
                  const documentUrl = doc?.url || doc?.fileUrl;
                  return (
                    <article key={title} className="flex min-h-[76px] items-start gap-2.5 rounded-lg border border-slate-200 p-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-teal-50 text-[#078A97]">
                        <FileText size={14} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[10px] font-semibold text-slate-800">{title}</h3>
                        <p className="mt-0.5 text-[9px] text-slate-400">Required document</p>
                        <p className="mt-2 truncate text-[9px] text-slate-500">
                          {doc?.fileName || doc?.title || "No document uploaded"}
                        </p>
                      </div>
                      {documentUrl ? (
                        <a href={documentUrl} target="_blank" rel="noreferrer" className="self-end text-[9px] font-semibold text-teal-700 hover:underline">
                          Preview
                        </a>
                      ) : (
                        <span className="self-end text-[9px] text-slate-400">Unavailable</span>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
            </>) : activeAgencyTab === "Bus Overview" ? (
              <AgencyFleetOverview
                agency={selectedAgency}
                buses={buses}
                loading={loadingBuses}
                error={busError}
                onSelectBus={setSelectedBus}
              />
            ) : activeAgencyTab === "Trips" ? (
              <section className="overflow-hidden rounded-xl border border-[#dbe6e9] bg-white">
                {tripsError && (
                  <p role="alert" className="border-b border-rose-100 bg-rose-50 px-4 py-2 text-xs text-rose-700">
                    {tripsError}
                  </p>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left">
                    <thead className="bg-[#f3f7f8] text-[10px] font-semibold uppercase tracking-wide text-[#687d86]">
                      <tr>
                        <th className="px-4 py-3">Trip ID</th>
                        <th className="px-3 py-3">Route</th>
                        <th className="px-3 py-3">Departure</th>
                        <th className="px-3 py-3">Arrival</th>
                        <th className="px-3 py-3">Bus</th>
                        <th className="px-3 py-3">Capacity</th>
                        <th className="px-3 py-3">Driver &amp; Crew</th>
                        <th className="px-3 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      {loadingTrips ? (
                        <tr>
                          <td colSpan="8" className="px-4 py-10 text-center text-slate-500">Loading agency trips...</td>
                        </tr>
                      ) : trips.length ? (
                        trips.map((trip) => {
                          const routeName =
                            trip.route?.routeName ||
                            [trip.origin || trip.route?.originCity, trip.destination || trip.route?.destinationCity]
                              .filter(Boolean)
                              .join(" → ") ||
                            "Not provided";
                          const crewNames = [
                            ...(Array.isArray(trip.drivers) ? trip.drivers : []),
                            ...(Array.isArray(trip.crews) ? trip.crews : []),
                          ]
                            .map((member) => member.fullName)
                            .filter(Boolean)
                            .join(", ") || "Not assigned";
                          const status = String(trip.status || "Unknown")
                            .replaceAll("_", " ")
                            .replace(/\b\w/g, (letter) => letter.toUpperCase());
                          return (
                            <tr key={trip._id} className="hover:bg-slate-50">
                              <td className="whitespace-nowrap px-4 py-3 font-semibold text-teal-800">{trip.tripNumber || trip._id || "—"}</td>
                              <td className="px-3 py-3 font-medium text-slate-800">{routeName}</td>
                              <td className="whitespace-nowrap px-3 py-3 text-slate-600">{formatTripDateTime(trip.departureDateTime)}</td>
                              <td className="whitespace-nowrap px-3 py-3 text-slate-600">{formatTripDateTime(trip.arrivalDateTime)}</td>
                              <td className="px-3 py-3 text-slate-600">{trip.busId?.busName || trip.busId?.registrationNumber || "Not provided"}</td>
                              <td className="whitespace-nowrap px-3 py-3 text-slate-600">{trip.seatLayout?.totalPassengerCapacity ?? trip.busId?.passengerCapacity ?? "—"}</td>
                              <td className="px-3 py-3 text-slate-600">{crewNames}</td>
                              <td className="px-3 py-3 text-slate-600">{status}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="8" className="px-4 py-10 text-center text-slate-500">No trips found for this agency.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <footer className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
                  <p>
                    Showing {trips.length ? (tripsPage - 1) * 20 + 1 : 0}–
                    {(tripsPage - 1) * 20 + trips.length} of {tripsTotal} trips
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTripsPage((page) => Math.max(1, page - 1))}
                      disabled={loadingTrips || tripsPage <= 1}
                      className="rounded-md border border-slate-200 px-3 py-1.5 disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span>{tripsPage} / {tripsTotalPages}</span>
                    <button
                      type="button"
                      onClick={() => setTripsPage((page) => Math.min(tripsTotalPages, page + 1))}
                      disabled={loadingTrips || tripsPage >= tripsTotalPages}
                      className="rounded-md border border-slate-200 px-3 py-1.5 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </footer>
              </section>
            ) : activeAgencyTab === "Bookings" ? (
              <AgencyBookingsOverview
                bookings={bookings}
                page={bookingsPage}
                total={bookingsTotal}
                totalPages={bookingsTotalPages}
                stats={bookingStats}
                loading={loadingBookings}
                error={bookingsError}
                onPageChange={setBookingsPage}
              />
            ) : (
              <section className="rounded-xl border border-[#dbe6e9] bg-white px-4 py-12 text-center text-xs text-slate-500">
                {activeAgencyTab} data is not available here yet.
              </section>
            )}
          </div>
        ) : (
          <section
            aria-label="Agency profile search"
            className="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center px-4 pb-10 text-center"
          >
            <div className="flex h-32 w-64 items-center justify-center rounded-[50%] bg-[#e8f5f5]">
              <div className="flex h-[74px] w-[58px] items-center justify-center rounded-[18px] border-2 border-[#0e8290] bg-white text-[#0e8290] shadow-sm">
                <BusFront size={42} strokeWidth={1.6} />
              </div>
            </div>
            <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0e8290]">
              Agency Profile
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#172b3a] sm:text-2xl">
              Search the agency to view Details
            </h2>
            <p className="mt-1 max-w-md text-xs leading-5 text-[#71869a]">
              Choose your bus structure and configure seats and sleeper berths
              <br className="hidden sm:block" /> with a live preview.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}