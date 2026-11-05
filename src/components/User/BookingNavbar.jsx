import React from 'react';
import { Bell, ChevronDown, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BookingNavbar() {
  return (
    <header className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* BusGo Logo */}
        <Link to="/buses" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M8 6v6" />
              <path d="M16 6v6" />
              <path d="M2 12h20" />
              <rect x="2" y="3" width="20" height="15" rx="3" />
              <path d="M6 18v2" />
              <path d="M18 18v2" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
              Bus<span className="text-[#0F766E]">Go</span>
            </span>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#0F766E] mt-0.5">
              SEASONAL EXPRESS
            </span>
          </div>
        </Link>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* My Bookings Shortcut */}
          <Link
            to="/my-bookings"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0F766E] px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5 text-teal-700" />
            <span>My Bookings</span>
          </Link>

          {/* Bell Icon with notification badge */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>

          {/* User Profile Pill */}
          <Link
            to="/my-bookings"
            className="flex items-center gap-2.5 pl-2 py-1 pr-1 sm:pr-2 rounded-full hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            title="View Profile and Bookings"
          >
            <div className="w-8 h-8 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              AM
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                Alexandre M.
              </span>
              <span className="text-[10px] text-slate-400 font-medium leading-none">
                Alpine Club
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </Link>
        </div>
      </div>
    </header>
  );
}
