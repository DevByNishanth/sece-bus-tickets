import { useMemo, useState } from "react";
import {
    ArrowRight,
    BusFront,
    CalendarCheck2,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Clock3,
    MapPin,
    Route,
    CircleCheck,
    X,
} from "lucide-react";
import VendorNavbar from "../VendorNavbar";
import mockTrips from "./mockTrips";

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const longDate = (dateString) => new Date(`${dateString}T12:00:00`).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

const SummaryCard = ({ label, value, caption, icon: Icon, accent }) => (
    <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-[0_2px_8px_rgba(15,45,50,0.03)]">
        <div><p className="text-[10px] font-medium text-slate-500">{label}</p><p className="mt-1 text-xl font-semibold tracking-tight text-slate-900">{value}</p><p className="mt-0.5 text-[9px] text-slate-400">{caption}</p></div>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}><Icon size={16} /></span>
    </div>
);

const TripCard = ({ trip, onClick, compact = false }) => (
    <button type="button" onClick={(event) => { event.stopPropagation(); onClick(trip); }} className={`group/card block w-full rounded-lg border border-slate-200 border-l-[3px] border-l-[#0E7A88] bg-white text-left shadow-[0_1px_3px_rgba(15,45,50,0.04)] transition duration-150 hover:-translate-y-0.5 hover:border-slate-300 hover:border-l-[#0E7A88] hover:shadow-md ${compact ? "p-2" : "p-2.5"}`}>
        <div className="flex min-w-0 items-center gap-1.5"><BusFront size={11} className="shrink-0 text-[#0E7A88]" /><p className="truncate text-[10px] font-semibold text-[#183638]">{trip.busName}</p></div>
        <p className="mt-1 truncate text-[10px] font-semibold text-slate-800">{trip.routeName}</p>
        <div className="mt-1 flex items-center gap-1 truncate text-[9px] text-slate-500"><span className="truncate">{trip.from}</span><ArrowRight size={10} className="shrink-0 text-[#0E7A88]" /><span className="truncate">{trip.to}</span></div>
        <div className="mt-1.5 flex items-center justify-between gap-1"><span className="inline-flex items-center gap-1 rounded-md bg-[#EFF8F8] px-1.5 py-1 text-[9px] font-medium text-[#0B6E78]"><Clock3 size={10} />{trip.departureTime}</span>{trip.status && <span className="hidden truncate text-[8px] font-medium text-slate-400 xl:block">{trip.status}</span>}</div>
    </button>
);

