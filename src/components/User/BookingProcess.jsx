import React from 'react';
import { ArrowLeft, Calendar, User, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BookingProcess({
  from = 'Chennai',
  to = 'Coimbatore',
  date = 'Saturday, 24 May',
  passengers = '1 Traveller (All seats)',
  currentStep = 1,
  onStepChange,
  onBack
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const steps = [
    { number: 1, label: 'Seats' },
    { number: 2, label: 'Passengers Details' },
    { number: 3, label: 'Payment' },
    { number: 4, label: 'Ticket' }
  ];

  return (
    <div className="w-full">
      {/* Top Breadcrumb & Route info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-2">
        {/* Left Side: Back button + Route details */}
        <div>
          <button
            onClick={handleBack}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors mb-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to search</span>
          </button>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              {from}
            </h1>
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-[#0F766E]">
              to
            </span>
            <h1 className="text-xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              {to}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500 font-medium mt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              {date}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" />
              {passengers}
            </span>
          </div>
        </div>

        {/* Right Side: Step Progress Indicators */}
        <div className="self-start lg:self-center">
          <nav aria-label="Booking steps" className="inline-flex items-center bg-white/90 backdrop-blur-sm border border-slate-200/90 rounded-full p-1.5 shadow-xs">
            {steps.map((step, idx) => {
              const isActive = step.number === currentStep;
              const isCompleted = step.number < currentStep;

              return (
                <button
                  key={step.number}
                  onClick={() => onStepChange && onStepChange(step.number)}
                  disabled={step.number > currentStep + 1}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#0F766E] text-white shadow-xs font-semibold'
                      : isCompleted
                      ? 'text-[#0F766E] hover:bg-teal-50 cursor-pointer'
                      : 'text-slate-500 hover:text-slate-700 disabled:opacity-60 disabled:cursor-not-allowed'
                  }`}
                >
                  <span
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${
                      isActive
                        ? 'bg-white text-[#0F766E]'
                        : isCompleted
                        ? 'bg-teal-100 text-[#0F766E]'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {step.number}
                  </span>
                  <span className="whitespace-nowrap">{step.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
