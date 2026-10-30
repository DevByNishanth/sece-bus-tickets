import {
    ChevronRight,
    X,
    ArrowRight,
    ArrowLeft,
    Check,
    Info,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VendorNavbar from "./VendorNavbar";
import busSeatBuilderImg from "../../assets/bus-seat-layout-img.svg";
import seatLayoutImg from "../../assets/seatLayoutImg.svg";
import singleDeck from "../../assets/singleDeck.svg";
import doubleDeck from "../../assets/doubleDeck.svg";
import BusFlowStepper from "./BusManagement/BusFlowStepper";

const SeatGenerationPage = () => {
    const navigate = useNavigate();
    const { busId } = useParams();
    const [busTypeModal, setBusTypeModal] = useState(false);

    //   data
    const [busType, setBusType] = useState(() => {
        try {
            return JSON.parse(window.localStorage.getItem(`bus-details-draft-${busId}`) || "null")?.deckConfiguration || "double";
        } catch {
            return "double";
        }
    });

    const handleContinue = () => {
        navigate(`/vendor/seatGeneration/${busId}/deckSelection/${busType}`);
    };

    return (
        <>
            <div className="main-container min-h-screen bg-[#f7f9fa]">
                <VendorNavbar />

                {/* header  */}
                <header className="w-[94%] m-auto mt-3">
                    <div className="flex items-center justify-between gap-3">
                        <h1 className="text-xl font-semibold text-gray-800">Fleet Management</h1>
                        <button type="button" onClick={() => navigate(`/vendor/buses/new?draftId=${encodeURIComponent(busId)}`)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"><ArrowLeft size={16} />Back to bus details</button>
                    </div>

                    {/* Breadcrumb Navigation */}
                    {/* <nav className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <a href="#" className="transition-colors hover:text-gray-800">
                            Fleet
                        </a>

                        <ChevronRight size={12} className="text-gray-400" />

                        <a href="#" className="transition-colors hover:text-gray-800">
                            My Buses
                        </a>

                        <ChevronRight size={12} className="text-gray-400" />

                        <span>Bus details</span>

                        <ChevronRight size={12} className="text-gray-400" />

                        <span className="font-medium text-gray-900">Deck setup</span>
                    </nav> */}
                </header>

                <div className="mx-auto mt-4 w-[94%] "><BusFlowStepper currentStep={2} /></div>

                {/* content  */}
                <div className="btn-body-container flex flex-col items-center justify-center w-[94%] mx-auto min-h-[calc(100vh-240px)]">
                    <div className="content-container w-fit text-center">
                        {/* Illustration */}
                        <img
                            src={busSeatBuilderImg}
                            className="w-[400px] h-[200px] object-contain"
                        />

                        {/* Heading Section */}
                        <div className="mt-8">
                            <p className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[#07899a]">
                                Custom Layout Builder
                            </p>

                            <h1 className="mt-2 text-[24px] font-semibold leading-tight tracking-tight text-[#1b2d3c]">
                                Create Your Seat Layout <span className="text-rose-600" aria-label="required">*</span>
                            </h1>

                            <p className="mt-1 text-[10px] leading-[17px] text-[#71869a] sm:text-[11px]">
                                Choose your bus structure and configure seats and sleeper berths
                                <br className="hidden sm:block" /> with a live preview.
                            </p>
                        </div>

                        {/* Select Bus Button */}
                        <button
                            type="button"
                            onClick={() => setBusTypeModal(true)}
                            className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#0E7A88] px-3 py-2 text-[14px] font-medium text-white transition-colors hover:bg-[#0d6f7b] focus:outline-none focus:ring-2 focus:ring-[#108392] focus:ring-offset-2"
                        >
                            <img src={seatLayoutImg} />
                            Select Bus Type
                        </button>
                    </div>
                </div>
            </div>

            {/* modal  */}
            {busTypeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-[4px] p-4">
                    <div className="w-[50%] overflow-hidden rounded-xl bg-white shadow-xl">
                        {/* Header */}
                        <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Select Bus Type
                                </h2>
                                <p className=" text-[11px] text-gray-500">
                                    Choose the structure for your seat layout.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setBusTypeModal(false)}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Bus Type Options */}
                        <div className="grid grid-cols-2 gap-3 px-5 py-5">
                            {/* Single Deck */}
                            <div
                                onClick={() => setBusType("single")}
                                className={`cursor-pointer rounded-xl border p-3 transition ${busType === "single"
                                    ? "border-2 border-[#078b9b]"
                                    : "border-gray-200"
                                    }`}
                            >
                                {/* Radio */}
                                <div className="relative">
                                    <div className="flex items-center justify-center rounded-md bg-[#f0f7f8]">
                                        <img src={singleDeck} />
                                    </div>

                                    <div className="absolute -right-1 bg-white -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#078b9b] bg-white">
                                        {busType === "single" && (
                                            <div className="h-2 w-2 rounded-full bg-[#078b9b]" />
                                        )}
                                    </div>
                                </div>

                                <h3 className="mt-3 text-[14px] font-semibold text-gray-900">
                                    Single Deck
                                </h3>
                                <p className="mt-1 text-[11px] text-gray-500">
                                    Configure one passenger deck.
                                </p>

                                <p className="mt-3 flex items-center gap-1 text-[11px] font-medium text-[#078b9b]">
                                    {busType === "single" ? (
                                        <>
                                            <Check size={12} /> Selected
                                        </>
                                    ) : (
                                        "Select structure"
                                    )}
                                </p>
                            </div>

                            {/* Double Deck */}
                            <div
                                onClick={() => setBusType("double")}
                                className={`cursor-pointer rounded-xl border p-3 transition ${busType === "double"
                                    ? "border-2 border-[#078b9b]"
                                    : "border-gray-200"
                                    }`}
                            >
                                {/* Radio */}
                                <div className="relative">
                                    <div className="flex items-center justify-center rounded-md bg-[#f0f7f8]">
                                        <img src={doubleDeck} alt="double-deck" />
                                    </div>

                                    <div
                                        className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border ${busType === "double"
                                            ? "border-[#078b9b]"
                                            : "border-gray-300"
                                            } bg-white`}
                                    >
                                        {busType === "double" && (
                                            <div className="h-2 w-2 rounded-full bg-[#078b9b]" />
                                        )}
                                    </div>
                                </div>

                                <h3 className="mt-3 text-[14px] font-semibold text-gray-900">
                                    Double Deck
                                </h3>
                                <p className="mt-1 text-[11px] text-gray-500">
                                    Configure upper and lower passenger decks independently.
                                </p>

                                <p className="mt-3 text-[11px] font-medium text-[#078b9b]">
                                    {busType === "double" ? (
                                        <span className="flex items-center gap-1">
                                            <Check size={12} /> Selected
                                        </span>
                                    ) : (
                                        "Select structure"
                                    )}
                                </p>
                            </div>

                            {/* Info Message */}
                            <div className="col-span-2 flex items-center gap-2 rounded-lg border border-[#e5f0f2] bg-[#f1f8f9] px-3 py-2.5">
                                <Info size={15} className="shrink-0 text-[#078b9b]" />
                                <p className="text-[11px] text-gray-600">
                                    You can configure seating and sleeper arrangements
                                    independently after choosing the structure.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-3">
                            <button
                                type="button"
                                className="rounded-md border border-gray-200 px-4 py-2 text-[12px] text-gray-600 hover:bg-gray-50"
                                onClick={() => setBusTypeModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-md bg-[#087F8C] px-4 py-2 text-[12px] font-medium text-white hover:bg-[#067582]"
                                onClick={handleContinue}
                            >
                                Continue
                                <ArrowRight size={13} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SeatGenerationPage;
