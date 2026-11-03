
import React from "react"
import {
    Check,
    Map,
    Bus,
    Ticket,
    Users,
    CalendarDays,
    Armchair,
    IndianRupee,
    UserRound,
    Clock,
    CheckCircle2,
    Pencil,
    Route
} from "lucide-react"

const ReviewTrip = () => {
    return (
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">

            {/* left section */}
            <div className="space-y-4">

                {/* top row */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                    {/* journey and route card */}
                    <div className="rounded-xl border border-[#E2E8F0] bg-white p-3">

                        {/* card header */}
                        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
                            <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#E5F5F5]">
                                    <Map size={13} className="text-[#0E7A88]" />
                                </div>

                                <p className="text-[12px] font-semibold text-[#1E293B]">
                                    Journey & route
                                </p>
                            </div>

                            <button className="text-[11px] font-medium text-[#0E7A88] hover:underline">
                                Edit
                            </button>
                        </div>

                        {/* journey details */}
                        <div className="mt-2 space-y-2">

                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-[#64748B]">Journey</span>
                                <span className="text-[11px] font-medium text-[#334155]">Madurai — Coimbatore</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-[#64748B]">Departure</span>
                                <span className="text-[11px] font-medium text-[#334155]">18 Jun 2025 · 21:30 IST</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-[#64748B]">Arrival</span>
                                <span className="text-[11px] font-medium text-[#334155]">19 Jun 2025 · 03:15 IST</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-[#64748B]">Route</span>
                                <span className="text-[11px] font-medium text-[#334155]">Highway Express · 214 km</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-[#64748B]">Stops</span>
                                <span className="text-[11px] font-medium text-[#334155]">4 approved stops · 5h 45m</span>
                            </div>

                        </div>

                    </div>


                    {/* bus and layout card */}
                    <div className="rounded-xl border border-[#E2E8F0] bg-white p-3">

                        {/* card header */}
                        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
                            <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#E5F5F5]">
                                    <Bus size={13} className="text-[#0E7A88]" />
                                </div>

                                <p className="text-[12px] font-semibold text-[#1E293B]">
                                    Bus & layout
                                </p>
                            </div>

                            <button className="text-[11px] font-medium text-[#0E7A88] hover:underline">
                                Edit
                            </button>
                        </div>

                        {/* bus details */}
                        <div className="mt-2 space-y-2">

                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-[#64748B]">Bus</span>
                                <span className="text-[11px] font-medium text-[#334155]">TN 38 AB 4521</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-[#64748B]">Vehicle</span>
                                <span className="text-[11px] font-medium text-[#334155]">Emerald Express · AC Sleeper</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-[#64748B]">Layout</span>
                                <span className="text-[11px] font-medium text-[#334155]">Volvo Sleeper 2+1 · SL36</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-[#64748B]">Capacity</span>
                                <span className="text-[11px] font-medium text-[#334155]">36 berths · Double deck</span>
                            </div>

                        </div>

                    </div>

                </div>


                {/* bottom row */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                    {/* pricing card */}
                    <div className="rounded-xl border border-[#E2E8F0] bg-white p-3">

                        {/* card header */}
                        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
                            <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#E5F5F5]">
                                    <Ticket size={13} className="text-[#0E7A88]" />
                                </div>

                                <p className="text-[12px] font-semibold text-[#1E293B]">
                                    Pricing
                                </p>
                            </div>

                            <button className="text-[11px] font-medium text-[#0E7A88] hover:underline">
                                Edit
                            </button>
                        </div>

                        {/* pricing details */}
                        <div className="mt-2 space-y-2">

                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-[#64748B]">Mode</span>
                                <span className="text-[11px] font-medium text-[#334155]">Common fare</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-[#64748B]">Fare plan</span>
                                <span className="text-[11px] font-medium text-[#334155]">Southern Sleeper Standard v3</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-[#64748B]">Base fare</span>
                                <span className="text-[11px] font-semibold text-[#334155]">₹1,299</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-[#64748B]">Passenger pays</span>
                                <span className="text-[11px] font-medium text-[#334155]">₹1,367 incl. fees</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-[#64748B]">Coverage</span>
                                <span className="text-[11px] font-semibold text-[#15966A]">36 / 36 berths priced</span>
                            </div>

                        </div>

                    </div>


                    {/* driver and crew card */}
                    <div className="rounded-xl border border-[#E2E8F0] bg-white p-3">

                        {/* card header */}
                        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
                            <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#E5F5F5]">
                                    <Users size={13} className="text-[#0E7A88]" />
                                </div>

                                <p className="text-[12px] font-semibold text-[#1E293B]">
                                    Driver & crew
                                </p>
                            </div>

                            <button className="text-[11px] font-medium text-[#0E7A88] hover:underline">
                                Edit
                            </button>
                        </div>

                        {/* driver information */}
                        <div className="mt-3 flex items-center justify-between rounded-lg bg-[#F8FAFC] p-2.5">

                            <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#B8EBD2] bg-[#E5F9EF]">
                                    <span className="text-[8px] font-semibold text-[#15966A]">MP</span>
                                </div>

                                <div>
                                    <p className="text-[11px] font-semibold text-[#334155]">
                                        M. Priya
                                    </p>
                                    <p className="mt-0.5 text-[8px] text-[#64748B]">
                                        Attendant · CREW-2024
                                    </p>
                                </div>
                            </div>

                            <Check size={13} className="text-[#15966A]" />

                        </div>

                        <p className="mt-8 text-[8px] text-[#94A3B8]">
                            * 1 active crew assigned to this trip.
                        </p>

                    </div>

                </div>

            </div>


            {/* right section - trip summary */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-3">

                {/* summary header */}
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#1E293B]">
                        Trip summary
                    </p>

                    <span className="rounded-full bg-[#E5F5F5] px-2 py-1 text-[8px] font-medium text-[#0E7A88]">
                        Live preview
                    </span>
                </div>


                {/* journey timeline */}
                <div className="relative mt-4 space-y-5">

                    {/* timeline line */}
                    <div className="absolute left-[9px] top-4 h-[72px] border-l border-dashed border-[#CBD5E1]" />

                    {/* origin */}
                    <div className="relative flex items-start gap-3">
                        <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#0E7A88] text-[8px] font-semibold text-white">
                            M
                        </div>

                        <div>
                            <p className="text-[8px] text-[#64748B]">Origin · 18 Jun</p>
                            <p className="mt-1 text-[12px] font-semibold text-[#1E293B]">
                                Madurai
                            </p>
                            <p className="text-[8px] text-[#64748B]">21:30</p>

                            <span className="mt-2 inline-flex rounded bg-[#F1F5F9] px-2 py-1 text-[8px] text-[#64748B]">
                                5h 45m
                            </span>
                        </div>
                    </div>

                    {/* destination */}
                    <div className="relative flex items-start gap-3">
                        <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#F97316] text-[8px] font-semibold text-white">
                            C
                        </div>

                        <div>
                            <p className="text-[8px] text-[#64748B]">Destination · 19 Jun</p>
                            <p className="mt-1 text-[12px] font-semibold text-[#1E293B]">
                                Coimbatore
                            </p>
                            <p className="text-[8px] text-[#64748B]">03:15 +1 day</p>
                        </div>
                    </div>

                </div>


                {/* trip summary details */}
                <div className="mt-4 space-y-2 border-t border-[#F1F5F9] pt-3">

                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#64748B]">Bus</span>
                        <span className="text-[11px] font-medium text-[#334155]">TN 38 AB 4521</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#64748B]">Route</span>
                        <span className="text-[11px] font-medium text-[#334155]">Highway Express</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#64748B]">Layout</span>
                        <span className="text-[11px] font-medium text-[#334155]">Sleeper 2+1 · 36</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#64748B]">Base fare</span>
                        <span className="text-[11px] font-semibold text-[#334155]">₹1,299</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#64748B]">Crew</span>
                        <span className="text-[11px] font-medium text-[#334155]">1 assigned</span>
                    </div>

                </div>


                {/* success message */}
                <div className="mt-3 flex items-center gap-2 border-t border-[#F1F5F9] pt-3">
                    <CheckCircle2 size={11} className="shrink-0 text-[#15966A]" />

                    <p className="text-[8px] text-[#15966A]">
                        Progress is saved while you move between steps.
                    </p>
                </div>

            </div>

        </div>
    )
}

export default ReviewTrip
