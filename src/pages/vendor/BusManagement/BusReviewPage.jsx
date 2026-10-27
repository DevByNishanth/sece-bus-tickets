import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Download, ArrowLeft, Check } from "lucide-react";
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

const BusReviewPage = () => {
    const { busId } = useParams();
    const navigate = useNavigate();
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

    const downloadPayload = () => {
        const file = new Blob([JSON.stringify(finalPayload, null, 2)], { type: "application/json;charset=utf-8" });
        const url = window.URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.download = `bus-${busId}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
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
                <p className="mt-1 text-sm text-slate-500">Check the bus information and seat layout before exporting the combined payload.</p>

                {!busDetails && <div role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">Bus details could not be found. Start again by adding a bus.</div>}
                {busDetails && <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <h2 className="mb-4 text-base font-semibold text-slate-900">Bus summary</h2>
                    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{summaryRows.map(([label, value]) => <div key={label} className="border-b border-slate-100 pb-3"><dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 text-sm font-medium text-slate-800">{value || "Not provided"}</dd></div>)}</dl>
                    <div className={`mt-5 flex items-start gap-2 rounded-xl border p-3 text-xs ${seatLayout ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
                        {seatLayout ? <Check size={15} /> : null}{seatLayout ? "Seat layout is ready to include in the bus payload." : "Complete the seat layout before downloading the final payload."}
                    </div>
                </div>}

                <div className="mt-5 flex flex-col-reverse justify-between gap-3 pb-8 sm:flex-row">
                    <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"><ArrowLeft size={16} />Back to seat layout</button>
                    <button type="button" disabled={!finalPayload} onClick={downloadPayload} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0E7A88] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0d6f7b] disabled:cursor-not-allowed disabled:opacity-50"><Download size={16} />Download bus payload</button>
                </div>
                <p className="text-center text-xs text-slate-400">No bus-save API is configured yet. This downloads a JSON payload for integration.</p>
            </main>
        </div>
    );
};

export default BusReviewPage;
