import { useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Check,
  ChevronRight,
  CircleHelp,
  Eye,
  FileText,
  Minus,
  Plus,
  Save,
  Trash2,
  UserRound,
} from "lucide-react";
import VendorNavbar from "./VendorNavbar";
import seatImage from "../../assets/seat.svg";
import sleeperImage from "../../assets/sleeper.svg";

// -------------------- Helper Functions --------------------

const getValidCount = (value, defaultCount) => {
  const count = Number(value);
  return value !== null && Number.isFinite(count) && count >= 0
    ? Math.floor(count)
    : defaultCount;
};

const getDefaultComponent = (layoutType) => {
  return layoutType === "Sleepers Only" ? "sleepers" : "seats";
};

const availableComponentForLayout = (layoutType, component) => {
  if (layoutType === "Seats Only") return "seats";
  if (layoutType === "Sleepers Only") return "sleepers";
  return component === "sleepers" ? "sleepers" : "seats";
};

const makeRows = (side, count, component) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `${side}-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
    component,
    units: 1,
    selected: false,
  }));
};

const getCapacityForRow = (row, seatType, sleeperType) => {
  if (row.component === "seats") {
    const seatCapacity =
      seatType === "Triple Seater" ? 3 : seatType === "Double Seater" ? 2 : 1;
    return row.units * seatCapacity;
  }

  const sleeperCapacity = sleeperType === "Double Sleeper" ? 2 : 1;
  return row.units * sleeperCapacity;
};

// -------------------- Page Component --------------------

const VendorDeckArrangementPage = () => {
  // -------------------- Params --------------------

  const { deckType } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const previewRef = useRef(null);

  // -------------------- Configuration Values --------------------

  const layoutOptions = ["Seats Only", "Seats + Sleepers", "Sleepers Only"];
  const requestedLayout = searchParams.get("layoutType");
  const layoutType = layoutOptions.includes(requestedLayout)
    ? requestedLayout
    : "Seats + Sleepers";
  const seatTypes = ["Single Seater", "Double Seater", "Triple Seater"];
  const sleeperTypes = ["Single Sleeper", "Double Sleeper"];
  const requestedSeatType = searchParams.get("seatType");
  const requestedSleeperType = searchParams.get("sleeperType");
  const seatType = seatTypes.includes(requestedSeatType)
    ? requestedSeatType
    : "Double Seater";
  const sleeperType = sleeperTypes.includes(requestedSleeperType)
    ? requestedSleeperType
    : "Single Sleeper";
  const busId = searchParams.get("busId") || "bus";
  const deckNames = deckType === "double" ? ["Lower Deck", "Upper Deck"] : ["Lower Deck"];

  // -------------------- States --------------------

  const getInitialDeckRows = () => {
    const lowerDriverCount = getValidCount(searchParams.get("lowerDriver"), 4);
    const lowerOppositeCount = getValidCount(searchParams.get("lowerOpposite"), 4);
    const upperDriverCount = getValidCount(searchParams.get("upperDriver"), 4);
    const upperOppositeCount = getValidCount(searchParams.get("upperOpposite"), 4);
    const defaultComponent = getDefaultComponent(layoutType);

    const initialRows = {
      lower: {
        driver: makeRows("lower-driver", lowerDriverCount, defaultComponent),
        opposite: makeRows("lower-opposite", lowerOppositeCount, defaultComponent),
      },
      upper: {
        driver: makeRows("upper-driver", deckType === "double" ? upperDriverCount : 0, defaultComponent),
        opposite: makeRows("upper-opposite", deckType === "double" ? upperOppositeCount : 0, defaultComponent),
      },
    };

    // Restore a locally saved draft when the same bus returns to this page.
    try {
      const savedDraft = window.localStorage.getItem(`bus-layout-draft-${busId}`);
      if (savedDraft) {
        const savedData = JSON.parse(savedDraft);
        savedData.decks.forEach((deck) => {
          const deckKey = deck.name === "Lower Deck" ? "lower" : "upper";
          if (deckKey === "upper" && deckType !== "double") return;

          deck.sides.forEach((side) => {
            const sideKey = side.name === "driver" ? "driver" : "opposite";
            initialRows[deckKey][sideKey] = side.rows.map((row) => ({
              id: row.rowId,
              component: availableComponentForLayout(layoutType, row.componentType),
              units: getValidCount(String(row.units), 1),
              selected: false,
            }));
          });
        });
      }
    } catch {
      // Ignore malformed local draft data and use the row counts from the URL.
    }

    return initialRows;
  };

  const [deckRows, setDeckRows] = useState(getInitialDeckRows);
  const initialDeck = searchParams.get("deckPosition") === "Upper Deck" && deckType === "double"
    ? "upper"
    : "lower";
  const [activeDeck, setActiveDeck] = useState(initialDeck);
  const [zoom, setZoom] = useState(100);
  const [message, setMessage] = useState("");
  const [savePayload, setSavePayload] = useState(null);

  // -------------------- Data --------------------

  const activeRows = deckRows[activeDeck];
  const availableComponents = layoutType === "Seats Only"
    ? ["seats"]
    : layoutType === "Sleepers Only"
      ? ["sleepers"]
      : ["seats", "sleepers"];

  const totalCapacity = deckNames.reduce((deckTotal, deckName) => {
    const deckKey = deckName === "Lower Deck" ? "lower" : "upper";
    const rowsForDeck = deckRows[deckKey];
    const sideCapacity = [...rowsForDeck.driver, ...rowsForDeck.opposite].reduce(
      (sideTotal, row) => sideTotal + getCapacityForRow(row, seatType, sleeperType),
      0,
    );
    return deckTotal + sideCapacity;
  }, 0);

  const activeCapacity = [...activeRows.driver, ...activeRows.opposite].reduce(
    (total, row) => total + getCapacityForRow(row, seatType, sleeperType),
    0,
  );

  // -------------------- Functions --------------------

  const updateRows = (side, updateFunction) => {
    setDeckRows((currentRows) => ({
      ...currentRows,
      [activeDeck]: {
        ...currentRows[activeDeck],
        [side]: updateFunction(currentRows[activeDeck][side]),
      },
    }));
  };

  const addRow = (side) => {
    const component = getDefaultComponent(layoutType);
    updateRows(side, (rows) => [
      ...rows,
      ...makeRows(`${activeDeck}-${side}`, 1, component),
    ]);
    setMessage("");
  };

  const updateRow = (side, rowId, key, value) => {
    updateRows(side, (rows) => rows.map((row) => {
      if (row.id !== rowId) return row;
      const updatedValue = key === "component" && !availableComponents.includes(value)
        ? availableComponents[0]
        : value;
      return { ...row, [key]: updatedValue };
    }));
    setMessage("");
  };

  const deleteRow = (side, rowId) => {
    updateRows(side, (rows) => rows.filter((row) => row.id !== rowId));
    setMessage("");
  };

  const changeUnits = (side, row, change) => {
    updateRow(side, row.id, "units", Math.max(0, row.units + change));
  };

  const handleBack = () => {
    const params = new URLSearchParams(searchParams);
    navigate(`/vendor/seat-layout/rows/${deckType}?${params.toString()}`);
  };

  const handlePreview = () => {
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const createSavePayload = () => {
    return {
      busId,
      deckType,
      layoutType,
      seatType,
      sleeperType,
      decks: deckNames.map((deckName) => {
        const deckKey = deckName === "Lower Deck" ? "lower" : "upper";
        const deckConfig = deckRows[deckKey];
        return {
          name: deckName,
          sides: ["driver", "opposite"].map((side) => ({
            name: side,
            rows: deckConfig[side].map((row, index) => ({
              rowId: row.id,
              rowNumber: index + 1,
              componentType: row.component,
              subtype: row.component === "seats" ? seatType : sleeperType,
              units: row.units,
              passengerCapacity: getCapacityForRow(row, seatType, sleeperType),
            })),
          })),
        };
      }),
      totalCapacity,
    };
  };

  const handleSaveDraft = () => {
    const draft = createSavePayload();
    try {
      window.localStorage.setItem(`bus-layout-draft-${busId}`, JSON.stringify(draft));
      setMessage("Draft saved in this browser.");
    } catch {
      setMessage("Could not save the draft in this browser.");
    }
  };

  const handleSaveLayout = () => {
    const payload = createSavePayload();
    setSavePayload(payload);
    if (payload.decks.some((deck) => deck.sides.some((side) => side.rows.length === 0))) {
      setMessage("Add at least one row on each side before saving the layout.");
      return;
    }

    // No layout-save API exists in this project yet. Keep the prepared payload
    // in page state and clearly report that it has not been sent to a backend.
    setMessage("Layout is ready, but no backend save service is configured yet.");
  };

  const changeZoom = (change) => {
    setZoom((currentZoom) => Math.min(125, Math.max(75, currentZoom + change)));
  };

  const renderRowCards = (side, sideName) => {
    const rows = activeRows[side];

    return (
      <section className="mt-4" key={side}>
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h3 className="text-[12px] mb-1 font-semibold text-slate-800">
              {sideName} Configuration
            </h3>
            <p className="text-[10px] text-slate-600 mb-2">
              {rows.length} rows · {rows.reduce((sum, row) => sum + row.units, 0)} units
            </p>
          </div>

          <button
            type="button"
            onClick={() => addRow(side)}
            className="flex h-6 items-center gap-1 rounded-md border border-[#b9dfe3] px-2 text-[12px] font-medium text-[#087f8c] hover:bg-[#f0fafa]"
          >
            <Plus size={11} />
            Add Row
          </button>
        </div>

        <div className="mb-1 flex items-center gap-2 px-1">
          <input
            type="checkbox"
            checked={rows.length > 0 && rows.every((row) => row.selected)}
            onChange={(event) =>
              updateRows(side, (current) =>
                current.map((row) => ({
                  ...row,
                  selected: event.target.checked,
                }))
              )
            }
            className="h-3 w-3 accent-[#087f8c]"
            aria-label={`Select all ${sideName} rows`}
          />
          <span className="text-[12px] text-slate-600">
            {sideName} Rows
          </span>
        </div>

        <div className="space-y-1.5">
          {rows.map((row, index) => (
            <div
              key={row.id}
              className="grid grid-cols-[12px_25px_minmax(0,1fr)_82px_15px] items-center gap-3 rounded-md border border-[#e7edf2] bg-[#f9fbfd] px-1.5 py-1.5"
            >
              <input
                type="checkbox"
                checked={row.selected}
                onChange={(event) =>
                  updateRow(
                    side,
                    row.id,
                    "selected",
                    event.target.checked
                  )
                }
                className="h-4 w-4 accent-[#087f8c]"
                aria-label={`Select row ${index + 1}`}
              />

              <div className="flex flex-col items-center leading-tight">
                <span className="text-[12px] font-semibold text-slate-700">
                  R{index + 1}
                </span>
                <span className="text-[9px] text-slate-400">
                  {side === "driver" ? "Driver" : "Opp."}
                </span>
              </div>

              <label className="min-w-0">
                <span className="mb-0.5 block text-[12px] text-slate-400">
                  COMPONENT
                </span>

                <select
                  value={
                    availableComponents.includes(row.component)
                      ? row.component
                      : availableComponents[0]
                  }
                  onChange={(event) =>
                    updateRow(
                      side,
                      row.id,
                      "component",
                      event.target.value
                    )
                  }
                  className="h-8 w-full min-w-0 rounded border border-[#dfe7ed] bg-white px-1 text-[12px] text-slate-700 outline-none focus:border-[#087f8c]"
                >
                  {availableComponents.map((component) => (
                    <option key={component} value={component}>
                      {component === "seats" ? "Seats" : "Sleepers"}
                    </option>
                  ))}
                </select>
              </label>

              <div className="min-w-0">
                <span className="mb-0.5 block text-[12px] text-slate-400">
                  UNITS
                </span>

                <div className="flex h-8 items-center justify-between rounded border border-[#dfe7ed]">
                  <button
                    type="button"
                    onClick={() => changeUnits(side, row, -1)}
                    aria-label={`Decrease row ${index + 1} units`}
                    className="flex h-full w-5 items-center justify-center text-slate-500 hover:bg-slate-50"
                  >
                    <Minus size={11} />
                  </button>

                  <span className="text-[11px] font-medium text-slate-700">
                    {row.units}
                  </span>

                  <button
                    type="button"
                    onClick={() => changeUnits(side, row, 1)}
                    aria-label={`Increase row ${index + 1} units`}
                    className="flex h-full w-5 items-center justify-center text-slate-500 hover:bg-slate-50"
                  >
                    <Plus size={11} />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => deleteRow(side, row.id)}
                aria-label={`Delete row ${index + 1}`}
                className="mt-3 flex h-5 w-4 items-center justify-center text-rose-400 hover:text-rose-600"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}

          {rows.length === 0 && (
            <p className="rounded border border-dashed border-slate-200 py-3 text-center text-[9px] text-slate-400">
              No rows configured
            </p>
          )}
        </div>
      </section>
    );
  };

  const renderPreviewRow = (row, index, side) => {
    const unitCount = Math.max(1, row.units);
    return (
      <div key={row.id} className={`flex min-h-10 items-center gap-1 ${side === "opposite" ? "justify-end" : "justify-start"}`}>
        {side === "driver" && <span className="w-5 text-[9px] text-slate-400">R{index + 1}</span>}
        <div className="flex flex-wrap items-center gap-1">
          {row.units === 0 ? (
            <div className="flex h-9 min-w-14 items-center justify-center rounded border border-dashed border-slate-300 text-[9px] text-slate-400">Empty</div>
          ) : Array.from({ length: unitCount }, (_, unitIndex) => (
            <div key={`${row.id}-unit-${unitIndex}`} className="flex min-h-9 items-center justify-center gap-0.5 rounded border border-[#dce4eb] bg-white px-1 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              {row.component === "seats" ? (
                Array.from({
                  length: seatType === "Triple Seater" ? 3 : seatType === "Double Seater" ? 2 : 1,
                }, (_, seatIndex) => <img key={`${row.id}-${unitIndex}-seat-${seatIndex}`} src={seatImage} alt="Seat" className="h-[25px] w-[17px]" />)
              ) : sleeperType === "Double Sleeper" ? (
                <div className="flex flex-col gap-0.5">
                  <img src={sleeperImage} alt="Upper sleeper berth" className="h-[13px] w-[28px]" />
                  <img src={sleeperImage} alt="Lower sleeper berth" className="h-[13px] w-[28px]" />
                </div>
              ) : (
                <img src={sleeperImage} alt="Sleeper berth" className="h-[22px] w-[38px]" />
              )}
              <span className="ml-0.5 text-[8px] text-slate-400">{index + 1}.{unitIndex + 1}</span>
            </div>
          ))}
        </div>
        {side === "opposite" && <span className="w-5 text-right text-[9px] text-slate-400">R{index + 1}</span>}
      </div>
    );
  };

  // -------------------- UI --------------------

  return (
    <div className="min-h-screen bg-[#f7f9fa]">
      <VendorNavbar />

      {/* Breadcrumbs and Page Heading */}
      <header className="mx-auto w-[94%] pt-3">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span>Fleet</span><ChevronRight size={12} />
          <span>My Buses</span><ChevronRight size={12} />
          <span>Seat Layout Management</span><ChevronRight size={12} />
          <span>Seat Layout Management</span><ChevronRight size={12} />
          <span className="font-medium text-gray-900">Create Layout</span>
        </nav>
        <div className="mt-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-[#0E7A88]">STEP 3 OF 3</p>
            <h1 className="mt-1 text-xl font-semibold text-slate-800">Modify Your Seating Arrangements</h1>
            <p className="mt-1 text-xs text-slate-500">Choose the passenger components available on each deck. You’ll arrange individual rows next.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleSaveDraft} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50"><FileText size={14} /> Save Draft</button>
            <button type="button" onClick={handlePreview} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50"><Eye size={14} /> Preview</button>
            <button type="button" onClick={handleSaveLayout} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#0E7A88] px-3 text-xs font-semibold text-white hover:bg-[#0d6f7b]"><Save size={14} /> Save Layout</button>
          </div>
        </div>
      </header>

      {/* Main Configuration and Preview */}
      <main className="mx-auto w-[94%]  pb-7 pt-4">
        {message && <div role="status" className="mb-3 rounded-md border border-[#c9e1e4] bg-[#f2fafa] px-3 py-2 text-xs text-[#27636b]">{message}</div>}
        <div className="grid overflow-hidden rounded-xl border border-slate-100 bg-white lg:h-[calc(100vh-190px)] lg:min-h-[540px] lg:grid-cols-2">
          {/* Left Panel */}
          <section className="min-h-0 border-b border-slate-200 lg:overflow-y-auto lg:border-b-0 lg:border-r">
            <div className="p-3 sm:p-4">
              {/* Deck tabs */}
              <div className="flex rounded-md bg-[#f0f4f7] p-1">
                {deckNames.map((deckName) => {
                  const deckKey =
                    deckName === "Lower Deck" ? "lower" : "upper";

                  return (
                    <button
                      key={deckKey}
                      type="button"
                      onClick={() => {
                        setActiveDeck(deckKey);
                        setMessage("");
                      }}
                      className={`flex-1 rounded px-3 py-1.5 text-[13px] transition ${activeDeck === deckKey
                        ? "bg-white font-semibold text-[#087f8c] shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                      {deckName}
                    </button>
                  );
                })}
              </div>

              {/* Arrangement heading */}
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-wide text-slate-400">
                    Arrangement Configuration
                  </p>

                  <h2 className="mt-1 text-[12px] font-semibold text-slate-800">
                    {activeDeck === "lower" ? "Lower Deck" : "Upper Deck"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1 text-[12px] font-medium text-[#087f8c] hover:underline"
                >
                  <FileText size={10} />
                  Edit deck setup
                </button>
              </div>

              {/* Compact summary cards */}
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {[
                  {
                    label: "LAYOUT TYPE",
                    value: layoutType,
                  },
                  {
                    label: "TOTAL CAPACITY",
                    value: `${totalCapacity}`,
                  },
                  {
                    label: "DRIVER SIDE",
                    value: `${activeRows.driver.length} rows`,
                  },
                  {
                    label: "OPPOSITE SIDE",
                    value: `${activeRows.opposite.length} rows`,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="min-w-0 rounded-md bg-[#f4f7f9] px-2 py-2"
                  >
                    <p className="text-[10px] font-medium text-slate-400">
                      {item.label}
                    </p>

                    <p className="mt-1 truncate text-[12px] font-semibold text-slate-700">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Row configurations */}
              {renderRowCards("driver", "Driver-Side")}
              {renderRowCards("opposite", "Opposite-Side")}
            </div>
          </section>

          {/* Right Panel: Live Preview */}
          <section
            ref={previewRef}
            className="flex min-w-0 flex-col bg-white p-3 sm:p-4"
          >
            {/* Preview heading */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[7px] font-semibold tracking-widest text-slate-500">
                    LIVE PREVIEW
                  </span>
                </div>

                <h2 className="mt-1 text-[11px] font-semibold text-slate-800">
                  {activeDeck === "lower" ? "Lower Deck" : "Upper Deck"} Floor Plan
                </h2>

                <p className="text-[10px] text-slate-400">
                  Select any row or component to edit
                </p>
              </div>

              {/* Zoom */}
              <div className="flex h-8 px-2 items-center rounded-full border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => changeZoom(-10)}
                  aria-label="Zoom out"
                  className="flex h-5 w-5 items-center justify-center text-slate-500"
                >
                  <Minus size={11} />
                </button>

                <span className="min-w-7 text-center text-[10px] text-slate-600">
                  {zoom}%
                </span>

                <button
                  type="button"
                  onClick={() => changeZoom(10)}
                  aria-label="Zoom in"
                  className="flex h-5 w-5 items-center justify-center text-slate-500"
                >
                  <Plus size={11} />
                </button>
              </div>
            </div>

            {/* Floor-plan canvas */}
            <div className="mt-3 flex-1 rounded-xl border border-[#e4ebf0] bg-white p-3 sm:p-4">
              {/* Canvas header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="rounded border border-[#cbe8eb] bg-[#f0f9fa] px-2 py-1 text-[7px] font-semibold text-[#087f8c]">
                  {activeDeck === "lower" ? "LOWER DECK" : "UPPER DECK"}
                </span>

                <div className="flex flex-col items-center gap-0.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-slate-500">
                    <UserRound size={12} />
                  </div>
                  <span className="text-[6px] font-medium text-slate-400">
                    DRIVER
                  </span>
                </div>
              </div>

              {/* Bus layout */}
              <div className="min-h-[340px] overflow-auto pt-3">
                <div
                  className="mx-auto w-full min-w-[220px] origin-top transition-transform duration-150"
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: "top center",
                  }}
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_12px_minmax(0,1fr)] gap-2">
                    {/* Driver-side components */}
                    <div className="space-y-2">
                      {activeRows.driver.map((row, index) => (
                        <button
                          key={row.id}
                          type="button"
                          onClick={() =>
                            updateRow("driver", row.id, "selected", !row.selected)
                          }
                          className={`flex min-h-[40px] w-full items-center justify-center gap-1 rounded-md border px-1 transition ${row.selected
                            ? "border-[#087f8c] bg-[#f0fafa]"
                            : "border-transparent bg-white"
                            }`}
                        >
                          {row.units === 0 ? (
                            <span className="text-[7px] text-slate-400">Empty</span>
                          ) : (
                            <div className="flex flex-wrap items-center justify-center gap-1">
                              {Array.from(
                                { length: row.units },
                                (_, unitIndex) => (
                                  <div
                                    key={`${row.id}-${unitIndex}`}
                                    className="flex min-h-[48px] items-center justify-center gap-0.5 rounded-md border-[#dce4eb] bg-white px-1"
                                  >
                                    {row.component === "seats" ? (
                                      Array.from(
                                        {
                                          length:
                                            seatType === "Triple Seater"
                                              ? 3
                                              : seatType === "Double Seater"
                                                ? 2
                                                : 1,
                                        },
                                        (_, seatIndex) => (
                                          <img
                                            key={seatIndex}
                                            src={seatImage}
                                            alt="Seat"
                                            className="h-[37px] w-[33px] object-contain"
                                          />
                                        )
                                      )
                                    ) : (
                                      <img
                                        src={sleeperImage}
                                        alt="Sleeper berth"
                                        className="h-[37px]  w-[43px] object-"
                                      />
                                    )}

                                    <span className="text-[11px] font-medium text-slate-600">
                                      {index + 1}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </button>
                      ))}

                      {activeRows.driver.length === 0 && (
                        <p className="py-5 text-center text-[8px] text-slate-400">
                          No rows
                        </p>
                      )}
                    </div>

                    {/* Center aisle */}
                    <div className="relative flex justify-center">
                      <div className="absolute inset-y-0 border-l border-dashed border-slate-200" />
                    </div>

                    {/* Opposite-side components */}
                    <div className="space-y-2">
                      {activeRows.opposite.map((row, index) => (
                        <button
                          key={row.id}
                          type="button"
                          onClick={() =>
                            updateRow("opposite", row.id, "selected", !row.selected)
                          }
                          className={`flex min-h-[40px] w-full items-center justify-center rounded-md border px-1 transition ${row.selected
                            ? "border-[#087f8c] bg-[#f0fafa]"
                            : "border-transparent bg-white"
                            }`}
                        >
                          {row.units === 0 ? (
                            <span className="text-[7px] text-slate-400">Empty</span>
                          ) : (
                            <div className="flex flex-wrap items-center justify-center gap-1">
                              {Array.from(
                                { length: row.units },
                                (_, unitIndex) => (
                                  <div
                                    key={`${row.id}-${unitIndex}`}
                                    className="flex min-h-[38px] items-center justify-center gap-0.5 rounded border border-[#dce4eb] bg-white px-1"
                                  >
                                    {row.component === "seats" ? (
                                      Array.from(
                                        {
                                          length:
                                            seatType === "Triple Seater"
                                              ? 3
                                              : seatType === "Double Seater"
                                                ? 2
                                                : 1,
                                        },
                                        (_, seatIndex) => (
                                          <img
                                            key={seatIndex}
                                            src={seatImage}
                                            alt="Seat"
                                            className="h-[37px] w-[33px] object-"
                                          />
                                        )
                                      )
                                    ) : sleeperType === "Double Sleeper" ? (
                                      <div className="flex flex-col gap-0.5">
                                        <img
                                          src={sleeperImage}
                                          alt="Upper berth"
                                          className="h-[37px]  w-[43px] -"
                                        />
                                        <img
                                          src={sleeperImage}
                                          alt="Lower berth"
                                          className="h-[37px]  w-[43px] "
                                        />
                                      </div>
                                    ) : (
                                      <img
                                        src={sleeperImage}
                                        alt="Sleeper berth"
                                        className="h-[37px] w-[43px] "
                                      />
                                    )}

                                    <span className="text-[7px] font-medium text-slate-600">
                                      {index + 1}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </button>
                      ))}

                      {activeRows.opposite.length === 0 && (
                        <p className="py-5 text-center text-[8px] text-slate-400">
                          No rows
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rear divider */}
              <div className="mt-2 border-t border-[#cbd9de] pt-2 text-center">
                <span className="text-[8px] tracking-[0.2em] text-slate-400">
                  REAR
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-4 flex justify-between">
          <button type="button" onClick={handleBack} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">Back</button>
          <div className="flex items-center gap-2 text-[10px] text-slate-400" aria-live="polite">
            {savePayload && <><Check size={13} /> Payload prepared</>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorDeckArrangementPage;
