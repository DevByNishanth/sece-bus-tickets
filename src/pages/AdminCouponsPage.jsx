import { useState, useEffect, useMemo, useCallback } from "react";
import {
  AlertTriangle,
  ArrowDownToLine,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Edit2,
  Eye,
  Filter,
  Percent,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Tag,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { toast } from "react-toastify";
import AdminNavbar from "../components/AdminNavbar.jsx";
import { useAuth } from "../context/AuthContext";
import { RAW_API_OFFERS } from "../services/offersService";

const ALLOWED_CATEGORIES = [
  "New User",
  "Festive",
  "Seasonal",
  "First_Booking",
  "Round_Trip_Offer",
];

export default function AdminCouponsPage() {
  const { BASE_URL, TOKEN_KEY } = useAuth();
  const tokenKeyName = TOKEN_KEY || "exte_key";

  const [offers, setOffers] = useState(RAW_API_OFFERS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields mapped directly to Offer schema
  const [formData, setFormData] = useState({
    heading: "",
    offerCode: "",
    description: "",
    discountPercentage: "",
    offerCategory: "New User",
    validTill: "",
    termsAndConditionsText: "",
    isActive: true,
  });

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem(tokenKeyName);

    try {
      const queryParams = new URLSearchParams({
        page: "1",
        limit: "50",
      });

      if (categoryFilter !== "all") {
        queryParams.append("category", categoryFilter);
      }
      if (statusFilter !== "all") {
        queryParams.append("isActive", statusFilter === "active" ? "true" : "false");
      }
      if (search.trim()) {
        queryParams.append("search", search.trim());
      }

      const res = await fetch(`${BASE_URL}/admin/offers?${queryParams.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.offers)) {
          setOffers(data.offers);
        } else if (Array.isArray(data)) {
          setOffers(data);
        }
      } else {
        console.warn("Using local offers dataset as fallback.");
      }
    } catch (err) {
      console.warn("Failed to fetch /admin/offers:", err);
    } finally {
      setLoading(false);
    }
  }, [BASE_URL, tokenKeyName, categoryFilter, statusFilter, search]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  // Statistics calculation without graphs or charts
  const stats = useMemo(() => {
    const total = offers.length;
    const now = new Date();
    let active = 0;
    let expired = 0;
    let pending = 0;

    offers.forEach((o) => {
      const isPast = o.validTill && new Date(o.validTill) < now;
      if (!o.isActive || isPast) {
        expired++;
      } else {
        active++;
      }
    });

    return { total, active, expired, pending };
  }, [offers]);

  // Open modal in create mode
  const openCreateModal = () => {
    setEditingOffer(null);
    setFormData({
      heading: "",
      offerCode: "",
      description: "",
      discountPercentage: "",
      offerCategory: "New User",
      validTill: "",
      termsAndConditionsText: "",
      isActive: true,
    });
    setCreateModalOpen(true);
  };

  // Open modal in edit mode
  const openEditModal = (offer) => {
    setEditingOffer(offer);
    const dateStr = offer.validTill
      ? new Date(offer.validTill).toISOString().split("T")[0]
      : "";

    setFormData({
      heading: offer.heading || "",
      offerCode: offer.offerCode || "",
      description: offer.description || "",
      discountPercentage: offer.discountPercentage ?? 10,
      offerCategory: offer.offerCategory || "Seasonal",
      validTill: dateStr,
      termsAndConditionsText: Array.isArray(offer.termsAndConditions)
        ? offer.termsAndConditions.join("\n")
        : "",
      isActive: offer.isActive !== undefined ? offer.isActive : true,
    });
    setCreateModalOpen(true);
  };

  // Save / Update Offer
  const handleSaveOffer = async (e) => {
    e.preventDefault();
    if (!formData.heading.trim() || !formData.offerCode.trim() || !formData.validTill) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    const termsArray = formData.termsAndConditionsText
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (termsArray.length === 0) {
      toast.error("Please add at least one term and condition.");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem(tokenKeyName);

    const payload = {
      heading: formData.heading.trim(),
      offerCode: formData.offerCode.trim().toUpperCase(),
      description: formData.description.trim(),
      discountPercentage: Number(formData.discountPercentage) || 0,
      offerCategory: formData.offerCategory,
      validTill: new Date(formData.validTill).toISOString(),
      termsAndConditions: termsArray,
      isActive: formData.isActive,
    };

    try {
      const url = editingOffer
        ? `${BASE_URL}/admin/offers/${editingOffer._id}`
        : `${BASE_URL}/admin/offers`;
      const method = editingOffer ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success(
          data.message || (editingOffer ? "Coupon updated successfully!" : "Coupon created successfully!")
        );
        setCreateModalOpen(false);
        fetchOffers();
      } else {
        toast.error(data.message || "Failed to save coupon.");
      }
    } catch (err) {
      toast.error(err.message || "Network error saving coupon.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Offer
  const handleDeleteOffer = async () => {
    if (!deleteConfirmId) return;
    setSubmitting(true);
    const token = localStorage.getItem(tokenKeyName);

    try {
      const res = await fetch(`${BASE_URL}/admin/offers/${deleteConfirmId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success(data.message || "Coupon deleted successfully.");
        setDeleteConfirmId(null);
        fetchOffers();
      } else {
        toast.error(data.message || "Failed to delete coupon.");
      }
    } catch (err) {
      toast.error(err.message || "Network error deleting coupon.");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle active status directly
  const handleToggleActive = async (offer) => {
    const token = localStorage.getItem(tokenKeyName);
    const nextActive = !offer.isActive;

    try {
      const res = await fetch(`${BASE_URL}/admin/offers/${offer._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          isActive: nextActive,
        }),
      });

      if (res.ok) {
        toast.success(`Coupon marked as ${nextActive ? "Active" : "Inactive"}`);
        setOffers((prev) =>
          prev.map((o) => (o._id === offer._id ? { ...o, isActive: nextActive } : o))
        );
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Network error toggling status");
    }
  };

  // Live Coupon Calculations
  const previewOriginalFare = 1000;
  const previewDiscount = Math.round(
    (previewOriginalFare * (Number(formData.discountPercentage) || 0)) / 100
  );
  const previewCustomerPays = Math.max(0, previewOriginalFare - previewDiscount);

  return (
    <div className="min-h-screen bg-[#f5f8f9] text-[#172526]">
      <AdminNavbar />

      <main className="mx-auto w-full max-w-[1600px] px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        {/* Top Header */}
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#078A97]">
              BUSGO PLATFORM
            </span>
            <h1 className="text-xl font-bold tracking-tight text-[#172526] sm:text-2xl">
              Coupon Overview
            </h1>
            <p className="mt-0.5 text-xs text-[#688080]">
              Monitor platform promotions, discount campaigns, and coupon performance
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchOffers()}
              disabled={loading}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#d6e3e6] bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw size={13} className={loading ? "animate-spin text-[#078A97]" : ""} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#078A97] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[#06747f]"
            >
              <Plus size={15} />
              <span>Create Coupon</span>
            </button>
          </div>
        </header>

        {/* 4 Stats Cards (Clean count metrics - No graphs/charts) */}
        <section
          aria-label="Coupon performance metrics"
          className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4"
        >
          {/* Total Coupons */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Total Coupons
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-[#078A97]">
                <Tag size={15} />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stats.total}</p>
            <span className="mt-1 block text-[10px] font-medium text-slate-400">
              Configured campaigns
            </span>
          </div>

          {/* Active Coupons */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Active Coupons
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={15} />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-600">{stats.active}</p>
            <span className="mt-1 block text-[10px] font-medium text-emerald-700">
              Live &amp; redeemable
            </span>
          </div>

          {/* Expired Coupons */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Expired / Disabled
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                <Clock size={15} />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-rose-600">{stats.expired}</p>
            <span className="mt-1 block text-[10px] font-medium text-slate-400">
              Validity elapsed
            </span>
          </div>

          {/* Categories Count */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Categories
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Sparkles size={15} />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {ALLOWED_CATEGORIES.length}
            </p>
            <span className="mt-1 block text-[10px] font-medium text-slate-400">
              Promotional types
            </span>
          </div>
        </section>

        {/* Coupons List Table Section */}
        <section className="overflow-hidden rounded-2xl border border-[#dbe6e9] bg-white shadow-sm">
          {/* Table Toolbar */}
          <div className="flex flex-col gap-3 border-b border-[#e7eff1] px-4 py-3.5 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#172526]">Coupons List</h2>
              <p className="text-[11px] text-[#657d84]">
                Sorted by latest creation &amp; redemption availability
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative min-w-[240px] flex-1 sm:w-72 lg:flex-none">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search code, campaign name..."
                  className="h-9 w-full rounded-xl border border-[#dce7e9] bg-[#f8fafb] pl-9 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#078A97] focus:bg-white focus:ring-2 focus:ring-teal-50"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-9 rounded-xl border border-[#dce7e9] bg-[#f8fafb] px-3 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-100"
              >
                <option value="all">All Categories</option>
                {ALLOWED_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace(/_/g, " ")}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-xl border border-[#dce7e9] bg-[#f8fafb] px-3 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-100"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive / Expired</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-[#f4f8f9] text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Coupon Code</th>
                  <th className="px-4 py-3">Campaign Name &amp; Description</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Discount</th>
                  <th className="px-4 py-3">Validity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf3f5] text-xs">
                {offers.map((offer) => {
                  const isPast =
                    offer.validTill && new Date(offer.validTill) < new Date();
                  const isEffectiveActive = offer.isActive && !isPast;

                  return (
                    <tr
                      key={offer._id}
                      className="group transition-colors hover:bg-[#f8fbfb]"
                    >
                      {/* Coupon Code */}
                      <td className="px-5 py-3.5">
                        <span className="inline-block rounded-md bg-teal-50 px-2.5 py-1 font-mono text-[11px] font-bold text-[#078A97] border border-teal-100">
                          {offer.offerCode}
                        </span>
                      </td>

                      {/* Heading & Description */}
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-slate-800">
                          {offer.heading}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate max-w-sm mt-0.5">
                          {offer.description}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10.5px] font-medium text-slate-700">
                          {offer.offerCategory?.replace(/_/g, " ")}
                        </span>
                      </td>

                      {/* Discount Percentage */}
                      <td className="px-4 py-3.5 font-bold text-slate-800">
                        {offer.discountPercentage !== undefined
                          ? `${offer.discountPercentage}% OFF`
                          : "Flat Discount"}
                      </td>

                      {/* Validity Date */}
                      <td className="px-4 py-3.5 text-slate-600">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Calendar size={12} className="text-slate-400" />
                          {offer.validTill
                            ? new Date(offer.validTill).toLocaleDateString()
                            : "No expiry"}
                        </span>
                        {isPast && (
                          <span className="block text-[9.5px] font-semibold text-rose-500">
                            Expired
                          </span>
                        )}
                      </td>

                      {/* Status switch toggle */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={offer.isActive}
                            onClick={() => handleToggleActive(offer)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              offer.isActive ? "bg-[#078A97]" : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                offer.isActive ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                          <span
                            className={`text-[11px] font-bold capitalize select-none ${
                              offer.isActive
                                ? isPast
                                  ? "text-rose-500"
                                  : "text-emerald-700"
                                : "text-slate-500"
                            }`}
                          >
                            {offer.isActive ? (isPast ? "Expired" : "Active") : "Inactive"}
                          </span>
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(offer)}
                            title="Edit Coupon"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-teal-500 hover:text-teal-700"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(offer._id)}
                            title="Delete Coupon"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-rose-500 hover:border-rose-400 hover:bg-rose-50"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {offers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                      <Tag size={32} className="mx-auto mb-2 text-slate-300" />
                      <p className="font-semibold text-slate-600 text-sm">
                        No promotional coupons found
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Click "Create Coupon" to start a new campaign.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Create / Edit Coupon Modal with Live Preview */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="my-8 w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl sm:p-7">
            {/* Modal Title */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#078A97]">
                  BUSGO PLATFORM
                </span>
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                  {editingOffer ? "Edit Coupon" : "Create Coupon"}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Create a platform or selected-category promotional campaign.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form + Live Coupon Preview Grid */}
            <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Form Column (7 cols) */}
              <form onSubmit={handleSaveOffer} className="space-y-4 lg:col-span-7">
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  {/* Campaign Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Campaign Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.heading}
                      onChange={(e) =>
                        setFormData({ ...formData, heading: e.target.value })
                      }
                      placeholder="e.g. Summer Journey Offer"
                      className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none focus:border-[#078A97] focus:ring-1 focus:ring-[#078A97]"
                    />
                  </div>

                  {/* Coupon Code */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Coupon Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.offerCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          offerCode: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="e.g. SUMMER100"
                      className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 font-mono text-xs font-bold text-slate-800 outline-none focus:border-[#078A97] focus:ring-1 focus:ring-[#078A97]"
                    />
                    <span className="block text-[9.5px] text-slate-400 mt-0.5">
                      Uppercase letters and numbers only
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Description *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Save more on selected BUSGO journeys during the campaign period."
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none focus:border-[#078A97] focus:ring-1 focus:ring-[#078A97]"
                  />
                </div>

                {/* Category & Discount */}
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Offer Category *
                    </label>
                    <select
                      value={formData.offerCategory}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          offerCategory: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium text-slate-800 outline-none focus:border-[#078A97] focus:ring-1 focus:ring-[#078A97]"
                    >
                      {ALLOWED_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Discount Percentage (%) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={formData.discountPercentage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountPercentage: e.target.value,
                        })
                      }
                      placeholder="e.g. 15"
                      className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#078A97] focus:ring-1 focus:ring-[#078A97]"
                    />
                  </div>
                </div>

                {/* Valid Till Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Valid Till Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.validTill}
                    onChange={(e) =>
                      setFormData({ ...formData, validTill: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none focus:border-[#078A97] focus:ring-1 focus:ring-[#078A97]"
                  />
                </div>

                {/* Terms and Conditions */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Terms &amp; Conditions (One rule per line) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.termsAndConditionsText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        termsAndConditionsText: e.target.value,
                      })
                    }
                    placeholder="Enter eligibility rules, one per line..."
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none focus:border-[#078A97] focus:ring-1 focus:ring-[#078A97]"
                  />
                </div>

                {/* Active / Inactive Tabs */}
                <div className="pt-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Campaign Status *
                  </label>
                  <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isActive: true })}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                        formData.isActive
                          ? "bg-white text-[#078A97] shadow-xs"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          formData.isActive ? "bg-[#078A97]" : "bg-slate-400"
                        }`}
                      />
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isActive: false })}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                        !formData.isActive
                          ? "bg-white text-slate-700 shadow-xs"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          !formData.isActive ? "bg-slate-500" : "bg-slate-400"
                        }`}
                      />
                      Inactive
                    </button>
                  </div>
                  <span className="block text-[10px] text-slate-400 mt-1">
                    {formData.isActive
                      ? "This coupon will be immediately usable by passengers at checkout."
                      : "This coupon will be saved as a draft/disabled and cannot be redeemed."}
                  </span>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#078A97] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#06747f] disabled:opacity-60 cursor-pointer"
                  >
                    {submitting && <RefreshCw size={12} className="animate-spin" />}
                    {editingOffer ? "Update Coupon" : "Create Coupon"}
                  </button>
                </div>
              </form>

              {/* Live Preview Column (5 cols) matching Figma Screenshot */}
              <div className="lg:col-span-5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  LIVE COUPON PREVIEW
                </span>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
                  {/* Coupon Card Ticket styled exactly like Figma */}
                  <div className="relative overflow-hidden rounded-2xl bg-[#0e4e55] p-5 text-white shadow-md">
                    {/* Ticket notch cutouts */}
                    <div className="absolute -left-3 bottom-14 h-6 w-6 rounded-full bg-white" />
                    <div className="absolute -right-3 bottom-14 h-6 w-6 rounded-full bg-white" />

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold tracking-wider text-teal-200 text-[10px] uppercase">
                        BUSGO OFFER
                      </span>
                      <span className="font-mono text-xs font-extrabold text-white bg-[#14646d] px-2.5 py-0.5 rounded-md">
                        {formData.offerCode || "COUPON"}
                      </span>
                    </div>

                    <h4 className="mt-3 text-base font-bold leading-tight">
                      {formData.discountPercentage
                        ? `${formData.discountPercentage}% OFF`
                        : "Special Deal"}{" "}
                      {formData.heading ? `- ${formData.heading}` : ""}
                    </h4>

                    <div className="mt-4 space-y-1 text-[11px] text-teal-100/90 border-t border-teal-700/60 pt-3">
                      <div className="flex justify-between">
                        <span className="text-teal-200/70">Category</span>
                        <span className="font-semibold text-white">
                          {formData.offerCategory.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-teal-200/70">Valid until</span>
                        <span className="font-semibold text-white">
                          {formData.validTill
                            ? new Date(formData.validTill).toLocaleDateString()
                            : "31 Dec 2026"}
                        </span>
                      </div>
                    </div>

                    {/* Apply Coupon button */}
                    <button
                      type="button"
                      disabled
                      className="mt-5 w-full rounded-xl bg-[#f26a36] py-2 text-xs font-bold text-white shadow-sm cursor-default"
                    >
                      APPLY COUPON
                    </button>
                  </div>

                  {/* Calculations breakdown matching Figma */}
                  <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Original fare (example)</span>
                      <span className="font-medium text-slate-800">
                        ₹{previewOriginalFare}
                      </span>
                    </div>
                    <div className="flex justify-between text-teal-700 font-medium">
                      <span>Coupon discount ({formData.discountPercentage}%)</span>
                      <span>- ₹{previewDiscount}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 border-t border-slate-100 pt-1.5 text-sm">
                      <span>Customer pays</span>
                      <span>₹{previewCustomerPays}</span>
                    </div>
                  </div>

                  <p className="mt-3 text-[10px] text-slate-400 italic">
                    Discount calculated directly on total ticket fare during checkout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-base font-bold text-rose-600">Delete Coupon?</h3>
            <p className="mt-1 text-xs text-slate-500">
              Are you sure you want to delete this promotional coupon? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleDeleteOffer}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700 disabled:opacity-60"
              >
                {submitting && <RefreshCw size={12} className="animate-spin" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

