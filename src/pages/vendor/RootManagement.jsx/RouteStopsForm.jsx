
import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import L from 'leaflet'
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import {
    ArrowUp,
    ArrowDown,
    X,
    Plus,
    Map as MapIcon
} from 'lucide-react'

const geocodeCache = new Map()
let lastGeocodeRequestAt = 0

const wait = (milliseconds, signal) => new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, milliseconds)
    signal.addEventListener('abort', () => {
        clearTimeout(timeout)
        reject(new DOMException('Aborted', 'AbortError'))
    }, { once: true })
})

const resolveStop = async (stop, signal) => {
    if (stop.locationVerified && Number.isFinite(Number(stop.latitude)) && Number.isFinite(Number(stop.longitude))) {
        return { lat: Number(stop.latitude), lng: Number(stop.longitude), label: stop.location || '' }
    }
    const name = (stop.name || '').trim()
    const location = (stop.location || '').trim()
    const query = [name, location].filter((part, index, parts) => part && parts.indexOf(part) === index).join(', ')
    if (!query) throw new Error(`Stop ${stop.id} needs a name or location.`)

    const cacheKey = query.toLocaleLowerCase()
    if (geocodeCache.has(cacheKey)) return geocodeCache.get(cacheKey)

    const remainingDelay = Math.max(0, 1100 - (Date.now() - lastGeocodeRequestAt))
    if (remainingDelay) await wait(remainingDelay, signal)
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError')

    const params = new URLSearchParams({ q: `${query}, Tamil Nadu, India`, format: 'jsonv2', limit: '3', addressdetails: '1' })
    lastGeocodeRequestAt = Date.now()
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
        signal: AbortSignal.any([signal, AbortSignal.timeout(12000)]),
        headers: { Accept: 'application/json' }
    })
    if (!response.ok) throw new Error('Location lookup is temporarily unavailable.')
    const results = await response.json()
    if (!Array.isArray(results) || results.length === 0) {
        throw new Error(`Could not find a map location for “${name || location}”. Check the stop name or location.`)
    }

    // Nominatim returns its most relevant result first. Use that actual result, never a guessed coordinate.
    const result = results[0]
    const coordinates = { lat: Number(result.lat), lng: Number(result.lon), label: result.display_name }
    if (!Number.isFinite(coordinates.lat) || !Number.isFinite(coordinates.lng)) {
        throw new Error(`The map location for “${name || location}” was invalid.`)
    }
    geocodeCache.set(cacheKey, coordinates)
    return coordinates
}

