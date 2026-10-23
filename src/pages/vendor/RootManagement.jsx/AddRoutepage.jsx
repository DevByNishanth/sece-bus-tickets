import React, { useEffect, useState } from 'react'
import VendorNavbar from '../VendorNavbar'
import RouteStepper from './RouteStepper'
import RouteDetailsForm from './RouteDetailsForm'
import RouteStopsForm from './RouteStopsForm'
import { ArrowLeft, ArrowRight, MapPin, Plus, Search, X } from 'lucide-react'

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
            if (current.some(item => item.name === stop.name)) return current
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
                    onAddStop={addCatalogStop}
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
    { id: 'catalog-salem', name: 'Salem New Bus Stand', location: 'Salem · Meyyanur, Salem, Tamil Nadu', city: 'Salem' },
    { id: 'catalog-tiruppur', name: 'Tiruppur Old Bus Stand', location: 'Tiruppur · Kumaran Road, Tiruppur', city: 'Tiruppur' },
    { id: 'catalog-dindigul', name: 'Dindigul Bus Stand', location: 'Dindigul · Central bus bay', city: 'Dindigul' },
    { id: 'catalog-trichy', name: 'Trichy Central Bus Stand', location: 'Tiruchirappalli · Central bus stand', city: 'Trichy' },
    { id: 'catalog-madurai', name: 'Madurai Main Bus Stand', location: 'Madurai · Near MGR Bus Terminus', city: 'Madurai' },
    { id: 'catalog-coimbatore', name: 'Coimbatore Omni Bus Stand', location: 'Coimbatore · Near Omni Bus Bay', city: 'Coimbatore' }
]

function StopSearchDrawer({ stops, onAddStop, onClose }) {
    const [query, setQuery] = useState('')
    const normalizedQuery = query.trim().toLowerCase()
    const results = normalizedQuery
        ? stopCatalog.filter(stop => `${stop.name} ${stop.location} ${stop.city}`.toLowerCase().includes(normalizedQuery))
        : []

    return (
        <>
            <button aria-label="Close stop search" onClick={onClose} className="fixed inset-0 z-40 bg-black/30" />
            <aside className="fixed top-0 right-0 z-50 h-full w-[360px] max-w-[92vw] bg-white shadow-2xl flex flex-col">
                <div className="px-5 pt-5 pb-4 border-b border-[#EEF2F4]">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[9px] font-semibold tracking-wide text-[#0F766E]">STOPS &amp; SEQUENCE</p>
                            <h2 className="text-sm font-semibold text-[#172033] mt-1">Add a stop</h2>
                            <p className="text-[9px] text-[#8191AA] mt-1">Search and reuse a verified stop to avoid duplicates.</p>
                        </div>
                        <button type="button" aria-label="Close" onClick={onClose} className="text-[#94A3B8] hover:text-[#172033] p-1"><X size={15} /></button>
                    </div>
                    <label className="block text-[9px] font-semibold text-[#172033] mt-5 mb-1">Search existing stops</label>
                    <div className="flex items-center gap-2 h-[34px] border border-[#E3EAF0] rounded-md px-2.5 focus-within:border-[#0F766E]">
                        <Search size={13} className="text-[#94A3B8] shrink-0" />
                        <input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Stop name, city, address, or landmark" className="w-full text-[10px] outline-none text-[#344054] placeholder:text-[#A0AEC0]" />
                    </div>
                </div>
                <div className="px-5 py-2 space-y-2 overflow-y-auto">
                    {results.map(stop => {
                        const added = stops.some(item => item.name.toLowerCase() === stop.name.toLowerCase())
                        return <div key={stop.id} className="flex items-center gap-2.5 border border-[#E5EBEF] rounded-lg p-2.5">
                            <span className="w-5 h-5 rounded-full bg-[#F0FDFA] text-[#0F766E] flex items-center justify-center"><MapPin size={11} /></span>
                            <div className="min-w-0 flex-1"><p className="text-[10px] font-semibold text-[#172033] truncate">{stop.name}</p><p className="text-[9px] text-[#8191AA] truncate mt-0.5">{stop.location}</p></div>
                            <button type="button" disabled={added} onClick={() => onAddStop(stop)} aria-label={`Add ${stop.name}`} className="w-6 h-6 border border-[#E3EAF0] rounded-md text-[#8191AA] flex items-center justify-center hover:text-[#0F766E] hover:border-[#0F766E] disabled:text-[#0F766E] disabled:bg-[#F0FDFA]"><Plus size={13} /></button>
                        </div>
                    })}
                    {normalizedQuery && results.length === 0 && <p className="text-[10px] text-[#8191AA] py-4 text-center">No matching stops found.</p>}
                    {!normalizedQuery && <div className="mt-1 rounded-lg border border-[#99F6E4] bg-[#F0FDFA] p-3 text-[9px] leading-4 text-[#276B64]"><span className="font-semibold">City vs. physical stop</span><br />“{stops.find(stop => stop.type === 'origin')?.location || 'Your city'}” is a city. Search for a verified bus stop to add it as a physical stop.</div>}
                </div>
            </aside>
        </>
    )
}

export default AddRoutepage
