import { ArrowLeftRight, Circle, Map, MapPin, Navigation, Pencil, Route, Users } from "lucide-react";

function SectionHeader({ icon: Icon, title, onEdit }) {
    return (
        <div className="flex items-center justify-between border-b border-slate-100 px-3 py-3">
            <div className="flex items-center gap-2">
                <Icon size={14} className="text-teal-700" />
                <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
            </div>
            <button type="button" onClick={onEdit} className="flex cursor-pointer items-center gap-1 text-[12px] font-medium text-teal-700 hover:text-teal-900">
                <Pencil size={10} /> Edit
            </button>
        </div>
    );
}

function RouteDetails({ formData, stops, onEdit }) {
    const origin = stops.find(stop => stop.type === "origin") || stops[0];
    const destination = [...stops].reverse().find(stop => stop.type === "destination") || stops[stops.length - 1];
    return (
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
            <SectionHeader icon={ArrowLeftRight} title="Route details" onEdit={onEdit} />
            <div className="p-3">
                <div className="relative grid grid-cols-2 gap-3 pb-3">
                    <div className="absolute left-8 right-8 top-4 border-t border-slate-200" />
                    {[{ label: "Origin", value: formData.originCity, stop: origin, initial: "O" }, { label: "Destination", value: formData.destinationCity, stop: destination, initial: "D" }].map((point, index) => (
                        <div key={point.label} className="relative flex min-w-0 items-start gap-2">
                            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${index === 0 ? "bg-teal-700 text-white" : "border border-teal-600 bg-white text-teal-700"}`}>
                                {index === 0 ? point.initial : <Circle size={10} />}
                            </div>
                            <div className="min-w-0">
                                <p className="text-[9px] text-slate-400">{point.label}</p>
                                <p className="mt-2 truncate text-[11px] font-semibold text-slate-800">{point.value || point.stop?.name || "Not set"}</p>
                                <p className="mt-0.5 truncate text-[10px] text-slate-400">{point.stop?.location || point.stop?.name || ""}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex min-w-0 items-start gap-2 sm:border-r sm:border-slate-100 sm:pr-2">
                        <MapPin size={12} className="mt-0.5 shrink-0 text-teal-700" />
                        <div className="min-w-0"><p className="break-words text-[11px] font-medium text-slate-700">{formData.routeName || "Not set"}</p><p className="mt-0.5 text-[10px] text-slate-400">Route name</p></div>
                    </div>
                    <div className="flex items-start gap-2 sm:border-r sm:border-slate-100 sm:px-2">
                        <Map size={12} className="mt-0.5 shrink-0 text-teal-700" />
                        <div><p className="text-[11px] font-medium text-slate-700">{formData.routeCategory || "Not set"}</p><p className="mt-0.5 text-[10px] text-slate-400">Route category</p></div>
                    </div>
                    <div className="flex min-w-0 items-start gap-2 sm:pl-2">
                        <Navigation size={12} className="mt-0.5 shrink-0 text-teal-700" />
                        <div className="min-w-0"><p className="break-words text-[11px] font-medium text-slate-700">{formData.description || "No description"}</p><p className="mt-0.5 text-[10px] text-slate-400">Description</p></div>
                    </div>
                    <div className="flex items-start gap-2"><Map size={12} className="mt-0.5 shrink-0 text-teal-700" /><div><p className="text-[11px] font-medium text-slate-700">{formData.estimatedDistance !== "" && formData.estimatedDistance != null && Number.isFinite(Number(formData.estimatedDistance)) ? `${Number(formData.estimatedDistance).toFixed(2)} km` : "—"}</p><p className="mt-0.5 text-[10px] text-slate-400">Estimated distance</p></div></div>
                    <div className="flex items-start gap-2"><Route size={12} className="mt-0.5 shrink-0 text-teal-700" /><div><p className="text-[11px] font-medium text-slate-700">{formData.estimatedDurationMinutes !== "" && formData.estimatedDurationMinutes != null && Number.isFinite(Number(formData.estimatedDurationMinutes)) ? `${(Number(formData.estimatedDurationMinutes) / 60).toFixed(2)} hours` : "—"}</p><p className="mt-0.5 text-[10px] text-slate-400">Estimated duration</p></div></div>
                </div>
            </div>
        </div>
    );
}

function BoardingDropping({ stops, permissions, onEdit }) {
    const boardingStops = stops.filter(stop => permissions[stop.id]?.boarding);
    const droppingStops = stops.filter(stop => permissions[stop.id]?.dropping);
    const renderStops = (items, label, color) => items.length ? items.map(stop => (
        <div key={stop.id} className="flex min-h-[28px] items-center justify-between gap-2 rounded px-1.5 py-1 hover:bg-slate-50">
            <span className="min-w-0 truncate text-[12px] text-slate-700">{stop.name || "Unnamed stop"}</span>
            <span className={`shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-medium ${color}`}>{label}</span>
        </div>
    )) : <p className="px-1.5 py-2 text-[11px] text-slate-400">No stops selected</p>;

    return (
        <div className="flex min-h-[180px] flex-col overflow-hidden rounded-md border border-slate-200 bg-white">
            <SectionHeader icon={Users} title="Boarding & dropping" onEdit={onEdit} />
            <div className="grid flex-1 grid-cols-2">
                <div className="border-r border-slate-200 p-2"><p className="px-1.5 pb-1 text-[10px] font-semibold uppercase text-slate-400">Boarding points</p>{renderStops(boardingStops, "Boarding", "bg-emerald-50 text-emerald-700")}</div>
                <div className="p-2"><p className="px-1.5 pb-1 text-[10px] font-semibold uppercase text-slate-400">Dropping points</p>{renderStops(droppingStops, "Dropping", "bg-orange-50 text-orange-700")}</div>
            </div>``
        </div>
    );
}

function RouteSequence({ stops, onEdit }) {
    return (
        <div className="flex flex-1 min-h-0 flex-col overflow-hidden rounded-md border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-3 py-3">
                <div><p className="text-[12px] font-bold uppercase tracking-wide text-teal-700">Route sequence</p><h2 className="mt-1 text-[11px] font-semibold text-slate-800">{stops.length} ordered {stops.length === 1 ? "stop" : "stops"}</h2><p className="mt-1 text-[9px] text-slate-400">Stops in travel order.</p></div>
                <button type="button" onClick={onEdit} className="flex items-center gap-1 text-[12px] font-medium text-teal-700 hover:text-teal-900"><Pencil size={10} /> Edit</button>
            </div>
            <div className="flex-1 min-h-0 space-y-1.5 overflow-y-auto p-2">
                {stops.map((stop, index) => (
                    <div key={stop.id} className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-2">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-[9px] font-semibold text-teal-700">{index + 1}</div>
                        <div className="min-w-0 flex-1"><p className="text-[9px] font-medium uppercase tracking-wide text-slate-400">{stop.type === "origin" ? "Origin" : stop.type === "destination" ? "Destination" : `Stop ${index}`}</p><p className="truncate text-[12px] font-semibold text-slate-800">{stop.name || "Unnamed stop"}</p><p className="truncate text-[11px] text-slate-400">{stop.location || "Location not set"}</p></div>
                    </div>
                ))}
                {!stops.length && <p className="p-3 text-center text-xs text-slate-400">No stops added.</p>}
            </div>
        </div>
    );
}

export default function RouteReview({ formData = {}, stops = [], permissions = {}, onEditStep = () => { } }) {
    return (
        <div>
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)]">
                <div className="flex min-w-0 flex-col gap-3">
                    <RouteDetails formData={formData} stops={stops} onEdit={() => onEditStep(1)} />
                    <BoardingDropping stops={stops} permissions={permissions} onEdit={() => onEditStep(3)} />
                </div>
                <div className="flex min-w-0 min-h-0">
                    <RouteSequence stops={stops} onEdit={() => onEditStep(2)} />
                </div>
            </div>
        </div>
    );
}
