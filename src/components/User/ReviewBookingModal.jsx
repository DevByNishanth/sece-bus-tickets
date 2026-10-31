import React, { useState } from 'react';
import { ShieldCheck, X, Star, ArrowRight, Check, Loader2, AlertCircle } from 'lucide-react';
import { holdSeatsBooking, checkoutBooking } from '../../services/busService';
import redirectToPayU, { redirectToPayU as namedRedirectToPayU } from '../../Utils/payu';

const redirectPayU = (data) => {
  if (typeof redirectToPayU === 'function') {
    return redirectToPayU(data);
  }
  if (typeof namedRedirectToPayU === 'function') {
    return namedRedirectToPayU(data);
  }
};

export default function ReviewBookingModal({
  isOpen,
  onClose,
  onConfirm,
  bus,
  passengers = [],
  selectedSeats = [],
  selectedBoarding,
  selectedDropping,
  createdBooking = null,
  contactState = { email: '', phone: '' },
  journeyDate = '',
  onShowToast = null
}) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

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
  const baseTicketFare = createdBooking?.fareBreakdown?.baseFare || (seatFareSum > 0 ? seatFareSum : (bus?.price || 1100) * seatsCount);
  const insurance = createdBooking?.fareBreakdown?.insuranceCharges !== undefined ? createdBooking.fareBreakdown.insuranceCharges : 15.00 * seatsCount;
  const gst = createdBooking?.fareBreakdown?.taxes !== undefined ? createdBooking.fareBreakdown.taxes : Number((baseTicketFare * 0.05).toFixed(2));
  const discount = createdBooking?.fareBreakdown?.discount !== undefined ? createdBooking.fareBreakdown.discount : 0.00;
  const totalAmount = createdBooking?.totalAmount || createdBooking?.fareBreakdown?.totalPayable || Number((baseTicketFare + insurance + gst - discount).toFixed(2));

  const operatorName = bus?.operatorName || 'Sri Kumaran Travels';
  const busType = bus?.busType || 'Double Deck Sleeper (2+1) • Luxury Multi-Axle';
  const rating = bus?.rating || 4.8;
  const reviewsCount = bus?.reviewsCount || 1248;

  // Boarding and Dropping points matching actual journey points
  const boardingCity = selectedBoarding?.city || bus?.departureCity || 'Coimbatore';
  const droppingCity = selectedDropping?.city || bus?.arrivalCity || 'Chennai';
  const boardingTime = selectedBoarding?.time || selectedBoarding?.scheduledTime || bus?.departureTime || '21:30';
  const droppingTime = selectedDropping?.time || selectedDropping?.scheduledTime || bus?.arrivalTime || '06:00';
  const boardingStopName = selectedBoarding?.name || bus?.departurePoint || 'Gandhipuram Omni Bus Stand';
  const droppingStopName = selectedDropping?.name || bus?.droppingPoint || 'Koyambedu (CMBT)';
  const boardingAddress = selectedBoarding?.address || selectedBoarding?.landmark || '';
  const droppingAddress = selectedDropping?.address || selectedDropping?.landmark || '';
  const duration = bus?.duration || '05 hrs 55 mins';

  // Format journey date to YYYY-MM-DD
  const formatValidJourneyDate = (val) => {
    if (!val) {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }
    if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val.trim())) {
      return val.trim();
    }
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  const handleProceedPayment = async () => {
    setPaymentError(null);
    setIsProcessingPayment(true);

    const busId = bus?._id || bus?.busId || bus?.id || '6ae182b3b8b8254382be7639';
    const dateParam = formatValidJourneyDate(journeyDate || bus?.journeyDate);

    // 1. Trigger holdSeats in background while checkout payment is ongoing
    holdSeatsBooking({
      busId,
      journeyDate: dateParam,
      seatNumbers: selectedSeats
    }).catch((err) => {
      console.warn('Background seat hold note:', err);
    });

    // 2. Format passenger details payload for unified checkout API
    const formattedPassengerDetails = passengers.map((p, idx) => ({
      fullName: (p.name || '').trim() || `Passenger ${idx + 1}`,
      age: parseInt(p.age, 10) || 28,
      gender: (p.gender || 'male').toLowerCase() === 'female' ? 'Female' : 'Male',
      seatId: p.seatId || selectedSeats[idx] || `S${idx + 1}`
    }));

    const boardingPointId =
      selectedBoarding?.pointId ||
      selectedBoarding?.id ||
      'bp-1';

    const droppingPointId =
      selectedDropping?.pointId ||
      selectedDropping?.id ||
      'dp-1';

    const cleanEmail = (contactState?.email || '').trim() || 'aarav@example.com';
    const cleanPhone = (contactState?.phone || '').replace(/\D/g, '') || '9876543210';

    try {
      const result = await checkoutBooking({
        busId,
        journeyDate: dateParam,
        passengerDetails: formattedPassengerDetails,
        contactEmail: cleanEmail,
        contactPhone: cleanPhone,
        boardingPointId,
        droppingPointId,
        paymentMethod: 'UPI',
        upiType: 'checkout'
      });

      if (result.success && result.data?.payment) {
        if (onConfirm) {
          onConfirm({
            totalAmount,
            passengers,
            selectedSeats,
            booking: result.data.booking,
            payment: result.data.payment
          });
        }
        // Redirect to PayU Hosted Checkout using payu.js utility
        redirectPayU(result.data.payment);
      } else {
        const errorMsg = result.message || 'Payment initiation failed. Please try again.';
        setPaymentError(errorMsg);
        if (onShowToast) onShowToast(errorMsg);
        setIsProcessingPayment(false);
      }
    } catch (err) {
      const errorMsg = err.message || 'Unable to connect to payment server. Please try again.';
      setPaymentError(errorMsg);
      if (onShowToast) onShowToast(errorMsg);
      setIsProcessingPayment(false);
    }
  };

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
              {createdBooking?.bookingNumber && (
                <div className="mt-1">
                  <span className="text-[11px] font-mono font-bold bg-teal-50 border border-teal-200/90 text-[#0F766E] px-2.5 py-0.5 rounded-full inline-block">
                    Ref: {createdBooking.bookingNumber}
                  </span>
                </div>
              )}
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

            {/* Timing Banner - correctly matching boarding & dropping points */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
              <div className="text-left">
                <span className="text-base sm:text-lg font-extrabold text-slate-900 block">
                  {boardingTime}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {boardingStopName} ({boardingCity})
                </span>
              </div>

              <div className="flex-1 flex flex-col items-center px-3">
                <span className="text-[10px] text-slate-400 font-bold">
                  {duration}
                </span>
                <div className="w-full flex items-center gap-1 my-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                  <div className="flex-1 h-0.5 bg-teal-600" />
                  <ArrowRight className="w-3 h-3 text-teal-600 -ml-1" />
                </div>
                <span className="text-[10px] text-teal-700 font-bold">
                  {bus?.isNonStop ? 'Non-stop route' : 'Direct route'}
                </span>
              </div>

              <div className="text-right">
                <span className="text-base sm:text-lg font-extrabold text-slate-900 block">
                  {droppingTime}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {droppingStopName} ({droppingCity})
                </span>
              </div>
            </div>
          </div>

          {/* Passenger Allocation Pills */}
          <div className="space-y-2">
            {passengers.map((p, idx) => {
              const seatId = p.seatId || selectedSeats[idx] || `L0${idx + 1}`;
              const isUpper = seatId.startsWith('U');
              const deckLabel = isUpper ? 'Upper Deck' : 'Lower Deck';
              const displayName = p.name?.trim() ? p.name : `Passenger ${idx + 1}`;
              const genderText = p.gender ? (p.gender.charAt(0).toUpperCase() + p.gender.slice(1)) : 'Male';

              return (
                <div
                  key={seatId || idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-50/50 border border-teal-200/80 text-xs shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-[#0F766E] text-white font-extrabold flex items-center justify-center text-xs shadow-2xs">
                      {seatId}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        {displayName}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {p.age ? `Age ${p.age}` : 'Age not specified'} • {genderText}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-teal-800 bg-white border border-teal-200 px-3 py-1 rounded-full shadow-2xs">
                    {deckLabel}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Boarding and Dropping Timeline (Correctly Resolved) */}
          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {/* Boarding (Origin) */}
            <div className="relative">
              <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-[#0F766E] ring-4 ring-teal-100" />
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {boardingTime} • {boardingCity} (Origin Terminal)
                </span>
                <span className="text-[9px] font-bold text-[#0F766E] bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                  BOARDING
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-semibold mt-0.5">
                {boardingStopName}
              </p>
              {boardingAddress && boardingAddress !== boardingStopName && (
                <p className="text-[10px] text-slate-400 font-normal">
                  {boardingAddress}
                </p>
              )}
            </div>

            {/* Dropping (Final Destination) */}
            <div className="relative">
              <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {droppingTime} • {droppingCity} (Final Destination)
                </span>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  DROPPING
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-semibold mt-0.5">
                {droppingStopName}
              </p>
              {droppingAddress && droppingAddress !== droppingStopName && (
                <p className="text-[10px] text-slate-400 font-normal">
                  {droppingAddress}
                </p>
              )}
            </div>
          </div>

          {/* Fare Summary (Blue Highlighted Box) */}
          <div className="p-4 sm:p-5 rounded-2xl border-2 border-dashed border-teal-400 bg-teal-50/20 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Fare Summary
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Ticket Fare ({seatsCount} Seat{seatsCount > 1 ? 's' : ''})</span>
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

              {discount > 0 && (
                <div className="flex justify-between text-[#0F766E] font-semibold">
                  <span>Special Promotional Discount</span>
                  <span>- ₹{discount.toFixed(2)}</span>
                </div>
              )}

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

          {/* Payment Initiation Error Notice */}
          {paymentError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <div className="font-bold text-rose-900">Payment Initiation Failed</div>
                  <div className="text-[11px] text-rose-700 mt-0.5">{paymentError}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPaymentError(null)}
                className="text-rose-400 hover:text-rose-700 p-1 rounded-lg transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Buttons */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-3 rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessingPayment}
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleProceedPayment}
            disabled={isProcessingPayment}
            className="px-6 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D6962] active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isProcessingPayment ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirecting to PayU...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirm Booking & Proceed</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
