import { ChevronRight, Check } from "lucide-react";
import VendorNavbar from "./VendorNavbar";
import { useParams } from "react-router-dom";
import { useState } from "react";
import seat from "../../assets/seat.svg";
import sleeper from "../../assets/sleeper.svg";

const deckTypeData = ["Lower Deck", "Upper Deck"];

export const VendorDeckSelectionPage = () => {
  // -------------------- Params --------------------

  const { deckType } = useParams();

  // -------------------- States --------------------

  const [selectedDeckPostion, setSelectedDeckPostion] = useState("Lower Deck");

  // Deck layout type
  const [selectedLayoutType, setSelectedLayoutType] =
    useState("Seats + Sleepers");

  // Default seat configuration
  const [selectedSeatType, setSelectedSeatType] = useState("Double Seater");

  // Sleeper configuration
  const [selectedSleeperType, setSelectedSleeperType] =
    useState("Single Sleeper");

  // -------------------- Data --------------------

  const deckLayoutOptions = [
    {
      title: "Seats Only",
      description: "Standard seating layout",
      type: "seats",
      icon: "seats",
    },
    {
      title: "Seats + Sleepers",
      description: "Flexible mixed layout",
      type: "mixed",
      icon: "mixed",
    },
    {
      title: "Sleepers Only",
      description: "Berth-based layout",
      type: "sleepers",
      icon: "sleepers",
    },
  ];

  const seatConfigurationOptions = [
    {
      title: "Single Seater",
      description: "1 passenger per unit",
      type: "single",
    },
    {
      title: "Double Seater",
      description: "2 passengers per unit",
      type: "double",
    },
    {
      title: "Triple Seater",
      description: "3 passengers per unit",
      type: "triple",
    },
  ];

  const sleeperConfigurationOptions = [
    {
      title: "Single Sleeper",
      description: "Flexible mixed layout",
      type: "single",
    },
    {
      title: "Double Sleeper",
      description: "Berth-based layout",
      type: "double",
    },
  ];

  // -------------------- UI --------------------

  return (
    <>
      <div className="main-container min-h-screen bg-[#f7f9fa]">
        <VendorNavbar />

        {/* -------------------- Header -------------------- */}

        <header className="w-[94%] m-auto mt-3">
          {/* Breadcrumb Navigation */}

          <nav className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <a href="#" className="transition-colors hover:text-gray-800">
              Fleet
            </a>

            <ChevronRight size={12} className="text-gray-400" />

            <a href="#" className="transition-colors hover:text-gray-800">
              My Buses
            </a>

            <ChevronRight size={12} className="text-gray-400" />

            <a href="#" className="transition-colors hover:text-gray-800">
              Seat Layout Management
            </a>

            <ChevronRight size={12} className="text-gray-400" />

            <span className="font-medium text-gray-900">Create Layout</span>
          </nav>
        </header>

        {/* -------------------- Main Content -------------------- */}

        <div className="main-container w-[94%] m-auto mt-4 pb-8">
          {/* Step */}

          <h1 className="text-[#007B8A] font-semibold text-sm">STEP 1 OF 3</h1>

          {/* Heading */}

          <h1 className="font-semibold mt-2 text-xl">Configure Your Deck</h1>

          <h1 className="text-[#64748B] text-sm mt-2">
            Choose the passenger components available on each deck. You'll
            arrange individual rows next.
          </h1>

          {/* -------------------- Deck Selection Container -------------------- */}

          <div className="deck-selection-container bg-white border border-gray-100 shadow rounded-xl p-4 mt-4">
            {/* -------------------- Deck Position -------------------- */}

            {deckType === "single" ? (
              <p className="font-semibold text-sm">Single Deck</p>
            ) : (
              <div className="tab-container grid grid-cols-2 gap-2 w-full sm:w-[340px] bg-[#f1f5f9] p-2 rounded-lg">
                {deckTypeData.map((item) => {
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSelectedDeckPostion(item)}
                      className={`tab cursor-pointer px-4 py-2 rounded-lg text-sm transition-colors ${
                        selectedDeckPostion === item
                          ? "bg-white text-[#087f8c] font-semibold shadow-sm"
                          : "text-[#64748B] hover:text-gray-900"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            )}

            {/* ====================================================== */}
            {/* SECTION 1: DECK LAYOUT TYPE */}
            {/* ====================================================== */}

            <div className="mt-6">
              {/* Section Heading */}

              <div className="flex items-start  gap-2">
                <div className="w-5 h-5 shrink-0 rounded-full bg-[#007B8A] text-white flex items-center justify-center text-xs font-semibold">
                  1
                </div>

                <div className="-mt-1">
                  <p className="text-lg font-semibold">Deck layout type</p>

                  <p className="text-sm text-[#64748B] mt-1">
                    Select which component types can be used on this deck.
                  </p>
                </div>
              </div>

              {/* Layout Options */}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                {deckLayoutOptions.map((item) => {
                  const isSelected = selectedLayoutType === item.title;

                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setSelectedLayoutType(item.title)}
                      className={`relative min-h-[90px] text-left border rounded-lg p-5 transition-all ${
                        isSelected
                          ? "border-[#007B8A] ring-1 ring-[#007B8A] bg-white"
                          : "border-gray-200 hover:border-[#007B8A] bg-white"
                      }`}
                    >
                      {/* Radio / Selected Icon */}
                      <div
                        className={`absolute top-3 right-3 w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "bg-[#007B8A] border-[#007B8A]"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <Check size={10} className="text-white" />
                        )}
                      </div>

                      {/* Layout Icon */}

                      <div className="flex items-center gap-1 h-5">
                        {item.icon === "seats" && (
                          <>
                            <img src={seat} />
                            <img src={seat} />
                          </>
                        )}

                        {item.icon === "mixed" && (
                          <>
                            <img src={seat} />
                            <img src={sleeper} />
                          </>
                        )}

                        {item.icon === "sleepers" && (
                          <>
                            <img src={sleeper} />
                            <img src={sleeper} />
                          </>
                        )}
                      </div>

                      {/* Card Content */}

                      <h3 className="text-[14px] font-semibold text-gray-900 mt-4">
                        {item.title}
                      </h3>

                      <p className="text-[12px] text-[#64748B] mt-1">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ====================================================== */}
            {/* SECTION 2: DEFAULT SEAT CONFIGURATION */}
            {/* ====================================================== */}

            {/* Show seat configuration only when seats are available */}

            {selectedLayoutType !== "Sleepers Only" && (
              <div className="mt-7 pt-5 border-t border-gray-100">
                {/* Section Heading */}

                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 shrink-0 rounded-full bg-[#007B8A] text-white flex items-center justify-center text-xs font-semibold">
                    2
                  </div>

                  <div className="-mt-1">
                    <h2 className="text-lg font-semibold">
                      Default seat configuration
                    </h2>

                    <p className="text-sm text-[#64748B] mt-1">
                      Set the starting configuration. Each row can be changed
                      later.
                    </p>
                  </div>
                </div>

                {/* Seat Configuration Options */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                  {seatConfigurationOptions.map((item) => {
                    const isSelected = selectedSeatType === item.title;

                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => setSelectedSeatType(item.title)}
                        className={`relative min-h-[90px] text-left border rounded-lg p-5 transition-all ${
                          isSelected
                            ? "border-[#007B8A] ring-1 ring-[#007B8A] bg-white"
                            : "border-gray-200 hover:border-[#007B8A] bg-white"
                        }`}
                      >
                        {/* Radio / Selected Icon */}
                        <div
                          className={`absolute top-3 right-3 w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "bg-[#007B8A] border-[#007B8A]"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <Check size={10} className="text-white" />
                          )}
                        </div>

                        {/* Seat Icon */}

                        <div className="flex items-center gap-1 h-5">
                          {item.type === "single" && <img src={seat} />}

                          {item.type === "double" && (
                            <>
                              <img src={seat} />
                              <img src={seat} />
                            </>
                          )}

                          {item.type === "triple" && (
                            <>
                              <img src={seat} />
                              <img src={seat} />
                              <img src={seat} />
                            </>
                          )}
                        </div>

                        {/* Card Content */}

                        <h3 className="text-[14px] font-semibold text-gray-900 mt-4">
                          {item.title}
                        </h3>

                        <p className="text-[12px] text-[#64748B] mt-1">
                          {item.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ====================================================== */}
            {/* SECTION 3: SLEEPER CONFIGURATION */}
            {/* ====================================================== */}

            {/* IMPORTANT:
                Do not render this section when Seats Only is selected.
            */}

            {selectedLayoutType !== "Seats Only" && (
              <div className="mt-7 pt-5 border-t border-gray-100">
                {/* Section Heading */}

                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 shrink-0 rounded-full bg-[#007B8A] text-white flex items-center justify-center text-xs font-semibold">
                    3
                  </div>

                  <div className="-mt-1">
                    <h2 className="text-lg font-semibold">
                      Choose Sleeper Configuration
                    </h2>

                    <p className="text-sm text-[#64748B] mt-1">
                      Set the starting configuration. Each row can be changed
                      later.
                    </p>
                  </div>
                </div>

                {/* Sleeper Configuration Options */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {sleeperConfigurationOptions.map((item) => {
                    const isSelected = selectedSleeperType === item.title;

                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => setSelectedSleeperType(item.title)}
                        className={`relative min-h-[90px] text-left border rounded-lg p-5 transition-all ${
                          isSelected
                            ? "border-[#007B8A] ring-1 ring-[#007B8A] bg-white"
                            : "border-gray-200 hover:border-[#007B8A] bg-white"
                        }`}
                      >
                        {/* Radio / Selected Icon */}

                        <div
                          className={`absolute top-3 right-3 w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "bg-[#007B8A] border-[#007B8A]"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <Check size={10} className="text-white" />
                          )}
                        </div>

                        {/* Sleeper Icon */}

                        <div className="flex items-center gap-1 h-5">
                          {item.type === "single" && <img src={sleeper} />}

                          {item.type === "double" && (
                            <>
                              <img src={sleeper} />
                              <img src={sleeper} />
                            </>
                          )}
                        </div>

                        {/* Card Content */}

                        <h3 className="text-[14px] font-semibold text-gray-900 mt-4">
                          {item.title}
                        </h3>

                        <p className="text-[12px] text-[#64748B] mt-1">
                          {item.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
