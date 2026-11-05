import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Bus,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function BusInfoDrawer({
  isOpen = false,
  type = 'boarding', // 'boarding' | 'cancellation'
  bus = null,
  onClose
}) {
  const [activeSubTab, setActiveSubTab] = useState('boarding'); // 'boarding' | 'dropping'

  // Reset subtab when drawer opens
  useEffect(() => {
    if (isOpen) {
      setActiveSubTab('boarding');
      // Lock body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose && onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !bus) return null;

  // Extract Boarding and Dropping Stops from bus API response
  const stops = Array.isArray(bus.stops) ? bus.stops : [];

  const rawBoardingStops = stops.filter(
    (s) => s.stopType === 'boarding' || s.stopType === 'both'
  );
  const rawDroppingStops = stops.filter(
    (s) => s.stopType === 'dropping' || s.stopType === 'both'
  );

  const fallbackBoarding = [
    {
      name: bus.departurePoint || 'Gandhipuram Omni Bus Stand',
      city: bus.departureCity || 'Coimbatore',
      estimatedArrivalTime: bus.departureTime || '21:30',
      landmark: 'Near Central Omni Bus Stand / Platform Gate',
      sequenceNumber: 1
    }
  ];

  const fallbackDropping = [
    {
      name: bus.droppingPoint || 'Koyambedu (CMBT)',
      city: bus.arrivalCity || 'Chennai',
      estimatedArrivalTime: bus.arrivalTime || '06:00',
      landmark: 'CMBT Omni Bus Stand Platform 2',
      sequenceNumber: 1
    }
  ];

  const boardingList = rawBoardingStops.length > 0 ? rawBoardingStops : fallbackBoarding;
  const droppingList = rawDroppingStops.length > 0 ? rawDroppingStops : fallbackDropping;

  const isBoardingMode = type === 'boarding';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Off-Canvas Slide-over Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-right">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/60">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-teal-50 text-[#0F766E] border border-teal-200/80">
                  {isBoardingMode ? (
                    <MapPin className="w-4 h-4" />
                  ) : (
                    <RotateCcw className="w-4 h-4" />
                  )}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {isBoardingMode
                    ? 'Boarding & Dropping Points'
                    : 'Cancellation Policy'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {bus.operatorName} • {bus.busType}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Bus Route Bar */}
          <div className="px-5 py-3 bg-[#F0FDF4]/70 border-b border-emerald-100/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-950">
              <span>{bus.departureCity}</span>
              <span className="text-emerald-500 font-normal">→</span>
              <span>{bus.arrivalCity}</span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-800">
              {bus.departureTime} – {bus.arrivalTime} ({bus.duration || 'Direct'})
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {isBoardingMode ? (
              // ----------------- BOARDING & DROPPING POINTS VIEW -----------------
              <div className="space-y-4">
                {/* Subtabs Switcher */}
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('boarding')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeSubTab === 'boarding'
                        ? 'bg-white text-[#0F766E] shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Boarding ({boardingList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('dropping')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeSubTab === 'dropping'
                        ? 'bg-white text-[#0F766E] shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Dropping ({droppingList.length})
                  </button>
                </div>

                {/* Points List */}
                <div className="space-y-3 pt-2">
                  {(activeSubTab === 'boarding' ? boardingList : droppingList).map(
                    (stop, idx) => {
                      const time =
                        stop.estimatedArrivalTime ||
                        stop.scheduledTime ||
                        (activeSubTab === 'boarding'
                          ? bus.departureTime
                          : bus.arrivalTime);
                      const isFirst = idx === 0;
                      const isLast =
                        idx ===
                        (activeSubTab === 'boarding'
                          ? boardingList.length - 1
                          : droppingList.length - 1);

                      return (
                        <div
                          key={stop._id || idx}
                          className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-teal-300 transition-colors shadow-2xs"
                        >
                          <div className="flex flex-col items-center">
                            <span
                              className={`w-3 h-3 rounded-full mt-1 ${
                                activeSubTab === 'boarding'
                                  ? 'bg-[#0F766E] ring-4 ring-teal-100'
                                  : 'bg-emerald-600 ring-4 ring-emerald-100'
                              }`}
                            />
                            {!isLast && (
                              <div className="w-0.5 h-12 bg-slate-200 mt-1" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-extrabold text-slate-900">
                                {time}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                                {isFirst && activeSubTab === 'boarding'
                                  ? 'Origin Point'
                                  : isLast && activeSubTab === 'dropping'
                                  ? 'Terminus'
                                  : `Stop #${idx + 1}`}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-slate-800 mt-0.5">
                              {stop.name}
                            </h4>

                            {(stop.landmark || stop.city) && (
                              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                {stop.landmark
                                  ? `${stop.landmark}${
                                      stop.city ? `, ${stop.city}` : ''
                                    }`
                                  : stop.city}
                              </p>
                            )}

                            {stop.reportingTime && (
                              <div className="flex items-center gap-1.5 text-[11px] text-teal-700 font-semibold mt-1">
                                <Clock className="w-3 h-3 text-teal-600" />
                                <span>Reporting: {stop.reportingTime}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            ) : (
              // ----------------- CANCELLATION POLICY VIEW -----------------
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-950 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Free Cancellation Available</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Cancel before 12 hours of departure for a 100% full ticket fare refund.
                  </p>
                </div>

                {/* Refund Slabs Table (Matching Seat Layout Page) */}
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs divide-y divide-slate-100">
                  <div className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">
                        Up to 12 hrs before departure
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Until {bus.departureTime} (12 hrs prior)
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      100% Refund (Free)
                    </span>
                  </div>

                  <div className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">
                        Between 6 to 12 hrs before
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Standard cancellation charges apply
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                      50% Refund
                    </span>
                  </div>

                  <div className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">
                        Less than 6 hrs before departure
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Late cancellation window
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                      No Refund
                    </span>
                  </div>
                </div>

                {/* Important Terms */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Important Terms
                  </h4>
                  <ul className="space-y-1.5 list-disc pl-4 text-[11px] leading-relaxed text-slate-500">
                    <li>Booking fee and optional insurance charges are non-refundable upon cancellation.</li>
                    <li>Refund amount will be automatically credited to the original source account within 3 to 5 business days.</li>
                    <li>Partial cancellation for selected passengers or berths is fully permitted before chart preparation.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

