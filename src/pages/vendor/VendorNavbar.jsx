import { NavLink } from 'react-router-dom';
import { ChevronDown, Plus, Search, Bell, } from 'lucide-react';

import logo from '../../assets/vendor-logo.svg';

const VendorNavbar = () => {


    return (
        <>
            <div className="nav-main-container w-full sticky top-0 py-2 z-20 bg-[#f7f9fa] m-auto">
                <div className="navbar-container w-[94%]  h-16 m-auto px-4 flex items-center rounded-full bg-white shadow">

                    {/* Container 1: Logo */}
                    <div className="container-1 shrink-0">
                        <img src={logo} alt="Vendor Logo" className="h-10" />
                    </div>

                    {/* Container 2: Navigation Links */}
                    <div className="container-2 flex-1 flex items-center justify-center">

                        <nav className="flex items-center border border-[#eff1f1] gap-1 rounded-full bg-[#f2f8f9] p-1">

                            {/* Dashboard */}
                            <NavLink
                                to="/vendor"
                                end
                                className={({ isActive }) =>
                                    `flex items-center gap-2 rounded-full px-5 py-2 text-xs transition-colors ${isActive
                                        ? 'bg-[#0E7A88] text-white'
                                        : 'text-[#627B77] hover:bg-white hover:text-[#087f95]'
                                    }`
                                }
                            >
                                <span className="text-sm">▦</span>
                                Dashboard
                            </NavLink>

                            {/* Fleet Dropdown */}
                            <div className="group relative">

                                <button
                                    type="button"
                                    className="flex items-center font-medium gap-1 rounded-full px-4 py-2 text-xs text-[#627B77] transition-colors hover:bg-white hover:text-[#087f95]"
                                >
                                    Fleet
                                    <ChevronDown
                                        size={13}
                                        className="transition-transform font-medium duration-200 group-hover:rotate-180"
                                    />
                                </button>

                                {/* Fleet Dropdown Menu */}
                                <div className="invisible absolute left-0 top-full z-50 w-40 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">

                                    <div className="rounded-xl border border-gray-100 bg-white p-2 shadow-lg">

                                        <NavLink
                                            to="/vendor/fleet/lorem"
                                            className={({ isActive }) =>
                                                `block rounded-lg px-3 py-2 text-xs ${isActive
                                                    ? 'bg-[#e6f5f5]  text-[#087f95]'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                }`
                                            }
                                        >
                                            Lorem
                                        </NavLink>

                                        <NavLink
                                            to="/vendor/fleet/lorem-2"
                                            className={({ isActive }) =>
                                                `mt-1 block rounded-lg px-3 py-2 text-xs ${isActive
                                                    ? 'bg-[#e6f5f5] text-[#087f95]'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                }`
                                            }
                                        >
                                            Lorem 2
                                        </NavLink>

                                    </div>
                                </div>
                            </div>

                            {/* Routes Dropdown */}
                            <div className="group relative">

                                <button
                                    type="button"
                                    className="flex items-center gap-1 rounded-full font-medium px-4 py-2 text-xs text-[#627B77] transition-colors hover:bg-white hover:text-[#087f95]"
                                >
                                    Routes
                                    <ChevronDown
                                        size={13}
                                        className="transition-transform duration-200 group-hover:rotate-180"
                                    />
                                </button>

                                {/* Routes Dropdown Menu */}
                                <div className="invisible absolute left-0 top-full z-50 w-40 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">

                                    <div className="rounded-xl border border-gray-100 bg-white p-2 shadow-lg">

                                        <NavLink
                                            to="/vendor/routes/lorem"
                                            className={({ isActive }) =>
                                                `block rounded-lg px-3 py-2 text-xs ${isActive
                                                    ? 'bg-[#e6f5f5] text-[#087f95]'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                }`
                                            }
                                        >
                                            Lorem
                                        </NavLink>

                                        <NavLink
                                            to="/vendor/routes/lorem-2"
                                            className={({ isActive }) =>
                                                `mt-1 block rounded-lg px-3 py-2 text-xs ${isActive
                                                    ? 'bg-[#e6f5f5] text-[#087f95]'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                }`
                                            }
                                        >
                                            Lorem 2
                                        </NavLink>

                                    </div>
                                </div>
                            </div>

                            {/* Trips Dropdown */}
                            <div className="group relative">

                                <button
                                    type="button"
                                    className="flex items-center gap-1 font-medium rounded-full px-4 py-2 text-xs text-[#627B77] transition-colors hover:bg-white hover:text-[#087f95]"
                                >
                                    Trips
                                    <ChevronDown
                                        size={13}
                                        className="transition-transform duration-200 group-hover:rotate-180"
                                    />
                                </button>

                                {/* Trips Dropdown Menu */}
                                <div className="invisible absolute left-0 top-full z-50 w-40 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">

                                    <div className="rounded-xl border border-gray-100 bg-white p-2 shadow-lg">

                                        <NavLink
                                            to="/vendor/trips/lorem"
                                            className={({ isActive }) =>
                                                `block rounded-lg px-3 py-2 text-xs ${isActive
                                                    ? 'bg-[#e6f5f5] text-[#087f95]'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                }`
                                            }
                                        >
                                            Lorem
                                        </NavLink>

                                        <NavLink
                                            to="/vendor/trips/lorem-2"
                                            className={({ isActive }) =>
                                                `mt-1 block rounded-lg px-3 py-2 text-xs ${isActive
                                                    ? 'bg-[#e6f5f5] text-[#087f95]'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                }`
                                            }
                                        >
                                            Lorem 2
                                        </NavLink>

                                    </div>
                                </div>
                            </div>

                            {/* Bookings */}
                            <NavLink
                                to="/vendor/bookings"
                                className={({ isActive }) =>
                                    `rounded-full px-4 py-2 text-xs transition-colors ${isActive
                                        ? 'bg-[#087f95] text-white font-medium'
                                        : 'text-[#627B77] hover:bg-white font-medium hover:text-[#087f95]'
                                    }`
                                }
                            >
                                Bookings
                            </NavLink>

                            {/* Finance */}
                            <NavLink
                                to="/vendor/finance"
                                className={({ isActive }) =>
                                    `rounded-full px-4 py-2 text-xs transition-colors ${isActive
                                        ? 'bg-[#087f95] text-white font-medium'
                                        : 'text-[#627B77] hover:bg-white font-medium hover:text-[#087f95]'
                                    }`
                                }
                            >
                                Finance
                            </NavLink>

                            {/* Calendar */}
                            <NavLink
                                to="/vendor/calendar"
                                className={({ isActive }) =>
                                    `rounded-full px-4 py-2 text-xs transition-colors ${isActive
                                        ? 'bg-[#087f95] text-white font-medium'
                                        : 'text-[#627B77] font-medium hover:bg-white hover:text-[#087f95]'
                                    }`
                                }
                            >
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
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#107F8C] text-white transition-colors hover:bg-[#0D6D78]"
                            >
                                <Plus size={14} className="text-white" />
                            </button>

                            {/* Search Button */}
                            <button
                                type="button"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f8f9] text-[#607D7D] transition-colors hover:bg-[#E5EEEE]"
                            >
                                <Search size={14} />
                            </button>

                            {/* Notification Button */}
                            <button
                                type="button"
                                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f8f9] text-[#607D7D] transition-colors hover:bg-[#E5EEEE]"
                            >
                                <Bell size={14} />

                            </button>
                        </div>

                        {/* Div 2: User Profile */}
                        <div className="flex items-center gap-3 rounded-full border border-[#eff1f1] bg-[#f2f8f9] py-1 pl-2 pr-4">

                            {/* User Avatar */}
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#107F8C] text-white">
                                <span className="text-xl font-medium">
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