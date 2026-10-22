import React, { useEffect, useRef } from 'react';
import {
  X,
  Wifi,
  Zap,
  Droplets,
  Moon,
  Tv,
  Utensils,
  ShieldAlert,
  Lightbulb,
  Sparkles,
  Radio
} from 'lucide-react';

// Compact metadata for amenities
const AMENITY_DETAILS = {
  'Live tracking': {
    icon: Radio,
    badge: 'Live GPS',
    bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconColor: 'text-emerald-600'
  },
  'Live GPS Tracking': {
    icon: Radio,
    badge: 'Live GPS',
    bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconColor: 'text-emerald-600'
  },
  'Wi-Fi': {
    icon: Wifi,
    badge: 'High Speed',
    bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
    iconColor: 'text-blue-600'
  },
  'High-speed Wi-Fi': {
    icon: Wifi,
    badge: 'High Speed',
    bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
    iconColor: 'text-blue-600'
  },
  'Blanket': {
    icon: Moon,
    badge: 'Sanitized',
    bgColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconColor: 'text-indigo-600'
  },
  'Blanket & Pillow': {
    icon: Moon,
    badge: 'Sanitized',
    bgColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconColor: 'text-indigo-600'
  },
  'Charging port': {
    icon: Zap,
    badge: 'Individual',
    bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
    iconColor: 'text-amber-600'
  },
  'Charging Socket': {
    icon: Zap,
    badge: 'Individual',
    bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
    iconColor: 'text-amber-600'
  },
  'Water Bottle': {
    icon: Droplets,
    badge: 'Complimentary',
    bgColor: 'bg-sky-50 text-sky-700 border-sky-200',
    iconColor: 'text-sky-600'
  },
  'Mineral Water': {
    icon: Droplets,
    badge: 'Complimentary',
    bgColor: 'bg-sky-50 text-sky-700 border-sky-200',
    iconColor: 'text-sky-600'
  },
  'Reading Light': {
    icon: Lightbulb,
    badge: 'Personal',
    bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
    iconColor: 'text-amber-600'
  },
  'Snacks': {
    icon: Utensils,
    badge: 'Complimentary',
    bgColor: 'bg-orange-50 text-orange-700 border-orange-200',
    iconColor: 'text-orange-600'
  },
  'Emergency Exit': {
    icon: ShieldAlert,
    badge: 'Safety',
    bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
    iconColor: 'text-rose-600'
  },
  'Pillow': {
    icon: Moon,
    badge: 'Sanitized',
    bgColor: 'bg-purple-50 text-purple-700 border-purple-200',
    iconColor: 'text-purple-600'
  },
  'Movie Screen': {
    icon: Tv,
    badge: 'Entertainment',
    bgColor: 'bg-violet-50 text-violet-700 border-violet-200',
    iconColor: 'text-violet-600'
  }
};

const DEFAULT_AMENITY = {
  icon: Sparkles,
  badge: 'Included',
  bgColor: 'bg-teal-50 text-teal-700 border-teal-200',
  iconColor: 'text-teal-600'
};

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
      {/* Downward pointer caret towards +2 more button */}
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
            const details = AMENITY_DETAILS[amenity] || DEFAULT_AMENITY;
            const IconComponent = details.icon;

            return (
              <div
                key={idx}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-slate-50/80 hover:bg-[#EBF7F5]/40 border border-slate-100 transition-colors"
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${details.bgColor}`}
                >
                  <IconComponent size={14} className={details.iconColor} />
                </div>

                <div className="flex-1 min-w-0 flex items-center justify-between gap-1.5">
                  <span className="text-xs font-semibold text-slate-700 truncate">
                    {amenity}
                  </span>
                  {details.badge && (
                    <span className="text-[10px] font-medium text-[#0A6A69] bg-[#EBF7F5] px-1.5 py-0.5 rounded border border-[#BCE4DE]/60 shrink-0">
                      {details.badge}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-slate-500 text-center py-1">
            No extra amenities.
          </p>
        )}
      </div>
    </div>
  );
}


