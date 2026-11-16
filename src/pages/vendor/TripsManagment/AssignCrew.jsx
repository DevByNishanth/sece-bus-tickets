import { useState } from "react"
import { Check, Search, Users } from "lucide-react"

// Sample staff until the vendor staff API is connected.
const drivers = [
    { id: "DRV-1042", name: "R. Murugan", role: "Lead Driver", initials: "RM" },
    { id: "DRV-1088", name: "S. Kumar", role: "Driver", initials: "SK" },
    { id: "DRV-1106", name: "A. Prakash", role: "Driver", initials: "AP" },
]

const crewMembers = [
    { id: "CREW-2024", name: "M. Priya", role: "Trip Attendant", initials: "MP" },
    { id: "CREW-2031", name: "K. Devi", role: "Trip Attendant", initials: "KD" },
    { id: "CREW-2045", name: "V. Babu", role: "Trip Attendant", initials: "VB" },
]

const StaffPanel = ({ title, searchLabel, staff, selectedId, onSelect }) => {
    const [searchText, setSearchText] = useState("")
    const filteredStaff = staff.filter((person) =>
        `${person.name} ${person.id} ${person.role}`
            .toLowerCase()
            .includes(searchText.toLowerCase())
    )

    return (
        <section className="rounded-xl border border-[#E8EDF1] bg-white p-4">
            <h2 className="text-sm font-semibold text-[#1E293B]">{title}</h2>
            <p className="mt-1 text-[10px] text-[#64748B]">
                Live passenger ticket reservations &amp; payment receipts across all routes
            </p>

            <label className="mt-3 flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
                <Search size={14} className="shrink-0 text-[#64748B]" />
                <span className="sr-only">{searchLabel}</span>
                <input
                    type="search"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder={searchLabel}
                    className="w-full bg-transparent text-xs text-[#1E293B] outline-none placeholder:text-[#94A3B8]"
                />
            </label>

            <div className="mt-3 space-y-2">
                {filteredStaff.map((person) => {
                    const isSelected = selectedId === person.id

                    return (
                        <button
                            key={person.id}
                            type="button"
                            onClick={() => onSelect(person.id)}
                            aria-pressed={isSelected}
                            className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition-colors ${
                                isSelected
                                    ? "border-[#0E7A88] bg-[#F8FEFE]"
                                    : "border-[#E2E8F0] bg-white hover:border-[#9CCDD1]"
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E5F5F5] text-xs font-semibold text-[#0E6672]">
                                    {person.initials}
                                </span>
                                <span>
                                    <span className="block text-xs font-semibold text-[#1E293B]">
                                        {person.name}
                                    </span>
                                    <span className="mt-1 block text-[10px] text-[#64748B]">
                                        {person.id} · {person.role}
                                    </span>
                                </span>
                            </span>

                            <span className="flex items-center gap-1 text-[10px] font-medium text-[#15966A]">
                                {isSelected && <Check size={13} />}
                                Available
                            </span>
                        </button>
                    )
                })}

                {filteredStaff.length === 0 && (
                    <p className="rounded-lg bg-[#F8FAFC] px-3 py-4 text-center text-xs text-[#64748B]">
                        No staff found. Try another name.
                    </p>
                )}
            </div>
        </section>
    )
}

const AssignCrew = () => {
    const [selectedDriver, setSelectedDriver] = useState(drivers[0].id)
    const [selectedCrew, setSelectedCrew] = useState(crewMembers[0].id)

    return (
        <div className="mt-5">
            <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E5F5F5] text-[#0E7A88]">
                    <Users size={16} />
                </div>
                <div>
                    <h1 className="text-sm font-semibold text-[#1E293B]">Assign Driver &amp; Crew</h1>
                    <p className="mt-0.5 text-[10px] text-[#64748B]">
                        Only eligible staff are assignable for the planned duty period.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <StaffPanel
                    title="Assign Driver"
                    searchLabel="Search Driver Name"
                    staff={drivers}
                    selectedId={selectedDriver}
                    onSelect={setSelectedDriver}
                />
                <StaffPanel
                    title="Assign Crew"
                    searchLabel="Search Crew Name"
                    staff={crewMembers}
                    selectedId={selectedCrew}
                    onSelect={setSelectedCrew}
                />
            </div>
        </div>
    )
}

export default AssignCrew
