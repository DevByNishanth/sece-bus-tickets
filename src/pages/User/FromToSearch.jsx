import React, { useState, useEffect, useRef,useMemo } from 'react';
import {
  ArrowLeft,
  MapPin,
  ArrowLeftRight,
  ArrowRight,
  Loader2,
  X,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import CustomDatePicker from '../../components/Custom/CustomDatePicker';

const API_KEY = import.meta.env.VITE_LOCATIONIQ || 'pk.ce478a3c4974cce9d6b105e9ee7f5986';

const POPULAR_CITIES = [
  { name: 'Chennai (Koyambedu)', city: 'Chennai', tag: 'Major Hub' },
  { name: 'Coimbatore (Gandhipuram)', city: 'Coimbatore', tag: 'Textile Hub' },
  { name: 'Bengaluru (Majestic)', city: 'Bangalore', tag: 'IT Hub' },
  { name: 'Madurai (Mattuthavani)', city: 'Madurai', tag: 'Temple City' },
  { name: 'Salem (New Bus Stand)', city: 'Salem', tag: 'Central Junction' },
  { name: 'Trichy (Central)', city: 'Tiruchirappalli', tag: 'Central TN' }
];

/**
 * Custom hook integrating LocationIQ Autocomplete Search
 * based on provided useEffect specifications
 */
function useLocationSearch(query, apiKey) {
  const [search, setSearch] = useState({
    status: 'idle',
    results: [],
    message: ''
  });

  // Extract query cleaned of parenthetical annotations for higher accuracy
  const normalizedQuery = (query || '').replace(/\(.*?\)/g, '').trim();

  useEffect(() => {
    if (normalizedQuery.length < 3) {
      setSearch({ status: 'idle', results: [], message: '' });
      return undefined;
    }

    const controller = new AbortController();
    setSearch({
      status: apiKey ? 'loading' : 'error',
      results: [],
      message: apiKey ? '' : 'Location search is not configured.'
    });

    const timer = setTimeout(async () => {
      if (!apiKey) return;
      try {
        const params = new URLSearchParams({
          key: apiKey,
          q: normalizedQuery,
          countrycodes: 'in',
          limit: '8',
          dedupe: '1',
          normalizecity: '1'
        });

        const response = await fetch(
          `https://api.locationiq.com/v1/autocomplete?${params}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            response.status === 429
              ? 'Location search limit reached. Please wait and try again.'
              : 'Location search is temporarily unavailable.'
          );
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Location search returned an invalid response.');
        }

        if (!controller.signal.aborted) {
          setSearch({
            status: data.length ? 'results' : 'empty',
            results: data,
            message: ''
          });
        }
      } catch (error) {
        if (controller.signal.aborted || error.name === 'AbortError') return;
        setSearch({
          status: 'error',
          results: [],
          message: error.message || 'Location search failed.'
        });
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [normalizedQuery, apiKey]);

  return { ...search, normalizedQuery };
}

/**
 * Helper to format location object into bus booking city/stop label
 */
function formatLocationName(item) {
  if (!item) return '';
  const city =
    item.address?.city ||
    item.address?.town ||
    item.address?.village ||
    item.address?.county;
  const place =
    item.display_place ||
    item.address?.name ||
    (item.display_name ? item.display_name.split(',')[0].trim() : '');

  if (city && place && city.toLowerCase() !== place.toLowerCase()) {
    return `${city} (${place})`;
  }
  return place || city || (item.display_name ? item.display_name.split(',')[0].trim() : '');
}

/**
 * Helper to format secondary subtitle (district, state, country)
 */
function formatLocationSubtitle(item) {
  if (item.display_address) {
    return item.display_address;
  }
  if (item.display_name) {
    const parts = item.display_name.split(',');
    return parts.slice(1).join(',').trim();
  }
  return item.address?.state ? `${item.address.state}, India` : 'India';
}

const getTodayDateStr = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function FromToSearch({
  initialFrom = 'Chennai (Koyambedu)',
  initialTo = 'Coimbatore (Gandhipuram)',
  initialDate = null,
  onSearch,
  onBack,
  showBack = true
}) {
  const todayStr = useMemo(() => getTodayDateStr(), []);
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [date, setDate] = useState(() => {
    if (initialDate && initialDate >= todayStr) return initialDate;
    return todayStr;
  });
  const [swapRotation, setSwapRotation] = useState(0);

  // Dropdown states
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  // Refs for outside click handling and auto-focusing
  const fromContainerRef = useRef(null);
  const toContainerRef = useRef(null);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  // Autocomplete hooks
  const fromSearch = useLocationSearch(from, API_KEY);
  const toSearch = useLocationSearch(to, API_KEY);

  // Sync state if props change
  useEffect(() => {
    if (initialFrom) setFrom(initialFrom);
  }, [initialFrom]);

  useEffect(() => {
    if (initialTo) setTo(initialTo);
  }, [initialTo]);

  useEffect(() => {
    if (initialDate) setDate(initialDate);
  }, [initialDate]);

  // Handle outside click to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fromContainerRef.current && !fromContainerRef.current.contains(e.target)) {
        setIsFromOpen(false);
      }
      if (toContainerRef.current && !toContainerRef.current.contains(e.target)) {
        setIsToOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsFromOpen(false);
        setIsToOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Format date to "26 Oct 2026"
  const formatDisplayDate = (dateVal) => {
    if (!dateVal) return '26 Oct 2026';
    if (
      typeof dateVal === 'string' &&
      (dateVal.includes('Oct') || dateVal.includes('Nov') || dateVal.includes('May'))
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

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setSwapRotation((prev) => prev + 180);
    setIsFromOpen(false);
    setIsToOpen(false);
  };

  /**
   * When user selects FROM location -> set value, close dropdown,
   * and PROCEED TO NEXT: focus TO destination input and open its dropdown
   */
  const handleSelectFrom = (itemOrName) => {
    const name = typeof itemOrName === 'string' ? itemOrName : formatLocationName(itemOrName);
    setFrom(name);
    setIsFromOpen(false);

    // Proceed to next field (TO destination)
    setTimeout(() => {
      if (toInputRef.current) {
        toInputRef.current.focus();
        setIsToOpen(true);
      }
    }, 120);
  };

  /**
   * When user selects TO location -> set value, close dropdown,
   * and PROCEED TO NEXT: open Date of Journey picker
   */
  const handleSelectTo = (itemOrName) => {
    const name = typeof itemOrName === 'string' ? itemOrName : formatLocationName(itemOrName);
    setTo(name);
    setIsToOpen(false);

    // Proceed to next field (Date picker)
    setTimeout(() => {
      setIsDateOpen(true);
    }, 120);
  };

  const handleSearch = () => {
    setIsFromOpen(false);
    setIsToOpen(false);
    if (onSearch) {
      onSearch({ from, to, date: formatDisplayDate(date), rawDate: date });
    }
  };

  /**
   * Reusable Location Autocomplete Dropdown List
   */
  const renderDropdown = (searchState, onSelect) => {
    const { status, results, message, normalizedQuery } = searchState;

    return (
      <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[320px] flex flex-col">
        {/* Loading state */}
        {status === 'loading' && (
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-5 h-5 text-[#0F766E] animate-spin mb-2" />
            <span className="text-xs font-semibold text-slate-700">Searching locations...</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Looking up Indian stations & cities</span>
          </div>
        )}

        {/* Error state */}
        {status === 'error' && (
          <div className="p-4 flex items-start gap-2.5 text-rose-600 bg-rose-50/80 border-b border-rose-100">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <div className="flex-1">
              <div className="text-xs font-semibold">Search Notice</div>
              <div className="text-[11px] text-rose-600 mt-0.5">{message}</div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {status === 'empty' && (
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mb-2">
              <MapPin className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-xs font-semibold text-slate-700">No locations found</span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              No results for "{normalizedQuery}". Try checking the spelling.
            </span>
          </div>
        )}

        {/* Results list */}
        {status === 'results' && results.length > 0 && (
          <>
            <div className="p-2.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between text-[11px] font-semibold text-slate-500 px-3.5">
              <span>SUGGESTED LOCATIONS</span>
              <span className="text-[10px] text-slate-400 font-medium">{results.length} found</span>
            </div>
            <div className="overflow-y-auto divide-y divide-slate-100/70 max-h-[250px]">
              {results.map((item) => {
                const placeName = formatLocationName(item);
                const subtitle = formatLocationSubtitle(item);
                return (
                  <button
                    key={item.place_id || item.osm_id || Math.random()}
                    type="button"
                    onClick={() => onSelect(item)}
                    className="w-full text-left px-3.5 py-2.5 flex items-start gap-3 hover:bg-[#F0FBFA] transition-colors cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#F0FBFA] group-hover:bg-[#0F766E] border border-teal-100/60 group-hover:border-[#0F766E] flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                      <MapPin className="w-3.5 h-3.5 text-[#0F766E] group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-slate-800 group-hover:text-[#0F766E] truncate transition-colors">
                        {placeName}
                      </div>
                      <div className="text-[11px] text-slate-400 group-hover:text-slate-500 truncate transition-colors">
                        {subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Idle state / popular cities when query is short */}
        {status === 'idle' && (
          <>
            <div className="p-2.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between text-[11px] font-semibold text-slate-500 px-3.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>POPULAR BUS CITIES</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Quick Pick</span>
            </div>
            <div className="overflow-y-auto divide-y divide-slate-100/70 max-h-[250px]">
              {POPULAR_CITIES.map((cityObj) => (
                <button
                  key={cityObj.name}
                  type="button"
                  onClick={() => onSelect(cityObj.name)}
                  className="w-full text-left px-3.5 py-2.5 flex items-center justify-between hover:bg-[#F0FBFA] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#F0FBFA] group-hover:bg-[#0F766E] border border-teal-100/60 group-hover:border-[#0F766E] flex items-center justify-center shrink-0 transition-colors">
                      <MapPin className="w-3.5 h-3.5 text-[#0F766E] group-hover:text-white transition-colors" />
                    </div>
                    <div className="truncate">
                      <div className="text-[13px] font-semibold text-slate-800 group-hover:text-[#0F766E] truncate transition-colors">
                        {cityObj.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {cityObj.city} • Tamil Nadu / South India
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full shrink-0 group-hover:bg-teal-100 group-hover:text-[#0F766E] transition-colors">
                    {cityObj.tag}
                  </span>
                </button>
              ))}
            </div>
            <div className="p-2 bg-slate-50/60 border-t border-slate-100 text-[11px] text-slate-400 text-center">
              Type 3+ letters to search any city, town, or station across India
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Back to search link */}
      {showBack && (
        <div className="mb-4">
          <button
            type="button"
            onClick={onBack}
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
      )}

      {/* Main Search Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-[22px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] px-3 lg:px-4 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 relative">
        {/* FROM Field with LocationIQ Autocomplete */}
        <div ref={fromContainerRef} className="relative flex-1">
          <div
            onClick={() => {
              fromInputRef.current?.focus();
              setIsFromOpen(true);
            }}
            className={`flex items-center gap-3 px-3 lg:px-4 border rounded-2xl py-2.5 bg-[#f8fafc]/70 transition-all cursor-text ${
              isFromOpen
                ? 'border-[#0F766E] ring-2 ring-[#0F766E]/15 bg-white shadow-xs'
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-[#F0FBFA] flex items-center justify-center shrink-0">
              <MapPin className="text-[#0F766E] w-4 h-4" />
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-semibold text-[#8C9BAA] uppercase select-none leading-none tracking-wider">
                FROM ORIGIN
              </span>
              <input
                ref={fromInputRef}
                type="text"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setIsFromOpen(true);
                }}
                onFocus={() => setIsFromOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (fromSearch.results && fromSearch.results.length > 0) {
                      handleSelectFrom(fromSearch.results[0]);
                    } else {
                      setIsFromOpen(false);
                      toInputRef.current?.focus();
                      setIsToOpen(true);
                    }
                  }
                }}
                placeholder="Enter departure city"
                className="w-full bg-transparent text-[14px] font-semibold text-[#111827] placeholder:text-slate-400 focus:outline-none border-none p-0 tracking-tight truncate mt-0.5"
              />
            </div>

            {/* Status Indicator / Clear Button */}
            {fromSearch.status === 'loading' ? (
              <Loader2 className="w-4 h-4 text-[#0F766E] animate-spin shrink-0" />
            ) : from ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFrom('');
                  setIsFromOpen(true);
                  fromInputRef.current?.focus();
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                title="Clear departure city"
                aria-label="Clear departure city"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>

          {/* FROM Autocomplete Dropdown */}
          {isFromOpen && renderDropdown(fromSearch, handleSelectFrom)}
        </div>

        {/* Swap Origin & Destination Button */}
        <div className="flex justify-center shrink-0">
          <button
            type="button"
            onClick={handleSwap}
            className="bg-white border border-gray-100 hover:border-gray-200 hover:bg-slate-50 active:scale-95 transition-all rounded-full p-2.5 cursor-pointer shadow-xs group"
            title="Swap Origin and Destination"
            aria-label="Swap Origin and Destination"
          >
            <ArrowLeftRight
              className="text-gray-500 group-hover:text-[#0F766E] w-4 h-4 transition-transform duration-500 ease-in-out"
              style={{ transform: `rotate(${swapRotation}deg)` }}
            />
          </button>
        </div>

        {/* TO Field with LocationIQ Autocomplete */}
        <div ref={toContainerRef} className="relative flex-1">
          <div
            onClick={() => {
              toInputRef.current?.focus();
              setIsToOpen(true);
            }}
            className={`flex items-center gap-3 px-3 lg:px-4 border rounded-2xl py-2.5 bg-[#f8fafc]/70 transition-all cursor-text ${
              isToOpen
                ? 'border-[#0F766E] ring-2 ring-[#0F766E]/15 bg-white shadow-xs'
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-[#F0FBFA] flex items-center justify-center shrink-0">
              <MapPin className="text-[#0F766E] w-4 h-4" />
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-semibold text-[#8C9BAA] uppercase select-none leading-none tracking-wider">
                TO DESTINATION
              </span>
              <input
                ref={toInputRef}
                type="text"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setIsToOpen(true);
                }}
                onFocus={() => setIsToOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (toSearch.results && toSearch.results.length > 0) {
                      handleSelectTo(toSearch.results[0]);
                    } else {
                      setIsToOpen(false);
                      setIsDateOpen(true);
                    }
                  }
                }}
                placeholder="Enter destination city"
                className="w-full bg-transparent text-[14px] font-semibold text-[#111827] placeholder:text-slate-400 focus:outline-none border-none p-0 tracking-tight truncate mt-0.5"
              />
            </div>

            {/* Status Indicator / Clear Button */}
            {toSearch.status === 'loading' ? (
              <Loader2 className="w-4 h-4 text-[#0F766E] animate-spin shrink-0" />
            ) : to ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setTo('');
                  setIsToOpen(true);
                  toInputRef.current?.focus();
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                title="Clear destination city"
                aria-label="Clear destination city"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>

          {/* TO Autocomplete Dropdown */}
          {isToOpen && renderDropdown(toSearch, handleSelectTo)}
        </div>

        {/* DATE Field with Custom Date Picker */}
        <div className="flex-1">
          <CustomDatePicker
            date={date}
            onChange={(newDateStr) => {
              if (newDateStr) setDate(newDateStr);
              setIsDateOpen(false);
            }}
            open={isDateOpen}
            onOpenChange={setIsDateOpen}
            label="DATE OF JOURNEY"
            align="right"
          />
        </div>

        {/* Search / Modify Search Button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handleSearch}
            className="w-full lg:w-auto btn-grd hover:brightness-105 active:scale-[0.98] transition-all duration-200 text-white font-medium rounded-2xl px-5 py-3 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md group"
          >
            <span className="text-[15px] font-semibold tracking-wide">Modify Search</span>
            <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
