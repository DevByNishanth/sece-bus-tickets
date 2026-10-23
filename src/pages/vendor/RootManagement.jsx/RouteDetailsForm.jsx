import { ChevronDown } from 'lucide-react'

const RouteDetailsForm = ({ formData, setFormData }) => {

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value
        })
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
                            Origin city
                        </label>

                        <div className="relative">
                            <select
                                name="originCity"
                                value={formData.originCity}
                                onChange={handleChange}
                                className="appearance-none w-full h-[34px] border border-[#E3EAF0] rounded-md px-2 pr-8 text-[11px] text-[#344054] outline-none focus:border-[#0F766E]"
                            >
                                <option value="">Select origin city</option>
                                <option value="Madurai">Madurai</option>
                                <option value="Coimbatore">Coimbatore</option>
                                <option value="Chennai">Chennai</option>
                                <option value="Trichy">Trichy</option>
                                <option value="Salem">Salem</option>
                            </select>

                            <ChevronDown
                                size={13}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8191AA] pointer-events-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-medium text-[#172033] mb-1">
                            Destination city
                        </label>

                        <div className="relative">
                            <select
                                name="destinationCity"
                                value={formData.destinationCity}
                                onChange={handleChange}
                                className="appearance-none w-full h-[34px] border border-[#E3EAF0] rounded-md px-2 pr-8 text-[11px] text-[#344054] outline-none focus:border-[#0F766E]"
                            >
                                <option value="">Select destination city</option>
                                <option value="Coimbatore">Coimbatore</option>
                                <option value="Madurai">Madurai</option>
                                <option value="Chennai">Chennai</option>
                                <option value="Trichy">Trichy</option>
                                <option value="Salem">Salem</option>
                            </select>

                            <ChevronDown
                                size={13}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8191AA] pointer-events-none"
                            />
                        </div>
                    </div>

                </div>

                {/* Route Name */}
                <div>
                    <label className="block text-[10px] font-medium text-[#172033] mb-1">
                        Route name
                    </label>

                    <input
                        type="text"
                        name="routeName"
                        value={formData.routeName}
                        onChange={handleChange}
                        placeholder="Enter route name"
                        className="w-full h-[34px] border border-[#E3EAF0] rounded-md px-2 text-[11px] text-[#344054] outline-none focus:border-[#0F766E] placeholder:text-[#A0AEC0]"
                    />

                    <p className="text-[10px] text-[#8191AA] mt-1">
                        Use a name that helps dispatchers distinguish this variant.
                    </p>
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
                        Internal description <span className="text-[#8191AA] font-normal">(optional)</span>
                    </label>

                    <textarea
                        name="internalDescription"
                        value={formData.internalDescription}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Notes for your operations team"
                        className="w-full min-h-[34px] border border-[#E3EAF0] rounded-md px-2 py-2 text-[11px] text-[#344054] outline-none focus:border-[#0F766E] placeholder:text-[#A0AEC0] resize-y"
                    />
                </div>

            </div>
        </div>
    )
}

export default RouteDetailsForm
