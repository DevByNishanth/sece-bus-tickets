import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles
} from 'lucide-react';

/**
 * Normalizes date to Date object at midnight
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

const formatDisplayDate = (dateVal) => {
  const d = toDateObj(dateVal);
  if (!d) return 'Select date';
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const formatDayOfWeek = (dateVal) => {
  const d = toDateObj(dateVal);
  if (!d) return '';
  return d.toLocaleDateString('en-GB', { weekday: 'short' });
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
  return new Date(year, month, 1).getDay();
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/**
 * CustomDatePicker Component
 * 
 * Standard single-date custom date picker built for bus ticket booking.
 * Adheres strictly to the SECE Bus color palette (Teals, btn-grd, Amber accents, Slate neutrals).
 * 
 * Features:
 * - Clean single-month calendar popover
 * - Instant single-click selection and auto-close
 * - Quick date shortcuts ("Today", "Tomorrow", "Day After")
 * - Disabling past dates
 * - Right or left popover alignment
 * - Accessible keyboard & outside click support
 */
export default function CustomDatePicker({
  date: initialDate,
  onChange,
  minDate: customMinDate,
  maxDate: customMaxDate,
  label = 'DATE OF JOURNEY',
  showShortcuts = true,
  align = 'right',
  className = '',
  open: controlledOpen,
  onOpenChange,
  trigger = null
}) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const selectedDate = useMemo(() => {
    return toDateObj(initialDate) || today;
  }, [initialDate, today]);

  const minDate = useMemo(() => {
    if (customMinDate) return toDateObj(customMinDate);
    // If initialDate is set to an earlier test date (e.g. in 2025), permit from that date, otherwise today
    const initD = toDateObj(initialDate);
    if (initD && isBeforeDay(initD, today)) {
      return initD;
    }
    return today;
  }, [customMinDate, initialDate, today]);

  const maxDate = useMemo(() => {
    if (customMaxDate) return toDateObj(customMaxDate);
    // Default 6 months in advance
    const d = new Date(today);
    d.setMonth(d.getMonth() + 6);
    return d;
  }, [customMaxDate, today]);

  // Current month being viewed in calendar
  const [currentMonth, setCurrentMonth] = useState(() => {
    const s = selectedDate || today;
    return new Date(s.getFullYear(), s.getMonth(), 1);
  });

  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalIsOpen;

  const setIsOpen = (nextVal) => {
    const resolved = typeof nextVal === 'function' ? nextVal(isOpen) : nextVal;
    if (onOpenChange) {
      onOpenChange(resolved);
    }
    if (!isControlled) {
      setInternalIsOpen(resolved);
    }
  };
  const containerRef = useRef(null);

  // Sync viewed month when initialDate changes
  useEffect(() => {
    if (initialDate) {
      const d = toDateObj(initialDate);
      if (d) {
        setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
      }
    }
  }, [initialDate]);

  // Handle outside click to close popover
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

  // Keyboard navigation (Escape key closes)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Date selection handler
  const handleSelectDate = (dateObj) => {
    if (isBeforeDay(dateObj, minDate) || isAfterDay(dateObj, maxDate)) return;
    const dateStr = toDateString(dateObj);
    const formatted = formatDisplayDate(dateObj);
    if (onChange) {
      onChange(dateStr, dateObj, formatted);
    }
    setIsOpen(false);
  };

  // Quick shortcut selection
  const handleSelectShortcut = (type) => {
    const t = new Date(today);
    let target = new Date(t);
    if (type === 'today') {
      target = t;
    } else if (type === 'tomorrow') {
      target.setDate(t.getDate() + 1);
    } else if (type === 'dayAfter') {
      target.setDate(t.getDate() + 2);
    }
    setCurrentMonth(new Date(target.getFullYear(), target.getMonth(), 1));
    handleSelectDate(target);
  };

  // Calendar days for currently viewed month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  }, [currentMonth]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger: Custom or signature bus booking trigger */}
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
          {/* Calendar Icon with Warm Amber Palette */}
          <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] border border-[#FDE68A]/60 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <CalendarIcon className="text-[#B45309] w-4 h-4" />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] font-semibold text-[#8C9BAA] uppercase select-none leading-none tracking-wider">
              {label}
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5 truncate">
              <span className="text-[14px] font-semibold text-[#111827] tracking-tight truncate">
                {formatDisplayDate(selectedDate)}
              </span>
              {selectedDate && (
                <span className="text-xs text-slate-400 font-medium">
                  ({formatDayOfWeek(selectedDate)})
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Popover Calendar Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Choose travel date"
          className={`fixed inset-x-3 top-20 sm:absolute sm:inset-auto sm:top-full ${
            align === 'left' ? 'sm:left-0 sm:right-auto' : 'sm:right-0 sm:left-auto'
          } sm:mt-2.5 z-50 bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-4 sm:p-5 w-auto max-w-[95vw] sm:w-[340px] animate-in fade-in zoom-in-95 duration-200`}
        >
          {/* Header Bar: Month/Year and Navigation */}
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={isBeforeDay(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0),
                minDate
              )}
              className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="font-bold text-slate-900 text-sm">
              {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
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

          {/* Quick Date Shortcuts (Today / Tomorrow / Day After) */}
          {showShortcuts && (
            <div className="grid grid-cols-3 gap-1.5 mb-3 pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => handleSelectShortcut('today')}
                className={`text-[11px] font-semibold py-1.5 px-2 rounded-xl transition cursor-pointer border ${
                  isSameDay(selectedDate, today)
                    ? 'btn-grd text-white border-transparent shadow-2xs'
                    : 'bg-slate-50 hover:bg-[#F0FBFA] text-slate-600 hover:text-[#0F766E] border-slate-200/80 hover:border-teal-200'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handleSelectShortcut('tomorrow')}
                className={`text-[11px] font-semibold py-1.5 px-2 rounded-xl transition cursor-pointer border ${
                  isSameDay(selectedDate, new Date(today.getTime() + 86400000))
                    ? 'btn-grd text-white border-transparent shadow-2xs'
                    : 'bg-slate-50 hover:bg-[#F0FBFA] text-slate-600 hover:text-[#0F766E] border-slate-200/80 hover:border-teal-200'
                }`}
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => handleSelectShortcut('dayAfter')}
                className={`text-[11px] font-semibold py-1.5 px-2 rounded-xl transition cursor-pointer border ${
                  isSameDay(selectedDate, new Date(today.getTime() + 172800000))
                    ? 'btn-grd text-white border-transparent shadow-2xs'
                    : 'bg-slate-50 hover:bg-[#F0FBFA] text-slate-600 hover:text-[#0F766E] border-slate-200/80 hover:border-teal-200'
                }`}
              >
                Day After
              </button>
            </div>
          )}

          {/* Weekday Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {WEEKDAY_NAMES.map((name) => (
              <div
                key={name}
                className="text-[11px] font-semibold text-slate-400 select-none py-1"
              >
                {name}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarDays.map((dateObj, idx) => {
              if (!dateObj) {
                return <div key={`empty-${idx}`} className="h-9 w-full" />;
              }

              const isDisabled =
                isBeforeDay(dateObj, minDate) || isAfterDay(dateObj, maxDate);
              const isSelected = isSameDay(dateObj, selectedDate);
              const isToday = isSameDay(dateObj, today);

              return (
                <div key={dateObj.toISOString()} className="h-9 flex items-center justify-center">
                  <button
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleSelectDate(dateObj)}
                    className={`w-8.5 h-8.5 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isDisabled
                        ? 'text-slate-300 cursor-not-allowed line-through decoration-slate-200'
                        : isSelected
                        ? 'btn-grd text-white font-bold shadow-xs scale-105'
                        : isToday
                        ? 'border border-[#0D9488] text-[#0F766E] font-bold bg-[#F0FBFA] hover:bg-teal-50'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                    aria-label={formatDisplayDate(dateObj)}
                  >
                    <span>{dateObj.getDate()}</span>
                    {isToday && !isSelected && (
                      <span className="w-1 h-1 rounded-full bg-[#0D9488] -mt-0.5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="text-slate-600 font-medium truncate">
              {formatDisplayDate(selectedDate)}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-[#0F766E] hover:text-[#0a5751] px-2.5 py-1 rounded-lg hover:bg-[#F0FBFA] transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
