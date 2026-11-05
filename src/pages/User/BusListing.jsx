import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FromToSearch from './FromToSearch';
import BusFilters from '../../components/User/BusFilters';
import BusListingCards from '../../components/User/AvailableBusListing';
import BusInfoDrawer from '../../components/User/BusInfoDrawer';
import { fetchBusesSearch } from '../../services/busService';
import { initialBuses } from '../../data/mockBuses';
import { SlidersHorizontal, X, Search, ArrowRight, ArrowLeft } from 'lucide-react';
import TripOffers from '../../components/User/TripOffers';

const getTodayDateStr = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function BusListing() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [backendError, setBackendError] = useState(null);
  const [retryTrigger, setRetryTrigger] = useState(0);
  const [sortBy, setSortBy] = useState('recommended');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [drawerState, setDrawerState] = useState({
    isOpen: false,
    type: 'boarding',
    bus: null
  });

  const [searchParams, setSearchParams] = useState({
    from: 'Chennai',
    to: 'Coimbatore',
    date: getTodayDateStr(),
    passengers: 1
  });

  const handleRetry = useCallback(() => {
    setRetryTrigger((prev) => prev + 1);
  }, []);

  const handleLoadDemoBuses = useCallback(() => {
    setBuses(initialBuses);
    setIsLiveBackend(false);
    setBackendError(null);
  }, []);

  // Fetch buses whenever search parameters change or retry is triggered
  useEffect(() => {
    let isSubscribed = true;

    async function loadBuses() {
      setLoading(true);
      try {
        const result = await fetchBusesSearch({
          source: searchParams.from,
          origin: searchParams.from,
          destination: searchParams.to,
          journeyDate: searchParams.date,
          passengers: searchParams.passengers !== undefined ? searchParams.passengers : 1
        });

        if (isSubscribed) {
          if (result && result.success) {
            setBuses(result.buses || []);
            setIsLiveBackend(Boolean(result.isLive));
            setBackendError(null);
          } else {
            setBuses(result?.buses || []);
            setIsLiveBackend(false);
            setBackendError(result?.error || 'Unable to connect to bus search server');
          }
        }
      } catch (err) {
        console.warn('BusListing load error:', err);
        if (isSubscribed) {
          setBuses([]);
          setIsLiveBackend(false);
          setBackendError(err.message || 'Unable to connect to bus service');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }

    loadBuses();

    return () => {
      isSubscribed = false;
    };
  }, [searchParams.from, searchParams.to, searchParams.date, searchParams.passengers, retryTrigger]);

  const handleSearch = (searchData) => {
    setSearchParams((prev) => ({
      ...prev,
      ...searchData,
      date: searchData.rawDate || searchData.date || prev.date,
      passengers: searchData.passengers !== undefined ? searchData.passengers : prev.passengers || 1
    }));
    setIsMobileSearchOpen(false);
  };

  const formatJourneyDate = (dateVal) => {
    if (!dateVal) return '26 Oct 2026';
    if (
      typeof dateVal === 'string' &&
      (dateVal.includes('Nov') ||
        dateVal.includes('May') ||
        dateVal.includes('Jan') ||
        dateVal.includes('Oct') ||
        dateVal.includes('Dec'))
    ) {
      return dateVal;
    }
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return dateVal;
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateVal;
    }
  };

  // Derive unique boarding and dropping points from currently loaded buses
  const availableBoardingPoints = useMemo(() => {
    const pts = buses.flatMap((b) => b.boardingPoints || []);
    return Array.from(new Set(pts));
  }, [buses]);

  const availableDroppingPoints = useMemo(() => {
    const pts = buses.flatMap((b) => b.droppingPoints || []);
    return Array.from(new Set(pts));
  }, [buses]);

  // Default filters
  const defaultFilters = {
    departurePeriods: [], // all periods allowed by default so buses are immediately visible
    busTypes: [],
    ratings: [],
    amenities: [],
    boardingPoints: [],
    droppingPoints: []
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

  // Filter and sort dynamic buses
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
          const busAmenityNorms = (bus.amenities || [])
            .concat(bus.rawAmenities || [])
            .map((a) => String(a).toLowerCase().replace(/[^a-z0-9]/g, ''));

          const hasAll = filters.amenities.every((filterAmenity) => {
            const fNorm = String(filterAmenity).toLowerCase().replace(/[^a-z0-9]/g, '');
            if (fNorm.includes('gps') || fNorm.includes('live')) {
              return busAmenityNorms.some((b) => b.includes('gps') || b.includes('live'));
            }
            if (fNorm.includes('charg')) {
              return busAmenityNorms.some((b) => b.includes('charg'));
            }
            if (fNorm.includes('blanket') || fNorm.includes('pillow')) {
              return busAmenityNorms.some((b) => b.includes('blanket') || b.includes('pillow'));
            }
            if (fNorm.includes('wifi')) {
              return busAmenityNorms.some((b) => b.includes('wifi'));
            }
            return busAmenityNorms.includes(fNorm);
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

  const navigate = useNavigate();

  const handleViewSeats = (bus) => {
    navigate('/ticket-booking', { state: { bus, searchParams } });
  };

  const handleOpenBoardingPoints = (bus) => {
    setDrawerState({
      isOpen: true,
      type: 'boarding',
      bus
    });
  };

  const handleOpenCancellation = (bus) => {
    setDrawerState({
      isOpen: true,
      type: 'cancellation',
      bus
    });
  };

  const handleCloseDrawer = () => {
    setDrawerState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Main Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5 space-y-4 sm:space-y-5">
        {/* Mobile: Sticky Compact Header with Search Icon in Right Corner (< md) */}
        <div className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-2xs rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm tracking-tight truncate">
              <span className="truncate">{searchParams.from.split('(')[0].trim()}</span>
              <ArrowRight size={14} className="text-[#0F766E] shrink-0" />
              <span className="truncate">{searchParams.to.split('(')[0].trim()}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
              <span>{formatJourneyDate(searchParams.date)}</span>
              <span className="text-slate-300">â€¢</span>
              <span className="text-[#0F766E] font-semibold">{filteredBuses.length} Buses</span>
            </div>
          </div>

          {/* Search Icon Button in Right Corner */}
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(true)}
            className="w-10 h-10 rounded-xl btn-grd text-white flex items-center justify-center shadow-xs hover:shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
            title="Search and Modify Route"
            aria-label="Open search popup"
          >
            <Search size={18} strokeWidth={2.3} />
          </button>
        </div>

        {/* Desktop, Laptop & Tab: Back to Search Link */}
        <div className="hidden md:block -mb-2">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2.5 text-[14px] font-medium text-[#5B6B79] hover:text-[#0F172A] transition-colors cursor-pointer group"
          >
            <ArrowLeft
              size={16}
              strokeWidth={2}
              className="text-[#5B6B79] group-hover:text-[#0F172A] transition-colors"
            />
            <span>Back to search</span>
          </button>
        </div>

        {/* Desktop, Laptop & Tab: Sticky From-To Search Bar */}
        <div className="hidden md:block sticky top-0 z-30 bg-[#F8FAFC]/95 backdrop-blur-md pt-1.5 pb-2.5 transition-all">
          <FromToSearch
            initialFrom={searchParams.from}
            initialTo={searchParams.to}
            initialDate={searchParams.date}
            initialPassengers={searchParams.passengers || 1}
            onSearch={handleSearch}
            onBack={() => console.log('Back to search clicked')}
            showBack={false}
          />
        </div>

        {/* Special Offers (TripOffers) */}
        <div>
          <TripOffers />
        </div>

        {/* Mobile Filter Trigger Button (< md) */}
        <div className="md:hidden flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
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
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Left Column: Filters (Sticky on Desktop, Laptop, and Tab) */}
          <aside className="hidden md:block w-[280px] lg:w-[290px] xl:w-[310px] shrink-0 sticky top-[98px] z-20">
            <div className="max-h-[calc(100vh-115px)] overflow-y-auto overscroll-contain pr-1 rounded-2xl custom-scrollbar">
              <BusFilters
                filters={filters}
                onFilterChange={setFilters}
                onReset={handleResetFilters}
                availableBoardingPoints={availableBoardingPoints}
                availableDroppingPoints={availableDroppingPoints}
              />
            </div>
          </aside>

          {/* Right Column: Dynamic Bus Cards List */}
          <section className="flex-1 min-w-0 w-full">
            <BusListingCards
              buses={filteredBuses}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onViewSeats={handleViewSeats}
              onOpenBoardingPoints={handleOpenBoardingPoints}
              onOpenCancellation={handleOpenCancellation}
              onResetFilters={handleResetFilters}
              loading={loading}
              isLive={isLiveBackend}
              backendError={backendError}
              onRetry={handleRetry}
              onLoadDemoBuses={handleLoadDemoBuses}
            />
          </section>
        </div>
      </main>

      {/* Mobile Search Popup Modal */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsMobileSearchOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl p-5 shadow-2xl z-10 border border-slate-100 max-h-[92vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Search Buses</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Update departure, destination or travel date
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
                aria-label="Close search popup"
              >
                <X size={18} />
              </button>
            </div>

            <FromToSearch
              initialFrom={searchParams.from}
              initialTo={searchParams.to}
              initialDate={searchParams.date}
              initialPassengers={searchParams.passengers || 1}
              onSearch={handleSearch}
              onBack={() => setIsMobileSearchOpen(false)}
              showBack={false}
            />
          </div>
        </div>
      )}

      {/* Mobile Filters Slide-Over Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

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
                availableBoardingPoints={availableBoardingPoints}
                availableDroppingPoints={availableDroppingPoints}
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

      {/* Off-Canvas Drawer for Boarding/Dropping Points & Cancellation Policy */}
      <BusInfoDrawer
        isOpen={drawerState.isOpen}
        type={drawerState.type}
        bus={drawerState.bus}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}