import React from 'react';
import {
  Navigation,
  Wifi,
  Zap,
  BedDouble,
  Droplet,
  Lightbulb,
  Video,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

export default function Highlights() {
  const reviews = [
    { label: 'Cleanliness', count: 49 },
    { label: 'Rest stop hygiene', count: 34 },
    { label: 'Staff behavior', count: 67 },
    { label: 'AC', count: 46 },
    { label: 'Seat Comfort', count: 57 },
    { label: 'Safe Driving', count: 64 },
    { label: 'Live Tracking', count: 48 },
    { label: 'Punctuality', count: 75 }
  ];

  const amenities = [
    { label: 'Live GPS Tracking', icon: Navigation, color: 'text-teal-600' },
    { label: '5G High-Speed Wi-Fi', icon: Wifi, color: 'text-blue-600' },
    { label: '230V / USB Charging', icon: Zap, color: 'text-amber-600' },
    { label: 'Fresh Sanitized Linen', icon: BedDouble, color: 'text-indigo-600' },
    { label: 'Complimentary Water', icon: Droplet, color: 'text-sky-500' },
    { label: 'Individual Reading Light', icon: Lightbulb, color: 'text-amber-500' },
    { label: 'CCTV Surveillance', icon: Video, color: 'text-slate-600' },
    { label: 'Emergency SOS Button', icon: AlertCircle, color: 'text-rose-600' }
  ];

  return (
    <div className="space-y-4">
      {/* Highly Rated by Women Travelers Badge */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200/80 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
          HIGHLY RATED BY WOMEN TRAVELERS
        </span>
      </div>

      {/* Review chips */}
      <div className="flex flex-wrap gap-2 text-xs">
        {reviews.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 hover:border-slate-300 rounded-full px-3 py-1 text-slate-700 font-medium transition-colors"
          >
            <span>{item.label}</span>
            <span className="font-bold text-slate-900">{item.count}</span>
            <span className="text-amber-500">👍</span>
          </div>
        ))}
      </div>

      {/* On-board Amenities */}
      <div className="pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          ON-BOARD AMENITIES
        </h4>
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          {amenities.map((amenity, idx) => {
            const Icon = amenity.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200/70 bg-slate-50/50 hover:bg-white hover:border-teal-300 transition-all text-xs font-medium text-slate-700 shadow-2xs"
              >
                <div className={`p-1.5 rounded-lg bg-white border border-slate-200/60 ${amenity.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">{amenity.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
