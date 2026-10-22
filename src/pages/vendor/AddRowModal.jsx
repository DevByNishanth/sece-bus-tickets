import { useEffect, useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import seatConfig from '../../assets/seatConfig.svg'
import seat from "../../assets/seat.svg";

const seatTypes = [
    { id: "single", label: "Single", count: 1 },
    { id: "double", label: "Double", count: 2 },
    { id: "triple", label: "Triple", count: 3 },
];
const sleeperTypes = [
    { id: "single", label: "Single", count: 1 },
    { id: "double", label: "Double", count: 2 },
];

const AddRowModal = ({
    isOpen,
    onClose,
    deckType = "lower",
    side = "driverSide",
    rowCount = 1,
    existingRowCount = 0,
    componentType = "seats",
    componentSubtype = "Double Seater",
    availableSeatTypes = ["Single Seater", "Double Seater", "Triple Seater"],
    availableSleeperTypes = ["Single Sleeper", "Double Sleeper"],
    units = 1,
    availableComponents = ["seats", "sleepers"],
    onRowCountChange,
    onComponentTypeChange,
    onComponentSubtypeChange,
    onUnitsChange,
    onSubmit,
}) => {

    // states 

    const [activeTab, setActiveTab] = useState(componentType === "sleepers" ? "Sleeper" : "Seat");
    const [selectedConfigurations, setSelectedConfigurations] = useState([componentSubtype]);
    const [insertionPosition, setInsertionPosition] = useState("end");
    const [rowPosition, setRowPosition] = useState(1);

    useEffect(() => {
        if (!isOpen) return;
        setActiveTab(componentType === "sleepers" ? "Sleeper" : "Seat");
        setSelectedConfigurations([componentSubtype]);
        setInsertionPosition("end");
        setRowPosition(1);
    }, [isOpen, componentType, componentSubtype]);

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
            componentType: activeComponent,
            componentSubtypes: selectedConfigurations,
            units,
            insertionPosition,
            rowPosition: Number(rowPosition),
        });
    };

    const activeComponent = activeTab === "Seat" ? "seats" : "sleepers";
    const componentOptions = activeComponent === "seats" ? availableSeatTypes : availableSleeperTypes;
    const visibleOptions = seatTypes.filter((type) =>
        componentOptions.includes(`${type.label} ${activeComponent === "seats" ? "Seater" : "Sleeper"}`),
    );
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
                <div className="flex items-start justify-between border-b border-slate-200 px-6 py-2">
                    <div>
                        <h2
                            id="add-row-title"
                            className="text-lg font-semibold text-slate-900"
                        >
                            Add Row
                        </h2>

                        <p className="text-sm text-slate-500">
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
                    <div className="flex-1 space-y-3 overflow-y-auto p-4 ">


                        {/* Deck and side */}
                        <section className="border border-[#cae4e6] rounded-lg bg-[#fafdfd] p-2 flex items-center justify-between ">
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
                                        type="button"
                                        disabled={!availableComponents.includes(tab === "Seat" ? "seats" : "sleepers")}
                                        onClick={() => {
                                            setActiveTab(tab);
                                            setSelectedConfigurations([]);
                                        }}
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

                        <div className="w-full">
                            <h3 className="mb-2 text-md font-medium text-slate-900">
                                Seat configuration
                            </h3>

                            <div className="flex w-full gap-3">
                                {visibleOptions.map((type) => {
                                    const configuration = `${type.label} ${activeComponent === "seats" ? "Seater" : "Sleeper"}`;
                                    const isSelected = selectedConfigurations.includes(configuration);

                                    return (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setSelectedConfigurations((current) =>
                                                current.includes(configuration)
                                                    ? current.filter((item) => item !== configuration)
                                                    : [...current, configuration],
                                            )}
                                            aria-pressed={isSelected}
                                            className={`relative flex h-[116px] flex-1 flex-col items-center justify-center gap-6 rounded-xl border-2 transition-all duration-200
                                                         ${isSelected
                                                    ? "border-teal-600"
                                                    : "border-slate-200 hover:border-gray-400"
                                                }`}
                                        >
                                            {/* Selection indicator */}
                                            <span
                                                className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border
                                                 ${isSelected
                                                        ? "border-teal-800 bg-teal-800 text-white"
                                                        : "border-slate-300 bg-white"
                                                    }`}
                                            >
                                                {isSelected && (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        className="h-3 w-3"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="m5 12 4 4L19 6"
                                                        />
                                                    </svg>
                                                )}
                                            </span>

                                            {/* Seat icons */}
                                            <div className="flex items-center justify-center gap-2">
                                                {Array.from({ length: type.count }).map((_, index) => (
                                                    <img
                                                        key={index}
                                                        src={seat}
                                                        alt=""
                                                        className="h-6 w-6 object-contain"
                                                    />
                                                ))}
                                            </div>

                                            {/* Seat type label */}
                                            <span className="text-xs font-semibold text-slate-900">
                                                {type.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="">
                            <label htmlFor="insertion-position" className="mb-2 block text-sm font-semibold text-slate-900">
                                Insertion position
                            </label>
                            <select
                                id="insertion-position"
                                value={insertionPosition}
                                onChange={(event) => setInsertionPosition(event.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-100"
                            >
                                <option value="before">Insert before row</option>
                                <option value="after">Insert after row</option>
                                <option value="start">Start</option>
                                <option value="end">End</option>
                            </select>
                        </div>

                        {(insertionPosition === "before" || insertionPosition === "after") && (
                            <div>
                                <label htmlFor="row-position" className="mb-2 block text-sm font-semibold text-slate-900">
                                    Row position
                                </label>
                                <input
                                    id="row-position"
                                    type="number"
                                    min="1"
                                    max={existingRowCount || 1}
                                    value={rowPosition}
                                    onChange={(event) => setRowPosition(event.target.value)}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-100"
                                    required
                                />
                            </div>
                        )}


                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-slate-300 px-4 py-2.5 cursor-pointer text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={selectedConfigurations.length === 0}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#087F8C] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#046f7a] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
