import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Sun,
  SunMedium,
  Sunset,
  Moon,
  Search,
  Check,
  Star,
  X
} from 'lucide-react';

export default function BusFilters({
  filters,
  onFilterChange,
  onReset,
  isMobile = false,
  onCloseMobile
}) {
  const [boardingSearch, setBoardingSearch] = useState('');
  const [droppingSearch, setDroppingSearch] = useState('');

  // Default filter state structure if not passed
  const activeFilters = filters || {
    departurePeriods: ['night'], // 'early', 'morning', 'afternoon', 'night'
    busTypes: ['AC Sleeper'],
    ratings: [],
    amenities: ['Live GPS Tracking'],
    boardingPoints: ['Koyambedu (Omni Bus Stand)'],
    droppingPoints: ['Gandhipuram (Central Stand)']
  };

  const handleToggleDeparture = (period) => {
    const current = activeFilters.departurePeriods || [];
    const updated = current.includes(period)
      ? current.filter((p) => p !== period)
      : [...current, period];
    onFilterChange && onFilterChange({ ...activeFilters, departurePeriods: updated });
  };

  const handleToggleArrayItem = (category, value) => {
    const current = activeFilters[category] || [];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    onFilterChange && onFilterChange({ ...activeFilters, [category]: updated });
  };

  const departureSlots = [
    {
      id: 'early',
      title: 'Before 6 AM',
      subtitle: 'Early Morning',
      icon: Sun
    },
    {
      id: 'morning',
      title: '6 AM – 12 PM',
      subtitle: 'Morning',
      icon: SunMedium
    },
    {
      id: 'afternoon',
      title: '12 PM – 6 PM',
      subtitle: 'Afternoon',
      icon: Sunset
    },
    {
      id: 'night',
      title: 'After 6 PM',
      subtitle: 'Popular • Night',
      icon: Moon
    }
  ];

  const busTypeOptions = [
    { label: 'AC Sleeper', count: 18 },
    { label: 'Non-AC Sleeper', count: 4 },
    { label: 'Semi-Sleeper', count: 5 },
    { label: 'Seater', count: 1 }
  ];

  const ratingOptions = [
    { rating: 4.5, label: '4.5 and above', count: 12 },
    { rating: 4.0, label: '4.0 and above', count: 22 }
  ];

  const amenityOptions = [
    'Live GPS Tracking',
    'High-speed Wi-Fi',
    'Charging Socket',
    'Blanket & Pillow'
  ];

  const allBoardingPoints = [
    'Koyambedu (Omni Bus Stand)',
    'Guindy (Near Kathipara)',
    'Tambaram (Hindu Mission)'
  ];

  const allDroppingPoints = [
    'Gandhipuram (Central Stand)',
    'KMCH / Hopes College',
    'Omni Bus Terminus'
  ];

  const filteredBoarding = allBoardingPoints.filter((pt) =>
    pt.toLowerCase().includes(boardingSearch.toLowerCase())
  );

  const filteredDropping = allDroppingPoints.filter((pt) =>
    pt.toLowerCase().includes(droppingSearch.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-800">
          <SlidersHorizontal size={18} className="text-slate-600" />
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Filters
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition cursor-pointer"
          >
            Reset all
          </button>
          {isMobile && onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-slate-100 space-y-5 pt-4">
        {/* Section 1: DEPARTURE TIME */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              DEPARTURE TIME
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Chennai
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {departureSlots.map((slot) => {
              const Icon = slot.icon;
              const isSelected = activeFilters.departurePeriods?.includes(slot.id);

              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => handleToggleDeparture(slot.id)}
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl text-center cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'border-2 border-[#0A6A69] bg-[#EBF7F5]/50 shadow-xs'
                      : 'border border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <Icon
                    size={20}
                    className={
                      isSelected
                        ? 'text-[#0A6A69]'
                        : 'text-amber-500'
                    }
                  />
                  <span
                    className={`text-xs font-bold mt-1.5 leading-tight ${
                      isSelected ? 'text-[#0A6A69]' : 'text-slate-800'
                    }`}
                  >
                    {slot.title}
                  </span>
                  <span
                    className={`text-[10px] mt-0.5 leading-tight ${
                      isSelected
                        ? 'text-[#0A6A69] font-medium'
                        : 'text-slate-400'
                    }`}
                  >
                    {slot.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: BUS TYPE */}
        <div className="pt-4">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-3">
            BUS TYPE
          </span>

          <div className="space-y-2.5">
            {busTypeOptions.map((opt) => {
              const checked = activeFilters.busTypes?.includes(opt.label);

              return (
                <label
                  key={opt.label}
                  className="flex items-center justify-between group cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      onClick={() => handleToggleArrayItem('busTypes', opt.label)}
                      className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                        checked
                          ? 'bg-[#0A6A69] text-white'
                          : 'border border-slate-300 bg-white group-hover:border-slate-400'
                      }`}
                    >
                      {checked && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span
                      onClick={() => handleToggleArrayItem('busTypes', opt.label)}
                      className={`font-medium select-none ${
                        checked ? 'text-slate-900 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      {opt.label}
                    </span>
                  </div>
                  <span className="text-slate-400 font-medium">{opt.count}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Section 3: OPERATOR RATING */}
        <div className="pt-4">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-3">
            OPERATOR RATING
          </span>

          <div className="space-y-2.5">
            {ratingOptions.map((opt) => {
              const checked = activeFilters.ratings?.includes(opt.rating);

              return (
                <label
                  key={opt.rating}
                  className="flex items-center justify-between group cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      onClick={() => handleToggleArrayItem('ratings', opt.rating)}
                      className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                        checked
                          ? 'bg-[#0A6A69] text-white'
                          : 'border border-slate-300 bg-white group-hover:border-slate-400'
                      }`}
                    >
                      {checked && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span
                      onClick={() => handleToggleArrayItem('ratings', opt.rating)}
                      className="font-medium flex items-center gap-1 text-slate-700 select-none"
                    >
                      <Star size={13} className="text-amber-500 fill-amber-500" />
                      <span className="font-semibold text-slate-800">
                        {opt.label}
                      </span>
                    </span>
                  </div>
                  <span className="text-slate-400 font-medium">{opt.count}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Section 4: AMENITIES */}
        <div className="pt-4">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-3">
            AMENITIES
          </span>

          <div className="space-y-2.5">
            {amenityOptions.map((amenity) => {
              const checked = activeFilters.amenities?.includes(amenity);

              return (
                <label
                  key={amenity}
                  className="flex items-center justify-between group cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      onClick={() => handleToggleArrayItem('amenities', amenity)}
                      className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                        checked
                          ? 'bg-[#0A6A69] text-white'
                          : 'border border-slate-300 bg-white group-hover:border-slate-400'
                      }`}
                    >
                      {checked && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span
                      onClick={() => handleToggleArrayItem('amenities', amenity)}
                      className={`font-medium select-none ${
                        checked ? 'text-slate-900 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      {amenity}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Section 5: BOARDING POINT (CHENNAI) */}
        <div className="pt-4">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
            BOARDING POINT (CHENNAI)
          </span>

          {/* Search Input */}
          <div className="relative mb-3">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={boardingSearch}
              onChange={(e) => setBoardingSearch(e.target.value)}
              placeholder="Search boarding point"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A6A69] focus:bg-white transition"
            />
          </div>

          <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
            {filteredBoarding.map((point) => {
              const checked = activeFilters.boardingPoints?.includes(point);

              return (
                <label
                  key={point}
                  className="flex items-center group cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      onClick={() => handleToggleArrayItem('boardingPoints', point)}
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                        checked
                          ? 'bg-[#0A6A69] text-white'
                          : 'border border-slate-300 bg-white group-hover:border-slate-400'
                      }`}
                    >
                      {checked && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span
                      onClick={() => handleToggleArrayItem('boardingPoints', point)}
                      className={`font-medium select-none truncate ${
                        checked ? 'text-slate-900 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      {point}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Section 6: DROPPING POINT (COIMBATORE) */}
        <div className="pt-4">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
            DROPPING POINT (COIMBATORE)
          </span>

          {/* Search Input */}
          <div className="relative mb-3">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={droppingSearch}
              onChange={(e) => setDroppingSearch(e.target.value)}
              placeholder="Search dropping point"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A6A69] focus:bg-white transition"
            />
          </div>

          <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
            {filteredDropping.map((point) => {
              const checked = activeFilters.droppingPoints?.includes(point);

              return (
                <label
                  key={point}
                  className="flex items-center group cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      onClick={() => handleToggleArrayItem('droppingPoints', point)}
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                        checked
                          ? 'bg-[#0A6A69] text-white'
                          : 'border border-slate-300 bg-white group-hover:border-slate-400'
                      }`}
                    >
                      {checked && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span
                      onClick={() => handleToggleArrayItem('droppingPoints', point)}
                      className={`font-medium select-none truncate ${
                        checked ? 'text-slate-900 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      {point}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
