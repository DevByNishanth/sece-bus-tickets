import React from 'react';

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
  number,
  status = 'available', // 'available' | 'female' | 'male' | 'selected' | 'booked'
  isSelected = false,
  label,
  price = 849,
  type = 'Single Sleeper (Window)',
  deck = 'Lower Deck',
  onClick
}) => {
  const currentStatus = isSelected ? 'selected' : status;
  const isBooked = currentStatus === 'booked';

  let borderBgClass = '';
  let pillowClass = '';
  let textClass = '';

  switch (currentStatus) {
    case 'selected':
      borderBgClass = 'border-2 border-[#0F766E] bg-[#0F766E] shadow-sm';
      pillowClass = 'border border-teal-300/80 bg-teal-800/40';
      textClass = 'text-white font-bold';
      break;
    case 'female':
      borderBgClass = 'border-2 border-[#F43F5E] bg-rose-50/20 hover:bg-rose-50/50 hover:shadow-xs';
      pillowClass = 'border border-[#F43F5E] bg-rose-100/40';
      textClass = 'text-[#F43F5E] font-semibold';
      break;
    case 'male':
      borderBgClass = 'border-2 border-[#6366F1] bg-indigo-50/20 hover:bg-indigo-50/50 hover:shadow-xs';
      pillowClass = 'border border-[#6366F1] bg-indigo-100/40';
      textClass = 'text-[#6366F1] font-semibold';
      break;
    case 'booked':
      borderBgClass = 'border border-slate-300/90 bg-[#CBD5E1] cursor-not-allowed opacity-90';
      pillowClass = 'border border-slate-300 bg-slate-400/20';
      textClass = 'text-slate-400 font-semibold';
      break;
    case 'available':
    default:
      borderBgClass = 'border-2 border-slate-200/90 hover:border-teal-500 bg-white hover:bg-teal-50/20 hover:shadow-xs';
      pillowClass = 'border border-slate-300 bg-slate-50';
      textClass = 'text-slate-500 hover:text-teal-700 font-semibold';
      break;
  }

  return (
    <button
      type="button"
      onClick={() => !isBooked && onClick && onClick(id)}
      disabled={isBooked}
      title={`${label || id} • ${type} • ${deck} • ₹${price} (${currentStatus.toUpperCase()})`}
      className={`relative group w-12 sm:w-14 h-20 sm:h-22 rounded-2xl flex flex-col items-center justify-between p-2 transition-all duration-200 select-none cursor-pointer ${borderBgClass} ${
        isBooked ? 'cursor-not-allowed' : ''
      }`}
    >
      {/* Pillow indent at top */}
      <div className={`w-8 sm:w-9 h-3 rounded-md transition-colors ${pillowClass}`} />

      {/* Seat Amount instead of 01 or 02 */}
      <span className={`text-[10px] sm:text-[11px] font-bold tracking-tight pb-1 ${textClass}`}>
        ₹{price}
      </span>

      {/* Floating Hover Tooltip */}
      {!isBooked && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center px-2 py-0.5 bg-slate-900 text-white text-[10px] font-semibold rounded shadow-md pointer-events-none whitespace-nowrap z-20">
          {label || id} • ₹{price}
        </div>
      )}
    </button>
  );
};