const TripDetailsModal = ({ trip, onClose }) => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
        <section role="dialog" aria-modal="true" aria-labelledby="trip-detail-title" className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF6F6] text-[#0E7A88]"><BusFront size={18} /></span><div><h2 id="trip-detail-title" className="text-sm font-semibold text-slate-900">Trip details</h2><p className="text-xs text-slate-500">{trip.busName}</p></div></div><button type="button" onClick={onClose} aria-label="Close trip details" className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"><X size={15} /></button></header>
            <div className="space-y-4 p-5">
                <div><p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Route</p><p className="mt-1 text-base font-semibold text-slate-900">{trip.routeName}</p></div>
                <div className="grid grid-cols-2 gap-3"><div className="rounded-xl bg-[#F4FAFA] p-3"><p className="text-[10px] text-slate-500">From</p><p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800"><MapPin size={13} className="text-teal-700" />{trip.from}</p><p className="mt-2 text-[10px] text-slate-500">Departure · {trip.departureTime}</p></div><div className="rounded-xl bg-[#F4FAFA] p-3"><p className="text-[10px] text-slate-500">To</p><p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800"><MapPin size={13} className="text-teal-700" />{trip.to}</p><p className="mt-2 text-[10px] text-slate-500">Arrival · {trip.arrivalTime}</p></div></div>
                <div className="grid grid-cols-2 gap-3 text-xs"><p className="rounded-lg border border-slate-100 p-3"><span className="block text-[10px] text-slate-500">Departure date</span><span className="mt-1 block font-medium text-slate-800">{longDate(trip.departureDate)}</span></p><p className="rounded-lg border border-slate-100 p-3"><span className="block text-[10px] text-slate-500">Bus number</span><span className="mt-1 block font-medium text-slate-800">{trip.busNumber}</span></p><p className="rounded-lg border border-slate-100 p-3"><span className="block text-[10px] text-slate-500">Driver</span><span className="mt-1 block font-medium text-slate-800">{trip.driverName}</span></p><p className="rounded-lg border border-slate-100 p-3"><span className="block text-[10px] text-slate-500">Status</span><span className="mt-1 block font-medium text-teal-800">{trip.status}</span></p></div>
            </div>
            <footer className="flex justify-end border-t border-slate-100 bg-slate-50/70 px-5 py-3"><button type="button" onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">Close</button></footer>
        </section>
    </div>
);

const CalendarDashboard = () => {
    const now = new Date();
    const [visibleMonth, setVisibleMonth] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
    const [selectedDate, setSelectedDate] = useState(dateKey(now));
    const [activeTrip, setActiveTrip] = useState(null);

    // The trip API is not present in this frontend yet; keep the sample data separate in mockTrips.js.
    const trips = mockTrips;
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const monthLabel = `${monthNames[month]} ${year}`;
    const todayKey = dateKey(now);
    const tripMap = useMemo(() => trips.reduce((map, trip) => {
        map[trip.departureDate] = [...(map[trip.departureDate] || []), trip];
        return map;
    }, {}), [trips]);

    const calendarDates = useMemo(() => {
        const firstOfMonth = new Date(year, month, 1);
        const gridStart = new Date(year, month, 1 - firstOfMonth.getDay());
        return Array.from({ length: 42 }, (_, index) => {
            const date = new Date(gridStart);
            date.setDate(gridStart.getDate() + index);
            return date;
        });
    }, [year, month]);

    const selectedTrips = tripMap[selectedDate] || [];
    const yearOptions = Array.from({ length: 7 }, (_, index) => now.getFullYear() - 3 + index);
    const monthTrips = trips.filter((trip) => {
        const tripDate = new Date(`${trip.departureDate}T12:00:00`);
        return tripDate.getFullYear() === year && tripDate.getMonth() === month;
    });
    const upcomingTrips = monthTrips.filter((trip) => trip.departureDate >= todayKey && trip.status !== "Completed").length;
    const completedTrips = monthTrips.filter((trip) => trip.status === "Completed").length;
    const busesScheduled = new Set(monthTrips.map((trip) => trip.busNumber)).size;
    const selectedDateValue = new Date(`${selectedDate}T12:00:00`);
    const weekStart = new Date(selectedDateValue);
    weekStart.setDate(selectedDateValue.getDate() - selectedDateValue.getDay());
    const selectedWeek = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + index);
        return date;
    });

    const changeMonth = (offset) => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
    const selectYear = (newYear) => setVisibleMonth((current) => new Date(Number(newYear), current.getMonth(), 1));
    const selectDate = (date) => {
        const key = dateKey(date);
        setSelectedDate(key);
        if (date.getMonth() !== month || date.getFullYear() !== year) setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    };
    const goToToday = () => {
        setVisibleMonth(new Date(now.getFullYear(), now.getMonth(), 1));
        setSelectedDate(todayKey);
    };

    return (
        <main className="min-h-screen bg-[#F7F9FA] py-3">
            <VendorNavbar />
            <div className="mx-auto mt-3 w-[94%] space-y-4">
                <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div className="flex items-start gap-3"><span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DCEAEC] bg-white text-[#0E7A88] shadow-sm"><CalendarDays size={18} /></span><div><h1 className="text-2xl font-semibold tracking-tight text-slate-900">{monthLabel}</h1><p className="mt-1 text-xs text-[#627B77]">Manage your fleet&apos;s scheduled journeys.</p></div></div>
                    <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_2px_8px_rgba(15,45,50,0.04)]">
                        <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-[#EFF8F8] hover:text-[#0E7A88]"><ChevronLeft size={17} /></button>
                        <select aria-label="Select month" value={month} onChange={(event) => setVisibleMonth(new Date(year, Number(event.target.value), 1))} className="h-9 rounded-lg border-0 bg-transparent px-2 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-teal-600/20">{monthNames.map((name, index) => <option key={name} value={index}>{name}</option>)}</select>
                        <select aria-label="Select year" value={year} onChange={(event) => selectYear(event.target.value)} className="h-9 rounded-lg border-0 bg-transparent px-2 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-teal-600/20">{yearOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select>
                        <button type="button" onClick={() => changeMonth(1)} aria-label="Next month" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-[#EFF8F8] hover:text-[#0E7A88]"><ChevronRight size={17} /></button>
                        <span className="mx-1 hidden h-6 border-l border-slate-200 sm:block" />
                        <button type="button" onClick={goToToday} className="h-9 rounded-lg bg-[#0E7A88] px-3 text-xs font-semibold text-white transition hover:bg-[#0b6975]">Today</button>
                    </div>
                </header>

                <section aria-label="Monthly trip summary" className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
                    <SummaryCard label="Total trips this month" value={monthTrips.length} caption={monthLabel} icon={Route} accent="bg-[#EFF8F8] text-[#0E7A88]" />
                    <SummaryCard label="Upcoming trips" value={upcomingTrips} caption="Scheduled from today onward" icon={CalendarCheck2} accent="bg-sky-50 text-sky-700" />
                    <SummaryCard label="Completed trips" value={completedTrips} caption="Completed this month" icon={CircleCheck} accent="bg-emerald-50 text-emerald-700" />
                    <SummaryCard label="Buses scheduled" value={busesScheduled} caption="Unique buses this month" icon={BusFront} accent="bg-violet-50 text-violet-700" />
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-white px-4 py-3 sm:px-5"><p className="text-[10px] text-slate-500">Trips are shown on their scheduled departure date.</p><span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] font-medium text-amber-800">Sample trip data</span></div>
                    <div className="hidden bg-[#F8FAFA] sm:block">
                        <div className="grid grid-cols-7 border-b border-slate-200/70">{weekdayNames.map((day) => <div key={day} className="px-3 py-3 text-center text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">{day}</div>)}</div>
                        <div className="grid grid-cols-7 bg-[#EDF2F2] gap-px">
                            {calendarDates.map((date) => {
                                const key = dateKey(date);
                                const dayTrips = tripMap[key] || [];
                                const inMonth = date.getMonth() === month;
                                const isToday = key === todayKey;
                                const isSelected = key === selectedDate;
                                const visibleTrips = dayTrips.slice(0, 2);
                                return (
                                    <div key={key} className={`min-h-[112px] p-2 transition-colors ${isSelected ? "bg-[#F0F8F8]" : inMonth ? "bg-white hover:bg-[#FBFDFD]" : "bg-[#F7F9F9] hover:bg-white"}`}>
                                        <div className="mb-2 flex items-center justify-between"><button type="button" aria-label={`Select ${longDate(key)}`} onClick={() => selectDate(date)} className={`flex h-7 min-w-7 items-center justify-center rounded-full px-1 text-[11px] font-semibold transition ${isToday ? "bg-[#0E7A88] text-white shadow-sm shadow-teal-900/15" : isSelected ? "bg-[#DFF0F0] text-[#0E7A88] ring-1 ring-[#B6DCDD]" : inMonth ? "text-slate-700 hover:bg-slate-100" : "text-slate-300 hover:text-slate-500"}`}>{date.getDate()}</button>{dayTrips.length > 0 && <span className="text-[9px] font-medium text-slate-400">{dayTrips.length} trip{dayTrips.length === 1 ? "" : "s"}</span>}</div>
                                        <div className="space-y-1.5">{visibleTrips.map((trip) => <TripCard key={trip.id} trip={trip} onClick={setActiveTrip} compact />)}{dayTrips.length > visibleTrips.length && <button type="button" onClick={() => selectDate(date)} className="px-1 text-[9px] font-semibold text-[#0E7A88] hover:underline">+{dayTrips.length - visibleTrips.length} more trips</button>}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="p-3 sm:hidden">
                        <div className="grid grid-cols-7 gap-1">
                            {selectedWeek.map((date) => {
                                const key = dateKey(date);
                                const dayTrips = tripMap[key] || [];
                                const selected = key === selectedDate;
                                const today = key === todayKey;
                                return <button key={key} type="button" onClick={() => selectDate(date)} className={`flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 transition ${selected ? "bg-[#EAF6F6] text-[#0E7A88] ring-1 ring-[#B6DCDD]" : "text-slate-500 hover:bg-slate-50"}`}><span className="text-[9px] uppercase">{weekdayNames[date.getDay()]}</span><span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${today ? "bg-[#0E7A88] text-white" : ""}`}>{date.getDate()}</span><span className="h-1 text-[8px] text-[#0E7A88]">{dayTrips.length ? `${dayTrips.length} trip${dayTrips.length > 1 ? "s" : ""}` : "·"}</span></button>;
                            })}
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="mb-3 flex flex-wrap items-end justify-between gap-2"><div><p className="text-[10px] font-semibold uppercase tracking-wide text-[#0E7A88]">Selected day</p><h2 className="mt-1 text-sm font-semibold text-slate-900">{longDate(selectedDate)}</h2></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] text-slate-600">{selectedTrips.length} {selectedTrips.length === 1 ? "trip" : "trips"}</span></div>
                    {selectedTrips.length ? <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{selectedTrips.map((trip) => <TripCard key={trip.id} trip={trip} onClick={setActiveTrip} />)}</div> : <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-8 text-center"><CalendarDays size={20} className="mx-auto text-slate-300" /><p className="mt-2 text-xs font-medium text-slate-600">No trips scheduled for this date</p><p className="mt-1 text-[10px] text-slate-400">Select another date to view its trips.</p></div>}
                </section>
            </div>
            {activeTrip && <TripDetailsModal trip={activeTrip} onClose={() => setActiveTrip(null)} />}
        </main>
    );
};

export default CalendarDashboard;
