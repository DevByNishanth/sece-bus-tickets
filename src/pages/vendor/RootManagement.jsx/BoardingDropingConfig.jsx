import { ArrowRight } from "lucide-react";
import React from "react";

const checkboxClass = "h-4 w-4 cursor-pointer accent-teal-700 align-middle focus:outline-none focus:ring-2 focus:ring-teal-500/30";

export default function BoardingDroppingConfig({
    stops = [],
    permissions = {},
    onPermissionsChange = () => {},
    originCity,
    destinationCity,
}) {
    const togglePermission = (stopId, permission) => {
        onPermissionsChange(current => {
            const row = current[stopId] || {};
            const enabled = !row[permission];
            return {
                ...current,
                [stopId]: {
                    boarding: permission === "boarding" ? enabled : (enabled ? false : Boolean(row.boarding)),
                    dropping: permission === "dropping" ? enabled : (enabled ? false : Boolean(row.dropping)),
                },
            };
        });
    };

    const boardingCount = stops.filter(stop => permissions[stop.id]?.boarding).length;
    const droppingCount = stops.filter(stop => permissions[stop.id]?.dropping).length;
    const stats = [
        { value: stops.length, label: "Total stops" },
        { value: boardingCount, label: "Boarding enabled" },
        { value: droppingCount, label: "Dropping enabled" },
    ];

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex justify-between border-b border-slate-100 pb-4">
                <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">Select Points</p>
                    <h2 className="text-lg font-semibold text-slate-800">Configure boarding and dropping</h2>
                    <p className="mt-1 text-xs text-slate-500">Choose whether passengers can board or get off at each stop.</p>
                </div>
                <div className="flex flex-col items-end">
                    <div className="mb-2 flex items-center gap-2 text-sm text-gray-800">
                        <p>{originCity || "Origin"}</p>
                        <ArrowRight size={14} className="text-emerald-600" />
                        <p>{destinationCity || "Destination"}</p>
                    </div>
                    <div className="w-full rounded-lg border border-[#95d3b3]/30 bg-[#D1FAE5]/5 px-4 py-2">
                        <div className="grid grid-cols-3 gap-3 divide-x divide-slate-200">
                            {stats.map(stat => (
                                <div key={stat.label} className="flex flex-col items-center justify-center px-2">
                                    <div className="text-lg font-medium leading-tight text-slate-800">{stat.value}</div>
                                    <div className="mt-1 whitespace-nowrap text-xs text-slate-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-h-[calc(100vh-440px)] w-full overflow-x-auto overflow-y-auto custom-scroll">
                <table className="w-full min-w-[500px] border-collapse text-left">
                    <thead className="sticky top-0">
                        <tr className="bg-slate-50 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            <th className="rounded-l-md px-3 py-3">Stop</th>
                            <th className="px-3 py-3">Sequence</th>
                            <th className="px-3 py-3 text-center">Boarding</th>
                            <th className="rounded-r-md px-3 py-3 text-center">Dropping</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stops.map((stop, index) => {
                            const stopPermissions = permissions[stop.id] || {};
                            const sequence = stop.type === "origin"
                                ? "Origin"
                                : stop.type === "destination"
                                    ? "Destination"
                                    : `Stop ${index}`;
                            return (
                                <tr key={stop.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70">
                                    <td className="px-3 py-3">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-teal-500 text-xs font-medium text-teal-700">{index + 1}</span>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-700">{stop.name}</p>
                                                <p className="mt-0.5 text-[10px] text-slate-400">{stop.location || stop.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3"><span className="text-xs text-slate-500">{sequence}</span></td>
                                    <td className="px-3 py-3 text-center">
                                        <input type="checkbox" checked={Boolean(stopPermissions.boarding)} onChange={() => togglePermission(stop.id, "boarding")} aria-label={`Boarding at ${stop.name}`} className={checkboxClass} />
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                        <input type="checkbox" checked={Boolean(stopPermissions.dropping)} onChange={() => togglePermission(stop.id, "dropping")} aria-label={`Dropping at ${stop.name}`} className={checkboxClass} />
                                    </td>
                                </tr>
                            );
                        })}
                        {stops.length === 0 && <tr><td colSpan={4} className="px-3 py-8 text-center text-xs text-slate-500">Add stops in the previous step to configure boarding and dropping.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
