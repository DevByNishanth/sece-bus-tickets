import React, { useEffect, useState } from 'react'
import VendorNavbar from '../VendorNavbar'
import RouteStepper from './RouteStepper'
import RouteDetailsForm from './RouteDetailsForm'
import RouteStopsForm from './RouteStopsForm'
import { ArrowLeft, ArrowRight, Search, X } from 'lucide-react'

const AddRoutepage = () => {

    const [activeStep, setActiveStep] = useState(1)

    // Step 1 form data
    const [formData, setFormData] = useState({
        originCity: 'Madurai',
        destinationCity: 'Coimbatore',
        routeName: 'Madurai to Coimbatore — Via Dindigul',
        routeCategory: 'Intercity',
        internalDescription: ''
    })

    // Step 2 form data
    const [stops, setStops] = useState([
        {
            id: 1,
            name: 'Madurai',
            location: 'Madurai',
            type: 'origin'
        },
        {
            id: 2,
            name: 'Coimbatore',
            location: 'Coimbatore',
            type: 'destination'
        }
    ])
    const [isStopDrawerOpen, setIsStopDrawerOpen] = useState(false)

    // The city pair always anchors the sequence; only the stops between them are editable.
    useEffect(() => {
        setStops(current => {
            const origin = current.find(stop => stop.type === 'origin')
            const destination = current.find(stop => stop.type === 'destination')
            const middleStops = current.filter(stop => stop.type !== 'origin' && stop.type !== 'destination')
            return [
                { id: origin?.id ?? `origin-${formData.originCity}`, name: formData.originCity || 'Origin', location: formData.originCity, type: 'origin' },
                ...middleStops,
                { id: destination?.id ?? `destination-${formData.destinationCity}`, name: formData.destinationCity || 'Destination', location: formData.destinationCity, type: 'destination' }
            ]
        })
    }, [formData.originCity, formData.destinationCity])

    const addCatalogStop = (stop) => {
        setStops(current => {
            if (current.some(item => (stop.placeId && item.placeId === stop.placeId) || item.name?.toLowerCase() === stop.name?.toLowerCase())) return current
            const destinationIndex = current.findIndex(item => item.type === 'destination')
            const updated = [...current]
            updated.splice(destinationIndex < 0 ? updated.length : destinationIndex, 0, { ...stop, id: `stop-${Date.now()}-${Math.random()}`, type: 'stop' })
            return updated
        })
    }

    const handleContinue = () => {
        if (activeStep < 4) {
            setActiveStep(activeStep + 1)
        }
    }

    const handleBack = () => {
        if (activeStep > 1) {
            setActiveStep(activeStep - 1)
        }
    }

    const handleSaveDraft = () => {
        const routeData = {
            ...formData,
            stops
        }

        console.log('Route draft:', routeData)
    }

    return (
        <div className="main-container py-3 bg-[#F7F9FA] min-h-screen pb-24">

            <VendorNavbar />

            <div className="content-container w-[94%] mt-3 m-auto">

                {/* Page Header */}
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="font-medium text-xl">
                            Create a new Route
                        </h1>

                        <p className="text-[#627B77] mt-1 text-sm">
                            Set up route details, stops, and passenger permissions.
                        </p>
                    </div>
                </header>

                {/* Stepper */}
                <div className="stepper-container mt-3">
                    <RouteStepper activeStep={activeStep} />
                </div>

                {/* Forms Rendered Based on Step */}
                <div className="form-container mt-3">

                    {activeStep === 1 && (
                        <RouteDetailsForm
                            formData={formData}
                            setFormData={setFormData}
                        />
                    )}

                    {activeStep === 2 && (
                        <RouteStopsForm
                            stops={stops}
                            setStops={setStops}
                            onAddStop={() => setIsStopDrawerOpen(true)}
                        />
                    )}

                    {activeStep === 3 && (
                        <div className="bg-white border border-[#E5EBEF] rounded-xl p-5">
                            <h2 className="text-sm font-semibold">
                                Boarding & Dropping
                            </h2>

                            <p className="text-xs text-gray-500 mt-2">
                                This step will be implemented next.
                            </p>
                        </div>
                    )}

                    {activeStep === 4 && (
                        <div className="bg-white border border-[#E5EBEF] rounded-xl p-5">
                            <h2 className="text-sm font-semibold">
                                Review & Publish
                            </h2>

                            <p className="text-xs text-gray-500 mt-2">
                                Review your route details before publishing.
                            </p>
                        </div>
                    )}

                </div>

            </div>

            {isStopDrawerOpen && (
                <StopSearchDrawer
                    stops={stops}
                    onAddStop={stop => {
                        addCatalogStop(stop)
                        setIsStopDrawerOpen(false)
                    }}
                    onClose={() => setIsStopDrawerOpen(false)}
                />
            )}

            {/* Bottom Action Bar */}
            <div className="save-continue-btn-container flex items-center justify-between gap-3 px-4 sm:px-10 bg-white border-t border-[#E5EBEF] fixed bottom-0 py-3 w-full z-30">

                <div className="first-container flex items-center gap-3 sm:gap-4">

                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={activeStep === 1}
                        className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-black disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                    >
                        <ArrowLeft size={15} />
                        Back
                    </button>

                    <button
                        type="button"
                        onClick={handleSaveDraft}
                        className="cursor-pointer border border-gray-200 rounded-lg hover:bg-gray-100 py-2 px-3 sm:px-4 text-xs sm:text-sm"
                    >
                        Save Draft
                    </button>

                </div>

                <button
                    type="button"
                    onClick={handleContinue}
                    disabled={activeStep === 4}
                    className="bg-[#115E59] text-white flex items-center gap-2 rounded-lg py-2 px-3 sm:px-4 text-xs sm:text-sm cursor-pointer hover:bg-[#04504b] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {activeStep === 1
                        ? 'Continue to Stops'
                        : activeStep === 2
                            ? 'Continue to Boarding'
                            : 'Review Route'
                    }

                    <ArrowRight size={16} />
                </button>

            </div>

        </div>
    )
}

