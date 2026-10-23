import { Check } from "lucide-react";

const steps = [
    { id: 1, title: "Route Details" },
    { id: 2, title: "Stops & Sequence" },
    { id: 3, title: "Boarding & Dropping" },
    { id: 4, title: "Review & Publish" },
];

export default function RouteStepper({ activeStep  }) {
    return (
        <div className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
            <div className="flex items-center">
                {steps.map((step, index) => {
                    const isCompleted = step.id < activeStep;
                    const isActive = step.id === activeStep;
                    const isReached = step.id <= activeStep;
                    const isLast = index === steps.length - 1;

                    return (
                        <div
                            key={step.id}
                            className={`flex min-w-0 items-center ${isLast ? "flex-none" : "flex-1"
                                }`}
                        >
                            {/* Step indicator and label */}
                            <div className="flex shrink-0 items-center gap-2">
                                <div
                                    className={`flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-[12px] font-medium transition-colors ${isReached
                                            ? "bg-teal-800 text-white"
                                            : "bg-slate-100 text-slate-500"
                                        }`}
                                >
                                    {isCompleted ? (
                                        <Check size={11} strokeWidth={2.5} />
                                    ) : (
                                        String(step.id).padStart(2, "0")
                                    )}
                                </div>

                                <span
                                    className={`whitespace-nowrap text-[10px] font-medium sm:text-[11px] ${isActive
                                            ? "text-slate-900"
                                            : "text-slate-400"
                                        }`}
                                >
                                    {step.title}
                                </span>
                            </div>

                            {/* Connector line */}
                            {!isLast && (
                                <div
                                    className={`mx-3 h-px flex-1 ${isCompleted
                                            ? "bg-teal-300"
                                            : "bg-slate-200"
                                        }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
