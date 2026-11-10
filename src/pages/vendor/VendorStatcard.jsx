import { useEffect, useState } from "react"
import axios from "axios"
import icon1 from "../../assets/icon1.svg"
import icon2 from "../../assets/icon2.svg"
import icon3 from "../../assets/icon3.svg"
import icon4 from "../../assets/icon4.svg"

const emptyStats = {
    totalBookings: 0,
    grossBookingValue: 0,
    seatOccupancyRate: 0,
    fleetAvailability: 0,
    assignedBuses: 0,
    totalFleet: 0,
}

// Format a number using the Indian number grouping style.
const formatNumber = (value) => Number(value || 0).toLocaleString("en-IN")

// Make a date like 2026-11-05 using the user's local date.
const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
}

const VendorStatcard = () => {
    const [stats, setStats] = useState(emptyStats)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const controller = new AbortController()

        const loadDashboardStats = async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "")
                const token = window.localStorage.getItem("exte_key")

                if (!baseUrl) {
                    throw new Error("API URL is not configured.")
                }

                // Send today's date as a query parameter to the dashboard endpoint.
                const response = await axios.get(`${baseUrl}/partner/dashboard/overview`, {
                    params: { date: getTodayDate() },
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    signal: controller.signal,
                })

                // The API wraps the statistics inside the data property.
                setStats({ ...emptyStats, ...response.data?.data })
            } catch (requestError) {
                if (requestError.code === "ERR_CANCELED") return

                setError(
                    requestError.response?.data?.message ||
                    requestError.message ||
                    "Could not load dashboard statistics."
                )
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false)
                }
            }
        }

        loadDashboardStats()

        return () => controller.abort()
    }, [])

    const showValue = (value) => isLoading ? "…" : formatNumber(value)

    return (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {/* Total bookings */}
            <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <p className="text-[13px] font-medium text-gray-500">TOTAL BOOKINGS</p>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-[#087F8C] to-[#10B981]">
                        <img src={icon1} alt="" className="h-6 w-6" />
                    </div>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-gray-800">
                    {showValue(stats.totalBookings)}
                </h2>
                <p className="mt-0.5 text-[12px] text-[#627B77]">Bookings today</p>
            </div>

            {/* Gross booking value */}
            <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <p className="text-[13px] font-medium text-gray-500">GROSS BOOKING VALUE</p>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-[#0284C7] to-[#4F46E5]">
                        <img src={icon2} alt="" className="h-4 w-4" />
                    </div>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-gray-800">
                    ₹{showValue(stats.grossBookingValue)}
                </h2>
                <p className="mt-0.5 text-[12px] text-[#627B77]">Booking value today</p>
            </div>

            {/* Seat occupancy rate */}
            <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <p className="text-[13px] font-medium text-gray-500">SEAT OCCUPANCY RATE</p>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-[#9333EA] to-[#6366F1]">
                        <img src={icon3} alt="" className="h-5 w-5" />
                    </div>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-gray-800">
                    {isLoading ? "…" : `${formatNumber(stats.seatOccupancyRate)}%`}
                </h2>
                <div
                    className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
                    role="progressbar"
                    aria-label="Seat occupancy rate"
                    aria-valuenow={Number(stats.seatOccupancyRate) || 0}
                    aria-valuemin="0"
                    aria-valuemax="100"
                >
                    <div
                        className="h-full rounded-full bg-[#10818C] transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, Number(stats.seatOccupancyRate) || 0))}%` }}
                    />
                </div>
            </div>

            {/* Fleet availability */}
            <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <p className="text-[13px] font-medium text-gray-500">FLEET AVAILABILITY</p>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#F97316]">
                        <img src={icon4} alt="" className="h-6 w-6" />
                    </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {showValue(stats.fleetAvailability)}
                    </h2>
                    <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-medium text-cyan-700">
                        {isLoading ? "…" : `${formatNumber(stats.assignedBuses)} / ${formatNumber(stats.totalFleet)} assigned`}
                    </span>
                </div>
                <p className="mt-0.5 text-[12px] text-[#627B77]">Available buses today</p>
            </div>

            {error && (
                <p role="alert" className="col-span-full text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    )
}

export default VendorStatcard
