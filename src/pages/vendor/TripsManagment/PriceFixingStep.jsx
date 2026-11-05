import { useState } from "react"
import { IndianRupee, CircleDot, X, Check, RotateCcw, Layers } from "lucide-react"


// ─────────────────────────────────────────────────────────────────────────────
// DATA HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// builds the initial seat list for a deck
// every seat starts with an empty price so the vendor fills it in
const generateSeats = (deck) => {
    const list = []

    if (deck === "lower") {
        // left column – sleeper seats (tall, 1 per row, 6 rows)
        for (let row = 1; row <= 6; row++) {
            list.push({
                id: `lower-sleeper-${row}`,
                label: String(row).padStart(2, "0"),
                row,
                type: "sleeper",
                side: "left",
                price: "",
            })
        }

        // right columns – seater seats (2 per row, 6 rows)
        for (let row = 1; row <= 6; row++) {
            list.push({
                id: `lower-seater-${row}-a`,
                label: String(row).padStart(2, "0"),
                row,
                type: "seater",
                side: "right",
                price: "",
            })
            list.push({
                id: `lower-seater-${row}-b`,
                label: String(row).padStart(2, "0"),
                row,
                type: "seater",
                side: "right",
                price: "",
            })
        }
    } else {
        // upper deck – all sleepers, 2 columns × 6 rows
        for (let row = 1; row <= 6; row++) {
            list.push({
                id: `upper-left-${row}`,
                label: String(row).padStart(2, "0"),
                row,
                type: "sleeper",
                side: "left",
                price: "",
            })
            list.push({
                id: `upper-right-${row}`,
                label: String(row).padStart(2, "0"),
                row,
                type: "sleeper",
                side: "right",
                price: "",
            })
        }
    }

    return list
}


// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const PriceFixingStep = () => {

    // ── deck tab ──────────────────────────────────────────────────────────────

    const [activeDeck, setActiveDeck] = useState("lower")

    // ── seat data (kept separately per deck so switching tabs doesn't lose prices) ──

    const [lowerSeats, setLowerSeats] = useState(() => generateSeats("lower"))
    const [upperSeats, setUpperSeats] = useState(() => generateSeats("upper"))

    // ── pricing mode ─────────────────────────────────────────────────────────
    // "idle"   → default row-price view
    // "single" → one seat selected for individual pricing
    // "bulk"   → multi-seat selection for one shared price

    const [mode, setMode] = useState("idle")

    // ── single-seat mode state ────────────────────────────────────────────────

    const [selectedSeatId, setSelectedSeatId] = useState(null)
    const [singleTempPrice, setSingleTempPrice] = useState("")

    // ── bulk mode state ───────────────────────────────────────────────────────

    const [bulkSelectedIds, setBulkSelectedIds] = useState([])
    const [bulkTempPrice, setBulkTempPrice] = useState("")


    // ─────────────────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    // shorthand: active deck's seat array and its setter
    const seats = activeDeck === "lower" ? lowerSeats : upperSeats
    const setSeats = activeDeck === "lower" ? setLowerSeats : setUpperSeats

    // unique sorted row numbers for a seat type
    const getRows = (type) =>
        [...new Set(seats.filter(s => s.type === type).map(s => s.row))].sort((a, b) => a - b)

    // the price shown in the row input
    // → if all seats in the row share the same price, show it; otherwise show ""
    const getRowPrice = (row, type) => {
        const rowSeats = seats.filter(s => s.row === row && s.type === type)
        const uniquePrices = [...new Set(rowSeats.map(s => s.price))]
        return uniquePrices.length === 1 ? uniquePrices[0] : ""
    }

    // when the user types in a row-price input, update EVERY seat in that row
    const handleRowPriceChange = (row, type, value) => {
        setSeats(prev =>
            prev.map(s =>
                s.row === row && s.type === type ? { ...s, price: value } : s
            )
        )
    }

    // a seat is "custom" when its price differs from at least one row-mate
    // → we show an orange dot on these seats so the vendor can spot overrides
    const isSeatCustom = (seat) => {
        if (!seat.price) return false
        const rowMates = seats.filter(
            s => s.row === seat.row && s.type === seat.type && s.id !== seat.id
        )
        return rowMates.some(s => s.price !== seat.price)
    }

    // switch decks and reset all interaction state
    const switchDeck = (deck) => {
        setActiveDeck(deck)
        setMode("idle")
        setSelectedSeatId(null)
        setSingleTempPrice("")
        setBulkSelectedIds([])
        setBulkTempPrice("")
    }


    // ─────────────────────────────────────────────────────────────────────────
    // SINGLE-SEAT MODE HANDLERS
    // ─────────────────────────────────────────────────────────────────────────

    const handleSeatClick = (seat) => {
        if (mode === "bulk") {
            // in bulk mode: toggle this seat in/out of the selection
            setBulkSelectedIds(prev =>
                prev.includes(seat.id)
                    ? prev.filter(id => id !== seat.id)
                    : [...prev, seat.id]
            )
        } else {
            // idle or single mode: select this seat for individual pricing
            setMode("single")
            setSelectedSeatId(seat.id)
            setSingleTempPrice(seat.price)
        }
    }

    // save the typed price to this one seat only
    const applySinglePrice = () => {
        setSeats(prev =>
            prev.map(s =>
                s.id === selectedSeatId ? { ...s, price: singleTempPrice } : s
            )
        )
        setMode("idle")
        setSelectedSeatId(null)
        setSingleTempPrice("")
    }

    // remove any custom override and bring this seat back to its row-mates' price
    const resetSeatToRowPrice = () => {
        const seat = seats.find(s => s.id === selectedSeatId)
        if (!seat) return

        // use the first row-mate's price as the row default
        const rowMate = seats.find(
            s => s.row === seat.row && s.type === seat.type && s.id !== seat.id
        )
        const rowDefault = rowMate ? rowMate.price : ""

        setSeats(prev =>
            prev.map(s =>
                s.id === selectedSeatId ? { ...s, price: rowDefault } : s
            )
        )
        setMode("idle")
        setSelectedSeatId(null)
        setSingleTempPrice("")
    }

    // close single mode without saving
    const cancelSingleMode = () => {
        setMode("idle")
        setSelectedSeatId(null)
        setSingleTempPrice("")
    }


    // ─────────────────────────────────────────────────────────────────────────
    // BULK MODE HANDLERS
    // ─────────────────────────────────────────────────────────────────────────

    const enterBulkMode = () => {
        setMode("bulk")
        setBulkSelectedIds([])
        setBulkTempPrice("")
        setSelectedSeatId(null)
    }

    // apply the bulk price to all currently selected seats
    const applyBulkPrice = () => {
        if (!bulkTempPrice || bulkSelectedIds.length === 0) return
        setSeats(prev =>
            prev.map(s =>
                bulkSelectedIds.includes(s.id) ? { ...s, price: bulkTempPrice } : s
            )
        )
        setMode("idle")
        setBulkSelectedIds([])
        setBulkTempPrice("")
    }

    const cancelBulkMode = () => {
        setMode("idle")
        setBulkSelectedIds([])
        setBulkTempPrice("")
    }


    // ─────────────────────────────────────────────────────────────────────────
    // SEAT VISUAL HELPER
    // ─────────────────────────────────────────────────────────────────────────

    // returns the right border + bg classes for a seat based on its current state
    const getSeatStyle = (seat, extraClasses = "") => {
        const isSelected = selectedSeatId === seat.id
        const isBulkSelected = bulkSelectedIds.includes(seat.id)

        let colorClasses =
            "border-[#D8E1EC] bg-[#FBFDFF] hover:border-[#0E7A88] hover:bg-[#F0F9FA]"

        if (isSelected) {
            colorClasses = "border-[#0E7A88] bg-[#E5F5F5]"
        } else if (isBulkSelected) {
            colorClasses = "border-[#93C5FD] bg-[#EFF6FF]"
        }

        return `cursor-pointer transition-colors rounded-md border ${colorClasses} ${extraClasses}`
    }


    // ─────────────────────────────────────────────────────────────────────────
    // FLOOR PLAN DATA SLICES
    // ─────────────────────────────────────────────────────────────────────────

    // lower deck: sleepers on the left, seaters in row-pairs on the right
    const leftSleepers = seats.filter(s => s.type === "sleeper" && s.side === "left")
    const seaterRows = getRows("seater").map(row =>
        seats.filter(s => s.type === "seater" && s.row === row)
    )

    // upper deck: two columns of sleepers
    const upperLeftCol = seats.filter(s => s.side === "left")
    const upperRightCol = seats.filter(s => s.side === "right")

    // the seat object currently selected (for single mode panel)
    const selectedSeat = seats.find(s => s.id === selectedSeatId)


    // ─────────────────────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="mt-5 overflow-hidden rounded-xl border border-[#E8EDF1] bg-white">

            {/* ── page header ── */}
            <div className="flex items-center justify-between bg-[#F8FAFC] px-4 py-3">
                <div className="flex items-center gap-3">

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#D8EFF0] bg-[#F0F9FA]">
                        <IndianRupee size={15} className="text-[#0E7A88]" />
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-[#1E293B]">
                            Configure trip pricing
                        </p>
                        <p className="mt-0.5 text-[10px] text-[#64748B]">
                            Apply an operator fare plan and set trip-specific prices.
                        </p>
                    </div>

                </div>
            </div>


            {/* ── two-panel layout ── */}
            <div className="grid grid-cols-12">


                {/* ══════════════════════════════════════════════════════════════
                    LEFT PANEL — interactive bus floor plan
                ══════════════════════════════════════════════════════════════ */}
                <div className="col-span-7 border-r border-[#F1F5F9] p-3">

                    {/* deck tabs */}
                    <div className="flex gap-3 rounded-lg bg-[#F1F5F9] p-3">
                        <button
                            onClick={() => switchDeck("lower")}
                            className={`flex-1 rounded-md py-2 text-[12px] font-medium transition-colors
                                ${activeDeck === "lower"
                                    ? "bg-white text-[#0E7A88] shadow-sm"
                                    : "text-[#64748B] hover:bg-white"}`}
                        >
                            Lower Deck
                        </button>

                        <button
                            onClick={() => switchDeck("upper")}
                            className={`flex-1 rounded-md py-2 text-[12px] font-medium transition-colors
                                ${activeDeck === "upper"
                                    ? "bg-white text-[#0E7A88] shadow-sm"
                                    : "text-[#64748B] hover:bg-white"}`}
                        >
                            Upper Deck
                        </button>
                    </div>


                    {/* floor plan title + hint */}
                    <div className="mt-3">
                        <p className="text-xs font-semibold text-[#1E293B]">
                            {activeDeck === "lower" ? "Lower" : "Upper"} Deck Floor Plan
                        </p>
                        <p className="mt-0.5 text-[8px] text-[#94A3B8]">
                            {mode === "bulk"
                                ? "Bulk mode — click seats to select them."
                                : "Click any seat to override its price individually."}
                        </p>
                    </div>


                    {/* bulk mode banner (only visible in bulk mode) */}
                    {mode === "bulk" && (
                        <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#93C5FD] bg-[#EFF6FF] px-3 py-2">
                            <Layers size={12} className="text-[#3B82F6]" />
                            <p className="text-[10px] font-medium text-[#3B82F6]">
                                Bulk select mode active — click seats to add them to the selection
                            </p>
                        </div>
                    )}


                    {/* floor plan box */}
                    <div className="relative mt-3 min-h-[420px] rounded-xl border border-[#E2E8F0] bg-white p-4">

                        {/* deck label badge */}
                        <div className="absolute left-4 top-6 rounded-md border border-dashed border-[#7DD3FC] bg-[#F0F9FF] px-2 py-1.5">
                            <p className="text-[10px] font-medium text-[#0369A1]">
                                {activeDeck === "lower" ? "LOWER" : "UPPER"} DECK
                            </p>
                        </div>

                        {/* driver icon */}
                        <div className="absolute right-8 top-5 flex flex-col items-center gap-1">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#94A3B8] bg-white">
                                <CircleDot size={13} className="text-[#64748B]" />
                            </div>
                            <p className="text-[6px] uppercase text-[#64748B]">Driver</p>
                        </div>

                        {/* horizontal divider under the header area */}
                        <div className="absolute left-4 right-4 top-[68px] border-t border-[#F1F5F9]" />


                        {/* ── LOWER DECK LAYOUT ── */}
                        {activeDeck === "lower" && (
                            <div className="mt-16 flex justify-between gap-5">

                                {/* left column – sleeper seats (tall) */}
                                <div className="flex flex-col gap-2 pl-6">
                                    {leftSleepers.map(seat => (
                                        <div
                                            key={seat.id}
                                            onClick={() => handleSeatClick(seat)}
                                            className={getSeatStyle(seat, "relative flex h-[64px] w-[40px] flex-col items-center justify-center")}
                                        >
                                            {/* pillow graphic */}
                                            <div className="absolute left-1 right-1 top-1 h-1.5 rounded-sm border border-[#D8E1EC] bg-white" />

                                            <span className="mt-3 text-[10px] font-medium text-[#334155]">
                                                {seat.label}
                                            </span>

                                            {/* show price on the seat tile once set */}
                                            {seat.price && (
                                                <p className="text-[7px] text-[#94A3B8]">₹{seat.price}</p>
                                            )}

                                            {/* orange dot = this seat has a custom (overridden) price */}
                                            {isSeatCustom(seat) && (
                                                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* right columns – seater pairs per row */}
                                <div className="flex flex-col gap-2">
                                    {seaterRows.map((rowSeats, idx) => (
                                        <div key={idx} className="flex gap-1">
                                            {rowSeats.map(seat => (
                                                <div
                                                    key={seat.id}
                                                    onClick={() => handleSeatClick(seat)}
                                                    className={getSeatStyle(seat, "relative flex h-[45px] w-[40px] flex-col items-center justify-center")}
                                                >
                                                    {/* headrest graphic */}
                                                    <div className="mb-1 h-1.5 w-4 rounded-sm border border-[#D8E1EC] bg-white" />

                                                    <span className="text-[10px] font-medium text-[#334155]">
                                                        {seat.label}
                                                    </span>

                                                    {seat.price && (
                                                        <p className="text-[7px] text-[#94A3B8]">₹{seat.price}</p>
                                                    )}

                                                    {/* custom price indicator */}
                                                    {isSeatCustom(seat) && (
                                                        <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>

                            </div>
                        )}


                        {/* ── UPPER DECK LAYOUT (all sleepers, 2 columns) ── */}
                        {activeDeck === "upper" && (
                            <div className="mt-16 flex justify-center gap-3">

                                {/* left sleeper column */}
                                <div className="flex flex-col gap-2">
                                    {upperLeftCol.map(seat => (
                                        <div
                                            key={seat.id}
                                            onClick={() => handleSeatClick(seat)}
                                            className={getSeatStyle(seat, "relative flex h-[64px] w-[40px] flex-col items-center justify-center")}
                                        >
                                            <div className="absolute left-1 right-1 top-1 h-1.5 rounded-sm border border-[#D8E1EC] bg-white" />
                                            <span className="mt-3 text-[10px] font-medium text-[#334155]">{seat.label}</span>
                                            {seat.price && <p className="text-[7px] text-[#94A3B8]">₹{seat.price}</p>}
                                            {isSeatCustom(seat) && (
                                                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* right sleeper column */}
                                <div className="flex flex-col gap-2">
                                    {upperRightCol.map(seat => (
                                        <div
                                            key={seat.id}
                                            onClick={() => handleSeatClick(seat)}
                                            className={getSeatStyle(seat, "relative flex h-[64px] w-[40px] flex-col items-center justify-center")}
                                        >
                                            <div className="absolute left-1 right-1 top-1 h-1.5 rounded-sm border border-[#D8E1EC] bg-white" />
                                            <span className="mt-3 text-[10px] font-medium text-[#334155]">{seat.label}</span>
                                            {seat.price && <p className="text-[7px] text-[#94A3B8]">₹{seat.price}</p>}
                                            {isSeatCustom(seat) && (
                                                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                            </div>
                        )}

                    </div>


                    {/* colour legend */}
                    <div className="mt-3 flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="h-3 w-3 rounded border border-[#0E7A88] bg-[#E5F5F5]" />
                            <p className="text-[9px] text-[#64748B]">Selected</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="h-3 w-3 rounded border border-[#93C5FD] bg-[#EFF6FF]" />
                            <p className="text-[9px] text-[#64748B]">Bulk selected</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                            <p className="text-[9px] text-[#64748B]">Custom price</p>
                        </div>
                    </div>

                </div>


                {/* ══════════════════════════════════════════════════════════════
                    RIGHT PANEL — pricing controls (switches based on mode)
                ══════════════════════════════════════════════════════════════ */}
                <div className="col-span-5 overflow-y-auto p-4">

                    {/* configure pricing label */}
                    <p className="text-[9px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                        Configure Pricing
                    </p>

                    {/* deck title */}
                    <p className="mt-1 text-sm font-semibold text-[#1E293B]">
                        {activeDeck === "lower" ? "Lower" : "Upper"} Deck
                    </p>


                    {/* info cards – always visible */}
                    <div className="mt-3 grid grid-cols-2 gap-2">

                        <div className="rounded-lg border border-[#F1F5F9] bg-[#F8FAFC] p-2.5">
                            <p className="text-[9px] uppercase text-[#94A3B8]">Layout Type</p>
                            <p className="mt-1 text-[10px] font-semibold text-[#334155]">
                                {activeDeck === "lower" ? "Seats + Sleepers" : "Sleepers"}
                            </p>
                        </div>

                        <div className="rounded-lg border border-[#F1F5F9] bg-[#F8FAFC] p-2.5">
                            <p className="text-[9px] uppercase text-[#94A3B8]">Total Capacity</p>
                            <p className="mt-1 text-[10px] font-semibold text-[#334155]">
                                {activeDeck === "lower" ? "18" : "12"}
                            </p>
                        </div>

                        {/* seater + sleeper breakdown shown only on lower deck */}
                        {activeDeck === "lower" && (
                            <>
                                <div className="rounded-lg border border-[#F1F5F9] bg-[#F8FAFC] p-2.5">
                                    <p className="text-[9px] uppercase text-[#94A3B8]">Seater Capacity</p>
                                    <p className="mt-1 text-[10px] font-semibold text-[#334155]">12</p>
                                </div>
                                <div className="rounded-lg border border-[#F1F5F9] bg-[#F8FAFC] p-2.5">
                                    <p className="text-[9px] uppercase text-[#94A3B8]">Sleeper Capacity</p>
                                    <p className="mt-1 text-[10px] font-semibold text-[#334155]">6</p>
                                </div>
                            </>
                        )}

                    </div>


                    {/* ══════════════════════════════════════════════════════
                        MODE: idle — row-wise pricing (default view)
                    ══════════════════════════════════════════════════════ */}
                    {mode === "idle" && (
                        <div className="mt-4">

                            {/* bulk update button */}
                            <button
                                onClick={enterBulkMode}
                                className="flex items-center gap-1.5 rounded-md border border-[#0E7A88] px-3 py-1.5 text-[10px] font-medium text-[#0E7A88] transition-colors hover:bg-[#F0F9FA]"
                            >
                                <Layers size={11} />
                                Bulk Price Update
                            </button>


                            {/* seater row pricing – lower deck only */}
                            {activeDeck === "lower" && (
                                <div className="mt-5">
                                    <p className="text-xs font-semibold text-[#1E293B]">
                                        Seater Pricing — by Row
                                    </p>
                                    <p className="mt-0.5 text-[10px] text-[#94A3B8]">
                                        Price set here applies to all seats in that row.
                                    </p>

                                    <div className="mt-3 flex flex-col gap-3">
                                        {getRows("seater").map(row => (
                                            <div key={row}>
                                                {/* row label */}
                                                <p className="mb-1 text-[10px] font-medium text-[#334155]">
                                                    Row {row}
                                                    <span className="ml-1 text-[9px] font-normal text-[#94A3B8]">
                                                        · {seats.filter(s => s.row === row && s.type === "seater").length} seats
                                                    </span>
                                                </p>

                                                {/* price input */}
                                                <div className="flex items-center rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 focus-within:border-[#0E7A88]">
                                                    <IndianRupee size={12} className="shrink-0 text-[#64748B]" />
                                                    <input
                                                        type="number"
                                                        value={getRowPrice(row, "seater")}
                                                        onChange={e => handleRowPriceChange(row, "seater", e.target.value)}
                                                        className="ml-1 w-full text-xs text-[#1E293B] outline-none"
                                                        placeholder="Enter price"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}


                            {/* sleeper row pricing */}
                            <div className="mt-5">
                                <p className="text-xs font-semibold text-[#1E293B]">
                                    Sleeper Pricing — by Row
                                </p>
                                <p className="mt-0.5 text-[10px] text-[#94A3B8]">
                                    Price set here applies to all sleepers in that row.
                                </p>

                                <div className="mt-3 flex flex-col gap-3">
                                    {getRows("sleeper").map(row => (
                                        <div key={row}>
                                            {/* row label */}
                                            <p className="mb-1 text-[10px] font-medium text-[#334155]">
                                                Row {row}
                                                <span className="ml-1 text-[9px] font-normal text-[#94A3B8]">
                                                    · {seats.filter(s => s.row === row && s.type === "sleeper").length} sleeper{seats.filter(s => s.row === row && s.type === "sleeper").length > 1 ? "s" : ""}
                                                </span>
                                            </p>

                                            {/* price input */}
                                            <div className="flex items-center rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 focus-within:border-[#0E7A88]">
                                                <IndianRupee size={12} className="shrink-0 text-[#64748B]" />
                                                <input
                                                    type="number"
                                                    value={getRowPrice(row, "sleeper")}
                                                    onChange={e => handleRowPriceChange(row, "sleeper", e.target.value)}
                                                    className="ml-1 w-full text-xs text-[#1E293B] outline-none"
                                                    placeholder="Enter price"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    )}


                    {/* ══════════════════════════════════════════════════════
                        MODE: single — individual seat price override
                    ══════════════════════════════════════════════════════ */}
                    {mode === "single" && selectedSeat && (
                        <div className="mt-4">

                            {/* header */}
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold text-[#1E293B]">
                                    Individual Seat Pricing
                                </p>
                                <button
                                    onClick={cancelSingleMode}
                                    className="text-[#94A3B8] hover:text-[#64748B]"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {/* selected seat info card */}
                            <div className="mt-3 rounded-lg border border-[#E5F5F5] bg-[#F0F9FA] p-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-semibold text-[#1E293B]">
                                            Seat {selectedSeat.label}
                                        </p>
                                        <p className="mt-0.5 text-[9px] capitalize text-[#64748B]">
                                            {selectedSeat.type} · Row {selectedSeat.row}
                                        </p>
                                    </div>

                                    {/* type badge */}
                                    <div className={`rounded-md px-2 py-1 text-[9px] font-medium
                                        ${selectedSeat.type === "seater"
                                            ? "bg-[#E5F5F5] text-[#0E7A88]"
                                            : "bg-[#FFF4E5] text-[#D97706]"}`}
                                    >
                                        {selectedSeat.type}
                                    </div>
                                </div>
                            </div>

                            {/* price input for this seat */}
                            <div className="mt-3">
                                <p className="mb-1.5 text-[10px] font-medium text-[#334155]">
                                    Set Price for this Seat
                                </p>
                                <div className="flex items-center rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 focus-within:border-[#0E7A88]">
                                    <IndianRupee size={12} className="shrink-0 text-[#64748B]" />
                                    <input
                                        type="number"
                                        value={singleTempPrice}
                                        onChange={e => setSingleTempPrice(e.target.value)}
                                        className="ml-1 w-full text-xs text-[#1E293B] outline-none"
                                        placeholder="Enter price for this seat"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* action buttons */}
                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={applySinglePrice}
                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#0E7A88] px-3 py-2 text-[10px] font-medium text-white transition-colors hover:bg-[#0B6672]"
                                >
                                    <Check size={12} />
                                    Apply Price
                                </button>

                                <button
                                    onClick={resetSeatToRowPrice}
                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#E2E8F0] px-3 py-2 text-[10px] font-medium text-[#64748B] transition-colors hover:bg-[#F8FAFC]"
                                >
                                    <RotateCcw size={11} />
                                    Reset to Row
                                </button>
                            </div>

                            <p className="mt-2 text-[9px] text-[#94A3B8]">
                                Tip: Click any other seat on the floor plan to switch to it.
                            </p>

                        </div>
                    )}


                    {/* ══════════════════════════════════════════════════════
                        MODE: bulk — multi-seat selection + shared price
                    ══════════════════════════════════════════════════════ */}
                    {mode === "bulk" && (
                        <div className="mt-4">

                            {/* header */}
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold text-[#1E293B]">
                                    Bulk Price Update
                                </p>
                                <button
                                    onClick={cancelBulkMode}
                                    className="text-[#94A3B8] hover:text-[#64748B]"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {/* instructions banner */}
                            <div className="mt-3 rounded-lg border border-dashed border-[#93C5FD] bg-[#EFF6FF] px-3 py-2.5">
                                <p className="text-[10px] text-[#3B82F6]">
                                    Click seats on the floor plan to add them to your selection, then enter a price below.
                                </p>
                            </div>

                            {/* selection count pill */}
                            <div className="mt-3 flex items-center justify-between rounded-lg border border-[#F1F5F9] bg-[#F8FAFC] px-3 py-2">
                                <p className="text-[10px] text-[#64748B]">Seats selected</p>
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold
                                    ${bulkSelectedIds.length > 0
                                        ? "bg-[#E5F5F5] text-[#0E7A88]"
                                        : "bg-[#F1F5F9] text-[#94A3B8]"}`}
                                >
                                    {bulkSelectedIds.length}
                                </span>
                            </div>

                            {/* shared price input */}
                            <div className="mt-3">
                                <p className="mb-1.5 text-[10px] font-medium text-[#334155]">
                                    Price for selected seats
                                </p>
                                <div className="flex items-center rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 focus-within:border-[#0E7A88]">
                                    <IndianRupee size={12} className="shrink-0 text-[#64748B]" />
                                    <input
                                        type="number"
                                        value={bulkTempPrice}
                                        onChange={e => setBulkTempPrice(e.target.value)}
                                        className="ml-1 w-full text-xs text-[#1E293B] outline-none"
                                        placeholder="Enter price"
                                    />
                                </div>
                            </div>

                            {/* action buttons */}
                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={applyBulkPrice}
                                    disabled={bulkSelectedIds.length === 0 || !bulkTempPrice}
                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#0E7A88] px-3 py-2 text-[10px] font-medium text-white transition-colors hover:bg-[#0B6672] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Check size={12} />
                                    Apply to {bulkSelectedIds.length} seat{bulkSelectedIds.length !== 1 ? "s" : ""}
                                </button>

                                <button
                                    onClick={cancelBulkMode}
                                    className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-[10px] font-medium text-[#64748B] transition-colors hover:bg-[#F8FAFC]"
                                >
                                    Cancel
                                </button>
                            </div>

                        </div>
                    )}

                </div>

            </div>

        </div>
    )
}

export default PriceFixingStep
