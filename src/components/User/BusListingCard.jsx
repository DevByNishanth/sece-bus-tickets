import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Bus,
  ArrowRight
} from 'lucide-react';
import AmenitiesModal from './AmenitiesModal';
import BusTimingContainer from './BusTimingContainer';
import { getAmenityMeta } from '../../Utils/amenityConfig';

// Helper to render visible amenity badges on the card
const renderAmenityBadge = (amenity) => {
  const meta = getAmenityMeta(amenity);
  if (!meta) return null;
  const Icon = meta.icon;

  if (meta.key === 'livetracking' || meta.key === 'gps') {
    return (
      <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5 bg-slate-50 border border-slate-200/70 px-2.5 py-1 rounded-md">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        {meta.label}
      </span>
    );
  }

  return (
    <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5 bg-slate-50 border border-slate-200/70 px-2.5 py-1 rounded-md">
      <Icon size={13} className={meta.color || 'text-slate-500'} />
      {meta.label}
    </span>
  );
};

export default function BusListingCard({
  bus,
  onViewSeats,
  onOpenBoardingPoints,
  onOpenCancellation,
  onOpenAmenities
}) {
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false);
  const amenitiesContainerRef = useRef(null);
  const navigate = useNavigate();

  const handleViewSeatsClick = () => {
    if (onViewSeats) {
      onViewSeats(bus);
    } else {
      navigate('/ticket-booking', { state: { bus } });
    }
  };

  const allAmenities = bus.amenities || [];
  const visibleAmenities = allAmenities.slice(0, 4);
  const extraAmenities = allAmenities.slice(4);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 hover:border-teal-500/80 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 relative group">
      {/* Top Row: Operator Info & Rating */}
      <div className="flex items-start justify-between gap-4">
        {/* Left: Operator Avatar & Name */}
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base shadow-2xs ${
              bus.avatarBg || 'bg-[#E8EEF5]'
            } ${bus.avatarColor || 'text-[#2563EB]'}`}
          >
            {bus.operatorInitial || <Bus size={20} />}
          </div>

          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-tight">
                {bus.operatorName}
              </h3>

              {/* Tags */}
              {bus.tags?.map((tag, idx) => {
                if (tag.type === 'fastest') {
                  return (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-[#FEF6EE] text-[#B54708] border border-[#F9DBAF] text-[11px] font-semibold px-2 py-0.5 rounded-md leading-none"
                    >
                      ★ {tag.text}
                    </span>
                  );
                }
                if (tag.type === 'prime') {
                  return (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-[#ECFDF3] text-[#0A6A69] border border-[#A6F4C5] text-[11px] font-semibold px-2 py-0.5 rounded-md leading-none"
                    >
                      ✓ {tag.text}
                    </span>
                  );
                }
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-md leading-none"
                  >
                    {tag.text}
                  </span>
                );
              })}
            </div>

            <p className="text-xs text-slate-500 font-medium mt-1">
              {bus.busType}
            </p>
          </div>
        </div>

        {/* Right: Rating & Reviews */}
        <div className="flex flex-col items-end shrink-0">
          <div className="bg-[#0B735F] text-white px-2.5 py-1 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1 shadow-xs">
            <Star size={12} className="fill-white" />
            <span>{bus.rating?.toFixed(1) || '4.8'}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium text-right mt-1">
            {bus.reviewsCount?.toLocaleString()} reviews
          </span>
        </div>
      </div>

      {/* Middle Row: Journey Timeline & Pricing */}
      <div className="mt-6 pt-4 flex flex-col md:flex-row md:items-center border-t border-slate-100 justify-between gap-5 sm:gap-6">
        {/* Bus Journey Timing Container Component */}
        <BusTimingContainer bus={bus} showDivider />

        {/* Price Block & View Seats CTA */}
        <div className="flex md:flex-col items-baseline md:items-end justify-between md:justify-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            STARTING FROM
          </span>
          <div className="text-2xl font-bold text-slate-900">
            ₹{bus.price}
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            per seat
          </span>

          {/* Right CTA Button */}
          <div className="mt-5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleViewSeatsClick}
              className="w-full sm:w-auto btn-grd hover:bg-[#085453] active:scale-[0.98] transition-all duration-200 text-white font-medium rounded-2xl px-4 py-2.5 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md group"
            >
              <span className="text-[14px] font-semibold tracking-wide">
                View seats
              </span>
              <div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Amenities Row */}
      <div className="mt-5 pt-5 flex items-center border-t border-slate-100 flex-wrap gap-2">
        {visibleAmenities.map((amenity, idx) => (
          <React.Fragment key={idx}>
            {renderAmenityBadge(amenity)}
          </React.Fragment>
        ))}

        {extraAmenities.length > 0 && (
          <div ref={amenitiesContainerRef} className="relative inline-block">
            <button
              type="button"
              onClick={() => {
                setIsAmenitiesOpen(!isAmenitiesOpen);
                if (onOpenAmenities) onOpenAmenities(bus);
              }}
              className="text-xs font-semibold text-[#0A6A69] hover:text-[#085453] bg-[#EBF7F5] hover:bg-[#DDF2EF] border border-[#BCE4DE] px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 active:scale-95"
              title={`View ${extraAmenities.length} extra amenities`}
              aria-label={`View ${extraAmenities.length} extra amenities in popup`}
            >
              <span>+{extraAmenities.length} more</span>
            </button>

            {/* Extra Amenities Popover anchored right near this button */}
            <AmenitiesModal
              isOpen={isAmenitiesOpen}
              onClose={() => setIsAmenitiesOpen(false)}
              bus={bus}
              extraAmenities={extraAmenities}
              allAmenities={allAmenities}
              containerRef={amenitiesContainerRef}
            />
          </div>
        )}
      </div>  

      {/* Bottom Row: Policies, Seats left, and View Seats CTA */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Information Items */}
        <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1.5 text-xs">
          {/* Total seats left */}
          {bus.seatsLeft !== undefined && (
            <span className="text-rose-700 font-bold flex items-center gap-1.5 border border-[#FECDD3] bg-[#FEF2F2] px-2.5 py-1 rounded-xl shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse inline-block" />
              {bus.seatsLeft} seats left
            </span>
          )}

          {/* Lower & Upper Deck seat counts from API */}
          {bus.lowerDeckSeatsCount && (
            <span className="text-sky-800 font-semibold bg-sky-50 border border-sky-200/80 px-2 py-0.5 rounded-lg text-[11px]">
              {bus.deckType === 'single' ? 'Seats' : 'Lower'}: <strong className="font-bold text-sky-950">{bus.lowerDeckSeatsCount.available}/{bus.lowerDeckSeatsCount.total}</strong>
            </span>
          )}

          {bus.upperDeckSeatsCount && bus.deckType !== 'single' && (
            <span className="text-indigo-800 font-semibold bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-lg text-[11px]">
              Upper: <strong className="font-bold text-indigo-950">{bus.upperDeckSeatsCount.available}/{bus.upperDeckSeatsCount.total}</strong>
            </span>
          )}

          {bus.singleSeatsLeft ? (
            <span className="text-emerald-700 font-medium bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-lg text-[11px]">
              • {bus.singleSeatsLeft} Single Sleeper left
            </span>
          ) : bus.cancellationNote ? (
            <span className="text-slate-500">• {bus.cancellationNote}</span>
          ) : null}

          <span className="hidden sm:inline text-slate-300">|</span>

          <button
            type="button"
            onClick={() => onOpenBoardingPoints && onOpenBoardingPoints(bus)}
            className="text-slate-500 hover:text-slate-800 transition cursor-pointer underline-offset-2 hover:underline"
          >
            Boarding & dropping points
          </button>

          <span className="hidden sm:inline text-slate-300">|</span>

          <button
            type="button"
            onClick={() => onOpenCancellation && onOpenCancellation(bus)}
            className="text-slate-500 hover:text-slate-800 transition cursor-pointer underline-offset-2 hover:underline"
          >
            Cancellation policy
          </button>
        </div>
      </div>
    </div>
  );
}
