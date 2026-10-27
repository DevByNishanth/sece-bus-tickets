import React from 'react';
import { AlertCircle, X } from 'lucide-react';

// Steering wheel SVG component
const SteeringWheelIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 text-slate-400"
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v6" />
    <path d="M12 15v6" />
    <path d="M3.5 14l5.5-2" />
    <path d="M20.5 14l-5.5-2" />
  </svg>
);

// Sleeper Berth Component
export const SleeperBerth = ({
  id,
  seatNumber,
  status = 'available', // 'available' | 'female' | 'male' | 'selected' | 'booked'
  isSelected = false,
  label,
  price = 1250,
  type = 'Single Lower Sleeper',
  deck = 'Lower Deck',
  onClick
}) => {
  const currentStatus = isSelected ? 'selected' : status;
  const isBooked = currentStatus === 'booked';

  let borderBgClass = '';
  let pillowClass = '';
  let textClass = '';
  let badgeClass = '';

  switch (currentStatus) {
    case 'selected':
      borderBgClass = 'border-2 border-[#0F766E] bg-[#0F766E] shadow-sm';
      pillowClass = 'border border-teal-300/80 bg-teal-800/40';
      textClass = 'text-white font-bold';
      badgeClass = 'bg-teal-900/60 text-white';
      break;
    case 'female':
      borderBgClass = 'border-2 border-[#FF7FCB] bg-rose-50/30 hover:bg-rose-50/60 hover:shadow-xs';
      pillowClass = 'border border-[#FF7FCB] bg-rose-100/50';
      textClass = 'text-[#FF7FCB] font-semibold';
      badgeClass = 'bg-rose-100 text-rose-700';
      break;
    case 'male':
      borderBgClass = 'border-2 border-[#6366F1] bg-indigo-50/30 hover:bg-indigo-50/60 hover:shadow-xs';
      pillowClass = 'border border-[#6366F1] bg-indigo-100/50';
      textClass = 'text-[#6366F1] font-semibold';
      badgeClass = 'bg-indigo-100 text-indigo-700';
      break;
    case 'booked':
      borderBgClass = 'border border-slate-300/90 bg-[#CBD5E1] cursor-not-allowed opacity-90';
      pillowClass = 'border border-slate-300 bg-slate-400/20';
      textClass = 'text-slate-400 font-semibold';
      badgeClass = 'bg-slate-300 text-slate-600';
      break;
    case 'available':
    default:
      borderBgClass = 'border-2 border-slate-200/90 hover:border-teal-500 bg-white hover:bg-teal-50/20 hover:shadow-xs';
      pillowClass = 'border border-slate-300 bg-slate-50';
      textClass = 'text-slate-600 hover:text-teal-700 font-semibold';
      badgeClass = 'bg-slate-100 text-slate-700';
      break;
  }

  const displayName = seatNumber || id;

  return (
    <button
      type="button"
      onClick={() => !isBooked && onClick && onClick(id)}
      disabled={isBooked}
      title={`${displayName} • ${type} • ${deck} • ₹${price} (${currentStatus.toUpperCase()})`}
      className={`relative group w-12 sm:w-14 h-20 sm:h-22 rounded-2xl flex flex-col items-center justify-between p-1.5 transition-all duration-200 select-none cursor-pointer ${borderBgClass} ${
        isBooked ? 'cursor-not-allowed' : ''
      }`}
    >
      {/* Pillow indent at top */}
      <div className={`w-8 sm:w-9 h-2.5 rounded-md transition-colors ${pillowClass}`} />

      {/* Seat Number Tag */}
      <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${badgeClass}`}>
        {displayName}
      </span>

      {/* Seat Price */}
      <span className={`text-[10px] sm:text-[11px] font-bold tracking-tight pb-0.5 ${textClass}`}>
        ₹{price}
      </span>

      {/* Floating Hover Tooltip */}
      {!isBooked && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center px-2 py-0.5 bg-slate-900 text-white text-[10px] font-semibold rounded shadow-md pointer-events-none whitespace-nowrap z-20">
          {displayName} • {type} • ₹{price}
        </div>
      )}
    </button>
  );
};

export default function SeatSelection({
  selectedSeats = [],
  onToggleSeat,
  busFare = 1100,
  bus,
  conflictedSeats = [],
  holdError = null,
  onDismissError = null
}) {
  // Extract API layout or use high-fidelity default structure
  const seatLayout = bus?.seatLayout;

  const lowerDeckData = seatLayout?.lowerDeck;
  const upperDeckData = seatLayout?.upperDeck;

  // Compute lower deck statistics
  const lowerRows = lowerDeckData?.rows || [];
  const lowerBerthsList = lowerRows.flatMap((r) => r.berths || []);
  const lowerCapacity = lowerDeckData?.passengerCapacity || 18;
  const lowerAvailableCount = lowerBerthsList.length > 0
    ? lowerBerthsList.filter((b) => b.available && !conflictedSeats.includes(b.seatNumber || b.berthId)).length
    : 18;

  // Compute upper deck statistics
  const upperRows = upperDeckData?.rows || [];
  const upperBerthsList = upperRows.flatMap((r) => r.berths || []);
  const upperCapacity = upperDeckData?.passengerCapacity || 18;
  const upperAvailableCount = upperBerthsList.length > 0
    ? upperBerthsList.filter((b) => b.available && !conflictedSeats.includes(b.seatNumber || b.berthId)).length
    : 18;

  // Helper to get status
  const getStatus = (berth) => {
    const seatId = berth.seatNumber || berth.berthId;
    if (conflictedSeats.includes(seatId)) return 'booked';
    if (berth.available === false) return 'booked';
    return 'available';
  };

  return (
    <div className="w-full space-y-4">
      {/* Seat Hold Conflict / Error Alert */}
      {holdError && (
        <div className="bg-rose-50/95 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-start justify-between gap-3 shadow-xs animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-rose-900">Seat Reservation Notice</div>
              <div className="text-xs text-rose-700 mt-0.5">{holdError}</div>
              {conflictedSeats && conflictedSeats.length > 0 && (
                <div className="text-[11px] font-semibold text-rose-800 mt-1">
                  Conflicted seat(s): {conflictedSeats.join(', ')} — Please select alternative available berths.
                </div>
              )}
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

      {/* Top Deck Overview & Counters Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Select Berths</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-[#0F766E] border border-teal-200/80">
              Double Deck Sleeper (2+1)
            </span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Click on an available berth to select your seat. Window and Aisle berths are available.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-sky-50 border border-sky-200/80 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-500 font-medium">Lower Deck: </span>
            <span className="font-bold text-sky-950">{lowerAvailableCount}/{lowerCapacity} Left</span>
          </div>
          <div className="bg-indigo-50 border border-indigo-200/80 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-500 font-medium">Upper Deck: </span>
            <span className="font-bold text-indigo-950">{upperAvailableCount}/{upperCapacity} Left</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Deck Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 w-full">
        {/* LOWER DECK CARD */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
                  LOWER DECK
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {lowerAvailableCount} of {lowerCapacity} available
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">
                Fares: ₹1,250 (Double) • ₹1,350 (Single)
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                <SteeringWheelIcon />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                DRIVER
              </span>
            </div>
          </div>

          {/* Deck Layout (Rows 1 to 6) */}
          <div className="pt-5 space-y-3">
            {lowerRows.map((row) => {
              const doubleBerths = (row.berths || []).filter(
                (b) => b.type && b.type.toLowerCase().includes('double')
              );
              const singleBerths = (row.berths || []).filter(
                (b) => b.type && b.type.toLowerCase().includes('single')
              );

              return (
                <div
                  key={`lower-row-${row.rowNumber || row.rowLabel}`}
                  className="flex items-center justify-between gap-2 sm:gap-3"
                >
                  {/* Left: 2 Double Sleepers */}
                  <div className="flex items-center gap-2">
                    {doubleBerths.map((berth) => (
                      <SleeperBerth
                        key={berth.seatNumber || berth.berthId}
                        id={berth.seatNumber || berth.berthId}
                        seatNumber={berth.seatNumber}
                        status={getStatus(berth)}
                        isSelected={selectedSeats.includes(berth.seatNumber || berth.berthId)}
                        label={`Berth ${berth.seatNumber}`}
                        type={berth.type}
                        deck="Lower Deck"
                        price={berth.fare || 1250}
                        onClick={onToggleSeat}
                      />
                    ))}
                  </div>

                  {/* Aisle Indicator */}
                  <div className="flex-1 flex items-center justify-center border-t border-dashed border-slate-200 mx-1">
                    <span className="text-[9px] font-bold tracking-widest text-slate-300 uppercase select-none px-1">
                      {row.rowLabel || `R${row.rowNumber}`}
                    </span>
                  </div>

                  {/* Right: 1 Single Sleeper */}
                  <div className="flex items-center">
                    {singleBerths.map((berth) => (
                      <SleeperBerth
                        key={berth.seatNumber || berth.berthId}
                        id={berth.seatNumber || berth.berthId}
                        seatNumber={berth.seatNumber}
                        status={getStatus(berth)}
                        isSelected={selectedSeats.includes(berth.seatNumber || berth.berthId)}
                        label={`Berth ${berth.seatNumber}`}
                        type={berth.type}
                        deck="Lower Deck"
                        price={berth.fare || 1350}
                        onClick={onToggleSeat}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lower Deck Footer Note */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Left: Double Berth (Window & Aisle)</span>
            <span>Right: Single Berth (Window)</span>
          </div>
        </div>

        {/* UPPER DECK CARD */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
                  UPPER DECK
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {upperAvailableCount} of {upperCapacity} available
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">
                Fares: ₹1,100 (Double) • ₹1,200 (Single)
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold text-[#0F766E] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/70">
                Popular Sleeper
              </span>
            </div>
          </div>

          {/* Deck Layout (Rows 1 to 6) */}
          <div className="pt-5 space-y-3">
            {upperRows.map((row) => {
              const doubleBerths = (row.berths || []).filter(
                (b) => b.type && b.type.toLowerCase().includes('double')
              );
              const singleBerths = (row.berths || []).filter(
                (b) => b.type && b.type.toLowerCase().includes('single')
              );

              return (
                <div
                  key={`upper-row-${row.rowNumber || row.rowLabel}`}
                  className="flex items-center justify-between gap-2 sm:gap-3"
                >
                  {/* Left: 2 Double Sleepers */}
                  <div className="flex items-center gap-2">
                    {doubleBerths.map((berth) => (
                      <SleeperBerth
                        key={berth.seatNumber || berth.berthId}
                        id={berth.seatNumber || berth.berthId}
                        seatNumber={berth.seatNumber}
                        status={getStatus(berth)}
                        isSelected={selectedSeats.includes(berth.seatNumber || berth.berthId)}
                        label={`Berth ${berth.seatNumber}`}
                        type={berth.type}
                        deck="Upper Deck"
                        price={berth.fare || 1100}
                        onClick={onToggleSeat}
                      />
                    ))}
                  </div>

                  {/* Aisle Indicator */}
                  <div className="flex-1 flex items-center justify-center border-t border-dashed border-slate-200 mx-1">
                    <span className="text-[9px] font-bold tracking-widest text-slate-300 uppercase select-none px-1">
                      {row.rowLabel || `R${row.rowNumber}`}
                    </span>
                  </div>

                  {/* Right: 1 Single Sleeper */}
                  <div className="flex items-center">
                    {singleBerths.map((berth) => (
                      <SleeperBerth
                        key={berth.seatNumber || berth.berthId}
                        id={berth.seatNumber || berth.berthId}
                        seatNumber={berth.seatNumber}
                        status={getStatus(berth)}
                        isSelected={selectedSeats.includes(berth.seatNumber || berth.berthId)}
                        label={`Berth ${berth.seatNumber}`}
                        type={berth.type}
                        deck="Upper Deck"
                        price={berth.fare || 1200}
                        onClick={onToggleSeat}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Upper Deck Footer Note */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Left: Double Berth (Window & Aisle)</span>
            <span>Right: Single Berth (Window)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
