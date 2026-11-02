import { StopNameAutocomplete } from './RouteStopsForm'
import { AlertCircle, CheckCircle2, LoaderCircle } from 'lucide-react'

const RouteDetailsForm = ({ formData, setFormData, locationSelections, distanceCalculation, distanceDisplayValue, durationDisplayValue, onCityChange, onLocationSelect, onDistanceChange, onDistanceBlur, onDurationBlur }) => {

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

        if (name === 'estimatedDistance') {
            const numericValue = e.target.value === '' ? '' : e.target.valueAsNumber
            setFormData(current => ({ ...current, estimatedDistance: numericValue }))
            onDistanceChange?.(name, e.target.value)
            return
        }
        if (name === 'estimatedDurationMinutes') {
            const hours = value === '' ? '' : e.target.valueAsNumber
            setFormData(current => ({ ...current, estimatedDurationMinutes: hours === '' ? '' : hours * 60 }))
            onDistanceChange?.(name, value)
            return
        }
        setFormData(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    }

    return (
        <div className="bg-white border border-[#E5EBEF] rounded-xl p-5">

            <div className="border-b border-[#EEF2F4] pb-3">
                <p className="text-[10px] font-semibold text-[#0F766E]">
                    BASIC INFORMATION
                </p>

                <h2 className="text-sm font-medium text-[#172033] mt-1">
                    Where will this route operate?
                </h2>

                <p className="text-[10px] text-[#64748B] mt-1">
                    Start with the city pair. You can define the physical stop sequence next.
                </p>
            </div>

            <div className="mt-4 space-y-4">

                {/* Origin and Destination */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                    <div>
                        <label className="block text-[10px] font-medium text-[#172033] mb-1">
                            Origin city <span className="text-rose-600">*</span>
                        </label>

                        <div className="relative rounded-md border border-[#E3EAF0] px-2 py-2 focus-within:border-[#0F766E]">
                            <StopNameAutocomplete
                                stop={{ id: 'origin-city', type: 'stop', name: formData.originCity, locationVerified: Boolean(locationSelections?.origin) }}
                                onEdit={value => onCityChange('originCity', value)}
                                onSelect={selection => onLocationSelect('origin', selection)}
                                required
                                placeholder="Search origin city or bus stand"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-medium text-[#172033] mb-1">
                            Destination city <span className="text-rose-600">*</span>
                        </label>

                        <div className="relative rounded-md border border-[#E3EAF0] px-2 py-2 focus-within:border-[#0F766E]">
                            <StopNameAutocomplete
                                stop={{ id: 'destination-city', type: 'stop', name: formData.destinationCity, locationVerified: Boolean(locationSelections?.destination) }}
                                onEdit={value => onCityChange('destinationCity', value)}
                                onSelect={selection => onLocationSelect('destination', selection)}
                                required
                                placeholder="Search destination city or bus stand"
                            />
                        </div>
                    </div>

                </div>

                {/* Route Name */}
                <div>
                    <label className="block text-[10px] font-medium text-[#172033] mb-1">
                            Route name <span className="text-rose-600">*</span>
                    </label>

                    <input
                        type="text"
                        name="routeName"
                        value={formData.routeName}
                        onChange={handleChange}
                        required
                        maxLength={120}
                        placeholder="Enter route name"
                        className="w-full h-[34px] border border-[#E3EAF0] rounded-md px-2 text-[11px] text-[#344054] outline-none focus:border-[#0F766E] placeholder:text-[#A0AEC0]"
                    />

                    <p className="text-[10px] text-[#8191AA] mt-1">
                        Use a name that helps dispatchers distinguish this variant.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-[10px] font-medium text-[#172033]">Estimated distance (km) <span className="text-rose-600">*</span></label>
                        <div className="relative">
                            <input type="number" name="estimatedDistance" min="0.01" step="any" required value={distanceDisplayValue} onChange={handleChange} onBlur={event => onDistanceBlur?.(event.target.value)} placeholder="e.g. 350.00" className="h-[34px] w-full rounded-md border border-[#E3EAF0] px-2 pr-10 text-[11px] text-[#344054] outline-none focus:border-[#0F766E]" />
                            <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-[#8191AA]">km</span>
                        </div>
                        {distanceCalculation?.status === 'loading' && <p role="status" className="mt-1 flex items-center gap-1.5 text-[9px] text-[#64748B]"><LoaderCircle size={12} className="animate-spin text-teal-700" />Calculating road distance…</p>}
                        {distanceCalculation?.status === 'success' && <p role="status" className="mt-1 flex items-center gap-1.5 text-[9px] text-teal-700"><CheckCircle2 size={12} />{distanceCalculation.message}</p>}
                        {distanceCalculation?.status === 'error' && <p role="alert" className="mt-1 flex items-start gap-1.5 text-[9px] text-rose-700"><AlertCircle size={12} className="mt-px shrink-0" />{distanceCalculation.message}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-[10px] font-medium text-[#172033]">Estimated duration (hours) <span className="text-rose-600">*</span></label>
                        <div className="relative">
                            <input type="number" name="estimatedDurationMinutes" min="0.01" step="any" required value={durationDisplayValue} onChange={handleChange} onBlur={event => onDurationBlur?.(event.target.value)} placeholder="e.g. 6.50" className="h-[34px] w-full rounded-md border border-[#E3EAF0] px-2 pr-12 text-[11px] text-[#344054] outline-none focus:border-[#0F766E]" />
                            <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-[#8191AA]">hours</span>
                        </div>
                    </div>
                </div>

                {/* Route Category */}
                <div>
                    <label className="block text-[10px] font-medium text-[#172033] mb-1">
                        Route category <span className="text-[#8191AA] font-normal">(optional)</span>
                    </label>

                    <input
                        type="text"
                        name="routeCategory"
                        value={formData.routeCategory}
                        onChange={handleChange}
                        placeholder="e.g. Intercity"
                        className="w-full h-[34px] border border-[#E3EAF0] rounded-md px-2 text-[11px] text-[#344054] outline-none focus:border-[#0F766E] placeholder:text-[#A0AEC0]"
                    />
                </div>

                {/* Internal Description */}
                <div className="pt-3">
                    <label className="block text-[10px] font-medium text-[#172033] mb-1">
                        Description <span className="text-[#8191AA] font-normal">(optional)</span>
                    </label>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Notes for your operations team"
                        className="w-full min-h-[34px] border border-[#E3EAF0] rounded-md px-2 py-2 text-[11px] text-[#344054] outline-none focus:border-[#0F766E] placeholder:text-[#A0AEC0] resize-y"
                    />
                </div>

                <label className="flex items-center gap-2 text-[11px] font-medium text-[#172033]">
                    <input type="checkbox" name="status" checked={Boolean(formData.status)} onChange={handleChange} className="h-4 w-4 accent-teal-700" />
                    Route is active
                </label>

            </div>
        </div>
    )
}

export default RouteDetailsForm
