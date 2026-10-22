import { Check } from "lucide-react";

const steps = ["Bus Details", "Deck Setup", "Rows & Arrangement", "Review & Save"];

const BusFlowStepper = ({ currentStep }) => (
    <nav aria-label="Bus creation progress" className="mb-6 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <ol className="flex items-center justify-between gap-2">
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isComplete = stepNumber < currentStep;
                const isCurrent = stepNumber === currentStep;
                return (
                    <li key={step} className="flex min-w-0 flex-1 items-center gap-2">
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${isComplete ? "bg-emerald-100 text-emerald-700" : isCurrent ? "bg-teal-700 text-white" : "bg-slate-100 text-slate-500"}`}>
                            {isComplete ? <Check size={13} /> : String(stepNumber).padStart(2, "0")}
                        </span>
                        <span className={`truncate text-[10px] font-medium sm:text-xs ${isCurrent ? "text-teal-800" : isComplete ? "text-slate-800" : "text-slate-400"}`}>{step}</span>
                        {index < steps.length - 1 && <span className={`h-px min-w-2 flex-1 ${isComplete ? "bg-emerald-300" : "bg-slate-200"}`} />}
                    </li>
                );
            })}
        </ol>
    </nav>
);

export default BusFlowStepper;