const createStopIcon = (index, type) => {
    const color = type === 'origin' ? '#0F766E' : type === 'destination' ? '#115E59' : '#0D9488'
    return L.divIcon({
        className: '',
        html: `<div style="width:26px;height:26px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 5px #0005;color:white;font:600 12px/22px sans-serif;text-align:center">${index + 1}</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
    })
}

const RouteBounds = ({ coordinates, geometry }) => {
    const map = useMap()
    useEffect(() => {
        map.invalidateSize()
        const points = geometry?.length ? geometry : coordinates.map(({ lat, lng }) => [lat, lng])
        if (points.length) map.fitBounds(L.latLngBounds(points), { padding: [28, 28], maxZoom: 13 })
    }, [map, coordinates, geometry])
    return null
}

const StopNameAutocomplete = ({ stop, onEdit, onSelect }) => {
    const [search, setSearch] = useState({ status: 'idle', results: [], message: '' })
    const [activeIndex, setActiveIndex] = useState(-1)
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = React.useRef(null)
    const inputRef = React.useRef(null)
    const dropdownRef = React.useRef(null)
    const [dropdownStyle, setDropdownStyle] = useState(null)
    const apiKey = import.meta.env.VITE_LOCATIONIQ

    useEffect(() => {
        const query = (stop.name || '').trim()
        if (stop.type !== 'stop' || query.length < 3 || stop.locationVerified) {
            setSearch({ status: 'idle', results: [], message: '' })
            return undefined
        }

        const controller = new AbortController()
        setSearch({ status: apiKey ? 'loading' : 'error', results: [], message: apiKey ? '' : 'Location search is not configured.' })
        const timer = setTimeout(async () => {
            if (!apiKey) return
            try {
                const params = new URLSearchParams({ key: apiKey, q: query, countrycodes: 'in', limit: '6', dedupe: '1', normalizecity: '1' })
                const response = await fetch(`https://api.locationiq.com/v1/autocomplete?${params}`, { signal: controller.signal })
                if (!response.ok) {
                    const message = response.status === 429
                        ? 'Location search limit reached. Please wait and try again.'
                        : 'Location search is temporarily unavailable.'
                    throw new Error(message)
                }
                const data = await response.json()
                if (!Array.isArray(data)) throw new Error('Location search returned an invalid response.')
                if (!controller.signal.aborted) {
                    setSearch({ status: data.length ? 'results' : 'empty', results: data, message: '' })
                    setActiveIndex(-1)
                }
            } catch (error) {
                if (controller.signal.aborted || error.name === 'AbortError') return
                setSearch({ status: 'error', results: [], message: error.message || 'Location search failed.' })
            }
        }, 400)

        return () => {
            clearTimeout(timer)
            controller.abort()
        }
    }, [stop.id, stop.name, stop.type, stop.locationVerified, apiKey])

    useEffect(() => {
        if (!isOpen) return undefined
        const closeWhenOutside = event => {
            if (!containerRef.current?.contains(event.target) && !dropdownRef.current?.contains(event.target)) setIsOpen(false)
        }
        document.addEventListener('mousedown', closeWhenOutside)
        return () => document.removeEventListener('mousedown', closeWhenOutside)
    }, [isOpen])

    const showDropdown = isOpen && stop.type === 'stop' && (stop.name || '').trim().length >= 3 && search.status !== 'idle'
    useEffect(() => {
        if (!showDropdown) return undefined
        const placeDropdown = () => {
            const input = inputRef.current
            if (!input) return
            const rect = input.getBoundingClientRect()
            const width = Math.min(rect.width, window.innerWidth - 16)
            const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8))
            const dropdownHeight = 196
            const roomBelow = window.innerHeight - rect.bottom
            const top = roomBelow < dropdownHeight && rect.top > roomBelow
                ? Math.max(8, rect.top - dropdownHeight)
                : Math.min(window.innerHeight - dropdownHeight - 8, rect.bottom + 4)
            setDropdownStyle({ position: 'fixed', left, top, width, zIndex: 2000 })
        }
        placeDropdown()
        window.addEventListener('resize', placeDropdown)
        window.addEventListener('scroll', placeDropdown, true)
        return () => {
            window.removeEventListener('resize', placeDropdown)
            window.removeEventListener('scroll', placeDropdown, true)
        }
    }, [showDropdown, search.status, search.results.length])

    const choose = result => {
        const latitude = Number(result.lat)
        const longitude = Number(result.lon)
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            setSearch({ status: 'error', results: [], message: 'This result did not include valid coordinates.' })
            return
        }
        onSelect({
            name: result.display_place || result.name || result.display_name,
            location: result.display_address || result.display_name,
            latitude,
            longitude,
            placeId: result.place_id == null ? undefined : String(result.place_id),
            locationVerified: true
        })
        setIsOpen(false)
        setSearch({ status: 'idle', results: [], message: '' })
    }

    const handleKeyDown = event => {
        if (event.key === 'Escape') {
            setIsOpen(false)
            setActiveIndex(-1)
        } else if (event.key === 'ArrowDown' && search.results.length) {
            event.preventDefault()
            setIsOpen(true)
            setActiveIndex(current => (current + 1) % search.results.length)
        } else if (event.key === 'ArrowUp' && search.results.length) {
            event.preventDefault()
            setIsOpen(true)
            setActiveIndex(current => (current - 1 + search.results.length) % search.results.length)
        } else if (event.key === 'Enter' && isOpen && activeIndex >= 0) {
            event.preventDefault()
            choose(search.results[activeIndex])
        }
    }

    return (
        <div ref={containerRef} className="relative w-full min-w-0">
            <input
                ref={inputRef}
                type="text"
                value={stop.name || ''}
                readOnly={stop.type !== 'stop'}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
                onChange={event => {
                    onEdit(event.target.value)
                    setIsOpen(true)
                }}
                placeholder="Enter stop name"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={showDropdown}
                aria-controls={`stop-suggestions-${stop.id}`}
                className={`w-full text-[10px] font-semibold text-[#172033] outline-none bg-transparent placeholder:font-normal placeholder:text-[#A0AEC0] ${stop.type !== 'stop' ? 'cursor-default' : ''}`}
            />
            {showDropdown && dropdownStyle && createPortal(
                <div ref={dropdownRef} id={`stop-suggestions-${stop.id}`} role="listbox" style={dropdownStyle} className="max-h-48 overflow-y-auto rounded-lg border border-[#D8E4E6] bg-white py-1 shadow-xl">
                    {search.status === 'loading' && <p role="status" className="px-3 py-2 text-[9px] text-[#8191AA]">Searching locations…</p>}
                    {search.status === 'empty' && <p className="px-3 py-2 text-[9px] text-[#8191AA]">No locations found in India.</p>}
                    {search.status === 'error' && <p role="alert" className="px-3 py-2 text-[9px] text-red-700">{search.message}</p>}
                    {search.results.map((result, index) => (
                        <button
                            type="button"
                            role="option"
                            aria-selected={activeIndex === index}
                            key={`${result.place_id || result.osm_id || result.display_name}-${index}`}
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseDown={event => {
                                event.preventDefault()
                                event.stopPropagation()
                            }}
                            onDragStart={event => event.preventDefault()}
                            onClick={() => choose(result)}
                            className={`block w-full px-3 py-2 text-left hover:bg-[#F0FDFA] ${activeIndex === index ? 'bg-[#F0FDFA]' : ''}`}
                        >
                            <span className="block truncate text-[10px] font-semibold text-[#172033]">{result.display_place || result.name || result.display_name}</span>
                            <span className="mt-0.5 block truncate text-[9px] text-[#8191AA]">{result.display_address || result.display_name}</span>
                        </button>
                    ))}
                </div>,
                document.body
            )}
        </div>
    )
}

