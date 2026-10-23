import React from 'react';
import { ShieldCheck, X, Star, ArrowRight, Check } from 'lucide-react';

export default function ReviewBookingModal({
  isOpen,
  onClose,
  onConfirm,
  bus,
  passengers = [],
  selectedSeats = ['L06'],
  selectedBoarding,
  selectedDropping
}) {
  if (!isOpen) return null;

  const allBerths = [
    ...(bus?.seatLayout?.lowerDeck?.rows?.flatMap((r) => r.berths) || []),
    ...(bus?.seatLayout?.upperDeck?.rows?.flatMap((r) => r.berths) || [])
  ];
  const seatFareSum = selectedSeats.reduce((acc, seatId) => {
    const found = allBerths.find((b) => b.seatNumber === seatId || b.berthId === seatId);
    return acc + (found?.fare || bus?.price || 1100);
  }, 0);
  const seatsCount = selectedSeats.length || 1;
  const baseTicketFare = seatFareSum > 0 ? seatFareSum : (bus?.price || 1100) * seatsCount;
  const insurance = 15.00;
  const gst = Number((baseTicketFare * 0.05).toFixed(2)); // 5% GST
  const discount = 150.00;
  const totalAmount = Number((baseTicketFare + insurance + gst - discount).toFixed(2));

  const operatorName = bus?.operatorName || 'Sri Kumaran Travels';
  const busType = bus?.busType || 'A/C Sleeper (2+1) • Multi-Axle Luxury Bharat Benz';
  const rating = bus?.rating || 4.6;
  const reviewsCount = bus?.reviewsCount || 456;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-100 flex flex-col custom-scrollbar">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Review Your Booking
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Verify journey details, passenger allocation, and fare
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-6 space-y-5 flex-1">
          {/* Operator and Bus Type */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
                  ★ PRIMO
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                  Top Rated
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#0F766E] px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-current" />
                  {rating}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {reviewsCount} reviews
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {operatorName}
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                {busType}
              </p>
            </div>

            {/* Timing Banner */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
              <div className="text-left">
                <span className="text-base sm:text-lg font-extrabold text-slate-900 block">
                  15:00
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Chennai (Koyambedu)
                </span>
              </div>

              <div className="flex-1 flex flex-col items-center px-3">
                <span className="text-[10px] text-slate-400 font-bold">
                  05 hrs 55 mins
                </span>
                <div className="w-full flex items-center gap-1 my-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                  <div className="flex-1 h-0.5 bg-teal-600" />
                  <ArrowRight className="w-3 h-3 text-teal-600 -ml-1" />
                </div>
                <span className="text-[10px] text-teal-700 font-bold">
                  Non-stop route
                </span>
              </div>

              <div className="text-right">
                <span className="text-base sm:text-lg font-extrabold text-slate-900 block">
                  20:55
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Gandhipuram, CBE
                </span>
              </div>
            </div>
          </div>

          {/* Passenger Allocation Pills */}
          <div className="space-y-2">
            {passengers.map((p, idx) => {
              const seatId = selectedSeats[idx] || `L0${idx + 1}`;
              const isUpper = seatId.startsWith('U');
              const deckLabel = isUpper ? 'Upper Deck' : 'Lower Deck';
              const displayName = p.name?.trim() ? p.name : idx === 0 ? 'Surya Chandran' : 'Venkateshwaran';

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-teal-50/50 border border-teal-200/80 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#0F766E] text-white font-extrabold flex items-center justify-center text-xs shadow-2xs">
                      {seatId}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {displayName}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-teal-800 bg-white border border-teal-200 px-3 py-1 rounded-full shadow-2xs">
                    {deckLabel}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Boarding and Dropping Timeline */}
          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {/* Boarding */}
            <div className="relative">
              <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-[#0F766E] ring-4 ring-teal-100" />
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {selectedBoarding?.time || '15:00'} • Chennai (Origin Terminal)
                </span>
                <span className="text-[9px] font-bold text-[#0F766E] bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                  BOARDING
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {selectedBoarding?.name || 'Koyambedu Omni Bus Stand (Platform 4, Gate B)'}
              </p>
            </div>

            {/* Dropping */}
            <div className="relative">
              <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {selectedDropping?.time || '02:15'} • Coimbatore (Final Destination)
                </span>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  DROPPING
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {selectedDropping?.name || 'Gandhipuram Central Bus Stand (Omni Bus Stand Terminus)'}
              </p>
            </div>
          </div>

          {/* Fare Summary (Blue Highlighted Box in Image 3) */}
          <div className="p-4 sm:p-5 rounded-2xl border-2 border-dashed border-teal-400 bg-teal-50/20 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Fare Summary
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Ticket Fare ({seatsCount} Seat)</span>
                <span className="font-semibold text-slate-900">₹{baseTicketFare.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>BusGo Shield Travel Insurance</span>
                <span className="font-semibold text-slate-900">₹{insurance.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Operator GST (5%)</span>
                <span className="font-semibold text-slate-900">₹{gst.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-[#0F766E] font-semibold">
                <span>Special Promotional Discount</span>
                <span>- ₹{discount.toFixed(2)}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-extrabold text-slate-900 block">
                    Total Amount
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Taxes & fees included
                  </span>
                </div>
                <span className="text-2xl font-black text-slate-900">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Cancellation Policy Amber Notice */}
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/90 text-[11px] text-amber-900 font-medium leading-relaxed">
              <span className="font-bold">Cancellation Policy:</span> Free cancellation available up to 4 hours prior to scheduled departure. 24x7 onboard helpline enabled.
            </div>
          </div>
        </div>

        {/* Modal Footer Buttons */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-3 rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirm({ totalAmount, passengers, selectedSeats })}
            className="px-6 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D6962] active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Confirm Booking & Proceed</span>
          </button>
        </div>
      </div>
    </div>
  );
}
