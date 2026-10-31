import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, ArrowLeft, Check, Save, CheckCircle2, X, BusFront, Route } from "lucide-react";
import VendorNavbar from "../VendorNavbar";
import BusFlowStepper from "./BusFlowStepper";

const readJson = (key) => {
    try {
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch {
        return null;
    }
};

const getLayoutCapacity = (layout, componentType) => {
    if (!layout) return 0;
    const decks = [layout.lowerDeck, layout.upperDeck].filter(Boolean);
    return decks.reduce((total, deck) => {
        const sides = [deck.driverSide, deck.oppositeSide].filter(Boolean);
        return total + sides.reduce((sideTotal, side) => sideTotal + (side.rows || []).reduce(
            (rowTotal, row) => rowTotal + (row.componentType === componentType ? Number(row.passengerCapacity || 0) : 0),
            0,
        ), 0);
    }, 0);
};

const toFile = (savedFile) => {
    if (!savedFile?.data) return null;
    const [metadata, data] = savedFile.data.split(",");
    const mimeType = metadata.match(/data:(.*?);/)?.[1] || savedFile.type || "application/octet-stream";
    const bytes = Uint8Array.from(atob(data), (character) => character.charCodeAt(0));
    return new File([bytes], savedFile.name || "upload", { type: mimeType });
};

const toApiSeatLayout = (layout) => ({
    deckCount: layout.deckType === "double" ? 2 : 1,
    decks: [layout.lowerDeck, ...(layout.deckType === "double" ? [layout.upperDeck] : [])]
        .filter(Boolean)
        .map((deck, index) => ({
            deck: index === 0 ? "lower" : "upper",
            rows: [
                ...(deck.driverSide?.rows || []).map((row) => ({ ...row, side: "driver" })),
                ...(deck.oppositeSide?.rows || []).map((row) => ({ ...row, side: "opposite" })),
            ],
        })),
});

const BusReviewPage = () => {
    const { busId } = useParams();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const busDetails = readJson(`bus-details-draft-${busId}`);
    const seatLayout = readJson(`bus-layout-draft-${busId}`);
    const finalPayload = useMemo(() => busDetails && seatLayout ? {
        ...busDetails,
        busId,
        deckConfiguration: seatLayout.deckType,
        passengerCapacity: Number(busDetails.passengerCapacity || seatLayout.totalPassengerCapacity || 0),
        seatCount: Number(busDetails.seatCount || getLayoutCapacity(seatLayout, "seats")),
        berthCount: Number(busDetails.berthCount || getLayoutCapacity(seatLayout, "sleepers")),
        totalSeats: Number(busDetails.totalSeats || seatLayout.totalPassengerCapacity || 0),
        seatLayout,
    } : null, [busDetails, busId, seatLayout]);

    useEffect(() => {
        if (!showSuccessModal) return undefined;
        const timeout = window.setTimeout(() => navigate("/vendor/bus-management", { replace: true }), 7000);
        return () => window.clearTimeout(timeout);
    }, [showSuccessModal, navigate]);

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        navigate("/vendor/bus-management", { replace: true });
    };

    const saveBus = async () => {
        if (!finalPayload || isSaving) return;
        setIsSaving(true);
        setSaveError("");
        try {
            const payload = { ...finalPayload };
            const formData = new FormData();
            const documents = {
                rcDoc: busDetails.rcDoc?.file,
                insurance: busDetails.insurance?.file,
                fitness: busDetails.fitness?.file,
                permit: busDetails.permit?.file,
                puc: busDetails.puc?.file,
                roadTax: busDetails.roadtax?.file,
            };
            payload.seatLayout = toApiSeatLayout(seatLayout);
            payload.amenities = busDetails.amenities || [];
            for (const key of ["busId", "rcDoc", "insurance", "fitness", "permit", "puc", "roadtax", "exteriorPhotos", "interiorPhotos"]) delete payload[key];
            for (const [key, value] of Object.entries(payload)) {
                if (value === null || value === undefined || value === "") continue;
                if (key === "amenities") {
                    value.forEach((amenity) => formData.append("amenities", amenity));
                } else {
                    formData.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
                }
            }
            for (const [field, savedFile] of Object.entries(documents)) {
                const file = toFile(savedFile);
                if (file) formData.append(field, file);
            }
            const documentMetadata = {
                rcDoc: busDetails.rcDoc,
                permit: busDetails.permit,
                insurance: busDetails.insurance,
                fitness: busDetails.fitness,
                puc: busDetails.puc,
                roadTax: busDetails.roadtax,
            };
            for (const [section, fields] of Object.entries(documentMetadata)) {
                for (const [field, value] of Object.entries(fields || {})) {
                    if (field === "file" || value === "" || value === null || value === undefined) continue;
                    formData.append(`${section}[${field}]`, String(value));
                }
            }
            for (const field of ["exteriorPhotos", "interiorPhotos"]) {
                for (const savedFile of busDetails[field] || []) {
                    const file = toFile(savedFile);
                    if (file) formData.append(field, file);
                }
            }

            const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
            if (!baseUrl) throw new Error("VITE_API_BASE_URL is not configured.");
            const token = window.localStorage.getItem("exte_key");
            if (!token) throw new Error("Authentication token was not found. Please sign in again.");
            const response = await fetch(`${baseUrl}/agent/buses`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const responseText = await response.text();
            if (!response.ok) throw new Error(responseText || `Request failed (${response.status}).`);
            window.localStorage.removeItem(`bus-details-draft-${busId}`);
            window.localStorage.removeItem(`bus-layout-draft-${busId}`);
            setShowSuccessModal(true);
        } catch (error) {
            setSaveError(error.message || "Could not save the bus. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const summaryRows = busDetails ? [
        ["Bus", busDetails.busName], ["Operator", busDetails.operatorName], ["Registration", busDetails.registrationNumber],
        ["Fleet code", busDetails.internalFleetCode], ["Vehicle", [busDetails.manufacturer, busDetails.model, busDetails.manufacturingYear].filter(Boolean).join(" ")],
        ["Bus type", busDetails.busType], ["Category", busDetails.category], ["Deck", busDetails.deckConfiguration === "double" ? "Double deck" : "Single deck"],
        ["Passenger capacity", busDetails.passengerCapacity || seatLayout?.totalPassengerCapacity || "Not specified"],
        ["Seat layout capacity", seatLayout?.totalPassengerCapacity ?? "Not created yet"],
        ["Amenities", busDetails.amenities?.length ? busDetails.amenities.join(", ") : "None selected"],
    ] : [];

    return (
        <div className="min-h-screen bg-[#f7f9fa]">
            <VendorNavbar />
            <main className="mx-auto w-[94%] max-w-6xl py-5">
                <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
                    <button type="button" onClick={() => navigate("/vendor/bus-management")} className="hover:text-teal-700">Fleet</button><ChevronRight size={13} />
                    <span>My Buses</span><ChevronRight size={13} /><span className="font-medium text-slate-900">Review &amp; Save</span>
                </nav>
                <BusFlowStepper currentStep={4} />
                <h1 className="text-xl font-semibold text-slate-900">Review bus details</h1>
                <p className="mt-1 text-sm text-slate-500">Check the bus information and seat layout before saving.</p>

                {!busDetails && <div role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">Bus details could not be found. Start again by adding a bus.</div>}
                {busDetails && <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <h2 className="mb-4 text-base font-semibold text-slate-900">Bus summary</h2>
                    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{summaryRows.map(([label, value]) => <div key={label} className="border-b border-slate-100 pb-3"><dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 text-sm font-medium text-slate-800">{value || "Not provided"}</dd></div>)}</dl>
                    <div className={`mt-5 flex items-start gap-2 rounded-xl border p-3 text-xs ${seatLayout ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
                        {seatLayout ? <Check size={15} /> : null}{seatLayout ? "Seat layout is ready to submit with the bus." : "Complete the seat layout before saving the bus."}
                    </div>
                </div>}

                <div className="mt-5 flex flex-col-reverse justify-between gap-3 pb-8 sm:flex-row">
                    <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"><ArrowLeft size={16} />Back to seat layout</button>
                    <button type="button" disabled={!finalPayload || isSaving} onClick={saveBus} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0E7A88] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0d6f7b] disabled:cursor-not-allowed disabled:opacity-50"><Save size={16} />{isSaving ? "Saving bus..." : "Save bus"}</button>
                </div>
                {saveError && <p role="alert" className="text-center text-sm text-rose-700">{saveError}</p>}
            </main>
            {showSuccessModal && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" role="presentation">
                <section role="dialog" aria-modal="true" aria-labelledby="bus-success-title" aria-describedby="bus-success-description" className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl">
                    <button type="button" onClick={closeSuccessModal} aria-label="Close success message" className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X size={20} /></button>
                    <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-7 pb-6 pt-9 text-center sm:px-10">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 ring-8 ring-emerald-50"><CheckCircle2 size={43} strokeWidth={1.8} className="text-emerald-600" /></div>
                        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Submission complete</p>
                        <h2 id="bus-success-title" className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Bus submitted successfully</h2>
                        <p id="bus-success-description" className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">Your bus details and documents have been received for review. You can return to Bus Management or continue to Route Management.</p>
                    </div>
                    <div className="space-y-3 border-t border-slate-100 bg-white px-7 py-6 sm:px-10">
                        <button type="button" onClick={() => navigate("/vendor/bus-management", { replace: true })} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0E7A88] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b6975]"><BusFront size={18} />Back to Bus Management</button>
                        <button type="button" onClick={() => navigate("/vendor/root-management", { replace: true })} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50"><Route size={18} className="text-teal-700" />Go to Route Management</button>
                        <p className="pt-1 text-center text-xs text-slate-400">Returning to Bus Management automatically in 7 seconds.</p>
                    </div>
                </section>
            </div>}
        </div>
    );
};

export default BusReviewPage;
