import React, { useState } from 'react';
import { Star, ShieldCheck, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import Highlights from './Highlights';
import BusRoute from './BusRoute';

import exteriorImg from '../../assets/bus_exterior.jpg';
import berthsImg from '../../assets/bus_berths.jpg';
import aisleImg from '../../assets/bus_aisle.jpg';
import BusTimingContainer from './BusTimingContainer';

export default function BusDetails({ bus }) {
  const [activeTab, setActiveTab] = useState('highlights');
  const [previewImage, setPreviewImage] = useState(null);

  const operatorName = bus?.operatorName || 'Sri Kumaran Travels';
  const busType = bus?.busType || 'A/C Sleeper (2+1) • Multi-Axle Luxury Bharat Benz';
  const rating = bus?.rating || 4.6;
  const reviewsCount = bus?.reviewsCount || 456;
  const departureTime = bus?.departureTime || '15:00';
  const departurePoint = bus?.departurePoint || 'Chennai (Koyambedu)';
  const arrivalTime = bus?.arrivalTime || '20:55';
  const droppingPoint = bus?.droppingPoint || 'Gandhipuram, CBE';
  const duration = bus?.duration || '05 hrs 55 mins';

  const photos = [
    { title: 'Exterior', image: exteriorImg },
    { title: 'Berths', image: berthsImg },
    { title: 'Aisle', image: aisleImg }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Top Badges & Rating */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
            ★ Primo
          </span>
          <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
            Top Rated
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#0F766E] px-2 py-0.5 rounded-full">
            <Star className="w-3 h-3 fill-current" />
            {rating}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {reviewsCount} verified reviews
          </span>
        </div>
      </div>

      {/* Operator Title & Bus Type */}
      <div>
        <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
          {operatorName}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          {busType}
        </p>

        {/* Deck & Berth Statistics from API */}
        <div className="flex items-center gap-2 mt-2 flex-wrap text-xs">
          <span className="inline-flex items-center gap-1 font-semibold text-sky-800 bg-sky-50 border border-sky-200/80 px-2.5 py-1 rounded-lg">
            🛏️ Lower Deck: {bus?.lowerDeckSeatsCount?.available ?? 18}/18 available
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-indigo-800 bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 rounded-lg">
            🛏️ Upper Deck: {bus?.upperDeckSeatsCount?.available ?? 18}/18 available
          </span>
          {bus?.stops?.length > 0 && (
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg">
              📍 {bus.stops.length} Route Stops
            </span>
          )}
        </div>
      </div>

      {/* Timing and Route Information */}
      <BusTimingContainer
        bus={bus}
        className="border border-slate-200/80 bg-[#F8FAFC] p-3 rounded-2xl"
      />

      {/* BUS PHOTOS & INTERIOR */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            BUS PHOTOS & INTERIOR
          </h4>
          <button
            type="button"
            onClick={() => setPreviewImage(photos[0].image)}
            className="text-xs font-semibold text-[#0F766E] hover:underline cursor-pointer"
          >
            View all (14)
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {photos.map((photo, idx) => (
            <div
              key={idx}
              onClick={() => setPreviewImage(photo.image)}
              className="group relative h-20 sm:h-24 rounded-xl overflow-hidden cursor-pointer border border-slate-200/80 shadow-2xs"
            >
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                <span className="text-[11px] font-semibold text-white drop-shadow-xs">
                  {photo.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Image Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl relative">
            <img src={previewImage} alt="Bus Preview" className="w-full max-h-[80vh] object-cover" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 bg-white/90 text-slate-800 rounded-full w-8 h-8 flex items-center justify-center font-bold hover:bg-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* TABS Navigation */}
      <div>
        <div className="flex items-center gap-4 sm:gap-6 border-b border-slate-200/80 pb-2 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('highlights')}
            className={`pb-2 -mb-2.5 transition-colors cursor-pointer ${
              activeTab === 'highlights'
                ? 'text-[#0F766E] border-b-2 border-[#0F766E]'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Highlights
          </button>
          <button
            onClick={() => setActiveTab('cancellation')}
            className={`pb-2 -mb-2.5 transition-colors cursor-pointer ${
              activeTab === 'cancellation'
                ? 'text-[#0F766E] border-b-2 border-[#0F766E]'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Cancellation policy
          </button>
          <button
            onClick={() => setActiveTab('route')}
            className={`pb-2 -mb-2.5 transition-colors cursor-pointer ${
              activeTab === 'route'
                ? 'text-[#0F766E] border-b-2 border-[#0F766E]'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Bus route
          </button>
        </div>

        {/* Tab Contents */}
        <div className="pt-4">
          {activeTab === 'highlights' && <Highlights />}

          {activeTab === 'cancellation' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Up to 12 hrs before departure</span>
                  <span className="text-emerald-600 font-bold">100% Refund (Free)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Between 6 to 12 hrs before departure</span>
                  <span>50% Refund</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Less than 6 hrs before departure</span>
                  <span>No Refund</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                * Note: Booking fee & insurance charges are non-refundable upon cancellation.
              </p>
            </div>
          )}

          {activeTab === 'route' && <BusRoute bus={bus} />}
        </div>
      </div>

      {/* BusGo SafeGuard Verified Assurance Card */}
      <div className="bg-[#EBF7F2] border border-[#A7F3D0] rounded-2xl p-4 flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
          <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-emerald-950">
            BusGo SafeGuard Verified Assurance
          </h4>
          <p className="text-[11px] sm:text-xs text-emerald-800/90 font-medium leading-relaxed mt-1">
            Regularly sanitized cabin, 100% breathalyzer-tested professional crew, and inclusive transit accidental coverage up to ₹5,00,000 per passenger.
          </p>
        </div>
      </div>
    </div>
  );
}
