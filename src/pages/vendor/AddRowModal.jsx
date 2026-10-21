import { useEffect, useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import seatConfig from '../../assets/seatConfig.svg'

const AddRowModal = ({
    isOpen,
    onClose,
    deckType = "lower",
    side = "driverSide",
    rowCount = 1,
    componentType = "seats",
    componentSubtype = "Double Seater",
    units = 1,
    availableComponents = ["seats", "sleepers"],
    onRowCountChange,
    onComponentTypeChange,
    onComponentSubtypeChange,
    onUnitsChange,
    onSubmit,
}) => {

    // states 
    const [activeTab, setActiveTab] = useState("Seat");

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") onClose?.();
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = (event) => {
        event.preventDefault();

        onSubmit?.({
            deckType,
            side,
            rowCount,
            componentType,
            componentSubtype,
            units,
        });
    };

    const componentOptions = {
        seats: ["Single Seater", "Double Seater", "Triple Seater"],
        sleepers: ["Single Sleeper", "Double Sleeper"],
    };
    const deckLabel = deckType === "upper" ? "Upper Deck" : "Lower Deck";
    const sideLabel = side === "driverSide" ? "Driver Side" : "Opposite Side";

    return (
        <div className="fixed inset-0 z-50">
            {/* Background overlay */}
            <div
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Right-side modal */}
            <aside
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-row-title"
                className="fixed right-0 top-0 flex h-screen w-full max-w-lg flex-col bg-white shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                    <div>
                        <h2
                            id="add-row-title"
                            className="text-xl font-semibold text-slate-900"
                        >
                            Add Row
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {deckLabel} · {sideLabel}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form content */}
                <form
                    id="add-row-form"
                    onSubmit={handleSubmit}
                    className="flex flex-1 flex-col overflow-hidden"
                >
                    <div className="flex-1 space-y-6 overflow-y-auto p-6 ">
                        {/* Deck and side */}
                        <section className="border border-[#cae4e6] rounded-lg bg-[#fafdfd] p-3 flex items-center justify-between ">
                            <div className="header">
                                <h3 className="mb-2 text-md font-medium text-[#087F8C] ">
                                    {deckLabel}
                                </h3>

                                <h1>{sideLabel} Configuration</h1>
                            </div>
                            <img src={seatConfig} />
                        </section>

                        <div className="w-full">
                            <h3 className="mb-2 text-md font-medium text-slate-900">
                                Component type
                            </h3>

                            <div className="flex w-full rounded-lg bg-slate-100 p-1.5">
                                {["Seat", "Sleeper"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 rounded-xl py-2 text-md font-medium transition-all duration-200 ${activeTab === tab
                                            ? "border border-slate-200 bg-white text-teal-700 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                      
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <Plus size={16} />
                            Add Row
                        </button>
                    </div>
                </form>
            </aside>
        </div>
    );
};

export default AddRowModal;
