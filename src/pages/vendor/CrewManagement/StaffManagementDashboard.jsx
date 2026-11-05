import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import VendorNavbar from "../VendorNavbar";
import CrewOverviewStatcards from "./CrewOverviewStatcards";
import CrewCountOverviewChart from "./CrewCountOverviewChart";
import CrewListTable from "./CrewListTable";
import CrewMemberForm from "./CrewMemberForm";

const StaffManagementDashboard = () => {
    const [totalCrew, setTotalCrew] = useState(null);
    const [crewRefreshKey, setCrewRefreshKey] = useState(0);
    const [isAddCrewOpen, setIsAddCrewOpen] = useState(false);
    const handleTotalChange = useCallback((total) => setTotalCrew(total), []);
    const refreshCrews = useCallback(() => setCrewRefreshKey((key) => key + 1), []);

    return <main className="min-h-screen bg-[#F7F9FA] py-3">
        <VendorNavbar />
        <div className="mx-auto mt-3 w-[94%]">
            <header className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-medium">Crew Management Overview</h1>
                    <p className="mt-1 text-sm text-[#627B77]">Manage your crew, activity, and assignments.</p>
                </div>
                <button type="button" onClick={() => setIsAddCrewOpen(true)} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#0E7A88] px-4 py-2 text-sm text-white transition hover:bg-[#035863]">
                    <Plus size={16} /> Add Crew Member
                </button>
            </header>
            <CrewOverviewStatcards totalCrew={totalCrew} />
            <CrewCountOverviewChart onTotalChange={handleTotalChange} />
            <CrewListTable refreshKey={crewRefreshKey} onCrewChanged={refreshCrews} />
        </div>
        {isAddCrewOpen && <CrewMemberForm onClose={() => setIsAddCrewOpen(false)} onSuccess={refreshCrews} />}
    </main>;
};

export default StaffManagementDashboard;
