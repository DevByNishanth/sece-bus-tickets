import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

/**
 * Helper to normalize date to YYYY-MM-DD string or parse to Date object at midnight
 */
const toDateObj = (val) => {
  if (!val) return null;
  if (val instanceof Date) {
    const d = new Date(val);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  const parts = String(val).split('-');
  if (parts.length === 3) {
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }
  const d = new Date(val);
  d.setHours(0, 0, 0, 0);
  return isNaN(d.getTime()) ? null : d;
};

const toDateString = (dateObj) => {
  if (!dateObj) return '';
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatDisplayDate = (dateVal, includeYear = true) => {
  const d = toDateObj(dateVal);
  if (!d) return '';
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: includeYear ? 'numeric' : undefined
  });
};

const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const isBeforeDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  return d1.getTime() < d2.getTime();
};

const isAfterDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  return d1.getTime() > d2.getTime();
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
  // 0 = Sunday, 1 = Monday ... 6 = Saturday
  return new Date(year, month, 1).getDay();
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/**
 * CustomDateRangePicker Component
 * 
 * Elegant, responsive custom date range picker designed for bus ticket booking.
 * Adheres strictly to the SECE Bus color palette (Teals, btn-grd, Amber accents, Slate neutrals).
 * 
 * Supports:
 * - One-way & Round-trip trip mode tabs
 * - Date range hover previews
 * - Dual month view on desktop, single month on mobile
 * - Quick preset chips ("Today", "Tomorrow", "This Weekend", "Next Week")
 * - Disabling past dates
 * - Dropdown popover with outside click and mobile sheet support
 */
