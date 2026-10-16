import { ContactRound, IndianRupee, Accessibility, BusFront } from 'lucide-react';
import icon1 from '../../assets/icon1.svg'
import icon2 from '../../assets/icon2.svg'
import icon3 from '../../assets/icon3.svg'
import icon4 from '../../assets/icon4.svg'
const VendorStatcard = () => {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-3">
                {/* Card 1: Total Bookings */}
                <div className="rounded-xl bg-white p-4 shadow-sm ">

                    <div className="flex items-center justify-between">
                        <p className="text-[13px] font-medium text-gray-500">
                            TOTAL BOOKINGS
                        </p>

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-r from-[#087F8C] to-[#10B981] text-white">
                            <img src={icon1} className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-gray-800">
                            12,846
                        </h2>

                        <span className="rounded-full bg-[#e4f3ec] px-2 py-0.5 text-[10px] font-semibold text-[#0E7A88]">
                            +18.6% ↑
                        </span>
                    </div>

                    <p className="mt-0.5 text-[12px] text-[#627B77]">
                        Today
                    </p>

                </div>

                {/* Card 2: Gross Booking Value */}
                <div className="rounded-xl bg-white p-3 shadow-sm">

                    <div className="flex items-center justify-between">
                        <p className="text-[13px] font-medium text-gray-500">
                            GROSS BOOKING VALUE
                        </p>

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-r from-[#0284C7] to-[#4F46E5] text-white">
                            <img src={icon2} className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-gray-800">
                            ₹48.6L
                        </h2>

                        <span className="rounded-full bg-[#e4f3ec] px-2 py-0.5 text-[10px] font-medium text-[#0E7A88]">
                            +12.4% ↑
                        </span>
                    </div>

                    <p className="mt-0.5 text-[12px] text-[#627B77]">
                        Today
                    </p>

                </div>


                {/* Card 3: Seat Occupancy Rate */}
                <div className="rounded-xl bg-white p-3 shadow-sm">

                    <div className="flex items-center justify-between">
                        <p className="text-[13px] font-medium text-gray-500">
                            SEAT OCCUPANCY RATE
                        </p>

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-r from-[#9333EA] to-[#6366F1] text-white">
                            <img src={icon3} className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-gray-800">
                            78.4%
                        </h2>

                        <span className="rounded-full bg-[#e4f3ec] px-2 py-0.5 text-[10px] font-medium text-[#0E7A88]">
                            +6.2% pts
                        </span>
                    </div>

                    {/* Occupancy Progress Bar */}
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-100">
                        <div className="h-1.5 w-[78.4%] rounded-full bg-[#10818C]"></div>
                    </div>

                </div>

                {/* Card 4: Fleet Availability */}
                <div className="rounded-xl bg-white p-3 shadow-sm">

                    <div className="flex items-center justify-between">
                        <p className="text-[13px] font-medium text-gray-500">
                            FLEET AVAILABILITY
                        </p>

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-r from-[#F59E0B] to-[#F97316] text-white">
                            <img src={icon4} className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-gray-800">
                            15
                        </h2>

                        <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-medium text-cyan-600">
                            6 Assigned
                        </span>
                    </div>

                    <p className="mt-0.5 text-[12px] text-[#627B77]">
                        Today
                    </p>

                </div>
            </div>
        </>
    );
};

export default VendorStatcard;