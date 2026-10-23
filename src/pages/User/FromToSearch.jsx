import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MapPin, Calendar, ArrowUpRight, ArrowLeftRight, ArrowRight } from 'lucide-react';
import CustomDatePicker from '../../components/Custom/CustomDatePicker';

export default function FromToSearch({
  initialFrom = 'Chennai (Koyambedu)',
  initialTo = 'Coimbatore (Gandhipuram)',
  initialDate = '2026-10-26',
  onSearch,
  onBack,
  showBack = true
}) {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [date, setDate] = useState(initialDate);
  const [swapRotation, setSwapRotation] = useState(0);
  const dateInputRef = useRef(null);

  // Sync state if props change (e.g., modified in mobile popup or desktop)
  useEffect(() => {
    if (initialFrom) setFrom(initialFrom);
  }, [initialFrom]);

  useEffect(() => {
    if (initialTo) setTo(initialTo);
  }, [initialTo]);

  useEffect(() => {
    if (initialDate) setDate(initialDate);
  }, [initialDate]);

  // Format date to "26 Oct 2026"
  const formatDisplayDate = (dateVal) => {
    if (!dateVal) return '26 Oct 2026';
    if (typeof dateVal === 'string' && (dateVal.includes('Oct') || dateVal.includes('Nov') || dateVal.includes('May'))) {
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
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ from, to, date: formatDisplayDate(date), rawDate: date });
    }
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
      <div className="bg-white border border-[#E2E8F0] rounded-[22px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] px-3 lg:px-4 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0 space-x-4">
        {/* FROM Field */}
        <div className="flex-1 flex items-center gap-3.5 px-0 lg:px-4 border border-gray-100 rounded-2xl py-2.5 bg-[#f8fafc]/70">
          <div className="w-8 h-8 rounded-lg bg-[#F0FBFA] flex items-center justify-center shrink-0">
            <MapPin className="text-[#0F766E]  w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] font-semibold text-[#8C9BAA] uppercase select-none leading-none">
              FROM ORIGIN
            </span>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Enter departure city"
              className="w-full bg-transparent text-[14px] font-semibold text-[#111827] placeholder:text-slate-400 focus:outline-none border-none p-0 tracking-tight truncate"
            />
          </div>
        </div>

        {/* <div className="hidden lg:block h-10 w-[1px] bg-[#E8EDF2] shrink-0 mx-2 lg:mx-3" /> */}
        {/* swap button */}
        <div>
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

        {/* TO Field */}
        <div className="flex-1 flex items-center gap-3.5 px-0 lg:px-4 border border-gray-100 rounded-2xl p-2.5 bg-[#f8fafc]/70">
          <div className="w-8 h-8 rounded-lg bg-[#F0FBFA] flex items-center justify-center shrink-0">
            <MapPin className="text-[#0F766E]  w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className=" text-[10px] font-semibold text-[#8C9BAA] uppercase select-none leading-none">
              TO DESTINATION
            </span>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Enter destination city"
              className="w-full bg-transparent text-[14px] font-semibold text-[#111827] placeholder:text-slate-400 focus:outline-none border-none p-0 tracking-tight truncate"
            />
          </div>
        </div>

        {/* Divider 2 */}
        {/* <div className="hidden lg:block h-10 w-[1px] bg-[#E8EDF2] shrink-0 mx-2 lg:mx-3" /> */}

        {/* DATE Field with Normal Custom Date Picker */}
        <div className="flex-1">
          <CustomDatePicker
            date={date}
            onChange={(newDateStr) => {
              if (newDateStr) setDate(newDateStr);
            }}
            label="DATE OF JOURNEY"
            align="right"
          />
        </div>

        {/* Divider 3 */}
        {/* <div className="hidden lg:block h-10 w-[1px] bg-[#E8EDF2] shrink-0 mx-2 lg:mx-3" /> */}

        {/* Search Button */}
        <div className="flex items-center ">
          <button
            type="button"
            onClick={handleSearch}
            className="w-full lg:w-auto  btn-grd hover:bg-[#085453] active:scale-[0.98] transition-all duration-200 text-white font-medium rounded-2xl px-4 py-3 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md group"
          >
            <span className="text-[16px] font-medium tracking-wide">Modify Search</span>
            <div>
              <ArrowRight className='w-5 h-5'/>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
