
import {
  Search,
  SlidersHorizontal,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function TripDetailsTable() {
  const trips = [
    {
      ticket: "TRP-24103",
      passenger: "Coimbatore → Madurai",
      route: "Highway Express",
      date: "13 Jun 2025",
      time: "22:00 – 05:45 +1",
      seat: "36 / 36",
      status: "Scheduled",
    },
    {
      ticket: "TRP-24108",
      passenger: "Coimbatore → Madurai",
      route: "Highway Express",
      date: "13 Jun 2025",
      time: "22:00 – 05:45 +1",
      seat: "36 / 36",
      status: "In Progress",
    },
    {
      ticket: "TRP-24103",
      passenger: "Coimbatore → Madurai",
      route: "Highway Express",
      date: "13 Jun 2025",
      time: "22:00 – 05:45 +1",
      seat: "36 / 36",
      status: "Draft",
    },
    {
      ticket: "TRP-24103",
      passenger: "Coimbatore → Madurai",
      route: "Highway Express",
      date: "13 Jun 2025",
      time: "22:00 – 05:45 +1",
      seat: "36 / 36",
      status: "Rejected",
    },
  ];

  const statusStyles = {
    Scheduled: "bg-teal-50 text-teal-600",
    "In Progress": "bg-indigo-50 text-indigo-600",
    Draft: "bg-slate-100 text-slate-600",
    Rejected: "bg-red-50 text-red-500",
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            Trip Details
          </h2>
          <p className="text-[10px] text-slate-500 mt-1">
            Live passenger ticket reservations & payment receipts across all routes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 border border-slate-200 rounded-md px-2.5 py-1.5">
            <Search size={12} className="text-slate-400" />
            <input
              placeholder="Search PNR, passenger..."
              className="text-[10px] outline-none w-28"
            />
          </div>

          <button className="flex items-center gap-1 border border-slate-200 rounded-md px-2 py-1.5 text-[10px] text-slate-600">
            <SlidersHorizontal size={12} />
            Filter
          </button>

          <button className="flex items-center gap-1 bg-teal-700 text-white rounded-md px-2.5 py-1.5 text-[10px]">
            <Download size={12} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-100 rounded-lg">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50 text-[9px] uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">PNR / Ticket</th>
              <th className="px-4 py-3 font-medium">Passenger</th>
              <th className="px-4 py-3 font-medium">Route</th>
              <th className="px-4 py-3 font-medium">Travel Date</th>
              <th className="px-4 py-3 font-medium">Seat / Bth</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {trips.map((trip, index) => (
              <tr key={index} className="hover:bg-slate-50/70">
                <td className="px-4 py-4 text-[10px] font-medium text-teal-700">
                  {trip.ticket}
                </td>

                <td className="px-4 py-4">
                  <p className="text-[10px] font-medium text-slate-700">
                    {trip.passenger}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-1">
                    {trip.route}
                  </p>
                </td>

                <td className="px-4 py-4 text-[10px] text-slate-600">
                  {trip.date}
                </td>

                <td className="px-4 py-4 text-[10px] text-slate-600">
                  {trip.time}
                </td>

                <td className="px-4 py-4 text-[10px] font-medium text-slate-700">
                  {trip.seat}
                </td>

                <td className="px-4 py-4">
                  <span className={`rounded-full px-2 py-1 text-[9px] font-medium ${statusStyles[trip.status]}`}>
                    ● {trip.status}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <button className="bg-slate-100 p-1.5 rounded-full text-slate-500 hover:bg-slate-200">
                    <Eye size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-[10px] text-slate-500">
        <p>Showing 1–5 of 120 bookings</p>

        <div className="flex items-center gap-1">
          <button className="px-2 py-1 border rounded-md border-slate-200">
            <ChevronLeft size={12} />
          </button>

          <button className="px-2.5 py-1 rounded-md bg-teal-700 text-white">
            1
          </button>

          <button className="px-2 py-1 border rounded-md border-slate-200">2</button>
          <button className="px-2 py-1 border rounded-md border-slate-200">3</button>
          <span className="px-1">...</span>
          <button className="px-2 py-1 border rounded-md border-slate-200">24</button>

          <button className="px-2 py-1 border rounded-md border-slate-200">
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

    </div>
  );
}
