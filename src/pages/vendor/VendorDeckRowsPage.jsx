import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronRight, Circle, Minus, Plus } from "lucide-react";
import VendorNavbar from "./VendorNavbar";
import BusFlowStepper from "./BusManagement/BusFlowStepper";

// -------------------- Helper Function --------------------

const getCount = (value, defaultValue) => {
  const number = Number(value);
  return value !== null && Number.isFinite(number) && number >= 0
    ? Math.floor(number)
    : defaultValue;
};

// -------------------- Page Component --------------------

const VendorDeckRowsPage = () => {
  // -------------------- Params --------------------

  const { deckType } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // -------------------- States --------------------

  const [lowerDriver, setLowerDriver] = useState(
    getCount(searchParams.get("lowerDriver"), 4),
  );
  const [lowerOpposite, setLowerOpposite] = useState(
    getCount(searchParams.get("lowerOpposite"), 4),
  );
  const [upperDriver, setUpperDriver] = useState(
    getCount(searchParams.get("upperDriver"), 4),
  );
  const [upperOpposite, setUpperOpposite] = useState(
    getCount(searchParams.get("upperOpposite"), 4),
  );

  // -------------------- Data --------------------

  const deckCards = [
    {
      name: "Lower Deck",
      key: "lower",
      driverCount: lowerDriver,
      oppositeCount: lowerOpposite,
      setDriverCount: setLowerDriver,
      setOppositeCount: setLowerOpposite,
    },
    ...(deckType === "double"
      ? [
        {
          name: "Upper Deck",
          key: "upper",
          driverCount: upperDriver,
          oppositeCount: upperOpposite,
          setDriverCount: setUpperDriver,
          setOppositeCount: setUpperOpposite,
        },
      ]
      : []),
  ];

  // -------------------- Functions --------------------

  const changeCount = (setCount, currentCount, change) => {
    setCount(Math.max(0, currentCount + change));
  };

  const makePageParams = () => {
    const params = new URLSearchParams({
      deckPosition: searchParams.get("deckPosition") || "Lower Deck",
      busId: searchParams.get("busId") || "bus",
      layoutType: searchParams.get("layoutType") || "Seats + Sleepers",
      seatType: searchParams.get("seatType") || "Double Seater",
      sleeperType: searchParams.get("sleeperType") || "Single Sleeper",
      lowerDriver: String(lowerDriver),
      lowerOpposite: String(lowerOpposite),
      upperDriver: String(upperDriver),
      upperOpposite: String(upperOpposite),
    });
    ["seatTypes", "sleeperTypes"].forEach((key) => {
      const values = searchParams.getAll(key);
      values.forEach((value) => params.append(key, value));
    });
    return params;
  };

  const handleBack = () => {
    navigate(
      `/vendor/seatGeneration/${searchParams.get("busId") || "bus"}/deckSelection/${deckType}?${makePageParams().toString()}`,
    );
  };

  const handleContinue = () => {
    navigate(
      `/vendor/seat-layout/arrangements/${deckType}?${makePageParams().toString()}`,
    );
  };

  // -------------------- UI --------------------

  return (
    <div className="min-h-screen bg-[#f7f9fa]">
      <VendorNavbar />
      <div className="mx-auto mt-4 w-[94%] max-w-6xl"><BusFlowStepper currentStep={3} /></div>

      {/* Breadcrumb Navigation */}
      <header className="m-auto mt-3 w-[94%]">
        <nav className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span>Fleet</span><ChevronRight size={12} className="text-gray-400" />
          <span>My Buses</span><ChevronRight size={12} className="text-gray-400" />
          <span>Bus details</span><ChevronRight size={12} className="text-gray-400" />
          <span className="font-medium text-gray-900">Rows &amp; arrangement</span>
        </nav>
      </header>

      {/* Page Heading */}
      <main className="m-auto w-[94%] pb-8 pt-5">
        <p className="text-sm font-semibold text-[#007B8A]">STEP 2 OF 3</p>
        <h1 className="mt-2 text-xl font-semibold">Configure Your Deck Rows</h1>
        <p className="mt-2 text-sm text-[#64748B]">
          Choose the passenger components available on each deck. You&apos;ll arrange individual rows next.
        </p>

        {/* Main Configuration Container */}
        <div className="mt-5 grid grid-cols-1 gap-6 rounded-xl border border-gray-100 bg-white p-4 shadow sm:p-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
          {/* Left Side: Row Counts */}
          <section className="space-y-4">
            {deckCards.map((deck) => (
              <div key={deck.key} className="rounded-xl border border-gray-200 p-4 sm:p-5">
                <h2 className="text-base font-semibold text-gray-900">{deck.name} Row Positions</h2>
                <div className="mt-4 space-y-3">
                  {[{
                    label: "Driver Side", count: deck.driverCount, setCount: deck.setDriverCount,
                  }, {
                    label: "Opposite Side", count: deck.oppositeCount, setCount: deck.setOppositeCount,
                  }].map((side) => (
                    <div key={side.label} className="flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-700">{side.label}</span>
                      <div className="flex items-center gap-3">
                        <button type="button" aria-label={`Remove ${side.label} position`} onClick={() => changeCount(side.setCount, side.count, -1)} className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50">
                          <Minus size={15} />
                        </button>
                        <span className="w-5 text-center text-sm font-semibold">{side.count}</span>
                        <button type="button" aria-label={`Add ${side.label} position`} onClick={() => changeCount(side.setCount, side.count, 1)} className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50">
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 rounded-lg bg-[#eff9fb] p-3 text-xs leading-5 text-[#39717a]">
                  Each side can have a different number of row positions. Adjusting the counts preserves your existing configuration.
                </p>
              </div>
            ))}
          </section>

          {/* -------------------- Right Side: Deck Preview -------------------- */}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {deckCards.map((deck) => (
              <div
                key={deck.key}
                className="min-h-[345px]  rounded-xl border border-gray-200 bg-white p-8"
              >

                {/* -------------------- Deck Header -------------------- */}

                <div className="flex items-center justify-between ">

                  <span className="rounded-md border border-[#CBE8EB] bg-[#F0F9FA] px-2 py-1 text-[9px] font-semibold text-[#087F8C]">
                    {deck.name.toUpperCase()}
                  </span>

                  <div className="flex flex-col items-center gap-1">

                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-500">
                      <Circle size={15} />
                    </div>

                    <span className="text-[7px] font-medium text-gray-400">
                      DRIVER
                    </span>

                  </div>

                </div>

                {/* -------------------- Seat Layout -------------------- */}

                <div className="mt-5 grid  grid-cols-[1fr_14px_1fr] gap-1">

                  {/* -------------------- Driver Side -------------------- */}

                  <div className="flex flex-col gap-2 ">

                    {Array.from(
                      { length: deck.driverCount },
                      (_, index) => (
                        <div
                          key={`${deck.key}-driver-${index}`}
                          className="relative flex h-[32px]  items-center justify-center rounded-[4px] border border-[#DCE4EB] bg-[#E5EBF1]"
                        >

                          {/* Row Number */}

                          <span className="absolute -left-6 text-[12px] text-gray-400">
                            R{index + 1}
                          </span>

                        </div>
                      )
                    )}

                  </div>

                  {/* -------------------- Center Aisle -------------------- */}

                  <div className="flex flex-col items-center gap-2">

                    {Array.from(
                      {
                        length: Math.max(
                          deck.driverCount,
                          deck.oppositeCount
                        ),
                      },
                      (_, index) => (
                        <div
                          key={`${deck.key}-aisle-${index}`}
                          className="flex h-[32px] w-full items-center justify-center"
                        >

                          <div className="h-full border-l border-dashed border-gray-200"></div>

                        </div>
                      )
                    )}

                  </div>

                  {/* -------------------- Opposite Side -------------------- */}

                  <div className="flex flex-col gap-2">

                    {Array.from(
                      { length: deck.oppositeCount },
                      (_, index) => (
                        <div
                          key={`${deck.key}-opposite-${index}`}
                          className="relative flex h-[32px] items-center justify-center rounded-[4px] border border-[#DCE4EB] bg-[#E5EBF1]"
                        >

                          {/* Row Number */}

                          <span className="absolute -right-6 text-[12px] text-gray-400">
                            R{index + 1}
                          </span>

                        </div>
                      )
                    )}

                  </div>

                </div>

                {/* -------------------- Rear Divider -------------------- */}

                <div className="mt-3 border-t border-[#A8C8CF] pt-2 text-center">

                  <span className="text-[12px] tracking-widest text-gray-400">
                    REAR
                  </span>

                </div>

              </div>
            ))}

          </section>
        </div>

        {/* Bottom Action Buttons */}
        <div className="mt-5 flex flex-col-reverse justify-between gap-3 sm:flex-row">
          <button type="button" onClick={handleBack} className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">Back</button>
          <button type="button" onClick={handleContinue} className="rounded-lg bg-[#0E7A88] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0d6f7b]">Continue to Arrangements</button>
        </div>
      </main>
    </div>
  );
};

export default VendorDeckRowsPage;
