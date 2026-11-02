import React from 'react';
import { Check } from 'lucide-react';

export default function SeatStatusDisplay() {
  return (
    <div className="w-full bg-white/80 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#EDFAF5]/70 via-[#F7FCF9] to-white">
      {/* Left: Step Tag & Title */}
      <div>
        <span className="inline-block text-[11px] font-bold tracking-wider uppercase text-[#0F766E] bg-teal-50 border border-teal-200/60 px-2.5 py-0.5 rounded-full mb-1">
          STEP 1 OF 4
        </span>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
          Select your seats
        </h2>
      </div>

      {/* Right: Legend Items */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs font-medium text-slate-600">
        {/* Available */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-7 rounded border-2 border-slate-300 bg-white flex flex-col items-center pt-0.5 shadow-2xs">
            <div className="w-3 h-1 rounded-xs border border-slate-300 bg-slate-50" />
          </div>
          <span>Available</span>
        </div>

        {/* Female only */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-7 rounded border-2 border-[#FF7FCB] bg-rose-50/30 flex flex-col items-center pt-0.5 shadow-2xs">
            <div className="w-3 h-1 rounded-xs border border-[#FF7FCB] bg-rose-100/40" />
          </div>
          <span className="text-[#FF7FCB] font-semibold">Female only</span>
        </div>

        {/* Male only */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-7 rounded border-2 border-[#6366F1] bg-indigo-50/30 flex flex-col items-center pt-0.5 shadow-2xs">
            <div className="w-3 h-1 rounded-xs border border-[#6366F1] bg-indigo-100/40" />
          </div>
          <span className="text-[#6366F1] font-semibold">Male only</span>
        </div>

        {/* Selected */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-7 rounded border-2 border-[#0F766E] bg-[#0F766E] flex flex-col items-center justify-center text-white shadow-2xs">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="text-slate-900 font-semibold">Selected</span>
        </div>

        {/* Booked / Held */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-7 rounded border border-slate-300 bg-[#CBD5E1] flex flex-col items-center pt-0.5 opacity-80" />
          <span className="text-slate-400">Booked / Held</span>
        </div>
      </div>
    </div>
  );
}
