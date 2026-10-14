
import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import logo from '../assets/logo2.svg';

const Navbar = () => {
    return (
        <nav className="flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white sm:px-4">

            {/* Logo */}
            <div className="container-1">
                <img
                    src={logo}
                    alt="BusGo Logo"
                    className="h-10 w-[120px] object-contain"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 mr-4">

                {/* Notification */}
                <button
                    type="button"
                    aria-label="Notifications"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-[#F5FBFF] text-slate-600 transition hover:bg-slate-50"
                >
                    <Bell size={15} strokeWidth={1.8} />
                </button>

                {/* User Profile */}
                <button
                    type="button"
                    className="flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-2 pr-3 transition hover:bg-slate-50"
                >
                    <img
                        src="https://i.pravatar.cc/100?img=12"
                        alt="User profile"
                        className="h-6 w-6 rounded-full object-cover"
                    />

                    <span className="text-sm font-semibold text-[#334155]">
                        User Profile
                    </span>

                </button>

            </div>
        </nav>
    );
};

export default Navbar;
