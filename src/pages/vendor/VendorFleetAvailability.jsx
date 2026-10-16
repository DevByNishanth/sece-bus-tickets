import {
    BusFront,
    Users,
    Wrench,
    CircleAlert,
    FileWarning,
    GitBranch,
} from "lucide-react";

import { Link } from "react-router-dom";

const VendorFleetAvailability = () => {
    return (
        <div className=" col-span-4 w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

            {/* Header */}
            <div className="flex items-center justify-between">

                <h2 className="text-sm font-semibold text-black">
                    Fleet Availability
                </h2>

                <span className="text-[9px] text-gray-500">
                    24 Total Buses
                </span>

            </div>


            {/* Fleet Statistics */}
            <div className="mt-3 grid grid-cols-4 gap-1.5">

                {/* Available */}
                <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-[#F5F9FA] px-1 py-2">

                    <h3 className="text-lg font-semibold text-[#087F8C]">
                        15
                    </h3>

                    <p className="mt-1 text-[10px] font-medium uppercase text-[#5E717D]">
                        Available
                    </p>

                </div>


                {/* Assigned */}

                <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-[#F5F9FA] px-1 py-2">

                    <h3 className="text-lg font-semibold text-[#087F8C]">
                        6
                    </h3>

                    <p className="mt-1 text-[10px] font-medium uppercase text-[#5E717D]">
                        Assigned
                    </p>

                </div>


                {/* Maintenance */}
                <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-[#F5F9FA] px-1 py-2">

                    <h3 className="text-lg font-semibold text-orange-400">
                        15
                    </h3>

                    <p className="mt-1 text-[10px] font-medium uppercase text-[#5E717D]">
                        Maintenance
                    </p>

                </div>

                {/* Offline */}
                <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-[#F5F9FA] px-1 py-2">

                    <h3 className="text-lg font-semibold text-red-400">
                        1
                    </h3>

                    <p className="mt-1 text-[10px] font-medium uppercase text-[#5E717D]">
                        Offline
                    </p>

                </div>


            </div>


            {/* Priority Actions Heading */}
            <h3 className="mt-6 text-[12px] font-semibold uppercase tracking-wide text-black">
                Priority Action Items
            </h3>


            {/* Action Item 1 */}
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-[#FFE2D9] bg-[#FFF6F4] p-2.5">

                <FileWarning
                    size={17}
                    className="mt-0.5 shrink-0 text-[#FF795F]"
                />

                <div>

                    <p className="text-[11px] font-semibold text-black">
                        2 vehicle documents expiring soon
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-[#5E717D]">
                        Pollution certs for TN 38 EF 3056 in 3 days
                    </p>

                </div>

            </div>


            {/* Action Item 2 */}
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#c2e3e9] bg-[#f0f9fa] p-2.5">

                <GitBranch
                    size={17}
                    className="shrink-0 text-[#087F8C]"
                />

                <div className="min-w-0 flex-1">

                    <p className="text-[11px] font-semibold text-black">
                        1 bus awaiting route confirmation
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-[#5E717D]">
                        Special weekend service to Tirupati
                    </p>

                </div>

                <Link
                    to="/vendor/routes"
                    className="shrink-0 rounded-md bg-[#0E7A88] px-2.5 py-1.5 text-[9px] font-semibold text-white transition-colors hover:bg-[#066874]"
                >
                    Assign
                </Link>

            </div>

        </div>
    );
};

export default VendorFleetAvailability;