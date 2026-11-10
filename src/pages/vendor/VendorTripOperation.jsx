import { useEffect, useState } from "react"
import axios from "axios"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const emptySummary = {
    totalTrips: 0,
    scheduled: 0,
    boarding: 0,
    in_transit: 0,
    completed: 0,
    delayed: 0,
    cancelled: 0,
}

const tripStatuses = [
    { key: "scheduled", label: "Scheduled", color: "#10818C" },
    { key: "boarding", label: "Boarding", color: "#FFB547" },
    { key: "in_transit", label: "In Transit", color: "#3B82F6" },
    { key: "completed", label: "Completed", color: "#16A36A" },
    { key: "delayed", label: "Delayed", color: "#F43F5E" },
    { key: "cancelled", label: "Cancelled", color: "#94A3B8" },
]

const getTripRoute = (trip) => {
    if (typeof trip.route === "string") return trip.route
    if (trip.routeName) return trip.routeName

    const origin = trip.from || trip.origin || trip.originCity || trip.route?.originCity
    const destination = trip.to || trip.destination || trip.destinationCity || trip.route?.destinationCity

    if (origin && destination) return `${origin} → ${destination}`
    return "Route not available"
}

const getBusNumber = (trip) =>
    trip.busNumber || trip.coachId || trip.bus?.registrationNumber || trip.bus?.busNumber || "—"

const getStatusName = (status) => {
    const statusKey = String(status || "").toLowerCase().replace(/[\s-]+/g, "_")
    const statusInfo = tripStatuses.find((item) => item.key === statusKey)
    return statusInfo?.label || status || "Unknown"
}

const VendorTripOperation = () => {
    const [summary, setSummary] = useState(emptySummary)
    const [trips, setTrips] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const controller = new AbortController()

        const fetchTripOperations = async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "")
                const token = window.localStorage.getItem("exte_key")

                if (!baseUrl) {
                    throw new Error("API URL is not configured.")
                }

                const response = await axios.get(`${baseUrl}/partner/dashboard/trip-operations`, {
                    params: { page: 1, limit: 10 },
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    signal: controller.signal,
                })

                // Summary values drive the status bar and legend.
                setSummary({ ...emptySummary, ...response.data?.data?.summary })

                // The API puts the rows for the table inside data.trips.
                const tripRows = response.data?.data?.trips
                setTrips(Array.isArray(tripRows) ? tripRows : [])
            } catch (requestError) {
                if (requestError.code === "ERR_CANCELED") return

                setError(
                    requestError.response?.data?.message ||
                    requestError.message ||
                    "Could not load trip operations."
                )
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false)
                }
            }
        }

        fetchTripOperations()
        return () => controller.abort()
    }, [])

    const statusTotal = tripStatuses.reduce(
        (total, status) => total + (Number(summary[status.key]) || 0),
        0
    )

    return (
        <div className="col-span-8 w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-semibold text-black">Today's Trip Operations</h2>
                    <p className="mt-0.5 text-[10px] text-gray-500">
                        {isLoading ? "Loading trip operations..." : `${Number(summary.totalTrips) || 0} trips in today's operations`}
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

            {/* Trip status progress bar */}
            <div
                className="mt-3 flex h-4 w-full gap-1 overflow-hidden rounded-full border border-gray-300 p-1"
                aria-label="Trip status breakdown"
            >
                {tripStatuses.map((status) => {
                    const count = Number(summary[status.key]) || 0
                    const width = statusTotal > 0 ? `${(count / statusTotal) * 100}%` : "0%"

                    return (
                        <div
                            key={status.key}
                            className="h-full rounded-full"
                            style={{ width, minWidth: count > 0 ? "4px" : 0, backgroundColor: status.color }}
                            title={`${status.label}: ${count}`}
                        />
                    )
                })}
            </div>

            {/* Status legend */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                {tripStatuses.map((status) => (
                    <div key={status.key} className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: status.color }} />
                        <span className="text-[11px] text-gray-800">
                            {status.label} ({Number(summary[status.key]) || 0})
                        </span>
                    </div>
                ))}
            </div>

            {/* Trips table */}
            <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full min-w-[500px] border-collapse text-left">
                    <thead className="bg-[#f5f8fa]">
                        <tr className="text-[10px] font-semibold uppercase text-[#5e717d]">
                            <th className="px-3 py-2 font-medium">Dep. Time</th>
                            <th className="px-3 py-2 font-medium">Route</th>
                            <th className="px-3 py-2 font-medium">Coach ID</th>
                            <th className="px-3 py-2 font-medium">Live Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="4" className="px-3 py-8 text-center text-xs text-gray-500">
                                    Loading trips...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="4" role="alert" className="px-3 py-8 text-center text-xs text-red-600">
                                    {error}
                                </td>
                            </tr>
                        ) : trips.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-3 py-8 text-center text-xs text-gray-500">
                                    No data found.
                                </td>
                            </tr>
                        ) : (
                            trips.map((trip, index) => {
                                const statusName = getStatusName(trip.status || trip.tripStatus || trip.liveStatus)
                                const statusKey = String(trip.status || trip.tripStatus || trip.liveStatus || "")
                                    .toLowerCase()
                                    .replace(/[\s-]+/g, "_")
                                const statusInfo = tripStatuses.find((status) => status.key === statusKey)

                                return (
                                    <tr
                                        key={trip._id || trip.id || trip.tripId || index}
                                        className="border-t border-gray-200 hover:bg-gray-50"
                                    >
                                        <td className="whitespace-nowrap px-3 py-2 text-[11px] font-semibold text-gray-800">
                                            {trip.departureTime || trip.departure_time || trip.departure || "—"}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-2 text-[11px] text-gray-800">
                                            {getTripRoute(trip)}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-2 font-mono text-[11px] text-gray-500">
                                            {getBusNumber(trip)}
                                        </td>
                                        <td className="px-3 py-2">
                                            <span
                                                className="rounded-full px-2 py-1 text-[10px] font-semibold"
                                                style={{
                                                    backgroundColor: statusInfo ? `${statusInfo.color}20` : "#F3F4F6",
                                                    color: statusInfo?.color || "#374151",
                                                }}
                                            >
                                                {statusName}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default VendorTripOperation
