import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  AlertTriangle,
  Banknote,
  BusFront,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import AdminNavbar from "../components/AdminNavbar.jsx";
import { useAuth } from "../context/AuthContext";

const statusStyles = {
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
  suspended: "border-slate-300 bg-slate-100 text-slate-700",
};

const approvalChecklistItems = [
  "Company information reviewed",
  "Business identity documents verified",
  "Owner details and contact information verified",
  "PAN and GST registration verified",
  "Fleet permits and operating locations verified",
  "Settlement bank account proof verified",
];

export default function TravelProfileDetailView({
  agentProfileId,
  onBack,
  Navbar = AdminNavbar,
}) {
  const { BASE_URL, TOKEN_KEY } = useAuth();
  const tokenKeyName = TOKEN_KEY || "exte_key";

  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals for actions
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [remarks, setRemarks] = useState("");

  // Approval Checklist
  const [checkedApprovalItems, setCheckedApprovalItems] = useState([]);

  const toggleApprovalItem = (index) => {
    setCheckedApprovalItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const allApprovalChecked =
    checkedApprovalItems.length === approvalChecklistItems.length;

  const fetchAgentDetail = useCallback(async () => {
    if (!agentProfileId) return;
    setLoading(true);
    setError(null);
    const token = localStorage.getItem(tokenKeyName);

    try {
      const res = await fetch(`${BASE_URL}/admin/agents/${agentProfileId}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        const data = await res.json();
        setAgent(data.agent || data);
      } else {
        setError(`Failed to load agent profile (Status ${res.status})`);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch agent profile.");
    } finally {
      setLoading(false);
    }
  }, [BASE_URL, agentProfileId, tokenKeyName]);

  useEffect(() => {
    fetchAgentDetail();
  }, [fetchAgentDetail]);

  const handleReviewStatus = async (newStatus) => {
    setActionLoading(true);
    const token = localStorage.getItem(tokenKeyName);

    try {
      const res = await fetch(
        `${BASE_URL}/admin/agents/${agentProfileId}/review`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            status: newStatus,
            adminRemarks: remarks.trim() || undefined,
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setAgent(data.agent || { ...agent, status: newStatus });
        toast.success(
          data.message || `Travel agent successfully marked as ${newStatus}!`
        );
        setReviewModalOpen(false);
        setRejectModalOpen(false);
        setRemarks("");
        setCheckedApprovalItems([]);
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.message || "Failed to update agent status");
      }
    } catch (err) {
      toast.error(err.message || "Network error updating agent status");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f8f9] text-[#172526]">
        <Navbar />
        <div className="flex h-96 flex-col items-center justify-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-[#078A97]" />
          <p className="text-sm font-medium text-slate-500">
            Loading travel agent details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-[#f5f8f9] text-[#172526]">
        <Navbar />
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <div className="inline-flex rounded-2xl bg-rose-50 p-3 text-rose-600">
            <AlertTriangle size={28} />
          </div>
          <h2 className="mt-3 text-lg font-bold text-slate-800">
            {error || "Agent details not found"}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Unable to load profile for ID: {agentProfileId}
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#078A97] px-4 py-2 text-xs font-semibold text-white shadow-sm"
          >
            <ArrowLeft size={14} /> Back to Travels List
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = (agent.status || "pending").toLowerCase();
  const address = agent.registeredAddress;
  const currentAddress =   agent.operatingAddress;
  const addressStr = address
    ? [address.street, address.city, address.state, address.postalCode, address.country]
        .filter(Boolean)
        .join(", ")
    : "Not provided";
  const currentAddressStr = currentAddress
    ? [currentAddress.street, currentAddress.city, currentAddress.state, currentAddress.postalCode, currentAddress.country]
        .filter(Boolean)
        .join(", ")
    : "Not provided";

  return (
    <div className="min-h-screen bg-[#f5f8f9] text-[#172526]">
      <Navbar />

      <main className="mx-auto w-full max-w-[1600px] px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        {/* Back and Action Buttons */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-[#dce7e9] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={15} /> Back to Travels List
          </button>

          {/* Action triggers */}
          <div className="flex flex-wrap items-center gap-2">
            {currentStatus !== "approved" && (
              <button
                type="button"
                onClick={() => {
                  setRemarks("All business documents and tax credentials verified.");
                  setCheckedApprovalItems([]);
                  setReviewModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#078A97] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#06747f]"
              >
                <Check size={14} /> Approve Agency
              </button>
            )}

            {currentStatus !== "rejected" && (
              <button
                type="button"
                onClick={() => {
                  setRemarks("");
                  setRejectModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-white px-3.5 py-2 text-xs font-bold text-rose-600 shadow-sm transition hover:bg-rose-50"
              >
                <X size={14} /> Reject Application
              </button>
            )}
          </div>
        </div>

        {/* Agency Hero Card */}
        <section className="mb-5 overflow-hidden rounded-2xl border border-[#dbe6e9] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-2xl font-bold text-[#078A97] border border-teal-100">
                {agent.registeredBusinessName?.[0] || "A"}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    {agent.registeredBusinessName}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                      statusStyles[currentStatus] || statusStyles.pending
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        currentStatus === "approved"
                          ? "bg-emerald-500"
                          : currentStatus === "pending"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                    />
                    {agent.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Operator: <strong className="text-slate-700">{agent.operatorDisplayName || "N/A"}</strong> · Type:{" "}
                  <strong className="text-slate-700">{agent.businessType}</strong> · Reg No:{" "}
                  <strong className="font-mono text-slate-800">{agent.registrationNumber}</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-col text-left sm:text-right text-xs text-slate-500 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
              
              {agent.reviewedAt && (
                <span className="mt-1 text-[11px] text-teal-700">
                  Reviewed on {new Date(agent.reviewedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Left Column (2 spans): Business, Contact, Bank Info */}
          <div className="space-y-5 lg:col-span-2">
            {/* Primary Details Card */}
            <div className="rounded-2xl border border-[#dbe6e9] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Building2 size={16} className="text-[#078A97]" />
                <h2 className="text-sm font-bold text-slate-800">
                  Business &amp; Legal Details
                </h2>
              </div>

              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Registered Business Name
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-800">
                    {agent.registeredBusinessName || "N/A"}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Registration Number
                  </dt>
                  <dd className="mt-1 font-mono font-medium text-slate-800">
                    {agent.registrationNumber || "N/A"}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Business PAN
                  </dt>
                  <dd className="mt-1 font-mono font-semibold text-slate-800">
                    {agent.businessPan || "N/A"}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    GSTIN
                  </dt>
                  <dd className="mt-1 font-mono font-semibold text-slate-800">
                    {agent.gstin || "N/A"}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Year Established
                  </dt>
                  <dd className="mt-1 font-medium text-slate-800">
                    {agent.yearEstablished || "N/A"}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Business Type
                  </dt>
                  <dd className="mt-1 font-medium text-slate-800">
                    {agent.businessType || "N/A"}
                  </dd>
                </div>

                

                <div className="sm:col-span-2">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Registered Office Address
                  </dt>
                  <dd className="mt-1 flex items-start gap-1.5 text-slate-700">
                    <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <span>{addressStr}</span>
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Current Office Address
                  </dt>
                  <dd className="mt-1 flex items-start gap-1.5 text-slate-700">
                    <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <span>{currentAddressStr}</span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Contact Person Details */}
            <div className="rounded-2xl border border-[#dbe6e9] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Phone size={16} className="text-[#078A97]" />
                <h2 className="text-sm font-bold text-slate-800">
                  Primary Contact &amp; Account
                </h2>
              </div>

              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Contact Person
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-800">
                    {agent.primaryContactPerson ||
                      (agent.userId
                        ? `${agent.userId.firstName || ""} ${agent.userId.lastName || ""}`.trim()
                        : "N/A")}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Designation
                  </dt>
                  <dd className="mt-1 text-slate-700">
                    {agent.primaryContactDesignation || "Owner"}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Business Email
                  </dt>
                  <dd className="mt-1 flex items-center gap-1.5 text-slate-800 font-medium">
                    <Mail size={13} className="text-slate-400" />
                    {agent.businessEmail || agent.userId?.email || "N/A"}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Business Mobile
                  </dt>
                  <dd className="mt-1 flex items-center gap-1.5 text-slate-800 font-medium">
                    <Phone size={13} className="text-slate-400" />
                    {agent.businessMobile || agent.userId?.phone || "N/A"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Settlement Bank Details */}
            {agent.bankDetails && (
              <div className="rounded-2xl border border-[#dbe6e9] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Banknote size={16} className="text-[#078A97]" />
                  <h2 className="text-sm font-bold text-slate-800">
                    Settlement Bank Account
                  </h2>
                </div>

                <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Bank Name
                    </dt>
                    <dd className="mt-1 font-semibold text-slate-800">
                      {agent.bankDetails.bankName || "N/A"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Branch
                    </dt>
                    <dd className="mt-1 text-slate-700">
                      {agent.bankDetails.branchName || "N/A"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Account Holder Name
                    </dt>
                    <dd className="mt-1 font-medium text-slate-800">
                      {agent.bankDetails.accountHolderName || "N/A"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Account Number
                    </dt>
                    <dd className="mt-1 font-mono font-bold text-slate-800">
                      {agent.bankDetails.accountNumber || "N/A"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      IFSC Code
                    </dt>
                    <dd className="mt-1 font-mono font-semibold text-[#078A97]">
                      {agent.bankDetails.ifscCode || "N/A"}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>

          {/* Right Column (1 span): Uploaded Verification Documents & Review Info */}
          <div className="space-y-5">
            {/* Uploaded Documents */}
            <div className="rounded-2xl border border-[#dbe6e9] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileCheck2 size={16} className="text-[#078A97]" />
                <h2 className="text-sm font-bold text-slate-800">
                  Verification Documents
                </h2>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  {
                    title: "Business Registration Document",
                    doc: agent.businessRegistrationDoc,
                  },
                  { title: "Company PAN Card", doc: agent.panDoc },
                  { title: "Address Proof Document", doc: agent.addressProofDoc },
                ].map(({ title, doc }) => (
                  <div
                    key={title}
                    className="rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-[#078A97]">
                        <FileText size={15} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800">{title}</p>
                        <p className="truncate text-[11px] text-slate-500 mt-0.5">
                          {doc?.fileName || doc?.title || "Uploaded Document"}
                        </p>
                        {doc?.url ? (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-block text-[11px] font-semibold text-[#078A97] hover:underline"
                          >
                            View File ↗
                          </a>
                        ) : (
                          <span className="mt-1 block text-[10px] text-slate-400">
                            No file preview available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Audit & Remarks */}
            <div className="rounded-2xl border border-[#dbe6e9] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShieldCheck size={16} className="text-[#078A97]" />
                <h2 className="text-sm font-bold text-slate-800">
                  Review &amp; Audit Trail
                </h2>
              </div>

              <div className="mt-4 space-y-2.5 text-xs text-slate-600">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                    Status
                  </span>
                  <span className="font-bold text-slate-800 uppercase mt-0.5 block">
                    {agent.status}
                  </span>
                </div>

                {agent.reviewedBy && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                      Reviewed By
                    </span>
                    <span className="font-medium text-slate-800 block">
                      {agent.reviewedBy.firstName} {agent.reviewedBy.lastName} (
                      {agent.reviewedBy.email})
                    </span>
                  </div>
                )}

                {agent.adminRemarks && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                      Admin Remarks
                    </span>
                    <p className="mt-1 rounded-lg bg-slate-50 p-2.5 text-[11px] text-slate-700 italic border border-slate-100">
                      "{agent.adminRemarks}"
                    </p>
                  </div>
                )}

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                    Profile Created
                  </span>
                  <span className="text-slate-500">
                    {agent.createdAt
                      ? new Date(agent.createdAt).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Review / Approval Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Approve Travel Company
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Verify the checklist below to approve this operator's registration.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            {/* Checklist Section with counter */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Checklist</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-600">
                  {checkedApprovalItems.length} / {approvalChecklistItems.length}
                </span>
              </div>
              {/* Progress bar */}
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-[#078A97] transition-all duration-300"
                  style={{
                    width: `${
                      (checkedApprovalItems.length /
                        approvalChecklistItems.length) *
                      100
                    }%`,
                  }}
                />
              </div>

              {/* Checklist items with custom checkbox and row click selection */}
              <div className="mt-3.5 space-y-2 max-h-60 overflow-y-auto pr-1">
                {approvalChecklistItems.map((item, idx) => {
                  const isChecked = checkedApprovalItems.includes(idx);
                  return (
                    <div
                      key={item}
                      role="checkbox"
                      aria-checked={isChecked}
                      tabIndex={0}
                      onClick={() => toggleApprovalItem(idx)}
                      onKeyDown={(e) => {
                        if (e.key === " " || e.key === "Enter") {
                          e.preventDefault();
                          toggleApprovalItem(idx);
                        }
                      }}
                      className={`flex cursor-pointer select-none items-center gap-3 rounded-xl border p-3 transition-colors ${
                        isChecked
                          ? "border-[#078A97]/40 bg-[#078A97]/5"
                          : "border-slate-200/90 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded transition-colors ${
                          isChecked
                            ? "bg-[#078A97] text-white border border-[#078A97]"
                            : "border border-slate-300 bg-white"
                        }`}
                      >
                        {isChecked && <Check size={11} strokeWidth={3} />}
                      </span>
                      <span className="text-xs font-medium text-slate-800">
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Remark Textarea */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700">
                Admin Remarks (Optional)
              </label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none focus:border-[#078A97] focus:ring-1 focus:ring-[#078A97]"
                placeholder="Add verification notes..."
              />
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!allApprovalChecked || actionLoading}
                onClick={() => handleReviewStatus("approved")}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-sm transition ${
                  allApprovalChecked && !actionLoading
                    ? "bg-[#078A97] hover:bg-[#06747f] cursor-pointer"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed opacity-80"
                }`}
              >
                {actionLoading && <RefreshCw size={12} className="animate-spin" />}
                Approve Travel Company
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal - Without Checklist */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-rose-600">
                  Reject Travel Company Application
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Specify the reasons for rejecting this travel company application.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            {/* Current Remark Textarea */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700">
                Rejection Remarks
              </label>
              <textarea
                rows={4}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                placeholder="Explain why the application is rejected..."
              />
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleReviewStatus("rejected")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700 cursor-pointer disabled:opacity-60"
              >
                {actionLoading && <RefreshCw size={12} className="animate-spin" />}
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
