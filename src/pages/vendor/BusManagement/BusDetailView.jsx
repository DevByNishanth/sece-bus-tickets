import { ArrowLeft, BusFront, CalendarDays, CheckCircle2, ExternalLink, FileText, MapPin, Pencil, ShieldCheck, Wrench } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import VendorNavbar from "../VendorNavbar";
import busPhoto from "../../../assets/komban.jfif";
import { useEffect, useState } from "react";
import axios from "axios";

const formatDocumentDate = (value) => {
    if (value === null || value === undefined || value === "") return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const documentRows = [
    { key: "rcDoc", label: "Registration Certificate", identifiers: [["Document number", "documentNumber"]] },
    { key: "permit", label: "State Permit", identifiers: [["Permit number", "permitNumber"], ["Permit type", "permitType"]] },
    { key: "insurance", label: "Vehicle Insurance", identifiers: [["Policy number", "policyNumber"], ["Provider", "insuranceProvider"]] },
    { key: "puc", label: "PUC Certificate", identifiers: [["Certificate number", "certificateNumber"]] },
    { key: "roadTax", label: "Road Tax", identifiers: [["Receipt number", "taxReceiptNumber"], ["Tax type", "taxType"], ["Amount", "amount"]] },
];

const amenityLabels = {
    wifi: "Wi-Fi",
    chargingPoint: "Charging point",
    readingLight: "Reading light",
    waterBottle: "Water bottle",
    blanket: "Blanket",
    gps: "GPS",
    cctv: "CCTV",
    emergencyExit: "Emergency exit",
    airConditioning: "Air conditioning",
};

const BusDetailView = () => {

    const { busId } = useParams()
    const navigate = useNavigate();

    const token = localStorage.getItem("exte_key");

    // states
    const [busData, setBusData] = useState(null)



    // functions
    const fetchBusDetails = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/agent/buses/${busId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        console.log("bus details : ", res.data.bus)
        setBusData(res.data.bus)
    }

    useEffect(() => {
        fetchBusDetails()
    }, [busId])


    const seatLayout = busData?.seatLayout;

    const seatLayoutText = seatLayout?.decks?.length
        ? seatLayout.decks
            .map((d) => `${d.deck}: ${d.rows?.length ?? 0} rows`)
            .join(" | ")
        : "--";
    const fitnessData = busData?.fitness;
    const fitnessExpiry = fitnessData?.expiryDate;
    const fitnessExpiryDate = fitnessExpiry ? new Date(fitnessExpiry) : null;
    const fitnessHasValidDate = fitnessExpiryDate && !Number.isNaN(fitnessExpiryDate.getTime());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fitnessIsExpired = fitnessExpiryDate && !Number.isNaN(fitnessExpiryDate.getTime()) && fitnessExpiryDate < today;
    const odometerValue = busData?.odometer !== null && busData?.odometer !== undefined && busData?.odometer !== ""
        ? `${Number.isFinite(Number(busData.odometer)) ? Number(busData.odometer).toLocaleString("en-IN") : busData.odometer} km`
        : "--";
    return (
        <div className="min-h-screen bg-[#f7f9fa]">
            <VendorNavbar />
            <main className="mx-auto w-[94%] max-w-6xl py-5 sm:py-7">
                <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <button type="button" onClick={() => navigate("/vendor/bus-management")} className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-teal-700"><ArrowLeft size={14} /> Back to buses</button>
                        <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Bus details</h1>
                        <p className="mt-1 text-sm text-slate-500">View vehicle information, compliance documents, and fleet operations.</p>
                    </div>
                    <button type="button" className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg bg-[#0E7A88] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0d6f7b] sm:self-auto"><Pencil size={15} /> Edit bus</button>
                </div>

                <div className="space-y-4">
                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-labelledby="bus-operator-title">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><BusFront size={17} /></span>
                            <div><h2 id="bus-operator-title" className="text-sm font-semibold text-slate-900">Bus &amp; Operator</h2><p className="mt-0.5 text-[11px] text-slate-500">Bus identity and operating information</p></div>
                            <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700"><CheckCircle2 size={12} /> Active</span>
                        </div>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="border-b border-slate-100 px-4 py-3 sm:px-5"><dt className="text-[9px] font-medium uppercase tracking-[.12em] text-slate-400">Bus name</dt><dd className="mt-1 text-xs font-semibold text-slate-800">{busData?.busName || "--"}</dd></div>
                            <div className="border-b border-slate-100 px-4 py-3 sm:border-l sm:px-5"><dt className="text-[9px] font-medium uppercase tracking-[.12em] text-slate-400">Operator name</dt><dd className="mt-1 text-xs font-semibold text-slate-800">{busData?.operatorName || "--"}</dd></div>
                            <div className="border-b border-slate-100 px-4 py-3 sm:px-5 lg:border-l"><dt className="text-[9px] font-medium uppercase tracking-[.12em] text-slate-400">Registration number</dt><dd className="mt-1 text-xs font-semibold text-slate-800">{busData?.registrationNumber || "--"}</dd></div>
                            <div className="border-b border-slate-100 px-4 py-3 sm:px-5"><dt className="text-[9px] font-medium uppercase tracking-[.12em] text-slate-400">Internal fleet code</dt><dd className="mt-1 text-xs font-semibold text-slate-800">{busData?.
                                internalFleetCode || "--"}</dd></div>
                            <div className="border-b border-slate-100 px-4 py-3 sm:border-l sm:px-5"><dt className="text-[9px] font-medium uppercase tracking-[.12em] text-slate-400">Ownership type</dt><dd className="mt-1 text-xs font-semibold capitalize text-slate-800">{busData?.ownershipType || "--"}</dd></div>
                            <div className="border-b border-slate-100 px-4 py-3 sm:px-5 lg:border-l"><dt className="text-[9px] font-medium uppercase tracking-[.12em] text-slate-400">Operator contact</dt><dd className="mt-1 text-xs font-semibold text-slate-800">+91 98765 42018</dd></div>
                        </dl>
                    </section>

                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-labelledby="bus-specifications-title">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-700"><BusFront size={17} /></span><div><h2 id="bus-specifications-title" className="text-sm font-semibold text-slate-900">Bus Specifications</h2><p className="mt-0.5 text-[11px] text-slate-500">Vehicle configuration, identification, and passenger capacity</p></div></div>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="border-b border-slate-100 px-4 py-3 sm:px-5"><dt className="text-[9px] font-medium uppercase tracking-[.12em] text-slate-400">Manufacturer / model</dt><dd className="mt-1 text-xs font-semibold text-slate-800">{busData?.
                                manufacturer || "--"}</dd></div>
                            <div className="border-b border-slate-100 px-4 py-3 sm:border-l sm:px-5"><dt className="text-[9px] font-medium uppercase tracking-[.12em] text-slate-400">Manufacturing year</dt><dd className="mt-1 text-xs font-semibold text-slate-800">{busData?.manufacturingYear || "--"}</dd></div>
                            <div className="border-b border-slate-100 px-4 py-3 sm:px-5 lg:border-l"><dt className="text-[9px] font-medium uppercase tracking-[.12em] text-slate-400">Bus type</dt><dd className="mt-1 text-xs font-semibold text-slate-800">{busData?.busType || "--"}</dd></div>
                            <div className="border-b border-slate-100 px-4 py-3 sm:px-5"><dt className="text-[9px] font-medium uppercase tracking-[.12em] text-slate-400">Category / deck</dt><dd className="mt-1 text-xs font-semibold text-slate-800">{busData?.category || "--"}</dd></div>
                            <div className="border-b border-slate-100 px-4 py-3 sm:border-l sm:px-5"><dt className="text-[9px] font-medium uppercase tracking-[.12em] text-slate-400">Passenger capacity</dt><dd className="mt-1 text-xs font-semibold text-slate-800">{busData?.passengerCapacity || "--"} passengers</dd></div>

                            <div className="border-b border-slate-100 px-4 py-3 sm:px-5 lg:border-l"><dt className="text-[9px] font-medium uppercase tracking-[.12em] text-slate-400">Seats / berths</dt><dd className="mt-1 text-xs font-semibold text-slate-800">{busData?.seatCount || "--"} seats ·  {busData?.berthCount} berths</dd></div>
                            <div className="px-4 py-3 sm:px-5"><dt className="text-[9px] font-medium uppercase tracking-[.12em] text-slate-400">Chassis number</dt><dd className="mt-1 text-xs font-semibold text-slate-800">{busData?.chassisNumber || "--"}</dd></div>
                            <div className="border-t border-slate-100 px-4 py-3 sm:border-l sm:px-5"><dt className="text-[9px] font-medium uppercase tracking-[.12em] text-slate-400">Engine number</dt><dd className="mt-1 text-xs font-semibold text-slate-800">{busData?.engineNumber || "--"}</dd></div>
                            <div className="border-t border-slate-100 px-4 py-3 sm:px-5 lg:border-l">
                                <dt className="text-[9px] font-medium uppercase tracking-[.12em] text-slate-400">
                                    Seat layout
                                </dt>
                                <dd className="mt-1 text-xs font-semibold capitalize text-slate-800">
                                    {seatLayoutText}
                                </dd>
                            </div>
                        </dl>
                    </section>

                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-labelledby="bus-photos-title">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-700"><FileText size={17} /></span><div><h2 id="bus-photos-title" className="text-sm font-semibold text-slate-900">Exterior &amp; Interior Photos</h2><p className="mt-0.5 text-[11px] text-slate-500">Vehicle photos on file</p></div></div>
                        <div className="grid gap-5 p-4 sm:grid-cols-2 sm:p-5">
                            <div><h3 className="mb-2.5 text-[10px] font-semibold uppercase tracking-[.12em] text-slate-500">Exterior <span className="ml-1 font-normal normal-case tracking-normal text-slate-400">(3 photos)</span></h3><div className="grid grid-cols-3 gap-2"><img src={busPhoto} alt="Bus exterior, front view" className="h-24 w-full rounded-lg border border-slate-200 object-cover" /><img src={busPhoto} alt="Bus exterior, side view" className="h-24 w-full rounded-lg border border-slate-200 object-cover object-right" /><img src={busPhoto} alt="Bus exterior, rear view" className="h-24 w-full rounded-lg border border-slate-200 object-cover object-left" /></div></div>
                            <div><h3 className="mb-2.5 text-[10px] font-semibold uppercase tracking-[.12em] text-slate-500">Interior <span className="ml-1 font-normal normal-case tracking-normal text-slate-400">(2 photos)</span></h3><div className="grid grid-cols-3 gap-2"><img src={busPhoto} alt="Bus interior, sleeper berths" className="h-24 w-full rounded-lg border border-slate-200 object-cover" /><img src={busPhoto} alt="Bus interior, passenger cabin" className="h-24 w-full rounded-lg border border-slate-200 object-cover object-right" /></div></div>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-labelledby="required-documents-title">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700"><FileText size={17} /></span><div><h2 id="required-documents-title" className="text-sm font-semibold text-slate-900">Required Documents</h2><p className="mt-0.5 text-[11px] text-slate-500">Registration, permit, insurance, PUC, and road tax records</p></div></div>
                        <div className="divide-y divide-slate-100">
                            {documentRows.map(({ key, label, identifiers }) => {
                                const document = busData?.[key];
                                const detailValues = identifiers
                                    .map(([name, field]) => document?.[field] !== null && document?.[field] !== undefined && document?.[field] !== ""
                                        ? `${name}: ${document[field]}`
                                        : null)
                                    .filter(Boolean);
                                const issueDate = document?.issueDate;
                                const expiryDate = document?.expiryDate || document?.validityDate;
                                const uploadedAt = document?.uploadedAt;

                                return (
                                    <div key={key} className="grid gap-3 px-4 py-3.5 sm:grid-cols-[1.2fr_1.5fr_1fr_auto] sm:items-center sm:px-5">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-800">{label}</p>
                                            {detailValues.length > 0
                                                ? <p className="mt-0.5 text-[10px] text-slate-500">{detailValues.join(" · ")}</p>
                                                : <p className="mt-0.5 text-[10px] text-slate-400">No document details provided</p>}
                                        </div>
                                        <div className="space-y-0.5 text-[10px] text-slate-500">
                                            {issueDate && <p>Issued: {formatDocumentDate(issueDate)}</p>}
                                            {expiryDate && <p>Valid until: {formatDocumentDate(expiryDate)}</p>}
                                            {!issueDate && !expiryDate && <p>Date information not provided</p>}
                                            {uploadedAt && <p className="text-slate-400">Uploaded: {formatDocumentDate(uploadedAt)}</p>}
                                        </div>
                                        <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ${document?.url ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                                            {document?.url ? <><CheckCircle2 size={12} /> File provided </> : "Not uploaded"}
                                        </span>
                                        {document?.url
                                            ? <a href={document.url} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-[10px] font-semibold text-teal-700 transition hover:border-teal-200 hover:bg-teal-50"><ExternalLink size={12} /> Open file</a>
                                            : <span className="text-[10px] text-slate-300">No file</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-labelledby="fitness-certificate-title">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700"><ShieldCheck size={17} /></span><div><h2 id="fitness-certificate-title" className="text-sm font-semibold text-slate-900">Fitness Certificate</h2><p className="mt-0.5 text-[11px] text-slate-500">Vehicle fitness and certification validity</p></div><span className={`ml-auto inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${fitnessIsExpired ? "border-rose-100 bg-rose-50 text-rose-700" : fitnessHasValidDate ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-500"}`}>{fitnessHasValidDate ? <><CheckCircle2 size={12} />{fitnessIsExpired ? "Expired" : "Valid"}</> : "Date unavailable"}</span></div>
                        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:items-center sm:px-5 lg:grid-cols-[1fr_1fr_1fr_auto]">
                            <div><dt className="text-[9px] font-medium uppercase tracking-[.12em] text-slate-400">Certificate number</dt><dd className="mt-1 text-xs font-semibold text-slate-800">{fitnessData?.certificateNumber || "--"}</dd></div>
                            <div><dt className="text-[9px] font-medium uppercase tracking-[.12em] text-slate-400">Issue date</dt><dd className="mt-1 text-xs font-semibold text-slate-800">{formatDocumentDate(fitnessData?.issueDate)}</dd></div>
                            <div><dt className="text-[9px] font-medium uppercase tracking-[.12em] text-slate-400">Valid until</dt><dd className="mt-1 text-xs font-semibold text-slate-800">{formatDocumentDate(fitnessExpiry)}</dd>{fitnessData?.uploadedAt && <p className="mt-1 text-[10px] text-slate-400">Uploaded {formatDocumentDate(fitnessData.uploadedAt)}</p>}</div>
                            {fitnessData?.url
                                ? <a href={fitnessData.url} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-[10px] font-semibold text-teal-700 transition hover:border-teal-200 hover:bg-teal-50"><ExternalLink size={12} /> Open file</a>
                                : <span className="text-[10px] text-slate-400">No file uploaded</span>}
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-labelledby="operations-maintenance-title">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-700"><Wrench size={17} /></span><div><h2 id="operations-maintenance-title" className="text-sm font-semibold text-slate-900">Operations &amp; Maintenance</h2><p className="mt-0.5 text-[11px] text-slate-500">Depot, mileage, service schedule, and tracking details</p></div></div>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="border-b border-slate-100 px-4 py-3 sm:px-5"><dt className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-[.12em] text-slate-400"><MapPin size={11} /> Depot</dt><dd className="mt-1 text-xs font-semibold text-slate-800">{busData?.depo || "--"}</dd></div>
                            <div className="border-b border-slate-100 px-4 py-3 sm:border-l sm:px-5"><dt className="text-[9px] font-medium uppercase tracking-[.12em] text-slate-400">Odometer reading</dt><dd className="mt-1 text-xs font-semibold text-slate-800">{odometerValue}</dd></div>
                            <div className="border-b border-slate-100 px-4 py-3 sm:px-5 lg:border-l"><dt className="text-[9px] font-medium uppercase tracking-[.12em] text-slate-400">GPS device identifier</dt><dd className="mt-1 text-xs font-semibold text-slate-800">{busData?.gpsDeviceIdentifier || "--"}</dd></div>
                            <div className="border-b border-slate-100 px-4 py-3 sm:px-5"><dt className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-[.12em] text-slate-400"><CalendarDays size={11} /> Last service</dt><dd className="mt-1 text-xs font-semibold text-slate-800">{formatDocumentDate(busData?.lastServiceDate)}</dd></div>
                            <div className="border-b border-slate-100 px-4 py-3 sm:border-l sm:px-5"><dt className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-[.12em] text-slate-400"><CalendarDays size={11} /> Next service</dt><dd className="mt-1 text-xs font-semibold text-slate-800">{formatDocumentDate(busData?.nextServiceDate)}</dd></div>
                            <div className="border-b border-slate-100 px-4 py-3 sm:px-5 lg:border-l"><dt className="text-[9px] font-medium uppercase tracking-[.12em] text-slate-400">Description</dt><dd className="mt-1 text-xs font-medium leading-5 text-slate-700">{busData?.description || "--"}</dd></div>
                        </dl>
                    </section>

                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-labelledby="amenities-title">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700"><CheckCircle2 size={17} /></span><div><h2 id="amenities-title" className="text-sm font-semibold text-slate-900">Amenities</h2><p className="mt-0.5 text-[11px] text-slate-500">Facilities available to passengers</p></div></div>
                        <div className="flex flex-wrap gap-2 p-4 sm:p-5">
                            {Array.isArray(busData?.amenities) && busData.amenities.length > 0
                                ? busData.amenities.map((amenity) => (
                                    <span key={amenity} className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50/70 px-3 py-1.5 text-[11px] font-medium text-teal-800"><CheckCircle2 size={12} className="text-teal-600" />{amenityLabels[amenity] || String(amenity).replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase())}</span>
                                ))
                                : <p className="text-xs text-slate-400">No amenities recorded.</p>}
                        </div>
                    </section>
                </div>
                <p className="pb-5 pt-4 text-center text-[10px] text-slate-400">Bus record last updated 18 Oct 2026</p>
            </main>
        </div>
    );
};

export default BusDetailView;
