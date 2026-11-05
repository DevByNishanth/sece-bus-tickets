import axios from "axios";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, LabelList } from "recharts";

const CrewCountOverviewChart = ({ onTotalChange }) => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
                const token = window.localStorage.getItem("exte_key");
                if (!baseUrl) throw new Error("API URL is not configured.");
                const response = await axios.get(`${baseUrl}/agent/crews/monthly-overview`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    signal: controller.signal,
                });
                const result = response.data;
                const months = Array.isArray(result?.data) ? [...result.data].sort((a, b) => a.monthIndex - b.monthIndex) : [];
                setMonthlyData(months);
                setYear(result?.year ?? new Date().getFullYear());
                onTotalChange?.(result?.totalCrewsInYear ?? result?.totalDriversInYear ?? result?.totalStaffInYear ?? 0);
            } catch (fetchError) {
                if (fetchError.code === "ERR_CANCELED") return;
                setError(fetchError.response?.data?.message || fetchError.message || "Could not load crew statistics.");
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        };
        fetchData();
        return () => controller.abort();
    }, [onTotalChange]);

    const currentMonth = new Date().getMonth() + 1;
    const maxCount = Math.max(1, ...monthlyData.map((month) => Number(month.count) || 0));

    return (
        <section className="mt-4 w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-5"><h2 className="font-semibold text-[#17212B]">Crew Count Overview</h2><p className="text-[12px] text-[#718096]">Crew members added each month in {year}</p></div>
            {isLoading ? <div className="h-[260px] animate-pulse rounded-lg bg-slate-50" role="status" aria-label="Loading crew chart" /> : error ? <div role="alert" className="flex h-[260px] items-center justify-center rounded-lg bg-rose-50 px-4 text-sm text-rose-700">{error}</div> : monthlyData.length === 0 ? <div className="flex h-[260px] items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500">No crew activity data available.</div> : (
                <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData} margin={{ top: 18, right: 8, left: -8, bottom: 0 }} barCategoryGap="24%">
                            <CartesianGrid vertical={false} stroke="#E7EEF5" strokeDasharray="3 4" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#7183A5", fontSize: 10 }} tickMargin={12} />
                            <YAxis domain={[0, Math.ceil(maxCount * 1.25) || 1]} allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#7183A5", fontSize: 10 }} width={32} />
                            <Bar dataKey="count" maxBarSize={52} radius={[8, 8, 0, 0]}>
                                {monthlyData.map((item) => <Cell key={item.monthNumber} fill={item.monthNumber === currentMonth ? "#117F89" : "#56A4AD"} />)}
                                <LabelList dataKey="count" position="top" fill="#526174" fontSize={10} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </section>
    );
};

export default CrewCountOverviewChart;
