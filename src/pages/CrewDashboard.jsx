import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Map as MapIcon,
  Plus,
  Search,
  SlidersHorizontal,
  TicketCheck,
  UsersRound,
  X,
} from "lucide-react";

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
  scheduled: "bg-[#e9f8f7] text-[#138e91]",
  in_progress: "bg-[#f1f1ff] text-[#7373d9]",
  completed: "bg-[#e6f5f4] text-[#188d91]",
  cancelled: "bg-[#fff0ed] text-[#df6655]",
};

function formatTripDateTime(value, options) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("en-IN", { ...options, timeZone: "Asia/Kolkata" });
}

function getTripRoute(trip) {
  const origin = trip.origin || trip.route?.originCity || "—";
  const destination = trip.destination || trip.route?.destinationCity || "—";
  return `${origin} → ${destination}`;
}

function getTripBusNumber(trip) {
  return trip.bus?.registrationNumber || trip.bus?.busNumber || "—";
}

function exportTripsToCsv(rows) {
  const headers = ["Trip ID", "Route", "Departure", "Bus", "Crew", "Status"];
  const csv = [headers, ...rows.map((row) => [
    row._id,
    getTripRoute(row),
    formatTripDateTime(row.departureDateTime, { dateStyle: "medium", timeStyle: "short" }),
    getTripBusNumber(row),
    (row.crews || []).map((member) => member.fullName).join("; "),
    row.currentStatus || row.status,
  ])]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "recent-trips.csv";
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

function PassengerAttendance({ onBack, tripId }) {
  const { BASE_URL, TOKEN_KEY } = useAuth();
  const baseUrl = BASE_URL.replace(/\/+$/, "");
  const apiBaseUrl = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [attendanceSummaryError, setAttendanceSummaryError] = useState("");
  const [attendanceSummaryLoading, setAttendanceSummaryLoading] = useState(true);
  const [passengers, setPassengers] = useState(initialAttendance);
  const [passengersError, setPassengersError] = useState("");
  const [passengersLoading, setPassengersLoading] = useState(true);
  const [passengerUpdateError, setPassengerUpdateError] = useState("");
  const [updatingPassengerId, setUpdatingPassengerId] = useState("");
  const [bulkAttendanceLoading, setBulkAttendanceLoading] = useState(false);
  const [attendanceRosterRefreshKey, setAttendanceRosterRefreshKey] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [routeFilter, setRouteFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState("Boarded");

  useEffect(() => {
    const controller = new AbortController();
    const fetchAttendanceSummary = async () => {
      setAttendanceSummaryError("");

      try {
        if (!tripId) throw new Error("Trip ID is missing; attendance summary cannot be loaded.");
        const token = localStorage.getItem(TOKEN_KEY || "exte_key");
        const response = await fetch(
          `${apiBaseUrl}/crew/trips/${encodeURIComponent(tripId)}/attendance/summary`,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            signal: controller.signal,
          },
        );
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload?.success || !payload.data) {
          throw new Error(payload?.message || "Unable to load attendance summary.");
        }

        setAttendanceSummary(payload.data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setAttendanceSummaryError(error.message || "Unable to load attendance summary.");
        }
      } finally {
        if (!controller.signal.aborted) setAttendanceSummaryLoading(false);
      }
    };

    fetchAttendanceSummary();
    return () => controller.abort();
  }, [apiBaseUrl, TOKEN_KEY, tripId]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchPassengers = async () => {
      setPassengersLoading(true);
      setPassengersError("");
      setPassengers([]);
      setSelectedIds([]);

      try {
        if (!tripId) throw new Error("Trip ID is missing; passenger attendance cannot be loaded.");
        const token = localStorage.getItem(TOKEN_KEY || "exte_key");
        const params = new URLSearchParams({ page: "1", limit: "50" });
        if (statusFilter !== "All") params.set("status", statusFilter);
        const response = await fetch(
          `${apiBaseUrl}/crew/trips/${encodeURIComponent(tripId)}/attendance?${params.toString()}`,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            signal: controller.signal,
          },
        );
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload?.success || !Array.isArray(payload.data)) {
          throw new Error(payload?.message || "Unable to load passenger attendance.");
        }

        setPassengers(payload.data.map((record, index) => {
          const passenger = record.passenger || record.passengerDetails || {};
          const booking = record.booking || {};
          const name = record.passengerName
            || record.name
            || passenger.fullName
            || passenger.name
            || [passenger.firstName, passenger.lastName].filter(Boolean).join(" ")
            || "—";
          const seatValue = record.seatNumbers
            || booking.seatNumbers
            || record.seatNumber
            || record.seat
            || passenger.seatNumber;
          const seat = Array.isArray(seatValue) ? seatValue.join(", ") : seatValue || "—";
          const boardingPoint = record.boardingPoint || record.pickupPoint || record.from || "";
          const droppingPoint = record.droppingPoint || record.dropoffPoint || record.to || "";
          const routeValue = record.route;
          const route = typeof routeValue === "string"
            ? routeValue
            : routeValue?.name
              || [routeValue?.originCity || boardingPoint, routeValue?.destinationCity || droppingPoint].filter(Boolean).join(" → ")
              || "—";

          return {
            ...record,
            id: String(record._id || record.id || record.pnr || record.bookingNumber || booking.bookingNumber || `attendance-${index}`),
            name,
            initials: name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase(),
            seat,
            route,
            contact: record.contact || record.phone || record.mobile || passenger.phone || passenger.mobile || "—",
            status: record.attendanceStatus || record.status || record.boardingStatus || "Pending",
          };
        }));
      } catch (error) {
        if (error.name !== "AbortError") {
          setPassengersError(error.message || "Unable to load passenger attendance.");
        }
      } finally {
        if (!controller.signal.aborted) setPassengersLoading(false);
      }
    };

    fetchPassengers();
    return () => controller.abort();
  }, [apiBaseUrl, TOKEN_KEY, tripId, statusFilter, attendanceRosterRefreshKey]);

  const filteredPassengers = useMemo(() => passengers.filter((passenger) => {
    const matchesSearch = `${passenger.name} ${passenger.id} ${passenger.seat}`
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    const matchesStatus = statusFilter === "All" || passenger.status === statusFilter;
    const matchesRoute = routeFilter === "All" || passenger.route === routeFilter;
    return matchesSearch && matchesStatus && matchesRoute;
  }), [passengers, search, statusFilter, routeFilter]);

  const totalBooked = attendanceSummary?.totalBooked ?? 0;
  const boardedCount = attendanceSummary?.boarded ?? 0;
  const notBoardedCount = attendanceSummary?.notBoarded ?? 0;
  const pendingCount = attendanceSummary?.pending ?? 0;
  const boardingProgress = attendanceSummary?.boardingProgress ?? 0;
  const attendanceSummaryUnavailable = attendanceSummaryLoading || !attendanceSummary;

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

  const updatePassengerStatus = async (passenger) => {
    const nextStatus = passenger.status === "Boarded" ? "Pending" : "Boarded";
    const passengerId = passenger.passengerId || passenger.passenger?._id || passenger._id || passenger.id;
    setPassengerUpdateError("");
    setUpdatingPassengerId(passenger.id);

    try {
      if (!tripId) throw new Error("Trip ID is missing; attendance cannot be updated.");
      if (!passengerId) throw new Error("Passenger ID is missing; attendance cannot be updated.");
      const token = localStorage.getItem(TOKEN_KEY || "exte_key");
      const response = await fetch(
        `${apiBaseUrl}/crew/trips/${encodeURIComponent(tripId)}/attendance/${encodeURIComponent(passengerId)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ status: nextStatus }),
        },
      );
      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "Unable to update passenger attendance.");
      }

      setPassengers((rows) => rows.map((row) => row.id === passenger.id
        ? { ...row, status: nextStatus }
        : row));
      setIsSubmitted(false);
    } catch (error) {
      setPassengerUpdateError(error.message || "Unable to update passenger attendance.");
    } finally {
      setUpdatingPassengerId("");
    }
  };

  const confirmBulkAttendance = async () => {
    const passengerIds = selectedPassengers
      .map((passenger) => passenger.passengerId || passenger.passenger?._id || passenger._id || passenger.id)
      .filter(Boolean)
      .map(String);
    setPassengerUpdateError("");
    setBulkAttendanceLoading(true);

    try {
      if (!tripId) throw new Error("Trip ID is missing; attendance cannot be updated.");
      if (!passengerIds.length || passengerIds.length !== selectedPassengers.length) {
        throw new Error("One or more selected passengers are missing an ID.");
      }

      const token = localStorage.getItem(TOKEN_KEY || "exte_key");
      const response = await fetch(
        `${apiBaseUrl}/crew/trips/${encodeURIComponent(tripId)}/attendance/bulk`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ passengerIds, status: bulkStatus }),
        },
      );
      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "Unable to update passenger attendance.");
      }

      if (payload.data?.summary) setAttendanceSummary(payload.data.summary);
      setIsSubmitted(false);
      setSelectedIds([]);
      setIsBulkModalOpen(false);
      setAttendanceRosterRefreshKey((current) => current + 1);
    } catch (error) {
      setPassengerUpdateError(error.message || "Unable to update passenger attendance.");
    } finally {
      setBulkAttendanceLoading(false);
    }
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
        {attendanceSummaryError && (
          <p role="alert" className="mt-3 text-[13px] text-rose-600">{attendanceSummaryError}</p>
        )}
        {passengersError && (
          <p role="alert" className="mt-3 text-[13px] text-rose-600">{passengersError}</p>
        )}
        {passengerUpdateError && (
          <p role="alert" className="mt-3 text-[13px] text-rose-600">{passengerUpdateError}</p>
        )}

        <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_2.2fr]">
          <article className="flex min-h-[72px] items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f8f5] text-[#139992]"><UsersRound size={17} /></span>
            <div><p className="text-xl font-semibold leading-none">{attendanceSummaryUnavailable ? "—" : totalBooked}</p><p className="mt-1 text-[12px] text-slate-400">Total booked</p></div>
          </article>
          <article className="flex min-h-[72px] items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8faf6] text-[#13a895]"><Check size={17} /></span>
            <div><p className="text-xl font-semibold leading-none">{attendanceSummaryUnavailable ? "—" : boardedCount}</p><p className="mt-1 text-[12px] text-slate-400">Boarded</p></div>
          </article>
          <article className="flex min-h-[72px] items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#effaf8] text-[#16a99c]"><X size={17} /></span>
            <div><p className="text-xl font-semibold leading-none">{attendanceSummaryUnavailable ? "—" : notBoardedCount}</p><p className="mt-1 text-[12px] text-slate-400">Not boarded</p></div>
          </article>
          <article className="flex min-h-[72px] items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eefaf7] text-[#13a895]"><Clock3 size={17} /></span>
            <div><p className="text-xl font-semibold leading-none">{attendanceSummaryUnavailable ? "—" : pendingCount}</p><p className="mt-1 text-[12px] text-slate-400">Pending</p></div>
          </article>
          <article className="rounded-xl border border-slate-100 bg-white px-3 py-3">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-slate-500">Boarding progress</span>
              <span className="font-semibold text-[#334454]">{attendanceSummaryUnavailable ? "—" : `${boardingProgress}%`}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#edf1f3]">
              <div className="h-full rounded-full bg-[#108b80] transition-all" style={{ width: `${attendanceSummaryUnavailable ? 0 : boardingProgress}%` }} />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">{attendanceSummaryUnavailable ? (attendanceSummaryLoading ? "Loading attendance summary..." : "Attendance summary unavailable.") : `${boardedCount} of ${totalBooked} passengers boarded`}</p>
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
                        onClick={() => updatePassengerStatus(passenger)}
                        disabled={Boolean(updatingPassengerId)}
                        className={`inline-flex min-w-[72px] items-center justify-center gap-1 rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition ${
                          passenger.status === "Boarded" ? "border-slate-200 bg-white text-[#526271] hover:bg-slate-50" : "border-[#d7ece6] bg-white text-[#168f7e] hover:bg-[#f1faf7]"
                        }`}
                      >
                        {updatingPassengerId === passenger.id ? "Updating..." : passenger.status === "Boarded" ? "Correct" : <><Check size={11} /> Boarded</>}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPassengers.length === 0 && (
                  <tr><td colSpan="8" className="px-4 py-8 text-center text-[13px] text-slate-400">{passengersLoading ? "Loading passengers..." : passengersError ? "Unable to load passengers." : "No passengers match your search or filters."}</td></tr>
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
                  [String(totalBooked), "Booked"],
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
                  disabled={bulkAttendanceLoading}
                  className="h-10 rounded-xl bg-[#108b93] px-5 text-[13px] font-semibold text-white transition hover:bg-[#0b737b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {bulkAttendanceLoading ? "Updating..." : "Confirm Update"}
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function CrewTripDetails({ onBack, trip = {} }) {
  const { BASE_URL, TOKEN_KEY } = useAuth();
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [currentTripStatus, setCurrentTripStatus] = useState(trip.currentStatus || trip.latestStatusUpdate?.status || trip.status || "Scheduled");
  const [newTripStatus, setNewTripStatus] = useState("");
  const [statusDate, setStatusDate] = useState("2026-06-18");
  const [statusTime, setStatusTime] = useState("06:55");
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [statusRemarks, setStatusRemarks] = useState("");
  const [statusPhoto, setStatusPhoto] = useState(null);
  const [statusPhotoError, setStatusPhotoError] = useState("");
  const [statusSubmitError, setStatusSubmitError] = useState("");
  const [statusSubmitLoading, setStatusSubmitLoading] = useState(false);
  const [supportedStatuses, setSupportedStatuses] = useState([
    "Scheduled",
    "Preparing for Departure",
    "Boarding Started",
    "Boarding Completed",
    "Departed",
    "In Transit",
    "Reached Destination",
    "Completed",
    "Delayed",
    "Cancelled",
  ]);
  const [statusDetailsLoading, setStatusDetailsLoading] = useState(false);
  const [statusDetailsError, setStatusDetailsError] = useState("");
  const [lastStatusUpdate, setLastStatusUpdate] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [statusHistoryLoading, setStatusHistoryLoading] = useState(true);
  const [statusHistoryError, setStatusHistoryError] = useState("");
  const [routeDetails, setRouteDetails] = useState(null);
  const [routeDetailsError, setRouteDetailsError] = useState("");
  const [routeDetailsLoading, setRouteDetailsLoading] = useState(true);
  const [assignedBus, setAssignedBus] = useState(null);
  const [busDetailsError, setBusDetailsError] = useState("");
  const [busDetailsLoading, setBusDetailsLoading] = useState(true);
  const [assignedCrewDetails, setAssignedCrewDetails] = useState(null);
  const [crewDetailsError, setCrewDetailsError] = useState("");
  const [crewDetailsLoading, setCrewDetailsLoading] = useState(true);
  const routeApiBaseUrl = BASE_URL.replace(/\/+$/, "").replace(/\/api$/, "");
  const tripId = trip.tripId || trip._id;
  const route = routeDetails || trip.route || {};
  const bus = assignedBus || trip.bus || {};
  const tripOrigin = trip.origin || route.originCity || "—";
  const tripDestination = trip.destination || route.destinationCity || "—";

  useEffect(() => {
    if (!tripId) {
      setRouteDetailsLoading(false);
      setRouteDetailsError("Trip ID is missing; route details cannot be loaded.");
      return undefined;
    }

    const controller = new AbortController();
    const fetchRouteDetails = async () => {
      setRouteDetails(null);
      setRouteDetailsError("");
      setRouteDetailsLoading(true);

      try {
        const token = localStorage.getItem(TOKEN_KEY || "exte_key");
        const response = await fetch(`${routeApiBaseUrl}/api/crew/trips/${encodeURIComponent(tripId)}/route`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload?.success || !payload.data?.route) {
          throw new Error(payload?.message || "Unable to load trip route details.");
        }

        setRouteDetails(payload.data.route);
      } catch (error) {
        if (error.name !== "AbortError") {
          setRouteDetailsError(error.message || "Unable to load trip route details.");
        }
      } finally {
        if (!controller.signal.aborted) setRouteDetailsLoading(false);
      }
    };

    fetchRouteDetails();
    return () => controller.abort();
  }, [routeApiBaseUrl, TOKEN_KEY, tripId]);

  useEffect(() => {
    if (!tripId) {
      setBusDetailsLoading(false);
      setBusDetailsError("Trip ID is missing; assigned bus details cannot be loaded.");
      return undefined;
    }

    const controller = new AbortController();
    const fetchBusDetails = async () => {
      setAssignedBus(null);
      setBusDetailsError("");
      setBusDetailsLoading(true);

      try {
        const token = localStorage.getItem(TOKEN_KEY || "exte_key");
        const response = await fetch(`${routeApiBaseUrl}/api/crew/trips/${encodeURIComponent(tripId)}/bus`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload?.success || !payload.data) {
          throw new Error(payload?.message || "Unable to load assigned bus details.");
        }

        setAssignedBus(payload.data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setBusDetailsError(error.message || "Unable to load assigned bus details.");
        }
      } finally {
        if (!controller.signal.aborted) setBusDetailsLoading(false);
      }
    };

    fetchBusDetails();
    return () => controller.abort();
  }, [routeApiBaseUrl, TOKEN_KEY, tripId]);

  useEffect(() => {
    if (!tripId) {
      setCrewDetailsLoading(false);
      setCrewDetailsError("Trip ID is missing; assigned crew details cannot be loaded.");
      return undefined;
    }

    const controller = new AbortController();
    const fetchAssignedCrew = async () => {
      setAssignedCrewDetails(null);
      setCrewDetailsError("");
      setCrewDetailsLoading(true);

      try {
        const token = localStorage.getItem(TOKEN_KEY || "exte_key");
        const response = await fetch(`${routeApiBaseUrl}/api/crew/trips/${encodeURIComponent(tripId)}/crew`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload?.success || !payload.data
          || !Array.isArray(payload.data.drivers) || !Array.isArray(payload.data.crews)) {
          throw new Error(payload?.message || "Unable to load assigned crew details.");
        }

        setAssignedCrewDetails(payload.data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setCrewDetailsError(error.message || "Unable to load assigned crew details.");
        }
      } finally {
        if (!controller.signal.aborted) setCrewDetailsLoading(false);
      }
    };

    fetchAssignedCrew();
    return () => controller.abort();
  }, [routeApiBaseUrl, TOKEN_KEY, tripId]);

  useEffect(() => {
    if (!tripId) {
      setStatusHistoryLoading(false);
      setStatusHistoryError("Trip ID is missing; status history cannot be loaded.");
      return undefined;
    }

    const controller = new AbortController();
    const fetchStatusHistory = async () => {
      setStatusHistory([]);
      setStatusHistoryError("");
      setStatusHistoryLoading(true);

      try {
        const token = localStorage.getItem(TOKEN_KEY || "exte_key");
        const response = await fetch(`${routeApiBaseUrl}/api/crew/trips/${encodeURIComponent(tripId)}/status-history`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload?.success || !Array.isArray(payload.data)) {
          throw new Error(payload?.message || "Unable to load trip status history.");
        }

        setStatusHistory(payload.data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setStatusHistoryError(error.message || "Unable to load trip status history.");
        }
      } finally {
        if (!controller.signal.aborted) setStatusHistoryLoading(false);
      }
    };

    fetchStatusHistory();
    return () => controller.abort();
  }, [routeApiBaseUrl, TOKEN_KEY, tripId]);

  const stops = (() => {
    const routeStops = Array.isArray(route.stops)
      ? route.stops.map((stop) => ({
        ...stop,
        detail: stop.detail || ({
          boarding: "Boarding point",
          dropping: "Dropping point",
          both: "Boarding & dropping point",
        }[stop.stopType]) || stop.stopType,
      }))
      : [];
    const boardingPoints = Array.isArray(route.boardingPoints)
      ? route.boardingPoints.map((stop) => ({ ...stop, detail: "Boarding point" }))
      : [];
    const droppingPoints = Array.isArray(route.droppingPoints)
      ? route.droppingPoints.map((stop) => ({ ...stop, detail: "Dropping point" }))
      : [];
    const tripStops = routeStops.length ? routeStops : [...boardingPoints, ...droppingPoints];
    const stopsById = new Map();

    tripStops.forEach((stop, index) => {
      const key = stop._id || `${stop.sequenceNumber ?? index}-${stop.name || stop.city || "stop"}`;
      const existingStop = stopsById.get(key);
      stopsById.set(key, {
        ...existingStop,
        ...stop,
        detail: existingStop && existingStop.detail !== stop.detail
          ? "Boarding & dropping point"
          : stop.detail || stop.stopType || (index === 0 ? "Origin" : "Stop"),
        state: "upcoming",
      });
    });

    const orderedStops = [...stopsById.values()].sort((first, second) => (first.sequenceNumber || 0) - (second.sequenceNumber || 0));
    return orderedStops.map((stop, index) => {
      const endpointTime = index === 0
        ? formatTripDateTime(trip.departureDateTime, { hour: "2-digit", minute: "2-digit" })
        : index === orderedStops.length - 1
          ? formatTripDateTime(trip.arrivalDateTime, { hour: "2-digit", minute: "2-digit" })
          : null;

      return {
        ...stop,
        time: stop.time || stop.estimatedArrivalTime || (endpointTime && endpointTime !== "—" ? endpointTime : "Not scheduled"),
      };
    });
  })();
  const crewData = assignedCrewDetails || {
    drivers: Array.isArray(trip.drivers) ? trip.drivers : [],
    crews: Array.isArray(trip.crew || trip.crews) ? (trip.crew || trip.crews) : [],
  };
  const crew = [
    ...crewData.drivers.map((member) => ({ ...member, role: "Driver" })),
    ...crewData.crews.map((member) => ({ ...member, role: member.crewRole || "Crew" })),
  ].map((member) => ({
    ...member,
    initials: (member.fullName || "?").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    name: member.fullName || "Crew member",
  }));
  const passengerStats = trip.passengerSummary || trip.passengerStats || {};
  const bookedCount = passengerStats.totalBooked ?? trip.bookedCount ?? null;
  const boardedCount = passengerStats.boarded ?? trip.boardedCount ?? null;
  const pendingCount = passengerStats.pending ?? trip.pendingCount ?? null;
  const boardingProgress = passengerStats.boardingProgress
    ?? (bookedCount === null ? null : bookedCount ? Math.round(((boardedCount || 0) / bookedCount) * 100) : 0);
  const scheduledDeparture = trip.departureDateTime ? new Date(trip.departureDateTime) : null;
  const reportingTime = trip.reportingTime || (scheduledDeparture
    ? formatTripDateTime(new Date(scheduledDeparture.getTime() - 15 * 60 * 1000), { hour: "2-digit", minute: "2-digit" })
    : "—");
  const actualDepartureTime = trip.actualDepartureTime || (trip.departureDateTime
    ? `${formatTripDateTime(trip.departureDateTime, { hour: "2-digit", minute: "2-digit" })} (scheduled)`
    : "—");

  if (isAttendanceOpen) {
    return <PassengerAttendance onBack={() => setIsAttendanceOpen(false)} tripId={tripId} />;
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

  const [hour24, minute] = statusTime.split(":");
  const hour12 = String(Number(hour24) % 12 || 12).padStart(2, "0");
  const meridiem = Number(hour24) >= 12 ? "PM" : "AM";
  const updateStatusTime = (hour, minutes, period) => {
    const hourIn24Format = Number(hour) % 12 + (period === "PM" ? 12 : 0);
    setStatusTime(`${String(hourIn24Format).padStart(2, "0")}:${minutes}`);
  };

  const confirmTripStatus = async (event) => {
    event.preventDefault();
    if (!newTripStatus || !statusRemarks.trim()) return;
    setStatusSubmitError("");
    setStatusSubmitLoading(true);

    try {
      if (!tripId) throw new Error("Trip ID is missing; status cannot be updated.");
      const token = localStorage.getItem(TOKEN_KEY || "exte_key");
      const submittedTime = `${hour12}:${minute} ${meridiem}`;
      const statusDetails = {
        status: newTripStatus,
        date: statusDate,
        time: submittedTime,
        remarks: statusRemarks.trim(),
      };
      const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      let body;

      if (statusPhoto) {
        body = new FormData();
        Object.entries(statusDetails).forEach(([key, value]) => body.append(key, value));
        body.append("photo", statusPhoto);
      } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(statusDetails);
      }

      const response = await fetch(`${routeApiBaseUrl}/api/crew/trips/${encodeURIComponent(tripId)}/status`, {
        method: "PUT",
        headers,
        body,
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.success || !payload.data) {
        throw new Error(payload?.message || "Unable to update trip status.");
      }

      const statusHistoryEntry = payload.data.statusHistory
        ? { ...payload.data.statusHistory, date: statusDate, time: submittedTime }
        : null;
      setCurrentTripStatus(payload.data.currentStatus || newTripStatus);
      setLastStatusUpdate(statusHistoryEntry);
      if (statusHistoryEntry) {
        setStatusHistory((current) => [
          statusHistoryEntry,
          ...current.filter((entry) => entry._id !== statusHistoryEntry._id),
        ]);
      }
      setIsStatusModalOpen(false);
      setNewTripStatus("");
      setStatusRemarks("");
      setStatusPhoto(null);
      setStatusPhotoError("");
    } catch (error) {
      setStatusSubmitError(error.message || "Unable to update trip status.");
    } finally {
      setStatusSubmitLoading(false);
    }
  };

  const openStatusModal = async () => {
    setIsStatusModalOpen(true);
    setStatusDetailsLoading(true);
    setStatusDetailsError("");

    try {
      if (!tripId) throw new Error("Trip ID is missing; current status cannot be loaded.");
      const token = localStorage.getItem(TOKEN_KEY || "exte_key");
      const response = await fetch(`${routeApiBaseUrl}/api/crew/trips/${encodeURIComponent(tripId)}/status`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.success || !payload.data) {
        throw new Error(payload?.message || "Unable to load current trip status.");
      }

      setCurrentTripStatus(payload.data.currentStatus || currentTripStatus);
      setLastStatusUpdate(payload.data.lastUpdated || null);
      if (Array.isArray(payload.data.supportedStatuses)) {
        setSupportedStatuses(payload.data.supportedStatuses);
      }
    } catch (error) {
      setStatusDetailsError(error.message || "Unable to load current trip status.");
    } finally {
      setStatusDetailsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f8f9] px-4 py-4 text-[#27394b] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-none">
        <button type="button" onClick={onBack} className="mb-3 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#687c88] transition hover:text-[#138795]">
          <ArrowLeft size={14} /> Back
        </button>

        <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#138795]">{trip._id || trip.tripId || "Trip details"}</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#27394b] sm:text-4xl">{getTripRoute(trip)}</h1>
            <p className="mt-1 text-[13px] text-slate-400">
              {formatTripDateTime(trip.departureDateTime, { dateStyle: "medium" })} · {getTripBusNumber(trip)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={openStatusModal} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#108894] px-3 text-[13px] font-medium text-white transition hover:bg-[#0b6975]">
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
                  <p className="mt-1 text-2xl font-semibold text-[#27394b]">{formatTripDateTime(trip.departureDateTime, { hour: "2-digit", minute: "2-digit" })}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{formatTripDateTime(trip.departureDateTime, { dateStyle: "medium" })}</p>
                  <p className="mt-1 text-[13px] font-medium text-[#46596a]">{tripOrigin}</p>
                  <p className="text-[11px] text-slate-400">{stops[0]?.name || "—"}</p>
                </div>
                <div className="flex min-w-[90px] flex-col items-center sm:min-w-[180px]">
                  <span className="mb-1 text-[11px] font-medium text-slate-400">
                    {route.estimatedDistance ? `${route.estimatedDistance} km` : "—"}
                    {route.estimatedDurationMinutes ? ` · ${Math.floor(route.estimatedDurationMinutes / 60)}h ${route.estimatedDurationMinutes % 60}m` : ""}
                  </span>
                  <div className="relative h-px w-full bg-[#dce7eb]">
                    <span className="absolute left-1/2 top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#d9efed] bg-white text-[#128f96]">
                      <BusFront size={13} />
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Expected arrival</p>
                  <p className="mt-1 text-2xl font-semibold text-[#27394b]">{formatTripDateTime(trip.arrivalDateTime, { hour: "2-digit", minute: "2-digit" })}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{formatTripDateTime(trip.arrivalDateTime, { dateStyle: "medium" })}</p>
                  <p className="mt-1 text-[13px] font-medium text-[#46596a]">{tripDestination}</p>
                  <p className="text-[11px] text-slate-400">{stops[stops.length - 1]?.name || "—"}</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-4">
                {[
                  ["Reporting", reportingTime],
                  ["Actual departure", actualDepartureTime],
                  ["Service", route.routeCategory || route.routeName || "—"],
                 
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
                <div>
                  <h2 className="text-[16px] font-semibold text-[#334454]">Route &amp; stops</h2>
                  {route.routeName && <p className="mt-1 text-[12px] font-medium text-[#526271]">{route.routeName}</p>}
                </div>
                <span className="text-[12px] font-medium text-slate-400">{stops.length} stops</span>
              </div>
              {route.description && <p className="mt-2 text-[12px] leading-5 text-slate-400">{route.description}</p>}
              {routeDetailsLoading && <p role="status" className="mt-3 text-[12px] text-slate-400">Loading route details...</p>}
              {routeDetailsError && <p role="alert" className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-rose-700">{routeDetailsError}</p>}
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
                        <p className="mt-0.5 text-[11px] text-slate-400">{[stop.detail, stop.city, stop.landmark].filter(Boolean).join(" · ")}</p>
                      </div>
                      <span className="text-[12px] font-semibold text-[#46596a]">{stop.time}</span>
                    </div>
                  </li>
                ))}
                {!stops.length && <li className="py-4 text-[13px] text-slate-400">No route stops available.</li>}
              </ol>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_12px_rgba(27,65,75,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-[#334454]">Passenger overview</h2>
                <button type="button" className="text-[12px] font-medium text-[#148994] hover:underline">Manage</button>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-around gap-5">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full" style={{ background: `conic-gradient(#138c95 0% ${boardingProgress ?? 0}%, #e1f3f5 ${boardingProgress ?? 0}% 100%)` }}>
                  <div className="flex h-[74px] w-[74px] flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-xl font-semibold text-[#334454]">{boardingProgress === null ? "—" : `${boardingProgress}%`}</span>
                    <span className="text-[11px] text-slate-400">boarded</span>
                  </div>
                </div>
                <div className="grid flex-1 grid-cols-3 gap-3 text-center">
                  {[[bookedCount, "Booked"], [boardedCount, "Boarded"], [pendingCount, "Pending"]].map(([value, label]) => (
                    <div key={label}>
                      <p className="text-xl font-semibold text-[#334454]">{value ?? "—"}</p>
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
              <p className="mt-3 text-base font-semibold text-[#334454]">{bus.registrationNumber || bus.busNumber || getTripBusNumber(trip)}</p>
              <p className="mt-1 text-[12px] text-slate-400">{bus.busName || bus.busType || "—"}</p>
              {busDetailsLoading && <p role="status" className="mt-2 text-[11px] text-slate-400">Loading assigned bus details...</p>}
              {busDetailsError && <p role="alert" className="mt-2 text-[11px] text-rose-600">{busDetailsError}</p>}
              <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">
                <div className="flex justify-between gap-3 text-[12px]">
                  <span className="text-slate-400">Capacity</span><span className="font-semibold text-[#46596a]">{bus.capacity ?? bus.totalSeats ?? "—"} seats</span>
                </div>
                <div className="flex justify-between gap-3 text-[12px]">
                  <span className="text-slate-400">Service</span><span className="font-semibold text-[#46596a]">{route.routeCategory || "—"}</span>
                </div>
                <div className="flex justify-between gap-3 text-[12px]">
                  <span className="text-slate-400">Amenities</span><span className="text-right font-semibold text-[#46596a]">{bus.amenities?.length ? bus.amenities.join(", ") : "—"}</span>
                </div>
                <div className="flex justify-between gap-3 text-[12px]">
                  <span className="text-slate-400">Status</span><span className="font-semibold capitalize text-[#46596a]">{bus.status || "—"}</span>
                </div>
                <div className="flex justify-between gap-3 text-[12px]">
                  <span className="text-slate-400">Deck type</span><span className="font-semibold capitalize text-[#46596a]">{bus.deckType || "—"}</span>
                </div>
                <div className="flex justify-between gap-3 text-[12px]">
                  <span className="text-slate-400">Layout</span><span className="font-semibold text-[#46596a]">{bus.layoutType || "—"}</span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_12px_rgba(27,65,75,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-[#334454]">Assigned crew</h2>
                <span className="text-[11px] text-slate-400">{crew.length} members</span>
              </div>
              {crewDetailsLoading && <p role="status" className="mt-2 text-[11px] text-slate-400">Loading assigned crew...</p>}
              {crewDetailsError && <p role="alert" className="mt-2 text-[11px] text-rose-600">{crewDetailsError}</p>}
              <div className="mt-3 space-y-3">
                {crew.map((member) => (
                  <div key={member.name} className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef2f5] text-[10px] font-semibold text-[#617483]">{member.initials}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-semibold text-[#46596a]">{member.name}</p>
                      <p className="text-[11px] text-slate-400">{member.role}{member.vehicleType ? ` · ${member.vehicleType}` : ""}</p>
                      {member.mobile && <p className="text-[11px] text-slate-400">{member.mobile}</p>}
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f8f4] px-2 py-1 text-[10px] font-medium capitalize text-[#168f7e]">
                      <span className="h-1 w-1 rounded-full bg-[#18aa91]" /> {member.status || "Active"}
                    </span>
                  </div>
                ))}
                {!crew.length && <p className="text-[12px] text-slate-400">No crew details available.</p>}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_12px_rgba(27,65,75,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-[#334454]">Status timeline</h2>
                <span className="text-[11px] text-slate-400">{statusHistory.length} updates</span>
              </div>
              {statusHistoryLoading && <p role="status" className="mt-3 text-[12px] text-slate-400">Loading status history...</p>}
              {statusHistoryError && <p role="alert" className="mt-3 text-[12px] text-rose-600">{statusHistoryError}</p>}
              <div className="mt-4 space-y-4">
                {(statusHistory.length ? statusHistory : trip.latestStatusUpdate ? [trip.latestStatusUpdate] : []).map((entry, index) => {
                  const crewName = entry.crewName
                    || [entry.crewId?.firstName, entry.crewId?.lastName].filter(Boolean).join(" ")
                    || entry.updatedBy;
                  const dateAndTime = entry.date
                    ? `${formatTripDateTime(entry.date, { dateStyle: "medium" })}${entry.time ? ` · ${entry.time}` : ""}`
                    : formatTripDateTime(entry.timestamp, { dateStyle: "medium", timeStyle: "short" });

                  return (
                    <div key={entry._id || `${entry.timestamp || entry.status}-${index}`} className="flex gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#138c95] text-white"><BusFront size={11} /></span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[12px] font-semibold text-[#46596a]">{entry.status || "Status update"}</p>
                          <span className="shrink-0 text-[11px] text-slate-400">{dateAndTime}</span>
                        </div>
                        {crewName && <p className="mt-0.5 text-[11px] text-slate-400">{crewName}</p>}
                        <p className="mt-0.5 text-[11px] text-slate-400">{entry.remarks || "No status notes available."}</p>
                        {Array.isArray(entry.attachments) && entry.attachments.map((attachment, attachmentIndex) => {
                          const url = typeof attachment === "string" ? attachment : attachment?.url || attachment?.secure_url;
                          return url ? (
                            <a
                              key={attachment?._id || url || attachmentIndex}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-1 inline-block text-[11px] font-medium text-[#148994] hover:underline"
                            >
                              View attachment
                            </a>
                          ) : null;
                        })}
                      </div>
                    </div>
                  );
                })}
                {!statusHistoryLoading && !statusHistoryError && !statusHistory.length && !trip.latestStatusUpdate && (
                  <p className="text-[12px] text-slate-400">No status history available.</p>
                )}
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
                <p className="mt-1 text-[13px] text-slate-500">{getTripBusNumber(trip)} · {trip._id || trip.tripId || "Trip"}</p>
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
              {statusDetailsLoading ? "Loading current status..." : currentTripStatus}
            </div>
            {statusDetailsError && <p role="alert" className="mt-2 text-[12px] text-rose-600">{statusDetailsError}</p>}
            {lastStatusUpdate && (
              <p className="mt-2 text-[11px] text-slate-400">
                Last updated {formatTripDateTime(lastStatusUpdate.timestamp, { dateStyle: "medium", timeStyle: "short" })}
                {lastStatusUpdate.updatedBy ? ` · ${lastStatusUpdate.updatedBy}` : ""}
                {lastStatusUpdate.remarks ? ` · ${lastStatusUpdate.remarks}` : ""}
              </p>
            )}

            <label htmlFor="trip-new-status" className="mt-4 block text-[12px] font-semibold text-[#334454]">
              New status <span className="text-rose-500">*</span>
            </label>
            <select
              id="trip-new-status"
              value={newTripStatus}
              onChange={(event) => setNewTripStatus(event.target.value)}
              required
              disabled={statusDetailsLoading}
              className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[12px] text-[#46596a] outline-none focus:border-[#138795]"
            >
              <option value="">Select new status</option>
              {supportedStatuses.map((status) => <option key={status}>{status}</option>)}
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
              <div>
                <p className="text-[12px] font-semibold text-[#334454]">Time</p>
                <div className="relative mt-2">
                  <button
                    type="button"
                    aria-label="Choose time"
                    aria-expanded={isTimePickerOpen}
                    onClick={() => setIsTimePickerOpen((isOpen) => !isOpen)}
                    className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-left font-normal text-[#46596a] outline-none transition focus:border-[#138795]"
                  >
                    <span>{hour12}:{minute} {meridiem}</span>
                    <Clock3 size={14} className="text-slate-500" />
                  </button>
                  {isTimePickerOpen && (
                    <div className="absolute left-0 top-full z-20 mt-2 grid w-full grid-cols-3 gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
                      <label className="text-[11px] font-medium text-slate-500">
                        Hour
                        <select
                          value={hour12}
                          onChange={(event) => updateStatusTime(event.target.value, minute, meridiem)}
                          className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-[13px] text-[#46596a]"
                        >
                          {Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0")).map((hour) => (
                            <option key={hour} value={hour}>{hour}</option>
                          ))}
                        </select>
                      </label>
                      <label className="text-[11px] font-medium text-slate-500">
                        Minute
                        <select
                          value={minute}
                          onChange={(event) => updateStatusTime(hour12, event.target.value, meridiem)}
                          className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-[13px] text-[#46596a]"
                        >
                          {Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0")).map((value) => (
                            <option key={value} value={value}>{value}</option>
                          ))}
                        </select>
                      </label>
                      <label className="text-[11px] font-medium text-slate-500">
                        AM/PM
                        <select
                          value={meridiem}
                          onChange={(event) => updateStatusTime(hour12, minute, event.target.value)}
                          className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-[13px] text-[#46596a]"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsTimePickerOpen(false)}
                        className="col-span-3 mt-1 h-8 rounded-md bg-[#07818a] text-[12px] font-semibold text-white"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>
              </div>
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
            {statusSubmitError && <p role="alert" className="mt-3 text-[12px] text-rose-600">{statusSubmitError}</p>}

            <div className="-mx-5 -mb-5 mt-5 flex justify-end gap-2 border-t border-slate-100 bg-[#fbfcfd] px-5 py-4 sm:-mx-6 sm:-mb-6 sm:px-6">
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                disabled={statusSubmitLoading}
                className="h-10 rounded-lg border border-slate-200 bg-white px-5 text-[13px] font-semibold text-[#526271] transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={statusSubmitLoading}
                className="h-10 rounded-lg bg-[#07818a] px-5 text-[13px] font-semibold text-white transition hover:bg-[#066d75]"
              >
                {statusSubmitLoading ? "Updating..." : "Confirm Update"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

function CrewDashboard() {
  const { BASE_URL, TOKEN_KEY } = useAuth();
  const baseUrl = BASE_URL.replace(/\/+$/, "");
  const apiBaseUrl = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showCrew, setShowCrew] = useState(false);
  const [isTripDetailsOpen, setIsTripDetailsOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripDetailsLoadingId, setTripDetailsLoadingId] = useState("");
  const [tripDetailsError, setTripDetailsError] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardError, setDashboardError] = useState("");
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [todayTripsResponse, setTodayTripsResponse] = useState(null);
  const [todayTripsError, setTodayTripsError] = useState("");
  const [todayTripsLoading, setTodayTripsLoading] = useState(true);
  const [upcomingTripsResponse, setUpcomingTripsResponse] = useState(null);
  const [upcomingTripsError, setUpcomingTripsError] = useState("");
  const [upcomingTripsLoading, setUpcomingTripsLoading] = useState(true);
  const [completedTripsResponse, setCompletedTripsResponse] = useState(null);
  const [completedTripsError, setCompletedTripsError] = useState("");
  const [completedTripsLoading, setCompletedTripsLoading] = useState(true);
  const [tripsResponse, setTripsResponse] = useState(null);
  const [tripsError, setTripsError] = useState("");
  const [tripsLoading, setTripsLoading] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    const controller = new AbortController();
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY || "exte_key");
        const response = await fetch(`${apiBaseUrl}/crew/dashboard`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload?.success || !payload.data) {
          throw new Error(payload?.message || "Unable to load crew dashboard data.");
        }

        setDashboardData(payload.data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setDashboardError(error.message || "Unable to load crew dashboard data.");
        }
      } finally {
        if (!controller.signal.aborted) setDashboardLoading(false);
      }
    };

    fetchDashboard();
    return () => controller.abort();
  }, [apiBaseUrl, TOKEN_KEY]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchTodayTrips = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY || "exte_key");
        const response = await fetch(`${apiBaseUrl}/crew/trips/today`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload?.success || !Array.isArray(payload.data)) {
          throw new Error(payload?.message || "Unable to load today's assigned trips.");
        }

        setTodayTripsResponse(payload);
      } catch (error) {
        if (error.name !== "AbortError") {
          setTodayTripsError(error.message || "Unable to load today's assigned trips.");
        }
      } finally {
        if (!controller.signal.aborted) setTodayTripsLoading(false);
      }
    };

    fetchTodayTrips();
    return () => controller.abort();
  }, [apiBaseUrl, TOKEN_KEY]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchUpcomingTrips = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY || "exte_key");
        const response = await fetch(`${apiBaseUrl}/crew/trips/upcoming`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload?.success || !Array.isArray(payload.data)) {
          throw new Error(payload?.message || "Unable to load upcoming trips.");
        }

        setUpcomingTripsResponse(payload);
      } catch (error) {
        if (error.name !== "AbortError") {
          setUpcomingTripsError(error.message || "Unable to load upcoming trips.");
        }
      } finally {
        if (!controller.signal.aborted) setUpcomingTripsLoading(false);
      }
    };

    fetchUpcomingTrips();
    return () => controller.abort();
  }, [apiBaseUrl, TOKEN_KEY]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchCompletedTrips = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY || "exte_key");
        const response = await fetch(`${apiBaseUrl}/crew/trips/completed`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload?.success || !Array.isArray(payload.data)) {
          throw new Error(payload?.message || "Unable to load completed trips.");
        }

        setCompletedTripsResponse(payload);
      } catch (error) {
        if (error.name !== "AbortError") {
          setCompletedTripsError(error.message || "Unable to load completed trips.");
        }
      } finally {
        if (!controller.signal.aborted) setCompletedTripsLoading(false);
      }
    };

    fetchCompletedTrips();
    return () => controller.abort();
  }, [apiBaseUrl, TOKEN_KEY]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      page: String(page),
      limit: String(pageSize),
    });
    if (statusFilter !== "All statuses") params.set("status", statusFilter);
    if (search.trim()) params.set("search", search.trim());

    setTripsResponse(null);
    setTripsLoading(true);
    setTripsError("");

    const timeoutId = setTimeout(async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY || "exte_key");
        const response = await fetch(`${apiBaseUrl}/crew/trips?${params.toString()}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload?.success || !Array.isArray(payload.data) || !payload.pagination) {
          throw new Error(payload?.message || "Unable to load trips.");
        }

        setTripsResponse(payload);
      } catch (error) {
        if (error.name !== "AbortError") {
          setTripsError(error.message || "Unable to load trips.");
        }
      } finally {
        if (!controller.signal.aborted) setTripsLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [apiBaseUrl, TOKEN_KEY, page, pageSize, statusFilter, search]);

  const upcomingTrips = Array.isArray(upcomingTripsResponse?.data) ? upcomingTripsResponse.data : [];
  const todayTrips = Array.isArray(todayTripsResponse?.data) ? todayTripsResponse.data : [];
  const stats = dashboardData?.stats || {};
  const passengerStats = dashboardData?.passengerStats || {};
  const liveDuty = dashboardData?.currentLiveDuty;
  const crewProfile = dashboardData?.crewProfile;
  const liveCrewMembers = liveDuty
    ? [...(liveDuty.drivers || []), ...(liveDuty.crews || [])]
    : [];
  const todayTripsCount = todayTripsResponse?.count ?? (todayTripsResponse ? todayTrips.length : stats.todayTripsCount ?? 0);
  const upcomingTripsCount = upcomingTripsResponse?.count ?? (upcomingTripsResponse ? upcomingTrips.length : stats.upcomingTripsCount ?? 0);
  const completedTripsCount = completedTripsResponse?.count ?? (completedTripsResponse ? completedTripsResponse.data.length : stats.completedTripsCount ?? 0);

  const visibleTrips = Array.isArray(tripsResponse?.data) ? tripsResponse.data : [];
  const pagination = tripsResponse?.pagination || {};
  const pageCount = Math.max(1, pagination.totalPages ?? 1);
  const currentPage = pagination.page ?? page;
  const totalTrips = pagination.totalTrips ?? 0;

  const updateSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const updateStatusFilter = (status) => {
    setStatusFilter(status);
    setPage(1);
    setIsFilterOpen(false);
  };

  const openTripDetails = async (tripId) => {
    setTripDetailsError("");
    setTripDetailsLoadingId(tripId);
    try {
      const token = localStorage.getItem(TOKEN_KEY || "exte_key");
      const response = await fetch(`${apiBaseUrl}/crew/trips/${encodeURIComponent(tripId)}/overview`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.success || !payload.data) {
        throw new Error(payload?.message || "Unable to load trip details.");
      }

      setSelectedTrip(payload.data.trip || payload.data);
      setIsTripDetailsOpen(true);
    } catch (error) {
      setTripDetailsError(error.message || "Unable to load trip details.");
    } finally {
      setTripDetailsLoadingId("");
    }
  };

  if (isTripDetailsOpen) {
    return <CrewTripDetails trip={selectedTrip} onBack={() => setIsTripDetailsOpen(false)} />;
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
          <h1 className="text-3xl font-semibold tracking-tight text-[#27394b]">Dashboard Overview</h1>
          <p className="mt-1 text-[15px] text-[#718286]">Live bus tracking, intercity routes, and passenger booking engine</p>
          {dashboardLoading && <p role="status" className="mt-2 text-[13px] text-slate-400">Loading crew dashboard...</p>}
          {dashboardError && <p role="alert" className="mt-2 text-[13px] text-rose-600">{dashboardError}</p>}
          {completedTripsError && <p role="alert" className="mt-2 text-[13px] text-rose-600">{completedTripsError}</p>}

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <OverviewCard icon={MapIcon} value={todayTripsCount} label="Today’s trips" caption={`${stats.totalAssignedTripsCount ?? 0} assigned trips`} />
            <OverviewCard icon={CalendarDays} value={upcomingTripsCount} label="Upcoming trips" caption={upcomingTrips[0] ? `Next ${formatTripDateTime(upcomingTrips[0].departureDateTime, { day: "2-digit", month: "short" })}` : upcomingTripsLoading ? "Loading trips..." : "No upcoming trips"} />
            <OverviewCard icon={BusFront} value={stats.ongoingTripsCount ?? 0} label="Ongoing trip" caption={liveDuty?.currentStatus || (liveDuty ? "In progress" : "No live duty")} />
            <OverviewCard icon={Check} value={completedTripsCount} label="Completed trips" caption={completedTripsLoading ? "Loading trips..." : "This month"} />
          </div>
        </section>

        <section className="mt-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_12px_rgba(27,65,75,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[16px] font-semibold text-[#334454]">Today&apos;s assigned trips</h2>
            <span className="text-[12px] text-slate-400">{todayTripsCount} trips</span>
          </div>
          {todayTripsLoading && <p role="status" className="mt-3 text-[13px] text-slate-400">Loading today&apos;s trips...</p>}
          {todayTripsError && <p role="alert" className="mt-3 text-[13px] text-rose-600">{todayTripsError}</p>}
          {!todayTripsLoading && !todayTripsError && todayTrips.length === 0 && (
            <p className="mt-3 rounded-xl border border-slate-100 bg-[#fbfdfd] px-3 py-5 text-center text-[13px] text-slate-400">No trips assigned for today.</p>
          )}
          {todayTrips.length > 0 && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {todayTrips.map((trip) => (
                <article key={trip._id} className="rounded-xl border border-slate-100 bg-[#fbfdfd] px-3 py-3">
                  <p className="truncate text-[13px] font-semibold text-[#3e4e5d]">{getTripRoute(trip)}</p>
                  <p className="mt-1 text-[12px] text-slate-400">
                    {formatTripDateTime(trip.departureDateTime, { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2 text-[12px]">
                    <span className="truncate text-[#526271]">{getTripBusNumber(trip)}</span>
                    <span className="shrink-0 rounded-full bg-[#e9f8f7] px-2 py-1 text-[#138e91]">{trip.currentStatus || trip.status || "Assigned"}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[1.55fr_1fr]">
          <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_12px_rgba(27,65,75,0.04)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[13px] font-semibold uppercase tracking-wide text-[#fa6b77]">Live duty</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1f1ff] px-2.5 py-1 text-[13px] font-medium text-[#7373d9]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8585f1]" />
                {liveDuty?.currentStatus || (liveDuty ? "In progress" : "No live duty")}
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#293b4e] sm:text-3xl">{liveDuty ? getTripRoute(liveDuty) : "No ongoing trip"}</h2>
            <p className="mt-0.5 text-[13px] text-slate-400">{crewProfile?.fullName || "Crew"} · {liveDuty?._id || crewProfile?.employeeCode || "No active duty"}</p>

            <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div>
                <p className="text-[13px] font-semibold text-[#15949c]">{(liveDuty?.origin || liveDuty?.route?.originCity || "—").slice(0, 3).toUpperCase()}</p>
                <p className="mt-1 text-lg font-semibold">{liveDuty?.origin || liveDuty?.route?.originCity || "—"}</p>
                <p className="mt-0.5 text-[13px] text-slate-400">{formatTripDateTime(liveDuty?.departureDateTime, { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              <div className="w-full min-w-[72px] sm:min-w-[130px]">
                <p className="mb-1 text-center text-[12px] text-slate-400">{liveDuty?.route?.estimatedDurationMinutes ? `${Math.floor(liveDuty.route.estimatedDurationMinutes / 60)}h ${liveDuty.route.estimatedDurationMinutes % 60}m` : "—"}</p>
                <div className="relative h-px bg-[#dce7eb]">
                  <span className="absolute left-1/2 top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#e1edef] bg-white text-[#198a97]">
                    <BusFront size={11} />
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-semibold text-[#fb735f]">{(liveDuty?.destination || liveDuty?.route?.destinationCity || "—").slice(0, 3).toUpperCase()}</p>
                <p className="mt-1 text-lg font-semibold">{liveDuty?.destination || liveDuty?.route?.destinationCity || "—"}</p>
                <p className="mt-0.5 text-[13px] text-slate-400">{formatTripDateTime(liveDuty?.arrivalDateTime, { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-[#fbfcfd] px-2.5 py-2">
                <BusFront size={14} className="shrink-0 text-[#15949c]" />
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Bus registration</p>
                  <p className="mt-0.5 truncate text-[13px] font-semibold">{liveDuty ? getTripBusNumber(liveDuty) : "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-[#fbfcfd] px-2.5 py-2">
                <Clock3 size={14} className="shrink-0 text-[#15949c]" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Departure time</p>
                  <p className="mt-0.5 text-[13px] font-semibold">{formatTripDateTime(liveDuty?.departureDateTime, { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-[#fbfcfd] px-2.5 py-2">
                <UsersRound size={14} className="shrink-0 text-[#15949c]" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Passengers</p>
                  <p className="mt-0.5 text-[13px] font-semibold">{passengerStats.totalBooked ?? 0} booked</p>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {liveCrewMembers.slice(0, 3).map((member) => (
                    <span key={member._id || member.email || member.fullName} className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#e8eef2] text-[10px] font-semibold text-[#556979]">
                      {(member.fullName || "?").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  ))}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#435465]">{liveCrewMembers.length ? liveCrewMembers.map((member) => member.fullName).join(", ") : "No crew assigned"}</p>
                  <p className="text-[12px] text-slate-400">{liveCrewMembers.map((member) => member.crewRole || (member.mobile ? "Driver" : "")).filter(Boolean).join(" · ") || crewProfile?.crewRole || "—"}</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowCrew((isOpen) => !isOpen)} className="text-[13px] font-medium text-[#148994] hover:text-[#0b6570]">
                {showCrew ? "Hide crew" : "View crew"}
              </button>
            </div>
            {showCrew && (
              <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-[#f4f9fa] p-3 text-[13px]">
                {liveCrewMembers.length ? liveCrewMembers.map((member) => (
                  <div key={member._id || member.email || member.fullName}>
                    <p className="font-semibold">{member.fullName}</p>
                    <p className="mt-0.5 text-slate-400">{member.crewRole || "Crew"}</p>
                  </div>
                )) : <p className="col-span-3 text-slate-400">No crew assigned to an active trip.</p>}
              </div>
            )}
          </article>

          <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_12px_rgba(27,65,75,0.04)]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[16px] font-semibold text-[#334454]">Next upcoming trip</h2>
                <p className="mt-0.5 text-[13px] text-slate-400">{upcomingTrips[0] ? formatTripDateTime(upcomingTrips[0].departureDateTime, { weekday: "long", day: "numeric", month: "long" }) : "No upcoming trips"}</p>
              </div>
              <Link to="/vendor/trip-management" className="text-[13px] font-medium text-[#148994] hover:underline">View all</Link>
            </div>
            <div className="mt-2 space-y-2">
              {upcomingTripsLoading && <p role="status" className="py-4 text-center text-[13px] text-slate-400">Loading upcoming trips...</p>}
              {upcomingTripsError && <p role="alert" className="py-4 text-center text-[13px] text-rose-600">{upcomingTripsError}</p>}
              {upcomingTrips.map((trip) => (
                <div key={trip._id} className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-[#fbfdfd] px-2.5 py-2">
                  <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg bg-[#e8f7f6] text-[#138e91]">
                    <span className="text-[15px] font-semibold leading-none">{formatTripDateTime(trip.departureDateTime, { day: "2-digit" })}</span>
                    <span className="mt-0.5 text-[11px] font-semibold">{formatTripDateTime(trip.departureDateTime, { month: "short" }).toUpperCase()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-[#3e4e5d]">{getTripRoute(trip)}</p>
                    <p className="mt-0.5 truncate text-[12px] text-slate-400">{getTripBusNumber(trip)} · {formatTripDateTime(trip.departureDateTime, { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#e9f8f7] px-2 py-1 text-[12px] font-medium text-[#138e91]">{trip.currentStatus || "Upcoming"}</span>
                </div>
              ))}
              {!upcomingTripsLoading && !upcomingTripsError && !upcomingTrips.length && <p className="rounded-xl border border-slate-100 px-3 py-5 text-center text-[13px] text-slate-400">No upcoming trips assigned.</p>}
            </div>
          </article>
        </section>

        <section className="mt-3 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_3px_12px_rgba(27,65,75,0.04)]">
          <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 className="text-[17px] font-semibold text-[#334454]">Recent Trips</h2>
              <p className="mt-0.5 text-[13px] text-slate-400">Recent trips assigned across your routes</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex h-8 min-w-[160px] flex-1 items-center gap-1.5 rounded-full border border-slate-100 bg-[#fbfcfd] px-2.5 sm:flex-none">
                <Search size={12} className="shrink-0 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={updateSearch}
                  placeholder="Search trip, route, bus..."
                  aria-label="Search trips"
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
                    {["All statuses", "scheduled", "in_progress", "completed", "cancelled"].map((status) => (
                      <button key={status} type="button" onClick={() => updateStatusFilter(status)} className={`block w-full rounded-lg px-2.5 py-2 text-left text-[14px] capitalize hover:bg-[#f1f7f7] ${statusFilter === status ? "font-semibold text-[#138795]" : "text-slate-600"}`}>
                        {status === "All statuses" ? status : status.replaceAll("_", " ")}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button type="button" onClick={() => exportTripsToCsv(visibleTrips)} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#138795] px-2.5 text-[13px] font-medium text-white transition hover:bg-[#0d6d77]">
                <ArrowDownToLine size={12} />
                Export CSV
              </button>
              <Link to="/vendor/bookings" className="hidden items-center gap-1 text-[13px] font-medium text-[#148994] sm:inline-flex">
                View All <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {tripDetailsError && (
            <div role="alert" aria-live="assertive" className="mx-4 mb-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700 sm:mx-5">
              <p className="font-semibold">Unable to open trip</p>
              <p className="mt-1">{tripDetailsError}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left">
              <thead>
                <tr className="bg-[#f7fafb] text-[12px] font-medium uppercase tracking-wide text-[#87979d]">
                  <th className="px-4 py-2.5 font-medium sm:px-5">Trip ID</th>
                  <th className="px-3 py-2.5 font-medium">Route</th>
                  <th className="px-3 py-2.5 font-medium">Departure</th>
                  <th className="px-3 py-2.5 font-medium">Bus</th>
                  <th className="px-3 py-2.5 font-medium">Crew</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 text-center font-medium sm:px-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tripsLoading && (
                  <tr><td colSpan="7" role="status" className="px-4 py-8 text-center text-[14px] text-slate-400">Loading trips...</td></tr>
                )}
                {tripsError && (
                  <tr><td colSpan="7" role="alert" className="px-4 py-8 text-center text-[14px] text-rose-600">{tripsError}</td></tr>
                )}
                {visibleTrips.map((trip) => (
                  <tr key={trip._id} className="text-[13px] text-[#566978] transition-colors hover:bg-[#fbfdfd]">
                    <td className="whitespace-nowrap px-4 py-2.5 font-semibold text-[#138795] sm:px-5">{trip._id?.slice(-8).toUpperCase() || "—"}</td>
                    <td className="whitespace-nowrap px-3 py-2.5">{getTripRoute(trip)}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-slate-400">{formatTripDateTime(trip.departureDateTime, { dateStyle: "medium", timeStyle: "short" })}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-[#46596a]">{getTripBusNumber(trip)}</td>
                    <td className="whitespace-nowrap px-3 py-2.5">{(trip.crews || []).map((member) => member.fullName).filter(Boolean).join(", ") || "—"}</td>
                    <td className="whitespace-nowrap px-3 py-2.5">
                      <span className={`rounded-full px-2 py-1 text-[12px] font-medium ${statusClassNames[(trip.status || "").toLowerCase()] || "bg-[#f0f3f4] text-[#65777e]"}`}>
                        {trip.currentStatus || trip.status || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center sm:px-5">
                      <button type="button" onClick={() => openTripDetails(trip._id)} disabled={tripDetailsLoadingId === trip._id} aria-label={`View trip details for ${trip._id}`} className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f0f4f6] text-[#718391] transition hover:bg-[#e2f1f2] hover:text-[#138795] disabled:cursor-wait disabled:opacity-50">
                        <Eye size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
                {!tripsLoading && !tripsError && visibleTrips.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-[14px] text-slate-400">No trips match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className="flex flex-col gap-3 px-4 py-3 text-[13px] text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p>
              Showing {totalTrips ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, totalTrips)} of {totalTrips} trips
            </p>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1 || tripsLoading} className="inline-flex h-7 items-center gap-1 rounded-full border border-slate-100 px-2 text-[13px] disabled:cursor-not-allowed disabled:opacity-40">
                <ChevronLeft size={12} /> Previous
              </button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} className={`h-7 min-w-7 rounded-full border px-2 text-[13px] ${pageNumber === currentPage ? "border-[#138795] bg-[#138795] font-semibold text-white" : "border-slate-100 text-[#60717d] hover:bg-slate-50"}`}>
                  {pageNumber}
                </button>
              ))}
              <button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={currentPage === pageCount || tripsLoading} className="inline-flex h-7 items-center gap-1 rounded-full border border-slate-100 px-2 text-[13px] disabled:cursor-not-allowed disabled:opacity-40">
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
