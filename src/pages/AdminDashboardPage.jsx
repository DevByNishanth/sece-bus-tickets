
import React, { useMemo, useState } from "react";
import VendorNavbar from "./vendor/VendorNavbar.jsx";
import busImage from "../assets/busimage.jpeg";
import busInteriorImage from "../assets/chooseSeat2.png";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  BusFront,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  Check,
} from "lucide-react";

function createSamplePdfUrl(title) {
  const stream = `BT\n/F1 18 Tf\n72 720 Td\n(${title}) Tj\n0 -28 Td\n/F1 11 Tf\n(Sample document for preview only.) Tj\nET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
}

const samplePdfFiles = {
  registration: {
    name: "registration-certificate.pdf",
    url: createSamplePdfUrl("Registration Certificate"),
  },
  permit: {
    name: "tourist-permit.pdf",
    url: createSamplePdfUrl("Tourist Permit"),
  },
  insurance: {
    name: "insurance-policy.pdf",
    url: createSamplePdfUrl("Insurance Policy"),
  },
  fitness: {
    name: "fitness-certificate.pdf",
    url: createSamplePdfUrl("Fitness Certificate"),
  },
  puc: {
    name: "puc-certificate.pdf",
    url: createSamplePdfUrl("PUC Certificate"),
  },
  roadTax: {
    name: "road-tax-receipt.pdf",
    url: createSamplePdfUrl("Road Tax Receipt"),
  },
};

// Replace this sample data with your backend API data.
function getSampleBusDetails(bus, index) {
  const suffix = String(124 - index).padStart(3, "0");

  return {
    agentId: `AGT-00${index + 1}`,
    busName: `${bus.busType} ${bus.specifications}`,
    operatorName: bus.operator,
    registrationNumber: bus.busNumber,
    internalFleetCode: `FLT-${suffix}`,
    ownershipType: index % 2 === 0 ? "Owned" : "Leased",
    manufacturer: bus.busType,
    manufacturingYear: String(2021 + (index % 4)),
    chassisNumber: `CHS-${suffix}-TN`,
    engineNumber: `ENG-${suffix}-TN`,
    category: bus.specifications,
    deckConfiguration: index === 1 ? "double" : "single",
    passengerCapacity: bus.seats,
    seatCount: bus.seats,
    berthCount: index === 1 ? "36" : "0",
    totalSeats: bus.seats,
    rcDoc: {
      documentNumber: `RC-${suffix}-2024`,
      issueDate: "2024-01-15",
      expiryDate: "2039-01-14",
      file: samplePdfFiles.registration,
    },
    permit: {
      permitType: "All India Tourist Permit",
      permitNumber: `PERMIT-${suffix}`,
      validityDate: "2027-12-31",
      issueDate: "2025-01-01",
      expiryDate: "2027-12-31",
      file: samplePdfFiles.permit,
    },
    insurance: {
      policyNumber: `POL-${suffix}-2025`,
      insuranceProvider: "United India Insurance",
      issueDate: "2025-04-01",
      expiryDate: "2026-03-31",
      file: samplePdfFiles.insurance,
    },
    fitness: {
      certificateNumber: `FC-${suffix}-2025`,
      issueDate: "2025-02-10",
      expiryDate: "2026-02-09",
      file: samplePdfFiles.fitness,
    },
    puc: {
      certificateNumber: `PUC-${suffix}-2025`,
      issueDate: "2025-03-01",
      expiryDate: "2026-02-28",
      file: samplePdfFiles.puc,
    },
    roadtax: {
      taxReceiptNumber: `TAX-${suffix}-2025`,
      taxType: "State road tax",
      amount: "₹25,000",
      file: samplePdfFiles.roadTax,
    },
    depo: index % 2 === 0 ? "Chennai Central Depot" : "Coimbatore Depot",
    odometer: `${125000 + index * 18250} km`,
    lastServiceDate: "2025-08-15",
    nextServiceDate: "2025-11-15",
    gpsDeviceIdentifier: `GPS-TN-${suffix}`,
    description: "Scheduled maintenance is up to date. GPS tracking is active.",
    exteriorPhotos: [{ label: "Exterior", src: busImage }],
    interiorPhotos: [{ label: "Interior", src: busInteriorImage }],
    amenities: "Air conditioning, Wi-Fi, Charging point, Live tracking",
  };
}

const initialBuses = [
  {
    id: "BUS-00124",
    busNumber: "TN 38 AB 5678",
    model: "Volvo 9400 Tourist",
    busType: "Volvo",
    operator: "Sri Venkateswara Travels",
    phone: "98765 43210",
    specifications: "AC Tourist",
    seats: "45 seats",
    documents: "2 expiring soon",
    status: "Pending",
  },
  {
    id: "BUS-00123",
    busNumber: "TN 66 CD 9012",
    model: "Ashok Leyland Sleeper",
    busType: "Ashok Leyland",
    operator: "Royal Travels",
    phone: "98422 11001",
    specifications: "AC Sleeper",
    seats: "36 berths",
    documents: "2 expired / missing",
    status: "Pending",
  },
  {
    id: "BUS-00122",
    busNumber: "TN 41 EF 3456",
    model: "Eicher Skyline",
    busType: "Bharat Benz",
    operator: "Horizon Tours",
    phone: "94433 77889",
    specifications: "Non-AC Seater",
    seats: "45 seats",
    documents: "1 expired / missing",
    status: "Approved",
  },
  {
    id: "BUS-00121",
    busNumber: "TN 09 GH 6789",
    model: "Tata Starbus",
    busType: "Tata",
    operator: "Greenline Travels",
    phone: "90034 55667",
    specifications: "AC Seater",
    seats: "33 seats",
    documents: "5 expired / missing",
    status: "Rejected",
  },
].map((bus, index) => ({ ...bus, ...getSampleBusDetails(bus, index) }));

const badgeStyles = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-rose-100 text-rose-700",
};

function getBusType(bus) {
  if (bus.busType?.trim()) return bus.busType;

  const model = bus.model.trim();
  return model.startsWith("Ashok Leyland") || model.startsWith("Bharat Benz")
    ? model.split(" ").slice(0, 2).join(" ")
    : model.split(" ")[0];
}

function StatCard({ title, count, icon: Icon, color }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <Icon size={19} className={color} />
      </div>
      <h2 className="mt-2 text-2xl font-semibold text-slate-800">
        {count}
      </h2>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${badgeStyles[status]}`}
    >
      {status}
    </span>
  );
}

