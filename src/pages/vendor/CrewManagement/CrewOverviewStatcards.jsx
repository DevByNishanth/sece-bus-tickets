import { Users, UserCheck, UserX, Clock, UserRoundCheck } from "lucide-react";

const stats = [
    { label: "TOTAL CREW", icon: Users, color: "from-emerald-400 to-emerald-600" },
    { label: "ACTIVE CREW", icon: UserCheck, color: "from-blue-400 to-blue-600" },
    { label: "INACTIVE CREW", icon: UserX, color: "from-slate-400 to-slate-600" },
    { label: "PENDING CREW", icon: Clock, color: "from-amber-400 to-orange-500" },
    { label: "ON DUTY", icon: UserRoundCheck, color: "from-teal-400 to-teal-600" },
];

const CrewOverviewStatcards = ({ totalCrew = null }) => (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map(({ label, icon: Icon, color }) => (
            <div key={label} className="flex items-center justify-between rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
                <div><p className="text-xl font-semibold text-slate-800">{label === "TOTAL CREW" && totalCrew !== null ? totalCrew : "—"}</p><p className="text-xs font-medium text-gray-400">{label}</p></div>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r ${color}`}><Icon className="h-5 w-5 text-white" /></div>
            </div>
        ))}
    </div>
);

export default CrewOverviewStatcards;
