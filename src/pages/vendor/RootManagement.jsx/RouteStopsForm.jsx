
import React, { useState } from 'react'
import {
    ArrowUp,
    ArrowDown,
    X,
    Plus,
    Map,
    MapPin,
    Bus
} from 'lucide-react'

const RouteStopsForm = ({ stops, setStops, onAddStop }) => {
    const [draggedId, setDraggedId] = useState(null)

    const handleStopChange = (id, value) => {
        setStops(stops.map(stop =>
            stop.id === id
                ? { ...stop, name: value }
                : stop
        ))
    }

    const addStop = () => {
        setStops([
            ...stops,
            {
                id: Date.now(),
                name: '',
                type: 'stop',
                location: ''
            }
        ])
    }

    const removeStop = (id) => {
        setStops(stops.filter(stop => stop.id !== id || stop.type === 'origin' || stop.type === 'destination'))
    }

    const moveStop = (index, direction) => {
        const newIndex = index + direction

        if (newIndex <= 0 || newIndex >= stops.length - 1 || stops[index]?.type !== 'stop') return

        const updatedStops = [...stops]

            ;[updatedStops[index], updatedStops[newIndex]] = [
                updatedStops[newIndex],
                updatedStops[index]
            ]

        setStops(updatedStops)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">

            {/* Route Sequence */}
            <div className="bg-white border border-[#E5EBEF] rounded-xl p-3">

                <p className="text-[9px] font-semibold text-[#0F766E]">
                    ROUTE SEQUENCE
                </p>

                <h2 className="text-sm font-semibold text-[#172033] mt-1">
                    {stops.length} ordered stops
                </h2>

                <p className="text-[10px] text-[#8191AA] mt-1 mb-4">
                    Use the arrow controls to update the sequence.
                </p>

                <div className="space-y-2">

                    {stops.map((stop, index) => (

                        <div
                            key={stop.id}
                            draggable={stop.type === 'stop'}
                            onDragStart={() => setDraggedId(stop.id)}
                            onDragEnd={() => setDraggedId(null)}
                            onDragOver={event => { if (draggedId && stop.type === 'stop') event.preventDefault() }}
                            onDrop={event => {
                                event.preventDefault()
                                if (!draggedId || draggedId === stop.id || stop.type !== 'stop') return
                                setStops(current => {
                                    const from = current.findIndex(item => item.id === draggedId)
                                    const to = current.findIndex(item => item.id === stop.id)
                                    if (from < 1 || to < 1 || from >= current.length - 1 || to >= current.length - 1) return current
                                    const updated = [...current]
                                    const [moved] = updated.splice(from, 1)
                                    updated.splice(to, 0, moved)
                                    return updated
                                })
                                setDraggedId(null)
                            }}
                            className={`relative flex items-center gap-3 rounded-lg border p-2 ${draggedId === stop.id ? 'opacity-50' : ''} ${index === 1
                                ? 'border-[#0F766E]'
                                : 'border-transparent'
                                }`}
                        >

                            {/* Stop Number */}
                            <div className="relative flex items-center justify-center w-8 shrink-0">

                                <div className="w-4 h-4 rounded-full border border-[#0D9488] bg-white text-[#0F766E] flex items-center justify-center text-[9px] z-10">
                                    {index + 1}
                                </div>

                                {index !== stops.length - 1 && (
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 h-12 border-l border-dashed border-[#CBD5E1]" />
                                )}

                            </div>

                            {/* Stop Details */}
                            <div className="flex-1 min-w-0">

                                <p className="text-[8px] font-semibold text-[#0F766E]">
                                    {index === 0
                                        ? 'ORIGIN'
                                        : index === stops.length - 1
                                            ? 'DESTINATION'
                                            : `STOP ${index + 1}`}
                                </p>

                                <input
                                    type="text"
                                    value={stop.name}
                                    readOnly={stop.type !== 'stop'}
                                    onChange={(e) =>
                                        handleStopChange(stop.id, e.target.value)
                                    }
                                    placeholder="Enter stop name"
                                    className={`w-full text-[10px] font-semibold text-[#172033] outline-none bg-transparent placeholder:font-normal placeholder:text-[#A0AEC0] ${stop.type !== 'stop' ? 'cursor-default' : ''}`}
                                />

                                <input
                                    type="text"
                                    value={stop.location}
                                    readOnly={stop.type !== 'stop'}
                                    onChange={(e) =>
                                        setStops(stops.map(item =>
                                            item.id === stop.id
                                                ? { ...item, location: e.target.value }
                                                : item
                                        ))
                                    }
                                    placeholder="Enter area or location"
                                    className={`w-full text-[9px] text-[#8191AA] outline-none bg-transparent placeholder:text-[#A0AEC0] ${stop.type !== 'stop' ? 'cursor-default' : ''}`}
                                />

                            </div>

                            {/* Stop Actions */}
                            <div className="flex items-center gap-1 shrink-0">

                                <button
                                    type="button"
                                    onClick={() => moveStop(index, -1)}
                                    disabled={index === 0 || index === stops.length - 1 || stop.type !== 'stop'}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F766E] disabled:opacity-30"
                                    title="Move up"
                                >
                                    <ArrowUp size={12} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => moveStop(index, 1)}
                                    disabled={index === stops.length - 1 || index === 0 || stop.type !== 'stop'}
                                    className="p-1 text-[#94A3B8] hover:text-[#0F766E] disabled:opacity-30"
                                    title="Move down"
                                >
                                    <ArrowDown size={12} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => removeStop(stop.id)}
                                    disabled={stop.type !== 'stop'}
                                    className="p-1 text-[#94A3B8] hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Remove stop"
                                >
                                    <X size={12} />
                                </button>

                            </div>

                        </div>
                    ))}

                </div>

                {/* Add Stop */}
                <button
                    type="button"
                    onClick={onAddStop || addStop}
                    className="w-full mt-3 border border-dashed border-[#5EEAD4] rounded-lg py-2 text-[10px] font-medium text-[#0F766E] hover:bg-[#F0FDFA] flex items-center justify-center gap-1"
                >
                    <Plus size={12} />
                    Add another stop
                </button>

            </div>

            {/* Route Overview */}
            <div className="bg-white border border-[#E5EBEF] rounded-xl overflow-hidden">

                <div className="flex items-center justify-between px-3 py-3">
                    <h2 className="flex items-center gap-2 text-[10px] font-semibold text-[#172033]">
                        <Map size={12} />
                        Route overview
                    </h2>

                    <span className="text-[8px] text-[#D97706] bg-[#FFFBEB] border border-[#FDE68A] rounded-sm px-1 py-0.5">
                        Map preview unavailable
                    </span>
                </div>

                {/* Map Placeholder */}
                <div className="relative min-h-[260px] h-full bg-[#F0F7F6] border-t-[6px] border-[#DDECE9] overflow-hidden">

                    {/* Map Grid */}
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute left-[20%] top-0 h-full w-3 bg-white/70 -rotate-6" />
                        <div className="absolute left-[60%] top-0 h-full w-5 bg-white/70 rotate-12" />
                        <div className="absolute left-0 top-[35%] w-full h-3 bg-white/70 -rotate-3" />
                        <div className="absolute left-0 top-[70%] w-full h-4 bg-white/70 rotate-2" />
                    </div>

                    {/* Stop Markers */}
                    {stops.map((stop, index) => {

                        const positions = [
                            { top: '12%', left: '20%' },
                            { top: '35%', left: '82%' },
                            { top: '60%', left: '25%' },
                            { top: '78%', left: '70%' },
                            { top: '45%', left: '50%' }
                        ]

                        const position = positions[index % positions.length]

                        return (
                            <div
                                key={stop.id}
                                style={position}
                                className="absolute z-10"
                                title={stop.name}
                            >
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white shadow-sm ${index === 1
                                    ? 'bg-orange-500'
                                    : 'bg-[#065F46]'
                                    }`}>
                                    {index === 0
                                        ? <MapPin size={11} />
                                        : <span className="text-[9px] font-semibold">{index + 1}</span>
                                    }
                                </div>
                            </div>
                        )
                    })}

                    {/* Verification Message */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] max-w-[220px] bg-white rounded-xl shadow-lg p-4 text-center z-20">

                        <div className="w-8 h-8 mx-auto rounded-lg bg-[#F0FDFA] flex items-center justify-center text-[#0F766E]">
                            <Bus size={15} />
                        </div>

                        <h3 className="text-[10px] font-semibold text-[#172033] mt-2">
                            Verified map data isn't connected
                        </h3>

                        <p className="text-[9px] leading-4 text-[#8191AA] mt-1">
                            Your ordered stop labels remain fully functional.
                            A mapped road will appear when verified routing data is available.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default RouteStopsForm
