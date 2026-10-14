import React, { useState, useRef } from 'react';
import { ArrowLeft, MapPin, Calendar, ArrowUpRight } from 'lucide-react';

export default function FromToSearch({
  initialFrom = 'Chennai (Koyambedu)',
  initialTo = 'Coimbatore (Gandhipuram)',
  initialDate = '2025-05-24',
  onSearch,
  onBack,
  showBack = true
}) {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [date, setDate] = useState(initialDate);
  const dateInputRef = useRef(null);

  // Format date to "24 May 2025"
  const formatDisplayDate = (dateVal) => {
    if (!dateVal) return '24 May 2025';
    if (typeof dateVal === 'string' && dateVal.includes('May')) {
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

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ from, to, date: formatDisplayDate(date) });
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
      <div className="bg-white border border-[#E2E8F0] rounded-[22px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] px-5 lg:px-6 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0">
        {/* FROM Field */}
        <div className="flex-1 flex items-center gap-3.5 pr-2 lg:pr-4">
          <div className="w-12 h-12 rounded-[14px] bg-[#E7F5F2] flex items-center justify-center shrink-0">
            <MapPin size={21} className="text-[#0A6A69]" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[11px] font-bold text-[#8C9BAA] tracking-[0.05em] uppercase select-none leading-none">
              FROM
            </span>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Enter departure city"
              className="w-full bg-transparent text-[15.5px] font-bold text-[#111827] placeholder:text-slate-400 focus:outline-none border-none p-0 mt-1 tracking-tight truncate"
            />
          </div>
        </div>

        {/* Divider 1 */}
        <div className="hidden lg:block h-10 w-[1px] bg-[#E8EDF2] shrink-0 mx-2 lg:mx-3" />

        {/* TO Field */}
        <div className="flex-1 flex items-center gap-3.5 px-0 lg:px-4">
          <div className="w-12 h-12 rounded-[14px] bg-[#E7F5F2] flex items-center justify-center shrink-0">
            <MapPin size={21} className="text-[#0A6A69]" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[11px] font-bold text-[#8C9BAA] tracking-[0.05em] uppercase select-none leading-none">
              TO
            </span>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Enter destination city"
              className="w-full bg-transparent text-[15.5px] font-bold text-[#111827] placeholder:text-slate-400 focus:outline-none border-none p-0 mt-1 tracking-tight truncate"
            />
          </div>
        </div>

        {/* Divider 2 */}
        <div className="hidden lg:block h-10 w-[1px] bg-[#E8EDF2] shrink-0 mx-2 lg:mx-3" />

        {/* DATE Field */}
        <div
          className="flex-1 flex items-center gap-3.5 px-0 lg:px-4 cursor-pointer relative group"
          onClick={() => {
            if (dateInputRef.current) {
              if (dateInputRef.current.showPicker) {
                dateInputRef.current.showPicker();
              } else {
                dateInputRef.current.focus();
              }
            }
          }}
        >
          <div className="w-12 h-12 rounded-[14px] bg-[#E7F5F2] flex items-center justify-center shrink-0 group-hover:bg-[#def0ec] transition-colors">
            <Calendar size={21} className="text-[#0A6A69]" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[11px] font-bold text-[#8C9BAA] tracking-[0.05em] uppercase select-none leading-none">
              DATE
            </span>
            <span className="text-[15.5px] font-bold text-[#111827] mt-1 tracking-tight truncate select-none">
              {formatDisplayDate(date)}
            </span>
            <input
              ref={dateInputRef}
              type="date"
              value={date}
              onChange={(e) => {
                if (e.target.value) setDate(e.target.value);
              }}
              className="absolute inset-0 opacity-0 pointer-events-none w-0 h-0"
            />
          </div>
        </div>

        {/* Divider 3 */}
        <div className="hidden lg:block h-10 w-[1px] bg-[#E8EDF2] shrink-0 mx-2 lg:mx-3" />

        {/* Search Button */}
        <div className="flex items-center justify-end pl-0 lg:pl-3 pt-2 lg:pt-0">
          <button
            type="button"
            onClick={handleSearch}
            className="w-full lg:w-auto h-12 bg-[#0A6A69] hover:bg-[#085453] active:scale-[0.98] transition-all duration-200 text-white font-medium rounded-full pl-7 pr-1.5 py-1 flex items-center justify-center gap-4 cursor-pointer shadow-sm hover:shadow-md group"
          >
            <span className="text-[16px] font-medium tracking-wide">Search</span>
            <div className="w-[38px] h-[38px] rounded-full bg-white flex items-center justify-center text-[#0A6A69] shadow-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
              <ArrowUpRight size={19} strokeWidth={2.5} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
