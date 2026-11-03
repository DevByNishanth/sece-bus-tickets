
import React from "react"
import {
    Route,
    CheckCircle2,
    Clock,
    GripVertical,
    Plus,
    ArrowUp,
    ArrowDown,
    X,
    ChevronRight,
    Bus,
    MapPin,
    Check
} from "lucide-react"

const SelectRoute = () => {
    return (
        <>
            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">

                {/* left section */}
                <div className="space-y-4">

                    {/* select routes card */}
                    <div className="rounded-xl border border-[#E8EDF1] bg-white p-4">

                        {/* header */}
                        <div className="mb-4">
                            <p className="text-xs font-semibold text-[#1E293B]">
                                Select the Routes
                            </p>
                        </div>

                        {/* route information */}
                        <div className="mb-3 flex items-center gap-2 rounded-lg border border-[#D8EFF0] bg-[#F0F9FA] px-3 py-2">
                            <CheckCircle2 size={12} className="shrink-0 text-[#0E7A88]" />

                            <p className="text-[9px] text-[#0E7A88]">
                                2 active routes match this journey. You'll compare them in the next step.
                            </p>
                        </div>

                        {/* route cards */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                            {/* route 1 */}
                            <div className="rounded-xl border border-[#0E7A88] bg-white p-3 shadow-sm">

                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1 rounded-full bg-[#E8F8F1] px-2 py-1 text-[9px] font-medium text-[#15966A]">
                                        <span className="h-1 w-1 rounded-full bg-[#15966A]" />
                                        Active
                                    </span>

                                    <div className="check-container bg-teal-800 flex items-center justify-center w-6 h-6 border border-gray-400 rounded-full">
                                        <Check className="h-4 w-4 text-white" />
                                    </div>
                                </div>

                                <p className="mt-2 text-[8px] text-[#94A3B8]">
                                    RTE-108
                                </p>

                                <p className="mt-1 text-xs font-semibold text-[#1E293B]">
                                    Highway Express
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-[#F1F5F9] pt-2.5 text-[9px] text-[#64748B]">
                                    <span className="flex items-center gap-1">
                                        <Route size={10} />
                                        214 km
                                    </span>

                                    <span className="flex items-center gap-1">
                                        <Clock size={10} />
                                        5h 45m
                                    </span>

                                    <span>4 stops</span>
                                </div>
                            </div>

                            {/* route 2 */}
                            <div className="rounded-xl border border-[#E2E8F0] bg-white p-3 transition-colors hover:border-[#0E7A88]">

                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1 rounded-full bg-[#E8F8F1] px-2 py-1 text-[9px] font-medium text-[#15966A]">
                                        <span className="h-1 w-1 rounded-full bg-[#15966A]" />
                                        Active
                                    </span>

                                    <div className="check-container bg-teal-800 flex items-center justify-center w-6 h-6 border border-gray-400 rounded-full">
                                        <Check className="h-4 w-4 text-white" />
                                    </div>
                                </div>

                                <p className="mt-2 text-[8px] text-[#94A3B8]">
                                    RTE-112
                                </p>

                                <p className="mt-1 text-xs font-semibold text-[#1E293B]">
                                    City Connector
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-[#F1F5F9] pt-2.5 text-[9px] text-[#64748B]">
                                    <span className="flex items-center gap-1">
                                        <Route size={10} />
                                        228 km
                                    </span>

                                    <span className="flex items-center gap-1">
                                        <Clock size={10} />
                                        6h 35m
                                    </span>

                                    <span>6 stops</span>
                                </div>
                            </div>

                        </div>

                    </div>


                    {/* stop schedule card */}
                    <div className="rounded-xl border border-[#E8EDF1] bg-white p-4">

                        {/* header */}
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-[#1E293B]">
                                    Stop schedule
                                </p>

                                <p className="mt-1 text-[9px] text-[#64748B]">
                                    Changes here apply only to this trip, not the master route.
                                </p>
                            </div>

                            <button className="flex items-center gap-1 text-[10px] font-medium text-[#0E7A88] hover:text-[#075E67]">
                                <Plus size={12} />
                                Add stop
                            </button>
                        </div>

                        {/* table */}
                        <div className="w-full overflow-x-auto">

                            <table className="w-full min-w-[580px] border-collapse">

                                {/* table header */}
                                <thead>
                                    <tr className="bg-[#F8FAFC] text-[10px] font-medium uppercase tracking-wide text-[#94A3B8]">
                                        <th className="w-5 px-1 py-3 text-left"></th>
                                        <th className="px-2 py-3 text-left">Stop</th>
                                        <th className="px-2 py-3 text-left">Arrival</th>
                                        <th className="px-2 py-3 text-left">Departure</th>
                                        <th className="px-2 py-3 text-center">Board</th>
                                        <th className="px-2 py-3 text-center">Drop</th>
                                        <th className="px-2 py-3 text-center"> </th>
                                    </tr>
                                </thead>

                                {/* table body */}
                                <tbody>

                                    {/* stop 1 */}
                                    <tr className="border-b border-[#F1F5F9]">
                                        <td className="px-1 py-3">
                                            <GripVertical size={12} className="text-[#CBD5E1]" />
                                        </td>

                                        <td className="px-2 py-3">
                                            <div className="flex items-start gap-2">
                                                <span className="text-[9px] font-semibold text-[#64748B]">1</span>
                                                <div>
                                                    <p className="whitespace-nowrap text-[10px] font-medium text-[#1E293B]">
                                                        Madurai Mattuthavani
                                                    </p>
                                                    <p className="mt-0.5 text-[8px] text-[#94A3B8]">
                                                        Origin
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-1 py-3">
                                            <div className="flex items-center rounded-lg border border-[#E2E8F0] px-2 py-2">
                                                <input type="time" defaultValue="21:30" className="w-[70px] text-[9px] text-[#334155] outline-none" />
                                                <Clock size={10} className="text-[#64748B]" />
                                            </div>
                                        </td>

                                        <td className="px-1 py-3">
                                            <div className="flex items-center rounded-lg border border-[#E2E8F0] px-2 py-2">
                                                <input type="time" defaultValue="21:30" className="w-[70px] text-[9px] text-[#334155] outline-none" />
                                                <Clock size={10} className="text-[#64748B]" />
                                            </div>
                                        </td>

                                        <td className="px-2 py-3 text-center">
                                            <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#0E7A88]" />
                                        </td>

                                        <td className="px-2 py-3 text-center">
                                            <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#0E7A88]" />
                                        </td>

                                        <td className="px-1 py-3">
                                            <div className="flex items-center gap-1 text-[#94A3B8]">
                                                <button><ArrowUp size={16} /></button>
                                                <button><ArrowDown size={16} /></button>
                                                <button><X size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* stop 2 */}
                                    <tr className="border-b border-[#F1F5F9]">
                                        <td className="px-1 py-3">
                                            <GripVertical size={12} className="text-[#CBD5E1]" />
                                        </td>

                                        <td className="px-2 py-3">
                                            <div className="flex items-start gap-2">
                                                <span className="text-[9px] font-semibold text-[#64748B]">2</span>
                                                <div>
                                                    <p className="whitespace-nowrap text-[10px] font-medium text-[#1E293B]">
                                                        Dindigul Bypass
                                                    </p>
                                                    <p className="mt-0.5 text-[8px] text-[#94A3B8]">
                                                        Intermediate
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-1 py-3">
                                            <div className="flex items-center rounded-lg border border-[#E2E8F0] px-2 py-2">
                                                <input type="time" defaultValue="21:30" className="w-[70px] text-[9px] text-[#334155] outline-none" />
                                                <Clock size={10} className="text-[#64748B]" />
                                            </div>
                                        </td>

                                        <td className="px-1 py-3">
                                            <div className="flex items-center rounded-lg border border-[#E2E8F0] px-2 py-2">
                                                <input type="time" defaultValue="21:30" className="w-[70px] text-[9px] text-[#334155] outline-none" />
                                                <Clock size={10} className="text-[#64748B]" />
                                            </div>
                                        </td>

                                        <td className="px-2 py-3 text-center">
                                            <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#0E7A88]" />
                                        </td>

                                        <td className="px-2 py-3 text-center">
                                            <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#0E7A88]" />
                                        </td>

                                        <td className="px-1 py-3">
                                            <div className="flex items-center gap-1 text-[#94A3B8]">
                                                <button><ArrowUp size={16} /></button>
                                                <button><ArrowDown size={16} /></button>
                                                <button><X size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* stop 3 */}
                                    <tr>
                                        <td className="px-1 py-3">
                                            <GripVertical size={12} className="text-[#CBD5E1]" />
                                        </td>

                                        <td className="px-2 py-3">
                                            <div className="flex items-start gap-2">
                                                <span className="text-[9px] font-semibold text-[#64748B]">3</span>
                                                <div>
                                                    <p className="whitespace-nowrap text-[10px] font-medium text-[#1E293B]">
                                                        Karur Bus Stand
                                                    </p>
                                                    <p className="mt-0.5 text-[8px] text-[#94A3B8]">
                                                        Intermediate
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-1 py-3">
                                            <div className="flex items-center rounded-lg border border-[#E2E8F0] px-2 py-2">
                                                <input type="time" defaultValue="21:30" className="w-[70px] text-[9px] text-[#334155] outline-none" />
                                                <Clock size={10} className="text-[#64748B]" />
                                            </div>
                                        </td>

                                        <td className="px-1 py-3">
                                            <div className="flex items-center rounded-lg border border-[#E2E8F0] px-2 py-2">
                                                <input type="time" defaultValue="21:30" className="w-[70px] text-[9px] text-[#334155] outline-none" />
                                                <Clock size={10} className="text-[#64748B]" />
                                            </div>
                                        </td>

                                        <td className="px-2 py-3 text-center">
                                            <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#0E7A88]" />
                                        </td>

                                        <td className="px-2 py-3 text-center">
                                            <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#0E7A88]" />
                                        </td>

                                        <td className="px-1 py-3">
                                            <div className="flex items-center gap-1 text-[#94A3B8]">
                                                <button><ArrowUp size={16} /></button>
                                                <button><ArrowDown size={16} /></button>
                                                <button><X size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>

                        </div>

                    </div>

                </div>


                {/* right section - route preview */}
                <div className="rounded-xl border border-[#E8EDF1] bg-white p-3">

                    {/* preview header */}
                    <div className="mb-3">
                        <p className="text-[8px] font-semibold uppercase tracking-wide text-[#0E7A88]">
                            Preview of routes & stops
                        </p>

                        <p className="mt-1 text-xs font-semibold text-[#1E293B]">
                            4 ordered stops
                        </p>

                        <p className="mt-1 text-[9px] text-[#94A3B8]">
                            Drag stops or use the arrow controls to update the sequence.
                        </p>
                    </div>

                    {/* route stop list */}
                    <div className="space-y-2">

                        {/* preview stop 1 */}
                        <div className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white p-2">

                            <GripVertical size={12} className="shrink-0 text-[#CBD5E1]" />

                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#DDF7F5] text-[8px] font-medium text-[#0E7A88]">
                                1
                            </span>

                            <div className="min-w-0 flex-1">
                                <p className="text-[7px] uppercase text-[#94A3B8]">Origin</p>
                                <p className="truncate text-[9px] font-semibold text-[#1E293B]">
                                    Madurai Main Bus Stand
                                </p>
                                <p className="truncate text-[7px] text-[#94A3B8]">
                                    Madurai • Near MGR Bus Terminus
                                </p>
                            </div>

                            <span className="shrink-0 rounded bg-[#E8F8F1] px-1.5 py-1 text-[7px] font-medium text-[#15966A]">
                                Boarding
                            </span>
                        </div>

                        {/* preview stop 2 */}
                        <div className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white p-2">

                            <GripVertical size={12} className="shrink-0 text-[#CBD5E1]" />

                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#DDF7F5] text-[8px] font-medium text-[#0E7A88]">
                                2
                            </span>

                            <div className="min-w-0 flex-1">
                                <p className="text-[7px] uppercase text-[#94A3B8]">Origin</p>
                                <p className="truncate text-[9px] font-semibold text-[#1E293B]">
                                    Madurai Main Bus Stand
                                </p>
                                <p className="truncate text-[7px] text-[#94A3B8]">
                                    Madurai • Near MGR Bus Terminus
                                </p>
                            </div>

                            <span className="shrink-0 rounded bg-[#E8F8F1] px-1.5 py-1 text-[7px] font-medium text-[#15966A]">
                                Boarding
                            </span>
                        </div>

                        {/* preview stop 3 */}
                        <div className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white p-2">

                            <GripVertical size={12} className="shrink-0 text-[#CBD5E1]" />

                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#DDF7F5] text-[8px] font-medium text-[#0E7A88]">
                                3
                            </span>

                            <div className="min-w-0 flex-1">
                                <p className="text-[7px] uppercase text-[#94A3B8]">Origin</p>
                                <p className="truncate text-[9px] font-semibold text-[#1E293B]">
                                    Madurai Main Bus Stand
                                </p>
                                <p className="truncate text-[7px] text-[#94A3B8]">
                                    Madurai • Near MGR Bus Terminus
                                </p>
                            </div>

                            <span className="shrink-0 rounded bg-[#E8F8F1] px-1.5 py-1 text-[7px] font-medium text-[#15966A]">
                                Boarding
                            </span>
                        </div>

                        {/* preview stop 4 */}
                        <div className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white p-2">

                            <GripVertical size={12} className="shrink-0 text-[#CBD5E1]" />

                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#DDF7F5] text-[8px] font-medium text-[#0E7A88]">
                                4
                            </span>

                            <div className="min-w-0 flex-1">
                                <p className="text-[7px] uppercase text-[#94A3B8]">Origin</p>
                                <p className="truncate text-[9px] font-semibold text-[#1E293B]">
                                    Madurai Main Bus Stand
                                </p>
                                <p className="truncate text-[7px] text-[#94A3B8]">
                                    Madurai • Near MGR Bus Terminus
                                </p>
                            </div>
                        </div>

                        {/* preview stop 5 */}
                        <div className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white p-2">

                            <GripVertical size={12} className="shrink-0 text-[#CBD5E1]" />

                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#DDF7F5] text-[8px] font-medium text-[#0E7A88]">
                                5
                            </span>

                            <div className="min-w-0 flex-1">
                                <p className="text-[7px] uppercase text-[#94A3B8]">Origin</p>
                                <p className="truncate text-[9px] font-semibold text-[#1E293B]">
                                    Madurai Main Bus Stand
                                </p>
                                <p className="truncate text-[7px] text-[#94A3B8]">
                                    Madurai • Near MGR Bus Terminus
                                </p>
                            </div>
                        </div>

                        {/* preview stop 6 */}
                        <div className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white p-2">

                            <GripVertical size={12} className="shrink-0 text-[#CBD5E1]" />

                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#DDF7F5] text-[8px] font-medium text-[#0E7A88]">
                                6
                            </span>

                            <div className="min-w-0 flex-1">
                                <p className="text-[7px] uppercase text-[#94A3B8]">Origin</p>
                                <p className="truncate text-[9px] font-semibold text-[#1E293B]">
                                    Madurai Main Bus Stand
                                </p>
                                <p className="truncate text-[7px] text-[#94A3B8]">
                                    Madurai • Near MGR Bus Terminus
                                </p>
                            </div>
                        </div>

                        {/* preview stop 7 */}
                        <div className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white p-2">

                            <GripVertical size={12} className="shrink-0 text-[#CBD5E1]" />

                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#DDF7F5] text-[8px] font-medium text-[#0E7A88]">
                                7
                            </span>

                            <div className="min-w-0 flex-1">
                                <p className="text-[7px] uppercase text-[#94A3B8]">Origin</p>
                                <p className="truncate text-[9px] font-semibold text-[#1E293B]">
                                    Madurai Main Bus Stand
                                </p>
                                <p className="truncate text-[7px] text-[#94A3B8]">
                                    Madurai • Near MGR Bus Terminus
                                </p>
                            </div>

                            <span className="shrink-0 rounded bg-[#FFF4E5] px-1.5 py-1 text-[7px] font-medium text-[#C77719]">
                                Dropping
                            </span>
                        </div>

                        {/* preview stop 8 */}
                        <div className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white p-2">

                            <GripVertical size={12} className="shrink-0 text-[#CBD5E1]" />

                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#DDF7F5] text-[8px] font-medium text-[#0E7A88]">
                                8
                            </span>

                            <div className="min-w-0 flex-1">
                                <p className="text-[7px] uppercase text-[#94A3B8]">Origin</p>
                                <p className="truncate text-[9px] font-semibold text-[#1E293B]">
                                    Madurai Main Bus Stand
                                </p>
                                <p className="truncate text-[7px] text-[#94A3B8]">
                                    Madurai • Near MGR Bus Terminus
                                </p>
                            </div>

                            <span className="shrink-0 rounded bg-[#FFF4E5] px-1.5 py-1 text-[7px] font-medium text-[#C77719]">
                                Dropping
                            </span>
                        </div>

                    </div>

                </div>

            </div>
        </>
    )
}

export default SelectRoute
