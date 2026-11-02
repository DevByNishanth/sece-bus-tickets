
import VendorNavbar from "../VendorNavbar"
import { useNavigate } from "react-router-dom";
import plus from '../../../assets/plus.svg'
import BusTable from "./BusTable";
const BusManagementDashboard = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className="main-container py-3 bg-[#F7F9FA] min-h-screen ">
                <VendorNavbar />

                <div className="content-container w-[94%] mt-3 m-auto">

                    {/* -------------------------  header ------------   */}
                    <header className="flex items-center justify-between">
                        <div>
                            <h1 className="font-medium text-xl">Bus  Management Overview</h1>
                            <h1 className="text-[#627B77] mt-1 text-sm">Live bus tracking, intercity routes, and passenger booking engine</h1>
                        </div>
                        <button onClick={() => navigate("/vendor/buses/new")} className='bg-[#0E7A88] hover:bg-[#035863] cursor-pointer text-white px-4 py-2 rounded-lg flex items-center gap-2'>
                            <span><img src={plus} className='w-4 h-4' /></span>
                            Add Bus
                        </button>
                    </header>

                    {/* -------------------------  Statcard ------------   */}

                    <div className="statcard grid grid-cols-4 gap-3 mt-4">

                        {[1, 2, 3, 4].map((item) => {
                            return <div className="card border border-gray-300 rounded p-2"></div>
                        })}

                    </div>

                    {/* -------------------------  Table ------------   */}

                    <BusTable />
                </div>
            </div>
        </>
    )
}

export default BusManagementDashboard
