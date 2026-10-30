import { ChevronRight, Check, ArrowLeft } from "lucide-react";
import VendorNavbar from "./VendorNavbar";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import seat from "../../assets/seat.svg";
import sleeper from "../../assets/sleeper.svg";
import BusFlowStepper from "./BusManagement/BusFlowStepper";

const deckTypeData = ["Lower Deck", "Upper Deck"];

export const VendorDeckSelectionPage = () => {
  // -------------------- Params --------------------

  const { deckType, busId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // -------------------- States --------------------

  const [selectedDeckPostion, setSelectedDeckPostion] = useState(
    searchParams.get("deckPosition") || "Lower Deck",
  );

  // Deck layout type
  const [selectedLayoutType, setSelectedLayoutType] = useState(
    searchParams.get("layoutType") || "Seats + Sleepers",
  );

  // Default seat configuration
  const seatTypeOptions = ["Single Seater", "Double Seater", "Triple Seater"];
  const sleeperTypeOptions = ["Single Sleeper", "Double Sleeper"];
  const getSelectedTypes = (paramName, legacyParamName, options, fallback) => {
    const savedTypes = searchParams.getAll(paramName);
    const legacyType = searchParams.get(legacyParamName);
    const selectedTypes = (savedTypes.length ? savedTypes : [legacyType || fallback])
      .filter((type) => options.includes(type));
    return selectedTypes.length ? selectedTypes : [fallback];
  };

  const [selectedSeatTypes, setSelectedSeatTypes] = useState(() =>
    getSelectedTypes("seatTypes", "seatType", seatTypeOptions, "Double Seater"),
  );

  // Sleeper configuration
  const [selectedSleeperTypes, setSelectedSleeperTypes] = useState(() =>
    getSelectedTypes("sleeperTypes", "sleeperType", sleeperTypeOptions, "Single Sleeper"),
  );

  const handleContinue = () => {
    const params = new URLSearchParams({
      deckPosition: selectedDeckPostion,
      busId: busId || searchParams.get("busId") || "bus",
      layoutType: selectedLayoutType,
      seatType: selectedSeatTypes[0],
      sleeperType: selectedSleeperTypes[0],
    });
    selectedSeatTypes.forEach((type) => params.append("seatTypes", type));
    selectedSleeperTypes.forEach((type) => params.append("sleeperTypes", type));
    ["lowerDriver", "lowerOpposite", "upperDriver", "upperOpposite"].forEach(
      (key) => {
        const value = searchParams.get(key);
        if (value !== null) params.set(key, value);
      },
    );
    navigate(`/vendor/seat-layout/rows/${deckType}?${params.toString()}`);
  };

  const toggleType = (type, selectedTypes, setSelectedTypes) => {
    setSelectedTypes((current) => {
      if (current.includes(type)) {
        // Keep at least one valid configuration selected.
        return current.length > 1 ? current.filter((value) => value !== type) : current;
      }
      return [...current, type];
    });
  };

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
           <div className="mx-auto mt-4 w-[94%] "><BusFlowStepper currentStep={2} /></div>

       

        {/* -------------------- Main Content -------------------- */}

        <div className="main-container w-[94%] m-auto mt-1 pb-4">
          {/* Step */}

          {/* <h1 className="text-[#007B8A] font-semibold text-sm">STEP 2 OF 4</h1> */}

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
                    const isSelected = selectedSeatTypes.includes(item.title);

                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => toggleType(item.title, selectedSeatTypes, setSelectedSeatTypes)}
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
                    const isSelected = selectedSleeperTypes.includes(item.title);

                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => toggleType(item.title, selectedSleeperTypes, setSelectedSleeperTypes)}
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

          <div className="mt-5 flex justify-between">
            <button
              type="button"
              onClick={() => navigate(`/vendor/seatGeneration/${busId || searchParams.get("busId") || "bus"}`)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />Back
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="rounded-lg bg-[#0E7A88] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0d6f7b]"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
