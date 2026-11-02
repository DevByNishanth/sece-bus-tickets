import { useState } from "react";
import { ChevronRight, ArrowLeft, ArrowRight, Upload, BusFront, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import VendorNavbar from "../VendorNavbar";
import BusFlowStepper from "./BusFlowStepper";
import CustomDatePicker from "../../../components/CustomDatePicker";

const documentSections = [
    { key: "rcDoc", title: "Registration Certificate", fields: [["documentNumber", "Document number", "text"], ["issueDate", "Issue date", "date"], ["expiryDate", "Expiry date", "date"]] },
    { key: "permit", title: "Permit", fields: [["permitType", "Permit type", "text"], ["permitNumber", "Permit number", "text"], ["validityDate", "Validity date", "date"], ["issueDate", "Issue date", "date"], ["expiryDate", "Expiry date", "date"]] },
    { key: "insurance", title: "Insurance", fields: [["policyNumber", "Policy number", "text"], ["insuranceProvider", "Insurance provider", "text"], ["issueDate", "Issue date", "date"], ["expiryDate", "Expiry date", "date"]] },
    { key: "fitness", title: "Fitness Certificate", fields: [["certificateNumber", "Certificate number", "text"], ["issueDate", "Issue date", "date"], ["expiryDate", "Expiry date", "date"]] },
    { key: "puc", title: "PUC Certificate", fields: [["certificateNumber", "Certificate number", "text"], ["issueDate", "Issue date", "date"], ["expiryDate", "Expiry date", "date"]] },
    { key: "roadtax", title: "Road Tax", fields: [["taxReceiptNumber", "Tax receipt number", "text"], ["taxType", "Tax type", "text"], ["amount", "Amount", "number"]] },
];

const AMENITIES = [
    ["wifi", "Wi-Fi"], ["chargingPoint", "Charging point"], ["readingLight", "Reading light"],
    ["waterBottle", "Water bottle"], ["blanket", "Blanket"], ["gps", "GPS"],
    ["cctv", "CCTV"], ["emergencyExit", "Emergency exit"], ["airConditioning", "Air conditioning"],
];
const REQUIRED_DOCUMENT_KEYS = new Set(["rcDoc", "insurance", "fitness", "permit"]);
const DOCUMENTS_REQUIRING_EXPIRY = new Set(["insurance", "fitness", "permit"]);
const tomorrowDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const initialForm = {
    busName: "", operatorName: "", registrationNumber: "", internalFleetCode: "",
    manufacturer: "", model: "", manufacturingYear: "", chassisNumber: "", engineNumber: "",
    ownershipType: "owned", busType: "", category: "", deckConfiguration: "single",
    passengerCapacity: "", seatCount: "", berthCount: "", totalSeats: "", seatLayout: null,
    exteriorPhotos: [], interiorPhotos: [],
    rcDoc: { documentNumber: "", issueDate: "", expiryDate: "", file: null },
    permit: { permitType: "", permitNumber: "", validityDate: "", issueDate: "", expiryDate: "", file: null },
    insurance: { policyNumber: "", insuranceProvider: "", issueDate: "", expiryDate: "", file: null },
    fitness: { certificateNumber: "", issueDate: "", expiryDate: "", file: null },
    puc: { certificateNumber: "", issueDate: "", expiryDate: "", file: null },
    roadtax: { taxReceiptNumber: "", taxType: "", amount: "", file: null },
    depo: "", odometer: "", lastServiceDate: "", nextServiceDate: "", gpsDeviceIdentifier: "", description: "", amenities: [],
};

const inputClass = "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100";
const labelClass = "block text-xs font-medium text-slate-600";

const readFile = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result });
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

const restoreFile = (savedFile) => {
    if (!savedFile?.data) return null;
    const [metadata, data] = savedFile.data.split(",");
    const mimeType = metadata.match(/data:(.*?);/)?.[1] || savedFile.type || "application/octet-stream";
    const bytes = Uint8Array.from(atob(data), (character) => character.charCodeAt(0));
    return new File([bytes], savedFile.name || "upload", { type: mimeType });
};

const restoreBusDraft = (draftId) => {
    if (!draftId) return initialForm;
    try {
        const saved = JSON.parse(window.localStorage.getItem(`bus-details-draft-${draftId}`) || "null");
        if (!saved) return initialForm;
        const restored = { ...initialForm, ...saved };
        for (const field of ["exteriorPhotos", "interiorPhotos"]) restored[field] = (saved[field] || []).map(restoreFile).filter(Boolean);
        for (const section of documentSections) {
            restored[section.key] = { ...initialForm[section.key], ...saved[section.key], file: restoreFile(saved[section.key]?.file) };
        }
        return restored;
    } catch {
        return initialForm;
    }
};

const BusDetailsPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState(() => restoreBusDraft(searchParams.get("draftId")));
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const updateField = (name, value) => setForm((current) => ({ ...current, [name]: value }));
    const updateDocument = (section, name, value) => setForm((current) => ({ ...current, [section]: { ...current[section], [name]: value } }));

    const handleContinue = async (event) => {
        event.preventDefault();
        setError("");
        setIsSaving(true);
        try {
            const preparedForm = { ...form };
            for (const photoField of ["exteriorPhotos", "interiorPhotos"]) {
                preparedForm[photoField] = await Promise.all(form[photoField].map(readFile));
            }
            for (const section of documentSections) {
                const file = form[section.key].file;
                preparedForm[section.key] = { ...form[section.key], file: file instanceof File ? await readFile(file) : file };
            }
            const busId = `bus-${Date.now()}`;
            window.localStorage.setItem(`bus-details-draft-${busId}`, JSON.stringify(preparedForm));
            navigate(`/vendor/seatGeneration/${busId}`);
        } catch {
            setError("We could not save this bus draft in your browser. Try smaller files or remove a file and try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const renderTextField = (name, label, type = "text", required = false, constraints = {}) => (
        type === "date" ? (
            <CustomDatePicker
                key={name}
                label={label}
                name={name}
                value={form[name]}
                required={required}
                onChange={(event) => updateField(name, event.target.value)}
            />
        ) : (
        <label key={name} className={labelClass}>{label}{required && <span className="text-rose-600"> *</span>}
            <input name={name} type={type} required={required} {...constraints} value={form[name]} onChange={(event) => updateField(name, event.target.value)} className={inputClass} />
        </label>
        )
    );

    const renderSection = (title, description, children) => (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-100 pb-4"><h2 className="text-base font-semibold text-slate-900">{title}</h2><p className="mt-1 text-xs text-slate-500">{description}</p></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
        </section>
    );

    return (
        <div className="min-h-screen bg-[#f7f9fa]">
            <VendorNavbar />
            <main className="mx-auto w-[94%]  max-w-6xl py-5">
                {/* <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
                    <button type="button" onClick={() => navigate("/vendor/bus-management")} className="hover:text-teal-700">Fleet</button><ChevronRight size={13} />
                    <button type="button" onClick={() => navigate("/vendor/bus-management")} className="hover:text-teal-700">My Buses</button><ChevronRight size={13} />
                    <span className="font-medium text-slate-900">Add Bus Details</span>
                </nav> */}
             
                <BusFlowStepper currentStep={1} />
                <div className="mb-5 flex items-start gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><BusFront size={20} /></span>
                    <div><h1 className="text-xl font-semibold text-slate-900">Add a bus to your fleet</h1><p className="mt-1 text-sm text-slate-500">Enter the bus information and documents, then create its seat layout.</p></div>
                </div>

                <form onSubmit={handleContinue} className="space-y-4">
                    {renderSection("Bus & Operator", "Identify this bus and the operator responsible for it.", <>
                        {renderTextField("busName", "Bus name", "text", true, { maxLength: 100 })}{renderTextField("operatorName", "Operator name", "text", true, { maxLength: 100 })}
                        {renderTextField("registrationNumber", "Registration number", "text", true, { minLength: 5, maxLength: 20, pattern: "[A-Za-z0-9\\s-]{5,20}", title: "Use 5–20 letters, numbers, spaces, or hyphens." })}{renderTextField("internalFleetCode", "Internal fleet code")}
                        <label className={labelClass}>Ownership type<select value={form.ownershipType || "owned"} onChange={(event) => updateField("ownershipType", event.target.value)} className={inputClass}><option value="owned">Owned</option><option value="leased">Leased</option><option value="attached">Attached</option><option value="partner">Partner</option><option value="other">Other</option></select></label>
                    </>)}

                    {renderSection("Bus Specifications", "Add vehicle identification and capacity information.", <>
                        {renderTextField("manufacturer", "Manufacturer")}{renderTextField("model", "Model")}{renderTextField("manufacturingYear", "Manufacturing year", "number", false, { min: 1990, max: new Date().getFullYear() + 1, step: 1 })}
                        {renderTextField("chassisNumber", "Chassis number")}{renderTextField("engineNumber", "Engine number")}
                        <label className={labelClass}>Bus type<span className="text-rose-600"> *</span><select required value={form.busType} onChange={(event) => updateField("busType", event.target.value)} className={inputClass}><option value="">Select bus type</option><option value="seater">Seater</option><option value="sleeper">Sleeper</option><option value="semi-sleeper">Semi-sleeper</option></select></label>
                        <label className={labelClass}>Category<span className="text-rose-600"> *</span><select required value={form.category} onChange={(event) => updateField("category", event.target.value)} className={inputClass}><option value="">Select category</option><option value="AC">AC</option><option value="NON_AC">Non-AC</option></select></label>
                        <label className={labelClass}>Deck configuration<select value={form.deckConfiguration} onChange={(event) => updateField("deckConfiguration", event.target.value)} className={inputClass}><option value="single">Single deck</option><option value="double">Double deck</option></select></label>
                        {renderTextField("passengerCapacity", "Passenger capacity", "number", false, { min: 1, step: 1 })}{renderTextField("seatCount", "Seat count", "number", false, { min: 0, step: 1 })}{renderTextField("berthCount", "Berth count", "number", false, { min: 0, step: 1 })}{renderTextField("totalSeats", "Total seats / berths", "number", false, { min: 1, step: 1 })}
                    </>)}

                    {renderSection("Exterior & Interior Photos", "Choose photos for the vehicle record.", <>
                        {[["exteriorPhotos", "Exterior photos"], ["interiorPhotos", "Interior photos"]].map(([name, label]) => <div key={name}>
                            <label className={labelClass}>{label}<span className="mt-1.5 flex min-h-12 items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-500"><Upload size={16} /><input type="file" accept="image/*" multiple className="min-w-0 flex-1 text-xs" onChange={(event) => updateField(name, [...form[name], ...Array.from(event.target.files || [])])} /></span></label>
                            {form[name].length > 0 && <ul className="mt-2 space-y-1">{form[name].map((file, index) => <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-2 rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-600"><span className="truncate">{file.name}</span><button type="button" aria-label={`Remove ${file.name}`} onClick={() => updateField(name, form[name].filter((_, fileIndex) => fileIndex !== index))} className="shrink-0 rounded p-1 text-slate-500 hover:bg-white hover:text-rose-600"><X size={14} /></button></li>)}</ul>}
                        </div>)}
                    </>)}

                    {renderSection("Required Documents", "Add document numbers and dates, then attach a scanned copy or photo.", documentSections.map((section) => (
                        <div key={section.key} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:col-span-2 lg:col-span-3">
                            <h3 className="mb-3 text-sm font-semibold text-slate-800">{section.title}</h3>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {section.fields.map(([name, label, type]) => type === "date" ? (
                                    <CustomDatePicker key={name} label={label} name={name} value={form[section.key][name]} required={name === "expiryDate" && DOCUMENTS_REQUIRING_EXPIRY.has(section.key)} min={name === "expiryDate" && DOCUMENTS_REQUIRING_EXPIRY.has(section.key) ? tomorrowDate() : undefined} onChange={(event) => updateDocument(section.key, name, event.target.value)} />
                                ) : (
                                    <label key={name} className={labelClass}>{label}<input type={type} value={form[section.key][name]} onChange={(event) => updateDocument(section.key, name, event.target.value)} className={inputClass} /></label>
                                ))}
                                <div>
                                    <label className={labelClass}>Document file{REQUIRED_DOCUMENT_KEYS.has(section.key) && <span className="text-rose-600"> *</span>}<input type="file" required={REQUIRED_DOCUMENT_KEYS.has(section.key) && !form[section.key].file} accept="image/*,.pdf" onChange={(event) => updateDocument(section.key, "file", event.target.files?.[0] || null)} className={`${inputClass} file:mr-2 file:rounded file:border-0 file:bg-teal-50 file:px-2 file:py-1 file:text-xs file:font-medium file:text-teal-700`} /></label>
                                    {form[section.key].file && <div className="mt-2 flex items-center justify-between gap-2 rounded-md bg-white px-2 py-1 text-xs text-slate-600"><span className="truncate">{form[section.key].file.name}</span><button type="button" aria-label={`Remove ${form[section.key].file.name}`} onClick={() => updateDocument(section.key, "file", null)} className="shrink-0 rounded p-1 text-slate-500 hover:bg-slate-50 hover:text-rose-600"><X size={14} /></button></div>}
                                </div>
                            </div>
                        </div>
                    )))}

                    {renderSection("Operations & Maintenance", "Keep depot, mileage, service, and tracking details up to date.", <>
                        {renderTextField("depo", "Depot")}{renderTextField("odometer", "Odometer reading", "number", false, { min: 0, step: "any" })}{renderTextField("lastServiceDate", "Last service date", "date")}{renderTextField("nextServiceDate", "Next service date", "date")}{renderTextField("gpsDeviceIdentifier", "GPS device identifier")}
                        <label className={`${labelClass} sm:col-span-2 lg:col-span-3`}>Description<textarea maxLength={1000} value={form.description} onChange={(event) => updateField("description", event.target.value)} rows={3} className={inputClass} /></label>
                    </>)}

                    {renderSection("Amenities", "Select the facilities available on this bus.", <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-3">{AMENITIES.map(([value, label]) => <label key={value} className={`cursor-pointer rounded-full border px-3 py-2 text-xs transition ${form.amenities.includes(value) ? "border-teal-600 bg-teal-50 text-teal-800" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}><input type="checkbox" className="sr-only" checked={form.amenities.includes(value)} onChange={() => updateField("amenities", form.amenities.includes(value) ? form.amenities.filter((item) => item !== value) : [...form.amenities, value])} />{label}</label>)}</div>)}

                    {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
                    <div className="flex flex-col-reverse justify-between gap-3 pb-8 sm:flex-row"><button type="button" onClick={() => navigate("/vendor/bus-management")} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"><ArrowLeft size={16} />Cancel</button><button type="submit" disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0E7A88] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0d6f7b] disabled:cursor-wait disabled:opacity-60">{isSaving ? "Saving bus details..." : "Continue to seat layout"}<ArrowRight size={16} /></button></div>
                </form>
            </main>
        </div>
    );
};

export default BusDetailsPage;
