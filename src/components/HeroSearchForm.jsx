
import React from 'react';
import { useState } from 'react';
import { MapPin, CalendarDays, ArrowUpRight } from 'lucide-react';
import locationIcon from '../assets/location-icon.svg'
import CustomDatePicker from './CustomDatePicker';
const HeroSearchForm = () => {
  const [travelDate, setTravelDate] = useState(new Date().toLocaleDateString('en-CA'));
  const handleSearch = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const searchData = Object.fromEntries(formData.entries());

    console.log('Bus search:', searchData);

    // Connect your bus search API here
  };

  return (
    <form
      onSubmit={handleSearch}
      className="grid grid-cols-1 gap-3 rounded-2xl bg-white p-6 shadow-xl grid grid-cols-12"
    >
      {/* From */}
      <div className="col-span-3 flex min-w-0 items-center gap-3 border-b border-slate-100 px-3 py-2 lg:border-b-0 lg:border-r lg:border-slate-200">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0A6A6926] text-teal-700">
          {/* <MapPin size={18} /> */}
          <img src={locationIcon} className="w-6 h-6 " />
        </div>

        <div className="min-w-0 flex-1">
          <label
            htmlFor="from"
            className="block text-[12px] font-medium uppercase tracking-wider text-slate-500"
          >
            From
          </label>
          <input
            id="from"
            name="from"
            type="text"
            placeholder="Departure city"
            defaultValue="Coimbatore"
            required
            className="mt-0.5 w-full bg-transparent text-lg font-medium text-slate-800 outline-none placeholder:text-gray-800"
          />
        </div>
      </div>

      {/* To */}
      <div className="col-span-3 flex min-w-0 items-center gap-3 border-b border-slate-100 px-3 py-2 lg:border-b-0 lg:border-r lg:border-slate-200">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0A6A6926] text-teal-700">
          {/* <MapPin size={18} /> */}
          <img src={locationIcon} className="w-6 h-6 " />
        </div>

        <div className="min-w-0 flex-1">
          <label
            htmlFor="from"
            className="block text-[12px] font-medium uppercase tracking-wider text-slate-500"
          >
            TO
          </label>
          <input
            id="from"
            name="from"
            type="text"
            placeholder="Destination city"
            defaultValue="Banglore"
            required
            className="mt-0.5 w-full bg-transparent text-lg font-medium text-slate-800 outline-none placeholder:text-gray-800"
          />
        </div>
      </div>

      {/* Date */}
      <div className="col-span-4 flex items-center gap-3 px-3 py-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0A6A6926] text-teal-700">
          <CalendarDays size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <CustomDatePicker
            label="Date"
            name="travelDate"
            value={travelDate}
            required
            min={new Date().toLocaleDateString('en-CA')}
            onChange={(event) => setTravelDate(event.target.value)}
          />
        </div>
      </div>

      {/* Search button */}
      <div className="btn-container col-span-2  flex items-center justify-center ">
        <button
          type="submit"
          className=" flex h-12  w-[100%] items-center justify-between gap-2 rounded-full bg-linear-to-r from-[#087472] to-[#024746] pl-4 pr-1 py-2 font-semibold text-white transition hover:bg-teal-800 active:scale-[0.98]"
        >
          <span>Search</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-teal-800">
            <ArrowUpRight size={13} />
          </span>
        </button>
      </div>
    </form>
  );
};

export default HeroSearchForm;