const stopCatalog = [
    { id: 'catalog-salem', name: 'Salem', location: 'Salem · Meyyanur, Salem, Tamil Nadu', city: 'Salem' },
    { id: 'catalog-tiruppur', name: 'Tiruppur', location: 'Tiruppur · Kumaran Road, Tiruppur', city: 'Tiruppur' },
    { id: 'catalog-dindigul', name: 'Dindigul', location: 'Dindigul · Central bus bay', city: 'Dindigul' },
    { id: 'catalog-trichy', name: 'Trichy Central Bus Stand', location: 'Tiruchirappalli · Central bus stand', city: 'Trichy' },
    { id: 'catalog-madurai', name: 'Madurai Main Bus Stand', location: 'Madurai · Near MGR Bus Terminus', city: 'Madurai' },
    { id: 'catalog-coimbatore', name: 'Coimbatore Omni Bus Stand', location: 'Coimbatore · Near Omni Bus Bay', city: 'Coimbatore' }
]

function StopSearchDrawer({ stops, onAddStop, onClose }) {
    const [query, setQuery] = useState('')
    const [search, setSearch] = useState({ status: 'idle', results: [], message: '' })
    const normalizedQuery = query.trim()
    const apiKey = import.meta.env.VITE_LOCATIONIQ

    useEffect(() => {
        if (normalizedQuery.length < 3) {
            setSearch({ status: 'idle', results: [], message: '' })
            return undefined
        }

        const controller = new AbortController()
        setSearch({ status: apiKey ? 'loading' : 'error', results: [], message: apiKey ? '' : 'Location search is not configured.' })
        const timer = setTimeout(async () => {
            if (!apiKey) return
            try {
                const params = new URLSearchParams({ key: apiKey, q: normalizedQuery, countrycodes: 'in', limit: '8', dedupe: '1', normalizecity: '1' })
                const response = await fetch(`https://api.locationiq.com/v1/autocomplete?${params}`, { signal: controller.signal })
                if (!response.ok) {
                    throw new Error(response.status === 429
                        ? 'Location search limit reached. Please wait and try again.'
                        : 'Location search is temporarily unavailable.')
                }
                const data = await response.json()
                if (!Array.isArray(data)) throw new Error('Location search returned an invalid response.')
                if (!controller.signal.aborted) setSearch({ status: data.length ? 'results' : 'empty', results: data, message: '' })
            } catch (error) {
                if (controller.signal.aborted || error.name === 'AbortError') return
                setSearch({ status: 'error', results: [], message: error.message || 'Location search failed.' })
            }
        }, 400)

        return () => {
            clearTimeout(timer)
            controller.abort()
        }
    }, [normalizedQuery, apiKey])

    const chooseLocation = result => {
        const latitude = Number(result.lat)
        const longitude = Number(result.lon)
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            setSearch({ status: 'error', results: [], message: 'This result did not include valid coordinates.' })
            return
        }
        onAddStop({
            name: result.display_place || result.name || result.display_name,
            location: result.display_address || result.display_name,
            latitude,
            longitude,
            placeId: result.place_id == null ? undefined : String(result.place_id),
            locationVerified: true
        })
    }

    return (
        <>
            <div className="fixed inset-0 z-[1200] flex justify-end">
                <button aria-label="Close stop search" onClick={onClose} className="absolute inset-0 bg-black/30" />
            <aside className="absolute right-0 top-0 flex h-full w-full flex-col bg-white shadow-2xl sm:w-1/2">
                <div className="px-5 pt-5 pb-4 border-b border-[#EEF2F4]">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[9px] font-semibold tracking-wide text-[#0F766E]">STOPS &amp; SEQUENCE</p>
                            <h2 className="text-sm font-semibold text-[#172033] mt-1">Add a stop</h2>
                            <p className="text-[9px] text-[#8191AA] mt-1">Search for a place, bus stand, or address to add to the route.</p>
                        </div>
                        <button type="button" aria-label="Close" onClick={onClose} className="text-[#94A3B8] hover:text-[#172033] p-1"><X size={15} /></button>
                    </div>
                    <label className="block text-[9px] font-semibold text-[#172033] mt-5 mb-1">Search locations</label>
                    <div className="flex items-center gap-2 h-[34px] border border-[#E3EAF0] rounded-md px-2.5 focus-within:border-[#0F766E]">
                        <Search size={13} className="text-[#94A3B8] shrink-0" />
                        <input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Bus stand, city, address, or landmark" className="w-full text-[10px] outline-none text-[#344054] placeholder:text-[#A0AEC0]" />
                    </div>
                    <p className="mt-1 text-[8px] text-[#8191AA]">Enter at least 3 characters. Results are limited to India.</p>
                </div>
                <div className="px-5 py-2 space-y-2 overflow-y-auto">
                    {search.status === 'idle' && (
                        <>
                            <p className="text-[10px] text-[#8191AA] py-3 text-center">Search for a stop to see location suggestions.</p>
                            <p className="px-1 pt-2 text-[9px] font-semibold text-[#627B77]">Quick searches</p>
                            {stopCatalog.map(stop => (
                                <button type="button" key={stop.id} onClick={() => setQuery(stop.name)} className="block w-full rounded-md px-2 py-2 text-left hover:bg-[#F0FDFA]">
                                    <span className="block text-[10px] font-medium text-[#172033]">{stop.name}</span>
                                    <span className="block truncate text-[9px] text-[#8191AA]">{stop.location}</span>
                                </button>
                            ))}
                        </>
                    )}
                    {search.status === 'loading' && <p role="status" className="text-[10px] text-[#8191AA] py-4 text-center">Searching locations…</p>}
                    {search.status === 'error' && <p role="alert" className="text-[10px] text-red-700 py-4 text-center">{search.message}</p>}
                    {search.status === 'empty' && <p className="text-[10px] text-[#8191AA] py-4 text-center">No locations found in India.</p>}
                    {search.results.map(result => {
                        const name = result.display_place || result.name || result.display_name
                        const added = stops.some(item => (result.place_id && item.placeId === String(result.place_id)) || item.name?.toLowerCase() === name?.toLowerCase())
                        return <button type="button" key={`${result.place_id || result.osm_id || result.display_name}`} disabled={added} onClick={() => chooseLocation(result)} className="flex w-full items-center gap-3 border border-[#E5EBEF] rounded-lg p-3 text-left hover:border-[#5EEAD4] hover:bg-[#F0FDFA] disabled:opacity-50">
                            <span className="w-6 h-6 shrink-0 rounded-full bg-[#F0FDFA] text-[#0F766E] flex items-center justify-center"><Search size={12} /></span>
                            <span className="min-w-0 flex-1"><span className="block text-[10px] font-semibold text-[#172033]">{name}</span><span className="mt-0.5 block text-[9px] text-[#8191AA]">{result.display_address || result.display_name}</span></span>
                            <span className="shrink-0 text-[9px] font-medium text-[#0F766E]">{added ? 'Added' : 'Add'}</span>
                        </button>
                    })}
                </div>
            </aside>
            </div>
        </>
    )
}

export default AddRoutepage