const detailSections = [
  "Bus & Operator",
  "Bus Specifications",
  "Exterior & Interior Photos",
  "Required Documents",
  "Fitness Certificate",
  "Operations & Maintenance",
  "Amenities",
];

function formatDetailValue(value) {
  if (value == null || value === "") return "Not provided";
  if (typeof value === "object") return value.name || "Not provided";
  return value;
}

function BusRequestDetailView({
  bus,
  activeSection,
  onSectionChange,
  onBack,
  onStatusChange,
}) {
  const sectionDetails = {
    "Bus & Operator": {
      description: "Identify this bus and the operator responsible for it.",
      fields: [
        ["Agent ID", bus.agentId],
        ["Bus name", bus.busName || bus.busNumber],
        ["Operator name", bus.operatorName || bus.operator],
        ["Registration number", bus.registrationNumber || bus.busNumber],
        ["Internal fleet code", bus.internalFleetCode],
        ["Ownership type", bus.ownershipType],
      ],
    },
    "Bus Specifications": {
      description: "Vehicle identification and capacity information.",
      fields: [
        ["Manufacturer", bus.manufacturer || bus.busType],
        ["Model", bus.model],
        ["Manufacturing year", bus.manufacturingYear],
        ["Chassis number", bus.chassisNumber],
        ["Engine number", bus.engineNumber],
        ["Bus type", bus.category || bus.specifications],
        ["Category", bus.category],
        [
          "Deck configuration",
          bus.deckConfiguration === "single"
            ? "Single deck"
            : bus.deckConfiguration === "double"
              ? "Double deck"
              : bus.deckConfiguration,
        ],
        ["Passenger capacity", bus.passengerCapacity || bus.seats],
        ["Seat count", bus.seatCount],
        ["Berth count", bus.berthCount],
        ["Total seats / berths", bus.totalSeats || bus.seats],
      ],
    },
    "Required Documents": {
      description: "Document numbers, dates, and attached files.",
      groups: [
        {
          title: "Registration Certificate",
          fields: [
            ["Document number", bus.rcDoc?.documentNumber],
            ["Issue date", bus.rcDoc?.issueDate],
            ["Expiry date", bus.rcDoc?.expiryDate],
            ["Document file", bus.rcDoc?.file],
          ],
        },
        {
          title: "Permit",
          fields: [
            ["Permit type", bus.permit?.permitType],
            ["Permit number", bus.permit?.permitNumber],
            ["Validity date", bus.permit?.validityDate],
            ["Issue date", bus.permit?.issueDate],
            ["Expiry date", bus.permit?.expiryDate],
            ["Document file", bus.permit?.file],
          ],
        },
        {
          title: "Insurance",
          fields: [
            ["Policy number", bus.insurance?.policyNumber],
            ["Insurance provider", bus.insurance?.insuranceProvider],
            ["Issue date", bus.insurance?.issueDate],
            ["Expiry date", bus.insurance?.expiryDate],
            ["Document file", bus.insurance?.file],
          ],
        },
      ],
    },
    "Fitness Certificate": {
      description: "Fitness, PUC, and road tax certificate details.",
      groups: [
        {
          title: "Fitness Certificate",
          fields: [
            ["Certificate number", bus.fitness?.certificateNumber],
            ["Issue date", bus.fitness?.issueDate],
            ["Expiry date", bus.fitness?.expiryDate],
            ["Document file", bus.fitness?.file],
          ],
        },
        {
          title: "PUC Certificate",
          fields: [
            ["Certificate number", bus.puc?.certificateNumber],
            ["Issue date", bus.puc?.issueDate],
            ["Expiry date", bus.puc?.expiryDate],
            ["Document file", bus.puc?.file],
          ],
        },
        {
          title: "Road Tax",
          fields: [
            ["Tax receipt number", bus.roadtax?.taxReceiptNumber],
            ["Tax type", bus.roadtax?.taxType],
            ["Amount", bus.roadtax?.amount],
            ["Document file", bus.roadtax?.file],
          ],
        },
      ],
    },
    "Operations & Maintenance": {
      description: "Depot, mileage, service, and tracking details.",
      fields: [
        ["Depot", bus.depo],
        ["Odometer reading", bus.odometer],
        ["Last service date", bus.lastServiceDate],
        ["Next service date", bus.nextServiceDate],
        ["GPS device identifier", bus.gpsDeviceIdentifier],
        ["Description", bus.description],
      ],
    },
    "Exterior & Interior Photos": {
      description: "Exterior and interior photos provided for this bus.",
      photos: [...(bus.exteriorPhotos || []), ...(bus.interiorPhotos || [])],
    },
    Amenities: {
      description: "Facilities available on this bus.",
      fields: [["Amenities", bus.amenities]],
    },
  };
  const section = sectionDetails[activeSection] || { fields: [] };
  const renderFields = (fields) => (
    <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
      {fields.map(([label, value]) => (
        <div key={label} className="rounded-xl border border-slate-100 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-2 break-words text-sm font-medium text-slate-800">
            {label === "Document file" && value?.url ? (
              <a
                href={value.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[#078797] hover:underline"
              >
                <FileText size={16} />
                {value.name}
                <Eye size={14} />
              </a>
            ) : (
              formatDetailValue(value)
            )}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-[#078797]"
      >
        <ArrowLeft size={17} />
        Back to Bus Approval
      </button>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-800">
          {activeSection}
        </h1>
        {bus.status === "Pending" && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onStatusChange(bus.id, "Rejected")}
              className="rounded-lg border border-rose-300 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => onStatusChange(bus.id, "Approved")}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
            >
              Approve
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <aside
          style={{ left: "max(2rem, calc((100vw - 1600px) / 2 + 2rem))" }}
          className="w-full shrink-0 rounded-2xl border border-[#dcebed] bg-[#f3f9fa] p-3 lg:fixed lg:top-24 lg:bottom-6 lg:w-64 lg:overflow-y-auto"
        >
          <nav aria-label="Bus request detail sections" className="space-y-1">
            {detailSections.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => onSectionChange(section)}
                aria-current={activeSection === section ? "page" : undefined}
                className={`block w-full rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
                  activeSection === section
                    ? "bg-[#e2f4f4] text-[#078797]"
                    : "text-slate-700 hover:bg-white hover:text-[#078797]"
                }`}
              >
                {section}
              </button>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:ml-[17.25rem]">
          <div className="border-b border-slate-100 bg-[#f5f8f9] px-5 py-4">
            <h2 className="font-semibold text-slate-800">{activeSection}</h2>
            {section.description && (
              <p className="mt-1 text-sm text-slate-500">{section.description}</p>
            )}
          </div>
          {section.photos ? (
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              {section.photos.map((photo) => (
                <figure key={photo.label} className="overflow-hidden rounded-xl border border-slate-200">
                  <img
                    src={photo.src}
                    alt={`${photo.label} view of ${bus.busNumber}`}
                    className="h-64 w-full object-cover"
                  />
                  <figcaption className="border-t border-slate-100 px-4 py-3 text-sm font-medium text-slate-700">
                    {photo.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : section.groups ? (
            <div className="space-y-4 p-5">
              {section.groups.map((group) => (
                <section
                  key={group.title}
                  className="rounded-xl border border-slate-200 bg-slate-50/60"
                >
                  <h3 className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800">
                    {group.title}
                  </h3>
                  {renderFields(group.fields)}
                </section>
              ))}
            </div>
          ) : section.fields.length > 0 ? (
            renderFields(section.fields)
          ) : (
            <p className="p-5 text-sm text-slate-500">
              No {activeSection.toLowerCase()} details are available for this bus yet.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

export default function AdminDashboard() {
  const [buses, setBuses] = useState(initialBuses);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [modal, setModal] = useState("");
  const [activeDetailSection, setActiveDetailSection] = useState("Bus & Operator");
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState("");

  const pageSize = 5;

  const stats = {
    total: buses.length,
    pending: buses.filter((b) => b.status === "Pending").length,
    approved: buses.filter((b) => b.status === "Approved").length,
    rejected: buses.filter((b) => b.status === "Rejected").length,
  };

  const filteredBuses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return buses.filter((bus) => {
      const matchesSearch = [
        bus.id,
        bus.busNumber,
        bus.model,
        bus.operator,
      ].some((value) => value.toLowerCase().includes(query));

      return (
        matchesSearch &&
        (statusFilter === "All" || bus.status === statusFilter)
      );
    });
  }, [buses, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBuses.length / pageSize)
  );

  const visibleBuses = filteredBuses.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  function changeStatus(id, status) {
    setBuses((previous) =>
      previous.map((bus) =>
        bus.id === id ? { ...bus, status } : bus
      )
    );

    setSelectedBus((previous) =>
      previous?.id === id ? { ...previous, status } : previous
    );

    setModal("");
    setNotice(`${id} marked ${status}.`);
    setTimeout(() => setNotice(""), 2500);
  }

  function confirmDelete() {
    if (!selectedBus) return;

    setBuses((previous) =>
      previous.filter((bus) => bus.id !== selectedBus.id)
    );

    setSelectedBus(null);
    setModal("");
  }

  if (modal === "view" && selectedBus) {
    return (
      <div className="min-h-screen bg-[#f5f8f9] text-slate-700">
        <VendorNavbar />
        <BusRequestDetailView
          bus={selectedBus}
          activeSection={activeDetailSection}
          onSectionChange={setActiveDetailSection}
          onBack={() => setModal("")}
          onStatusChange={changeStatus}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8f9] text-slate-700">
      <VendorNavbar />
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        {/* Heading and actions */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Bus Approval
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review and approve bus requests from operators.
            </p>
          </div>

        </div>

        {/* Summary cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Requests"
            count={stats.total}
            icon={FileText}
            color="text-sky-600"
          />
          <StatCard
            title="Pending"
            count={stats.pending}
            icon={Clock}
            color="text-amber-500"
          />
          <StatCard
            title="Approved"
            count={stats.approved}
            icon={CheckCircle2}
            color="text-emerald-600"
          />
          <StatCard
            title="Rejected"
            count={stats.rejected}
            icon={XCircle}
            color="text-rose-500"
          />
        </div>

        {/* Table card */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Search and filter */}
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row">
            <div className="relative w-full max-w-3xl">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by bus number, operator or request ID..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            {(showFilter || statusFilter !== "All") && (
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-500"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            )}
          </div>

          {/* Responsive table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="bg-[#f5f8f9] text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Bus Details</th>
                  <th className="px-5 py-4 font-medium">Operator</th>
                  <th className="px-5 py-4 font-medium">Specifications</th>
                  <th className="px-5 py-4 font-medium">Bus Type</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 text-center font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {visibleBuses.map((bus) => (
                  <tr
                    key={bus.id}
                    className="transition hover:bg-[#f8fbfc]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={busImage}
                          alt={`${getBusType(bus)} bus`}
                          className="h-10 w-14 rounded-md object-cover"
                        />
                        <div>
                          <p className="whitespace-nowrap text-sm font-semibold text-slate-800">
                            {bus.busNumber}
                          </p>
                          <p className="mt-1 whitespace-nowrap text-xs text-slate-500">
                            {bus.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="whitespace-nowrap text-sm font-medium text-slate-700">
                        {bus.operator}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {bus.phone}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm">{bus.specifications}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {bus.seats}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                        {getBusType(bus)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={bus.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          title="View details"
                          onClick={() => {
                            setSelectedBus(bus);
                            setActiveDetailSection("Bus & Operator");
                            setModal("view");
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {visibleBuses.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-sm text-slate-500"
                    >
                      No bus requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-500">
              Showing{" "}
              {filteredBuses.length === 0
                ? 0
                : (page - 1) * pageSize + 1}
              {" – "}
              {Math.min(page * pageSize, filteredBuses.length)} of{" "}
              {filteredBuses.length} requests
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
              >
                <ChevronLeft size={17} />
              </button>

              <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#078797] px-3 text-sm font-medium text-white">
                {page}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </section>

        {notice && (
          <div className="fixed bottom-5 right-5 z-50 rounded-xl bg-slate-800 px-5 py-3 text-sm text-white shadow-xl">
            {notice}
          </div>
        )}
        </main>
      </div>

      {/* View / Edit / Delete modal */}
      {modal && selectedBus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                {modal === "view"
                  ? "Bus Request Details"
                  : modal === "edit"
                    ? "Edit Bus Request"
                    : "Delete Bus Request"}
              </h2>
              <button
                onClick={() => setModal("")}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            {modal === "delete" ? (
              <>
                <p className="text-sm text-slate-600">
                  Are you sure you want to delete request{" "}
                  <strong>{selectedBus.id}</strong>? This removes it from
                  this screen's local data.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setModal("")}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="rounded-lg bg-rose-600 px-4 py-2 text-sm text-white"
                  >
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-xl bg-teal-50 p-4">
                    <span className="rounded-xl bg-white p-3 text-teal-700">
                      <BusFront size={26} />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800">
                        {selectedBus.busNumber}
                      </p>
                      <p className="text-sm text-slate-500">
                        {selectedBus.id} · {selectedBus.model}
                      </p>
                    </div>
                  </div>

                  {[
                    ["Operator", selectedBus.operator],
                    ["Phone", selectedBus.phone],
                    ["Specifications", selectedBus.specifications],
                    ["Seating capacity", selectedBus.seats],
                    ["Documents", selectedBus.documents],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm"
                    >
                      <span className="text-slate-500">{label}</span>
                      <span className="text-right font-medium text-slate-800">
                        {value}
                      </span>
                    </div>
                  ))}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Status</span>
                    <StatusBadge status={selectedBus.status} />
                  </div>
                </div>

                {modal === "edit" && (
                  <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                    Connect your edit form to your backend to update bus
                    details permanently.
                  </p>
                )}

                <div className="mt-6 flex flex-wrap justify-end gap-2">
                  <button
                    onClick={() => setModal("")}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                  >
                    Close
                  </button>

                  {selectedBus.status === "Pending" && (
                    <>
                      <button
                        onClick={() =>
                          changeStatus(selectedBus.id, "Rejected")
                        }
                        className="flex items-center gap-2 rounded-lg border border-rose-300 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        <X size={16} />
                        Reject
                      </button>
                      <button
                        onClick={() =>
                          changeStatus(selectedBus.id, "Approved")
                        }
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
                      >
                        <Check size={16} />
                        Approve
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
