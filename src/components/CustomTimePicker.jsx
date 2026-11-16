import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Clock, ChevronDown } from "lucide-react";

const CustomTimePicker = ({ value, onChange, compact = false, className = "" }) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState("21:30");
  const [popupStyle, setPopupStyle] = useState({});
  const currentValue = value ?? internalValue;
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const popupRef = useRef(null);
  const [hourValue = "21", minuteValue = "30"] = (currentValue || "21:30").split(":");

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (!rootRef.current?.contains(event.target) && !popupRef.current?.contains(event.target)) setOpen(false);
      if (event.type === "keydown" && event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const commit = (hour, minute) => {
    const nextValue = `${hour}:${minute}`;
    if (value === undefined) setInternalValue(nextValue);
    onChange?.({ target: { value: nextValue } });
  };
  const toggleOpen = () => {
    if (!open) {
      const rect = buttonRef.current.getBoundingClientRect();
      const width = compact ? 192 : 224;
      const height = 240;
      const left = Math.min(Math.max(8, rect.left), window.innerWidth - width - 8);
      const top = rect.bottom + height + 8 <= window.innerHeight ? rect.bottom + 6 : Math.max(8, rect.top - height - 6);
      setPopupStyle({ position: "fixed", left, top, zIndex: 10000 });
    }
    setOpen((current) => !current);
  };
  const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0"));
  const minutes = Array.from({ length: 12 }, (_, index) => String(index * 5).padStart(2, "0"));

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button ref={buttonRef} type="button" aria-haspopup="dialog" aria-expanded={open} onClick={toggleOpen}
        className={`flex w-full items-center justify-between rounded-lg border border-[#E2E8F0] bg-white text-[#334155] outline-none transition hover:border-[#0E7A88] focus:border-[#0E7A88] ${compact ? "px-2 py-2 text-[9px]" : "px-3 py-2 text-[10px]"}`}>
        <span className="flex items-center gap-2"><Clock size={compact ? 10 : 13} className="text-[#64748B]" />{currentValue || "21:30"}</span>
        <ChevronDown size={compact ? 11 : 13} className="text-[#64748B]" />
      </button>
      {open && createPortal(<div ref={popupRef} style={popupStyle} role="dialog" aria-label="Choose time" className={`rounded-xl border border-slate-200 bg-white p-3 shadow-2xl ${compact ? "w-48" : "w-56"}`}>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Select time</p>
        <div className="grid grid-cols-2 gap-2">
          {[{ title: "Hour", items: hours, selected: hourValue }, { title: "Minute", items: minutes, selected: minuteValue }].map(({ title, items, selected }) => (
            <div key={title}><p className="mb-1 text-[9px] text-slate-400">{title}</p><div className="grid max-h-36 grid-cols-3 gap-1 overflow-y-auto">
              {items.map((item) => <button key={item} type="button" onClick={() => { commit(title === "Hour" ? item : hourValue, title === "Minute" ? item : minuteValue); }} className={`rounded-md py-1.5 text-[10px] ${selected === item ? "bg-[#0E7A88] font-semibold text-white" : "text-slate-700 hover:bg-teal-50"}`}>{item}</button>)}
            </div></div>
          ))}
        </div>
        <button type="button" onClick={() => setOpen(false)} className="mt-2 w-full rounded-md bg-slate-50 py-1.5 text-[10px] font-medium text-slate-600 hover:bg-slate-100">Done</button>
      </div>, document.body)}
    </div>
  );
};

export default CustomTimePicker;
