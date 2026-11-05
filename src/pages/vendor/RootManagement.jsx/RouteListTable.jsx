import { useEffect, useState } from "react";
import axios from "axios";
import {
    ChevronRight,
    ChevronDown,
    Search,
    SlidersHorizontal,
    Download,
    ArrowRight,
    MoreHorizontal,
    Circle,
} from "lucide-react";

const RouteListTable = () => {
    const [openRoutes, setOpenRoutes] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        const timer = window.setTimeout(async () => {
            setIsLoading(true);
            setError("");
            try {
                const token = window.localStorage.getItem("exte_key");
                const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
                if (!baseUrl) throw new Error("API URL is not configured.");
                const response = await axios.get(`${baseUrl}/agent/routes/grouped`, {
                    params: { search: search.trim() },
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    signal: controller.signal,
                });
                const routeGroups = Array.isArray(response.data?.data) ? response.data.data : [];
                setRoutes(routeGroups);
                setOpenRoutes(routeGroups.length
                    ? [`${routeGroups[0].originCity}-${routeGroups[0].destinationCity}-0`]
                    : []);
            } catch (fetchError) {
                if (fetchError.code === "ERR_CANCELED") return;
                setRoutes([]);
                setError(fetchError.response?.data?.message || fetchError.message || "Could not load routes. Please try again.");
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        }, search ? 350 : 0);

        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [search]);

    const toggleRoute = (routeId) => {
        setOpenRoutes((current) => current.includes(routeId)
            ? current.filter((id) => id !== routeId)
            : [...current, routeId]);
    };

    const formatDate = (value) => {
        if (!value) return "—";
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString(undefined, {
            day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
        });
    };

    const renderSkeleton = () => (
        <div className="space-y-3" aria-label="Loading routes" aria-busy="true">
            {[0, 1, 2].map((group) => (
                <div key={group} className="overflow-hidden rounded-xl border border-slate-200">
                    <div className="flex h-[58px] items-center gap-3 bg-slate-100 px-4">
                        <div className="h-7 w-7 animate-pulse rounded-md bg-slate-200" />
                        <div className="h-4 w-44 max-w-[45%] animate-pulse rounded bg-slate-200" />
                        <div className="ml-auto h-6 w-20 animate-pulse rounded-full bg-slate-200" />
                    </div>
                    {[0, 1].map((row) => (
                        <div key={row} className="grid grid-cols-4 gap-4 border-t border-slate-100 px-5 py-4 sm:grid-cols-8">
                            {[0, 1, 2, 3].map((cell) => <div key={cell} className={`h-3 animate-pulse rounded bg-slate-100 ${cell === 0 ? "col-span-2" : ""}`} />)}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );

    return (
        <div className="main-container mt-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
            <header className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 lg:flex-row lg:items-center">
                <div>
                    <h2 className="font-semibold text-[#17212B]">Route List</h2>
                    <p className="text-[12px] text-[#718096]">Manage routes and their variants.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <label className="flex h-9 w-[290px] items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3">
                        <Search size={14} className="shrink-0 text-slate-500" />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search routes or cities..."
                            aria-label="Search routes"
                            className="w-full bg-transparent text-[14px] text-slate-700 outline-none placeholder:text-slate-400"
                        />
                    </label>
                    <button type="button" className="flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 text-[14px] font-medium text-black transition hover:bg-slate-100">
                        <SlidersHorizontal size={12} /> Filter
                    </button>
                    <button type="button" className="flex h-9 items-center gap-1.5 rounded-full bg-[#0E7A88] px-3 text-[14px] font-semibold text-white transition hover:bg-teal-800">
                        <Download size={14} /> Export CSV
                    </button>
                    <button type="button" className="flex h-9 cursor-pointer items-center gap-1 rounded-full px-2 text-[14px] font-medium text-teal-700 hover:text-teal-900">
                        View All <ArrowRight size={12} />
                    </button>
                </div>
            </header>

            <div className="mt-3">
                {isLoading ? renderSkeleton() : error ? (
                    <div role="alert" className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-10 text-center text-sm text-rose-700">{error}</div>
                ) : routes.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 px-4 py-12 text-center">
                        <p className="text-sm font-medium text-slate-700">No routes found</p>
                        <p className="mt-1 text-xs text-slate-500">Try another search or add a new route.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {routes.map((route, routeIndex) => {
                            const routeId = `${route.originCity}-${route.destinationCity}-${routeIndex}`;
                            const variants = Array.isArray(route.variants) ? route.variants : [];
                            const isOpen = openRoutes.includes(routeId);
                            const activeCount = variants.filter((variant) => variant.isActive ?? variant.status?.toLowerCase() === "active").length;

                            return (
                                <div key={routeId} className="overflow-hidden rounded-xl border border-slate-200">
                                    <button type="button" onClick={() => toggleRoute(routeId)} className="flex min-h-[42px] w-full items-center justify-between gap-3 bg-slate-100 px-3 py-2 text-left transition hover:bg-slate-100">
                                        <div className="flex min-w-0 items-center gap-2">
                                            <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500">
                                                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                            </span>
                                            <span className="text-[14px] font-semibold text-slate-800">{route.originCity}</span>
                                            <ArrowRight size={12} className="shrink-0 text-teal-700" />
                                            <span className="text-[14px] font-semibold text-slate-800">{route.destinationCity}</span>
                                            <span className="mx-1 hidden h-4 border-l border-slate-200 sm:block" />
                                            <span className="hidden text-[11px] text-slate-500 sm:block">{route.routeVariantsCount ?? variants.length} route variants</span>
                                        </div>
                                        <span className="shrink-0 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[9px] font-semibold text-emerald-700">{activeCount} active</span>
                                    </button>

                                    {isOpen && (
                                        <div className="w-full overflow-x-auto">
                                            <table className="w-full min-w-[750px] table-auto text-left">
                                                <thead><tr className="bg-white">
                                                    {["Route Variant", "Stops", "Distance / Duration", "Configuration", "Trips", "Status", "Last Updated", "Actions"].map((heading) => (
                                                        <th key={heading} className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{heading}</th>
                                                    ))}
                                                </tr></thead>
                                                <tbody>
                                                    {variants.length === 0 ? <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">No route variants found.</td></tr> : variants.map((variant) => {
                                                        const isActive = variant.isActive ?? variant.status?.toLowerCase() === "active";
                                                        return (
                                                            <tr key={variant._id || variant.routeName} className="border-t border-slate-100 transition hover:bg-slate-50/70">
                                                                <td className="px-5 py-2.5"><p className="text-[12px] font-semibold text-slate-800">{variant.routeName || "Unnamed route"}</p><p className="mt-1 text-[9px] text-slate-400">{variant.routeCategory || "—"}</p></td>
                                                                <td className="px-3 py-2.5"><p className="text-[12px] font-semibold text-slate-800">{variant.totalStops ?? "—"}</p><p className="mt-1 text-[9px] text-slate-400">stops</p></td>
                                                                <td className="px-3 py-2.5"><p className="text-[12px] font-semibold text-slate-800">{variant.estimatedDistance || "—"}</p><p className="mt-1 text-[9px] text-slate-400">{variant.estimatedDuration || "—"}</p></td>
                                                                <td className="px-3 py-2.5"><p className="text-[12px] font-semibold text-slate-800">{variant.configurationText || `${variant.boardingCount ?? 0} / ${variant.droppingCount ?? 0} configured`}</p><p className="mt-1 text-[9px] text-slate-400">Boarding / drop</p></td>
                                                                <td className="px-3 py-2.5"><p className="text-[12px] font-semibold text-slate-800">{variant.totalLinkedTrips ?? 0}</p><p className="mt-1 text-[9px] text-slate-400">linked trips</p></td>
                                                                <td className="px-3 py-2.5"><span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${isActive ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-100 text-slate-500"}`}><Circle size={5} fill="currentColor" />{variant.status || (isActive ? "Active" : "Inactive")}</span></td>
                                                                <td className="px-3 py-2.5"><p className="whitespace-nowrap text-[12px] font-semibold text-slate-800">{formatDate(variant.lastUpdated)}</p></td>
                                                                <td className="px-3 py-2.5"><button type="button" aria-label={`Actions for ${variant.routeName || "route"}`} className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><MoreHorizontal size={15} /></button></td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RouteListTable;
