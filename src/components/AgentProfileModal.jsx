import { useState, useEffect } from 'react';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Clock,
  RefreshCw,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

// Safe helper to decode JWT payload
function decodeJwt(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function checkApprovalFromTokenOrUser(user) {
  const token = localStorage.getItem('exte_key');
  const payload = decodeJwt(token);

  const statusCandidate =
    payload?.status ??
    payload?.approvalStatus ??
    payload?.agentStatus ??
    user?.status ??
    user?.approvalStatus ??
    user?.agentStatus ??
    '';

  const normalized = String(statusCandidate).trim().toLowerCase();
  return normalized === 'approved' || normalized === 'active';
}

export default function AgentProfileModal({
  isOpen,
  onClose,
  onSuccess,
  isFirstTime = true,
  initialEmail = '',
  initialPhone = '',
}) {
  const { BASE_URL, fetchMe, user, agentProfile, logout } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  // If user has already completed first time login (isFirstTime is false) and status is pending, show waiting screen directly
  const [isSubmitted, setIsSubmitted] = useState(!isFirstTime);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('pending');

  const [formData, setFormData] = useState({
    // Step 1: Agency & Contact
    agencyName: '',
    businessEmail: initialEmail,
    businessPhone: initialPhone,

    // Step 2: Address
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',

    // Step 3: Registration, Tax & Document
    registrationNumber: '',
    taxId: '',
    documentFile: null,
    documentName: '',
  });

  // Check status on mount or when token updates
  const evaluateStatus = () => {
    const isApproved = checkApprovalFromTokenOrUser(user);
    if (isApproved) {
      setCurrentStatus('approved');
      toast.success('Your agency account has been approved by admin!');
      if (onSuccess) onSuccess();
      else if (onClose) onClose();
    } else {
      const token = localStorage.getItem('exte_key');
      const payload = decodeJwt(token);
      const raw = payload?.status || user?.status || 'pending';
      setCurrentStatus(String(raw).toLowerCase());
      if (!isFirstTime) {
        setIsSubmitted(true);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      evaluateStatus();
    }
  }, [isOpen, user, isFirstTime]);

  // Periodic polling when waiting for approval
  useEffect(() => {
    if (!isOpen || !isSubmitted) return;

    const interval = setInterval(async () => {
      try {
        if (fetchMe) {
          const freshUser = await fetchMe();
          const approved = checkApprovalFromTokenOrUser(freshUser);
          if (approved) {
            setCurrentStatus('approved');
            toast.success('Admin approved your account! Welcome aboard.');
            clearInterval(interval);
            if (onSuccess) onSuccess();
            else if (onClose) onClose();
          }
        }
      } catch {
        // silent catch on background poll
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isOpen, isSubmitted, fetchMe, onSuccess, onClose]);

  if (!isOpen) return null;

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error('File size must be under 1MB');
        return;
      }
      setFormData((prev) => ({
        ...prev,
        documentFile: file,
        documentName: file.name,
      }));
      toast.success(`Selected file: ${file.name}`);
    }
  };

  // ── Step 1 Validation ──
  const validateStep1 = () => {
    if (!formData.agencyName.trim()) {
      toast.error('Agency name is required');
      return false;
    }
    if (!formData.businessEmail.trim() || !formData.businessEmail.includes('@')) {
      toast.error('Valid business email is required');
      return false;
    }
    const cleanPhone = formData.businessPhone.trim().replace(/^(\+91|0)/, '');
    if (!/^\d{10}$/.test(cleanPhone)) {
      toast.error('Please enter a valid 10-digit business phone number');
      return false;
    }
    return true;
  };

  // ── Step 2 Validation ──
  const validateStep2 = () => {
    if (!formData.street.trim() || !formData.city.trim() || !formData.state.trim() || !formData.postalCode.trim()) {
      toast.error('Please fill in all address fields');
      return false;
    }
    return true;
  };

  // ── Step 3 Validation ──
  const validateStep3 = () => {
    if (!formData.registrationNumber.trim()) {
      toast.error('Business registration number is required');
      return false;
    }
    if (!formData.taxId.trim()) {
      toast.error('Tax ID / GSTIN is required');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  // ── Manual status check button ──
  const handleCheckStatus = async () => {
    setCheckingStatus(true);
    try {
      let freshUser = null;
      if (fetchMe) {
        freshUser = await fetchMe();
      }
      const isApproved = checkApprovalFromTokenOrUser(freshUser || user);
      if (isApproved) {
        setCurrentStatus('approved');
        toast.success('Your agency account is Approved! Access granted.');
        if (onSuccess) onSuccess();
        else if (onClose) onClose();
      } else {
        const token = localStorage.getItem('exte_key');
        const payload = decodeJwt(token);
        const statusText = payload?.status || freshUser?.status || 'Pending Review';
        toast.info(`Current status: ${statusText}. Awaiting admin confirmation.`);
      }
    } catch {
      toast.error('Unable to fetch latest status. Please try again.');
    } finally {
      setCheckingStatus(false);
    }
  };

  // ── Submit Agent Profile ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    const token = localStorage.getItem('exte_key');
    if (!token) {
      toast.error('Session expired. Please log in again.');
      return;
    }

    setLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append('agencyName', formData.agencyName.trim());
      formPayload.append('businessEmail', formData.businessEmail.trim());
      formPayload.append(
        'businessPhone',
        formData.businessPhone.trim().startsWith('+91')
          ? formData.businessPhone.trim()
          : `+91${formData.businessPhone.trim()}`
      );
      formPayload.append(
        'businessAddress',
        JSON.stringify({
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          postalCode: formData.postalCode.trim(),
          country: formData.country.trim() || 'India',
        })
      );
      formPayload.append('street', formData.street.trim());
      formPayload.append('city', formData.city.trim());
      formPayload.append('state', formData.state.trim());
      formPayload.append('postalCode', formData.postalCode.trim());
      formPayload.append('country', formData.country.trim() || 'India');
      formPayload.append('registrationNumber', formData.registrationNumber.trim());
      formPayload.append('taxId', formData.taxId.trim());

      // Directly attach the uploaded document file
      if (formData.documentFile) {
        formPayload.append('document', formData.documentFile);
      }

      const res = await fetch(`${BASE_URL}/auth/agent-profile`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formPayload,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update agent profile');
      }

      toast.success('Details submitted successfully! Waiting for admin confirmation.');

      // Refresh profile then log out user
      if (fetchMe) {
        await fetchMe().catch(() => {});
      }

      // Log out user after submitting and redirect to login
      setTimeout(() => {
        logout();
        window.location.href = '/login';
      }, 1500);
    } catch (err) {
      toast.error(err.message || 'Failed to complete agent profile');
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Agency Info' },
    { num: 2, label: 'Address' },
    { num: 3, label: 'Tax & Docs' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Blurred transparent backdrop - prevents closing by clicking outside while pending */}
      <div
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col max-h-[92vh] animate-fadeIn border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
              <Building2 size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {isSubmitted ? 'Account Verification' : 'Complete Agency Profile'}
                <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-500/30 text-teal-300 rounded-full border border-teal-400/30">
                  {isSubmitted ? 'Pending Approval' : 'First Time Setup'}
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                {isSubmitted
                  ? 'Details submitted to administration for verification.'
                  : 'Please complete your business registration to start booking.'}
              </p>
            </div>
          </div>
        </div>

        {/* ─── SCREEN 1: WAITING FOR ADMIN APPROVAL ─── */}
        {isSubmitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center animate-fadeIn space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-amber-50 border-4 border-amber-100 flex items-center justify-center text-amber-600 animate-pulse">
                <Clock size={38} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-teal-600 border-2 border-white flex items-center justify-center text-white">
                <CheckCircle2 size={16} />
              </div>
            </div>

            <div className="max-w-md space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">
                Successfully Submitted!
              </h3>
              <p className="text-sm font-semibold text-teal-700">
                Waiting for Administrator Confirmation
              </p>
              <p className="text-xs text-slate-500 leading-relaxed pt-1">
                Your agency details and credentials have been received. For security and regulatory compliance, your partner account is currently pending review. This popup will close automatically once the status in your token is updated to <strong>approved</strong>.
              </p>
            </div>

            {/* Status indicator pill */}
            <div className="w-full max-w-sm rounded-xl bg-slate-50 border border-slate-200 p-4 text-left space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Agency Name:</span>
                <span className="font-bold text-slate-800">
                  {formData.agencyName || agentProfile?.agencyName || user?.agencyName || 'Agency Registered'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Registration ID:</span>
                <span className="font-bold text-slate-800">
                  {formData.registrationNumber || agentProfile?.registrationNumber || user?.registrationNumber || 'Submitted'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                <span className="text-slate-500">Current Status:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  {currentStatus}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm pt-2">
              <button
                type="button"
                onClick={handleCheckStatus}
                disabled={checkingStatus}
                className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 shadow-md shadow-teal-600/20 transition disabled:opacity-60"
              >
                <RefreshCw size={15} className={checkingStatus ? 'animate-spin' : ''} />
                {checkingStatus ? 'Checking Status...' : 'Check Approval Status'}
              </button>

              <button
                type="button"
                onClick={() => {
                  logout();
                  window.location.href = '/login';
                }}
                className="w-full flex items-center justify-center gap-1.5 h-11 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* ─── SCREEN 2: STEPPER FORM ─── */
          <>
            {/* Stepper Progress */}
            <div className="px-6 pt-5 pb-2 bg-slate-50/80 border-b border-slate-100">
              <div className="flex items-center justify-between relative max-w-md mx-auto">
                <div className="absolute left-6 right-6 top-4 -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />
                <div
                  className="absolute left-6 top-4 -translate-y-1/2 h-0.5 bg-teal-600 transition-all duration-300 -z-0"
                  style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                />

                {stepsList.map((s) => (
                  <div key={s.num} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        step >= s.num
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 ring-4 ring-white'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      {step > s.num ? <CheckCircle2 size={16} /> : s.num}
                    </div>
                    <span
                      className={`mt-1.5 text-[11px] font-semibold ${
                        step >= s.num ? 'text-teal-700 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Form Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
                {/* ─── STEP 1: Agency Name, Email, Phone ─── */}
                {step === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="border-b border-slate-100 pb-2 mb-3">
                      <h3 className="text-sm font-bold text-slate-900">Step 1: Agency & Contact Information</h3>
                      <p className="text-xs text-slate-500">Provide official agency trading details.</p>
                    </div>

                    <Field label="Agency / Business Name">
                      <InputWrapper icon={<Building2 size={16} className="text-slate-400" />}>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Royal Travels Pvt Ltd"
                          value={formData.agencyName}
                          onChange={handleChange('agencyName')}
                          className="w-full bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                        />
                      </InputWrapper>
                    </Field>

                    <Field label="Business Email">
                      <InputWrapper icon={<Mail size={16} className="text-slate-400" />}>
                        <input
                          type="email"
                          required
                          placeholder="business@royaltravels.com"
                          value={formData.businessEmail}
                          onChange={handleChange('businessEmail')}
                          className="w-full bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                        />
                      </InputWrapper>
                    </Field>

                    <Field label="Business Phone (10 digits)">
                      <InputWrapper icon={<Phone size={16} className="text-slate-400" />}>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="9876543210"
                          value={formData.businessPhone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setFormData((prev) => ({ ...prev, businessPhone: val }));
                          }}
                          className="w-full bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                        />
                      </InputWrapper>
                    </Field>
                  </div>
                )}

                {/* ─── STEP 2: Address Details ─── */}
                {step === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="border-b border-slate-100 pb-2 mb-3">
                      <h3 className="text-sm font-bold text-slate-900">Step 2: Business Address</h3>
                      <p className="text-xs text-slate-500">Registered office or branch physical location.</p>
                    </div>

                    <Field label="Street Address">
                      <InputWrapper icon={<MapPin size={16} className="text-slate-400" />}>
                        <input
                          type="text"
                          required
                          placeholder="Shop #12, Central Bus Terminal Rd"
                          value={formData.street}
                          onChange={handleChange('street')}
                          className="w-full bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                        />
                      </InputWrapper>
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="City">
                        <input
                          type="text"
                          required
                          placeholder="Coimbatore"
                          value={formData.city}
                          onChange={handleChange('city')}
                          className="h-11 px-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-slate-900 placeholder:text-slate-400"
                        />
                      </Field>
                      <Field label="State">
                        <input
                          type="text"
                          required
                          placeholder="Tamil Nadu"
                          value={formData.state}
                          onChange={handleChange('state')}
                          className="h-11 px-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-slate-900 placeholder:text-slate-400"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Postal / ZIP Code">
                        <input
                          type="text"
                          required
                          placeholder="641001"
                          value={formData.postalCode}
                          onChange={handleChange('postalCode')}
                          className="h-11 px-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-slate-900 placeholder:text-slate-400"
                        />
                      </Field>
                      <Field label="Country">
                        <input
                          type="text"
                          required
                          placeholder="India"
                          value={formData.country}
                          onChange={handleChange('country')}
                          className="h-11 px-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-slate-900 placeholder:text-slate-400"
                        />
                      </Field>
                    </div>
                  </div>
                )}

                {/* ─── STEP 3: Registration, Tax ID & Documents ─── */}
                {step === 3 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="border-b border-slate-100 pb-2 mb-3">
                      <h3 className="text-sm font-bold text-slate-900">Step 3: Business Registration & Documents</h3>
                      <p className="text-xs text-slate-500">Government compliance and verification proof.</p>
                    </div>

                    <Field label="Business Registration Number">
                      <InputWrapper icon={<FileText size={16} className="text-slate-400" />}>
                        <input
                          type="text"
                          required
                          placeholder="REG-TN-2024-8841"
                          value={formData.registrationNumber}
                          onChange={handleChange('registrationNumber')}
                          className="w-full bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                        />
                      </InputWrapper>
                    </Field>

                    <Field label="Tax ID / GSTIN">
                      <InputWrapper icon={<ShieldCheck size={16} className="text-slate-400" />}>
                        <input
                          type="text"
                          required
                          placeholder="33AAAAA0000A1Z5"
                          value={formData.taxId}
                          onChange={handleChange('taxId')}
                          className="w-full bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400 uppercase"
                        />
                      </InputWrapper>
                    </Field>

                    <Field label="Upload Agency Document / License (Optional)">
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-4 cursor-pointer bg-slate-50 hover:bg-teal-50/30 transition-all text-center">
                        <Upload size={22} className="text-teal-600 mb-1.5" />
                        <span className="text-xs font-semibold text-slate-700">
                          {formData.documentName ? formData.documentName : 'Upload Registration certificate / GST doc (Max 1MB)'}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">Maximum file size: 1MB</span>
                        <input
                          type="file"
                          accept=".pdf,image/png,image/jpeg,image/jpg"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </Field>

                    <div className="flex items-center gap-2 p-3 bg-teal-50/80 border border-teal-100 rounded-lg text-xs text-teal-800">
                      <AlertCircle size={15} className="flex-shrink-0 text-teal-600" />
                      <span>
                        Upon submitting, records will be reviewed by administrators. The popup will remain until approved.
                      </span>
                    </div>
                  </div>
                )}

                {/* Stepper Navigation Buttons */}
                <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
                    >
                      <ArrowLeft size={14} /> Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 shadow-md shadow-teal-600/20 transition"
                    >
                      Next Step <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 shadow-md shadow-teal-600/20 transition disabled:opacity-60"
                    >
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Submit For Admin Approval <ArrowRight size={14} /></>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col text-left">
      <label className="mb-1 text-xs font-semibold text-slate-700 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function InputWrapper({ icon, children }) {
  return (
    <div className="flex h-11 items-center gap-2.5 rounded-lg border border-slate-200 px-3 bg-white transition-all focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100">
      {icon}
      {children}
    </div>
  );
}
