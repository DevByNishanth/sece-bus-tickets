import React from 'react';
import { AlertCircle, X, Clock, RefreshCw, CheckCircle2, FastForward } from 'lucide-react';

// Format mm:ss helper
const formatRemainingTime = (totalSeconds) => {
  if (!totalSeconds || totalSeconds <= 0) return '00:00';
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

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
  holdInfo = null, // { remainingSeconds, expiresAt }
  onClick
}) => {
  const isHeld = Boolean(holdInfo && holdInfo.remainingSeconds > 0);
  // Any booked or held seat CANNOT be selected and is rendered in booked color
  const isBooked = status === 'booked' || isHeld;
  const currentStatus = isBooked ? 'booked' : (isSelected ? 'selected' : status);

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
      // Booked color (#CBD5E1) - applied to booked and temporarily held berths
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
      title={
        isHeld
          ? `${displayName} • Held by another passenger (${formatRemainingTime(holdInfo.remainingSeconds)} remaining) • Booked color`
          : `${displayName} • ${type} • ${deck} • ₹${price} (${currentStatus.toUpperCase()})`
      }
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

      {/* Seat Price or Hold Countdown */}
      {isHeld ? (
        <span
          className="text-[9px] font-bold text-slate-700 flex items-center gap-0.5 pb-0.5 tracking-tighter"
          title={`Hold expires in ${formatRemainingTime(holdInfo.remainingSeconds)}`}
        >
          <Clock className="w-2.5 h-2.5 text-slate-600 inline shrink-0" />
          {formatRemainingTime(holdInfo.remainingSeconds)}
        </span>
      ) : (
        <span className={`text-[10px] sm:text-[11px] font-bold tracking-tight pb-0.5 ${textClass}`}>
          ₹{price}
        </span>
      )}

      {/* Floating Hover Tooltip */}
      {isHeld ? (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 text-amber-300 text-[10px] font-semibold rounded-lg shadow-lg pointer-events-none whitespace-nowrap z-30 border border-slate-700">
          <Clock className="w-3 h-3 text-amber-400 shrink-0" />
          <span>{displayName} • Held by passenger ({formatRemainingTime(holdInfo.remainingSeconds)} left)</span>
        </div>
      ) : !isBooked ? (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center px-2 py-0.5 bg-slate-900 text-white text-[10px] font-semibold rounded shadow-md pointer-events-none whitespace-nowrap z-20">
          {displayName} • {type} • ₹{price}
        </div>
      ) : (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center px-2 py-0.5 bg-slate-700 text-slate-200 text-[10px] font-semibold rounded shadow-md pointer-events-none whitespace-nowrap z-20">
          {displayName} • Booked
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
  heldSeats = {},
  confirmedBookedSeats = [],
  conflictedSeats = [], // backward compatibility
  holdError = null,
  onDismissError = null,
  statusNotification = null,
  onDismissNotification = null,
  onRefreshSeatStatus = null,
  onFastForwardHold = null,
  isRefreshingSeats = false
}) {
  // Extract API layout or use high-fidelity default structure
  const seatLayout = bus?.seatLayout;

  const lowerDeckData = seatLayout?.lowerDeck;
  const upperDeckData = seatLayout?.upperDeck;

  // Active held seats list
  const activeHeldList = Object.values(heldSeats || {}).filter(
    (s) => s && s.remainingSeconds > 0
  );

  // Helper to get hold info for a seat
  const getHoldInfo = (seatId) => {
    return (heldSeats && heldSeats[seatId] && heldSeats[seatId].remainingSeconds > 0)
      ? heldSeats[seatId]
      : null;
  };

  // Helper to determine whether a berth is available
  const isBerthAvailable = (b) => {
    const seatId = b.seatNumber || b.berthId;
    if (confirmedBookedSeats.includes(seatId)) return false;
    if (getHoldInfo(seatId)) return false;
    if (conflictedSeats.includes(seatId)) return false;
    return b.available !== false;
  };

  // Compute lower deck statistics
  const lowerRows = lowerDeckData?.rows || [];
  const lowerBerthsList = lowerRows.flatMap((r) => r.berths || []);
  const lowerCapacity = lowerDeckData?.passengerCapacity || 18;
  const lowerAvailableCount = lowerBerthsList.length > 0
    ? lowerBerthsList.filter(isBerthAvailable).length
    : 18;

  // Compute upper deck statistics
  const upperRows = upperDeckData?.rows || [];
  const upperBerthsList = upperRows.flatMap((r) => r.berths || []);
  const upperCapacity = upperDeckData?.passengerCapacity || 18;
  const upperAvailableCount = upperBerthsList.length > 0
    ? upperBerthsList.filter(isBerthAvailable).length
    : 18;

  // Helper to get status for styling
  const getStatus = (berth) => {
    const seatId = berth.seatNumber || berth.berthId;
    if (confirmedBookedSeats.includes(seatId)) return 'booked';
    if (getHoldInfo(seatId)) return 'booked';
    if (conflictedSeats.includes(seatId)) return 'booked';
    if (berth.available === false) return 'booked';
    return 'available';
  };

  return (
    <div className="w-full space-y-4">
      {/* 1. Status Notification Toast (Revoked back to available OR Confirmed booked) */}
      {statusNotification && (
        <div
          className={`p-4 rounded-2xl flex items-start justify-between gap-3 shadow-xs animate-in fade-in duration-200 ${
            statusNotification.type === 'available'
              ? 'bg-emerald-50/95 border border-emerald-200 text-emerald-900'
              : 'bg-slate-100 border border-slate-300 text-slate-800'
          }`}
        >
          <div className="flex items-start gap-3">
            {statusNotification.type === 'available' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-sm font-bold">
                {statusNotification.type === 'available'
                  ? 'Seat Re-enabled for Booking'
                  : 'Seat Confirmed Booked'}
              </div>
              <div className="text-xs mt-0.5 opacity-90">{statusNotification.message}</div>
            </div>
          </div>
          {onDismissNotification && (
            <button
              type="button"
              onClick={onDismissNotification}
              className="p-1 rounded-lg transition-colors opacity-60 hover:opacity-100 cursor-pointer"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* 2. Active Held Seats Countdown Banner */}
      {activeHeldList.length > 0 && (
        <div className="bg-amber-50/95 border border-amber-200/90 text-amber-950 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Clock className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-bold text-amber-950">
                Seat(s) Currently Held by Another Passenger (10m Hold)
              </div>
              <div className="text-xs text-amber-800 mt-0.5">
                Berth(s) <span className="font-bold font-mono text-amber-950">{activeHeldList.map((s) => s.seatNumber).join(', ')}</span> are shown in booked color. If not booked within 10 minutes (600s), the hold will automatically revoke and re-enable for booking.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 flex-wrap">
            {activeHeldList.map((s) => (
              <span
                key={s.seatNumber}
                className="bg-white border border-amber-300 text-amber-950 font-mono font-bold text-xs px-2.5 py-1 rounded-xl shadow-2xs flex items-center gap-1.5"
              >
                <span>{s.seatNumber}:</span>
                <span className="text-amber-700">{formatRemainingTime(s.remainingSeconds)}</span>
              </span>
            ))}
            {onRefreshSeatStatus && (
              <button
                type="button"
                onClick={onRefreshSeatStatus}
                disabled={isRefreshingSeats}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Query server to check whether seats are confirmed booked or available"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingSeats ? 'animate-spin' : ''}`} />
                <span>Check Status</span>
              </button>
            )}
            {onFastForwardHold && (
              <button
                type="button"
                onClick={onFastForwardHold}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                title="Fast forward 10m timer to test expiration & revocation"
              >
                <FastForward className="w-3 h-3 text-slate-500" />
                <span>Expire Now</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Seat Hold Conflict / Error Alert */}
      {holdError && (
        <div className="bg-rose-50/95 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-start justify-between gap-3 shadow-xs animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-rose-900">Seat Reservation Notice (409 Conflict)</div>
              <div className="text-xs text-rose-700 mt-0.5">{holdError}</div>
              <div className="text-[11px] font-semibold text-rose-800 mt-1">
                The seat is shown in booked color for 10 minutes (600s). If the passenger does not complete payment, it will automatically revoke to available.
              </div>
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
      {/* <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
      </div> */}

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
                    {doubleBerths.map((berth) => {
                      const seatId = berth.seatNumber || berth.berthId;
                      return (
                        <SleeperBerth
                          key={seatId}
                          id={seatId}
                          seatNumber={berth.seatNumber}
                          status={getStatus(berth)}
                          isSelected={selectedSeats.includes(seatId)}
                          label={`Berth ${berth.seatNumber}`}
                          type={berth.type}
                          deck="Lower Deck"
                          price={berth.fare || 1250}
                          holdInfo={getHoldInfo(seatId)}
                          onClick={onToggleSeat}
                        />
                      );
                    })}
                  </div>

                  {/* Aisle Indicator */}
                  <div className="flex-1 flex items-center justify-center border-t border-dashed border-slate-200 mx-1">
                    <span className="text-[9px] font-bold tracking-widest text-slate-300 uppercase select-none px-1">
                      {row.rowLabel || `R${row.rowNumber}`}
                    </span>
                  </div>

                  {/* Right: 1 Single Sleeper */}
                  <div className="flex items-center">
                    {singleBerths.map((berth) => {
                      const seatId = berth.seatNumber || berth.berthId;
                      return (
                        <SleeperBerth
                          key={seatId}
                          id={seatId}
                          seatNumber={berth.seatNumber}
                          status={getStatus(berth)}
                          isSelected={selectedSeats.includes(seatId)}
                          label={`Berth ${berth.seatNumber}`}
                          type={berth.type}
                          deck="Lower Deck"
                          price={berth.fare || 1350}
                          holdInfo={getHoldInfo(seatId)}
                          onClick={onToggleSeat}
                        />
                      );
                    })}
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
                    {doubleBerths.map((berth) => {
                      const seatId = berth.seatNumber || berth.berthId;
                      return (
                        <SleeperBerth
                          key={seatId}
                          id={seatId}
                          seatNumber={berth.seatNumber}
                          status={getStatus(berth)}
                          isSelected={selectedSeats.includes(seatId)}
                          label={`Berth ${berth.seatNumber}`}
                          type={berth.type}
                          deck="Upper Deck"
                          price={berth.fare || 1100}
                          holdInfo={getHoldInfo(seatId)}
                          onClick={onToggleSeat}
                        />
                      );
                    })}
                  </div>

                  {/* Aisle Indicator */}
                  <div className="flex-1 flex items-center justify-center border-t border-dashed border-slate-200 mx-1">
                    <span className="text-[9px] font-bold tracking-widest text-slate-300 uppercase select-none px-1">
                      {row.rowLabel || `R${row.rowNumber}`}
                    </span>
                  </div>

                  {/* Right: 1 Single Sleeper */}
                  <div className="flex items-center">
                    {singleBerths.map((berth) => {
                      const seatId = berth.seatNumber || berth.berthId;
                      return (
                        <SleeperBerth
                          key={seatId}
                          id={seatId}
                          seatNumber={berth.seatNumber}
                          status={getStatus(berth)}
                          isSelected={selectedSeats.includes(seatId)}
                          label={`Berth ${berth.seatNumber}`}
                          type={berth.type}
                          deck="Upper Deck"
                          price={berth.fare || 1200}
                          holdInfo={getHoldInfo(seatId)}
                          onClick={onToggleSeat}
                        />
                      );
                    })}
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
