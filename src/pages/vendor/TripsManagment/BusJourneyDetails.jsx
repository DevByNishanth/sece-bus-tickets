
import React from "react"
import { Bus, CalendarDays, Clock, CheckCircle2, ChevronDown } from "lucide-react"

const BusJourneyDetails = () => {
    return (
        <div className="mt-5 space-y-4">

            {/* header */}
            <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E0F2F4]">
                    <Bus size={17} className="text-[#0E7A88]" />
                </div>

                <div>
                    <p className="text-sm font-semibold text-[#1E293B]">
                        Bus & Journey Details
                    </p>
                    <p className="text-[10px] text-[#64748B]">
                        Set the journey direction and planned departure.
                    </p>
                </div>
            </div>


            {/* journey direction card */}
            <div className="rounded-xl border border-[#E8EDF1] bg-white p-4">

                {/* card header */}
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#1E293B]">
                        Journey direction
                    </p>

                    <p className="text-[9px] text-[#94A3B8]">
                        Required
                    </p>
                </div>

                {/* bus, origin, destination */}
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">

                    {/* select bus */}
                    <div>
                        <label className="mb-1 block text-[10px] text-[#64748B]">
                            Select Bus
                        </label>

                        <div className="relative">
                            <select className="w-full appearance-none rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 pr-8 text-[10px] text-[#334155] outline-none focus:border-[#0E7A88]">
                                <option>TNSBAG6943 - Volvo Sleeper</option>
                                <option>TNSBAG6944 - AC Sleeper</option>
                            </select>

                            <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                        </div>
                    </div>

                    {/* origin */}
                    <div>
                        <label className="mb-1 block text-[10px] text-[#64748B]">
                            From / Origin
                        </label>

                        <div className="relative">
                            <select className="w-full appearance-none rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 pr-8 text-[10px] text-[#334155] outline-none focus:border-[#0E7A88]">
                                <option>Madurai</option>
                                <option>Chennai</option>
                                <option>Coimbatore</option>
                            </select>

                            <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                        </div>
                    </div>

                    {/* destination */}
                    <div>
                        <label className="mb-1 block text-[10px] text-[#64748B]">
                            To / Destination
                        </label>

                        <div className="relative">
                            <select className="w-full appearance-none rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 pr-8 text-[10px] text-[#334155] outline-none focus:border-[#0E7A88]">
                                <option>Coimbatore</option>
                                <option>Chennai</option>
                                <option>Madurai</option>
                            </select>

                            <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                        </div>
                    </div>

                </div>

                {/* route information */}
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#F0F9FA] px-3 py-2">
                    <CheckCircle2 size={12} className="shrink-0 text-[#0E7A88]" />

                    <p className="text-[9px] text-[#0E7A88]">
                        2 active routes match this journey. You'll compare them in the next step.
                    </p>
                </div>

            </div>


            {/* schedule card */}
            <div className="rounded-xl border border-[#E8EDF1] bg-white p-4">

                {/* card header */}
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#1E293B]">
                        Schedule
                    </p>

                    <p className="text-[9px] text-[#64748B]">
                        Indian Standard Time (IST)
                    </p>
                </div>

                {/* date and time fields */}
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">

                    {/* journey date */}
                    <div>
                        <label className="mb-1 block text-[10px] text-[#64748B]">
                            Journey date
                        </label>

                        <div className="relative">
                            <CalendarDays size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />

                            <input
                                type="date"
                                defaultValue="2025-06-18"
                                className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2 pl-8 pr-3 text-[10px] text-[#334155] outline-none focus:border-[#0E7A88]"
                            />
                        </div>
                    </div>

                    {/* departure date */}
                    <div>
                        <label className="mb-1 block text-[10px] text-[#64748B]">
                            Departure date
                        </label>

                        <div className="relative">
                            <CalendarDays size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />

                            <input
                                type="date"
                                defaultValue="2025-06-18"
                                className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2 pl-8 pr-3 text-[10px] text-[#334155] outline-none focus:border-[#0E7A88]"
                            />
                        </div>
                    </div>

                    {/* departure time */}
                    <div>
                        <label className="mb-1 block text-[10px] text-[#64748B]">
                            Departure time
                        </label>

                        <div className="relative">
                            <Clock size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />

                            <input
                                type="time"
                                defaultValue="21:30"
                                className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2 pl-8 pr-3 text-[10px] text-[#334155] outline-none focus:border-[#0E7A88]"
                            />
                        </div>
                    </div>

                </div>

                {/* availability status */}
                <div className="mt-3 flex items-center justify-between rounded-lg border border-[#D7F0E4] bg-[#EFFAF5] px-3 py-2.5">

                    <div className="flex items-start gap-2">
                        <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-[#15966A]" />

                        <div>
                            <p className="text-[10px] font-semibold text-[#16845D]">
                                Bus is available
                            </p>

                            <p className="mt-0.5 text-[9px] text-[#64748B]">
                                No conflicts found from 18 Jun, 18:30 to 19 Jun, 08:15.
                            </p>
                        </div>
                    </div>

                    <button className="shrink-0 text-[9px] font-semibold text-[#16845D] hover:underline">
                        View availability
                    </button>

                </div>

            </div>


            {/* notes card */}
            <div className="rounded-xl border border-[#E8EDF1] bg-white p-4">

                <label className="mb-2 block text-[10px] font-medium text-[#64748B]">
                    Internal reference or operational notes
                </label>

                <input
                    type="text"
                    placeholder="e.g. Festival special service, depot instructions..."
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-[10px] text-[#334155] outline-none placeholder:text-[#94A3B8] focus:border-[#0E7A88]"
                />

            </div>

        </div>
    )
}

export default BusJourneyDetails
