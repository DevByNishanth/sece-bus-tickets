import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  AlertTriangle,
  BusFront,
  Check,
  CheckCircle2,
  Clock,
  Clock3,
  FileCheck2,
  FileText,
  Image as ImageIcon,
  Maximize2,
  Percent,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  User,
  X,
  Zap,
} from "lucide-react";
import { toast } from "react-toastify";
import AdminNavbar from "../components/AdminNavbar.jsx";
import { useAuth } from "../context/AuthContext";

const statusStyles = {
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
  suspended: "border-slate-300 bg-slate-100 text-slate-700",
};

const busApprovalChecklist = [
  "Registration Certificate (RC) verified with transport authority",
  "National / State Permit validity checked and active",
  "Insurance policy document and coverage period verified",
  "Fitness Certificate (FC) and validity verified",
  "Pollution Under Control (PUC) certificate checked",
  "Deck layout and seating capacity verified",
];

// Exact seat shape matching the uploaded screenshot with top headrest, seat number, fare and bottom cushion
function BusSeatItem({ seatNumber, type, fare, isSleeper = false }) {
  if (isSleeper) {
    return (
      <div
        className="group relative flex h-24 w-12 flex-col justify-between rounded-xl border-2 border-[#169aa8] bg-white p-1.5 shadow-xs transition hover:border-[#0e7c88]"
        title={`${seatNumber} • ${type || "Upper Sleeper"} • ₹${fare || ""}`}
      >
        {/* Pillow area */}
        <div className="h-4 w-full rounded-md border border-[#8ce1e8] bg-[#d7f7f9]" />

        {/* Berth number & fare */}
        <div className="my-auto text-center leading-tight">
          <span className="font-bold text-[11px] text-[#087f95]">
            {seatNumber}
          </span>
          {fare && (
            <span className="block text-[9px] font-semibold text-[#668899] mt-0.5">
              ₹{fare}
            </span>
          )}
        </div>

        {/* Bottom cushion in exact match color */}
        <div className="h-2 w-full rounded-b-md bg-[#b8f1f5]" />
      </div>
    );
  }

  return (
    <div
      className="group relative flex h-16 w-12 flex-col justify-between rounded-xl border-2 border-[#169aa8] bg-white p-1 shadow-xs transition hover:border-[#0e7c88]"
      title={`${seatNumber} • ${type || "Luxury Pushback"} • ₹${fare || ""}`}
    >
      {/* Top curved headrest matching screenshot */}
      <div className="h-3 w-full rounded-t-lg border border-[#8ce1e8] bg-[#d7f7f9]" />

      {/* Seat number & price */}
      <div className="my-auto text-center leading-tight">
        <span className="font-bold text-[11px] text-[#087f95]">
          {seatNumber}
        </span>
        {fare && (
          <span className="block text-[9.5px] font-semibold text-[#668899] mt-0.5">
            ₹{fare}
          </span>
        )}
      </div>

      {/* Bottom cushion in matching turquoise tint */}
      <div className="h-2.5 w-full rounded-b-lg bg-[#b8f1f5]" />
    </div>
  );
}

// Steering wheel SVG
const SteeringWheel = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 text-slate-400"
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v6" />
    <path d="M12 15v6" />
    <path d="M3.5 14l5.5-2" />
    <path d="M20.5 14l-5.5-2" />
  </svg>
);

