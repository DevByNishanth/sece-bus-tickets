import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Search, SlidersHorizontal, Download, Eye, Pencil, Trash2 } from "lucide-react";
import CrewMemberForm from "./CrewMemberForm";
import CrewDetailsModal from "./CrewDetailsModal";

const statusOptions = [["", "All crew"], ["available", "Available"], ["assigned", "Assigned"], ["not-available", "Not available"], ["leave", "On leave"]];
const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
        case "available": return "bg-teal-100 text-teal-700";
        case "not-available": return "bg-pink-100 text-pink-700";
        case "assigned": return "bg-green-100 text-green-700";
        case "leave": return "bg-amber-100 text-amber-600";
        default: return "bg-gray-100 text-gray-600";
    }
};
const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

const CrewListTable = ({ refreshKey = 0, onCrewChanged }) => {
    const [crews, setCrews] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingCrew, setEditingCrew] = useState(null);
    const [viewingCrew, setViewingCrew] = useState(null);
    const [deletingCrew, setDeletingCrew] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const timer = window.setTimeout(async () => {
            setLoading(true);
            setError("");
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
                const token = window.localStorage.getItem("exte_key");
                if (!baseUrl) throw new Error("API URL is not configured.");
                const response = await axios.get(`${baseUrl}/agent/crews`, {
                    params: { page: 1, limit: 10, status, search: search.trim() },
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    signal: controller.signal,
                });
                const result = response.data?.crews ?? response.data?.data?.crews ?? response.data?.data;
                setCrews(Array.isArray(result) ? result : []);
            } catch (fetchError) {
                if (fetchError.code === "ERR_CANCELED") return;
                setCrews([]);
                setError(fetchError.response?.data?.message || fetchError.message || "Could not load crew members.");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }, search.trim() ? 350 : 0);
        return () => { window.clearTimeout(timer); controller.abort(); };
    }, [search, status, refreshKey]);

    const exportCsv = () => {
        const rows = [["Crew Name", "Role", "Mobile", "Email", "Employee Code", "Status"], ...crews.map((crew) => [crew.fullName || crew.name, crew.crewRole || crew.role, crew.mobile, crew.email, crew.employeeCode, crew.status])];
        const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "crew-members.csv";
        link.click();
        URL.revokeObjectURL(url);
    };

    const deleteCrew = async () => {
        setIsDeleting(true);
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
            const token = window.localStorage.getItem("exte_key");
            const id = deletingCrew?._id || deletingCrew?.id;
            if (!baseUrl || !id) throw new Error("Crew member ID or API URL is missing.");
            const response = await axios.delete(`${baseUrl}/agent/crews/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
            toast.success(response.data?.message || "Crew member deleted successfully.");
            setDeletingCrew(null);
            onCrewChanged?.();
        } catch (deleteError) {
            toast.error(deleteError.response?.data?.message || deleteError.message || "Could not delete crew member.");
        } finally {
            setIsDeleting(false);
        }
    };

    return <>
        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <header className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-center lg:justify-between">
                <div><h2 className="font-semibold text-[#17212B]">Crew List</h2><p className="text-[12px] text-[#718096]">View and manage crew members and assignments.</p></div>
                <div className="flex flex-wrap items-center gap-2">
                    <label className="flex h-9 w-[260px] items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3"><Search size={14} className="shrink-0 text-slate-500" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search crew members..." aria-label="Search crew members" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" /></label>
                    <div className="relative">
                        <button type="button" aria-expanded={filterOpen} onClick={() => setFilterOpen((open) => !open)} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700"><SlidersHorizontal size={13} />{status ? status.replace("-", " ") : "Filter"}</button>
                        {filterOpen && <div className="absolute right-0 top-full z-20 mt-2 min-w-40 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">{statusOptions.map(([value, label]) => <button key={value || "all"} type="button" onClick={() => { setStatus(value); setFilterOpen(false); }} className={`block w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-slate-50 ${status === value ? "font-semibold text-teal-700" : "text-slate-700"}`}>{label}</button>)}</div>}
                    </div>
                    <button type="button" onClick={exportCsv} disabled={!crews.length} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#0E7A88] px-3 text-xs font-semibold text-white transition hover:bg-[#046b79] disabled:cursor-not-allowed disabled:opacity-50"><Download size={13} />Export CSV</button>
                </div>
            </header>
            <div className="mt-4 max-h-[calc(100vh-180px)] overflow-x-auto overflow-y-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[850px] border-collapse text-left">
                    <thead className="sticky top-0 bg-[#E5EBEF]"><tr className="text-[10px] font-medium uppercase text-slate-700">{["Crew Name", "Role", "Mobile", "Employee Code", "Status", "Actions"].map((heading) => <th key={heading} className={`px-4 py-3 font-medium ${heading === "Actions" ? "text-center" : ""}`}>{heading}</th>)}</tr></thead>
                    <tbody>
                        {loading ? Array.from({ length: 5 }, (_, index) => <tr key={`skeleton-${index}`} className="animate-pulse border-t border-slate-100">{Array.from({ length: 6 }, (_, cell) => <td key={cell} className="px-4 py-4"><div className="h-3 rounded bg-slate-100" /></td>)}</tr>) : error ? <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-rose-700">{error}</td></tr> : crews.length === 0 ? <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500">No crew members found. Try another search or status filter.</td></tr> : crews.map((crew) => <tr key={crew._id || crew.id} className="border-t border-slate-100 transition-colors hover:bg-slate-50"><td className="px-4 py-3"><div className="flex items-center gap-2"><span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-teal-50 text-xs font-semibold text-teal-700">{crew.profilePhoto?.url ? <img src={crew.profilePhoto.url} alt={`${crew.fullName || crew.name || "Crew member"} profile`} className="h-10 w-10 object-cover" /> : crew.fullName?.slice(0, 1) || crew.name?.slice(0, 1) || "C"}</span><span className="text-xs font-medium text-slate-800">{crew.fullName || crew.name || "—"}</span></div></td><td className="px-4 py-3 text-xs text-slate-600">{crew.crewRole || crew.role || crew.position || "—"}</td><td className="px-4 py-3 text-xs text-slate-600">{crew.mobile || crew.phone || "—"}</td><td className="px-4 py-3 text-xs text-slate-600">{crew.employeeCode || "—"}</td><td className="px-4 py-3"><span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium ${getStatusStyle(crew.status)}`}>{crew.status?.toUpperCase() || "UNKNOWN"}</span></td><td className="px-4 py-3"><div className="flex items-center justify-center gap-2"><button type="button" title="View crew member" onClick={() => setViewingCrew(crew)} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-200"><Eye size={14} /></button><button type="button" title="Edit crew member" onClick={() => setEditingCrew(crew)} className="flex h-8 w-8 items-center justify-center rounded-full text-emerald-700 transition-colors hover:bg-emerald-100"><Pencil size={14} /></button><button type="button" title="Delete crew member" onClick={() => setDeletingCrew(crew)} className="flex h-8 w-8 items-center justify-center rounded-full text-rose-600 transition-colors hover:bg-rose-100"><Trash2 size={14} /></button></div></td></tr>)}
                    </tbody>
                </table>
            </div>
        </section>

        {editingCrew && <CrewMemberForm key={editingCrew?._id || editingCrew.id} crew={editingCrew} onClose={() => setEditingCrew(null)} onSuccess={onCrewChanged} />}
        {viewingCrew && <CrewDetailsModal crew={viewingCrew} onClose={() => setViewingCrew(null)} />}
        {deletingCrew && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4"><section role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl"><header className="border-b border-slate-100 px-5 py-4"><h2 className="text-base font-semibold text-slate-900">Delete Crew Member</h2><p className="mt-1 text-xs text-slate-500">Are you sure you want to delete {deletingCrew.fullName || deletingCrew.name || "this crew member"}? This action cannot be undone.</p></header><footer className="flex justify-end gap-3 px-5 py-4"><button type="button" disabled={isDeleting} onClick={() => setDeletingCrew(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 disabled:opacity-50">Cancel</button><button type="button" disabled={isDeleting} onClick={deleteCrew} className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-60">{isDeleting ? "Deleting..." : "Delete Crew Member"}</button></footer></section></div>}
    </>;
};

export default CrewListTable;

