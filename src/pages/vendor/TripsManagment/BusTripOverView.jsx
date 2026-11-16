
import { BusFront, MoreHorizontal, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function BusTripOverView() {
    const buses = [
        {
            number: "TN 38 AB 4521",
            route: "Emerald Express",
            type: "AC Sleeper",
            deck: "Double deck",
            seats: "36 seats",
            stats: [4, 128, 3, 2, 1],
        },
        {
            number: "TN 58 N 9912",
            route: "Vaigai Cruiser",
            type: "AC Seater",
            deck: "Single deck",
            seats: "42 seats",
            stats: [3, 94, 1, 0, 2],
        },
        {
            number: "KA 01 AF 7824",
            route: "City Connect",
            type: "Non-AC Seater",
            deck: "Single deck",
            seats: "48 seats",
            stats: [2, 76, 4, 1, 0],
        },
    ];

    const labels = [
        "Upcoming",
        "Completed",
        "Cancelled",
        "Rejected",
        "Drafts",
    ];

    return (
        <div className="space-y-4">

            {/* Section Header */}
            <div>
                <h2 className="text-lg font-semibold text-slate-800">
                    Bus Trip Overview
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                    Live passenger ticket reservations & payment receipts across all routes
                </p>
            </div>

            {/* Bus Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {buses.map((bus) => (
                    <div
                        key={bus.number}
                        className="bg-white border border-slate-200 rounded-xl p-3"
                    >

                        {/* Bus Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
                                    <BusFront size={18} className="text-teal-700" />
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-slate-800">
                                        {bus.number}
                                    </h3>

                                    <p className="text-[10px] text-slate-500 mt-0.5">
                                        {bus.route}
                                    </p>
                                </div>

                                <span className="ml-1 rounded-full bg-green-50 text-green-600 px-2 py-0.5 text-[9px] font-medium">
                                    ● Active
                                </span>
                            </div>

                            <button className="text-slate-400 hover:text-slate-600">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>

                        {/* Bus Features */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {[bus.type, bus.deck, bus.seats].map((feature) => (
                                <span
                                    key={feature}
                                    className="bg-slate-50 border border-slate-100 text-slate-600 rounded-md px-2 py-1 text-[10px]"
                                >
                                    {feature}
                                </span>
                            ))}
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-5 border-t border-slate-100 mt-3 pt-3">
                            {bus.stats.map((value, index) => (
                                <div key={labels[index]} className="text-center">
                                    <p className="text-sm font-semibold text-slate-800">
                                        {value}
                                    </p>
                                    <p className="text-[9px] text-slate-400 mt-1">
                                        {labels[index]}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* View Details */}
                        <Link to="vendor/trip-management/busDetail/busId" className="w-full mt-3 border border-slate-200 rounded-lg py-2 text-[10px] font-medium text-teal-700 flex items-center justify-center gap-1 hover:bg-teal-50 transition-colors">
                            View in detail
                            <ChevronRight size={12} />
                        </Link>

                    </div>
                ))}
            </div>

        </div>
    );
}
