import React, { useState } from 'react';
import { User, Phone, Mail, Check, AlertCircle, X, Shield, MapPin } from 'lucide-react';

export default function PassengerDetails({
  selectedSeats = [],
  onBack,
  onProceedPayment,
  bus,
  passengersState = [],
  setPassengersState,
  contactState = { email: '', phone: '' },
  setContactState,
  selectedBoarding,
  setSelectedBoarding,
  selectedDropping,
  setSelectedDropping,
  bookingError = null,
  onDismissError = null,
  isCreatingBooking = false,
  onShowToast = null
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

  const defaultBoardingPoints = [
    {
      id: 'bp-1',
      pointId: 'bp-1',
      time: '21:30',
      name: 'Gandhipuram Omni Bus Stand',
      city: 'Coimbatore',
      badge: 'MAIN ORIGIN',
      address: 'Near Central RTO Terminal, Coimbatore',
      reportingTime: '21:15'
    },
    {
      id: 'bp-2',
      pointId: 'bp-2',
      time: '22:00',
      name: 'KMCH Hospital Avinashi Road',
      city: 'Coimbatore',
      badge: 'Stop #2',
      address: 'Opposite KMCH Gate, Avinashi Road, Coimbatore',
      reportingTime: '21:50'
    },
    {
      id: 'bp-3',
      pointId: 'bp-3',
      time: '22:30',
      name: 'Hopes College',
      city: 'Coimbatore',
      badge: 'Stop #3',
      address: 'Near Flyover Signal, Coimbatore',
      reportingTime: '22:20'
    }
  ];

  const defaultDroppingPoints = [
    {
      id: 'dp-1',
      pointId: 'dp-1',
      time: '05:30',
      name: 'Tambaram MEPZ',
      city: 'Chennai',
      badge: 'Stop #1',
      address: 'MEPZ Flyover Bus Stop, Chennai',
      reportingTime: '05:25'
    },
    {
      id: 'dp-2',
      pointId: 'dp-2',
      time: '05:45',
      name: 'Guindy Kathipara Junction',
      city: 'Chennai',
      badge: 'Stop #2',
      address: 'Near Kathipara Cloverleaf Bridge, Chennai',
      reportingTime: '05:40'
    },
    {
      id: 'dp-3',
      pointId: 'dp-3',
      time: '06:00',
      name: 'Koyambedu (CMBT)',
      city: 'Chennai',
      badge: 'TERMINUS',
      address: 'Omni Bus Stand Platform Gate 2, Chennai',
      reportingTime: '05:55'
    }
  ];

  const apiBoarding = (bus?.stops || []).filter(
    (s) => s.stopType === 'boarding' || s.stopType === 'both'
  );
  const boardingPoints = apiBoarding.length > 0
    ? apiBoarding.map((s, idx) => ({
        id: s._id || `bp-${idx}`,
        pointId: s._id || `bp-${idx}`,
        time: s.estimatedArrivalTime || s.scheduledTime || '21:30',
        name: s.name,
        city: s.city || bus?.departureCity || 'Coimbatore',
        badge: idx === 0 ? 'MAIN ORIGIN' : (s.isHalt ? 'HALT' : `Stop #${s.sequenceNumber || idx + 1}`),
        address: s.landmark ? `${s.landmark}${s.city ? `, ${s.city}` : ''}` : s.city || bus?.departureCity || 'Coimbatore',
        reportingTime: s.reportingTime || s.estimatedArrivalTime || '21:15'
      }))
    : defaultBoardingPoints;

  const apiDropping = (bus?.stops || []).filter(
    (s) => s.stopType === 'dropping' || s.stopType === 'both'
  );
  const droppingPoints = apiDropping.length > 0
    ? apiDropping.map((s, idx) => ({
        id: s._id || `dp-${idx}`,
        pointId: s._id || `dp-${idx}`,
        time: s.estimatedArrivalTime || s.scheduledTime || '06:00',
        name: s.name,
        city: s.city || bus?.arrivalCity || 'Chennai',
        badge: idx === apiDropping.length - 1 ? 'TERMINUS' : (s.isHalt ? 'HALT' : `Stop #${s.sequenceNumber || idx + 1}`),
        address: s.landmark ? `${s.landmark}${s.city ? `, ${s.city}` : ''}` : s.city || bus?.arrivalCity || 'Chennai',
        reportingTime: s.reportingTime || s.estimatedArrivalTime || '05:45'
      }))
    : defaultDroppingPoints;

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
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Provide identification details for each selected berth to proceed with booking confirmation.
        </p>
      </div>

      {/* Booking Error Notice */}
      {bookingError && (
        <div className="bg-rose-50/95 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-start justify-between gap-3 shadow-xs animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-rose-900">Passenger Validation Notice</div>
              <div className="text-xs text-rose-700 mt-0.5">{bookingError}</div>
            </div>
          </div>
          {onDismissError && (
            <button
              type="button"
              onClick={onDismissError}
              className="text-rose-400 hover:text-rose-700 p-1 rounded-lg transition-colors cursor-pointer"
              title="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Main Passenger Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Passenger Information
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {passengersState.length} Passenger{passengersState.length > 1 ? 's' : ''} allocated across {selectedSeats.length} berth{selectedSeats.length > 1 ? 's' : ''}
            </p>
          </div>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200/80 px-3 py-1 rounded-full">
            {selectedSeats.join(', ')}
          </span>
        </div>

        {/* Dynamic Passenger Fields for Each Selected Berth */}
        <div className="space-y-6">
          {passengersState.map((p, idx) => {
            const isUpper = p.seatId?.startsWith('U');
            const deckName = isUpper ? 'Upper Deck' : 'Lower Deck';
            const seatLabel = `Berth ${p.seatId} - ${deckName}`;
            const isFemaleRestricted = p.restrictedGender === 'female';
            const isMaleRestricted = p.restrictedGender === 'male';

            return (
              <div
                key={p.seatId || idx}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/40 space-y-4"
              >
                {/* Passenger Header Banner */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0F766E] text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      Passenger {idx + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isFemaleRestricted && (
                      <span className="text-[10px] font-bold text-[#FF7FCB] bg-rose-50 border border-[#FF7FCB] px-2 py-0.5 rounded-full">
                        Female Only (Adjacent Seat)
                      </span>
                    )}
                    {isMaleRestricted && (
                      <span className="text-[10px] font-bold text-[#6366F1] bg-indigo-50 border border-[#6366F1] px-2 py-0.5 rounded-full">
                        Male Only (Adjacent Seat)
                      </span>
                    )}
                    <span className="text-[11px] font-bold text-[#0F766E] bg-teal-50 border border-teal-200/70 px-2.5 py-0.5 rounded-full">
                      {seatLabel}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  {/* Full Name */}
                  <div className="md:col-span-6 space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      FULL NAME <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={p.name || ''}
                      onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)}
                      placeholder="e.g. Aarav Patel"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                    />
                    <p className="text-[10px] text-slate-400 font-medium">
                      Name as per Govt. issued photo ID card
                    </p>
                  </div>

                  {/* Age (Direct typing input field) */}
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      AGE <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={p.age || ''}
                      onChange={(e) => handlePassengerChange(idx, 'age', e.target.value)}
                      placeholder="e.g. 28"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-center"
                    />
                  </div>

                  {/* Gender Selection */}
                  <div className="md:col-span-4 space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      GENDER <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {/* Male Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (isFemaleRestricted) {
                            if (onShowToast) onShowToast('Adjacent berth is chosen by a female. This seat is reserved for females only.');
                            return;
                          }
                          handlePassengerChange(idx, 'gender', 'male');
                        }}
                        disabled={isFemaleRestricted}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          p.gender === 'male'
                            ? 'bg-[#0F766E] text-white shadow-xs'
                            : isFemaleRestricted
                            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Male
                      </button>

                      {/* Female Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (isMaleRestricted) {
                            if (onShowToast) onShowToast('Adjacent berth is chosen by a male. This seat is reserved for males only.');
                            return;
                          }
                          handlePassengerChange(idx, 'gender', 'female');
                        }}
                        disabled={isMaleRestricted}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          p.gender === 'female'
                            ? 'bg-[#FF7FCB] text-white shadow-xs'
                            : isMaleRestricted
                            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Female
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact & Booking Voucher Delivery */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              CONTACT & BOOKING VOUCHER DELIVERY
            </h4>
            <p className="text-[11px] text-slate-400 font-medium">
              Your ticket confirmation and live GPS bus tracking link will be sent here
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-600">
                <span className="pl-3 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={contactState.email || ''}
                  onChange={(e) => setContactState({ ...contactState, email: e.target.value })}
                  placeholder="e.g. aarav@example.com"
                  className="w-full text-xs sm:text-sm px-3 py-2.5 bg-white font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-600">
                <span className="px-3 py-2.5 bg-slate-50 border-r border-slate-200 text-xs font-bold text-slate-600 flex items-center">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength="10"
                  value={contactState.phone || ''}
                  onChange={(e) => setContactState({ ...contactState, phone: e.target.value })}
                  placeholder="9876543210"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
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
              {boardingPoints.length} Boarding Hubs
            </span>
          </div>

          <div className="space-y-2.5">
            {boardingPoints.map((point) => {
              const isSelected = selectedBoarding?.id === point.id || selectedBoarding?.pointId === point.pointId;
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
                Expected arrival time is subject to highway traffic conditions
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              {droppingPoints.length} Dropping Hubs
            </span>
          </div>

          <div className="space-y-2.5">
            {droppingPoints.map((point) => {
              const isSelected = selectedDropping?.id === point.id || selectedDropping?.pointId === point.pointId;
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
