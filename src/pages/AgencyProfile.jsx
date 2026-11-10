import { useEffect, useMemo, useState } from "react";
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
  const [selectedBus, setSelectedBus] = useState(null);
  const tokenKeyName = TOKEN_KEY || "exte_key";

  useEffect(() => {
    let active = true;

    async function loadAgencies() {
      setLoadingAgencies(true);
      try {
        const token = localStorage.getItem(tokenKeyName);
        const response = await fetch(`${BASE_URL}/admin/agents?limit=100`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!response.ok) throw new Error("Unable to load agencies.");
        const data = await response.json();
        if (active) {
          setAgencies(Array.isArray(data.agents) ? data.agents : Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        if (active) setError(loadError.message || "Unable to load agencies.");
      } finally {
        if (active) setLoadingAgencies(false);
      }
    }

    loadAgencies();
    return () => {
      active = false;
    };
  }, [BASE_URL, tokenKeyName]);

  const filteredAgencies = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return agencies
      .filter((agency) => {
        const searchableName = [
          agency.tradeName,
          agency.registeredBusinessName,
          agency.businessName,
          agency.registrationNumber,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchableName.includes(query);
      })
      .slice(0, 8);
  }, [agencies, search]);

  async function selectAgency(agency) {
    const agencyId = agency._id || agency.id;
    setSearch(getAgencyName(agency));
    setSearchOpen(false);
    setSelectedAgency(null);
    setError("");
    if (!agencyId) {
      setSelectedAgency(agency);
      return;
    }

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
      setSelectedAgency(data.agent || data || agency);
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
        const linkedUserId = selectedAgency.userId?._id || selectedAgency.userId;
        const agencyId = linkedUserId || selectedAgency._id || selectedAgency.id;
        const params = new URLSearchParams({ limit: "100" });
        if (agencyId) params.set("agentId", agencyId);
        const response = await fetch(`${BASE_URL}/admin/buses?${params}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!response.ok) throw new Error("Unable to load buses for this agency.");
        const data = await response.json();
        const agencyBuses = Array.isArray(data.buses)
          ? data.buses
          : Array.isArray(data)
            ? data
            : [];
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

  const registeredAddress = getAddress(selectedAgency?.registeredAddress);
  const ownerName =
    selectedAgency?.primaryContactPerson ||
    selectedAgency?.operatorDisplayName ||
    `${selectedAgency?.userId?.firstName || ""} ${selectedAgency?.userId?.lastName || ""}`.trim();
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
        _id: selectedBus._id || selectedBus.id,
        registration: selectedBus.registrationNumber || selectedBus.busName || "Bus details",
        operator: selectedBus.operatorName || getAgencyName(selectedAgency),
        model: [selectedBus.manufacturer, selectedBus.model].filter(Boolean).join(" ") || "Not provided",
        specification: getBusType(selectedBus),
        deck: `${selectedBus.deckConfiguration || "Single"} deck`,
        capacity: `${selectedBus.passengerCapacity || selectedBus.totalSeats || 0} seats`,
        depot: selectedBus.depot || selectedAgency?.operatingAddress?.city || "Not provided",
        odometer: selectedBus.odometer ? `${selectedBus.odometer} km` : "Not provided",
        totalTrips: getBusCount(selectedBus, "totalTrips", "tripCount"),
        inProgress: getBusCount(selectedBus, "inProgressTrips", "inProgress"),
        trips: [
          [getBusCount(selectedBus, "upcomingTrips", "upcomingTripCount")],
          [getBusCount(selectedBus, "completedTrips", "completedTripCount")],
          [getBusCount(selectedBus, "cancelledTrips", "cancelledTripCount")],
          [getBusCount(selectedBus, "rejectedTrips", "rejectedTripCount")],
          [getBusCount(selectedBus, "draftTrips", "draftCount")],
        ],
        tripRecords: Array.isArray(selectedBus.tripRecords) ? selectedBus.tripRecords : [],
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
                ) : filteredAgencies.length ? (
                  filteredAgencies.map((agency) => (
                    <button
                      key={agency._id || agency.id || getAgencyName(agency)}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectAgency(agency)}
                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-teal-50"
                    >
                      <Building2 size={14} className="shrink-0 text-[#0e8290]" />
                      <span className="min-w-0 flex-1 truncate font-medium">
                        {getAgencyName(agency)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {agency.status || "Agency"}
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

        {loadingProfile ? (
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
                <InfoItem label="Application ID" value={selectedAgency.applicationId || selectedAgency.applicationNumber || selectedAgency.registrationNumber} />
                <InfoItem label="Company ID" value={selectedAgency.companyId || selectedAgency._id || selectedAgency.id} />
                <InfoItem label="Legal Business Name" value={selectedAgency.registeredBusinessName || selectedAgency.businessName} />
                <InfoItem label="Trade Name" value={selectedAgency.tradeName || selectedAgency.operatingName} />
                <InfoItem label="Business Type" value={selectedAgency.businessType} />
                <InfoItem label="Owner / Authorized Person" value={ownerName} />
                <InfoItem
                  label="Phone Verification"
                  value={selectedAgency.businessMobile || selectedAgency.userId?.phone}
                  className="text-emerald-700"
                />
                <InfoItem
                  label="Email Verification"
                  value={selectedAgency.businessEmail || selectedAgency.userId?.email}
                />
                <InfoItem label="PAN" value={selectedAgency.businessPan} />
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