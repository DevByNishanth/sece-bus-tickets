import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

import { MoreHorizontal } from "lucide-react";

const VendorBookingPiechart = () => {

    // Sample booking status data
    const bookingData = [
        {
            name: "Confirmed",
            value: 9820,
            color: "#10818C",
            percentage: "76.4%",
        },
        {
            name: "Cancelled",
            value: 1324,
            color: "#FF795F",
            percentage: "10.3%",
        },
        {
            name: "Pending",
            value: 1146,
            color: "#FFB547",
            percentage: "8.9%",
        },
        {
            name: "Refunded",
            value: 556,
            color: "#7167FF",
            percentage: "4.3%",
        },
    ];

    return (
        <div className="w-full col-span-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">

            {/* Card Header */}
            <div className="flex items-center justify-between">

                <h2 className="text-sm font-semibold text-black">
                    Booking Status
                </h2>

                <button
                    type="button"
                    className="rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100"
                    aria-label="Booking status options"
                >
                    <MoreHorizontal size={18} />
                </button>

            </div>


           {/* Donut Chart */}
<div className="relative mx-auto h-[220px] w-full">

    <ResponsiveContainer width="100%" height="100%">
        <PieChart>
            <Pie
                data={bookingData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={0}
                stroke="none"
            >

                {bookingData.map((booking) => (
                    <Cell
                        key={booking.name}
                        fill={booking.color}
                    />
                ))}

            </Pie>
        </PieChart>
    </ResponsiveContainer>

    {/* Center Text */}
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">

        <h3 className="text-2xl font-bold text-gray-800">
            12,846
        </h3>

        <p className="mt-0.5 text-xs text-gray-500">
            Total Bookings
        </p>

    </div>

</div>


            {/* Booking Status Legend */}
            <div className="mt-2 space-y-3 border-t border-gray-200 pt-2">

                {/* Confirmed */}
                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                        <span className="h-2 w-2 rounded-full bg-[#10818C]"></span>

                        <span className="text-[11px] text-gray-700">
                            Confirmed
                        </span>

                    </div>

                    <div className="flex items-center gap-3">

                        <span className="text-[10px] font-medium text-gray-800">
                            9,820
                        </span>

                        <span className="w-9 text-right text-[10px] text-gray-500">
                            76.4%
                        </span>

                    </div>

                </div>


                {/* Cancelled */}
                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                        <span className="h-2 w-2 rounded-full bg-[#FF795F]"></span>

                        <span className="text-[11px] text-gray-700">
                            Cancelled
                        </span>

                    </div>

                    <div className="flex items-center gap-3">

                        <span className="text-[10px] font-medium text-gray-800">
                            1,324
                        </span>

                        <span className="w-9 text-right text-[10px] text-gray-500">
                            10.3%
                        </span>

                    </div>

                </div>


                {/* Pending */}
                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                        <span className="h-2 w-2 rounded-full bg-[#FFB547]"></span>

                        <span className="text-[11px] text-gray-700">
                            Pending
                        </span>

                    </div>

                    <div className="flex items-center gap-3">

                        <span className="text-[10px] font-medium text-gray-800">
                            1,146
                        </span>

                        <span className="w-9 text-right text-[10px] text-gray-500">
                            8.9%
                        </span>

                    </div>

                </div>


                {/* Refunded */}
                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                        <span className="h-2 w-2 rounded-full bg-[#7167FF]"></span>

                        <span className="text-[11px] text-gray-700">
                            Refunded
                        </span>

                    </div>

                    <div className="flex items-center gap-3">

                        <span className="text-[10px] font-medium text-gray-800">
                            556
                        </span>

                        <span className="w-9 text-right text-[10px] text-gray-500">
                            4.3%
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default VendorBookingPiechart;