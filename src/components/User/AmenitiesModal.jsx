import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { getAmenityMeta } from '../../Utils/amenityConfig';

export default function AmenitiesModal({
  isOpen,
  onClose,
  bus,
  extraAmenities = [],
  allAmenities = [],
  containerRef
}) {
  const popupRef = useRef(null);

  // Close on outside click or Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      const container = containerRef?.current;
      const popup = popupRef.current;
      if (container) {
        if (!container.contains(e.target)) {
          onClose();
        }
      } else if (popup && !popup.contains(e.target)) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, containerRef]);

  if (!isOpen || !bus) return null;

  const effectiveAllAmenities = allAmenities.length > 0 ? allAmenities : bus.amenities || [];
  const effectiveExtraAmenities =
    extraAmenities.length > 0
      ? extraAmenities
      : effectiveAllAmenities.length > 4
      ? effectiveAllAmenities.slice(4)
      : [];

  return (
    <div
      ref={popupRef}
      className="absolute bottom-full mb-2.5 left-0 sm:left-0 w-64 sm:w-72 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-slate-200/90 p-2.5 z-50 animate-in zoom-in-95 fade-in duration-150"
      role="dialog"
      aria-modal="false"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Downward pointer caret towards +N more button */}
      <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-white border-b border-r border-slate-200/90 rotate-45" />

      {/* Top row with Cancel icon button only */}
      <div className="flex items-center justify-end pb-1 mb-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="w-5 h-5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close amenities popup"
        >
          <X size={13} />
        </button>
      </div>

      {/* Extra Amenities List Only */}
      <div className="space-y-1.5 max-h-56 overflow-y-auto">
        {effectiveExtraAmenities.length > 0 ? (
          effectiveExtraAmenities.map((amenity, idx) => {
            const details = getAmenityMeta(amenity);
            const Icon = details.icon;

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-100 text-xs transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-lg bg-white border border-slate-200/80 ${details.color} shrink-0`}>
                    <Icon size={13} />
                  </div>
                  <span className="font-semibold text-slate-800">{details.label}</span>
                </div>

                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border tracking-wide uppercase ${details.bgColor}`}
                >
                  {details.badge}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-slate-400 py-2 text-center">No additional amenities</p>
        )}
      </div>
    </div>
  );
}