// Seater / Compact Chair Component for Lower Deck 2-seat layout
export const SeatUnit = ({
  id,
  number,
  status = 'available',
  isSelected = false,
  label,
  price = 849,
  deck = 'Lower Deck',
  onClick
}) => {
  const currentStatus = isSelected ? 'selected' : status;
  const isBooked = currentStatus === 'booked';

  let borderBgClass = '';
  let pillowClass = '';
  let textClass = '';

  switch (currentStatus) {
    case 'selected':
      borderBgClass = 'border-2 border-[#0F766E] bg-[#0F766E] shadow-sm';
      pillowClass = 'border border-teal-300/80 bg-teal-800/40';
      textClass = 'text-white font-bold';
      break;
    case 'female':
      borderBgClass = 'border-2 border-[#F43F5E] bg-rose-50/20 hover:bg-rose-50/50 hover:shadow-xs';
      pillowClass = 'border border-[#F43F5E] bg-rose-100/40';
      textClass = 'text-[#F43F5E] font-semibold';
      break;
    case 'male':
      borderBgClass = 'border-2 border-[#6366F1] bg-indigo-50/20 hover:bg-indigo-50/50 hover:shadow-xs';
      pillowClass = 'border border-[#6366F1] bg-indigo-100/40';
      textClass = 'text-[#6366F1] font-semibold';
      break;
    case 'booked':
      borderBgClass = 'border border-slate-300/90 bg-[#CBD5E1] cursor-not-allowed opacity-90';
      pillowClass = 'border border-slate-300 bg-slate-400/20';
      textClass = 'text-slate-400 font-semibold';
      break;
    case 'available':
    default:
      borderBgClass = 'border-2 border-slate-200/90 hover:border-teal-500 bg-white hover:bg-teal-50/20 hover:shadow-xs';
      pillowClass = 'border border-slate-300 bg-slate-50';
      textClass = 'text-slate-500 hover:text-teal-700 font-semibold';
      break;
  }

  return (
    <button
      type="button"
      onClick={() => !isBooked && onClick && onClick(id)}
      disabled={isBooked}
      title={`${label || id} • Chair • ${deck} • ₹${price} (${currentStatus.toUpperCase()})`}
      className={`relative group w-11 sm:w-12 h-10 sm:h-11 rounded-lg flex flex-col items-center justify-between p-1 transition-all duration-200 select-none cursor-pointer ${borderBgClass} ${
        isBooked ? 'cursor-not-allowed' : ''
      }`}
    >
      <div className={`w-6 sm:w-7 h-1.5 rounded-xs transition-colors ${pillowClass}`} />
      <span className={`text-[9px] sm:text-[10px] font-bold leading-tight ${textClass}`}>
        ₹{price}
      </span>
      {/* Floating Hover Tooltip */}
      {!isBooked && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center px-1.5 py-0.5 bg-slate-900 text-white text-[10px] font-semibold rounded shadow-md pointer-events-none whitespace-nowrap z-20">
          {label || id} • ₹{price}
        </div>
      )}
    </button>
  );
};

