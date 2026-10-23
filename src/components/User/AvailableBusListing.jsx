import React from 'react';
import BusListingCard from './BusListingCard';
import TrustGuarantees from './TrustGuarantees';
import { Wifi, Radio, Sparkles } from 'lucide-react';

export default function BusListingCards({
  buses = [],
  sortBy = 'recommended',
  onSortChange,
  onViewSeats,
  onResetFilters,
  loading = false,
  isLive = false
}) {
  const sortOptions = [
    { id: 'recommended', label: 'Recommended' },
    { id: 'departure', label: 'Departure' },
    { id: 'price', label: 'Price' },
    { id: 'fastest', label: 'Fastest' },
    { id: 'rating', label: 'Rating' }
  ];

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Results Header: Count & Sort Bar */}
      <div className="bg-white py-3.5 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#1A7D75] text-lg">
              {loading ? 'Searching buses...' : `${buses.length} buses`}
            </span>
            <span className="text-slate-800 font-semibold text-base">available on this route</span>
            
            {/* Live API badge */}
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-2xs animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Backend API
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200/70 px-2 py-0.5 rounded-full">
                <Sparkles size={11} className="text-[#0F766E]" />
                API Synchronized
              </span>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            <p>All prices include road tolls, taxes & GST</p>
          </div>
        </div>

        {/* Sort Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400">
            Sort:
          </span>
          {sortOptions.map((opt) => {
            const isActive = sortBy === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSortChange && onSortChange(opt.id)}
                className={`text-xs px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer font-medium ${
                  isActive
                    ? 'bg-[#0F766E] text-white font-semibold shadow-xs'
                    : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs animate-pulse"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-200" />
                  <div className="space-y-2">
                    <div className="w-48 h-5 bg-slate-200 rounded" />
                    <div className="w-32 h-3 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="w-12 h-6 bg-slate-200 rounded-lg" />
              </div>
              <div className="h-16 bg-slate-50 rounded-xl" />
              <div className="flex justify-between items-center pt-2">
                <div className="w-40 h-4 bg-slate-100 rounded" />
                <div className="w-28 h-9 bg-slate-200 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : buses.length > 0 ? (
        <div className="space-y-4">
          {buses.map((bus) => (
            <BusListingCard
              key={bus.id}
              bus={bus}
              onViewSeats={onViewSeats}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 text-2xl">
            🚌
          </div>
          <h3 className="text-base font-bold text-slate-800">No buses available for this date</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            We couldn't find any buses on this route for the selected date. Please try another date or search route.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-4 px-4 py-2 bg-[#0A6A69] text-white text-xs font-semibold rounded-full hover:bg-[#085453] transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Bottom Trust & Guarantee Badges */}
      <TrustGuarantees />
    </div>
  );
}
