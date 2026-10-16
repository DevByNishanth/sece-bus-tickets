import React, { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo2.svg';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLoginClick = () => {
    // Open login modal while keeping current page as background
    navigate('/login', { state: { from: location.pathname } });
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  // Derive display name and avatar
  const displayName = user
    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.name || user.email
    : '';
  const avatarUrl =
    user?.avatar ||
    (typeof user?.profileImage === 'string'
      ? user.profileImage
      : user?.profileImage?.url) ||
    null;
  const initials = displayName
    ? displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <nav className="flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white sm:px-4">

      {/* Logo */}
      <div className="container-1">
        <button type="button" onClick={() => navigate('/')} className="flex items-center">
          <img src={logo} alt="BusGo Logo" className="h-10 w-[120px] object-contain" />
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 mr-4">

        {/* Notification — only when logged in */}
        {user && (
          <button
            type="button"
            aria-label="Notifications"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-[#F5FBFF] text-slate-600 transition hover:bg-slate-50"
          >
            <Bell size={15} strokeWidth={1.8} />
          </button>
        )}

        {/* Auth area */}
        {loading ? (
          <div className="w-24 h-9 rounded-full bg-slate-100 animate-pulse" />
        ) : user ? (
          /* ── User profile dropdown ── */
          <div className="relative" ref={dropRef}>
            <button
              type="button"
              id="navbar-user-menu"
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-2 pr-3 transition hover:bg-slate-50"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              {/* Avatar */}
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-6 w-6 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <span className="h-6 w-6 rounded-full bg-teal-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                  {initials}
                </span>
              )}

              <span className="text-sm font-semibold text-[#334155] max-w-[120px] truncate">
                {displayName}
              </span>
              <ChevronDown
                size={14}
                strokeWidth={2}
                className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-slate-200 bg-white shadow-lg py-1 z-50 animate-fadeIn">
                <button
                  type="button"
                  onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <UserIcon size={15} className="text-slate-400" />
                  My Profile
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  type="button"
                  id="navbar-logout-btn"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── Login button ── */
          <button
            type="button"
            id="navbar-login-btn"
            onClick={handleLoginClick}
            className="flex h-9 items-center gap-2 rounded-full border border-teal-600 bg-teal-600 px-5 text-sm font-semibold text-white transition hover:bg-teal-700 shadow-sm shadow-teal-600/20"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
