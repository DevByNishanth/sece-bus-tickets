import React, { useState } from 'react';
import { User, Phone, Mail, Check, Plus } from 'lucide-react';

export default function PassengerDetails({
  selectedSeats = ['L06'],
  onBack,
  onProceedPayment,
  bus,
  passengersState,
  setPassengersState,
  contactState,
  setContactState,
  selectedBoarding,
  setSelectedBoarding,
  selectedDropping,
  setSelectedDropping
}) {
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [showGst, setShowGst] = useState(false);
  const [gstNumber, setGstNumber] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handlePassengerChange = (index, field, value) => {
    setPassengersState((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const boardingPoints = [
    {
      id: 'bp-1',
      time: '15:00',
      name: 'Koyambedu Omni Bus Stand',
      badge: 'MAIN ORIGIN',
      address: 'Platform 4, Gate B (Near Chennai Metro Gate 2)',
      reportingTime: '14:45'
    },
    {
      id: 'bp-2',
      time: '15:45',
      name: 'Guindy Kathipara Flyover',
      badge: 'Km 14',
      address: 'Kathipara Junction near Metro Pillar 24, Chennai',
      reportingTime: '15:35'
    },
    {
      id: 'bp-3',
      time: '16:15',
      name: 'Tambaram',
      badge: 'Km 29',
      address: 'Opp. Hindu Mission Hospital / Main Highway Bay',
      reportingTime: '16:05'
    },
    {
      id: 'bp-4',
      time: '17:00',
      name: 'Paranur Toll Plaza',
      badge: 'Km 52',
      address: 'Chengalpattu Fastag Express Corridor',
      reportingTime: '16:50'
    }
  ];

  const droppingPoints = [
    {
      id: 'dp-1',
      time: '01:45',
      name: 'Coimbatore KMCH / Hopes',
      badge: 'Km 498',
      address: 'Civil Aerodrome / Hopes College Stop',
      reportingTime: '01:40'
    },
    {
      id: 'dp-2',
      time: '02:15',
      name: 'Gandhipuram Central Bus Stand',
      badge: 'TERMINUS',
      address: 'Omni Bus Stand Terminus (Platform 2)',
      reportingTime: '02:10'
    },
    {
      id: 'dp-3',
      time: '02:30',
      name: 'Omni Bus Terminus (Sathy Road)',
      badge: 'Km 506',
      address: 'Near Sathy Road Junction',
      reportingTime: '02:25'
    },
    {
      id: 'dp-4',
      time: '02:45',
      name: 'Ukkadam Bus Stand',
      badge: 'Km 510',
      address: 'South Bypass Road Terminal',
      reportingTime: '02:40'
    }
  ];

  return (
    <div className="space-y-5">
      {/* Step Header */}
      <div>
        <span className="inline-block text-[11px] font-bold tracking-wider uppercase text-[#0F766E] bg-teal-50 border border-teal-200/60 px-2.5 py-0.5 rounded-full mb-1">
          STEP 2 OF 4
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Enter Your Passenger Details
        </h2>
      </div>

      {/* Main Passenger Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Passenger Details
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Enter the Details of Passenger
          </p>
        </div>

        {/* Passenger Fields */}
        <div className="space-y-4">
          {passengersState.map((p, idx) => {
            const isUpper = p.seatId?.startsWith('U');
            const deckName = isUpper ? 'Upper Deck' : 'Lower Deck';
            const seatLabel = isUpper ? `Berth ${p.seatId} - Upper Deck` : `Berth ${p.seatId} - Lower Deck`;

            return (
              <div
                key={p.seatId || idx}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pb-5 border-b border-slate-100 last:border-0 last:pb-0"
              >
                {/* Full Name */}
                <div className="md:col-span-6 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      FULL NAME <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] font-bold text-[#0F766E] bg-teal-50 border border-teal-200/70 px-2 py-0.5 rounded-full">
                      {seatLabel}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)}
                    placeholder="e.g. Alexandre Moros"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                  />
                  <p className="text-[11px] text-slate-400 font-medium">
                    As per Govt. issued photo ID card
                  </p>
                </div>

                {/* Age */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    AGE <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={p.age}
                    onChange={(e) => handlePassengerChange(idx, 'age', e.target.value)}
                    placeholder="29"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-center"
                  />
                </div>

                {/* Gender */}
                <div className="md:col-span-4 space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    GENDER <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    {['male', 'female', 'other'].map((genderOption) => {
                      const isSelected = p.gender === genderOption;
                      return (
                        <button
                          key={genderOption}
                          type="button"
                          onClick={() => handlePassengerChange(idx, 'gender', genderOption)}
                          className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#0F766E] text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {genderOption === 'male' ? 'Male' : genderOption === 'female' ? 'Female' : 'Other'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact & Booking Voucher Delivery */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            CONTACT & BOOKING VOUCHER DELIVERY
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">
                Email Address
              </label>
              <input
                type="email"
                value={contactState.email}
                onChange={(e) => setContactState({ ...contactState, email: e.target.value })}
                placeholder="alexandre.m@example.com"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">
                Mobile Number
              </label>
              <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-600">
                <span className="px-3 py-2.5 bg-slate-50 border-r border-slate-200 text-xs font-bold text-slate-600 flex items-center">
                  +91
                </span>
                <input
                  type="tel"
                  value={contactState.phone}
                  onChange={(e) => setContactState({ ...contactState, phone: e.target.value })}
                  placeholder="98765 43210"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white font-medium text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* WhatsApp Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="whatsapp-check"
              checked={whatsappUpdates}
              onChange={(e) => setWhatsappUpdates(e.target.checked)}
              className="w-4 h-4 rounded text-teal-700 focus:ring-teal-500 accent-[#0F766E] cursor-pointer"
            />
            <label htmlFor="whatsapp-check" className="text-xs font-medium text-slate-700 cursor-pointer">
              Send booking confirmation & live GPS tracking link on WhatsApp
            </label>
          </div>

          {/* GST Details Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowGst(!showGst)}
              className="text-xs font-bold text-[#0F766E] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>+ Add GST Details for Business Travel (Claim input tax credit)</span>
            </button>

            {showGst && (
              <div className="mt-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase mb-1 block">GST Identification Number</label>
                  <input
                    type="text"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    placeholder="e.g. 29AAAAA0000A1Z5"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white uppercase font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase mb-1 block">Registered Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Tech Solutions Pvt Ltd"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Boarding and Dropping Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Boarding Hubs Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Choose your Boarding Point
              </h4>
              <p className="text-[11px] text-slate-400 font-medium">
                Please arrive 15 minutes before the reporting time
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              4 Boarding Hubs
            </span>
          </div>

          <div className="space-y-2.5">
            {boardingPoints.map((point) => {
              const isSelected = selectedBoarding.id === point.id;
              return (
                <div
                  key={point.id}
                  onClick={() => setSelectedBoarding(point)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#0F766E] bg-teal-50/40 ring-1 ring-[#0F766E]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-[#0F766E]' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-[#0F766E]" />}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          {point.time} {point.name}
                        </span>
                        <span className="text-[9px] font-bold text-[#0F766E] bg-teal-100/70 px-1.5 py-0.5 rounded-full">
                          {point.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {point.address}
                      </p>
                      <p className="text-[10px] font-bold text-teal-700 mt-1">
                        Reporting Time: {point.reportingTime}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dropping Hubs Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Choose your Dropping Point
              </h4>
              <p className="text-[11px] text-slate-400 font-medium">
                Please arrive 15 minutes before the reporting time
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              4 Dropping Hubs
            </span>
          </div>

          <div className="space-y-2.5">
            {droppingPoints.map((point) => {
              const isSelected = selectedDropping.id === point.id;
              return (
                <div
                  key={point.id}
                  onClick={() => setSelectedDropping(point)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#0F766E] bg-teal-50/40 ring-1 ring-[#0F766E]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-[#0F766E]' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-[#0F766E]" />}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          {point.time} {point.name}
                        </span>
                        <span className="text-[9px] font-bold text-[#0F766E] bg-teal-100/70 px-1.5 py-0.5 rounded-full">
                          {point.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {point.address}
                      </p>
                      <p className="text-[10px] font-bold text-teal-700 mt-1">
                        Reporting Time: {point.reportingTime}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
