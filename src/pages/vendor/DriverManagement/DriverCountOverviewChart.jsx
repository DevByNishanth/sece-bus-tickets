import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    ReferenceLine,
    ReferenceDot,
    Cell,
    LabelList,
} from "recharts";

// Monthly driver statistics
const driverData = [
    { month: "JAN", height: 1400, count: 123 }, 
    { month: "FEB", height: 2300, count: 157 },
    { month: "MAR", height: 1650, count: 173 },
    { month: "ABR", height: 1200, count: 21 },
    { month: "MAY", height: 1650, count: 413 },
    { month: "JUN", height: 3750, count: 527 },
    { month: "JUL", height: 2800, count: 167 },
    { month: "AUG", height: 1400, count: 187 },
    { month: "SEP", height: 2400, count: 213 },
    { month: "OCT", height: 1750, count: 123 },
    { month: "NOV", height: 900, count: 97 },
    { month: "DEC", height: 2950, count: 67 },
];

const selectedMonth = driverData.find(
    (item) => item.month === "JUN"
);

// Draw the striped background and solid bar together
const CustomDriverBar = (props) => {
    const {
        x,
        y,
        width,
        height,
        payload,
        background,
    } = props;

    // Background bar dimensions
    const backgroundY = background.y;
    const backgroundHeight = background.height;

    // Actual bar color
    const isSelected = payload.month === "JUN";
    const barColor = isSelected ? "#117F89" : "#56A4AD";

    const radius = Math.min(12, width / 2);

    return (
        <g>
            {/* Striped background */}
            <rect
                x={x}
                y={backgroundY}
                width={width}
                height={backgroundHeight}
                rx={radius}
                ry={radius}
                fill="url(#barStripe)"
            />

            {/* Actual value bar */}
            <path
                d={`
                    M ${x},${y + height}
                    L ${x},${y + radius}
                    Q ${x},${y} ${x + radius},${y}
                    L ${x + width - radius},${y}
                    Q ${x + width},${y} ${x + width},${y + radius}
                    L ${x + width},${y + height}
                    Z
                `}
                fill={barColor}
            />

            {/* Value at the bottom of the bar */}
            <text
                x={x + width / 2}
                y={y + height - 10}
                textAnchor="middle"
                fontSize={12}
                fontWeight={isSelected ? 600 : 400}
                fill={isSelected ? "#FFFFFF" : "#17212B"}
            >
                {payload.count}
            </text>
        </g>
    );
};

const DriverCountOverviewChart = () => {
    return (
        <div className="w-full rounded-2xl mt-4 border border-slate-200 bg-white p-4 shadow-sm">

            {/* Heading */}
            <div className="mb-7">
                <h2 className="font-semibold text-[#17212B]">
                    Driver Count Overview
                </h2>

                <p className="text-[12px] text-[#718096]">
                    Daily gross ticket collections vs total reservations
                </p>
            </div>

            {/* Chart */}
            <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={driverData}
                        margin={{
                            top: 10,
                            right: 4,
                            left: -8,
                            bottom: 0,
                        }}
                        barCategoryGap="24%"
                    >
                        {/* SVG striped pattern */}
                        <defs>
                            <pattern
                                id="barStripe"
                                patternUnits="userSpaceOnUse"
                                width="8"
                                height="8"
                                patternTransform="rotate(-15)"
                            >
                                <rect
                                    width="8"
                                    height="8"
                                    fill="#F8FBFE"
                                />

                                <line
                                    x1="0"
                                    y1="0"
                                    x2="8"
                                    y2="0"
                                    stroke="#DCECFB"
                                    strokeWidth="1"
                                />
                            </pattern>
                        </defs>

                        {/* Grid lines */}
                        <CartesianGrid
                            vertical={false}
                            stroke="#E7EEF5"
                            strokeDasharray="3 4"
                        />

                        {/* Y axis */}
                        <YAxis
                            domain={[0, 5000]}
                            ticks={[0, 1000, 2000, 3000, 4000, 5000]}
                            tickFormatter={(value) =>
                                value === 0 ? "0" : `${value / 1000}K`
                            }
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: "#7183A5",
                                fontSize: 10,
                            }}
                            width={32}
                        />

                        {/* X axis */}
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: "#7183A5",
                                fontSize: 10,
                            }}
                            tickMargin={12}
                        />

                        {/* Highlight line */}
                        <ReferenceLine
                            y={selectedMonth.height}
                            stroke="#117F89"
                            strokeWidth={1.5}
                        />

                        {/* Background and actual bars share the same position */}
                        <Bar
                            dataKey="height"
                            maxBarSize={52}
                            background={{
                                fill: "transparent",
                            }}
                            shape={(props) => (
                                <CustomDriverBar {...props} />
                            )}
                            isAnimationActive={false}
                        />

                        {/* Selected June marker */}
                        <ReferenceDot
                            x="JUN"
                            y={selectedMonth.height}
                            r={5}
                            fill="#117F89"
                            stroke="#FFFFFF"
                            strokeWidth={2}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DriverCountOverviewChart;
