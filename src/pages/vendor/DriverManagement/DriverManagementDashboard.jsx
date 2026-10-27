import React, { useState } from 'react'
import VendorNavbar from '../VendorNavbar'
import plus from '../../../assets/plus.svg'
import {
    Users,
    UserCheck,
    UserX,
    Clock,
    UserMinus,
} from "lucide-react";
import DriverCountOverviewChart from './DriverCountOverviewChart';
import DriverListTable from './DriverListTable';
import AddDriverForm from './AddDriverForm';

const DriverManagementDashboard = () => {
    const [isAddDriverFormOpen, setIsAddDriverFormOpen] = useState(false);

    return (
        <>
            <div className="main-container py-3 bg-[#F7F9FA] min-h-screen ">
                <VendorNavbar />

                <div className="content-container w-[94%] mt-3 m-auto">

                    {/* -------------------------  header ------------   */}
                    <header className="flex items-center justify-between">
                        <div>
                            <h1 className="font-medium text-xl">Driver  Management Overview</h1>
                            <h1 className="text-[#627B77] mt-1 text-sm">Live bus tracking, intercity routes, and passenger booking engine</h1>
                        </div>
                        <button type="button" onClick={() => setIsAddDriverFormOpen(true)} className='bg-[#0E7A88] hover:bg-[#035863] cursor-pointer text-white px-4 py-2 rounded-lg flex items-center gap-2'>
                            <span><img src={plus} className='w-4 h-4' /></span>
                            Add Driver
                        </button>
                    </header>

                    {/* -------------------------  Statcard ------------   */}
                    <div className="statcard-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-4">

                        {/* Total Drivers */}
                        <div className="card bg-white flex items-center justify-between p-2 rounded-lg shadow-md">
                            <div className="content-container mt-1">
                                <h1 className="text-xl font-semibold">100</h1>
                                <h1 className="text-xs font-medium text-gray-400">TOTAL DRIVERS</h1>
                            </div>

                            <div className="icon-container rounded-lg w-9 h-9 flex justify-center items-center bg-gradient-to-r from-emerald-400 to-emerald-600">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                        </div>

                        {/* Active Drivers */}
                        <div className="card bg-white flex items-center justify-between p-2 rounded-lg shadow-md">
                            <div className="content-container mt-1">
                                <h1 className="text-xl font-semibold">75</h1>
                                <h1 className="text-xs font-medium text-gray-400">ACTIVE DRIVERS</h1>
                            </div>

                            <div className="icon-container rounded-lg w-9 h-9 flex justify-center items-center bg-gradient-to-r from-blue-400 to-blue-600">
                                <UserCheck className="w-5 h-5 text-white" />
                            </div>
                        </div>

                        {/* Inactive Drivers */}
                        <div className="card bg-white flex items-center justify-between p-2 rounded-lg shadow-md">
                            <div className="content-container mt-1">
                                <h1 className="text-xl font-semibold">8</h1>
                                <h1 className="text-xs font-medium text-gray-400">INACTIVE DRIVERS</h1>
                            </div>

                            <div className="icon-container rounded-lg w-9 h-9 flex justify-center items-center bg-gradient-to-r from-slate-400 to-slate-600">
                                <UserX className="w-5 h-5 text-white" />
                            </div>
                        </div>

                        {/* Pending Drivers */}
                        <div className="card bg-white flex items-center justify-between p-2 rounded-lg shadow-md">
                            <div className="content-container mt-1">
                                <h1 className="text-xl font-semibold">12</h1>
                                <h1 className="text-xs font-medium text-gray-400">PENDING DRIVERS</h1>
                            </div>

                            <div className="icon-container rounded-lg w-9 h-9 flex justify-center items-center bg-gradient-to-r from-amber-400 to-orange-500">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                        </div>

                        {/* Resigned Drivers */}
                        <div className="card bg-white flex items-center justify-between p-2 rounded-lg shadow-md">
                            <div className="content-container mt-1">
                                <h1 className="text-xl font-semibold">5</h1>
                                <h1 className="text-xs font-medium text-gray-400">RESIGNED DRIVERS</h1>
                            </div>

                            <div className="icon-container rounded-lg w-9 h-9 flex justify-center items-center bg-gradient-to-r from-rose-400 to-red-600">
                                <UserMinus className="w-5 h-5 text-white" />
                            </div>
                        </div>

                    </div>



                    {/* ------------- driver overview chart -------------- */}
                    <DriverCountOverviewChart />


                    {/* ------------- driver list table -------------- */}

                    <DriverListTable />




                </div>
            </div>
            {isAddDriverFormOpen && (
                <AddDriverForm onClose={() => setIsAddDriverFormOpen(false)} />
            )}
        </>
    )
}

export default DriverManagementDashboard
