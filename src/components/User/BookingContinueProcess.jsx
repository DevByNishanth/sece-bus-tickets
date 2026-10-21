import React from 'react';
import { User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BookingContinueProcess({
  selectedSeats = [],
  seatDetails = {
    deck: 'Lower Deck',
    type: 'Single Sleeper Pod (Window)'
  },
  pricePerSeat = 849,
  originalPricePerSeat = 999,
  currentStep = 1,
  onContinue,
  onChangeBus
}) {
  const navigate = useNavigate();

  const count = selectedSeats.length;
  const isEnabled = count > 0;
  const totalFare = isEnabled ? count * pricePerSeat : 0;
  const totalOriginalFare = isEnabled ? count * originalPricePerSeat : 0;
  const totalSavings = totalOriginalFare - totalFare;

  const handleChangeBus = () => {
    if (onChangeBus) {
      onChangeBus();
    } else {
      navigate('/buses');
    }
  };

  const handleContinue = () => {
    if (isEnabled && onContinue) {
      onContinue();
    }
  };

  const buttonText = currentStep === 2 ? 'Continue to Payment' : 'Continue to Passengers';

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${
      isEnabled 
        ? 'bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]' 
        : 'bg-white/90 backdrop-blur-md border-t border-slate-200/60 shadow-[0_-4px_15px_rgba(0,0,0,0.03)]'
    }`}>
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        {/* Left Side: Selected Sleeper Info */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-all shadow-2xs ${
            isEnabled
              ? 'border-teal-200/80 bg-teal-50 text-[#0F766E]'
              : 'border-slate-200 bg-slate-100 text-slate-400'
          }`}>
            <User className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                SELECTED SLEEPER
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-extrabold border transition-all ${
                isEnabled
                  ? 'bg-teal-100/80 text-[#0F766E] border-teal-200'
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}>
                {isEnabled ? selectedSeats.map(s => `Berth ${s}`).join(', ') : 'None Selected'}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5">
              {isEnabled
                ? `${seatDetails.deck} • ${seatDetails.type}`
                : 'Please select your preferred seat from the deck'}
            </p>
          </div>
        </div>

        {/* Center / Right Flex Wrapper */}
        <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-8 flex-wrap">
          {/* Middle: Total Fare & Savings */}
          <div className="text-left md:text-right">
            <div className="text-[10px] sm:text-[11px] font-medium text-slate-400">
              Total Fare (Taxes incl.)
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-xl sm:text-2xl font-extrabold transition-colors ${
                isEnabled ? 'text-slate-900' : 'text-slate-400'
              }`}>
                ₹{isEnabled ? totalFare : 0}
              </span>
              {isEnabled && (
                <>
                  <span className="text-xs sm:text-sm text-slate-400 line-through font-medium">
                    ₹{totalOriginalFare}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-100/90 px-1.5 py-0.5 rounded-md">
                    Save ₹{totalSavings}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right: Actions Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleChangeBus}
              className="px-4 sm:px-5 py-2.5 rounded-xl border border-slate-200/90 hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-all shadow-2xs cursor-pointer"
            >
              Change Bus
            </button>

            <button
              type="button"
              onClick={handleContinue}
              disabled={!isEnabled}
              className={`px-5 sm:px-7 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md flex items-center gap-2 transition-all ${
                isEnabled
                  ? 'bg-[#0F766E] hover:bg-[#0D6962] active:scale-[0.99] cursor-pointer'
                  : 'bg-slate-300 opacity-60 cursor-not-allowed shadow-none'
              }`}
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
