import { ChevronRight } from "lucide-react"
import VendorNavbar from "../VendorNavbar"
import CreateTripStepper from "./CreateTripStepper"
import BusJourneyDetails from "./BusJourneyDetails"
import SelectRoute from "./SelectRoute"
import { useState } from "react"
import ReviewTrip from "./ReviewTrip"
import SeatLayoutStep from "./SeatLayoutStep"
import PriceFixingStep from "./PriceFixingStep"
import AssignCrew from "./AssignCrew"

const CreateTripFormPage = () => {
    // states 
    const [step, setStep] = useState(1)
    return (
        <>
            <div className="form-page-container bg-[#f7f9fa] min-h-screen">
                <VendorNavbar />

                <div className="form-main-container mx-11 pr-2 h-[calc(100vh-150px)]  overflow-auto custom-scroll">
                    <div className="main-container ">

                        {/* breadcrumb  */}
                        <div className="breadcrumbs mt-2 flex items-center gap-1">
                            <p className="text-[#64748B]">Dashboard</p>
                            <ChevronRight size={16} className="text-[#949494]" />
                            <p className="font-medium text-[#0E7A88]">Create Trip</p>
                        </div>

                        {/* header  */}
                        <header className="mt-3 mb-2">
                            <p className="font-medium text-xl">Create a new Trip</p>
                            <p className="text-[#64748B] text-sm">Set up route details, stops, and passenger permissions.</p>
                        </header>


                        {/* stepper  */}
                        <CreateTripStepper currentStep={step} />

                        {/* form  */}


                        {/* step 1 */}
                        {step == 1 && <BusJourneyDetails />}


                        {/* step 2 */}
                        {step == 2 && <SelectRoute />}

                        {/* step 3 */}
                        {step == 3 && <SeatLayoutStep />}

                        {/* step 4 */}
                        {step == 4 && <PriceFixingStep />}

                        {/* step 5 */}
                        {step == 5 && <AssignCrew />}

                        {/* step 6 */}
                        {step == 6 && <ReviewTrip />}



                    </div>





                </div>

                {/* bottom action bar */}
                <div className="mt-6 fixed bottom-0 w-full flex items-center justify-between border-t border-[#E2E8F0] bg-white px-11 py-3">

                    {/* left actions */}
                    <div className="flex items-center gap-5">
                        <button className="text-xs font-medium text-[#64748B] hover:text-[#0F172A]">
                            Cancel
                        </button>
                        {step > 1 && (
                            <button
                                onClick={() => setStep((currentStep) => Math.max(currentStep - 1, 1))}
                                className="text-xs font-medium text-[#64748B] hover:text-[#0F172A]"
                            >
                                Previous step
                            </button>
                        )}

                    </div>

                    {/* step progress */}
                    <div className="flex flex-col items-center gap-1">
                        <p className="text-[10px] text-[#64748B]">
                            Step {step} of 6
                        </p>

                        <div className="h-[3px] w-[76px] rounded-full bg-[#E2E8F0]">
                            <div className="h-full rounded-full bg-[#0E7A88]" style={{ width: `${(step / 6) * 100}%` }} />
                        </div>
                    </div>

                    {/* continue button */}
                    <button
                        onClick={() => setStep((currentStep) => Math.min(currentStep + 1, 6))}
                        className="flex items-center gap-2 rounded-lg bg-[#11665F] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#0D554F]"
                    >
                        {step === 5 ? "Continue to Review" : step === 6 ? "Create Trip" : "Continue"}
                        <ChevronRight size={14} />
                    </button>

                </div>

            </div>
        </>
    )
}

export default CreateTripFormPage
