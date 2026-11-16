import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const toDateValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateValue = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const CustomDatePicker = ({ label, name, value, onChange, required = false, min, compact = false }) => {
  const selectedDate = parseDateValue(value);
  const earliestDate = parseDateValue(min);
  const [isOpen, setIsOpen] = useState(false);
  const [popupStyle, setPopupStyle] = useState({});
  const [displayMonth, setDisplayMonth] = useState(() => {
    const initialDate = selectedDate || new Date();
    return new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
  });
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);
  const popupRef = useRef(null);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear + 25 - 1899 }, (_, index) => currentYear + 25 - index);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!pickerRef.current?.contains(event.target) && !popupRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const calendarDays = useMemo(() => {
    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  }, [displayMonth]);

  const chooseDate = (day) => {
    const date = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day);
    if (earliestDate && date < earliestDate) return;
    onChange?.({ target: { name, value: toDateValue(date) } });
    setIsOpen(false);
  };

  const changeMonth = (amount) => {
    setDisplayMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  const setMonth = (month) => {
    setDisplayMonth((current) => new Date(current.getFullYear(), Number(month), 1));
  };

  const setYear = (year) => {
    setDisplayMonth((current) => new Date(Number(year), current.getMonth(), 1));
  };

  return (
    <div className={`relative w-full ${isOpen ? "z-[100]" : "z-0"}`} ref={pickerRef}>
      <label className={`block font-medium text-slate-700 ${compact ? "mb-1 text-[10px] text-[#64748B]" : "mb-1.5 text-xs"}`}>
        {label}{required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onClick={() => {
            const activeDate = parseDateValue(value) || new Date();
            setDisplayMonth(new Date(activeDate.getFullYear(), activeDate.getMonth(), 1));
            if (!isOpen) {
              const rect = buttonRef.current.getBoundingClientRect();
              const width = 288;
              const height = 330;
              const left = Math.min(Math.max(8, rect.left), window.innerWidth - width - 8);
              const top = rect.bottom + height + 8 <= window.innerHeight ? rect.bottom + 6 : Math.max(8, rect.top - height - 6);
              setPopupStyle({ position: "fixed", left, top, zIndex: 10000 });
            }
            setIsOpen((open) => !open);
          }}
          ref={buttonRef}
          className={`flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white text-left text-slate-700 transition hover:border-slate-300 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/10 ${compact ? "h-[34px] px-2.5 text-[10px]" : "h-10 px-3 text-xs"}`}
        >
          <span className={value ? "text-slate-700" : "text-slate-400"}>
            {selectedDate ? selectedDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Select date"}
          </span>
          <CalendarDays size={15} className="text-slate-400" />
        </button>
        <input tabIndex={-1} aria-hidden="true" className="pointer-events-none absolute h-px w-px opacity-0" type="text" name={name} value={value} required={required} readOnly />

        {isOpen && createPortal(
          <div ref={popupRef} style={popupStyle} role="dialog" aria-label={`${label} calendar`} className="w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <button type="button" aria-label="Previous month" onClick={() => changeMonth(-1)} className="rounded-md p-1.5 text-slate-500 hover:bg-teal-50 hover:text-teal-800"><ChevronLeft size={16} /></button>
              <div className="flex items-center gap-1.5">
                <select
                  aria-label="Select month"
                  value={displayMonth.getMonth()}
                  onChange={(event) => setMonth(event.target.value)}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-800 outline-none focus:border-teal-600"
                >
                  {monthNames.map((month, index) => <option key={month} value={index}>{month}</option>)}
                </select>
                <select
                  aria-label="Select year"
                  value={displayMonth.getFullYear()}
                  onChange={(event) => setYear(event.target.value)}
                  className="max-w-[90px] rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-800 outline-none focus:border-teal-600"
                >
                  {years.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
              <button type="button" aria-label="Next month" onClick={() => changeMonth(1)} className="rounded-md p-1.5 text-slate-500 hover:bg-teal-50 hover:text-teal-800"><ChevronRight size={16} /></button>
            </div>
            <div className="grid grid-cols-7 text-center">
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => <span key={day} className="py-1 text-[10px] font-medium text-slate-400">{day}</span>)}
              {calendarDays.map((day, index) => {
                if (!day) return <span key={`empty-${index}`} />;
                const isSelected = selectedDate?.getFullYear() === displayMonth.getFullYear() && selectedDate?.getMonth() === displayMonth.getMonth() && selectedDate?.getDate() === day;
                const today = new Date();
                const isToday = today.getFullYear() === displayMonth.getFullYear() && today.getMonth() === displayMonth.getMonth() && today.getDate() === day;
                const isBeforeMinimum = earliestDate && new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day) < earliestDate;
                return <button key={day} type="button" onClick={() => chooseDate(day)} disabled={isBeforeMinimum} aria-pressed={isSelected} className={`m-0.5 h-8 rounded-lg text-xs transition disabled:cursor-not-allowed disabled:text-slate-300 ${isSelected ? "bg-[#0E7A88] font-semibold text-white" : isToday ? "bg-teal-50 font-semibold text-teal-800" : "text-slate-700 hover:bg-teal-50 hover:text-teal-800"}`}>{day}</button>;
              })}
            </div>
          </div>, document.body
        )}
      </div>
    </div>
  );
};

export default CustomDatePicker;
