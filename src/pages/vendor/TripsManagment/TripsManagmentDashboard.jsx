
import { useState } from "react";
import TripDetailsTable from "./TripDetailsTable";
import BusTripOverView from "./BusTripOverView";
import VendorNavbar from "../VendorNavbar";

import {
  BusFront,
  CalendarDays,
  Clock3,
  CircleCheck,
  CircleX,
  Archive,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

const tripStats = [
  {
    title: "Total trips",
    value: 138,
    icon: BusFront,
  },
  {
    title: "Upcoming",
    value: 4,
    icon: CalendarDays,
  },
  {
    title: "In progress",
    value: 1,
    icon: Clock3,
  },
  {
    title: "Completed",
    value: 128,
    icon: CircleCheck,
  },
  {
    title: "Cancelled",
    value: 3,
    icon: CircleX,
  },
  {
    title: "Drafts",
    value: 1,
    icon: Archive,
  },
];

const TripsManagmentDashboard = () => {
  const [activeTab, setActiveTab] = useState("overall");

  return (
    <>
      <main className="min-h-screen bg-[#F7F9FA] py-3">
        <VendorNavbar />

        <section className="mx-auto mt-3 w-[94%]">

          {/* Header */}
          <div className="header">
            <div className="flex items-center justify-between w-full">

              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  Trip Details
                </h2>

                <p className="text-[12px] text-slate-400">
                  Live passenger ticket reservations &amp; payment receipts
                  across all routes
                </p>
              </div>

              <Link
                to="/vendor/trip-management/:busId/createNewTrip"
                className="flex items-center gap-1.5 bg-[#0e7a88] hover:bg-[#024e58] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
              >
                <Plus size={14} />
                Add Trip
              </Link>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 mt-4 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {tripStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="bg-white border border-slate-100 rounded-xl px-3 py-2.5 flex flex-col gap-2"
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-10 h-10 rounded-md bg-teal-50 flex items-center justify-center">
                      <Icon
                        size={22}
                        strokeWidth={1.8}
                        className="text-teal-700"
                      />
                    </div>

                    <span className="text-[12px] text-slate-500 font-medium">
                      {stat.title}
                    </span>
                  </div>

                  <p className="text-xl font-semibold text-slate-800 text-center">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Table and Tabs */}
          <div className="table-and-tabs-container mt-5">
            <div className="space-y-4">

              {/* Tabs */}
              <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 w-fit">
                <button
                  onClick={() => setActiveTab("overall")}
                  className={`px-8 py-2.5 rounded-lg text-xs font-medium transition-all
                    ${activeTab === "overall"
                      ? "bg-white text-teal-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  Overall Trip Details
                </button>

                <button
                  onClick={() => setActiveTab("bus")}
                  className={`px-8 py-2.5 rounded-lg text-xs font-medium transition-all
                    ${activeTab === "bus"
                      ? "bg-white text-teal-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  Bus Trip Overview
                </button>
              </div>

              {/* Conditional Rendering */}
              {activeTab === "overall" && <TripDetailsTable />}

              {activeTab === "bus" && <BusTripOverView />}

            </div>
          </div>

        </section>
      </main>
    </>
  );
};

export default TripsManagmentDashboard;
