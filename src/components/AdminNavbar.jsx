import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Bell,
  BusFront,
  ChevronDown,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  X,
} from "lucide-react";

const navigationItems = [
  { label: "Dashboard", to: "/admin-dashboard" },
  { label: "Travels-List", to: "/travel-list" },
  { label: "Bus List", to: "/admin" },
  { label: "Coupons" },
  { label: "Booking" },
  { label: "Calendar" },
];

export default function AdminNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 px-3 pt-3 sm:px-5">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 rounded-full border border-white bg-white/95 px-4 py-2.5 shadow-[0_6px_20px_rgba(27,54,54,0.07)] sm:px-5">
        <NavLink to="/admin-dashboard" className="flex min-w-fit items-center gap-2.5" aria-label="BusGo Admin home">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0e8290] text-white">
            <BusFront size={18} />
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-xs font-bold text-slate-800">BusGo</span>
            <span className="block text-[9px] font-medium uppercase tracking-wide text-slate-400">Partner Hub</span>
          </span>
        </NavLink>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 rounded-full bg-[#f1f6f6] p-1 lg:flex">
          {navigationItems.map(({ label, to }) => (
            to ? (
              <NavLink
                key={label}
                to={to}
                end
                className={({ isActive }) => `flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold transition ${isActive ? "bg-[#0e8290] text-white shadow-sm" : "text-slate-500 hover:bg-white hover:text-teal-700"}`}
              >
                {label === "Dashboard" && <LayoutDashboard size={13} />}
                {label}
              </NavLink>
            ) : (
              <button key={label} type="button" className="flex items-center gap-1 rounded-full px-3 py-2 text-[11px] font-medium text-slate-500 transition hover:bg-white hover:text-teal-700">
                {label}
              </button>
            )
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button type="button" aria-label="Add new" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0e8290] text-white transition hover:bg-[#096e79]">
            <Plus size={19} />
          </button>
          <button type="button" aria-label="Search" className="hidden h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 sm:flex">
            <Search size={16} />
          </button>
          <button type="button" aria-label="Notifications" className="relative hidden h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 sm:flex">
            <Bell size={16} />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
          <button type="button" className="hidden items-center gap-2 rounded-full bg-[#f2f6f5] py-1 pl-1 pr-2.5 sm:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0e8290] text-[10px] font-semibold text-white">V</span>
            <span className="text-left leading-tight">
              <span className="block text-[10px] font-semibold text-slate-700">Venkateshwaran</span>
              <span className="block text-[9px] text-slate-400">Fleet Owner</span>
            </span>
            <ChevronDown size={12} className="text-slate-500" />
          </button>
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-600 lg:hidden"
          >
            {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav aria-label="Mobile navigation" className="mx-auto mt-2 grid max-w-[1500px] grid-cols-2 gap-1 rounded-2xl border border-slate-100 bg-white p-3 shadow-lg sm:grid-cols-3">
          {navigationItems.map(({ label, to }) => (
            to ? (
              <NavLink
                key={label}
                to={to}
                end
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `rounded-lg px-3 py-2 text-sm ${isActive ? "bg-teal-50 font-semibold text-teal-700" : "text-slate-600 hover:bg-slate-50"}`}
              >
                {label}
              </NavLink>
            ) : (
              <button key={label} type="button" className="rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50">
                {label}
              </button>
            )
          ))}
        </nav>
      )}
    </header>
  );
}
