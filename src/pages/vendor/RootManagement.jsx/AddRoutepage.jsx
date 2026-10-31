import { useEffect, useRef, useState } from 'react'
import VendorNavbar from '../VendorNavbar'
import RouteStepper from './RouteStepper'
import RouteDetailsForm from './RouteDetailsForm'
import RouteStopsForm from './RouteStopsForm'
import { ArrowLeft, ArrowRight, Search, X } from 'lucide-react'
import BoardingDroppingConfig from './BoardingDropingConfig'
import RouteReview from './RouteReview'

const AddRoutepage = () => {

    const [activeStep, setActiveStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState("")
    const [submitSuccess, setSubmitSuccess] = useState("")
    const [distanceCalculation, setDistanceCalculation] = useState({ status: 'idle', message: '' })
    const [distanceDisplayValue, setDistanceDisplayValue] = useState('')
    const [durationDisplayValue, setDurationDisplayValue] = useState('')
    const lastSuccessfulDistanceKey = useRef("")
    const manuallyEditedEstimates = useRef(new Set())

    // Step 1 form data
    const [formData, setFormData] = useState({
        originCity: '',
        destinationCity: '',
        routeName: '',
        routeCategory: '',
        estimatedDistance: '',
        estimatedDurationMinutes: '',
        description: '',
        status: true
    })

    // Step 2 form data
    const [stops, setStops] = useState([
        { id: 1, name: '', location: '', type: 'origin' },
        { id: 2, name: '', location: '', type: 'destination' }
    ])
    const [locationSelections, setLocationSelections] = useState({ origin: null, destination: null })
    const [isStopDrawerOpen, setIsStopDrawerOpen] = useState(false)
    const [stopPermissions, setStopPermissions] = useState({})

    const handleCityChange = (field, value) => {
        const key = field === 'originCity' ? 'origin' : 'destination'
        setFormData(current => ({ ...current, [field]: value, estimatedDistance: '', estimatedDurationMinutes: '' }))
        setDistanceDisplayValue('')
        setDurationDisplayValue('')
        setLocationSelections(current => ({ ...current, [key]: null }))
        setStops(current => current.map(stop => stop.type === key
            ? { ...stop, name: value || (key === 'origin' ? 'Origin' : 'Destination'), location: value, city: value, landmark: value, latitude: undefined, longitude: undefined, placeId: undefined, locationVerified: false }
            : stop))
        lastSuccessfulDistanceKey.current = ""
        manuallyEditedEstimates.current = new Set()
        setDistanceCalculation({ status: 'idle', message: '' })
    }

    const handleLocationSelect = (key, selection) => {
        setLocationSelections(current => ({ ...current, [key]: selection }))
        lastSuccessfulDistanceKey.current = ""
        manuallyEditedEstimates.current = new Set()
        const field = key === 'origin' ? 'originCity' : 'destinationCity'
        setFormData(current => ({ ...current, [field]: selection.city || selection.name || '', estimatedDistance: '', estimatedDurationMinutes: '' }))
        setDistanceDisplayValue('')
        setDurationDisplayValue('')
        setStops(current => current.map(stop => stop.type === key
            ? { ...stop, name: selection.name || selection.city || '', location: selection.location || '', city: selection.city || selection.name || '', landmark: selection.landmark || selection.location || '', latitude: selection.latitude, longitude: selection.longitude, placeId: selection.placeId, locationVerified: true }
            : stop))
        setDistanceCalculation({ status: 'idle', message: '' })
    }

    const handleDistanceManualEdit = (field, inputValue) => {
        manuallyEditedEstimates.current = new Set([...manuallyEditedEstimates.current, field])
        if (field === 'estimatedDistance') setDistanceDisplayValue(inputValue)
        if (field === 'estimatedDurationMinutes') setDurationDisplayValue(inputValue)
        setDistanceCalculation({ status: 'idle', message: '' })
    }

    const handleDistanceBlur = (inputValue) => {
        if (inputValue === '' || !Number.isFinite(Number(inputValue))) return
        setDistanceDisplayValue(Number(inputValue).toFixed(2))
    }

    const handleDurationBlur = (inputValue) => {
        if (inputValue === '' || !Number.isFinite(Number(inputValue))) return
        setDurationDisplayValue(Number(inputValue).toFixed(2))
    }

    useEffect(() => {
        const origin = locationSelections.origin
        const destination = locationSelections.destination
        const hasValidCoordinates = [origin?.longitude, origin?.latitude, destination?.longitude, destination?.latitude]
            .every(value => value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value)))

        if (!origin || !destination || !hasValidCoordinates) {
            return undefined
        }

        const coordinates = `${Number(origin.longitude)},${Number(origin.latitude)};${Number(destination.longitude)},${Number(destination.latitude)}`
        const requestKey = coordinates
        if (lastSuccessfulDistanceKey.current === requestKey) return undefined

        const apiKey = import.meta.env.VITE_LOCATIONIQ
        if (!apiKey) {
            const timeout = window.setTimeout(() => setDistanceCalculation({ status: 'error', message: 'Distance calculation is not configured. Enter the distance manually.' }), 0)
            return () => window.clearTimeout(timeout)
        }

        const controller = new AbortController()
        const calculateDistance = async () => {
            try {
                await Promise.resolve()
                if (controller.signal.aborted) return
                setDistanceCalculation({ status: 'loading', message: 'Calculating road distance…' })
                const query = new URLSearchParams({ key: apiKey, overview: 'false' })
                const response = await fetch(`https://us1.locationiq.com/v1/directions/driving/${coordinates}?${query}`, {
                    signal: AbortSignal.any([controller.signal, AbortSignal.timeout(12000)]),
                    headers: { Accept: 'application/json' },
                })
                const responseText = await response.text()
                let data
                try { data = responseText ? JSON.parse(responseText) : {} } catch { data = { message: responseText } }
                const apiError = typeof data?.error === 'string' ? data.error : data?.error?.message
                if (!response.ok) throw new Error(apiError || data?.message || `Distance lookup failed (${response.status}).`)

                const route = Array.isArray(data.routes) ? data.routes[0] : data.routes
                const distanceInMeters = Number(route?.distance ?? route?.legs?.[0]?.distance)
                const durationInSeconds = Number(route?.duration ?? route?.legs?.[0]?.duration)
                if (!Number.isFinite(distanceInMeters) || distanceInMeters <= 0 || !Number.isFinite(durationInSeconds) || durationInSeconds <= 0) {
                    throw new Error('No driving route was found for those locations.')
                }

                if (!controller.signal.aborted) {
                    const distanceInKm = distanceInMeters / 1000
                    const durationInMinutes = durationInSeconds / 60
                    const durationInHours = durationInMinutes / 60
                    const editedFields = manuallyEditedEstimates.current
                    if (!editedFields.has('estimatedDistance')) setDistanceDisplayValue(distanceInKm.toFixed(2))
                    if (!editedFields.has('estimatedDurationMinutes')) setDurationDisplayValue(durationInHours.toFixed(2))
                    setFormData(current => ({
                        ...current,
                        estimatedDistance: editedFields.has('estimatedDistance') ? current.estimatedDistance : distanceInKm,
                        estimatedDurationMinutes: editedFields.has('estimatedDurationMinutes') ? current.estimatedDurationMinutes : String(durationInMinutes),
                    }))
                    const messages = []
                    if (!editedFields.has('estimatedDistance')) messages.push(`Road distance: ${distanceInKm.toFixed(2)} km`)
                    if (!editedFields.has('estimatedDurationMinutes')) messages.push(`Estimated duration: ${durationInHours.toFixed(2)} hours`)
                    setDistanceCalculation(messages.length ? { status: 'success', message: messages.join(' · ') } : { status: 'idle', message: '' })
                    lastSuccessfulDistanceKey.current = requestKey
                }
            } catch (error) {
                if (controller.signal.aborted || error.name === 'AbortError') return
                setDistanceCalculation({ status: 'error', message: `${error.message || 'Could not calculate road distance.'} Enter the distance manually or select the locations again.` })
            }
        }

        calculateDistance()
        return () => {
            controller.abort()
        }
    }, [locationSelections])

    const addCatalogStop = (stop) => {
        setStops(current => {
            if (current.some(item => (stop.placeId && item.placeId === stop.placeId) || item.name?.toLowerCase() === stop.name?.toLowerCase())) return current
            const destinationIndex = current.findIndex(item => item.type === 'destination')
            const updated = [...current]
            updated.splice(destinationIndex < 0 ? updated.length : destinationIndex, 0, { ...stop, id: `stop-${Date.now()}-${Math.random()}`, type: 'stop' })
            return updated
        })
    }

    const handleContinue = async () => {
        if (activeStep < 4) {
            setActiveStep(activeStep + 1)
        } else if (activeStep === 4) {
            setSubmitError("")
            setSubmitSuccess("")
            const distance = Number(formData.estimatedDistance)
            const duration = Number(formData.estimatedDurationMinutes)
            if (!formData.routeName.trim() || !formData.originCity || !formData.destinationCity || !distance || !duration) {
                setSubmitError("Complete the route name, origin, destination, distance, and estimated duration before submitting.")
                return
            }
            if (stops.length < 2) {
                setSubmitError("Add an origin and destination to the route before submitting.")
                return
            }
            const missingStop = stops.find(stop => {
                const city = stop.city || (stop.type === "origin" ? formData.originCity : stop.type === "destination" ? formData.destinationCity : "")
                const name = stop.name || (stop.type === "origin" ? formData.originCity : stop.type === "destination" ? formData.destinationCity : "")
                return !city.trim() || !name.trim()
            })
            if (missingStop) {
                setSubmitError(`Add a city and stop name for ${missingStop.name || "each route stop"} before submitting.`)
                return
            }
            const payload = {
                routeName: formData.routeName.trim(),
                originCity: formData.originCity,
                destinationCity: formData.destinationCity,
                routeCategory: formData.routeCategory.trim(),
                estimatedDistance: distance,
                estimatedDurationMinutes: duration,
                description: formData.description.trim(),
                stops: stops.map((stop, index) => {
                    const permission = stopPermissions[stop.id] || {}
                    const boarding = permission.boarding ?? stop.type === "origin"
                    const dropping = permission.dropping ?? stop.type === "destination"
                    return {
                        name: stop.name || (stop.type === "origin" ? formData.originCity : stop.type === "destination" ? formData.destinationCity : ""),
                        city: stop.city || (stop.type === "origin" ? formData.originCity : stop.type === "destination" ? formData.destinationCity : ""),
                        landmark: stop.landmark || stop.location || stop.name || "",
                        stopType: boarding && dropping ? "both" : boarding ? "boarding" : dropping ? "dropping" : "both",
                        sequenceNumber: index + 1,
                    }
                }),
                status: Boolean(formData.status),
            }
            setIsSubmitting(true)
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "")
                if (!baseUrl) throw new Error("VITE_API_BASE_URL is not configured.")
                const token = window.localStorage.getItem("exte_key")
                if (!token) throw new Error("Authentication token was not found. Please sign in again.")
                const response = await fetch(`${baseUrl}/agent/routes`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                })
                const responseText = await response.text()
                let responseBody = {}
                try { responseBody = responseText ? JSON.parse(responseText) : {} } catch { responseBody = { message: responseText } }
                if (!response.ok || responseBody.success === false) throw new Error(responseBody.message || `Route submission failed (${response.status}).`)
                setSubmitSuccess(responseBody.message || "Route submitted successfully.")
            } catch (error) {
                setSubmitError(error.message || "Could not submit the route. Please try again.")
            } finally {
                setIsSubmitting(false)
            }
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
            stops,
            stopPermissions
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
                            locationSelections={locationSelections}
                            distanceCalculation={distanceCalculation}
                            distanceDisplayValue={distanceDisplayValue}
                            durationDisplayValue={durationDisplayValue}
                            onCityChange={handleCityChange}
                            onLocationSelect={handleLocationSelect}
                            onDistanceChange={handleDistanceManualEdit}
                            onDistanceBlur={handleDistanceBlur}
                            onDurationBlur={handleDurationBlur}
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

                        <BoardingDroppingConfig
                            stops={stops}
                            permissions={stopPermissions}
                            onPermissionsChange={setStopPermissions}
                            originCity={formData.originCity}
                            destinationCity={formData.destinationCity}
                        />

                    )}

                    {activeStep === 4 && (
                        <RouteReview
                            formData={formData}
                            stops={stops}
                            permissions={stopPermissions}
                            onEditStep={setActiveStep}
                        />
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

            {submitError && <p role="alert" className="mx-auto mt-3 w-[94%] rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{submitError}</p>}
            {submitSuccess && <p role="status" className="mx-auto mt-3 w-[94%] rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{submitSuccess}</p>}

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
                    disabled={isSubmitting || Boolean(submitSuccess)}
                    className="bg-[#115E59] text-white flex items-center gap-2 rounded-lg py-2 px-3 sm:px-4 text-xs sm:text-sm cursor-pointer hover:bg-[#04504b] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Submitting route…' : submitSuccess ? 'Route Submitted' : activeStep === 1
                        ? 'Continue to Stops'
                        : activeStep === 2
                            ? 'Continue to Boarding' : activeStep === 3
                                ? 'Review Route' : "Save Route"
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
    const [search, setSearch] = useState({ query: '', status: 'idle', results: [], message: '' })
    const normalizedQuery = query.trim()
    const apiKey = import.meta.env.VITE_LOCATIONIQ
    const visibleSearch = normalizedQuery.length < 3
        ? { status: 'idle', results: [], message: '' }
        : search.query === normalizedQuery
            ? search
            : { status: apiKey ? 'loading' : 'error', results: [], message: apiKey ? '' : 'Location search is not configured.' }

    useEffect(() => {
        if (normalizedQuery.length < 3) {
            return undefined
        }

        const controller = new AbortController()
        const timer = setTimeout(async () => {
            if (!apiKey) {
                setSearch({ query: normalizedQuery, status: 'error', results: [], message: 'Location search is not configured.' })
                return
            }
            setSearch({ query: normalizedQuery, status: 'loading', results: [], message: '' })
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
                if (!controller.signal.aborted) setSearch({ query: normalizedQuery, status: data.length ? 'results' : 'empty', results: data, message: '' })
            } catch (error) {
                if (controller.signal.aborted || error.name === 'AbortError') return
                setSearch({ query: normalizedQuery, status: 'error', results: [], message: error.message || 'Location search failed.' })
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
            setSearch({ query: normalizedQuery, status: 'error', results: [], message: 'This result did not include valid coordinates.' })
            return
        }
        onAddStop({
            name: result.display_place || result.name || result.display_name,
            location: result.display_address || result.display_name,
            city: result.address?.city || result.address?.town || result.address?.village || result.address?.municipality || result.address?.county || "",
            landmark: result.display_address || result.display_name || "",
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
                        {visibleSearch.status === 'idle' && (
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
                        {visibleSearch.status === 'loading' && <p role="status" className="text-[10px] text-[#8191AA] py-4 text-center">Searching locations…</p>}
                        {visibleSearch.status === 'error' && <p role="alert" className="text-[10px] text-red-700 py-4 text-center">{visibleSearch.message}</p>}
                        {visibleSearch.status === 'empty' && <p className="text-[10px] text-[#8191AA] py-4 text-center">No locations found in India.</p>}
                        {visibleSearch.results.map(result => {
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
