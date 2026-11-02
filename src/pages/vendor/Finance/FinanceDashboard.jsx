import VendorNavbar from "../VendorNavbar";

const FinanceDashboard = () => (
  <main className="min-h-screen bg-[#F7F9FA] py-3">
    <VendorNavbar />
    <section className="mx-auto mt-3 w-[94%]">
      <h1 className="text-xl font-medium">Finance</h1>
      <p className="mt-1 text-sm text-[#627B77]">Review your revenue and financial activity.</p>
    </section>
  </main>
);

export default FinanceDashboard;