export default function CustomDateRangePicker({
  startDate: initialStartDate,
  endDate: initialEndDate,
  onChange,
  minDate: customMinDate,
  maxDate: customMaxDate,
  defaultMode = 'range', // 'range' | 'single'
  label = 'DATE OF JOURNEY',
  showPresets = true,
  className = '',
  trigger = null,
  align = 'right'
}) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const minDate = useMemo(() => {
    if (customMinDate) return toDateObj(customMinDate);
    return today;
  }, [customMinDate, today]);

  const maxDate = useMemo(() => {
    if (customMaxDate) return toDateObj(customMaxDate);
    // Default max booking date: 6 months from today
    const d = new Date(today);
    d.setMonth(d.getMonth() + 6);
    return d;
  }, [customMaxDate, today]);

  // Selected range state
  const [mode, setMode] = useState(defaultMode); // 'range' | 'single'
  const [start, setStart] = useState(() => toDateObj(initialStartDate) || today);
  const [end, setEnd] = useState(() => toDateObj(initialEndDate) || null);
  const [hoverDate, setHoverDate] = useState(null);

  // Month navigation state
  const [currentMonth, setCurrentMonth] = useState(() => {
    const s = toDateObj(initialStartDate) || today;
    return new Date(s.getFullYear(), s.getMonth(), 1);
  });

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Sync props if changed externally
  useEffect(() => {
    if (initialStartDate) setStart(toDateObj(initialStartDate));
  }, [initialStartDate]);

  useEffect(() => {
    if (initialEndDate) setEnd(toDateObj(initialEndDate));
  }, [initialEndDate]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      const prevM = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      return prevM;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const nextM = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      return nextM;
    });
  };

  // Day selection logic
  const handleDateClick = (clickedDate) => {
    if (isBeforeDay(clickedDate, minDate)) return;

    if (mode === 'single') {
      setStart(clickedDate);
      setEnd(null);
      notifyChange(clickedDate, null, 'single');
      setIsOpen(false);
      return;
    }

    // Range mode logic
    if (!start || (start && end)) {
      // Starting new selection
      setStart(clickedDate);
      setEnd(null);
    } else if (start && !end) {
      if (isBeforeDay(clickedDate, start)) {
        // Clicked date is before start date, make it the new start
        setStart(clickedDate);
      } else {
        // Complete the range
        setEnd(clickedDate);
        notifyChange(start, clickedDate, 'range');
      }
    }
  };

  const notifyChange = (newStart, newEnd, currentMode = mode) => {
    if (onChange) {
      onChange({
        startDate: toDateString(newStart),
        endDate: toDateString(newEnd),
        formattedStart: formatDisplayDate(newStart),
        formattedEnd: formatDisplayDate(newEnd),
        mode: currentMode
      });
    }
  };

  // Quick preset shortcuts
  const applyPreset = (presetType) => {
    const t = new Date(today);
    let s = new Date(t);
    let e = null;

    if (presetType === 'today') {
      s = new Date(t);
      e = mode === 'range' ? new Date(t.setDate(t.getDate() + 1)) : null;
    } else if (presetType === 'tomorrow') {
      s = new Date(t.setDate(t.getDate() + 1));
      e = mode === 'range' ? new Date(t.setDate(t.getDate() + 1)) : null;
    } else if (presetType === 'weekend') {
      // Next Friday/Saturday to Sunday
      const dayOfWeek = t.getDay();
      const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
      s = new Date(t);
      s.setDate(t.getDate() + daysUntilFriday);
      e = new Date(s);
      e.setDate(s.getDate() + 2); // Sunday
    } else if (presetType === 'week') {
      s = new Date(t);
      e = new Date(t);
      e.setDate(t.getDate() + 7);
    }

    setStart(s);
    setEnd(e);
    setCurrentMonth(new Date(s.getFullYear(), s.getMonth(), 1));
    notifyChange(s, e);
  };

  // Formatted trigger text
  const displayTriggerText = useMemo(() => {
    if (!start) return 'Select date';
    if (mode === 'single' || !end) {
      return formatDisplayDate(start);
    }
    const daysDiff = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return `${formatDisplayDate(start, false)} - ${formatDisplayDate(end)} (${daysDiff} ${daysDiff === 1 ? 'day' : 'days'})`;
  }, [start, end, mode]);

  // Calendar month generator helper
  const renderMonth = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const totalDays = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];
    // Padding for empty cells before 1st of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Days 1..totalDays
    for (let d = 1; d <= totalDays; d++) {
      days.push(new Date(year, month, d));
    }

    return (
      <div className="flex-1 min-w-[260px] sm:min-w-[280px]">
        {/* Month Header */}
        <div className="text-center font-bold text-slate-800 text-sm mb-3">
          {MONTH_NAMES[month]} {year}
        </div>

        {/* Weekday Names */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {WEEKDAY_NAMES.map((name) => (
            <div
              key={name}
              className="text-[11px] font-semibold text-slate-400 select-none py-1"
            >
              {name}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-1 gap-x-0.5">
          {days.map((dateObj, idx) => {
            if (!dateObj) {
              return <div key={`empty-${idx}`} className="h-9 w-full" />;
            }

            const isDisabled = isBeforeDay(dateObj, minDate) || isAfterDay(dateObj, maxDate);
            const isToday = isSameDay(dateObj, today);
            const isStart = isSameDay(dateObj, start);
            const isEnd = isSameDay(dateObj, end);

            // Active hover range calculation
            const effectiveEnd = end || (hoverDate && isAfterDay(hoverDate, start) ? hoverDate : null);
            const isInRange =
              start &&
              effectiveEnd &&
              isAfterDay(dateObj, start) &&
              isBeforeDay(dateObj, effectiveEnd);

            // Rounded pill styling for range endpoints
            const isRangeSelected = isStart || isEnd;

            return (
              <div
                key={dateObj.toISOString()}
                className={`relative h-9 flex items-center justify-center p-0 transition-colors ${
                  isInRange ? 'bg-[#E6F4F1]/80' : ''
                } ${
                  isStart && end
                    ? 'rounded-l-xl bg-gradient-to-r from-transparent to-[#E6F4F1]/80'
                    : ''
                } ${
                  isEnd && start
                    ? 'rounded-r-xl bg-gradient-to-l from-transparent to-[#E6F4F1]/80'
                    : ''
                }`}
                onMouseEnter={() => {
                  if (start && !end && !isDisabled) {
                    setHoverDate(dateObj);
                  }
                }}
              >
                <button
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleDateClick(dateObj)}
                  className={`w-8.5 h-8.5 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer relative z-10 ${
                    isDisabled
                      ? 'text-slate-300 cursor-not-allowed line-through decoration-slate-200'
                      : isRangeSelected
                      ? 'btn-grd text-white font-bold shadow-sm scale-105'
                      : isInRange
                      ? 'text-[#0F766E] font-semibold hover:bg-teal-100'
                      : isToday
                      ? 'border border-[#0D9488] text-[#0F766E] font-bold bg-[#F0FBFA]'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  aria-label={formatDisplayDate(dateObj)}
                >
                  <span>{dateObj.getDate()}</span>
                  {isToday && !isRangeSelected && (
                    <span className="w-1 h-1 rounded-full bg-[#0D9488] -mt-0.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Next month calculation for dual month view
  const nextMonth = useMemo(() => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  }, [currentMonth]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger: Either custom trigger prop or our signature bus booking field */}
      {trigger ? (
        <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
          className="flex-1 flex items-center gap-3.5 px-0 lg:px-4 cursor-pointer relative group border border-gray-100 hover:border-gray-200 rounded-2xl py-2.5 bg-[#f8fafc]/70 hover:bg-[#f8fafc] transition-all select-none shadow-2xs"
        >
          {/* Calendar Icon Badge matching signature amber warmth */}
          <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] border border-[#FDE68A]/60 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <CalendarIcon className="text-[#B45309] w-4 h-4" />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] font-semibold text-[#8C9BAA] uppercase select-none leading-none tracking-wider">
              {label}
            </span>
            <span className="text-[14px] font-semibold text-[#111827] tracking-tight truncate mt-0.5">
              {displayTriggerText}
            </span>
          </div>
        </div>
      )}

      {/* Popover Date Range Picker Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Choose travel date"
          className={`fixed inset-x-3 top-20 sm:absolute sm:inset-auto sm:top-full ${
            align === 'left' ? 'sm:left-0 sm:right-auto' : 'sm:right-0 sm:left-auto'
          } sm:mt-2.5 z-50 bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-4 sm:p-5 w-auto max-w-[95vw] sm:max-w-[640px] animate-in fade-in zoom-in-95 duration-200`}
        >
          {/* Top Bar: Tabs (One-Way vs Round-Trip) & Close */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setMode('single');
                  setEnd(null);
                }}
                className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  mode === 'single'
                    ? 'bg-white text-[#0F766E] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                One-Way
              </button>
              <button
                type="button"
                onClick={() => setMode('range')}
                className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  mode === 'range'
                    ? 'btn-grd text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Round-Trip
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
              aria-label="Close date picker"
            >
              <X size={16} />
            </button>
          </div>

          {/* Quick Preset Shortcuts */}
          {showPresets && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 border-b border-slate-100 scrollbar-none">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
                Quick:
              </span>
              {[
                { id: 'today', label: 'Today' },
                { id: 'tomorrow', label: 'Tomorrow' },
                { id: 'weekend', label: 'This Weekend' },
                { id: 'week', label: 'Next 7 Days' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p.id)}
                  className="text-xs px-3 py-1 rounded-full border border-slate-200 text-slate-600 hover:border-teal-400 hover:text-[#0F766E] hover:bg-[#F0FBFA] transition-all cursor-pointer shrink-0 font-medium"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mb-3 px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={isBeforeDay(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0),
                minDate
              )}
              className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-xs font-semibold text-[#0F766E] bg-[#F0FBFA] border border-teal-200/60 px-3 py-1 rounded-full">
              {mode === 'range'
                ? start && !end
                  ? 'Select Return Date'
                  : 'Select Departure & Return'
                : 'Select Journey Date'}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Calendars: Responsive Dual Month (Desktop) / Single Month (Mobile) */}
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            {renderMonth(currentMonth)}
            <div className="hidden md:block w-px bg-slate-100" />
            <div className="hidden md:block">
              {renderMonth(nextMonth)}
            </div>
          </div>

          {/* Footer Bar: Selected Dates & Action Buttons */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Selected Range Summary */}
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">
                {start ? formatDisplayDate(start) : 'Pick start'}
              </span>
              {mode === 'range' && (
                <>
                  <ArrowRight size={13} className="text-slate-400" />
                  <span className="font-semibold text-slate-800">
                    {end ? formatDisplayDate(end) : 'Pick return'}
                  </span>
                </>
              )}
            </div>

            {/* Clear & Apply Actions */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setStart(today);
                  setEnd(null);
                  notifyChange(today, null);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-3 py-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  notifyChange(start, end);
                  setIsOpen(false);
                }}
                className="btn-grd text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs hover:opacity-95 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check size={14} strokeWidth={2.5} />
                <span>Apply Date</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
