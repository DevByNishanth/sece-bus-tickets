import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingNavbar from '../../components/User/BookingNavbar';
import BookingProcess from '../../components/User/BookingProcess';
import SeatStatusDisplay from '../../components/User/SeatStatusDisplay';
import SeatSelection from '../../components/User/SeatSelection';
import BusDetails from '../../components/User/BusDetails';
import BookingContinueProcess from '../../components/User/BookingContinueProcess';
import PassengerDetails from '../../components/User/PassengerDetails';
import ReviewBookingModal from '../../components/User/ReviewBookingModal';
// import Bglayout from '../../assets/page-bg.png'

export default function TicketBooking() {
  const location = useLocation();
  const navigate = useNavigate();

  // Selected bus data with fallback matching the screenshots
  const bus = location.state?.bus || {
    id: 'bus-sri-kumaran',
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

  // Toggle seat selection
  const handleToggleSeat = (seatId) => {
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

  // Handle Continue from bottom footer
  const handleContinue = () => {
    if (selectedSeats.length === 0) return;

    if (currentStep === 1) {
      // Advance to Step 2: Passenger Details
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 2) {
      // Step 2 -> Open Review Your Booking popup modal!
      setIsReviewModalOpen(true);
    }
  };

  // Confirm booking in modal -> navigate to PayU Checkout
  const handleConfirmAndProceed = (bookingData) => {
    setIsReviewModalOpen(false);
    navigate('/checkout/payu', {
      state: {
        totalAmount: bookingData.totalAmount || 891.45,
        passengers: passengersState,
        selectedSeats,
        bus,
        selectedBoarding,
        selectedDropping
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
            if (step === 1 || (step === 2 && selectedSeats.length > 0)) {
              setCurrentStep(step);
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
                />
              </div>

              {/* Right Column: Bus Operator, Timing, Photos, Tabs, Assurance */}
              <div className="lg:col-span-5 xl:col-span-5">
                <BusDetails bus={bus} />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Passenger Details View (Image 2) */}
        {currentStep === 2 && (
          <div>
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
              onProceedPayment={() => setIsReviewModalOpen(true)}
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
      />
    </div>
  );
}
