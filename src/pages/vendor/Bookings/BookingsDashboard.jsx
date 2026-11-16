import { useMemo, useState } from "react"
import { Calendar1, Clock, IndianRupeeIcon, LayoutGrid, MapPin, Search } from "lucide-react"
import VendorNavbar from "../VendorNavbar"
import BookingsTable from "./BookingsTable"

// This sample data is shared by the card and table layouts.
const bookings = [
  { tripId: "TRP-24103", pnr: "#BG240891", passenger: "Pravin Kumar", initials: "PK", route: "Bangalore → Coorg", bus: "Vande Barath Super Fast Exp", distance: "350 km", travelDate: "12 Feb 2026", time: "22:00 – 05:45 +1", seatBerth: "36 / 36", fare: "290", status: "Scheduled" },
  { tripId: "TRP-24103", pnr: "#BG240892", passenger: "Meena Raj", initials: "MR", route: "Bangalore → Coorg", bus: "Vande Barath Super Fast Exp", distance: "350 km", travelDate: "12 Feb 2026", time: "22:00 – 05:45 +1", seatBerth: "35 / 36", fare: "290", status: "In Progress" },
  { tripId: "TRP-24103", pnr: "#BG240893", passenger: "Arun Kumar", initials: "AK", route: "Bangalore → Coorg", bus: "Vande Barath Super Fast Exp", distance: "350 km", travelDate: "12 Feb 2026", time: "22:00 – 05:45 +1", seatBerth: "34 / 36", fare: "290", status: "Draft" },
  { tripId: "TRP-24103", pnr: "#BG240894", passenger: "Kavya S", initials: "KS", route: "Bangalore → Coorg", bus: "Vande Barath Super Fast Exp", distance: "350 km", travelDate: "12 Feb 2026", time: "22:00 – 05:45 +1", seatBerth: "33 / 36", fare: "290", status: "Rejected" },
  { tripId: "TRP-24103", pnr: "#BG240895", passenger: "Suresh Babu", initials: "SB", route: "Bangalore → Coorg", bus: "Vande Barath Super Fast Exp", distance: "350 km", travelDate: "12 Feb 2026", time: "22:00 – 05:45 +1", seatBerth: "32 / 36", fare: "290", status: "Pending" },
]

const statusStyles = {
  Scheduled: "bg-[#E8F8F2] text-[#07805E]",
  "In Progress": "bg-[#EEF3FF] text-[#315FC4]",
  Draft: "bg-[#F1F5F9] text-[#64748B]",
  Rejected: "bg-[#FFF0F0] text-[#D83A47]",
  Pending: "bg-[#FFF7E8] text-[#B7791F]",
}

const BookingsDashboard = () => {
  const [query, setQuery] = useState("")
  const [isGridView, setIsGridView] = useState(true)

  const filteredBookings = useMemo(() => {
    const searchValue = query.trim().toLowerCase()
    if (!searchValue) return bookings

    return bookings.filter((booking) =>
      `${booking.passenger} ${booking.pnr} ${booking.route}`.toLowerCase().includes(searchValue)
    )
  }, [query])

  return (
    <main className="min-h-screen bg-[#F7F9FA] py-3">
      <VendorNavbar />
      <section className="mx-auto mt-3 w-[94%]">
        <header>
          <h1 className="text-xl font-medium">Bookings</h1>
          <p className="mt-1 text-sm text-[#627B77]">Review and manage passenger bookings.</p>
        </header>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          {isGridView ? (
            <label className="relative w-full max-w-md">
              <span className="sr-only">Search by passenger name, PNR, or route</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by passenger name or route..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
          ) : <div />}

          <div className="flex items-center gap-2">
            <LayoutGrid className="size-5 text-gray-500" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-700">Grid View</span>
            <button
              type="button"
              role="switch"
              aria-label="Toggle grid view"
              aria-checked={isGridView}
              onClick={() => setIsGridView((previousView) => !previousView)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${isGridView ? "bg-[#087f95]" : "bg-gray-300"}`}
            >
              <span className={`inline-block size-5 transform rounded-full bg-white shadow transition-transform duration-200 ${isGridView ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>

        {isGridView ? (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredBookings.map((booking) => (
              <article key={booking.pnr} className="relative rounded-lg border border-[#DBEBEE] bg-white p-3">
                <div className="absolute right-3 top-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] ${statusStyles[booking.status]}`}>
                    <span className="size-1 rounded-full bg-current" />{booking.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 pr-20">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-r from-[#087f95] to-[#025a69] text-sm font-semibold text-white">
                    {booking.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{booking.passenger}</p>
                    <p className="text-xs text-gray-500">PNR: {booking.pnr}</p>
                  </div>
                </div>

                <div className="mt-3 rounded-md border border-gray-100 bg-gray-50 p-2">
                  <div className="flex items-center justify-between gap-2 text-[11px] text-gray-600">
                    <span>{booking.bus}</span><span>· {booking.distance}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
                    <span>Origin</span><span>Destination</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-gray-800">
                    <span className="flex items-center gap-1"><MapPin size={11} />{booking.route.split(" → ")[0]}</span>
                    <span className="h-px flex-1 bg-gray-300" />
                    <span className="flex items-center gap-1"><MapPin size={11} />{booking.route.split(" → ")[1]}</span>
                  </div>
                </div>

                <div className="mt-3 flex justify-between px-1 text-xs">
                  <div>
                    <span className="flex items-center gap-1 text-gray-600"><Calendar1 size={12} />{booking.travelDate}</span>
                    <span className="mt-1 flex items-center gap-1 text-gray-600"><Clock size={12} />{booking.time}</span>
                  </div>
                  <span className="flex items-center gap-1 -mt-5 font-semibold text-[14px] text-teal-900"><IndianRupeeIcon size={13} />{booking.fare}</span>
                </div>
              </article>
            ))}
            {filteredBookings.length === 0 && <p className="col-span-full rounded-lg bg-white p-8 text-center text-sm text-gray-500">No bookings match your search.</p>}
          </div>
        ) : (
          <BookingsTable bookings={bookings} query={query} onQueryChange={setQuery} />
        )}
      </section>
    </main>
  )
}

export default BookingsDashboard
