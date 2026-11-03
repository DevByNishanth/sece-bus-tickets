
import React from "react";

const steps = [
    "Bus & Journey",
    "Routes & stops",
    "Seat Layout",
    "Pricing",
    "Driver & Crew",
    "Review & Create",
];

const CreateTripStepper = ({ currentStep }) => {
    return (
        <>
            <div className="bg-container sticky top-0 z-10  bg-[#f7f9fa]">
                <div className="w-full rounded-xl border border-gray-100 bg-white px-5 py-3 shadow-sm ">
                    <div className="flex w-full items-center">
                        {steps.map((step, index) => {
                            const stepNumber = index + 1;
                            const isCompleted = stepNumber < currentStep;
                            const isActive = stepNumber === currentStep;

                            return (
                                <React.Fragment key={step}>
                                    <div className="flex shrink-0 items-center gap-2">
                                        <div
                                            className={`flex h-[28px] w-[28px] items-center justify-center rounded-full border text-[11px] font-medium transition-all
                    ${isActive
                                                    ? "border-cyan-600 bg-white text-cyan-700"
                                                    : isCompleted
                                                        ? "border-cyan-600 bg-cyan-600 text-white"
                                                        : "border-gray-200 bg-gray-50 text-gray-400"
                                                }`}
                                        >
                                            {isCompleted ? "✓" : stepNumber}
                                        </div>

                                        <span
                                            className={`whitespace-nowrap text-[12px] transition-colors
                    ${isActive
                                                    ? "font-medium text-cyan-700"
                                                    : isCompleted
                                                        ? "text-cyan-600"
                                                        : "text-gray-400"
                                                }`}
                                        >
                                            {step}
                                        </span>
                                    </div>

                                    {index !== steps.length - 1 && (
                                        <div className="mx-2 h-px min-w-[12px] flex-1 bg-gray-200" />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

            </div>
        </>
    );
};

export default CreateTripStepper;
