import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const VendorTripOperation = () => {
    return (
        <div className="col-span-8 w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

            {/* Header */}
            <div className="flex items-center justify-between">

                <div>
                    <h2 className="text-sm font-semibold text-black">
                        Today's Trip Operations
                    </h2>

                    <p className="mt-0.5 text-[10px] text-gray-500">
                        18 dispatch batches across state highways
                    </p>
                </div>

                <Link
                    to="/vendor/trips"
                    className="flex items-center gap-1 text-[10px] font-semibold text-[#087F8C] hover:text-[#065F68]"
                >
                    View All Trips
                    <ArrowRight size={13} />
                </Link>

            </div>


            {/* Trip Status Progress Bar */}
            <div className="mt-3 flex gap-1 h-4 p-1 w-full overflow-hidden rounded-full border border-gray-300">

                <div className="h-[90%] rounded-l-full w-[42%] bg-[#10818C]"></div>

                <div className="h-[90%] w-[9%] bg-[#FFB547]"></div>

                <div className="h-[90%] w-[19%] bg-[#3B82F6]"></div>

                <div className="h-[90%] w-[18%] bg-[#10818C]"></div>

                <div className="h-[90%] rounded-r-full w-[12%] bg-[#F43F5E]"></div>

            </div>


            {/* Status Legend */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">

                <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10818C]"></span>
                    <span className="text-[11px] text-gray-800">Scheduled (18)</span>
                </div>

                <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FFB547]"></span>
                    <span className="text-[11px] text-gray-800">Boarding (3)</span>
                </div>

                <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]"></span>
                    <span className="text-[11px] text-gray-800">In Transit (8)</span>
                </div>

                <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10818C]"></span>
                    <span className="text-[11px] text-gray-800">Completed (5)</span>
                </div>

                <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F43F5E]"></span>
                    <span className="text-[11px] text-gray-800">Delayed (2)</span>
                </div>

            </div>

            {/* Trips Table */}
            <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200">

                <table className="w-full min-w-[500px] border-collapse text-left">
                    {/* Table Header */}
                    <thead className="bg-[#f5f8fa]">

                        <tr className="text-[10px] font-semibold uppercase text-[#5e717d]">

                            <th className="px-3 py-2 font-medium">
                                Dep. Time
                            </th>

                            <th className="px-3 py-2 font-medium">
                                Route
                            </th>

                            <th className="px-3 py-2 font-medium">
                                Coach ID
                            </th>

                            <th className="px-3 py-2 font-medium">
                                Live Status
                            </th>

                        </tr>

                    </thead>


                    {/* Table Body */}
                    <tbody>

                        {/* Trip 1 */}
                        <tr className="border-t border-gray-200 hover:bg-gray-50">

                            <td className="whitespace-nowrap px-3 py-2 text-[11px] font-semibold text-gray-800">
                                06:30 PM
                            </td>

                            <td className="whitespace-nowrap px-3 py-2 text-[11px] text-gray-800">
                                CBE → Chennai
                            </td>

                            <td className="whitespace-nowrap px-3 py-2 font-mono text-[11px] text-gray-500">
                                TN 38 EF 3056
                            </td>

                            <td className="px-3 py-2">
                                <span className="rounded-full bg-[#DDF5F4] px-2 py-1 text-[10px] font-semibold text-[#087F8C]">
                                    Boarding
                                </span>
                            </td>

                        </tr>


                        {/* Trip 2 */}
                        <tr className="border-t border-gray-200 hover:bg-gray-50">

                            <td className="whitespace-nowrap px-3 py-2 text-[11px] font-semibold text-gray-800">
                                08:15 PM
                            </td>

                            <td className="whitespace-nowrap px-3 py-2 text-[11px] text-gray-800">
                                CBE → Bengaluru
                            </td>

                            <td className="whitespace-nowrap px-3 py-2 font-mono text-[11px] text-gray-500">
                                TN 37 CD 2045
                            </td>

                            <td className="px-3 py-2">
                                <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-700">
                                    Scheduled
                                </span>
                            </td>

                        </tr>


                        {/* Trip 3 */}
                        <tr className="border-t border-gray-200 hover:bg-gray-50">

                            <td className="whitespace-nowrap px-3 py-2 text-[11px] font-semibold text-gray-800">
                                09:00 PM
                            </td>

                            <td className="whitespace-nowrap px-3 py-2 text-[11px] text-gray-800">
                                Madurai → Chennai
                            </td>

                            <td className="whitespace-nowrap px-3 py-2 font-mono text-[11px] text-gray-500">
                                TN 58 AB 8812
                            </td>

                            <td className="px-3 py-2">
                                <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-700">
                                    Scheduled
                                </span>
                            </td>

                        </tr>


                        {/* Trip 4 */}
                        <tr className="border-t border-gray-200 hover:bg-gray-50">

                            <td className="whitespace-nowrap px-3 py-2 text-[11px] font-semibold text-gray-800">
                                08:15 PM
                            </td>

                            <td className="whitespace-nowrap px-3 py-2 text-[11px] text-gray-800">
                                CBE → Bengaluru
                            </td>

                            <td className="whitespace-nowrap px-3 py-2 font-mono text-[11px] text-gray-500">
                                TN 37 CD 2045
                            </td>

                            <td className="px-3 py-2">
                                <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-700">
                                    Scheduled
                                </span>
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default VendorTripOperation;