import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, AlertCircle, X } from 'lucide-react';
import BookingNavbar from '../../components/User/BookingNavbar';
import BookingProcess from '../../components/User/BookingProcess';
import SeatStatusDisplay from '../../components/User/SeatStatusDisplay';
import SeatSelection from '../../components/User/SeatSelection';
import BusDetails from '../../components/User/BusDetails';
import BookingContinueProcess from '../../components/User/BookingContinueProcess';
import PassengerDetails from '../../components/User/PassengerDetails';
import ReviewBookingModal from '../../components/User/ReviewBookingModal';
import { holdSeatsBooking, fetchBusSeatLayout } from '../../services/busService';
import redirectToPayU, { redirectToPayU as namedRedirectToPayU } from '../../Utils/payu';

const redirectPayU = (data) => {
  if (typeof redirectToPayU === 'function') {
    return redirectToPayU(data);
  }
  if (typeof namedRedirectToPayU === 'function') {
    return namedRedirectToPayU(data);
  }
};

const getTodayDateStr = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export default function TicketBooking() {
  const location = useLocation();
  const navigate = useNavigate();

  // Selected bus data with fallback matching live backend route
  const initialBus = location.state?.bus || {
    id: '6adb0a1474060137dbb0aa97',
    _id: '6adb0a1474060137dbb0aa97',
    busId: '6adb0a1474060137dbb0aa97',
    operatorName: 'Sri Kumaran Travels',
    busType: 'A/C Sleeper (2+1) • Multi-Axle Luxury Bharat Benz',
    rating: 4.6,
    reviewsCount: 456,
    departureTime: '21:30',
    departureCity: 'Coimbatore',
    departurePoint: 'Gandhipuram Omni Bus Stand',
    arrivalTime: '06:00',
    arrivalCity: 'Chennai',
    droppingPoint: 'Koyambedu (CMBT)',
    duration: '05 hrs 55 mins',
    price: 650,
    originalPrice: 999
  };

  const [bus, setBus] = useState(initialBus);

  const searchParams = location.state?.searchParams || {
    from: 'Coimbatore',
    to: 'Chennai',
    date: getTodayDateStr(),
    passengers: '1 Traveller (All seats)'
  };

  // All berths for fare lookup
  const allBerths = [
    ...(bus.seatLayout?.lowerDeck?.rows?.flatMap((r) => r.berths) || []),
    ...(bus.seatLayout?.upperDeck?.rows?.flatMap((r) => r.berths) || [])
  ];

  const getBerthFare = (seatId) => {
    const found = allBerths.find((b) => b.seatNumber === seatId || b.berthId === seatId);
    return found?.fare || bus.price || 650;
  };

  // State: Default selected seats starts empty
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Floating bottom-right toast message (matching TripOffers coupon toast)
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Seat Hold API State
  const [isHoldingSeats, setIsHoldingSeats] = useState(false);
  const [holdError, setHoldError] = useState(null);
  const [holdData, setHoldData] = useState(null);
  const [conflictedSeats, setConflictedSeats] = useState([]);

  // Held seats tracking: { [seatNumber]: { seatNumber, heldAt, expiresAt, remainingSeconds, status: 'held' } }
  // 600 seconds = 10 minutes hold
  const [heldSeats, setHeldSeats] = useState(() => {
    try {
      const busKey = `sece_held_seats_${initialBus._id || initialBus.busId || initialBus.id}`;
      const saved = sessionStorage.getItem(busKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const now = Date.now();
        const valid = {};
        Object.keys(parsed).forEach((seatId) => {
          if (parsed[seatId] && parsed[seatId].expiresAt > now) {
            valid[seatId] = {
              ...parsed[seatId],
              remainingSeconds: Math.ceil((parsed[seatId].expiresAt - now) / 1000)
            };
          }
        });
        return valid;
      }
    } catch {
      // ignore storage error
    }
    return {};
  });

  // Confirmed permanently booked seats
  const [confirmedBookedSeats, setConfirmedBookedSeats] = useState([]);
  const [statusNotification, setStatusNotification] = useState(null);
  const [isRefreshingSeats, setIsRefreshingSeats] = useState(false);

  // Booking details state
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [createdBooking, setCreatedBooking] = useState(null);

  // Passengers State starts empty
  const [passengersState, setPassengersState] = useState([]);

  // Contact Info State starts empty
  const [contactState, setContactState] = useState({
    email: '',
    phone: ''
  });

  // Persist heldSeats to sessionStorage
  useEffect(() => {
    try {
      const busKey = `sece_held_seats_${bus._id || bus.busId || bus.id}`;
      sessionStorage.setItem(busKey, JSON.stringify(heldSeats));
    } catch {
      // ignore
    }
  }, [heldSeats, bus]);

  // 1-second countdown interval for held seats (600s = 10 mins)
  useEffect(() => {
    const activeSeats = Object.values(heldSeats).filter((s) => s && s.remainingSeconds > 0);
    if (activeSeats.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const expiredSeats = [];

      setHeldSeats((prev) => {
        let hasChanges = false;
        const next = { ...prev };

        Object.keys(next).forEach((seatNum) => {
          const item = next[seatNum];
          if (item && item.remainingSeconds > 0) {
            const remaining = Math.max(0, Math.ceil((item.expiresAt - now) / 1000));
            if (remaining !== item.remainingSeconds) {
              hasChanges = true;
              next[seatNum] = { ...item, remainingSeconds: remaining };
            }
            if (remaining <= 0) {
              expiredSeats.push(seatNum);
            }
          }
        });

        return hasChanges ? next : prev;
      });

      if (expiredSeats.length > 0) {
        handleHoldExpired(expiredSeats);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [heldSeats]);

  // Normalize journeyDate to YYYY-MM-DD
  const formatJourneyDateParam = (val) => {
    if (!val) return getTodayDateStr();
    if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val.trim())) {
      return val.trim();
    }
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
    return getTodayDateStr();
  };

  // Handle hold expiration after 600 seconds (10 minutes)
  const handleHoldExpired = async (seatNumbersToCheck) => {
    const seatsArray = Array.isArray(seatNumbersToCheck) ? seatNumbersToCheck : [seatNumbersToCheck];
    if (seatsArray.length === 0) return;

    const busId = bus._id || bus.busId || bus.id;
    const journeyDate = formatJourneyDateParam(searchParams.rawDate || searchParams.date);

    try {
      const freshBus = await fetchBusSeatLayout({
        busId,
        journeyDate,
        source: searchParams.from,
        destination: searchParams.to
      });

      if (freshBus && freshBus.seatLayout) {
        const allFreshBerths = [
          ...(freshBus.seatLayout.lowerDeck?.rows?.flatMap((r) => r.berths) || []),
          ...(freshBus.seatLayout.upperDeck?.rows?.flatMap((r) => r.berths) || [])
        ];

        const newlyBooked = [];
        const newlyRevoked = [];

        seatsArray.forEach((seatNum) => {
          const berth = allFreshBerths.find(
            (b) => (b.seatNumber || b.berthId) === seatNum
          );
          if (berth && berth.available === false) {
            newlyBooked.push(seatNum);
          } else {
            newlyRevoked.push(seatNum);
          }
        });

        setBus(freshBus);

        setHeldSeats((prev) => {
          const next = { ...prev };
          seatsArray.forEach((s) => delete next[s]);
          return next;
        });

        if (newlyBooked.length > 0) {
          setConfirmedBookedSeats((prev) => Array.from(new Set([...prev, ...newlyBooked])));
          setStatusNotification({
            type: 'booked',
            message: `Seat(s) ${newlyBooked.join(', ')} were confirmed booked by the passenger and are now permanently booked.`
          });
        }

        if (newlyRevoked.length > 0) {
          setStatusNotification({
            type: 'available',
            message: `10-minute hold on Seat(s) ${newlyRevoked.join(', ')} expired without booking. Seat is now available for booking!`
          });
        }
      } else {
        setHeldSeats((prev) => {
          const next = { ...prev };
          seatsArray.forEach((s) => delete next[s]);
          return next;
        });
        setStatusNotification({
          type: 'available',
          message: `10-minute hold on Seat(s) ${seatsArray.join(', ')} expired. Seat is now available for booking!`
        });
      }
    } catch {
      setHeldSeats((prev) => {
        const next = { ...prev };
        seatsArray.forEach((s) => delete next[s]);
        return next;
      });
      setStatusNotification({
        type: 'available',
        message: `10-minute hold on Seat(s) ${seatsArray.join(', ')} expired. Seat is now available for booking!`
      });
    }
  };

  const handleRefreshSeatStatus = async () => {
    const activeSeatKeys = Object.keys(heldSeats);
    if (activeSeatKeys.length === 0) return;

    setIsRefreshingSeats(true);
    await handleHoldExpired(activeSeatKeys);
    setIsRefreshingSeats(false);
  };

  const handleFastForwardHold = () => {
    const activeSeatKeys = Object.keys(heldSeats);
    if (activeSeatKeys.length === 0) return;
    handleHoldExpired(activeSeatKeys);
  };

  // Extract initial boarding & dropping points from API stops
  const boardingStops = (bus.stops || []).filter(
    (s) => s.stopType === 'boarding' || s.stopType === 'both'
  );
  const droppingStops = (bus.stops || []).filter(
    (s) => s.stopType === 'dropping' || s.stopType === 'both'
  );

  const initialBoardingStop = boardingStops[0] || {
    id: 'bp-1',
    pointId: 'bp-1',
    name: bus.departurePoint || 'Gandhipuram Omni Bus Stand',
    estimatedArrivalTime: bus.departureTime || '21:30',
    landmark: 'Near Central RTO',
    city: bus.departureCity || 'Coimbatore'
  };

  const initialDroppingStop = droppingStops[droppingStops.length - 1] || {
    id: 'dp-1',
    pointId: 'dp-1',
    name: bus.droppingPoint || 'Koyambedu (CMBT)',
    estimatedArrivalTime: bus.arrivalTime || '06:00',
    landmark: 'Omni Bus Stand Platform Gate 2',
    city: bus.arrivalCity || 'Chennai'
  };

  // Boarding and Dropping Points State
  const [selectedBoarding, setSelectedBoarding] = useState({
    id: initialBoardingStop._id || 'bp-1',
    pointId: initialBoardingStop._id || 'bp-1',
    time: initialBoardingStop.estimatedArrivalTime || bus.departureTime || '21:30',
    name: initialBoardingStop.name,
    city: initialBoardingStop.city || bus.departureCity || 'Coimbatore',
    badge: 'MAIN ORIGIN',
    address: initialBoardingStop.landmark || `${initialBoardingStop.name}, ${initialBoardingStop.city || ''}`,
    reportingTime: initialBoardingStop.estimatedArrivalTime || '21:15'
  });

  const [selectedDropping, setSelectedDropping] = useState({
    id: initialDroppingStop._id || 'dp-1',
    pointId: initialDroppingStop._id || 'dp-1',
    time: initialDroppingStop.estimatedArrivalTime || bus.arrivalTime || '06:00',
    name: initialDroppingStop.name,
    city: initialDroppingStop.city || bus.arrivalCity || 'Chennai',
    badge: 'TERMINUS',
    address: initialDroppingStop.landmark || `${initialDroppingStop.name}, ${initialDroppingStop.city || ''}`,
    reportingTime: initialDroppingStop.estimatedArrivalTime || '05:45'
  });

  // Keep Boarding & Dropping synchronized with loaded bus stops
  useEffect(() => {
    if (bus?.stops && bus.stops.length > 0) {
      const bStops = bus.stops.filter((s) => s.stopType === 'boarding' || s.stopType === 'both');
      const dStops = bus.stops.filter((s) => s.stopType === 'dropping' || s.stopType === 'both');

      if (bStops.length > 0) {
        const b = bStops[0];
        setSelectedBoarding({
          id: b._id || 'bp-1',
          pointId: b._id || 'bp-1',
          time: b.estimatedArrivalTime || b.scheduledTime || bus.departureTime || '21:30',
          name: b.name,
          city: b.city || bus.departureCity || 'Coimbatore',
          badge: 'MAIN ORIGIN',
          address: b.landmark ? `${b.landmark}${b.city ? `, ${b.city}` : ''}` : b.city || bus.departureCity || 'Coimbatore',
          reportingTime: b.reportingTime || b.estimatedArrivalTime || '21:15'
        });
      }

      if (dStops.length > 0) {
        const d = dStops[dStops.length - 1];
        setSelectedDropping({
          id: d._id || 'dp-1',
          pointId: d._id || 'dp-1',
          time: d.estimatedArrivalTime || d.scheduledTime || bus.arrivalTime || '06:00',
          name: d.name,
          city: d.city || bus.arrivalCity || 'Chennai',
          badge: 'TERMINUS',
          address: d.landmark ? `${d.landmark}${d.city ? `, ${d.city}` : ''}` : d.city || bus.arrivalCity || 'Chennai',
          reportingTime: d.reportingTime || d.estimatedArrivalTime || '05:45'
        });
      }
    }
  }, [bus]);

  // Toggle seat selection
  const handleToggleSeat = (seatId, requiredGender = null) => {
    const isCurrentlyHeld = Boolean(heldSeats[seatId] && heldSeats[seatId].remainingSeconds > 0);
    const isPermanentlyBooked = confirmedBookedSeats.includes(seatId);
    if (isCurrentlyHeld || isPermanentlyBooked) {
      return;
    }

    setHoldError(null);
    setSelectedSeats((prev) => {
      let updated;
      if (prev.includes(seatId)) {
        updated = prev.filter((id) => id !== seatId);
      } else {
        updated = [...prev, seatId];
      }

      // Sync passengers array with selected seats preserving entered details
      setPassengersState((prevPassengers) => {
        return updated.map((id) => {
          const existing = prevPassengers.find((p) => p.seatId === id);
          if (existing) {
            return {
              ...existing,
              restrictedGender: requiredGender || existing.restrictedGender || null
            };
          }
          return {
            seatId: id,
            name: '',
            age: '',
            gender: requiredGender || 'male',
            restrictedGender: requiredGender || null
          };
        });
      });

      return updated;
    });
  };

  // Compute description of selected seats for the footer
  const getSelectedSeatDescription = () => {
    if (selectedSeats.length === 0) {
      return {
        deck: 'No seat selected',
        type: 'Select a berth to continue'
      };
    }
    const hasLower = selectedSeats.some((id) => id.startsWith('L'));
    const hasUpper = selectedSeats.some((id) => id.startsWith('U'));

    let deck = 'Lower Deck';
    if (hasLower && hasUpper) deck = 'Lower & Upper Deck';
    else if (hasUpper) deck = 'Upper Deck';

    return {
      deck,
      type: `${selectedSeats.length} Berth${selectedSeats.length > 1 ? 's' : ''} Selected`
    };
  };

  // Handle Continue button: validates fields and transitions steps
  const handleContinue = () => {
    if (currentStep === 1) {
      if (selectedSeats.length === 0) {
        showToast('Please select at least one seat to continue.');
        return;
      }
      // Step 1 to Step 2: Smooth transition without premature blocking hold
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 2) {
      if (selectedSeats.length === 0) {
        showToast('Please select at least one seat.');
        return;
      }

      // Validate all passenger details
      for (let i = 0; i < passengersState.length; i++) {
        const p = passengersState[i];
        const berthLabel = p.seatId ? `Berth ${p.seatId}` : `Seat ${i + 1}`;
        if (!p.name || !p.name.trim()) {
          showToast(`Please enter full name for Passenger ${i + 1} (${berthLabel}).`);
          return;
        }
        const ageNum = parseInt(p.age, 10);
        if (!p.age || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
          showToast(`Please enter a valid age (1-120) for Passenger ${i + 1} (${berthLabel}).`);
          return;
        }
        if (!p.gender || !p.gender.trim()) {
          showToast(`Please select gender for Passenger ${i + 1} (${berthLabel}).`);
          return;
        }
      }

      // Validate Contact Information
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!contactState.email || !emailRegex.test(contactState.email.trim())) {
        showToast('Please enter a valid email address for booking voucher.');
        return;
      }
      const phoneDigits = (contactState.phone || '').replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        showToast('Please enter a valid 10-digit mobile number.');
        return;
      }

      // Validate Boarding and Dropping Points
      if (!selectedBoarding || (!selectedBoarding.id && !selectedBoarding.pointId)) {
        showToast('Please select a boarding point.');
        return;
      }
      if (!selectedDropping || (!selectedDropping.id && !selectedDropping.pointId)) {
        showToast('Please select a dropping point.');
        return;
      }

      // All validations passed -> Open Review Your Booking modal
      setIsReviewModalOpen(true);
    }
  };

  const handleConfirmAndProceed = (bookingData) => {
    if (bookingData?.payment) {
      redirectPayU(bookingData.payment);
    }
  };

  const handleBackToSearch = () => {
    navigate('/buses');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans relative overflow-x-hidden mb-20">
      {/* 1. Header / Navbar */}
      <BookingNavbar />

      {/* 2. Main Booking Body */}
      <main className="relative z-10 flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-36">
        {/* Route Banner & 4-Step Indicator */}
        <BookingProcess
          from={searchParams.from || 'Coimbatore'}
          to={searchParams.to || 'Chennai'}
          date={searchParams.date || getTodayDateStr()}
          passengers={searchParams.passengers || `${selectedSeats.length || 1} Traveller(s)`}
          currentStep={currentStep}
          onStepChange={(step) => {
            if (step === 1) {
              setCurrentStep(1);
            } else if (step === 2 && currentStep === 1) {
              handleContinue();
            }
          }}
          onBack={handleBackToSearch}
        />

        {/* Step 1: Seat Selection View */}
        {currentStep === 1 && (
          <div className="space-y-4 sm:space-y-5">
            {/* Step 1 Header & Seat Status Legend */}
            <SeatStatusDisplay />

            {/* Grid Layout: Left Decks (Lower + Upper) & Right Bus Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Lower Deck & Upper Deck Seat Maps */}
              <div className="lg:col-span-7 xl:col-span-7">
                <SeatSelection
                  selectedSeats={selectedSeats}
                  passengersState={passengersState}
                  onToggleSeat={handleToggleSeat}
                  busFare={bus.price || 650}
                  bus={bus}
                  heldSeats={heldSeats}
                  confirmedBookedSeats={confirmedBookedSeats}
                  conflictedSeats={conflictedSeats}
                  holdError={holdError}
                  onDismissError={() => setHoldError(null)}
                  statusNotification={statusNotification}
                  onDismissNotification={() => setStatusNotification(null)}
                  onRefreshSeatStatus={handleRefreshSeatStatus}
                  onFastForwardHold={handleFastForwardHold}
                  isRefreshingSeats={isRefreshingSeats}
                />
              </div>

              {/* Right Column: Bus Operator, Timing, Photos, Tabs, Assurance */}
              <div className="lg:col-span-5 xl:col-span-5">
                <BusDetails bus={bus} />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Passenger Details View */}
        {currentStep === 2 && (
          <div className="space-y-4">
            {/* Active Seat Hold Confirmation Banner */}
            {holdData && (
              <div className="bg-teal-50/90 border border-teal-200/90 text-[#0F766E] p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-xs animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-teal-950">
                      Seats Reserved for 10 Minutes
                    </div>
                    <div className="text-[11px] sm:text-xs text-teal-700">
                      Berth(s) {holdData.seatNumbers?.join(', ') || selectedSeats.join(', ')} are temporarily locked exclusively for your booking.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-semibold text-teal-800 self-end sm:self-auto">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>Hold ID: <span className="font-mono font-bold">{holdData.holdId}</span></span>
                </div>
              </div>
            )}

            <PassengerDetails
              selectedSeats={selectedSeats}
              bus={bus}
              passengersState={passengersState}
              setPassengersState={setPassengersState}
              contactState={contactState}
              setContactState={setContactState}
              selectedBoarding={selectedBoarding}
              setSelectedBoarding={setSelectedBoarding}
              selectedDropping={selectedDropping}
              setSelectedDropping={setSelectedDropping}
              onBack={() => setCurrentStep(1)}
              onProceedPayment={handleContinue}
              bookingError={bookingError}
              onDismissError={() => setBookingError(null)}
              isCreatingBooking={isCreatingBooking}
              onShowToast={showToast}
            />
          </div>
        )}
      </main>

      {/* 3. Static / Fixed Footer Bar */}
      <BookingContinueProcess
        selectedSeats={selectedSeats}
        seatDetails={getSelectedSeatDescription()}
        pricePerSeat={
          selectedSeats.length > 0
            ? Math.round(selectedSeats.reduce((acc, id) => acc + getBerthFare(id), 0) / selectedSeats.length)
            : (bus.price || 650)
        }
        originalPricePerSeat={Math.round((bus.price || 650) * 1.25)}
        currentStep={currentStep}
        onContinue={handleContinue}
        onChangeBus={handleBackToSearch}
        isLoading={isHoldingSeats || isCreatingBooking}
      />

      {/* 4. Review Your Booking Popup Modal */}
      <ReviewBookingModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onConfirm={handleConfirmAndProceed}
        bus={bus}
        passengers={passengersState}
        selectedSeats={selectedSeats}
        selectedBoarding={selectedBoarding}
        selectedDropping={selectedDropping}
        createdBooking={createdBooking}
        contactState={contactState}
        journeyDate={formatJourneyDateParam(searchParams.rawDate || searchParams.date)}
        onShowToast={showToast}
      />

      {/* 5. Floating Bottom-Right Toast Notification (matching TripOffers style) */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
