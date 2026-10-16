import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

import { Circle } from "lucide-react";

const VendorRevenueChart = () => {

    // Sample data for the chart
    const revenueData = [
        { date: "Sep 20", revenue: 45, bookings: 20 },
        { date: "Sep 25", revenue: 75, bookings: 30 },
        { date: "Sep 30", revenue: 60, bookings: 55 },
        { date: "Oct 05", revenue: 48, bookings: 40 },
        { date: "Oct 10", revenue: 82, bookings: 85 },
        { date: "Oct 14", revenue: 55, bookings: 65 },
        { date: "Oct 18", revenue: 58, bookings: 15 },
        { date: "Today", revenue: 83, bookings: 70 },
    ];

    return (
        <div className="col-span-8 w-full rounded-xl border border-gray-100 bg-white p-4 shadow-sm">

            {/* Chart Header */}
            <div className="flex items-start justify-between">

                <div>
                    <h2 className="text-sm font-semibold text-black">
                        Revenue & Booking Trends
                    </h2>

                    <p className="mt-0.5 text-[10px] text-gray-500">
                        Daily gross ticket collections vs total reservations
                    </p>
                </div>

                {/* Chart Legend */}
                <div className="flex items-center gap-3">

                    <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-[#10818C]"></span>

                        <span className="text-[10px] text-gray-600">
                            Revenue (₹)
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-[#7167FF]"></span>

                        <span className="text-[10px] text-gray-600">
                            Bookings
                        </span>
                    </div>

                </div>

            </div>


            {/* Revenue Chart */}
            <div className="mt-4 h-[260px] w-full">

                <ResponsiveContainer width="100%" height="100%">

                    <AreaChart
                        data={revenueData}
                        margin={{
                            top: 10,
                            right: 4,
                            left: 0,
                            bottom: 0,
                        }}
                    >

                        {/* Horizontal Grid Lines */}
                        <CartesianGrid
                            strokeDasharray="2 4"
                            vertical={false}
                            stroke="#E8EEEE"
                        />

                        {/* Date Labels */}
                        <XAxis
                            dataKey="date"
                            tick={{
                                fontSize: 10,
                                fill: "#647777",
                            }}
                            axisLine={false}
                            tickLine={false}
                            tickMargin={10}
                            interval={0}
                        />

                        {/* Hide Y-Axis Labels */}
                        <YAxis
                            hide
                            domain={[0, 100]}
                        />

                        {/* Tooltip on Hover */}
                        <Tooltip
                            contentStyle={{
                                borderRadius: "10px",
                                border: "1px solid #E5E7EB",
                                fontSize: "11px",
                                padding: "10px",
                            }}
                            labelStyle={{
                                color: "#647777",
                                fontWeight: "600",
                                marginBottom: "5px",
                            }}
                            formatter={(value, name) => {
                                if (name === "revenue") {
                                    return [`₹${value} Lakhs`, "Revenue"];
                                }

                                return [`${value} bookings`, "Bookings"];
                            }}
                        />

                        {/* Revenue Area */}
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#10818C"
                            strokeWidth={2}
                            fill="#10818C"
                            fillOpacity={0.08}
                            activeDot={{
                                r: 4,
                                fill: "#10818C",
                                stroke: "#FFFFFF",
                                strokeWidth: 2,
                            }}
                        />

                        {/* Bookings Area */}
                        <Area
                            type="monotone"
                            dataKey="bookings"
                            stroke="#7167FF"
                            strokeWidth={1.8}
                            fill="#7167FF"
                            fillOpacity={0.03}
                            activeDot={{
                                r: 4,
                                fill: "#7167FF",
                                stroke: "#FFFFFF",
                                strokeWidth: 2,
                            }}
                        />

                    </AreaChart>

                </ResponsiveContainer>

            </div>


            {/* Chart Footer */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">

                <div className="flex items-center gap-1.5">

                    <Circle
                        size={7}
                        fill="#10818C"
                        stroke="none"
                    />

                    <p className="text-[10px] text-gray-600">
                        Highest Revenue: <span className="font-semibold text-gray-800">₹1.84L</span> on Oct 14
                    </p>

                </div>

                <div className="flex items-center gap-1.5">

                    <Circle
                        size={7}
                        fill="#7167FF"
                        stroke="none"
                    />

                    <p className="text-[10px] text-gray-600">
                        Average Daily Bookings: <span className="font-semibold text-gray-800">428 tickets</span>
                    </p>

                </div>

            </div>

        </div>
    );
};

export default VendorRevenueChart;