import React from 'react';
import { Route, Clock, Coffee, MapPin } from 'lucide-react';

export default function BusRoute() {
  const stops = [
    {
      time: '15:00',
      title: 'Chennai (Origin Terminal)',
      badge: 'BOARDING',
      badgeColor: 'text-[#0F766E] bg-teal-50 border-teal-200',
      dotColor: 'bg-[#0F766E] ring-4 ring-teal-100',
      desc: 'Koyambedu Omni Bus Stand (Platform 4, Gate B)',
      distance: null
    },
    {
      time: '15:45',
      title: 'Guindy Kathipara Flyover',
      badge: null,
      dotColor: 'bg-slate-300 ring-2 ring-slate-100',
      desc: 'Kathipara Junction near Metro Pillar 24, Chennai',
      distance: 'Km 14'
    },
    {
      time: '16:15',
      title: 'Tambaram',
      badge: null,
      dotColor: 'bg-slate-300 ring-2 ring-slate-100',
      desc: 'Opp. Hindu Mission Hospital / Main Highway Bay',
      distance: 'Km 29'
    },
    {
      time: '17:00',
      title: 'Paranur Toll Plaza',
      badge: null,
      dotColor: 'bg-slate-300 ring-2 ring-slate-100',
      desc: 'Chengalpattu Fastag Express Corridor',
      distance: 'Km 52'
    },
    {
      time: '18:30',
      title: 'Tindivanam Bypass',
      badge: null,
      dotColor: 'bg-slate-300 ring-2 ring-slate-100',
      desc: 'Roundabout Flyover Point',
      distance: 'Km 128'
    },
    {
      time: '19:45 – 20:15 (30 Min Break)',
      title: '',
      badge: 'DINNER HALT',
      badgeColor: 'text-amber-800 bg-amber-100/80 border-amber-300 font-bold',
      dotColor: 'bg-amber-500 ring-4 ring-amber-100',
      desc: 'Villupuram Highway Food Court & Rest Zone\nA2B Pure Veg • Sanitized Washrooms • EV Charging Zone',
      isHalt: true,
      distance: null
    },
    {
      time: '21:15',
      title: 'Ulundurpet Toll Plaza',
      badge: null,
      dotColor: 'bg-slate-300 ring-2 ring-slate-100',
      desc: 'NH 544 Turn-off junction',
      distance: 'Km 205'
    },
    {
      time: '23:00',
      title: 'Salem New Bus Stand Bypass',
      badge: null,
      dotColor: 'bg-slate-300 ring-2 ring-slate-100',
      desc: 'AVR Roundana Highway Service Bay',
      distance: 'Km 345'
    },
    {
      time: '00:15',
      title: 'Erode Bypass',
      badge: null,
      dotColor: 'bg-slate-300 ring-2 ring-slate-100',
      desc: 'Chithode Toll Gate drop point',
      distance: 'Km 412'
    },
    {
      time: '01:00',
      title: 'Avinashi New Bypass',
      badge: null,
      dotColor: 'bg-slate-300 ring-2 ring-slate-100',
      desc: 'Highway Junction',
      distance: 'Km 468'
    },
    {
      time: '01:45',
      title: 'Coimbatore KMCH / Hopes',
      badge: null,
      dotColor: 'bg-slate-300 ring-2 ring-slate-100',
      desc: 'Civil Aerodrome / Hopes College Stop',
      distance: 'Km 498'
    },
    {
      time: '02:15',
      title: 'Coimbatore (Final Destination)',
      badge: 'TERMINUS',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200 font-bold',
      dotColor: 'bg-emerald-600 ring-4 ring-emerald-100',
      desc: 'Gandhipuram Central Bus Stand (Omni Bus Stand Terminus)',
      distance: null
    }
  ];

  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
      {/* Official Corridor Itinerary Banner */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-teal-50/60 border border-teal-200/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0">
            <Route className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 leading-tight">
              Official Corridor Itinerary — 510 km
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Via NH 45 (GST Road) & NH 544 Express Highway
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-full whitespace-nowrap shadow-2xs">
          12 Stops • 1 Meal Halt
        </span>
      </div>

      {/* Timeline Stops */}
      <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {stops.map((stop, idx) => (
          <div key={idx} className="relative group">
            {/* Dot on line */}
            <div
              className={`absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full transition-transform ${stop.dotColor}`}
            />

            <div
              className={`p-2.5 rounded-xl border transition-all ${
                stop.isHalt
                  ? 'bg-amber-50/70 border-amber-200/90 shadow-2xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200/70'
              }`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-bold ${stop.isHalt ? 'text-amber-900' : 'text-slate-900'}`}>
                    {stop.time} {stop.title && `• ${stop.title}`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {stop.distance && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      {stop.distance}
                    </span>
                  )}
                  {stop.badge && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full border tracking-wide uppercase ${stop.badgeColor}`}
                    >
                      {stop.badge}
                    </span>
                  )}
                </div>
              </div>

              {stop.desc && (
                <p
                  className={`text-[11px] font-medium mt-0.5 whitespace-pre-line leading-relaxed ${
                    stop.isHalt ? 'text-amber-800' : 'text-slate-500'
                  }`}
                >
                  {stop.desc}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