export default function SeatSelection({
  selectedSeats = [],
  onToggleSeat,
  busFare = 849
}) {
  // Lower Deck Single Sleeper Berths (Left Column, 6 vertical berths)
  const lowerDeckLeft = [
    { id: 'L01', number: '01', status: 'booked', label: 'Berth L01', type: 'Single Sleeper Pod (Window)' },
    { id: 'L02', number: '02', status: 'female', label: 'Berth L02', type: 'Single Sleeper Pod (Window)' },
    { id: 'L03', number: '02', status: 'available', label: 'Berth L03', type: 'Single Sleeper Pod (Window)' },
    { id: 'L04', number: '01', status: 'booked', label: 'Berth L04', type: 'Single Sleeper Pod (Window)' },
    { id: 'L05', number: '02', status: 'female', label: 'Berth L05', type: 'Single Sleeper Pod (Window)' },
    { id: 'L06', number: '01', status: 'available', label: 'Berth L06', type: 'Single Sleeper Pod (Window)' } // Selected in screenshot
  ];

  // Lower Deck Right 2-column Seats (10 rows of 2)
  const lowerDeckRightRows = [
    [
      { id: 'LS01', number: '01', status: 'available', label: 'Seat LS01' },
      { id: 'LS02', number: '01', status: 'available', label: 'Seat LS02' }
    ],
    [
      { id: 'LS03', number: '02', status: 'available', label: 'Seat LS03' },
      { id: 'LS04', number: '01', status: 'available', label: 'Seat LS04' } // Could be selected if user chooses
    ],
    [
      { id: 'LS05', number: '02', status: 'available', label: 'Seat LS05' },
      { id: 'LS06', number: '01', status: 'booked', label: 'Seat LS06' }
    ],
    [
      { id: 'LS07', number: '01', status: 'booked', label: 'Seat LS07' },
      { id: 'LS08', number: '02', status: 'male', label: 'Seat LS08' }
    ],
    [
      { id: 'LS09', number: '02', status: 'available', label: 'Seat LS09' },
      { id: 'LS10', number: '01', status: 'booked', label: 'Seat LS10' }
    ],
    [
      { id: 'LS11', number: '01', status: 'booked', label: 'Seat LS11' },
      { id: 'LS12', number: '02', status: 'available', label: 'Seat LS12' }
    ],
    [
      { id: 'LS13', number: '01', status: 'booked', label: 'Seat LS13' },
      { id: 'LS14', number: '02', status: 'available', label: 'Seat LS14' }
    ],
    [
      { id: 'LS15', number: '02', status: 'available', label: 'Seat LS15' },
      { id: 'LS16', number: '02', status: 'female', label: 'Seat LS16' }
    ],
    [
      { id: 'LS17', number: '01', status: 'booked', label: 'Seat LS17' },
      { id: 'LS18', number: '02', status: 'available', label: 'Seat LS18' }
    ],
    [
      { id: 'LS19', number: '02', status: 'available', label: 'Seat LS19' },
      { id: 'LS20', number: '02', status: 'available', label: 'Seat LS20' }
    ]
  ];

  // Upper Deck Single Sleeper Berths (Left Column, 6 vertical berths)
  const upperDeckLeft = [
    { id: 'U01', number: '02', status: 'female', label: 'Berth U01', type: 'Single Sleeper Pod (Window)' },
    { id: 'U02', number: '01', status: 'available', label: 'Berth U02', type: 'Single Sleeper Pod (Window)' }, // Selected in screenshot
    { id: 'U03', number: '02', status: 'available', label: 'Berth U03', type: 'Single Sleeper Pod (Window)' },
    { id: 'U04', number: '02', status: 'available', label: 'Berth U04', type: 'Single Sleeper Pod (Window)' },
    { id: 'U05', number: '02', status: 'available', label: 'Berth U05', type: 'Single Sleeper Pod (Window)' },
    { id: 'U06', number: '02', status: 'available', label: 'Berth U06', type: 'Single Sleeper Pod (Window)' }
  ];

  // Upper Deck Double Sleeper Berths (Right Column, 6 rows of 2 sleepers)
  const upperDeckRightRows = [
    [
      { id: 'UD01', number: '01', status: 'available', label: 'Berth UD01', type: 'Double Sleeper (Aisle)' },
      { id: 'UD02', number: '02', status: 'available', label: 'Berth UD02', type: 'Double Sleeper (Window)' }
    ],
    [
      { id: 'UD03', number: '02', status: 'available', label: 'Berth UD03', type: 'Double Sleeper (Aisle)' },
      { id: 'UD04', number: '02', status: 'available', label: 'Berth UD04', type: 'Double Sleeper (Window)' }
    ],
    [
      { id: 'UD05', number: '02', status: 'available', label: 'Berth UD05', type: 'Double Sleeper (Aisle)' },
      { id: 'UD06', number: '02', status: 'available', label: 'Berth UD06', type: 'Double Sleeper (Window)' }
    ],
    [
      { id: 'UD07', number: '02', status: 'available', label: 'Berth UD07', type: 'Double Sleeper (Aisle)' },
      { id: 'UD08', number: '02', status: 'available', label: 'Berth UD08', type: 'Double Sleeper (Window)' }
    ],
    [
      { id: 'UD09', number: '02', status: 'available', label: 'Berth UD09', type: 'Double Sleeper (Aisle)' },
      { id: 'UD10', number: '02', status: 'available', label: 'Berth UD10', type: 'Double Sleeper (Window)' }
    ],
    [
      { id: 'UD11', number: '02', status: 'available', label: 'Berth UD11', type: 'Double Sleeper (Aisle)' },
      { id: 'UD12', number: '02', status: 'available', label: 'Berth UD12', type: 'Double Sleeper (Window)' }
    ]
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 w-full">
      {/* LOWER DECK CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 border border-sky-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
            LOWER DECK
          </span>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
              <SteeringWheelIcon />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              DRIVER
            </span>
          </div>
        </div>

        {/* Deck Layout */}
        <div className="flex justify-between items-start pt-5 gap-3 sm:gap-6">
          {/* Left Column: 6 Single Sleeper Berths */}
          <div className="flex flex-col gap-2.5 sm:gap-3">
            {lowerDeckLeft.map((berth) => (
              <SleeperBerth
                key={berth.id}
                id={berth.id}
                number={berth.number}
                status={berth.status}
                isSelected={selectedSeats.includes(berth.id)}
                label={berth.label}
                type={berth.type}
                deck="Lower Deck"
                price={busFare}
                onClick={onToggleSeat}
              />
            ))}
          </div>

          {/* Center Aisle Indicator */}
          <div className="flex-1 flex flex-col items-center justify-center self-stretch border-x border-dashed border-slate-200/60 my-2">
            <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase [writing-mode:vertical-lr] rotate-180 py-4 select-none">
              AISLE
            </span>
          </div>

          {/* Right Column: 10 Rows of 2 Seater/Semi-Sleeper Units */}
          <div className="flex flex-col gap-1.5 sm:gap-2">
            {lowerDeckRightRows.map((row, rowIdx) => (
              <div key={`row-${rowIdx}`} className="flex items-center gap-1.5 sm:gap-2">
                {row.map((seat) => (
                  <SeatUnit
                    key={seat.id}
                    id={seat.id}
                    number={seat.number}
                    status={seat.status}
                    isSelected={selectedSeats.includes(seat.id)}
                    label={seat.label}
                    deck="Lower Deck"
                    price={busFare}
                    onClick={onToggleSeat}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* UPPER DECK CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 border border-sky-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
            UPPER DECK
          </span>
          <div className="text-[11px] font-medium text-slate-400">
            Sleeper (2+1)
          </div>
        </div>

        {/* Deck Layout */}
        <div className="flex justify-between items-start pt-5 gap-3 sm:gap-6">
          {/* Left Column: 6 Single Sleeper Berths */}
          <div className="flex flex-col gap-2.5 sm:gap-3">
            {upperDeckLeft.map((berth) => (
              <SleeperBerth
                key={berth.id}
                id={berth.id}
                number={berth.number}
                status={berth.status}
                isSelected={selectedSeats.includes(berth.id)}
                label={berth.label}
                type={berth.type}
                deck="Upper Deck"
                price={busFare}
                onClick={onToggleSeat}
              />
            ))}
          </div>

          {/* Center Aisle Indicator */}
          <div className="flex-1 flex flex-col items-center justify-center self-stretch border-x border-dashed border-slate-200/60 my-2">
            <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase [writing-mode:vertical-lr] rotate-180 py-4 select-none">
              AISLE
            </span>
          </div>

          {/* Right Column: 6 Rows of 2 Double Sleeper Berths */}
          <div className="flex flex-col gap-2.5 sm:gap-3">
            {upperDeckRightRows.map((row, rowIdx) => (
              <div key={`ud-row-${rowIdx}`} className="flex items-center gap-1.5 sm:gap-2">
                {row.map((berth) => (
                  <SleeperBerth
                    key={berth.id}
                    id={berth.id}
                    number={berth.number}
                    status={berth.status}
                    isSelected={selectedSeats.includes(berth.id)}
                    label={berth.label}
                    type={berth.type}
                    deck="Upper Deck"
                    price={busFare}
                    onClick={onToggleSeat}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
