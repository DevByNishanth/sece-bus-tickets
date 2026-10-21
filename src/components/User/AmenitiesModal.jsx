import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  Check,
  Sparkles,
  Radio,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

// Metadata and descriptions for amenities
const AMENITY_DETAILS = {
  'Live tracking': {
    icon: Radio,
    badge: 'Live GPS',
    bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconColor: 'text-emerald-600',
    description: 'Real-time GPS tracking link shared via SMS and WhatsApp for precise bus location.'
  },
  'Live GPS Tracking': {
    icon: Radio,
    badge: 'Live GPS',
    bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconColor: 'text-emerald-600',
    description: 'Real-time GPS tracking link shared via SMS and WhatsApp for precise bus location.'
  },
  'Wi-Fi': {
    icon: Wifi,
    badge: 'High Speed',
    bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
    iconColor: 'text-blue-600',
    description: 'Complimentary high-speed onboard wireless internet connection for your devices.'
  },
  'High-speed Wi-Fi': {
    icon: Wifi,
    badge: 'High Speed',
    bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
    iconColor: 'text-blue-600',
    description: 'Complimentary high-speed onboard wireless internet connection for your devices.'
  },
  'Blanket': {
    icon: Moon,
    badge: 'Sanitized',
    bgColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconColor: 'text-indigo-600',
    description: 'Freshly laundered, sanitized warm blanket provided for your overnight comfort.'
  },
  'Blanket & Pillow': {
    icon: Moon,
    badge: 'Sanitized',
    bgColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconColor: 'text-indigo-600',
    description: 'Freshly sanitized warm blanket and comfortable pillow provided for restful sleep.'
  },
  'Charging port': {
    icon: Zap,
    badge: 'Individual',
    bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
    iconColor: 'text-amber-600',
    description: 'Individual USB and AC charging socket available at every seat or berth.'
  },
  'Charging Socket': {
    icon: Zap,
    badge: 'Individual',
    bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
    iconColor: 'text-amber-600',
    description: 'Individual USB and AC charging socket available at every seat or berth.'
  },
  'Water Bottle': {
    icon: Droplets,
    badge: 'Complimentary',
    bgColor: 'bg-sky-50 text-sky-700 border-sky-200',
    iconColor: 'text-sky-600',
    description: 'Complimentary sealed 500ml mineral water bottle provided upon boarding.'
  },
  'Mineral Water': {
    icon: Droplets,
    badge: 'Complimentary',
    bgColor: 'bg-sky-50 text-sky-700 border-sky-200',
    iconColor: 'text-sky-600',
    description: 'Fresh packaged drinking water bottle provided for every passenger.'
  },
  'Reading Light': {
    icon: Lightbulb,
    badge: 'Personal',
    bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
    iconColor: 'text-amber-600',
    description: 'Personal focused reading light with adjustable angle that won’t disturb co-passengers.'
  },
  'Snacks': {
    icon: Utensils,
    badge: 'Complimentary',
    bgColor: 'bg-orange-50 text-orange-700 border-orange-200',
    iconColor: 'text-orange-600',
    description: 'Complimentary packaged refreshments and light travel snacks pack.'
  },
  'Emergency Exit': {
    icon: ShieldAlert,
    badge: 'Safety Certified',
    bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
    iconColor: 'text-rose-600',
    description: 'Safety-certified emergency exit windows and doors with safety glass hammers.'
  },
  'Pillow': {
    icon: Moon,
    badge: 'Sanitized',
    bgColor: 'bg-purple-50 text-purple-700 border-purple-200',
    iconColor: 'text-purple-600',
    description: 'Ergonomic sanitized head pillow with clean single-use cover.'
  },
  'Movie Screen': {
    icon: Tv,
    badge: 'Entertainment',
    bgColor: 'bg-violet-50 text-violet-700 border-violet-200',
    iconColor: 'text-violet-600',
    description: 'Personal or overhead HD entertainment screen with movies, music, and shows.'
  }
};

const DEFAULT_AMENITY = {
  icon: Sparkles,
  badge: 'Included',
  bgColor: 'bg-teal-50 text-teal-700 border-teal-200',
  iconColor: 'text-teal-600',
  description: 'Verified onboard facility provided for passenger comfort and convenience.'
};

