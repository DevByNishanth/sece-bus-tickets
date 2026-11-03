
import React from "react"
import {
    Armchair,
    Bus,
    Eye,
    Plus,
    Pencil,
    Trash2,
    Check,
    Minus,
    Maximize,
    CircleDot
} from "lucide-react"

const SeatLayoutStep = () => {
    return (
        <div className="mt-5 overflow-hidden rounded-xl border border-[#E8EDF1] bg-white">

            {/* page header */}
            <div className="flex items-center justify-between bg-[#F8FAFC] px-4 py-3">

                <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#D8EFF0] bg-[#F0F9FA]">
                        <Armchair size={15} className="text-[#0E7A88]" />
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-[#1E293B]">
                            Select seat layout
                        </p>

                        <p className="mt-0.5 text-[10px]  text-[#64748B]">
                            Choose a compatible saved layout from Seat Layout Management.
                        </p>
                    </div>
                </div>

                <button className="flex items-center gap-2 rounded-md bg-[#0E7A88] px-3 py-2 text-[10px]  font-medium text-white hover:bg-[#0B6672]">
                    <Eye size={11} />
                    Preview
                </button>

            </div>


            {/* main content */}
            <div className="grid grid-cols-12 ">

                {/* left panel */}
                <div className="border-r col-span-7 border-[#F1F5F9] p-3">

                    {/* deck tabs */}
                    <div className="flex gap-3 rounded-lg bg-[#F1F5F9] p-3">

                        <button className="flex-1 rounded-md bg-white py-2 text-[12px] font-medium text-[#0E7A88] shadow-sm">
                            Lower Deck
                        </button>

                        <button className="flex-1 rounded-md py-2 text-[12px] font-medium text-[#64748B] hover:bg-white">
                            Upper Deck
                        </button>

                    </div>


                    {/* arrangement configuration */}
                    <div className="mt-3">

                        <p className="text-[10px] font-medium uppercase tracking-wide text-[#94A3B8]">
                            Arrangement configuration
                        </p>

                        <p className="mt-1 text-xs font-semibold text-[#1E293B]">
                            Lower Deck
                        </p>

                        {/* configuration cards */}
                        <div className="mt-2 grid grid-cols-2 gap-2">

                            {/* layout type */}
                            <div className="rounded-lg border border-[#F1F5F9] bg-[#F8FAFC] p-2.5">
                                <p className="text-[10px] uppercase text-[#94A3B8]">
                                    Layout type
                                </p>

                                <p className="mt-1 text-[10px]  font-semibold text-[#334155]">
                                    Seats + Sleepers
                                </p>
                            </div>

                            {/* capacity */}
                            <div className="rounded-lg border border-[#F1F5F9] bg-[#F8FAFC] p-2.5">
                                <p className="text-[10px] uppercase text-[#94A3B8]">
                                    Total capacity
                                </p>

                                <p className="mt-1 text-[10px]  font-semibold text-[#334155]">
                                    24
                                </p>
                            </div>

                            {/* driver side */}
                            <div className="rounded-lg border border-[#F1F5F9] bg-[#F8FAFC] p-2.5">
                                <p className="text-[10px]  uppercase text-[#94A3B8]">
                                    Driver side
                                </p>

                                <p className="mt-1 text-[10px]  font-semibold text-[#334155]">
                                    5 rows
                                </p>
                            </div>

                            {/* opposite side */}
                            <div className="rounded-lg border border-[#F1F5F9] bg-[#F8FAFC] p-2.5">
                                <p className="text-[10px]  uppercase text-[#94A3B8]">
                                    Opposite side
                                </p>

                                <p className="mt-1 text-[10px]  font-semibold text-[#334155]">
                                    5 rows
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* driver side configuration */}
                    <div className="mt-4 ">

                        {/* section header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[12px] font-semibold text-[#1E293B]">
                                    Driver-Side Configuration
                                </p>

                                <p className="mt-0.5 text-[10px] text-[#94A3B8]">
                                    5 rows · 17 passengers
                                </p>
                            </div>

                            <button className="flex items-center gap-1 rounded-md border border-[#0E7A88] px-2 py-1.5 text-[10px]  font-medium text-[#0E7A88] hover:bg-[#F0F9FA]">
                                <Plus size={11} />
                                Add Row
                            </button>
                        </div>


                        {/* configuration table */}
                        <div className="mt-3">

                            {/* table heading */}
                            <div className="grid grid-cols-[40px_1fr_45px_40px] border-b border-[#F1F5F9] bg-[#F8FAFC] px-2 py-2 text-[10px]  font-medium uppercase text-[#94A3B8]">
                                <p>Row</p>
                                <p>Component</p>
                                <p>Units</p>
                                <p></p>
                            </div>


                            {/* row 1 */}
                            <div className="grid grid-cols-[40px_1fr_45px_40px] items-center border-b border-[#F1F5F9] px-2 py-3">

                                <p className="text-[10px] font-medium text-[#64748B]">
                                    01
                                </p>

                                <div className="flex items-center gap-2">
                                    <div className="flex h-5 w-4 items-center justify-center rounded border border-[#0E7A88] bg-[#E5F5F5]">
                                        <div className="h-3 w-2 rounded-sm border border-[#0E7A88] bg-white" />
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-medium text-[#334155]">
                                            Seater
                                        </p>

                                        <p className="text-[10px]  text-[#94A3B8]">
                                            Seat row
                                        </p>
                                    </div>
                                </div>

                                <p className="text-[14px] text-[#334155]">
                                    2
                                </p>

                                <div className="flex items-center gap-1">
                                    <button className="text-[#0E7A88] hover:text-[#075E67]">
                                        <Pencil size={14} />
                                    </button>

                                    <button className="text-[#F87171] hover:text-red-600">
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                            </div>


                            {/* row 2 */}
                            <div className="grid grid-cols-[40px_1fr_45px_40px] items-center border-b border-[#F1F5F9] px-2 py-3">

                                <p className="text-[10px] font-medium text-[#64748B]">
                                    02
                                </p>

                                <div className="flex items-center gap-2">
                                    <div className="flex h-5 w-4 items-center justify-center rounded border border-[#F59E0B] bg-[#FFF4E5]">
                                        <div className="h-2 w-3 rounded-sm border border-[#F59E0B] bg-white" />
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-medium text-[#334155]">
                                            Single Sleeper
                                        </p>

                                        <p className="text-[10px]  text-[#94A3B8]">
                                            Berth row
                                        </p>
                                    </div>
                                </div>

                                <p className="text-[14px] text-[#334155]">
                                    1
                                </p>

                                <div className="flex items-center gap-1">
                                    <button className="text-[#0E7A88] hover:text-[#075E67]">
                                        <Pencil size={14} />
                                    </button>

                                    <button className="text-[#F87171] hover:text-red-600">
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* right panel - live preview */}
                <div className="p-4 col-span-5">

                    {/* preview header */}
                    <div className="flex items-center justify-between">

                        <div>
                            <div className="flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />

                                <p className="text-[8px] font-semibold uppercase text-[#15966A]">
                                    Live preview
                                </p>
                            </div>

                            <p className="mt-1 text-xs font-semibold text-[#1E293B]">
                                Lower Deck Floor Plan
                            </p>

                            <p className="mt-1 text-[8px] text-[#94A3B8]">
                                Select any row or component to edit it.
                            </p>
                        </div>

                        {/* zoom controls */}
                        <div className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] px-2 py-1">
                            <button className="text-[#64748B] hover:text-[#0E7A88]">
                                <Minus size={10} />
                            </button>

                            <span className="text-[8px] text-[#334155]">
                                100%
                            </span>

                            <button className="text-[#64748B] hover:text-[#0E7A88]">
                                <Plus size={10} />
                            </button>
                        </div>

                    </div>


                    {/* bus floor plan */}
                    <div className="relative mt-4 min-h-[420px] rounded-xl border border-[#E2E8F0] bg-white p-4">

                        {/* lower deck badge */}
                        <div className="absolute left-4 top-6 rounded-md border border-dashed border-[#7DD3FC] bg-[#F0F9FF] px-2 py-1.5">
                            <p className="text-[10px]  font-medium text-[#0369A1]">
                                LOWER DECK
                            </p>
                        </div>

                        {/* driver position */}
                        <div className="absolute right-8 top-5 flex flex-col items-center gap-1">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#94A3B8] bg-white">
                                <CircleDot size={13} className="text-[#64748B]" />
                            </div>

                            <p className="text-[6px] uppercase text-[#64748B]">
                                Driver
                            </p>
                        </div>


                        {/* divider */}
                        <div className="absolute left-4 right-4 top-[68px] border-t border-[#F1F5F9]" />


                        {/* seats layout */}
                        <div className="mt-16 flex justify-between  gap-5">

                            {/* left side - single sleeper rows */}
                            <div className="flex flex-col gap-2 pl-6">

                                {/* sleeper 1 */}
                                <div className="flex h-[64px] w-[40px] items-center justify-center rounded-md border border-[#D8E1EC] bg-[#FBFDFF]">
                                    <div className="relative flex h-full w-full items-center justify-center">
                                        <div className="absolute left-1 right-1 top-1 h-1.5 rounded-sm border border-[#D8E1EC] bg-white" />
                                        <span className="mt-3 text-[10px]  font-medium text-[#334155]">02</span>
                                    </div>
                                </div>

                                {/* sleeper 2 */}
                                <div className="flex h-[64px] w-[40px] items-center justify-center rounded-md border border-[#D8E1EC] bg-[#FBFDFF]">
                                    <div className="relative flex h-full w-full items-center justify-center">
                                        <div className="absolute left-1 right-1 top-1 h-1.5 rounded-sm border border-[#D8E1EC] bg-white" />
                                        <span className="mt-3 text-[10px]  font-medium text-[#334155]">02</span>
                                    </div>
                                </div>

                                {/* sleeper 3 */}
                                <div className="flex h-[64px] w-[40px] items-center justify-center rounded-md border border-[#D8E1EC] bg-[#FBFDFF]">
                                    <div className="relative flex h-full w-full items-center justify-center">
                                        <div className="absolute left-1 right-1 top-1 h-1.5 rounded-sm border border-[#D8E1EC] bg-white" />
                                        <span className="mt-3 text-[10px]  font-medium text-[#334155]">02</span>
                                    </div>
                                </div>

                                {/* sleeper 4 */}
                                <div className="flex h-[64px] w-[40px] items-center justify-center rounded-md border border-[#D8E1EC] bg-[#FBFDFF]">
                                    <div className="relative flex h-full w-full items-center justify-center">
                                        <div className="absolute left-1 right-1 top-1 h-1.5 rounded-sm border border-[#D8E1EC] bg-white" />
                                        <span className="mt-3 text-[10px]  font-medium text-[#334155]">02</span>
                                    </div>
                                </div>

                                {/* sleeper 5 */}
                                <div className="flex h-[64px] w-[40px] items-center justify-center rounded-md border border-[#D8E1EC] bg-[#FBFDFF]">
                                    <div className="relative flex h-full w-full items-center justify-center">
                                        <div className="absolute left-1 right-1 top-1 h-1.5 rounded-sm border border-[#D8E1EC] bg-white" />
                                        <span className="mt-3 text-[10px]  font-medium text-[#334155]">02</span>
                                    </div>
                                </div>

                                {/* sleeper 6 */}
                                <div className="flex h-[64px] w-[40px] items-center justify-center rounded-md border border-[#D8E1EC] bg-[#FBFDFF]">
                                    <div className="relative flex h-full w-full items-center justify-center">
                                        <div className="absolute left-1 right-1 top-1 h-1.5 rounded-sm border border-[#D8E1EC] bg-white" />
                                        <span className="mt-3 text-[10px]  font-medium text-[#334155]">02</span>
                                    </div>
                                </div>

                            </div>


                            {/* right side - paired seats */}
                            <div className="flex flex-col  gap-2">

                                {/* row 1 */}
                                <div className="flex gap-1">
                                    <div className="flex h-[45px] w-[40px] flex-col items-center justify-center rounded-md border border-[#D8E1EC] bg-[#FBFDFF]">
                                        <div className="mb-1 h-1.5 w-4 rounded-sm border border-[#D8E1EC] bg-white" />
                                        <span className="text-[10px]  font-medium text-[#334155]">02</span>
                                    </div>

                                    <div className="flex h-[45px] w-[40px] flex-col items-center justify-center rounded-md border border-[#D8E1EC] bg-[#FBFDFF]">
                                        <div className="mb-1 h-1.5 w-4 rounded-sm border border-[#D8E1EC] bg-white" />
                                        <span className="text-[10px]  font-medium text-[#334155]">02</span>
                                    </div>
                                </div>

                                {/* row 2 */}
                                <div className="flex gap-1">
                                    <div className="flex h-[45px] w-[40px] flex-col items-center justify-center rounded-md border border-[#D8E1EC] bg-[#FBFDFF]">
                                        <div className="mb-1 h-1.5 w-4 rounded-sm border border-[#D8E1EC] bg-white" />
                                        <span className="text-[10px]  font-medium text-[#334155]">02</span>
                                    </div>

                                    <div className="flex h-[45px] w-[40px] flex-col items-center justify-center rounded-md border border-[#D8E1EC] bg-[#FBFDFF]">
                                        <div className="mb-1 h-1.5 w-4 rounded-sm border border-[#D8E1EC] bg-white" />
                                        <span className="text-[10px]  font-medium text-[#334155]">02</span>
                                    </div>
                                </div>

                                {/* row 3 */}
                                <div className="flex gap-1">
                                    <div className="flex h-[45px] w-[40px] flex-col items-center justify-center rounded-md border border-[#D8E1EC] bg-[#FBFDFF]">
                                        <div className="mb-1 h-1.5 w-4 rounded-sm border border-[#D8E1EC] bg-white" />
                                        <span className="text-[10px]  font-medium text-[#334155]">02</span>
                                    </div>

                                    <div className="flex h-[45px] w-[40px] flex-col items-center justify-center rounded-md border border-[#D8E1EC] bg-[#FBFDFF]">
                                        <div className="mb-1 h-1.5 w-4 rounded-sm border border-[#D8E1EC] bg-white" />
                                        <span className="text-[10px]  font-medium text-[#334155]">02</span>
                                    </div>
                                </div>

                                {/* row 4 */}
                                <div className="flex gap-1">
                                    <div className="flex h-[45px] w-[40px] flex-col items-center justify-center rounded-md border border-[#D8E1EC] bg-[#FBFDFF]">
                                        <div className="mb-1 h-1.5 w-4 rounded-sm border border-[#D8E1EC] bg-white" />
                                        <span className="text-[10px]  font-medium text-[#334155]">02</span>
                                    </div>

                                    <div className="flex h-[45px] w-[40px] flex-col items-center justify-center rounded-md border border-[#D8E1EC] bg-[#FBFDFF]">
                                        <div className="mb-1 h-1.5 w-4 rounded-sm border border-[#D8E1EC] bg-white" />
                                        <span className="text-[10px]  font-medium text-[#334155]">02</span>
                                    </div>
                                </div>

                                {/* row 5 */}
                                <div className="flex gap-1">
                                    <div className="flex h-[45px] w-[40px] flex-col items-center justify-center rounded-md border border-[#D8E1EC] bg-[#FBFDFF]">
                                        <div className="mb-1 h-1.5 w-4 rounded-sm border border-[#D8E1EC] bg-white" />
                                        <span className="text-[10px]  font-medium text-[#334155]">02</span>
                                    </div>

                                    <div className="flex h-[45px] w-[40px] flex-col items-center justify-center rounded-md border border-[#D8E1EC] bg-[#FBFDFF]">
                                        <div className="mb-1 h-1.5 w-4 rounded-sm border border-[#D8E1EC] bg-white" />
                                        <span className="text-[10px]  font-medium text-[#334155]">02</span>
                                    </div>
                                </div>

                                {/* row 6 */}
                                <div className="flex gap-1">
                                    <div className="flex h-[45px] w-[40px] flex-col items-center justify-center rounded-md border border-[#D8E1EC] bg-[#FBFDFF]">
                                        <div className="mb-1 h-1.5 w-4 rounded-sm border border-[#D8E1EC] bg-white" />
                                        <span className="text-[10px]  font-medium text-[#334155]">02</span>
                                    </div>

                                    <div className="flex h-[45px] w-[40px] flex-col items-center justify-center rounded-md border border-[#D8E1EC] bg-[#FBFDFF]">
                                        <div className="mb-1 h-1.5 w-4 rounded-sm border border-[#D8E1EC] bg-white" />
                                        <span className="text-[10px]  font-medium text-[#334155]">02</span>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default SeatLayoutStep
