import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  BuildingComplex,
  BusFront,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Phone,
  Plus,
  Route,
  Search,
  ShieldCheck,
  Tag,
  Ticket,
  User,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [approvalsDropdownOpen, setApprovalsDropdownOpen] = useState(false);
  const [mobileApprovalsOpen, setMobileApprovalsOpen] = useState(true);

  const profileRef = useRef(null);
  const approvalsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const isApprovalActive =
    location.pathname === "/travel-list" || location.pathname === "/admin";

  // Close dropdowns when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (approvalsRef.current && !approvalsRef.current.contains(event.target)) {
        setApprovalsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    logout();
    navigate("/login");
  };

  // Derive display values from exact auth user token or fetched profile
  const email = user?.email || "hrms@sece.ac.in";
  const role = user?.role || "admin";
  const userId = user?.id || user?._id || "6acf204cd9e02ec09b4e0a76";
  const displayName =
    user?.name ||
    user?.fullName ||
    (email.includes("@") ? email.split("@")[0].toUpperCase() : "Admin");
  const avatarLetter = (displayName?.[0] || email?.[0] || "A").toUpperCase();

  return (
    <header className="sticky top-0 z-30 px-3 pt-3 sm:px-5">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 rounded-full border border-white bg-white/95 px-4 py-2.5 shadow-[0_6px_20px_rgba(27,54,54,0.07)] sm:px-5">
        {/* Brand / Logo */}
        <NavLink
          to="/admin-dashboard"
          className="flex min-w-fit items-center gap-2.5"
          aria-label="BusGo Admin home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0e8290] text-white shadow-sm">
            <BusFront size={18} />
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-xs font-bold text-slate-800">BusGo</span>
            <span className="block text-[9px] font-medium uppercase tracking-wide text-teal-700">
              Admin Portal
            </span>
          </span>
        </NavLink>

        {/* Center Navigation Tabs with Approval Dropdown */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 rounded-full bg-[#f1f6f6] p-1 lg:flex"
        >
          {/* Dashboard */}
          <NavLink
            to="/admin-dashboard"
            end
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition ${
                isActive
                  ? "bg-[#0e8290] text-white shadow-sm"
                  : "text-slate-600 hover:bg-white hover:text-teal-700"
              }`
            }
          >
            <LayoutDashboard size={13} className="shrink-0" />
            <span>Dashboard</span>
          </NavLink>

          {/* Approvals Dropdown Tab (Contains Travel List & Bus List) */}
          <div className="relative" ref={approvalsRef}>
            <button
              type="button"
              onClick={() => setApprovalsDropdownOpen((prev) => !prev)}
              aria-expanded={approvalsDropdownOpen}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition ${
                isApprovalActive
                  ? "bg-[#0e8290] text-white shadow-sm"
                  : "text-slate-600 hover:bg-white hover:text-teal-700"
              }`}
            >
              <CheckCircle size={13} className="shrink-0" />
              <span>Approvals</span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${
                  approvalsDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {approvalsDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-52 rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_10px_28px_rgba(15,23,42,0.12)] z-50 animate-in fade-in zoom-in-95 duration-150">
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Verification &amp; Approvals
                </p>

                <NavLink
                  to="/travel-list"
                  onClick={() => setApprovalsDropdownOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                      isActive
                        ? "bg-teal-50 text-[#0e8290]"
                        : "text-slate-700 hover:bg-slate-50 hover:text-teal-700"
                    }`
                  }
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-[#0e8290]">
                    <Route size={14} />
                  </span>
                  <div>
                    <span className="block leading-tight">Travels List</span>
                    <span className="block text-[10px] font-normal text-slate-400">
                      Agency directory &amp; verification
                    </span>
                  </div>
                </NavLink>

                <NavLink
                  to="/admin"
                  onClick={() => setApprovalsDropdownOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition mt-0.5 ${
                      isActive
                        ? "bg-teal-50 text-[#0e8290]"
                        : "text-slate-700 hover:bg-slate-50 hover:text-teal-700"
                    }`
                  }
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-[#0e8290]">
                    <BusFront size={14} />
                  </span>
                  <div>
                    <span className="block leading-tight">Bus List</span>
                    <span className="block text-[10px] font-normal text-slate-400">
                      Fleet specs &amp; review approvals
                    </span>
                  </div>
                </NavLink>
              </div>
            )}
          </div>

          {/* Remaining Tabs */}
          <NavLink
            to="/admin-coupons"
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition ${
                isActive
                  ? "bg-[#0e8290] text-white shadow-sm"
                  : "text-slate-600 hover:bg-white hover:text-teal-700"
              }`
            }
          >
            <Tag size={13} className="shrink-0" />
            <span>Coupons</span>
          </NavLink>

          <NavLink
            to="/admin-bookings"
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition ${
                isActive
                  ? "bg-[#0e8290] text-white shadow-sm"
                  : "text-slate-600 hover:bg-white hover:text-teal-700"
              }`
            }
          >
            <Ticket size={13} className="shrink-0" />
            <span>Booking</span>
          </NavLink>

          
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-medium text-slate-500 transition hover:bg-white hover:text-teal-700"
          >
            <IndianRupee size={13} className="shrink-0 opacity-70" />
            <span>Finance</span>
          </button>
          <NavLink
            to="/admin-agency-profile"
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-medium transition ${
                isActive
                  ? "bg-[#0e8290] text-white shadow-sm"
                  : "text-slate-500 hover:bg-white hover:text-teal-700"
              }`
            }
          >
            <BuildingComplex size={13} className="shrink-0 opacity-70" />
            <span>Agency profile</span>
          </NavLink>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-medium text-slate-500 transition hover:bg-white hover:text-teal-700"
          >
            <Calendar size={13} className="shrink-0 opacity-70" />
            <span>Calendar</span>
          </button>
        </nav>

        {/* Action icons & Profile */}
        <div className="flex items-center gap-2">
          
          <button
            type="button"
            aria-label="Search"
            className="hidden h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition hover:bg-slate-100 sm:flex"
          >
            <Search size={16} />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative hidden h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition hover:bg-slate-100 sm:flex"
          >
            <Bell size={16} />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {/* User Profile Pill & Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              aria-expanded={profileDropdownOpen}
              className="flex items-center gap-2 rounded-full border border-slate-200/60 bg-[#f2f6f5] py-1 pl-1 pr-2.5 transition hover:bg-slate-100 focus:outline-none"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0e8290] text-[11px] font-bold text-white shadow-inner">
                {avatarLetter}
              </span>
              <span className="hidden text-left leading-tight sm:block max-w-[130px]">
                <span className="block truncate text-[11px] font-semibold text-slate-800">
                  {displayName}
                </span>
                <span className="block text-[9px] font-semibold uppercase tracking-wider text-teal-700">
                  {role}
                </span>
              </span>
              <ChevronDown
                size={13}
                className={`text-slate-500 transition-transform duration-200 ${
                  profileDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown Card */}
            {profileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-[0_12px_32px_rgba(15,23,42,0.12)] z-50">
                <div className="flex items-start gap-3 rounded-xl bg-slate-50/80 p-3 border border-slate-100">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0e8290] text-sm font-bold text-white shadow-sm">
                    {avatarLetter}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-xs font-bold text-slate-800">
                        {displayName}
                      </span>
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-teal-100 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-teal-800">
                        <ShieldCheck size={9} />
                        {role}
                      </span>
                    </div>
                    <p className="truncate text-[11px] text-slate-500 mt-0.5" title={email}>
                      {email}
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-2 border-t border-slate-100 pt-2.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                      <Mail size={11} /> Email
                    </span>
                    <span className="font-medium text-slate-700 truncate max-w-[150px]" title={email}>
                      {email}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500">
                    <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                      <User size={11} /> Role
                    </span>
                    <span className="font-semibold text-teal-700 capitalize">
                      {role}
                    </span>
                  </div>

                  {/* <div className="flex items-center justify-between text-slate-500">
                    <span className="text-[10px] font-medium text-slate-400">User ID</span>
                    <span
                      className="font-mono text-[9.5px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-[140px]"
                      title={userId}
                    >
                      {userId}
                    </span>
                  </div> */}

                  {user?.phone && (
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                        <Phone size={11} /> Phone
                      </span>
                      <span className="font-medium text-slate-700">{user.phone}</span>
                    </div>
                  )}

                  {user?.exp && (
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                        <Clock size={11} /> Session
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 border-t border-slate-100 pt-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                  >
                    <LogOut size={13} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
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

      {/* Mobile navigation panel */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="mx-auto mt-2 flex flex-col gap-1.5 rounded-2xl border border-slate-100 bg-white p-3 shadow-lg"
        >
          <NavLink
            to="/admin-dashboard"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                isActive
                  ? "bg-teal-50 font-semibold text-teal-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`
            }
          >
            <LayoutDashboard size={14} className="shrink-0" />
            Dashboard
          </NavLink>

          {/* Mobile Approvals section */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-2">
            <button
              type="button"
              onClick={() => setMobileApprovalsOpen((prev) => !prev)}
              className="flex w-full items-center justify-between px-1 py-1 text-xs font-bold text-slate-700"
            >
              <span className="flex items-center gap-1.5 text-[#0e8290]">
                <CheckCircle size={14} /> Approvals
              </span>
              <ChevronDown
                size={13}
                className={`transition-transform ${mobileApprovalsOpen ? "rotate-180" : ""}`}
              />
            </button>

            {mobileApprovalsOpen && (
              <div className="mt-1 space-y-1 pl-2">
                <NavLink
                  to="/travel-list"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                      isActive
                        ? "bg-white font-semibold text-teal-700 shadow-2xs"
                        : "text-slate-600 hover:bg-white"
                    }`
                  }
                >
                  <Route size={13} /> Travels List
                </NavLink>

                <NavLink
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                      isActive
                        ? "bg-white font-semibold text-teal-700 shadow-2xs"
                        : "text-slate-600 hover:bg-white"
                    }`
                  }
                >
                  <BusFront size={13} /> Bus List
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="/admin-coupons"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium ${
                isActive
                  ? "bg-teal-50 font-semibold text-teal-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`
            }
          >
            <Tag size={14} className="shrink-0" />
            Coupons
          </NavLink>
          <NavLink
            to="/admin-bookings"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium ${
                isActive
                  ? "bg-teal-50 font-semibold text-teal-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`
            }
          >
            <Ticket size={14} className="shrink-0" />
            Booking
          </NavLink>
          <NavLink
            to="/admin-agency-profile"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium ${
                isActive
                  ? "bg-teal-50 font-semibold text-teal-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`
            }
          >
            <BuildingComplex size={14} className="shrink-0" />
            Agency profile
          </NavLink>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <Calendar size={14} className="shrink-0 opacity-70" />
            Calendar
          </button>
        </nav>
      )}
    </header>
  );
}
