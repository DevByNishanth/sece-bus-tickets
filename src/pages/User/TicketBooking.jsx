import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import BookingNavbar from '../../components/User/BookingNavbar';
import BookingProcess from '../../components/User/BookingProcess';
import SeatStatusDisplay from '../../components/User/SeatStatusDisplay';
import SeatSelection from '../../components/User/SeatSelection';
import BusDetails from '../../components/User/BusDetails';
import BookingContinueProcess from '../../components/User/BookingContinueProcess';
import PassengerDetails from '../../components/User/PassengerDetails';
import ReviewBookingModal from '../../components/User/ReviewBookingModal';
import { holdSeatsBooking, createBooking } from '../../services/busService';
// import Bglayout from '../../assets/page-bg.png'

export default function TicketBooking() {
  const location = useLocation();
  const navigate = useNavigate();

  // Selected bus data with fallback matching the screenshots and live backend
  const bus = location.state?.bus || {
    id: '6adb0a1474060137dbb0aa97',
    _id: '6adb0a1474060137dbb0aa97',
    busId: '6adb0a1474060137dbb0aa97',
    operatorName: 'Sri Kumaran Travels',
    busType: 'A/C Sleeper (2+1) • Multi-Axle Luxury Bharat Benz',
    rating: 4.6,
    reviewsCount: 456,
    departureTime: '15:00',
    departureCity: 'Chennai',
    departurePoint: 'Chennai (Koyambedu)',
    arrivalTime: '20:55',
    arrivalCity: 'Coimbatore',
    droppingPoint: 'Gandhipuram, CBE',
    duration: '05 hrs 55 mins',
    price: 849,
    originalPrice: 999
  };

  const searchParams = location.state?.searchParams || {
    from: 'Chennai',
    to: 'Coimbatore',
    date: 'Saturday, 24 May',
    passengers: '1 Traveller (All seats)'
  };

  // All berths for fare lookup
  const allBerths = [
    ...(bus.seatLayout?.lowerDeck?.rows?.flatMap((r) => r.berths) || []),
    ...(bus.seatLayout?.upperDeck?.rows?.flatMap((r) => r.berths) || [])
  ];

  const getBerthFare = (seatId) => {
    const found = allBerths.find((b) => b.seatNumber === seatId || b.berthId === seatId);
    return found?.fare || bus.price || 1100;
  };

  // State
  // Default selected seat to ['L1'] or first available
  const [selectedSeats, setSelectedSeats] = useState(['L1']);
  const [currentStep, setCurrentStep] = useState(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Seat Hold API State
  const [isHoldingSeats, setIsHoldingSeats] = useState(false);
  const [holdError, setHoldError] = useState(null);
  const [holdData, setHoldData] = useState(null);
  const [conflictedSeats, setConflictedSeats] = useState([]);

  // Create Booking API State
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [createdBooking, setCreatedBooking] = useState(null);

  // Passengers State
  const [passengersState, setPassengersState] = useState([
    {
      seatId: 'L1',
      name: 'Alexandre Moros',
      age: '29',
      gender: 'male'
    }
  ]);

  // Contact Info State
  const [contactState, setContactState] = useState({
    email: 'alexandre.m@example.com',
    phone: '98765 43210'
  });

  // Extract initial boarding & dropping points from API stops
  const boardingStops = (bus.stops || []).filter(
    (s) => s.stopType === 'boarding' || s.stopType === 'both'
  );
  const droppingStops = (bus.stops || []).filter(
    (s) => s.stopType === 'dropping' || s.stopType === 'both'
  );

  const initialBoardingStop = boardingStops[0] || {
    name: bus.departurePoint || 'Koyambedu (CMBT)',
    estimatedArrivalTime: bus.departureTime || '22:00',
    landmark: 'Omni Bus Stand Platform Gate 2',
    city: bus.departureCity || 'Chennai'
  };

  const initialDroppingStop = droppingStops[droppingStops.length - 1] || {
    name: bus.droppingPoint || 'Gandhipuram Omni Bus Stand',
    estimatedArrivalTime: bus.arrivalTime || '06:30',
    landmark: 'Near Central RTO',
    city: bus.arrivalCity || 'Coimbatore'
  };

  // Boarding and Dropping Points State
  const [selectedBoarding, setSelectedBoarding] = useState({
    id: initialBoardingStop._id || 'bp-1',
    time: initialBoardingStop.estimatedArrivalTime || '22:00',
    name: initialBoardingStop.name,
    badge: 'MAIN ORIGIN',
    address: initialBoardingStop.landmark || `${initialBoardingStop.name}, ${initialBoardingStop.city || ''}`,
    reportingTime: initialBoardingStop.estimatedArrivalTime || '21:45'
  });

  const [selectedDropping, setSelectedDropping] = useState({
    id: initialDroppingStop._id || 'dp-1',
    time: initialDroppingStop.estimatedArrivalTime || '06:30',
    name: initialDroppingStop.name,
    badge: 'TERMINUS',
    address: initialDroppingStop.landmark || `${initialDroppingStop.name}, ${initialDroppingStop.city || ''}`,
    reportingTime: initialDroppingStop.estimatedArrivalTime || '06:20'
  });

  // Normalize journeyDate to YYYY-MM-DD
  const formatJourneyDateParam = (val) => {
    if (!val) return '2026-10-27';
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
    return '2026-10-27';
  };

  // Toggle seat selection
  const handleToggleSeat = (seatId) => {
    setHoldError(null);
    setSelectedSeats((prev) => {
      let updated;
      if (prev.includes(seatId)) {
        updated = prev.filter((id) => id !== seatId);
      } else {
        updated = [...prev, seatId];
      }

      // Sync passengers array with selected seats
      setPassengersState((prevPassengers) => {
        return updated.map((id, index) => {
          const existing = prevPassengers.find((p) => p.seatId === id);
          if (existing) return existing;
          return {
            seatId: id,
            name: index === 0 ? 'Alexandre Moros' : `Passenger ${index + 1}`,
            age: '29',
            gender: 'male'
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
      type: 'Single Sleeper Pod (Window)'
    };
  };

  // Handle Continue from bottom footer with Seat Hold & Create Booking API calls
  const handleContinue = async () => {
    if (selectedSeats.length === 0 || isHoldingSeats || isCreatingBooking) return;

    if (currentStep === 1) {
      setHoldError(null);
      setConflictedSeats([]);
      setIsHoldingSeats(true);

      const busId = bus._id || bus.busId || bus.id || '6adb0a1474060137dbb0aa97';
      const journeyDate = formatJourneyDateParam(searchParams.rawDate || searchParams.date);

      try {
        const result = await holdSeatsBooking({
          busId,
          journeyDate,
          seatNumbers: selectedSeats
        });

        if (result.success && result.data) {
          setHoldData(result.data);
          // Advance to Step 2: Passenger Details
          setCurrentStep(2);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setHoldError(result.message || 'Seat(s) are currently held by another passenger. Please select alternative seats.');
          if (result.conflictedSeats && result.conflictedSeats.length > 0) {
            setConflictedSeats(result.conflictedSeats);
          }
        }
      } catch (err) {
        setHoldError(err.message || 'Failed to hold seats. Please try again.');
      } finally {
        setIsHoldingSeats(false);
      }
    } else if (currentStep === 2) {
      // Step 2: Create Booking via POST {{baseUrl}}/bookings
      setBookingError(null);

      // Validate passenger names
      const missingIdx = passengersState.findIndex((p) => !p.name || !p.name.trim());
      if (missingIdx !== -1) {
        setBookingError(`Please provide the full name for Passenger ${missingIdx + 1}.`);
        return;
      }

      setIsCreatingBooking(true);

      const busId = bus._id || bus.busId || bus.id || '6adb0a1474060137dbb0aa97';
      const journeyDate = formatJourneyDateParam(searchParams.rawDate || searchParams.date);

      // Format array of passenger details
      const formattedPassengers = passengersState.map((p, idx) => ({
        name: (p.name || '').trim() || `Passenger ${idx + 1}`,
        age: parseInt(p.age, 10) || 28,
        gender: (p.gender || 'female').toLowerCase()
      }));

      // Extract valid boarding and dropping point IDs
      const boardingPointId =
        selectedBoarding?.pointId ||
        (selectedBoarding?.id && selectedBoarding.id.length === 24 ? selectedBoarding.id : null) ||
        (bus.stops?.find((s) => s.stopType === 'boarding' || s.stopType === 'both')?._id) ||
        '6adb0a1574060137dbb0aad0';

      const droppingPointId =
        selectedDropping?.pointId ||
        (selectedDropping?.id && selectedDropping.id.length === 24 ? selectedDropping.id : null) ||
        (bus.stops?.find((s) => s.stopType === 'dropping' || s.stopType === 'both')?._id) ||
        '6adb0a1574060137dbb0aad8';

      try {
        const result = await createBooking({
          busId,
          journeyDate,
          seatNumbers: selectedSeats,
          passengers: formattedPassengers,
          boardingPointId,
          droppingPointId
        });

        if (result.success && result.data) {
          setCreatedBooking(result.data);
          // Open Review Your Booking popup modal with real booking details
          setIsReviewModalOpen(true);
        } else {
          setBookingError(result.message || 'Unable to create booking. Please check your details and try again.');
        }
      } catch (err) {
        setBookingError(err.message || 'Booking creation failed. Please try again.');
      } finally {
        setIsCreatingBooking(false);
      }
    }
  };

  // Confirm booking in modal -> navigate to PayU Checkout
  const handleConfirmAndProceed = (bookingData) => {
    setIsReviewModalOpen(false);
    navigate('/checkout/payu', {
      state: {
        totalAmount: createdBooking?.totalAmount || bookingData.totalAmount || 891.45,
        passengers: passengersState,
        selectedSeats,
        bus,
        selectedBoarding,
        selectedDropping,
        holdData,
        createdBooking
      }
    });
  };

  const handleBackToSearch = () => {
    navigate('/buses');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans relative overflow-x-hidden mb-20">
      {/* Background Ambience / Layout Image (rendered below all content) */}
      {/* <img
        src={Bglayout}
        alt=""
        aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover pointer-events-none z-0"
      /> */}

      {/* 1. Header / Navbar */}
      <BookingNavbar />

      {/* 2. Main Booking Body */}
      <main className="relative z-10 flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-36">
        {/* Route Banner & 4-Step Indicator */}
        <BookingProcess
          from={searchParams.from || 'Chennai'}
          to={searchParams.to || 'Coimbatore'}
          date={searchParams.date || 'Saturday, 24 May'}
          passengers={searchParams.passengers || '1 Traveller (All seats)'}
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
                  onToggleSeat={handleToggleSeat}
                  busFare={bus.price || 1100}
                  bus={bus}
                  conflictedSeats={conflictedSeats}
                  holdError={holdError}
                  onDismissError={() => setHoldError(null)}
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
            : (bus.price || 1100)
        }
        originalPricePerSeat={Math.round((bus.price || 1100) * 1.25)}
        currentStep={currentStep}
        onContinue={handleContinue}
        onChangeBus={handleBackToSearch}
        isLoading={isHoldingSeats || isCreatingBooking}
      />

      {/* 4. Review Your Booking Popup Modal (Image 3) */}
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
      />
    </div>
  );
}
