import React, { useState, useMemo } from 'react';
// import Navbar from '../../components/Navbar';
import FromToSearch from './FromToSearch';
import BusFilters from '../../components/User/BusFilters';
import BusListingCards from '../../components/User/BusListingCards';
import { initialBuses } from '../../data/mockBuses';
import { SlidersHorizontal, X } from 'lucide-react';

export default function BusListing() {
  const [buses] = useState(initialBuses);
  const [sortBy, setSortBy] = useState('recommended');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Default filters matching the screenshot
  const defaultFilters = {
    departurePeriods: ['night'], // 'early', 'morning', 'afternoon', 'night'
    busTypes: ['AC Sleeper'],
    ratings: [],
    amenities: ['Live GPS Tracking'],
    boardingPoints: ['Koyambedu (Omni Bus Stand)'],
    droppingPoints: ['Gandhipuram (Central Stand)']
  };

  const [filters, setFilters] = useState(defaultFilters);

  const handleResetFilters = () => {
    setFilters({
      departurePeriods: [],
      busTypes: [],
      ratings: [],
      amenities: [],
      boardingPoints: [],
      droppingPoints: []
    });
  };

  // Filter and sort the dynamic buses
  const filteredBuses = useMemo(() => {
    return buses
      .filter((bus) => {
        // Departure period filter
        if (filters.departurePeriods && filters.departurePeriods.length > 0) {
          const hour = parseInt(bus.departureTime.split(':')[0], 10);
          const matchesPeriod = filters.departurePeriods.some((period) => {
            if (period === 'early') return hour < 6;
            if (period === 'morning') return hour >= 6 && hour < 12;
            if (period === 'afternoon') return hour >= 12 && hour < 18;
            if (period === 'night') return hour >= 18;
            return false;
          });
          if (!matchesPeriod) return false;
        }

        // Bus type filter
        if (filters.busTypes && filters.busTypes.length > 0) {
          if (!filters.busTypes.includes(bus.category)) {
            return false;
          }
        }

        // Rating filter
        if (filters.ratings && filters.ratings.length > 0) {
          const minRating = Math.min(...filters.ratings);
          if (bus.rating < minRating) return false;
        }

        // Amenities filter
        if (filters.amenities && filters.amenities.length > 0) {
          const hasAll = filters.amenities.every((amenity) => {
            if (amenity === 'Live GPS Tracking') {
              return bus.amenities.includes('Live tracking');
            }
            if (amenity === 'Charging Socket') {
              return bus.amenities.includes('Charging port');
            }
            if (amenity === 'Blanket & Pillow') {
              return bus.amenities.includes('Blanket');
            }
            return bus.amenities.includes(amenity);
          });
          if (!hasAll) return false;
        }

        // Boarding points filter
        if (filters.boardingPoints && filters.boardingPoints.length > 0) {
          const hasBoarding = filters.boardingPoints.some((bp) =>
            bus.boardingPoints?.includes(bp)
          );
          if (!hasBoarding) return false;
        }

        // Dropping points filter
        if (filters.droppingPoints && filters.droppingPoints.length > 0) {
          const hasDropping = filters.droppingPoints.some((dp) =>
            bus.droppingPoints?.includes(dp)
          );
          if (!hasDropping) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'departure') {
          return a.departureTime.localeCompare(b.departureTime);
        }
        if (sortBy === 'price') {
          return a.price - b.price;
        }
        if (sortBy === 'fastest') {
          return a.durationMinutes - b.durationMinutes;
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        // 'recommended' - default order
        return 0;
      });
  }, [buses, filters, sortBy]);

  const activeFiltersCount =
    (filters.departurePeriods?.length || 0) +
    (filters.busTypes?.length || 0) +
    (filters.ratings?.length || 0) +
    (filters.amenities?.length || 0) +
    (filters.boardingPoints?.length || 0) +
    (filters.droppingPoints?.length || 0);

  const handleViewSeats = (bus) => {
    alert(`Selecting seats for ${bus.operatorName} (${bus.busType}) - ₹${bus.price}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Top Navigation */}
      {/* <Navbar /> */}

      {/* Main Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* From-To Search Header Bar */}
        <div>
          <FromToSearch
            onSearch={(searchData) => console.log('Search:', searchData)}
            onBack={() => console.log('Back to search clicked')}
            showBack={true}
          />
        </div>

        {/* Mobile / Tablet Filter Trigger Button */}
        <div className="lg:hidden flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-800">
              {filteredBuses.length} buses found
            </span>
            {activeFiltersCount > 0 && (
              <span className="bg-[#E7F5F2] text-[#0A6A69] text-xs font-semibold px-2 py-0.5 rounded-full">
                {activeFiltersCount} filters active
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-[#0A6A69] text-white rounded-lg text-xs font-semibold hover:bg-[#085453] transition cursor-pointer"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>
        </div>

        {/* 2-Column Responsive Body */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left Column: Filters (Desktop) */}
          <aside className="hidden lg:block w-[290px] xl:w-[310px] shrink-0 sticky top-20">
            <BusFilters
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Right Column: Dynamic Bus Cards List */}
          <section className="flex-1 min-w-0 w-full">
            <BusListingCards
              buses={filteredBuses}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onViewSeats={handleViewSeats}
              onResetFilters={handleResetFilters}
            />
          </section>
        </div>
      </main>

      {/* Mobile Filters Slide-Over Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-20">
              <h3 className="font-bold text-slate-900 text-base">Filters</h3>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 flex-1">
              <BusFilters
                filters={filters}
                onFilterChange={setFilters}
                onReset={handleResetFilters}
                isMobile={true}
                onCloseMobile={() => setIsMobileFilterOpen(false)}
              />
            </div>

            <div className="p-4 border-t border-slate-200 bg-white sticky bottom-0 z-20 flex gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-[#0A6A69] text-white rounded-xl text-xs font-semibold hover:bg-[#085453] transition"
              >
                Show {filteredBuses.length} Buses
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}