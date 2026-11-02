import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Plus, Search, Bell, BusFront, Road, Luggage, CalendarDays, UsersRound, Wallet, Ticket } from 'lucide-react';

import logo from '../../assets/vendor-logo.svg';

const VendorNavbar = () => {
    const { pathname } = useLocation();
    const isStaffSectionActive = pathname === "/vendor/crew-management" || pathname === "/vendor/-staff-management";

    return (
        <>
            <div className="nav-main-container w-full sticky top-0 py-2 z-20 bg-[#f7f9fa] m-auto">
                <div className="navbar-container w-[94%]  h-16 m-auto px-4 flex  items-center rounded-full bg-white shadow">

                    {/* Container 1: Logo */}
                    <div className="container-1 shrink-0">
                        <img src={logo} alt="Vendor Logo" className="h-10" />
                    </div>

                    {/* Container 2: Navigation Links */}
                    <div className="container-2 flex-1 flex items-center  justify-center">

                        <nav className="flex items-center gap-1 border border-[#eff1f1] rounded-full bg-[#f2f8f9] px-2 py-1">

                            {/* Dashboard */}
                            <NavLink
                                to="/vendor"
                                end
                                className={({ isActive }) =>
                                    `flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-xs transition-colors ${isActive
                                        ? 'bg-[#0E7A88] text-white'
                                        : 'text-[#627B77] hover:bg-white hover:text-[#087f95]'
                                    }`
                                }
                            >
                                <span className="text-sm">▦</span>
                                Dashboard
                            </NavLink>

                            {/* Fleet Dropdown */}
                            <NavLink
                                to="/vendor/bus-management"
                                end
                                className={({ isActive }) =>
                                    `flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-xs transition-colors ${isActive
                                        ? 'bg-[#0E7A88] text-white'
                                        : 'text-[#627B77] hover:bg-white hover:text-[#087f95]'
                                    }`
                                }
                            >
                                <span className="text-sm"><BusFront size={13} /></span>
                                Bus
                            </NavLink>

                            {/* Routes Dropdown */}
                            <NavLink
                                to="/vendor/root-management"
                                end
                                className={({ isActive }) =>
                                    `flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-xs transition-colors ${isActive
                                        ? 'bg-[#0E7A88] text-white'
                                        : 'text-[#627B77] hover:bg-white hover:text-[#087f95]'
                                    }`
                                }
                            >

                                <span className="text-sm"><Road size={13} /></span>
                                Routes
                            </NavLink>

                            {/* Trips Dropdown */}
                            <NavLink
                                to="/vendor/trip-management"
                                end
                                className={({ isActive }) =>
                                    `flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-xs transition-colors ${isActive
                                        ? 'bg-[#0E7A88] text-white'
                                        : 'text-[#627B77] hover:bg-white hover:text-[#087f95]'
                                    }`
                                }
                            >
                                <span className="text-sm"><Luggage size={13} /></span>
                                Trips
                            </NavLink>
                            <div className="group relative">
                                <button
                                    type="button"
                                    aria-haspopup="true"
                                    className={`flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-xs transition-colors ${isStaffSectionActive ? 'bg-[#0E7A88] text-white' : 'text-[#627B77] hover:bg-white hover:text-[#087f95]'}`}
                                >
                                    <UsersRound size={13} />
                                    Staffs
                                    <ChevronDown size={12} className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                                </button>
                                <div className="invisible absolute left-0 top-full z-50 min-w-36 translate-y-1 rounded-xl border border-slate-100 bg-white p-1.5 opacity-0 shadow-lg transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                                    <NavLink to="/vendor/crew-management" className={({ isActive }) => `block rounded-lg px-3 py-2 text-xs transition-colors ${isActive ? 'bg-teal-50 font-semibold text-teal-800' : 'text-[#627B77] hover:bg-slate-50 hover:text-[#087f95]'}`}>
                                        Driver
                                    </NavLink>
                                    <NavLink to="/vendor/-staff-management" className={({ isActive }) => `block rounded-lg px-3 py-2 text-xs transition-colors ${isActive ? 'bg-teal-50 font-semibold text-teal-800' : 'text-[#627B77] hover:bg-slate-50 hover:text-[#087f95]'}`}>
                                        Crew
                                    </NavLink>
                                </div>
                            </div>

                            {/* Bookings */}
                            <NavLink
                                to="/vendor/bookings"
                                className={({ isActive }) =>
                                    `flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-xs transition-colors ${isActive
                                        ? 'bg-[#087f95] text-white font-medium'
                                        : 'text-[#627B77] hover:bg-white font-medium hover:text-[#087f95]'
                                    }`
                                }
                            >
                                <Ticket size={13} />
                                Bookings
                            </NavLink>
                            <NavLink
                                to="/vendor/finance"
                                className={({ isActive }) =>
                                    `flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-xs transition-colors ${isActive
                                        ? 'bg-[#087f95] text-white font-medium'
                                        : 'text-[#627B77] hover:bg-white font-medium hover:text-[#087f95]'
                                    }`
                                }
                            >
                                <Wallet size={13} />
                                Finance
                            </NavLink>
                            <NavLink
                                to="/vendor/calendar"
                                className={({ isActive }) =>
                                    `flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-xs transition-colors ${isActive
                                        ? 'bg-[#087f95] text-white font-medium'
                                        : 'text-[#627B77] hover:bg-white font-medium hover:text-[#087f95]'
                                    }`
                                }
                            >
                                <CalendarDays size={13} />
                                Calendar
                            </NavLink>




                        </nav>
                    </div>

                    {/* Container 3: Action Icons and User Profile */}
                    <div className="container-3 flex items-center gap-4">

                        {/* Div 1: Three Action Icons */}
                        <div className="flex items-center gap-2">

                            {/* Add Button */}
                            <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0E7A88] text-white transition-colors hover:bg-[#0D6D78]"
                            >
                                <Plus size={14} className="text-white" />
                            </button>

                            {/* Search Button */}
                            <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f2f8f9] text-[#607D7D] transition-colors hover:bg-[#E5EEEE]"
                            >
                                <Search size={14} />
                            </button>

                            {/* Notification Button */}
                            <button
                                type="button"
                                className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#f2f8f9] text-[#607D7D] transition-colors hover:bg-[#E5EEEE]"
                            >
                                <Bell size={14} />

                            </button>
                        </div>

                        {/* Div 2: User Profile */}
                        <div className="flex items-center gap-3 rounded-full border border-[#eff1f1] bg-[#f2f8f9] py-1 pl-2 pr-4">

                            {/* User Avatar */}
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#107F8C] text-white">
                                <span className="font-medium">
                                    V
                                </span>
                            </div>

                            {/* User Information */}
                            <div className="flex flex-col">
                                <h3 className="whitespace-nowrap text-[13px]  font-medium  text-[#1F2D2D]">
                                    Venkateshwaran
                                </h3>

                                <p className="text-base text-[11px] text-[#658080]">
                                    Fleet Owner
                                </p>
                            </div>

                            {/* Dropdown Icon */}
                            <button
                                type="button"
                                className="ml-2 flex items-center justify-center text-[#658080] hover:text-[#107F8C]"
                            >
                                <ChevronDown size={20} strokeWidth={2.5} />
                            </button>

                        </div>

                    </div>

                </div>
            </div>
        </>
    );
};

export default VendorNavbar;
