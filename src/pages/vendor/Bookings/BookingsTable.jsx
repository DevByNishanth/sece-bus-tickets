import { useMemo, useState } from "react"
import { Download, Eye, Filter, Search } from "lucide-react"

const statusStyles = {
    Scheduled: "bg-[#E8F8F2] text-[#07805E]",
    "In Progress": "bg-[#EEF3FF] text-[#315FC4]",
    Draft: "bg-[#F1F5F9] text-[#64748B]",
    Rejected: "bg-[#FFF0F0] text-[#D83A47]",
    Pending: "bg-[#FFF7E8] text-[#B7791F]",
}

const BookingsTable = ({ bookings, query, onQueryChange }) => {
    const [statusFilter, setStatusFilter] = useState("All statuses")
    const [currentPage, setCurrentPage] = useState(1)
    const rowsPerPage = 5

    const filteredBookings = useMemo(() => {
        const searchValue = query.trim().toLowerCase()

        return bookings.filter((booking) => {
            const matchesSearch = !searchValue ||
                `${booking.pnr} ${booking.passenger} ${booking.route} ${booking.tripId}`
                    .toLowerCase()
                    .includes(searchValue)
            const matchesStatus = statusFilter === "All statuses" || booking.status === statusFilter
            return matchesSearch && matchesStatus
        })
    }, [bookings, query, statusFilter])

    const pageCount = Math.max(1, Math.ceil(filteredBookings.length / rowsPerPage))
    const pageBookings = filteredBookings.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    const firstRow = filteredBookings.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1
    const lastRow = Math.min(currentPage * rowsPerPage, filteredBookings.length)

    const downloadCsv = () => {
        const headings = ["Trip ID", "PNR", "Passenger", "Route", "Travel date", "Seat / berth", "Status"]
        const rows = filteredBookings.map((booking) => [
            booking.tripId, booking.pnr, booking.passenger, booking.route,
            booking.travelDate, booking.seatBerth, booking.status,
        ])
        const csv = [headings, ...rows]
            .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
            .join("\n")
        const file = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const downloadUrl = URL.createObjectURL(file)
        const link = document.createElement("a")
        link.href = downloadUrl
        link.download = "bookings.csv"
        link.click()
        URL.revokeObjectURL(downloadUrl)
    }

    return (
        <section className="mt-4 overflow-hidden rounded-xl border border-[#E5EBEF] bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div>
                    <h2 className="text-sm font-semibold text-[#172B35]">Trip Details</h2>
                    <p className="mt-0.5 text-[10px] text-[#647985]">
                        Live passenger ticket reservations &amp; payment receipts across all routes
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <label className="flex h-8 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5">
                        <Search size={13} className="text-[#81919A]" />
                        <span className="sr-only">Search PNR or passenger</span>
                        <input
                            value={query}
                            onChange={(event) => { onQueryChange(event.target.value); setCurrentPage(1) }}
                            placeholder="Search PNR, passenger..."
                            className="w-36 bg-transparent text-[10px] outline-none placeholder:text-[#94A3B8]"
                        />
                    </label>

                    <label className="flex h-8 items-center gap-1.5 rounded-lg border border-[#E2E8F0] px-2 text-[10px] text-[#334155]">
                        <Filter size={12} />
                        <span className="sr-only">Filter by status</span>
                        <select
                            value={statusFilter}
                            onChange={(event) => { setStatusFilter(event.target.value); setCurrentPage(1) }}
                            className="bg-transparent outline-none"
                        >
                            <option>All statuses</option>
                            {Object.keys(statusStyles).map((status) => <option key={status}>{status}</option>)}
                        </select>
                    </label>

                    <button
                        type="button"
                        onClick={downloadCsv}
                        className="flex h-8 items-center gap-1.5 rounded-lg bg-[#087F78] px-2.5 text-[10px] font-medium text-white hover:bg-[#066B65]"
                    >
                        <Download size={12} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto px-3">
                <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
                    <thead>
                        <tr className="bg-[#F3F7F9] text-[9px] uppercase tracking-wide text-[#60727C]">
                            {["PNR / Ticket", "Passenger", "Route", "Travel date", "Seat / berth", "Status", "Actions"].map((heading) => (
                                <th key={heading} className="px-3 py-2.5 font-medium first:rounded-l-lg last:rounded-r-lg">{heading}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pageBookings.map((booking) => (
                            <tr key={booking.pnr} className="border-b text-[10px] text-[#334155] last:[&>td]:border-b-0">
                                <td className="border-b border-[#EDF1F4] px-3 py-3 font-semibold text-[#087F78]">{booking.tripId}</td>
                                <td className="border-b border-[#EDF1F4] px-3 py-3">
                                    <p className="font-medium text-[#263746]">{booking.passenger}</p>
                                    <p className="mt-0.5 text-[9px] text-[#8797A0]">{booking.pnr}</p>
                                </td>
                                <td className="border-b border-[#EDF1F4] px-3 py-3">
                                    <p className="font-medium">{booking.route}</p>
                                    <p className="mt-0.5 text-[9px] text-[#8797A0]">{booking.bus}</p>
                                </td>
                                <td className="border-b border-[#EDF1F4] px-3 py-3 whitespace-nowrap">
                                    <p>{booking.travelDate}</p>
                                    <p className="mt-0.5 text-[9px] text-[#8797A0]">{booking.time}</p>
                                </td>
                                <td className="border-b border-[#EDF1F4] px-3 py-3 font-medium">{booking.seatBerth}</td>
                                <td className="border-b border-[#EDF1F4] px-3 py-3">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-medium ${statusStyles[booking.status] || statusStyles.Draft}`}>
                                        <span className="size-1 rounded-full bg-current" />{booking.status}
                                    </span>
                                </td>
                                <td className="border-b border-[#EDF1F4] px-3 py-3">
                                    <button type="button" aria-label={`View booking ${booking.pnr}`} className="flex size-7 items-center justify-center rounded-full bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]">
                                        <Eye size={13} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {pageBookings.length === 0 && (
                            <tr><td colSpan="7" className="px-3 py-10 text-center text-xs text-[#64748B]">No bookings match your search.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[10px] text-[#71808A]">
                <p>Showing {firstRow}–{lastRow} of {filteredBookings.length} bookings</p>
                <div className="flex items-center gap-1">
                    <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)} className="rounded-md border border-[#E2E8F0] px-2 py-1 disabled:opacity-40">Previous</button>
                    <span className="rounded-md bg-[#087F78] px-2.5 py-1 font-medium text-white">{currentPage}</span>
                    <span className="px-1">of {pageCount}</span>
                    <button type="button" disabled={currentPage === pageCount} onClick={() => setCurrentPage((page) => page + 1)} className="rounded-md border border-[#E2E8F0] px-2 py-1 disabled:opacity-40">Next</button>
                </div>
            </div>
        </section>
    )
}

export default BookingsTable
