import React from 'react';
import BusListingCard from './BusListingCard';
import TrustGuarantees from './TrustGuarantees';

export default function BusListingCards({
  buses = [],
  sortBy = 'recommended',
  onSortChange,
  onViewSeats,
  onResetFilters
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <span className="font-bold text-slate-900 text-sm">
            {buses.length} buses{' '}
          </span>
          <span className="text-slate-500 text-sm">available on this route</span>
        </div>

        {/* Sort Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-medium text-slate-400 mr-1 shrink-0">
            Sort by:
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
                    ? 'bg-[#E6F4F1] text-[#0A6A69] font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards List */}
      {buses.length > 0 ? (
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
          <h3 className="text-base font-bold text-slate-800">No buses found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting or resetting your filters to see available buses.
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