const RouteStopsForm = ({ stops, setStops, onAddStop }) => {
    const [draggedId, setDraggedId] = useState(null)
    const [mapState, setMapState] = useState({ status: 'idle', message: '', coordinates: [], geometry: [] })
    const stopsKey = useMemo(() => JSON.stringify(stops.map(stop => {
        if (stop.type === 'stop') {
            const verified = stop.locationVerified === true && Number.isFinite(Number(stop.latitude)) && Number.isFinite(Number(stop.longitude))
            return verified
                ? { id: stop.id, type: stop.type, locationVerified: true, latitude: Number(stop.latitude), longitude: Number(stop.longitude), placeId: stop.placeId }
                : { id: stop.id, type: stop.type, locationVerified: false }
        }
        return { id: stop.id, name: stop.name, location: stop.location, type: stop.type }
    })), [stops])

    useEffect(() => {
        const controller = new AbortController()
        const currentStops = stops.map(stop => ({ ...stop }))
        setMapState({ status: 'loading', message: 'Resolving stop locations…', coordinates: [], geometry: [] })

        const unconfirmedStop = currentStops.find(stop => stop.type === 'stop' && !(stop.locationVerified === true && Number.isFinite(Number(stop.latitude)) && Number.isFinite(Number(stop.longitude))))
        if (unconfirmedStop) {
            setMapState({ status: 'error', message: `Select a location suggestion for “${unconfirmedStop.name || 'this stop'}” before calculating the route.`, coordinates: [], geometry: [] })
            return () => controller.abort()
        }

        const timer = setTimeout(async () => {
            try {
                const coordinates = []
                for (const stop of currentStops) {
                    coordinates.push({ stop, ...await resolveStop(stop, controller.signal) })
                }

                if (controller.signal.aborted) return
                if (coordinates.length < 2) {
                    setMapState({ status: 'insufficient', message: 'Add at least two valid stops to calculate a road route.', coordinates, geometry: [] })
                    return
                }

                setMapState({ status: 'loading', message: 'Calculating road route…', coordinates, geometry: [] })
                const coordinateList = coordinates.map(({ lat, lng }) => `${lng},${lat}`).join(';')
                const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordinateList}?overview=full&geometries=geojson&steps=false`, {
                    signal: AbortSignal.any([controller.signal, AbortSignal.timeout(20000)])
                })
                if (!response.ok) throw new Error('The road routing service is temporarily unavailable.')
                const data = await response.json()
                const route = data?.routes?.[0]?.geometry?.coordinates
                if (data.code !== 'Ok' || !Array.isArray(route) || route.length < 2 || route.some(point => !Array.isArray(point) || point.length < 2 || !Number.isFinite(point[0]) || !Number.isFinite(point[1]))) {
                    throw new Error('A road route could not be calculated for these stops.')
                }
                if (!controller.signal.aborted) setMapState({ status: 'ready', message: '', coordinates, geometry: route.map(([lng, lat]) => [lat, lng]) })
            } catch (error) {
                if (controller.signal.aborted || error.name === 'AbortError') return
                const message = error.name === 'TimeoutError'
                    ? 'The map service took too long to respond. Please try again.'
                    : error.message || 'Could not load this route. Please check the stop locations and try again.'
                setMapState({ status: 'error', message, coordinates: [], geometry: [] })
            }
        }, 700)

        return () => {
            clearTimeout(timer)
            controller.abort()
        }
    }, [stops, stopsKey])

    const handleStopChange = (id, value) => {
        setStops(current => current.map(stop => stop.id === id
            ? { ...stop, name: value, location: '', latitude: undefined, longitude: undefined, placeId: undefined, locationVerified: false }
            : stop))
    }

    const handleLocationSelect = (id, selection) => {
        setStops(current => current.map(stop => stop.id === id ? { ...stop, ...selection } : stop))
    }

    const addStop = () => {
        setStops(current => [
            ...current,
            {
                id: `stop-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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

                                <StopNameAutocomplete
                                    stop={stop}
                                    onEdit={value => handleStopChange(stop.id, value)}
                                    onSelect={selection => handleLocationSelect(stop.id, selection)}
                                />

                                <input
                                    type="text"
                                    value={stop.location || ''}
                                    readOnly={stop.type !== 'stop'}
                                    onChange={event => setStops(current => current.map(item => item.id === stop.id
                                        ? { ...item, location: event.target.value, latitude: undefined, longitude: undefined, placeId: undefined, locationVerified: false }
                                        : item))}
                                    placeholder="Enter area or location"
                                    className={`w-full text-[9px] text-[#8191AA] outline-none bg-transparent placeholder:text-[#A0AEC0] ${stop.type !== 'stop' ? 'cursor-default' : ''}`}
                                />
                                {stop.type === 'stop' && (
                                    <p className={`text-[8px] mt-0.5 ${stop.locationVerified ? 'text-[#0F766E]' : 'text-[#B45309]'}`}>
                                        {stop.locationVerified ? 'Selected location confirmed' : 'Choose a search suggestion to confirm this stop'}
                                    </p>
                                )}

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
                    Add stop
                </button>

            </div>

            {/* Route Overview */}
            <div className="bg-white border border-[#E5EBEF] rounded-xl overflow-hidden">

                <div className="flex items-center justify-between px-3 py-3">
                    <h2 className="flex items-center gap-2 text-[10px] font-semibold text-[#172033]">
                        <MapIcon size={12} />
                        Route overview
                    </h2>

                    <span className={`text-[8px] rounded-sm px-1 py-0.5 ${mapState.status === 'error' ? 'text-red-700 bg-red-50 border border-red-200' : mapState.status === 'ready' ? 'text-[#0F766E] bg-[#F0FDFA] border border-[#99F6E4]' : 'text-[#D97706] bg-[#FFFBEB] border border-[#FDE68A]'}`}>
                        {mapState.status === 'ready' ? 'Road route' : mapState.status === 'loading' ? 'Loading map…' : 'Route status'}
                    </span>
                </div>

                <div className="relative min-h-[260px] h-[320px] w-full bg-[#F0F7F6] border-t-[6px] border-[#DDECE9] overflow-hidden">
                    {mapState.coordinates.length > 0 ? (
                        <MapContainer
                            center={[mapState.coordinates[0].lat, mapState.coordinates[0].lng]}
                            zoom={7}
                            scrollWheelZoom
                            className="h-full w-full"
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {mapState.geometry.length > 0 && <Polyline positions={mapState.geometry} pathOptions={{ color: '#0F766E', weight: 5, opacity: 0.85 }} />}
                            {mapState.coordinates.map(({ stop, lat, lng, label }, index) => (
                                <Marker key={`${stop.id}-${index}`} position={[lat, lng]} icon={createStopIcon(index, stop.type)}>
                                    <Popup>
                                        <strong>{index + 1}. {stop.name || stop.location}</strong><br />
                                        {stop.type === 'origin' ? 'Origin' : stop.type === 'destination' ? 'Destination' : 'Stop'}
                                        {(stop.location || label) && <><br />{stop.location || label}</>}
                                    </Popup>
                                </Marker>
                            ))}
                            <RouteBounds coordinates={mapState.coordinates} geometry={mapState.geometry} />
                        </MapContainer>
                    ) : (
                        <div className="h-full w-full" />
                    )}
                    {mapState.status !== 'ready' && (
                        <div role={mapState.status === 'error' ? 'alert' : 'status'} aria-live="polite" className="absolute bottom-3 left-1/2 z-[1000] -translate-x-1/2 rounded-lg bg-white/95 px-3 py-2 text-center text-[10px] text-[#52616B] shadow-md max-w-[90%]">
                            {mapState.message || 'Enter stop names and locations to preview the route.'}
                        </div>
                    )}
                </div>

            </div>

        </div>
    )
}

export default RouteStopsForm
