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
  price = 1250,
  type = 'Single Lower Sleeper',
  deck = 'Lower Deck',
  holdInfo = null, // { remainingSeconds, expiresAt }
  onClick
}) => {
  const isHeld = Boolean(holdInfo && holdInfo.remainingSeconds > 0);
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

// Seater Seat Component
export const SeaterSeat = ({
  id,
  seatNumber,
  status = 'available', // 'available' | 'female' | 'male' | 'selected' | 'booked'
  isSelected = false,
  price = 650,
  type = 'Aisle Seater',
  deck = 'Main Deck',
  holdInfo = null,
  onClick
}) => {
  const isHeld = Boolean(holdInfo && holdInfo.remainingSeconds > 0);
  const isBooked = status === 'booked' || isHeld;
  const currentStatus = isBooked ? 'booked' : (isSelected ? 'selected' : status);

  let borderBgClass = '';
  let headrestClass = '';
  let textClass = '';
  let badgeClass = '';

  switch (currentStatus) {
    case 'selected':
      borderBgClass = 'border-2 border-[#0F766E] bg-[#0F766E] shadow-sm';
      headrestClass = 'bg-teal-900/60 border-teal-300/80';
      textClass = 'text-white font-bold';
      badgeClass = 'bg-teal-950/50 text-white';
      break;
    case 'female':
      borderBgClass = 'border-2 border-[#FF7FCB] bg-rose-50/40 hover:bg-rose-50/70 hover:shadow-xs';
      headrestClass = 'bg-rose-100 border-[#FF7FCB]';
      textClass = 'text-[#FF7FCB] font-semibold';
      badgeClass = 'bg-rose-100 text-rose-700';
      break;
    case 'male':
      borderBgClass = 'border-2 border-[#6366F1] bg-indigo-50/40 hover:bg-indigo-50/70 hover:shadow-xs';
      headrestClass = 'bg-indigo-100 border-[#6366F1]';
      textClass = 'text-[#6366F1] font-semibold';
      badgeClass = 'bg-indigo-100 text-indigo-700';
      break;
    case 'booked':
      borderBgClass = 'border border-slate-300/90 bg-[#CBD5E1] cursor-not-allowed opacity-90';
      headrestClass = 'bg-slate-400/40 border-slate-300';
      textClass = 'text-slate-400 font-semibold';
      badgeClass = 'bg-slate-300 text-slate-600';
      break;
    case 'available':
    default:
      borderBgClass = 'border-2 border-slate-200/90 hover:border-teal-500 bg-white hover:bg-teal-50/20 hover:shadow-xs';
      headrestClass = 'bg-slate-100 border-slate-200';
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
      className={`relative group w-11 sm:w-12 h-14 sm:h-15 rounded-xl flex flex-col items-center justify-between p-1 transition-all duration-200 select-none cursor-pointer ${borderBgClass} ${
        isBooked ? 'cursor-not-allowed' : ''
      }`}
    >
      {/* Top Headrest Cushion */}
      <div className={`w-7 sm:w-8 h-2 rounded-t-sm border transition-colors ${headrestClass}`} />

      {/* Seat Number Tag */}
      <span className={`text-[10px] font-extrabold px-1 py-0.2 rounded ${badgeClass}`}>
        {displayName}
      </span>

      {/* Seat Price or Hold Countdown */}
      {isHeld ? (
        <span
          className="text-[8px] font-bold text-slate-700 flex items-center gap-0.5 pb-0.5 tracking-tighter"
          title={`Hold expires in ${formatRemainingTime(holdInfo.remainingSeconds)}`}
        >
          <Clock className="w-2.5 h-2.5 text-slate-600 inline shrink-0" />
          {formatRemainingTime(holdInfo.remainingSeconds)}
        </span>
      ) : (
        <span className={`text-[9px] sm:text-[10px] font-bold tracking-tight pb-0.5 ${textClass}`}>
          ₹{price}
        </span>
      )}

      {/* Floating Hover Tooltip */}
      {isHeld ? (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 text-amber-300 text-[10px] font-semibold rounded-lg shadow-lg pointer-events-none whitespace-nowrap z-30 border border-slate-700">
          <Clock className="w-3 h-3 text-amber-400 shrink-0" />
          <span>{displayName} • Held ({formatRemainingTime(holdInfo.remainingSeconds)} left)</span>
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

// Helper: Partition row seats/berths into left, center, right groups
const partitionRow = (row) => {
  const items = row.seats || row.berths || [];
  if (items.length === 0) return { left: [], center: [], right: [] };

  // 1. Check if items have explicit side property from backend
  const hasExplicitSide = items.some((item) => item.side);
  if (hasExplicitSide) {
    const left = items.filter((item) => item.side === 'opposite' || item.side === 'left');
    const right = items.filter((item) => item.side === 'driver' || item.side === 'right');
    const center = items.filter((item) => item.side === 'center');
    return { left, center, right };
  }

  // 2. Sleeper layout check: Double Sleepers (2) on left, Single Sleeper (1) on right
  const doubleSleepers = items.filter((b) => (b.type || '').toLowerCase().includes('double'));
  const singleSleepers = items.filter((b) => (b.type || '').toLowerCase().includes('single'));
  if (doubleSleepers.length > 0 && singleSleepers.length > 0) {
    return { left: doubleSleepers, center: [], right: singleSleepers };
  }

  // 3. 4-Seat Layout (Standard 2+2 Seater)
  if (items.length === 4) {
    let leftGroup = [items[0], items[1]];
    let rightGroup = [items[2], items[3]];

    // Put Window seat on the window wall edge, Aisle seat near walkway
    if (
      (leftGroup[0]?.type || '').toLowerCase().includes('aisle') &&
      (leftGroup[1]?.type || '').toLowerCase().includes('window')
    ) {
      leftGroup = [leftGroup[1], leftGroup[0]];
    }

    if (
      (rightGroup[0]?.type || '').toLowerCase().includes('window') &&
      (rightGroup[1]?.type || '').toLowerCase().includes('aisle')
    ) {
      rightGroup = [rightGroup[1], rightGroup[0]];
    }

    return { left: leftGroup, center: [], right: rightGroup };
  }

  // 4. 3-Seat Layout (2+1 Seater / Sleeper)
  if (items.length === 3) {
    return { left: items.slice(0, 2), center: [], right: items.slice(2) };
  }

  // 5. 2-Seat Layout (1+1)
  if (items.length === 2) {
    return { left: [items[0]], center: [], right: [items[1]] };
  }

  // 6. 5-Seat Bench Row (e.g. Back Row)
  if (items.length === 5) {
    return { left: items.slice(0, 2), center: [items[2]], right: items.slice(3) };
  }

  // Fallback: split evenly
  const mid = Math.ceil(items.length / 2);
  return {
    left: items.slice(0, mid),
    center: [],
    right: items.slice(mid)
  };
};

export default function SeatSelection({
  selectedSeats = [],
  passengersState = [],
  onToggleSeat,
  busFare = 650,
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
  const seatLayout = bus?.seatLayout;

  const lowerDeckData = seatLayout?.lowerDeck;
  const upperDeckData = seatLayout?.upperDeck;

  const isSingleDeck =
    seatLayout?.deckType === 'single' ||
    (!upperDeckData?.rows?.length && !upperDeckData?.passengerCapacity);

  const isSeaterBus =
    (seatLayout?.layoutType || bus?.layoutType || '').toLowerCase().includes('seat');

  // Default fallback rows for lower deck if not supplied by API
  const defaultLowerRows = React.useMemo(() => {
    const rows = [];
    if (isSeaterBus) {
      let seatIdx = 1;
      for (let r = 1; r <= 10; r++) {
        const s1 = `S${seatIdx++}`;
        const s2 = `S${seatIdx++}`;
        const s3 = `S${seatIdx++}`;
        const s4 = `S${seatIdx++}`;
        rows.push({
          rowNumber: r,
          rowLabel: `Row ${r}`,
          seats: [
            { seatNumber: s1, seatId: `seat-${s1}`, type: 'Window Seater', fare: busFare || 650, available: true },
            { seatNumber: s2, seatId: `seat-${s2}`, type: 'Aisle Seater', fare: busFare || 650, available: true },
            { seatNumber: s3, seatId: `seat-${s3}`, type: 'Aisle Seater', fare: busFare || 650, available: true },
            { seatNumber: s4, seatId: `seat-${s4}`, type: 'Window Seater', fare: busFare || 650, available: true }
          ]
        });
      }
      return rows;
    }

    let seatIdx = 1;
    for (let r = 1; r <= 6; r++) {
      const s1 = `L${seatIdx++}`;
      const s2 = `L${seatIdx++}`;
      const s3 = `L${seatIdx++}`;
      rows.push({
        rowNumber: r,
        rowLabel: `Row ${r}`,
        berths: [
          { seatNumber: s1, berthId: s1, type: 'Double Sleeper (Window)', fare: busFare || 650, available: true },
          { seatNumber: s2, berthId: s2, type: 'Double Sleeper (Aisle)', fare: busFare || 650, available: true },
          { seatNumber: s3, berthId: s3, type: 'Single Sleeper (Window)', fare: (busFare || 650) + 100, available: true }
        ]
      });
    }
    return rows;
  }, [busFare, isSeaterBus]);

  // Default fallback rows for upper deck (double decker sleeper)
  const defaultUpperRows = React.useMemo(() => {
    if (isSingleDeck) return [];
    const rows = [];
    let seatIdx = 1;
    for (let r = 1; r <= 6; r++) {
      const s1 = `U${seatIdx++}`;
      const s2 = `U${seatIdx++}`;
      const s3 = `U${seatIdx++}`;
      rows.push({
        rowNumber: r,
        rowLabel: `Row ${r}`,
        berths: [
          { seatNumber: s1, berthId: s1, type: 'Double Sleeper (Window)', fare: busFare || 650, available: true },
          { seatNumber: s2, berthId: s2, type: 'Double Sleeper (Aisle)', fare: busFare || 650, available: true },
          { seatNumber: s3, berthId: s3, type: 'Single Sleeper (Window)', fare: (busFare || 650) + 100, available: true }
        ]
      });
    }
    return rows;
  }, [busFare, isSingleDeck]);

  const lowerRows = (lowerDeckData?.rows && lowerDeckData.rows.length > 0)
    ? lowerDeckData.rows
    : defaultLowerRows;

  const upperRows = (!isSingleDeck && upperDeckData?.rows && upperDeckData.rows.length > 0)
    ? upperDeckData.rows
    : (!isSingleDeck ? defaultUpperRows : []);

  // Compute gender restrictions dynamically across both Sleeper double berths & Seater adjacent pairs
  const adjacentGenderRestrictions = React.useMemo(() => {
    const restrictions = {};

    const evaluateRow = (row) => {
      // 1. Check individual seat gender quotas / definitions
      (row.seats || row.berths || []).forEach((b) => {
        const id = b.seatNumber || b.seatId || b.berthId || b.id;
        const g = b.gender || b.bookedGender || (b.status === 'female' || b.status === 'male' ? b.status : null) || '';
        const gLower = String(g).toLowerCase();
        if (gLower === 'female' || (b.type && String(b.type).toLowerCase().includes('female'))) {
          restrictions[id] = 'female';
        } else if (gLower === 'male' || (b.type && String(b.type).toLowerCase().includes('male'))) {
          restrictions[id] = 'male';
        }
      });

      // 2. Check adjacent pairs (e.g., 2-seater adjacent seats or double sleeper berths)
      const { left, right } = partitionRow(row);

      const checkPair = (pair) => {
        if (!pair || pair.length !== 2) return;
        const [b1, b2] = pair;
        const id1 = b1.seatNumber || b1.seatId || b1.berthId || b1.id;
        const id2 = b2.seatNumber || b2.seatId || b2.berthId || b2.id;

        const getBerthGender = (berth, seatId) => {
          const pass = (passengersState || []).find((p) => p.seatId === seatId);
          if (pass?.gender) return pass.gender.toLowerCase();
          if (berth.gender) return String(berth.gender).toLowerCase();
          if (berth.bookedGender) return String(berth.bookedGender).toLowerCase();
          if (berth.status === 'female' || berth.status === 'male') return berth.status;
          return null;
        };

        const g1 = getBerthGender(b1, id1);
        const g2 = getBerthGender(b2, id2);

        if (g1 && !g2) {
          restrictions[id2] = g1;
        } else if (g2 && !g1) {
          restrictions[id1] = g2;
        } else if (g1 && g2 && g1 === g2) {
          restrictions[id1] = g1;
          restrictions[id2] = g2;
        }
      };

      checkPair(left);
      checkPair(right);
    };

    lowerRows.forEach(evaluateRow);
    upperRows.forEach(evaluateRow);

    return restrictions;
  }, [lowerRows, upperRows, passengersState]);

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

  // Helper to determine whether a seat/berth is available
  const isSeatAvailable = (b) => {
    const seatId = b.seatNumber || b.seatId || b.berthId || b.id;
    if (confirmedBookedSeats.includes(seatId)) return false;
    if (getHoldInfo(seatId)) return false;
    if (conflictedSeats.includes(seatId)) return false;
    return b.available !== false;
  };

  // Helper to get styling status for a seat/berth
  const getStatus = (berth) => {
    const seatId = berth.seatNumber || berth.seatId || berth.berthId || berth.id;
    if (confirmedBookedSeats.includes(seatId)) return 'booked';
    if (getHoldInfo(seatId)) return 'booked';
    if (conflictedSeats.includes(seatId)) return 'booked';
    if (berth.available === false) return 'booked';
    if (adjacentGenderRestrictions[seatId]) {
      return adjacentGenderRestrictions[seatId];
    }
    if (berth.status === 'female' || berth.status === 'male') return berth.status;
    return 'available';
  };

  // Lower deck seats & statistics
  const lowerAllSeats = lowerRows.flatMap((r) => r.seats || r.berths || []);
  const lowerCapacity = lowerDeckData?.passengerCapacity || lowerAllSeats.length || 40;
  const lowerAvailableCount = lowerAllSeats.length > 0
    ? lowerAllSeats.filter(isSeatAvailable).length
    : lowerCapacity;

  const lowerFares = lowerAllSeats
    .map((s) => s.fare)
    .filter((f) => typeof f === 'number' && !isNaN(f));
  const minLowerFare = lowerFares.length ? Math.min(...lowerFares) : (busFare || 650);
  const maxLowerFare = lowerFares.length ? Math.max(...lowerFares) : minLowerFare;
  const lowerFareText = minLowerFare === maxLowerFare
    ? `Fare: ₹${minLowerFare.toLocaleString('en-IN')}`
    : `Fares: ₹${minLowerFare.toLocaleString('en-IN')} - ₹${maxLowerFare.toLocaleString('en-IN')}`;

  // Upper deck seats & statistics
  const upperAllSeats = upperRows.flatMap((r) => r.seats || r.berths || []);
  const upperCapacity = upperDeckData?.passengerCapacity || upperAllSeats.length || 18;
  const upperAvailableCount = upperAllSeats.length > 0
    ? upperAllSeats.filter(isSeatAvailable).length
    : upperCapacity;

  const upperFares = upperAllSeats
    .map((s) => s.fare)
    .filter((f) => typeof f === 'number' && !isNaN(f));
  const minUpperFare = upperFares.length ? Math.min(...upperFares) : (busFare || 1100);
  const maxUpperFare = upperFares.length ? Math.max(...upperFares) : minUpperFare;
  const upperFareText = minUpperFare === maxUpperFare
    ? `Fare: ₹${minUpperFare.toLocaleString('en-IN')}`
    : `Fares: ₹${minUpperFare.toLocaleString('en-IN')} - ₹${maxUpperFare.toLocaleString('en-IN')}`;

  // Render individual seat or sleeper component
  const renderSeatOrBerth = (item, deckName) => {
    const seatId = item.seatNumber || item.seatId || item.berthId || item.id;
    const isSleeper =
      (item.type || '').toLowerCase().includes('sleeper') ||
      (item.type || '').toLowerCase().includes('berth') ||
      (!isSeaterBus && !((item.type || '').toLowerCase().includes('seat')) && ((seatLayout?.layoutType || '').toLowerCase().includes('sleeper') || String(item.seatNumber || '').startsWith('L') || String(item.seatNumber || '').startsWith('U')));

    if (isSleeper) {
      return (
        <SleeperBerth
          key={seatId}
          id={seatId}
          seatNumber={item.seatNumber}
          status={getStatus(item)}
          isSelected={selectedSeats.includes(seatId)}
          label={`Berth ${item.seatNumber}`}
          type={item.type || 'Sleeper'}
          deck={deckName}
          price={item.fare || busFare || 1100}
          holdInfo={getHoldInfo(seatId)}
          onClick={(id) => onToggleSeat && onToggleSeat(id, adjacentGenderRestrictions[id])}
        />
      );
    }

    return (
      <SeaterSeat
        key={seatId}
        id={seatId}
        seatNumber={item.seatNumber}
        status={getStatus(item)}
        isSelected={selectedSeats.includes(seatId)}
        type={item.type || 'Seater'}
        deck={deckName}
        price={item.fare || busFare || 650}
        holdInfo={getHoldInfo(seatId)}
        onClick={(id) => onToggleSeat && onToggleSeat(id, adjacentGenderRestrictions[id])}
      />
    );
  };

  // Reusable Deck Card Component
  const renderDeckCard = ({
    deckBadgeText,
    deckBadgeClass,
    deckName,
    availableCount,
    capacity,
    fareText,
    showDriver = false,
    headerRightBadge = null,
    rows = [],
    footerNote
  }) => (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${deckBadgeClass}`}>
              {deckBadgeText}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {availableCount} of {capacity} available
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            {fareText}
          </div>
        </div>

        {showDriver ? (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
              <SteeringWheelIcon />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              DRIVER
            </span>
          </div>
        ) : (
          headerRightBadge && (
            <div className="text-right">
              <span className="text-[11px] font-bold text-[#0F766E] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/70">
                {headerRightBadge}
              </span>
            </div>
          )
        )}
      </div>

      {/* Rows Container */}
      <div className="pt-5 space-y-3">
        {rows.map((row) => {
          const { left, center, right } = partitionRow(row);
          return (
            <div
              key={`row-${deckName}-${row.rowNumber || row.rowLabel}`}
              className="flex items-center justify-between gap-2 sm:gap-3"
            >
              {/* Left Side Seats / Berths */}
              <div className="flex items-center gap-2">
                {left.map((item) => renderSeatOrBerth(item, deckName))}
              </div>

              {/* Aisle Walkway & Row Indicator */}
              <div className="flex-1 flex items-center justify-center border-t border-dashed border-slate-200 mx-1">
                <span className="text-[9px] font-bold tracking-widest text-slate-300 uppercase select-none px-1">
                  {row.rowLabel || `R${row.rowNumber}`}
                </span>
              </div>

              {/* Optional Center Seat (e.g. 5-seat back row) */}
              {center && center.length > 0 && (
                <div className="flex items-center gap-2 mr-2">
                  {center.map((item) => renderSeatOrBerth(item, deckName))}
                </div>
              )}

              {/* Right Side Seats / Berths */}
              <div className="flex items-center gap-2">
                {right.map((item) => renderSeatOrBerth(item, deckName))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deck Card Footer Note */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>{footerNote.left}</span>
        <span>{footerNote.right}</span>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      {/* 1. Status Notification Toast */}
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
                Seat(s) <span className="font-bold font-mono text-amber-950">{activeHeldList.map((s) => s.seatNumber).join(', ')}</span> are shown in booked color. If not booked within 10 minutes (600s), the hold will automatically revoke and re-enable for booking.
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

      {/* 4. Deck Layout View */}
      {isSingleDeck ? (
        // Single Deck Bus: Render single card centered nicely
        <div className="w-full max-w-xl mx-auto">
          {renderDeckCard({
            deckBadgeText: lowerDeckData?.deckName || (isSeaterBus ? 'SEATER DECK' : 'MAIN DECK'),
            deckBadgeClass: 'text-sky-700 bg-sky-50 border-sky-200/80',
            deckName: lowerDeckData?.deckName || 'Main Deck',
            availableCount: lowerAvailableCount,
            capacity: lowerCapacity,
            fareText: lowerFareText,
            showDriver: true,
            rows: lowerRows,
            footerNote: isSeaterBus
              ? { left: 'Left: Window & Aisle Seats', right: 'Right: Aisle & Window Seats' }
              : { left: 'Left: Double Berth (Window & Aisle)', right: 'Right: Single Berth (Window)' }
          })}
        </div>
      ) : (
        // Double Deck Bus: Render 2-Column Grid (Lower Deck & Upper Deck)
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 w-full">
          {/* Lower Deck Card */}
          {renderDeckCard({
            deckBadgeText: lowerDeckData?.deckName || 'LOWER DECK',
            deckBadgeClass: 'text-sky-700 bg-sky-50 border-sky-200/80',
            deckName: lowerDeckData?.deckName || 'Lower Deck',
            availableCount: lowerAvailableCount,
            capacity: lowerCapacity,
            fareText: lowerFareText,
            showDriver: true,
            rows: lowerRows,
            footerNote: isSeaterBus
              ? { left: 'Left: Window & Aisle Seats', right: 'Right: Aisle & Window Seats' }
              : { left: 'Left: Double Berth (Window & Aisle)', right: 'Right: Single Berth (Window)' }
          })}

          {/* Upper Deck Card */}
          {renderDeckCard({
            deckBadgeText: upperDeckData?.deckName || 'UPPER DECK',
            deckBadgeClass: 'text-indigo-700 bg-indigo-50 border-indigo-200/80',
            deckName: upperDeckData?.deckName || 'Upper Deck',
            availableCount: upperAvailableCount,
            capacity: upperCapacity,
            fareText: upperFareText,
            showDriver: false,
            headerRightBadge: 'Popular Sleeper',
            rows: upperRows,
            footerNote: {
              left: 'Left: Double Berth (Window & Aisle)',
              right: 'Right: Single Berth (Window)'
            }
          })}
        </div>
      )}
    </div>
  );
}