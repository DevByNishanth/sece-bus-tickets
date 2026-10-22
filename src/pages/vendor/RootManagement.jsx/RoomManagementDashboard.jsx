import React from 'react'
import VendorNavbar from '../VendorNavbar'
import plus from '../../../assets/plus.svg'
import RouteListTable from './RouteListTable'


const RoomManagementDashboard = () => {
    return (
        <>
            <div className="main-container py-3 bg-[#F7F9FA] min-h-screen ">
                <VendorNavbar />


                <div className="content-container w-[94%] mt-3 m-auto">

                    {/* -------------------------  header ------------   */}
                    <header className="flex items-center justify-between">
                        <div>
                            <h1 className="font-medium text-xl">Route  Management Overview</h1>
                            <h1 className="text-[#627B77] mt-1 text-sm">Live bus tracking, intercity routes, and passenger booking engine</h1>
                        </div>
                        <button className='bg-[#0E7A88] hover:bg-[#035863] cursor-pointer text-white px-4 py-2 rounded-lg flex items-center gap-2'>
                            <span><img src={plus} className='w-4 h-4' /></span>
                            Add New Route
                        </button>
                    </header>

                    {/* -------------------------  statcard ------------   */}
                    <div className="statcard-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-4">
                        {[1, 2, 3, 4, 5].map((item) => {
                            return <div className="card bg-white border border-gray-300 rounded-lg p-3"></div>
                        })}
                    </div>

                    <RouteListTable/>



                </div>

            </div>
        </>
    )
}

export default RoomManagementDashboard
