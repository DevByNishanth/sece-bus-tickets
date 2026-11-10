import { useEffect, useState } from "react"
import axios from "axios"
import { MoreHorizontal } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

const bookingStatuses = [
    { key: "confirmed", name: "Confirmed", color: "#10818C" },
    { key: "cancelled", name: "Cancelled", color: "#FF795F" },
    { key: "pending", name: "Pending", color: "#FFB547" },
    { key: "refunded", name: "Refunded", color: "#7167FF" },
]

const emptyBookingData = {
    total: 0,
    confirmed: { count: 0, percentage: 0 },
    cancelled: { count: 0, percentage: 0 },
    pending: { count: 0, percentage: 0 },
    refunded: { count: 0, percentage: 0 },
}

const formatNumber = (value) => Number(value || 0).toLocaleString("en-IN")

const VendorBookingPiechart = () => {
    const [bookingData, setBookingData] = useState(emptyBookingData)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const controller = new AbortController()

        const fetchBookingStatus = async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "")
                const token = window.localStorage.getItem("exte_key")

                if (!baseUrl) {
                    throw new Error("API URL is not configured.")
                }

                const response = await axios.get(`${baseUrl}/partner/dashboard/booking-status`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    signal: controller.signal,
                })

                // The API gives each status its own count and percentage.
                setBookingData({
                    ...emptyBookingData,
                    ...response.data?.data,
                })
            } catch (requestError) {
                if (requestError.code === "ERR_CANCELED") return

                setError(
                    requestError.response?.data?.message ||
                    requestError.message ||
                    "Could not load booking status."
                )
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false)
                }
            }
        }

        fetchBookingStatus()
        return () => controller.abort()
    }, [])

    // Recharts uses each status count to draw its section of the donut.
    const chartData = bookingStatuses.map((status) => ({
        name: status.name,
        value: Number(bookingData[status.key]?.count) || 0,
        color: status.color,
    }))
    const hasBookings = chartData.some((status) => status.value > 0)
    const visibleChartData = hasBookings
        ? chartData
        : [{ name: "No bookings", value: 1, color: "#E9EEF2" }]

    return (
        <div className="col-span-3 w-full rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-black">Booking Status</h2>
                <button
                    type="button"
                    className="rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100"
                    aria-label="Booking status options"
                >
                    <MoreHorizontal size={18} />
                </button>
            </div>

            <div className="relative mx-auto h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={visibleChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={90}
                            paddingAngle={0}
                            stroke="none"
                        >
                            {visibleChartData.map((status) => (
                                <Cell key={status.name} fill={status.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <h3 className="text-2xl font-bold text-gray-800">
                        {isLoading ? "…" : formatNumber(bookingData.total)}
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-500">Total Bookings</p>
                </div>
            </div>

            <div className="mt-2 space-y-3 border-t border-gray-200 pt-2">
                {bookingStatuses.map((status) => {
                    const statusData = bookingData[status.key] || { count: 0, percentage: 0 }

                    return (
                        <div key={status.key} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: status.color }}
                                />
                                <span className="text-[11px] text-gray-700">{status.name}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-medium text-gray-800">
                                    {isLoading ? "…" : formatNumber(statusData.count)}
                                </span>
                                <span className="w-9 text-right text-[10px] text-gray-500">
                                    {isLoading ? "…" : `${Number(statusData.percentage) || 0}%`}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {error && <p role="alert" className="mt-3 text-xs text-red-600">{error}</p>}
        </div>
    )
}

export default VendorBookingPiechart