export default function AdminBusDetailScreen({
  busId,
  onBack,
  onStatusChange,
  Navbar = AdminNavbar,
}) {
  const { BASE_URL, TOKEN_KEY } = useAuth();
  const tokenKeyName = TOKEN_KEY || "exte_key";

  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Review Modals
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Form states
  const [commission, setCommission] = useState(10);
  const [remarks, setRemarks] = useState(
    "Registration certificate, insurance, fitness, and permit verified successfully."
  );
  const [rejectionRemarks, setRejectionRemarks] = useState(
    "Fitness certificate scan is illegible. Please re-upload a clear copy."
  );

  // Approval checklist states
  const [checkedApprovalItems, setCheckedApprovalItems] = useState([]);

  const toggleApprovalItem = (index) => {
    setCheckedApprovalItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const allApprovalChecked =
    checkedApprovalItems.length === busApprovalChecklist.length;

  const fetchBusDetail = useCallback(async () => {
    if (!busId) return;
    setLoading(true);
    setError(null);
    const token = localStorage.getItem(tokenKeyName);

    try {
      const res = await fetch(`${BASE_URL}/admin/buses/${busId}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        const data = await res.json();
        setBus(data.bus || data);
      } else {
        setError(`Failed to fetch bus details (Status ${res.status})`);
      }
    } catch (err) {
      setError(err.message || "Failed to load bus details.");
    } finally {
      setLoading(false);
    }
  }, [BASE_URL, busId, tokenKeyName]);

  useEffect(() => {
    fetchBusDetail();
  }, [fetchBusDetail]);

  const handleReviewBus = async (actionType) => {
    setActionLoading(true);
    const token = localStorage.getItem(tokenKeyName);

    const payload = {
      action: actionType,
      remarks: actionType === "approve" ? remarks.trim() : rejectionRemarks.trim(),
    };

    if (actionType === "approve") {
      payload.commission = Number(commission);
    }

    try {
      const res = await fetch(`${BASE_URL}/admin/buses/${busId}/review`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success(data.message || `Bus has been successfully ${actionType}d!`);
        setBus(data.bus || { ...bus, status: actionType === "approve" ? "approved" : "rejected" });
        setApproveModalOpen(false);
        setRejectModalOpen(false);
        setCheckedApprovalItems([]);
        onStatusChange?.(actionType);
      } else {
        toast.error(data.message || "Failed to submit bus review");
      }
    } catch (err) {
      toast.error(err.message || "Network error while submitting review");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f8f9] text-[#172526]">
        <Navbar />
        <div className="flex h-96 flex-col items-center justify-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-[#078A97]" />
          <p className="text-sm font-medium text-slate-500">
            Loading bus specification &amp; compliance records...
          </p>
        </div>
      </div>
    );
  }

  if (error || !bus) {
    return (
      <div className="min-h-screen bg-[#f5f8f9] text-[#172526]">
        <Navbar />
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <div className="inline-flex rounded-2xl bg-rose-50 p-3 text-rose-600">
            <AlertTriangle size={28} />
          </div>
          <h2 className="mt-3 text-lg font-bold text-slate-800">
            {error || "Bus not found"}
          </h2>
          <button
            type="button"
            onClick={onBack}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#078A97] px-4 py-2 text-xs font-semibold text-white shadow-sm"
          >
            <ArrowLeft size={14} /> Back to Bus List
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = (bus.status || "pending").toLowerCase();
  const exteriorPhotos = Array.isArray(bus.exteriorPhotos) ? bus.exteriorPhotos : [];
  const interiorPhotos = Array.isArray(bus.interiorPhotos) ? bus.interiorPhotos : [];

  return (
    <div className="min-h-screen bg-[#f5f8f9] text-[#172526] pb-16">
      <Navbar />

      <main className="mx-auto w-full max-w-[1600px] px-4 pt-4 sm:px-6 lg:px-8">
        {/* Navigation & Action Bar on top */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-[#dce7e9] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={15} /> Back to Bus List
          </button>

          {/* Action buttons kept at top */}
          <div className="flex flex-wrap items-center gap-2">
            {currentStatus !== "approved" && (
              <button
                type="button"
                onClick={() => {
                  setCheckedApprovalItems([]);
                  setApproveModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#078A97] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#06747f] cursor-pointer"
              >
                <Check size={14} /> Approve Bus
              </button>
            )}

            {currentStatus !== "rejected" && (
              <button
                type="button"
                onClick={() => setRejectModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-white px-3.5 py-2 text-xs font-bold text-rose-600 shadow-sm transition hover:bg-rose-50 cursor-pointer"
              >
                <X size={14} /> Reject Bus
              </button>
            )}
          </div>
        </div>

        {/* Hero Card without MongoDB ID */}
        <section className="mb-5 overflow-hidden rounded-2xl border border-[#dbe6e9] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 border border-teal-100">
                <BusFront size={28} />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    {bus.busName}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                      statusStyles[currentStatus] || statusStyles.pending
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        currentStatus === "approved"
                          ? "bg-emerald-500"
                          : currentStatus === "pending"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                    />
                    {bus.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Operator: <strong className="text-slate-700">{bus.operatorName || "N/A"}</strong> · Reg No:{" "}
                  <strong className="font-mono text-slate-800">{bus.registrationNumber}</strong> · Type:{" "}
                  <strong className="capitalize text-slate-700">{bus.busType?.replace("_", " ")}</strong> (
                  {bus.deckConfiguration || "Single"} Deck)
                </p>
              </div>
            </div>

            <div className="flex flex-col text-left sm:text-right text-xs text-slate-500 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
              {bus.submittedAt && (
                <span className="text-[11px] font-medium text-slate-500">
                  Submitted on{" "}
                  <strong className="text-slate-700 font-semibold">
                    {new Date(bus.submittedAt).toLocaleDateString()}
                  </strong>
                </span>
              )}
              {bus.rating && (
                <span className="mt-0.5 text-[11px] text-amber-600 font-semibold">
                  ★ {bus.rating} ({bus.totalRatings || 0} reviews)
                </span>
              )}
            </div>
          </div>
        </section>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Left Column (2 spans): Vehicle Specs, Photos, Seating Layout */}
          <div className="space-y-5 lg:col-span-2">
            {/* Full Vehicle Specifications */}
            <div className="rounded-2xl border border-[#dbe6e9] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <BusFront size={16} className="text-[#078A97]" />
                <h2 className="text-sm font-bold text-slate-800">
                  All Vehicle Specifications &amp; Identifiers
                </h2>
              </div>

              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Registration No
                  </dt>
                  <dd className="mt-1 font-mono font-bold text-slate-800">
                    {bus.registrationNumber || "N/A"}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Internal Fleet Code
                  </dt>
                  <dd className="mt-1 font-mono font-medium text-slate-700">
                    {bus.internalFleetCode || "N/A"}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Manufacturer
                  </dt>
                  <dd className="mt-1 font-medium text-slate-800">
                    {bus.manufacturer || "N/A"}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Model
                  </dt>
                  <dd className="mt-1 font-medium text-slate-800">
                    {bus.model || "N/A"}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Manufacturing Year
                  </dt>
                  <dd className="mt-1 font-medium text-slate-800">
                    {bus.manufacturingYear || "N/A"}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Ownership Type
                  </dt>
                  <dd className="mt-1 font-medium capitalize text-slate-800">
                    {bus.ownershipType || "Owned"}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Chassis Number
                  </dt>
                  <dd className="mt-1 font-mono text-slate-700">
                    {bus.chassisNumber || "Not Specified"}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Engine Number
                  </dt>
                  <dd className="mt-1 font-mono text-slate-700">
                    {bus.engineNumber || "Not Specified"}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Depot / Base Location
                  </dt>
                  <dd className="mt-1 text-slate-700">
                    {bus.depo || "Primary Depot"}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Bus Type &amp; Category
                  </dt>
                  <dd className="mt-1 font-medium capitalize text-slate-800">
                    {bus.busType?.replace("_", " ") || "Standard"} ({bus.category || "AC"})
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Deck Configuration
                  </dt>
                  <dd className="mt-1 font-medium capitalize text-slate-800">
                    {bus.deckConfiguration || "Single"} Deck
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Total Passenger Capacity
                  </dt>
                  <dd className="mt-1 font-bold text-[#078A97]">
                    {bus.passengerCapacity || bus.totalSeats || 0} Total
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Seats &amp; Berths
                  </dt>
                  <dd className="mt-1 text-slate-700">
                    {bus.seatCount || 0} Pushback Seats · {bus.berthCount || 0} Sleeper Berths
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Base Fare
                  </dt>
                  <dd className="mt-1 font-bold text-slate-900">
                    {bus.baseFare ? `₹${bus.baseFare}` : "Not Set"}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Odometer / Last Service
                  </dt>
                  <dd className="mt-1 text-slate-700">
                    {bus.odometer ? `${bus.odometer} km` : "0 km"}
                    {bus.lastServiceDate &&
                      ` · Serviced ${new Date(bus.lastServiceDate).toLocaleDateString()}`}
                  </dd>
                </div>
              </dl>

              {/* Amenities */}
              {Array.isArray(bus.amenities) && bus.amenities.length > 0 && (
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Onboard Amenities
                  </dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {bus.amenities.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-[10.5px] font-semibold text-slate-700 capitalize"
                      >
                        {item.replace(/([A-Z])/g, " $1")}
                      </span>
                    ))}
                  </dd>
                </div>
              )}

              {bus.description && (
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Vehicle Description
                  </dt>
                  <dd className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {bus.description}
                  </dd>
                </div>
              )}
            </div>

            {/* Vehicle Photos Gallery (Exterior & Interior) */}
            <div className="rounded-2xl border border-[#dbe6e9] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <ImageIcon size={16} className="text-[#078A97]" />
                <h2 className="text-sm font-bold text-slate-800">
                  Vehicle Gallery (Exterior &amp; Interior Photos)
                </h2>
              </div>

              {/* Exterior Photos */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Exterior Photos
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {exteriorPhotos.length} Photos
                  </span>
                </div>

                {exteriorPhotos.length > 0 ? (
                  <div className="mt-2.5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {exteriorPhotos.map((photo, i) => (
                      <div
                        key={i}
                        onClick={() => setPhotoPreview(photo.url)}
                        className="group relative aspect-4/3 cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-100 transition hover:shadow-md"
                      >
                        <img
                          src={photo.url}
                          alt={`Exterior ${i + 1}`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                          <Maximize2 size={16} className="text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 flex h-24 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400">
                    No exterior photos uploaded
                  </div>
                )}
              </div>

              {/* Interior Photos */}
              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Interior &amp; Seating Photos
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {interiorPhotos.length} Photos
                  </span>
                </div>

                {interiorPhotos.length > 0 ? (
                  <div className="mt-2.5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {interiorPhotos.map((photo, i) => (
                      <div
                        key={i}
                        onClick={() => setPhotoPreview(photo.url)}
                        className="group relative aspect-4/3 cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-100 transition hover:shadow-md"
                      >
                        <img
                          src={photo.url}
                          alt={`Interior ${i + 1}`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                          <Maximize2 size={16} className="text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 flex h-24 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400">
                    No interior photos uploaded
                  </div>
                )}
              </div>
            </div>

            {/* Realistic Bus Cabin Layout with Soft Gray Background */}
            {bus.seatLayout && (
              <div className="rounded-2xl border border-[#dbe6e9] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-[#078A97]" />
                    <h2 className="text-sm font-bold text-slate-800">
                      Real Bus Cabin &amp; Seat Layout
                    </h2>
                  </div>
                  <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-[#078A97]">
                    {bus.seatLayout.totalPassengerCapacity || bus.passengerCapacity || 32} Total Berths &amp; Seats
                  </span>
                </div>

                {/* Legend */}
                <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3.5 w-3.5 rounded border border-[#169aa8] bg-[#d7f7f9]" />
                    <span>Seater Pushback</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-4 w-3 rounded border border-[#169aa8] bg-[#d7f7f9]" />
                    <span>Sleeper Berth</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-slate-400" />
                    <span>Driver Cabin / Front</span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-6 xl:grid-cols-2">
                  {/* Lower Deck Coach Container - in Elegant Soft Gray (#f1f5f9 / #e2e8f0) */}
                  {bus.seatLayout.lowerDeck && (
                    <div className="rounded-3xl border-2 border-slate-300 bg-[#f1f5f9] p-4 shadow-inner">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-xs font-bold text-slate-800">
                          {bus.seatLayout.lowerDeck.deckName || "Lower Deck (Seater)"}
                        </span>
                        <span className="font-mono text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                          {bus.seatLayout.lowerDeck.passengerCapacity || 16} Seats
                        </span>
                      </div>

                      {/* Driver Front Cabin */}
                      <div className="mt-3 flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200/90 shadow-2xs">
                        <div className="flex items-center gap-2">
                          <SteeringWheel />
                          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                            Driver Cabin
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400">
                          Front Door
                        </span>
                      </div>

                      {/* Seats Grid */}
                      <div className="mt-4 space-y-3">
                        {bus.seatLayout.lowerDeck.rows?.map((row) => (
                          <div
                            key={row.rowNumber}
                            className="flex items-center justify-between rounded-xl bg-white/95 p-2.5 border border-slate-200 shadow-2xs"
                          >
                            <span className="w-6 font-mono text-[10px] font-bold text-slate-400">
                              {row.rowLabel || `R${row.rowNumber}`}
                            </span>

                            {/* Left Side (2 seats) */}
                            <div className="flex items-center gap-2">
                              {row.seats?.slice(0, 2).map((seat) => (
                                <BusSeatItem
                                  key={seat.seatNumber}
                                  seatNumber={seat.seatNumber}
                                  type={seat.type}
                                  fare={seat.fare}
                                  isSleeper={false}
                                />
                              ))}
                            </div>

                            {/* Gangway / Aisle */}
                            <div className="flex flex-col items-center justify-center px-1">
                              <span className="text-[8px] font-bold tracking-widest text-slate-300 uppercase rotate-90">
                                AISLE
                              </span>
                            </div>

                            {/* Right Side (2 seats) */}
                            <div className="flex items-center gap-2">
                              {row.seats?.slice(2).map((seat) => (
                                <BusSeatItem
                                  key={seat.seatNumber}
                                  seatNumber={seat.seatNumber}
                                  type={seat.type}
                                  fare={seat.fare}
                                  isSleeper={false}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upper Deck Coach Container - in Matching Elegant Soft Gray (#f1f5f9 / #e2e8f0) */}
                  {bus.seatLayout.upperDeck && (
                    <div className="rounded-3xl border-2 border-slate-300 bg-[#f1f5f9] p-4 shadow-inner">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-xs font-bold text-slate-800">
                          {bus.seatLayout.upperDeck.deckName || "Upper Deck (Sleeper)"}
                        </span>
                        <span className="font-mono text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                          {bus.seatLayout.upperDeck.passengerCapacity || 16} Berths
                        </span>
                      </div>

                      {/* Upper Deck Windshield Header */}
                      <div className="mt-3 flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200/90 shadow-2xs">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-teal-500" />
                          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                            Upper Deck Windshield
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-teal-700">
                          Panoramic View
                        </span>
                      </div>

                      {/* Berths Grid */}
                      <div className="mt-4 space-y-3">
                        {bus.seatLayout.upperDeck.rows?.map((row) => (
                          <div
                            key={row.rowNumber}
                            className="flex items-center justify-between rounded-xl bg-white/95 p-2.5 border border-slate-200 shadow-2xs"
                          >
                            <span className="w-6 font-mono text-[10px] font-bold text-slate-400">
                              {row.rowLabel || `R${row.rowNumber}`}
                            </span>

                            {/* Left Side (2 berths) */}
                            <div className="flex items-center gap-2">
                              {row.berths?.slice(0, 2).map((berth) => (
                                <BusSeatItem
                                  key={berth.seatNumber}
                                  seatNumber={berth.seatNumber}
                                  type={berth.type}
                                  fare={berth.fare}
                                  isSleeper={true}
                                />
                              ))}
                            </div>

                            {/* Gangway / Aisle */}
                            <div className="flex flex-col items-center justify-center px-1">
                              <span className="text-[8px] font-bold tracking-widest text-slate-300 uppercase rotate-90">
                                AISLE
                              </span>
                            </div>

                            {/* Right Side (2 berths) */}
                            <div className="flex items-center gap-2">
                              {row.berths?.slice(2).map((berth) => (
                                <BusSeatItem
                                  key={berth.seatNumber}
                                  seatNumber={berth.seatNumber}
                                  type={berth.type}
                                  fare={berth.fare}
                                  isSleeper={true}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (1 span): Compliance Documents & Review History */}
          <div className="space-y-5">
            {/* Travel Agent Info */}
            {bus.agentId && (
              <div className="rounded-2xl border border-[#dbe6e9] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <User size={16} className="text-[#078A97]" />
                  <h2 className="text-sm font-bold text-slate-800">
                    Operator Contact
                  </h2>
                </div>

                <dl className="mt-4 space-y-3 text-xs">
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Contact Name
                    </dt>
                    <dd className="mt-0.5 font-semibold text-slate-800">
                      {bus.agentId.firstName} {bus.agentId.lastName}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Email
                    </dt>
                    <dd className="mt-0.5 text-slate-700">{bus.agentId.email}</dd>
                  </div>

                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Phone
                    </dt>
                    <dd className="mt-0.5 text-slate-700">{bus.agentId.phone}</dd>
                  </div>
                </dl>
              </div>
            )}

            {/* Compliance Documents */}
            <div className="rounded-2xl border border-[#dbe6e9] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileCheck2 size={16} className="text-[#078A97]" />
                <h2 className="text-sm font-bold text-slate-800">
                  Compliance Documents
                </h2>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  {
                    title: "Registration Certificate (RC)",
                    doc: bus.rcDoc,
                    number: bus.rcDoc?.documentNumber,
                  },
                  {
                    title: "Permit Document",
                    doc: bus.permit,
                    number: bus.permit?.permitNumber,
                  },
                  {
                    title: "Insurance Policy",
                    doc: bus.insurance,
                    number: bus.insurance?.policyNumber,
                  },
                  {
                    title: "Fitness Certificate",
                    doc: bus.fitness,
                    number: bus.fitness?.certificateNumber,
                  },
                  {
                    title: "PUC Certificate",
                    doc: bus.puc,
                    number: bus.puc?.certificateNumber,
                  },
                ].map(({ title, doc, number }) => (
                  <div
                    key={title}
                    className="rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-[#078A97]">
                        <FileText size={15} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800">{title}</p>
                        {number && (
                          <p className="font-mono text-[10.5px] text-slate-600 mt-0.5">
                            Doc No: {number}
                          </p>
                        )}
                        {doc?.expiryDate && (
                          <p className="text-[10px] text-slate-400">
                            Valid till: {new Date(doc.expiryDate).toLocaleDateString()}
                          </p>
                        )}
                        {doc?.url ? (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1.5 inline-block text-[11px] font-semibold text-[#078A97] hover:underline"
                          >
                            View Document ↗
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-400 block mt-1">
                            No file preview available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Status & Audit */}
            <div className="rounded-2xl border border-[#dbe6e9] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShieldCheck size={16} className="text-[#078A97]" />
                <h2 className="text-sm font-bold text-slate-800">
                  Audit &amp; Review History
                </h2>
              </div>

              <div className="mt-4 space-y-2.5 text-xs text-slate-600">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                    Current Status
                  </span>
                  <span className="font-bold text-slate-800 uppercase mt-0.5 block">
                    {bus.status}
                  </span>
                </div>

                {bus.commission !== null && bus.commission !== undefined && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                      Admin Commission
                    </span>
                    <span className="font-bold text-emerald-700">
                      {bus.commission}%
                    </span>
                  </div>
                )}

                {bus.adminRemarks && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                      Admin Remarks
                    </span>
                    <p className="mt-1 rounded-lg bg-slate-50 p-2 text-[11px] text-slate-700 italic border border-slate-100">
                      "{bus.adminRemarks}"
                    </p>
                  </div>
                )}

                {bus.reviewHistory?.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-400 block uppercase mb-1">
                      History
                    </span>
                    {bus.reviewHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className="text-[10.5px] border-l-2 border-slate-200 pl-2 py-1 mb-1.5"
                      >
                        <p className="font-semibold text-slate-700 capitalize">
                          {item.action} ({item.fromStatus} → {item.toStatus})
                        </p>
                        {item.remarks && (
                          <p className="text-slate-500 italic">"{item.remarks}"</p>
                        )}
                        <p className="text-slate-400 text-[9.5px]">
                          {item.timestamp ? new Date(item.timestamp).toLocaleString() : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Full Photo Preview Modal */}
      {photoPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPhotoPreview(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <img
              src={photoPreview}
              alt="Preview"
              className="max-h-[85vh] max-w-[85vw] rounded-2xl object-contain shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setPhotoPreview(null)}
              className="absolute -right-3 -top-3 rounded-full bg-white p-2 text-slate-800 shadow-lg hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Approve Bus Modal */}
      {approveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Approve Bus</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Verify vehicle compliance checklist and set platform commission.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setApproveModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            {/* Checklist with progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Compliance Checklist</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-600">
                  {checkedApprovalItems.length} / {busApprovalChecklist.length}
                </span>
              </div>

              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-[#078A97] transition-all duration-300"
                  style={{
                    width: `${
                      (checkedApprovalItems.length /
                        busApprovalChecklist.length) *
                      100
                    }%`,
                  }}
                />
              </div>

              <div className="mt-3.5 space-y-2 max-h-56 overflow-y-auto pr-1">
                {busApprovalChecklist.map((item, idx) => {
                  const isChecked = checkedApprovalItems.includes(idx);
                  return (
                    <div
                      key={item}
                      role="checkbox"
                      aria-checked={isChecked}
                      tabIndex={0}
                      onClick={() => toggleApprovalItem(idx)}
                      onKeyDown={(e) => {
                        if (e.key === " " || e.key === "Enter") {
                          e.preventDefault();
                          toggleApprovalItem(idx);
                        }
                      }}
                      className={`flex cursor-pointer select-none items-center gap-3 rounded-xl border p-3 transition-colors ${
                        isChecked
                          ? "border-[#078A97]/40 bg-[#078A97]/5"
                          : "border-slate-200/90 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded transition-colors ${
                          isChecked
                            ? "bg-[#078A97] text-white border border-[#078A97]"
                            : "border border-slate-300 bg-white"
                        }`}
                      >
                        {isChecked && <Check size={11} strokeWidth={3} />}
                      </span>
                      <span className="text-xs font-medium text-slate-800">
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Commission Input */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700">
                Platform Commission Percentage (%) *
              </label>
              <div className="relative mt-1.5">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={commission}
                  onChange={(e) => setCommission(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 pl-3 pr-8 text-xs font-semibold text-slate-800 outline-none focus:border-[#078A97] focus:ring-1 focus:ring-[#078A97]"
                  placeholder="e.g. 10"
                />
                <Percent
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            {/* Remarks Textarea */}
            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-700">
                Admin Remarks
              </label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none focus:border-[#078A97] focus:ring-1 focus:ring-[#078A97]"
                placeholder="Registration certificate, insurance, fitness verified..."
              />
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setApproveModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!allApprovalChecked || actionLoading}
                onClick={() => handleReviewBus("approve")}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-sm transition ${
                  allApprovalChecked && !actionLoading
                    ? "bg-[#078A97] hover:bg-[#06747f] cursor-pointer"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed opacity-80"
                }`}
              >
                {actionLoading && <RefreshCw size={12} className="animate-spin" />}
                Approve Bus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Bus Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-rose-600">
                  Reject Bus Registration
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Provide reason for rejection so the operator can correct and resubmit.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            {/* Remarks Textarea */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700">
                Rejection Reason / Remarks *
              </label>
              <textarea
                rows={3}
                value={rejectionRemarks}
                onChange={(e) => setRejectionRemarks(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                placeholder="e.g. Fitness certificate scan is illegible..."
              />
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading || !rejectionRemarks.trim()}
                onClick={() => handleReviewBus("reject")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700 cursor-pointer disabled:opacity-60"
              >
                {actionLoading && <RefreshCw size={12} className="animate-spin" />}
                Reject Bus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
