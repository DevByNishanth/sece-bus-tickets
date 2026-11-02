import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Printer,
  Home,
  Bookmark,
  Calendar,
  User,
  MapPin,
  Bus,
  CreditCard,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import BookingNavbar from '../../components/User/BookingNavbar';
import { fetchBookingDetails, fetchPaymentDetails } from '../../services/busService';

/**
 * Format ISO or date string to readable format e.g. "Sat, 15 Nov 2026"
 */
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return String(dateStr);
  }
};

/**
 * Format ISO or time string to readable 12-hour/24-hour format
 */
const formatTime = (timeStr) => {
  if (!timeStr) return '--:--';
  if (typeof timeStr === 'string' && /^\d{1,2}:\d{2}(\s*(AM|PM))?$/i.test(timeStr.trim())) {
    return timeStr.trim();
  }
  try {
    const d = new Date(timeStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  } catch {
    // ignore
  }
  return String(timeStr);
};

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read URL Query Parameters
  const bookingId = searchParams.get('bookingId') || searchParams.get('id') || '';
  const txnid = searchParams.get('txnid') || searchParams.get('txnId') || '';
  const urlStatus = (searchParams.get('status') || '').toLowerCase();

  // Component States
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [copiedTxn, setCopiedTxn] = useState(false);
  const [showFullTicketModal, setShowFullTicketModal] = useState(false);

  // Duplicate call prevention & unmount safety
  const isMountedRef = useRef(true);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fetch Booking Details & Payment Details in parallel
  const loadPaymentAndBooking = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    setLoading(true);
    setApiError(null);

    try {
      const promises = [];

      // 1. Fetch booking details
      if (bookingId) {
        promises.push(fetchBookingDetails(bookingId));
      } else {
        promises.push(Promise.resolve({ success: false, message: 'No bookingId in URL query', data: null }));
      }

      // 2. Fetch payment transaction details
      if (txnid) {
        promises.push(fetchPaymentDetails(txnid));
      } else {
        promises.push(Promise.resolve({ success: false, message: 'No txnid in URL query', data: null }));
      }

      const [bookingResult, paymentResult] = await Promise.all(promises);

      if (!isMountedRef.current) return;

      const hasBookingSuccess = bookingResult.success && Boolean(bookingResult.data);
      const hasPaymentSuccess = paymentResult.success && Boolean(paymentResult.data);

      if (hasBookingSuccess) {
        setBookingData(bookingResult.data);
      }

      if (hasPaymentSuccess) {
        setPaymentData(paymentResult.data);
      }

      // If both fail or have critical errors, inform the user
      if (!hasBookingSuccess && !hasPaymentSuccess) {
        const errorMsg =
          bookingResult.message ||
          paymentResult.message ||
          'Failed to retrieve booking and payment confirmation from the server.';
        setApiError(errorMsg);
      } else if (!hasBookingSuccess && bookingId) {
        setApiError(bookingResult.message || 'Unable to load complete booking details.');
      } else if (!hasPaymentSuccess && txnid) {
        // Payment endpoint note if booking loaded
        console.warn('[PaymentResult] Payment details note:', paymentResult.message);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setApiError(err.message || 'An unexpected error occurred while communicating with the server.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      isFetchingRef.current = false;
    }
  }, [bookingId, txnid]);

  useEffect(() => {
    loadPaymentAndBooking();
  }, [loadPaymentAndBooking]);

  // Copy Transaction ID to clipboard
  const handleCopyTxn = () => {
    const textToCopy = txnid || paymentData?.txnid || '';
    if (textToCopy && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopiedTxn(true);
        setTimeout(() => setCopiedTxn(false), 2000);
      });
    }
  };

  /**
   * Determine Authoritative Payment Status (Requirement 10)
   * Do not trust urlStatus alone; verify against backend records.
   */
  const getAuthoritativeStatus = () => {
    const payStatus = (paymentData?.status || '').toLowerCase();
    const bookPaymentStatus = (bookingData?.paymentStatus || '').toLowerCase();
    const bookStatus = (bookingData?.status || '').toLowerCase();

    const successKeywords = ['success', 'captured', 'completed', 'paid', 'successful'];
    const failedKeywords = ['failed', 'failure', 'error', 'bounced', 'cancelled', 'rejected'];

    // 1. Authoritative check from payment transaction record
    if (successKeywords.includes(payStatus)) return 'success';
    if (failedKeywords.includes(payStatus)) return 'failed';

    // 2. Authoritative check from booking record
    if (successKeywords.includes(bookPaymentStatus) || bookStatus === 'confirmed') return 'success';
    if (failedKeywords.includes(bookPaymentStatus) || bookStatus === 'cancelled' || bookStatus === 'failed') return 'failed';

    // 3. Backend pending status
    if (payStatus === 'pending' || payStatus === 'initiated' || bookPaymentStatus === 'pending') {
      return 'pending';
    }

    // 4. If backend record is unavailable or still processing:
    if (urlStatus === 'failed') return 'failed';
    if (urlStatus === 'success') {
      // If payment record not fetched yet or empty, show pending verification rather than fake success
      if (bookingData && bookStatus === 'pending') {
        return 'pending';
      }
      // If booking was loaded and is confirmed
      if (bookingData?.bookingNumber) {
        return 'success';
      }
      return 'pending';
    }

    return 'pending';
  };

  const authoritativeStatus = getAuthoritativeStatus();

  // Print Ticket Action
  const handlePrintTicket = () => {
    window.print();
  };

  // Safe field extractions
  const bookingNumber = bookingData?.bookingNumber || 'BK-PENDING';
  const ticketNumber = bookingData?.ticketNumber || `TK-${(bookingId || '').slice(-6).toUpperCase()}`;
  const busName = bookingData?.busName || 'Luxury Express Coach';
  const busNumber = bookingData?.busNumber || 'TN38BZ7887';
  const sourceCity = bookingData?.source || bookingData?.boardingPoint?.city || 'Origin City';
  const destinationCity = bookingData?.destination || bookingData?.droppingPoint?.city || 'Destination City';
  const departureDate = formatDate(bookingData?.journeyDate || bookingData?.departureTime);
  const departureTime = formatTime(bookingData?.boardingPoint?.scheduledTime || bookingData?.departureTime);
  const arrivalTime = formatTime(bookingData?.droppingPoint?.scheduledTime || bookingData?.arrivalTime);
  const seats = Array.isArray(bookingData?.seats) ? bookingData.seats : [];
  const passengers = Array.isArray(bookingData?.passengerDetails) ? bookingData.passengerDetails : [];
  const totalAmount = bookingData?.totalAmount || paymentData?.amount || 0;
  const boardingPoint = bookingData?.boardingPoint || {};
  const droppingPoint = bookingData?.droppingPoint || {};
  const qrCodeUrl = bookingData?.qrCode;

  // Payment details
  const displayTxnId = txnid || paymentData?.txnid || 'TXN-PENDING';
  const paymentMethod = paymentData?.paymentMethod || paymentData?.mode || 'UPI (PayU Checkout)';
  const paymentAmount = paymentData?.amount || totalAmount;
  const paymentTime = paymentData?.createdAt ? formatDate(paymentData.createdAt) + ' • ' + formatTime(paymentData.createdAt) : departureDate;
  const bankRefNum = paymentData?.bankRefNum || paymentData?.bank_ref_num || paymentData?.payuMoneyId || null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans relative text-slate-800 print:bg-white print:p-0">
      {/* 1. Header (Hidden during print) */}
      <div className="print:hidden">
        <BookingNavbar />
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Loading State Skeleton */}
        {loading && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-xs text-center space-y-4 animate-pulse">
            <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center mx-auto text-[#0F766E]">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Verifying Payment with Server...
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Fetching booking reference <span className="font-mono font-bold text-slate-700">{bookingId || txnid}</span> from PayU & BusGo gateway.
              </p>
            </div>
            <div className="max-w-md mx-auto pt-4 space-y-2.5">
              <div className="h-3 bg-slate-200 rounded-full w-3/4 mx-auto" />
              <div className="h-3 bg-slate-100 rounded-full w-1/2 mx-auto" />
            </div>
          </div>
        )}

        {/* API Error / Network Warning Banner (Requirement 9) */}
        {!loading && apiError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-900 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-950">Verification Notice</h4>
                <p className="text-xs text-rose-700 mt-0.5">{apiError}</p>
                <p className="text-[11px] text-rose-600 mt-1">
                  Payment confirmation requires authoritative status from the server.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={loadPaymentAndBooking}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Verification</span>
            </button>
          </div>
        )}

        {/* Main Content when loaded */}
        {!loading && (
          <>
            {/* HERO STATUS BANNER */}
            <div
              className={`rounded-3xl p-6 sm:p-8 border shadow-xs transition-all ${
                authoritativeStatus === 'success'
                  ? 'bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border-emerald-200 text-emerald-950'
                  : authoritativeStatus === 'failed'
                  ? 'bg-gradient-to-br from-rose-50 via-rose-50/30 to-white border-rose-200 text-rose-950'
                  : 'bg-gradient-to-br from-amber-50 via-amber-50/30 to-white border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
                {/* Status Icon */}
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                    authoritativeStatus === 'success'
                      ? 'bg-emerald-600 text-white ring-8 ring-emerald-100'
                      : authoritativeStatus === 'failed'
                      ? 'bg-rose-600 text-white ring-8 ring-rose-100'
                      : 'bg-amber-500 text-white ring-8 ring-amber-100'
                  }`}
                >
                  {authoritativeStatus === 'success' && <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11" />}
                  {authoritativeStatus === 'failed' && <XCircle className="w-9 h-9 sm:w-11 sm:h-11" />}
                  {authoritativeStatus === 'pending' && <Clock className="w-9 h-9 sm:w-11 sm:h-11 animate-pulse" />}
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <span
                      className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        authoritativeStatus === 'success'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : authoritativeStatus === 'failed'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {authoritativeStatus === 'success'
                        ? 'Confirmed Booking'
                        : authoritativeStatus === 'failed'
                        ? 'Payment Failed'
                        : 'Verification in Progress'}
                    </span>
                    {bookingData?.ticketNumber && authoritativeStatus === 'success' && (
                      <span className="text-[11px] font-mono font-bold bg-white text-teal-900 border border-teal-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                        Ticket: {bookingData.ticketNumber}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                    {authoritativeStatus === 'success' && 'Payment Successful!'}
                    {authoritativeStatus === 'failed' && 'Payment Failed'}
                    {authoritativeStatus === 'pending' && 'Payment Processing'}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl">
                    {authoritativeStatus === 'success' &&
                      'Your bus tickets are confirmed. A digital voucher along with passenger details has been registered.'}
                    {authoritativeStatus === 'failed' &&
                      'We could not process your transaction. If money was deducted, it will be automatically refunded by your bank within 3 to 5 business days.'}
                    {authoritativeStatus === 'pending' &&
                      'We are confirming your payment with PayU gateway and your bank. Please do not re-book or close this window.'}
                  </p>

                  {/* Summary Chips */}
                  <div className="pt-2 flex items-center justify-center sm:justify-start gap-2 sm:gap-3 flex-wrap text-xs">
                    <div className="bg-white/80 border border-slate-200/80 px-3 py-1 rounded-xl shadow-2xs">
                      <span className="text-slate-500">Ref: </span>
                      <span className="font-mono font-bold text-slate-900">{bookingNumber}</span>
                    </div>

                    <div className="bg-white/80 border border-slate-200/80 px-3 py-1 rounded-xl shadow-2xs">
                      <span className="text-slate-500">Total Paid: </span>
                      <span className="font-black text-slate-900">₹{totalAmount.toFixed(2)}</span>
                    </div>

                    <div className="bg-white/80 border border-slate-200/80 px-3 py-1 rounded-xl shadow-2xs">
                      <span className="text-slate-500">Gateway: </span>
                      <span className="font-bold text-[#0F766E]">{paymentMethod}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Header Action */}
                <div className="print:hidden shrink-0 flex flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  {authoritativeStatus === 'success' ? (
                    <button
                      type="button"
                      onClick={handlePrintTicket}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D6962] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print / Download Ticket</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate('/buses')}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Bus className="w-4 h-4" />
                      <span>Search Other Buses</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* TWO-COLUMN DETAILS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: DIGITAL BUS TICKET (Requirement 7 & 13) */}
              <div className="lg:col-span-7 space-y-6">
                {authoritativeStatus === 'success' ? (
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Ticket Header Ribbon */}
                    <div className="bg-[#0F766E] text-white p-5 sm:p-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                          <Bus className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-200 block">
                            CONFIRMED E-TICKET
                          </span>
                          <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                            {busName}
                          </h3>
                          <span className="text-xs text-teal-100 font-medium">
                            Bus No: <span className="font-mono font-bold text-white">{busNumber}</span>
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold text-teal-200 block">
                          TICKET NUMBER
                        </span>
                        <span className="text-xs sm:text-sm font-mono font-black text-white bg-white/15 px-2.5 py-0.5 rounded-lg border border-white/20 inline-block">
                          {ticketNumber}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-6">
                      {/* Journey Timing & Route Banner */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                          <span>JOURNEY ROUTE</span>
                          <span className="text-teal-700 font-semibold">{departureDate}</span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <div className="text-left flex-1">
                            <span className="text-lg sm:text-xl font-black text-slate-900 block">
                              {departureTime}
                            </span>
                            <span className="text-xs font-bold text-slate-700 block">
                              {sourceCity}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {boardingPoint.name || 'Main Origin Terminal'}
                            </span>
                          </div>

                          <div className="flex-1 flex flex-col items-center px-2">
                            <span className="text-[10px] text-slate-400 font-bold mb-1">
                              Direct Trip
                            </span>
                            <div className="w-full flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-teal-600" />
                              <div className="flex-1 h-0.5 bg-teal-600" />
                              <ArrowRight className="w-3.5 h-3.5 text-teal-600 -ml-1" />
                            </div>
                            <span className="text-[10px] font-bold text-teal-700 mt-1">
                              {seats.length} Berth{seats.length > 1 ? 's' : ''}
                            </span>
                          </div>

                          <div className="text-right flex-1">
                            <span className="text-lg sm:text-xl font-black text-slate-900 block">
                              {arrivalTime}
                            </span>
                            <span className="text-xs font-bold text-slate-700 block">
                              {destinationCity}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {droppingPoint.name || 'Terminus Drop Point'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Allocated Berths Badges */}
                      <div>
                        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                          <span>ALLOCATED SEATS / BERTHS</span>
                          <span className="text-xs font-semibold text-teal-700">
                            {seats.length} Total
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {seats.map((seatId) => {
                            const isUpper = seatId.startsWith('U');
                            return (
                              <div
                                key={seatId}
                                className="flex items-center gap-2 bg-teal-50 border border-teal-200/90 px-3 py-1.5 rounded-xl shadow-2xs"
                              >
                                <span className="w-7 h-7 rounded-lg bg-[#0F766E] text-white font-black text-xs flex items-center justify-center">
                                  {seatId}
                                </span>
                                <span className="text-xs font-bold text-teal-950">
                                  {isUpper ? 'Upper Deck' : 'Lower Deck'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Passenger Details Table */}
                      <div>
                        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          PASSENGER DETAILS
                        </div>

                        <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                          {passengers.map((p, idx) => (
                            <div
                              key={p._id || idx}
                              className="p-3 sm:p-3.5 flex items-center justify-between text-xs bg-white hover:bg-slate-50/50"
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[11px]">
                                  {idx + 1}
                                </span>
                                <div>
                                  <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                                    {p.name || p.fullName || `Passenger ${idx + 1}`}
                                  </span>
                                  <span className="text-[11px] text-slate-500">
                                    Age: {p.age || 28} • {p.gender || 'Male'}
                                  </span>
                                </div>
                              </div>

                              <span className="font-mono font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg">
                                Berth {p.seatNumber || p.seatId || seats[idx] || 'Assigned'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Boarding & Dropping Reporting Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/40 space-y-1">
                          <span className="text-[10px] font-bold text-[#0F766E] uppercase tracking-wider block">
                            BOARDING POINT
                          </span>
                          <span className="font-bold text-slate-900 block">
                            {boardingPoint.name || 'Gandhipuram Omni Bus Stand'}
                          </span>
                          <p className="text-[11px] text-slate-500">
                            {boardingPoint.landmark || boardingPoint.address || 'Near Central RTO Terminal, Coimbatore'}
                          </p>
                          <p className="text-[10px] font-bold text-teal-700 pt-1">
                            Reporting Time: {boardingPoint.reportingTime || '15 mins before departure'}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/40 space-y-1">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                            DROPPING POINT
                          </span>
                          <span className="font-bold text-slate-900 block">
                            {droppingPoint.name || 'Koyambedu (CMBT)'}
                          </span>
                          <p className="text-[11px] text-slate-500">
                            {droppingPoint.landmark || droppingPoint.address || 'Omni Bus Stand Platform Gate 2, Chennai'}
                          </p>
                          <p className="text-[10px] font-bold text-slate-500 pt-1">
                            Expected Drop: {arrivalTime}
                          </p>
                        </div>
                      </div>

                      {/* Digital QR Code & Barcode Section (Requirement 13) */}
                      <div className="pt-4 border-t border-dashed border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-teal-50/30 p-4 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 bg-white p-1.5 rounded-xl border border-teal-200/80 shadow-2xs shrink-0 flex items-center justify-center">
                            {qrCodeUrl ? (
                              <img src={qrCodeUrl} alt="Boarding QR Code" className="w-full h-full object-contain" />
                            ) : (
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                                  bookingNumber || ticketNumber || displayTxnId
                                )}&size=120x120&color=0F766E`}
                                alt="Digital Ticket QR"
                                className="w-full h-full object-contain"
                              />
                            )}
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F766E] block">
                              SMART BOARDING PASS
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                              Scan QR upon boarding
                            </h4>
                            <p className="text-[11px] text-slate-500 leading-tight">
                              Show this digital QR code to the bus conductor along with valid Govt. ID.
                            </p>
                          </div>
                        </div>

                        <div className="text-center sm:text-right shrink-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                            VERIFIED GATEWAY
                          </span>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-block mt-0.5">
                            ✓ PayU Secured
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Failed / Pending State Notice Card */
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          authoritativeStatus === 'failed'
                            ? 'bg-rose-100 text-rose-600'
                            : 'bg-amber-100 text-amber-600'
                        }`}
                      >
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">
                          {authoritativeStatus === 'failed'
                            ? 'Ticket Confirmation Withheld'
                            : 'Awaiting Bank Settlement'}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {authoritativeStatus === 'failed'
                            ? 'No ticket is generated because the payment did not clear.'
                            : 'Your seats are temporarily on hold while we verify transaction settlement.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Requested Journey</span>
                        <span className="font-semibold text-slate-800">
                          {sourceCity} → {destinationCity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Attempted Amount</span>
                        <span className="font-bold text-slate-900">₹{totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Booking Status</span>
                        <span
                          className={`font-bold capitalize ${
                            authoritativeStatus === 'failed' ? 'text-rose-600' : 'text-amber-600'
                          }`}
                        >
                          {authoritativeStatus === 'failed' ? 'Failed / Unpaid' : 'Pending Verification'}
                        </span>
                      </div>
                    </div>

                    {/* Retry Action for Failed Payment (Requirement 14) */}
                    {authoritativeStatus === 'failed' && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => navigate('/buses')}
                          className="w-full py-3 rounded-xl bg-[#0F766E] hover:bg-[#0D6962] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Retry Booking & Payment</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: TRANSACTION & PAYMENT DETAILS (Requirement 8 & 12) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Payment Receipt Card */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#0F766E]" />
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                        TRANSACTION DETAILS
                      </h4>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        authoritativeStatus === 'success'
                          ? 'bg-emerald-100 text-emerald-800'
                          : authoritativeStatus === 'failed'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {authoritativeStatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    {/* Transaction ID with Copy */}
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">
                          TRANSACTION ID
                        </span>
                        <span className="font-mono font-bold text-slate-900 text-xs">
                          {displayTxnId}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyTxn}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Copy Transaction ID"
                      >
                        {copiedTxn ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Booking Reference ID */}
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Booking Reference</span>
                      <span className="font-mono font-bold text-slate-900">{bookingNumber}</span>
                    </div>

                    {/* Payment Mode */}
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Payment Gateway</span>
                      <span className="font-semibold text-slate-900">{paymentMethod}</span>
                    </div>

                    {/* Bank Ref Number */}
                    {bankRefNum && (
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Bank Reference No.</span>
                        <span className="font-mono font-semibold text-slate-800">{bankRefNum}</span>
                      </div>
                    )}

                    {/* Date and Time */}
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Transaction Date</span>
                      <span className="font-medium text-slate-800">{paymentTime}</span>
                    </div>

                    {/* Fare Summary Breakdown */}
                    <div className="pt-2 space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Base Fare ({seats.length || 1} Berth{seats.length > 1 ? 's' : ''})</span>
                        <span className="font-semibold text-slate-900">
                          ₹{bookingData?.fareBreakdown?.baseFare || totalAmount}
                        </span>
                      </div>
                      {bookingData?.fareBreakdown?.insuranceCharges !== undefined && (
                        <div className="flex justify-between">
                          <span>Travel Insurance</span>
                          <span className="font-semibold text-slate-900">
                            ₹{bookingData.fareBreakdown.insuranceCharges}
                          </span>
                        </div>
                      )}
                      {bookingData?.fareBreakdown?.taxes !== undefined && (
                        <div className="flex justify-between">
                          <span>Taxes & GST (5%)</span>
                          <span className="font-semibold text-slate-900">
                            ₹{bookingData.fareBreakdown.taxes}
                          </span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between text-slate-900">
                        <span className="text-xs font-bold uppercase tracking-wider">TOTAL PAID</span>
                        <span className="text-xl font-black text-slate-900">
                          ₹{paymentAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Assurance */}
                  <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200/70 text-[11px] text-teal-900 font-medium flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>
                      Payment protected by 256-bit encryption. A copy of this voucher has been dispatched to{' '}
                      <span className="font-semibold">{bookingData?.contactDetails?.email || 'your registered email'}</span>.
                    </span>
                  </div>
                </div>

                {/* PRIMARY NAVIGATION ACTIONS (Requirement 12) */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-3 print:hidden">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    NEXT ACTIONS
                  </h4>

                  {/* 1. View / Print Ticket */}
                  {authoritativeStatus === 'success' && (
                    <button
                      type="button"
                      onClick={handlePrintTicket}
                      className="w-full py-3 px-4 rounded-xl bg-[#0F766E] hover:bg-[#0D6962] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-between transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Printer className="w-4 h-4" />
                        <span>View / Print E-Ticket</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}

                  {/* 2. My Bookings Button */}
                  <button
                    type="button"
                    onClick={() => navigate('/my-bookings')}
                    className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-teal-700" />
                      <span>View All My Bookings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* 3. Back to Home / Search Buses */}
                  <button
                    type="button"
                    onClick={() => navigate('/buses')}
                    className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-slate-500" />
                      <span>Back to Bus Search</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

