import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bus,
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Building,
  MapPin,
  FileText,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function AgentSignup() {
  const navigate = useNavigate();
  const { BASE_URL } = useAuth();

  // Screens: 'stepper' | 'otp' | 'success'
  const [screen, setScreen] = useState('stepper');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState('');

  // Form values matching backend schema
  const [formData, setFormData] = useState({
    // Step 1: Basic details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',

    // Step 2: Agency & Business Details
    agencyName: '',
    businessEmail: '',
    businessPhone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',

    // Step 3: Registration & Tax
    registrationNumber: '',
    taxId: '',
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // ── Step 1 Validation ──
  const validateStep1 = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('First name and Last name are required');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }
    const cleanPhone = formData.phone.trim().replace(/^(\+91|0)/, '');
    if (!/^\d{10}$/.test(cleanPhone)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  // ── Step 2 Validation ──
  const validateStep2 = () => {
    if (!formData.agencyName.trim()) {
      toast.error('Agency name is required');
      return false;
    }
    if (!formData.businessEmail.trim() || !formData.businessEmail.includes('@')) {
      toast.error('Valid business email is required');
      return false;
    }
    const cleanBizPhone = formData.businessPhone.trim().replace(/^(\+91|0)/, '');
    if (!/^\d{10}$/.test(cleanBizPhone)) {
      toast.error('Please enter a valid 10-digit business phone number');
      return false;
    }
    if (!formData.street.trim() || !formData.city.trim() || !formData.state.trim() || !formData.postalCode.trim()) {
      toast.error('Please complete all address fields');
      return false;
    }
    return true;
  };

  // ── Step 3 Validation ──
  const validateStep3 = () => {
    if (!formData.registrationNumber.trim()) {
      toast.error('Registration number is required');
      return false;
    }
    if (!formData.taxId.trim()) {
      toast.error('Tax ID / GSTIN is required');
      return false;
    }
    return true;
  };

  // ── Stepper Navigation ──
  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  // ── Final Submit: agent-signup-init ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setLoading(true);
    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim().startsWith('+91') ? formData.phone.trim() : `+91${formData.phone.trim()}`,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        agencyName: formData.agencyName.trim(),
        businessEmail: formData.businessEmail.trim(),
        businessPhone: formData.businessPhone.trim().startsWith('+91')
          ? formData.businessPhone.trim()
          : `+91${formData.businessPhone.trim()}`,
        businessAddress: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          postalCode: formData.postalCode.trim(),
          country: formData.country.trim() || 'India',
        },
        registrationNumber: formData.registrationNumber.trim(),
        taxId: formData.taxId.trim(),
      };

      const res = await fetch(`${BASE_URL}/auth/agent-signup-init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Agent registration request failed');

      toast.success(data.message || 'OTP sent to your email for verification!');
      setScreen('otp');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Verify OTP: agent-signup-verify ──
  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/agent-signup-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          emailOtp: otp.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Agent OTP verification failed');

      toast.success('Agent registration completed successfully! Please login.');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Blurred transparent backdrop over landing page */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => navigate('/')}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl  overflow-hidden max-h-[92vh] flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 px-6 py-5 sm:px-8 sm:py-6 text-white flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
              <Bus className="text-teal-400" size={22} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wide">SECE BUS PARTNER</h1>
              <p className="text-[11px] text-teal-300 font-medium">Operator & Vendor Onboarding</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* ─── Screen: Stepper Form ─── */}
        {screen === 'stepper' && (
          <div className="p-6 sm:p-10 overflow-y-auto flex-1">
            {/* Stepper Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between relative">
                {/* Connecting lines */}
                <div className="absolute left-6 right-6 top-6 -translate-y-1/2 h-0.5 bg-slate-100 -z-0" />
                <div
                  className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-teal-600 transition-all duration-300 -z-0"
                  style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                />

                {[
                  { num: 1, label: 'Basic Info' },
                  { num: 2, label: 'Agency & Address' },
                  { num: 3, label: 'Business Reg' },
                ].map((s) => (
                  <div key={s.num} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        step >= s.num
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 ring-4 ring-white'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      {step > s.num ? <CheckCircle2 size={18} /> : s.num}
                    </div>
                    <span
                      className={`mt-2 text-xs font-semibold ${
                        step >= s.num ? 'text-teal-700' : 'text-slate-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
              {/* ─── STEP 1: Basic Details ─── */}
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Step 1: Personal & Account Details</h2>
                    <p className="text-xs text-slate-500">Enter your representative credentials.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="First Name">
                      <InputWrapper icon={<User size={16} className="text-slate-400" />}>
                        <input
                          type="text"
                          required
                          placeholder="Rajesh"
                          value={formData.firstName}
                          onChange={handleChange('firstName')}
                          className="w-full bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                        />
                      </InputWrapper>
                    </Field>
                    <Field label="Last Name">
                      <InputWrapper icon={<User size={16} className="text-slate-400" />}>
                        <input
                          type="text"
                          required
                          placeholder="Kumar"
                          value={formData.lastName}
                          onChange={handleChange('lastName')}
                          className="w-full bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                        />
                      </InputWrapper>
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Personal Email">
                      <InputWrapper icon={<Mail size={16} className="text-slate-400" />}>
                        <input
                          type="email"
                          required
                          placeholder="agent@speedytravels.com"
                          value={formData.email}
                          onChange={handleChange('email')}
                          className="w-full bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                        />
                      </InputWrapper>
                    </Field>
                    <Field label="Personal Phone (10 digits)">
                      <InputWrapper icon={<Phone size={16} className="text-slate-400" />}>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="9876500001"
                          value={formData.phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setFormData((prev) => ({ ...prev, phone: val }));
                          }}
                          className="w-full bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                        />
                      </InputWrapper>
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Password">
                      <InputWrapper icon={<Lock size={16} className="text-slate-400" />}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Enter password"
                          value={formData.password}
                          onChange={handleChange('password')}
                          className="w-full bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-600">
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </InputWrapper>
                    </Field>
                    <Field label="Confirm Password">
                      <InputWrapper icon={<Lock size={16} className="text-slate-400" />}>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          placeholder="Re-enter password"
                          value={formData.confirmPassword}
                          onChange={handleChange('confirmPassword')}
                          className="w-full bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-slate-400 hover:text-slate-600">
                          {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </InputWrapper>
                    </Field>
                  </div>
                </div>
              )}

              {/* ─── STEP 2: Agency & Address ─── */}
              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Step 2: Agency & Business Details</h2>
                    <p className="text-xs text-slate-500">Provide official agency registration & address information.</p>
                  </div>

                  <Field label="Agency / Company Name">
                    <InputWrapper icon={<Building size={16} className="text-slate-400" />}>
                      <input
                        type="text"
                        required
                        placeholder="Speedy Travels Private Limited"
                        value={formData.agencyName}
                        onChange={handleChange('agencyName')}
                        className="w-full bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                      />
                    </InputWrapper>
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Business Email">
                      <InputWrapper icon={<Mail size={16} className="text-slate-400" />}>
                        <input
                          type="email"
                          required
                          placeholder="contact@speedytravels.com"
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
                          placeholder="9876500001"
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

                  <Field label="Street Address">
                    <InputWrapper icon={<MapPin size={16} className="text-slate-400" />}>
                      <input
                        type="text"
                        required
                        placeholder="102 MG Road"
                        value={formData.street}
                        onChange={handleChange('street')}
                        className="w-full bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                      />
                    </InputWrapper>
                  </Field>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <Field label="City">
                      <input
                        type="text"
                        required
                        placeholder="Bengaluru"
                        value={formData.city}
                        onChange={handleChange('city')}
                        className="h-11 px-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      />
                    </Field>
                    <Field label="State">
                      <input
                        type="text"
                        required
                        placeholder="Karnataka"
                        value={formData.state}
                        onChange={handleChange('state')}
                        className="h-11 px-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      />
                    </Field>
                    <Field label="Postal Code">
                      <input
                        type="text"
                        required
                        placeholder="560001"
                        value={formData.postalCode}
                        onChange={handleChange('postalCode')}
                        className="h-11 px-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 col-span-2 sm:col-span-1"
                      />
                    </Field>
                  </div>
                </div>
              )}

              {/* ─── STEP 3: Business Registration & Tax ─── */}
              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Step 3: Verification & Compliance</h2>
                    <p className="text-xs text-slate-500">Official license and tax identifiers for verification.</p>
                  </div>

                  <Field label="Business Registration Number">
                    <InputWrapper icon={<FileText size={16} className="text-slate-400" />}>
                      <input
                        type="text"
                        required
                        placeholder="KA-BUS-REG-2024"
                        value={formData.registrationNumber}
                        onChange={handleChange('registrationNumber')}
                        className="w-full bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                      />
                    </InputWrapper>
                  </Field>

                  <Field label="Tax ID / GSTIN">
                    <InputWrapper icon={<FileText size={16} className="text-slate-400" />}>
                      <input
                        type="text"
                        required
                        placeholder="29ABCDE1234F1Z5"
                        value={formData.taxId}
                        onChange={handleChange('taxId')}
                        className="w-full bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400 uppercase"
                      />
                    </InputWrapper>
                  </Field>

                  <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl text-xs text-teal-800 leading-relaxed">
                    By completing registration, you agree to the SECE Bus Partner Agreement and authorize verification of business records.
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="mt-8 flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 shadow-md shadow-teal-600/20 transition"
                  >
                    Next Step <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 shadow-md shadow-teal-600/20 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Submit & Get OTP <ArrowRight size={16} /></>
                    )}
                  </button>
                )}
              </div>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500">
              Already registered as an agent or user?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-bold text-teal-600 hover:text-teal-800"
              >
                Sign in
              </button>
            </p>
          </div>
        )}

        {/* ─── Screen: OTP Verification ─── */}
        {screen === 'otp' && (
          <div className="p-6 sm:p-10 text-center animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto mb-5 text-teal-600">
              <KeyRound size={28} />
            </div>

            <h2 className="text-2xl font-black text-slate-900">Verify Agent Account</h2>
            <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
              We&apos;ve sent a 6-digit confirmation OTP to{' '}
              <span className="font-semibold text-slate-800">{formData.email}</span>
            </p>

            <form onSubmit={handleVerify} className="mt-6 max-w-sm mx-auto space-y-4">
              <Field label="Enter 6-digit OTP">
                <InputWrapper icon={<KeyRound size={16} className="text-slate-400" />}>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="123456"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-transparent text-center font-bold text-lg tracking-widest outline-none text-slate-900 placeholder:text-slate-300"
                  />
                </InputWrapper>
              </Field>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 shadow-md shadow-teal-600/20 transition disabled:opacity-60"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Verify & Complete Registration <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <button
              type="button"
              onClick={() => { setScreen('stepper'); setOtp(''); }}
              className="mt-5 text-xs text-slate-500 hover:text-slate-700 font-medium"
            >
              ← Edit details & re-send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Form Helpers ── */
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
