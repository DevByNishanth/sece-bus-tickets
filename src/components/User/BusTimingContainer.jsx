import React from 'react';
import { Bus } from 'lucide-react';

/**
 * BusTimingContainer Component
 * 
 * Displays the journey timeline (departure, duration visual graphic, arrival).
 * Pure reusable component for use in BusListingCard, BusDetails, BusRoute, etc.
 * 
 * @param {Object} props
 * @param {Object} props.bus - Bus information object
 * @param {string} [props.className=''] - Optional additional CSS classes
 */
export default function BusTimingContainer({ bus, className = '' }) {
  if (!bus) return null;

  return (
    <div
      className={`flex-1 flex items-center justify-between sm:justify-start gap-3 sm:gap-10 ${className}`}
    >
      {/* Departure */}
      <div>
        <div className="text-1xl sm:text-2xl font-semibold text-slate-900 tracking-tight leading-none">
          {bus.departureTime}
        </div>
        <div className="text-sm font-semibold text-slate-800 mt-1">
          {bus.departureCity}
        </div>
        <div className="text-xs text-slate-400 font-medium">
          {bus.departurePoint}
        </div>
      </div>

      {/* Center Graphic */}
      <div className="flex-1 max-w-[240px] lg:max-w-[400px] hidden sm:flex flex-col items-center px-2">
        <div className="relative w-full flex items-center justify-center">
          {/* Start Dot */}
          <div className="w-2.5 h-2.5 rounded-full border-2 border-[#0A6A69] bg-white z-10 shrink-0" />

          {/* Dashed line left */}
          <div className="flex-1 border-t-2 border-dashed border-slate-300 mx-1" />

          {/* Center Badge */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#EBF7F5] z-10 shrink-0">
            <Bus size={13} className="text-[#0A6A69]" />
            <span className="text-xs font-bold text-[#0A6A69]">
              {bus.duration}
            </span>
          </div>

          {/* Dashed line right */}
          <div className="flex-1 border-t-2 border-dashed border-slate-300 mx-1" />

          {/* End Dot */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#0A6A69] z-10 shrink-0" />
        </div>

        <span className="text-[11px] font-medium text-slate-400 mt-1">
          {bus.isNonStop ? 'Direct Non-Stop' : '1 Stop'}
        </span>
      </div>

      {/* Mobile-only duration badge */}
      <div className="sm:hidden flex flex-col items-center px-2">
        <span className="text-xs font-bold text-[#0A6A69] bg-[#EBF7F5] px-2 py-0.5 rounded-md">
          {bus.duration}
        </span>
        <span className="text-[10px] text-slate-400 mt-0.5">Non-stop</span>
      </div>

      {/* Arrival */}
      <div className="text-right sm:text-left border-r border-slate-100 pr-5">
        <div className="text-1xl sm:text-2xl font-semibold text-slate-900 tracking-tight leading-none">
          {bus.arrivalTime}
        </div>
        <div className="text-sm font-semibold text-slate-800 mt-1">
          {bus.arrivalCity}
        </div>
        <div className="text-xs text-slate-400 font-medium">
          {bus.droppingPoint}
        </div>
      </div>
    </div>
  );
}