export default function AmenitiesModal({
  isOpen,
  onClose,
  bus,
  extraAmenities = [],
  allAmenities = []
}) {
  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !bus) return null;

  const effectiveAllAmenities = allAmenities.length > 0 ? allAmenities : bus.amenities || [];
  const effectiveExtraAmenities =
    extraAmenities.length > 0
      ? extraAmenities
      : effectiveAllAmenities.length > 4
      ? effectiveAllAmenities.slice(4)
      : [];

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="amenities-modal-title"
    >
      {/* Background backdrop click to close */}
      <div
        className="fixed inset-0 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-200 z-10"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-white flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl ${bus.avatarBg || 'bg-[#E8EEF5]'} ${
                bus.avatarColor || 'text-[#2563EB]'
              } flex items-center justify-center font-bold text-lg shrink-0 shadow-xs`}
            >
              {bus.operatorInitial || bus.operatorName?.charAt(0) || 'B'}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="amenities-modal-title"
                  className="font-bold text-lg sm:text-xl text-slate-900 leading-tight"
                >
                  Amenities & Facilities
                </h2>
                <span className="bg-[#EBF7F5] text-[#0A6A69] text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#BCE4DE]">
                  {effectiveAllAmenities.length} Total
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {bus.operatorName} • {bus.busType}
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer shrink-0"
            aria-label="Close amenities modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 custom-scrollbar">
          {/* Section 1: Extra Amenities Highlight */}
          {effectiveExtraAmenities.length > 0 && (
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#0A6A69]" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Extra Amenities
                  </h3>
                  <span className="bg-[#EBF7F5] text-[#0A6A69] text-xs font-bold px-2 py-0.5 rounded-md border border-[#BCE4DE]">
                    +{effectiveExtraAmenities.length} More
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Provided onboard this bus
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {effectiveExtraAmenities.map((amenity, idx) => {
                  const details = AMENITY_DETAILS[amenity] || DEFAULT_AMENITY;
                  const IconComponent = details.icon;

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 flex items-start gap-3 group"
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${details.bgColor}`}
                      >
                        <IconComponent size={18} className={details.iconColor} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5 mb-1">
                          <h4 className="font-bold text-sm text-slate-800 truncate">
                            {amenity}
                          </h4>
                          <span className="text-[10px] font-semibold text-[#0A6A69] bg-[#EBF7F5] px-1.5 py-0.5 rounded">
                            {details.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-normal">
                          {details.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: All Amenities on this Bus */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={16} className="text-[#0A6A69]" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                All Included Amenities ({effectiveAllAmenities.length})
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {effectiveAllAmenities.map((amenity, idx) => {
                const details = AMENITY_DETAILS[amenity] || DEFAULT_AMENITY;
                const IconComponent = details.icon;
                const isExtra = effectiveExtraAmenities.includes(amenity);

                return (
                  <div
                    key={idx}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isExtra
                        ? 'bg-[#EBF7F5] border-[#A6E1D8] text-[#0A6A69]'
                        : 'bg-white border-slate-200/90 text-slate-700'
                    }`}
                  >
                    <IconComponent size={14} className={details.iconColor} />
                    <span>{amenity}</span>
                    {isExtra ? (
                      <span className="text-[10px] bg-[#0A6A69] text-white px-1.5 py-0.2 rounded-full font-bold">
                        Extra
                      </span>
                    ) : (
                      <Check size={12} className="text-emerald-600 stroke-[3]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Verified Guarantee Banner */}
          <div className="bg-gradient-to-r from-[#EBF7F5] to-slate-50 p-3.5 rounded-2xl border border-[#BCE4DE] flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white text-[#0A6A69] flex items-center justify-center shrink-0 shadow-2xs border border-[#A6E1D8]">
              <ShieldCheck size={18} />
            </div>
            <div className="text-xs">
              <p className="font-bold text-slate-800">
                Guaranteed by {bus.operatorName}
              </p>
              <p className="text-slate-500 font-medium mt-0.5">
                All facilities listed above are verified and provided for your journey.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono text-slate-600">Esc</kbd> to close
          </span>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#0A6A69] hover:bg-[#085453] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-md active:scale-95 ml-auto"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
