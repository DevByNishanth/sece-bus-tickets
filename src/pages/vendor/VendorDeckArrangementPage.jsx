import { useParams, useSearchParams } from "react-router-dom";
import VendorNavbar from "./VendorNavbar";

// This placeholder confirms the data received from Step 2.
const VendorDeckArrangementPage = () => {
  const { deckType } = useParams();
  const [searchParams] = useSearchParams();

  return (
    <div className="min-h-screen bg-[#f7f9fa]">
      <VendorNavbar />
      <main className="m-auto w-[94%] py-8">
        <p className="text-sm font-semibold text-[#007B8A]">STEP 3 OF 3</p>
        <h1 className="mt-2 text-xl font-semibold">Deck Arrangements</h1>
        <p className="mt-2 text-sm text-[#64748B]">
          Step 2 data received for the {deckType} deck layout.
        </p>
        <div className="mt-5 rounded-xl border border-gray-100 bg-white p-5 text-sm text-gray-700 shadow">
          <p>Layout: {searchParams.get("layoutType") || "Not selected"}</p>
          <p className="mt-2">Seat type: {searchParams.get("seatType") || "Not selected"}</p>
          <p className="mt-2">Sleeper type: {searchParams.get("sleeperType") || "Not selected"}</p>
          <p className="mt-2">Lower deck positions: {searchParams.get("lowerDriver") || 0} driver side, {searchParams.get("lowerOpposite") || 0} opposite side</p>
          {deckType === "double" && (
            <p className="mt-2">Upper deck positions: {searchParams.get("upperDriver") || 0} driver side, {searchParams.get("upperOpposite") || 0} opposite side</p>
          )}
          <p className="mt-4 text-xs text-gray-500">Arrangement editor will be added in Step 3.</p>
        </div>
      </main>
    </div>
  );
};

export default VendorDeckArrangementPage;
