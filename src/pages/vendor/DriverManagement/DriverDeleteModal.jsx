import { useState } from "react";
import { X, Trash2, AlertTriangle, UserRound } from "lucide-react";

const DriverDeleteModal = ({ onClose }) => {
    const onConfirm = ""
    const driver = ""

    // states 
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (onConfirm) {
            setIsDeleting(true);

            try {
                await onConfirm(driver);
                onClose();
            } catch (error) {
                console.error("Failed to delete driver:", error);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <>
            {/* Background overlay */}
            <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[3px]"
                onClick={onClose}
            />

            {/* Delete confirmation modal */}
            <div className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-32px)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                            <Trash2 size={20} className="text-red-600" />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Delete Driver
                            </h2>

                            <p className="text-xs text-slate-500">
                                Confirm driver deletion
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
                        aria-label="Close modal"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Warning message */}
                    <div className="flex gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                        <AlertTriangle
                            size={20}
                            className="mt-0.5 shrink-0 text-red-600"
                        />

                        <div>
                            <h3 className="text-sm font-semibold text-red-800">
                                Are you sure you want to delete this driver?
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-red-700">
                                This action may permanently remove the driver's
                                information. Please confirm before continuing.
                            </p>
                        </div>
                    </div>

                    {/* Driver details */}
                    {driver && (
                        <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-700">
                                {driver.initials || (
                                    <UserRound size={18} />
                                )}
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-800">
                                    {driver.name || "Driver"}
                                </h3>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    {driver.id ? `Driver ID: ${driver.id}` : "Driver details"}
                                </p>
                            </div>
                        </div>
                    )}

                    <p className="mt-4 text-xs text-slate-500">
                        This action cannot be undone.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Trash2 size={15} />

                        {isDeleting ? "Deleting..." : "Delete Driver"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default DriverDeleteModal;
