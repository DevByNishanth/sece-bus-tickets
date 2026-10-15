import React from 'react';
import { Star, Wifi, Zap, Bus, ArrowRight } from 'lucide-react';

export default function BusListingCard({
  bus,
  onViewSeats,
  onOpenBoardingPoints,
  onOpenCancellation
}) {
  if (!bus) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow relative">
      {/* Top Row: Operator Info & Rating */}
      <div className="flex items-start justify-between gap-4">
        {/* Left: Avatar & Name */}
        <div className="flex items-start gap-3.5">
          <div
            className={`w-11 h-11 rounded-xl ${bus.avatarBg || 'bg-[#E8EEF5]'} ${
              bus.avatarColor || 'text-[#2563EB]'
            } flex items-center justify-center font-bold text-lg shrink-0`}
          >
            {bus.operatorInitial || bus.operatorName?.charAt(0) || 'B'}
          </div>

          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-tight">
                {bus.operatorName}
              </h3>

              {/* Tags */}
              {bus.tags?.map((tag, idx) => {
                if (tag.type === 'fastest') {
                  return (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-[#FEF6EE] text-[#B54708] border border-[#F9DBAF] text-[11px] font-semibold px-2 py-0.5 rounded-md leading-none"
                    >
                      ★ {tag.text}
                    </span>
                  );
                }
                if (tag.type === 'prime') {
                  return (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-[#ECFDF3] text-[#0A6A69] border border-[#A6F4C5] text-[11px] font-semibold px-2 py-0.5 rounded-md leading-none"
                    >
                      ✓ {tag.text}
                    </span>
                  );
                }
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-md leading-none"
                  >
                    {tag.text}
                  </span>
                );
              })}
            </div>

            <p className="text-xs text-slate-500 font-medium mt-1">
              {bus.busType}
            </p>
          </div>
        </div>

        {/* Right: Rating & Reviews */}
        <div className="flex flex-col items-end shrink-0">
          <div className="bg-[#0B735F] text-white px-2.5 py-1 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1 shadow-xs">
            <Star size={12} className="fill-white" />
            <span>{bus.rating?.toFixed(1) || '4.8'}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium text-right mt-1">
            {bus.reviewsCount?.toLocaleString()} reviews
          </span>
        </div>
      </div>

      {/* Amenities Row */}
      <div className="flex items-center flex-wrap gap-2 mt-4">
        {bus.amenities?.includes('Live tracking') && (
          <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5 bg-slate-50 border border-slate-200/70 px-2.5 py-1 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live tracking
          </span>
        )}

        {bus.amenities?.includes('Wi-Fi') && (
          <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5 bg-slate-50 border border-slate-200/70 px-2.5 py-1 rounded-md">
            <Wifi size={13} className="text-slate-500" />
            Wi-Fi
          </span>
        )}

        {bus.amenities?.includes('Blanket') && (
          <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5 bg-slate-50 border border-slate-200/70 px-2.5 py-1 rounded-md">
            <span className="text-[12px]">🛏</span>
            Blanket
          </span>
        )}

        {bus.amenities?.includes('Charging port') && (
          <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5 bg-slate-50 border border-slate-200/70 px-2.5 py-1 rounded-md">
            <Zap size={13} className="text-amber-500" />
            Charging port
          </span>
        )}

        <button
          type="button"
          onClick={() => onOpenBoardingPoints && onOpenBoardingPoints(bus)}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 transition cursor-pointer ml-1"
        >
          +4 more amenities
        </button>
      </div>

      {/* Middle Row: Journey Timeline & Pricing */}
      <div className="mt-6 pt-1 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
        {/* Timeline (Departure - Duration - Arrival) */}
        <div className="flex-1 flex items-center justify-between sm:justify-start gap-3 sm:gap-6">
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
          <div className="flex-1 max-w-[240px] lg:max-w-[280px] hidden sm:flex flex-col items-center px-2">
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
          <div className="text-right sm:text-left">
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

        {/* Price Block */}
        <div className="flex md:flex-col items-baseline md:items-end justify-between md:justify-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            STARTING FROM
          </span>
          <div className="text-1xl sm:text-2xl font-bold text-slate-900">
            ₹{bus.price}
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            per seat
          </span>
        </div>
      </div>

      {/* Bottom Row: Policies, Seats left, and View Seats CTA */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Information Items */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 text-xs">
          {bus.seatsLeft && (
            <span className="text-rose-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
              {bus.seatsLeft} seats left
            </span>
          )}

          {bus.singleSeatsLeft ? (
            <span className="text-slate-500">
              • {bus.singleSeatsLeft} Single Sleeper left
            </span>
          ) : bus.cancellationNote ? (
            <span className="text-slate-500">• {bus.cancellationNote}</span>
          ) : null}

          <span className="hidden sm:inline text-slate-300">|</span>

          <button
            type="button"
            onClick={() => onOpenBoardingPoints && onOpenBoardingPoints(bus)}
            className="text-slate-500 hover:text-slate-800 transition cursor-pointer underline-offset-2 hover:underline"
          >
            Boarding & dropping points
          </button>

          <span className="hidden sm:inline text-slate-300">|</span>

          <button
            type="button"
            onClick={() => onOpenCancellation && onOpenCancellation(bus)}
            className="text-slate-500 hover:text-slate-800 transition cursor-pointer underline-offset-2 hover:underline"
          >
            Cancellation policy
          </button>
        </div>

        {/* Right CTA Button */}
        <div className="w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onViewSeats && onViewSeats(bus)}
            className="w-full sm:w-auto btn-grd hover:bg-[#085453] active:scale-[0.98] transition-all duration-200 text-white font-medium rounded-2xl px-4 py-2.5 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md group"
          >
            <span className="text-[14px] font-semibold tracking-wide">
              View seats
            </span>
            <div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
