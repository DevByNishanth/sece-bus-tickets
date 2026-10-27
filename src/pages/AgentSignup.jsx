import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, X, Bus, KeyRound } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

// Screens: 'form' | 'verify'
export default function AgentSignup() {
  const navigate = useNavigate();
  const { BASE_URL } = useAuth();

  const [screen, setScreen] = useState('form');
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setFormValues((prev) => ({ ...prev, [key]: e.target.value }));

  // ─── Step 1: Agent signup init ──────────────────────────────────
  const handleSignupInit = async (e) => {
    e.preventDefault();

    // 10-digit mobile number validation
    const cleanPhone = formValues.phone.trim().replace(/^(\+91|0)/, '');
    if (!/^\d{10}$/.test(cleanPhone)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    if (formValues.password !== formValues.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formValues.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/agent-signup-init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formValues.firstName.trim(),
          lastName: formValues.lastName.trim(),
          email: formValues.email.trim(),
          phone: formValues.phone.trim(),
          password: formValues.password,
          confirmPassword: formValues.confirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Agent registration failed');
      toast.success(data.message || 'OTP sent to your email!');
      setScreen('verify');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 2: Agent email OTP verify ─────────────────────────────
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
        body: JSON.stringify({ email: formValues.email.trim(), emailOtp: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'OTP verification failed');
      toast.success(data.message || 'Agent account verified! Please login.');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={() => navigate('/')}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[900px] overflow-hidden rounded-2xl bg-white shadow-2xl grid md:grid-cols-2 animate-fadeIn max-h-[95vh]">
        {/* ── Left decorative panel — partner / agency branding ── */}
        <div
          className="relative hidden md:flex flex-col justify-between overflow-hidden text-white"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1100&q=85')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-slate-950/40" />

          {/* Brand badge — top */}
          <div className="relative z-10 p-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-teal-950/40 px-4 py-2 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm text-teal-300">
              <Bus size={13} className="text-teal-300" /> Agency Partner Portal
            </span>
          </div>

          {/* Content — bottom */}
          <div className="relative z-10 p-8">
            <h2 className="max-w-xs text-2xl font-extrabold leading-snug">
              &ldquo;Grow your travel business with{' '}
              <span className="text-teal-300">SECE Bus.</span>&rdquo;
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-6 text-teal-100/80">
              Register as an authorized travel agent to manage fleets, bookings, commissions, and access exclusive partner fares.
            </p>
            <div className="mt-6 space-y-2.5 text-sm font-medium">
              {[
                { icon: '💼', label: 'B2B Partner Commissions' },
                { icon: '🚌', label: 'Fleet & Seat Management' },
                { icon: '📈', label: 'Instant Booking & Analytics' },
              ].map(({ icon, label }) => (
                <p key={label} className="flex items-center gap-3 text-white/90">
                  <span>{icon}</span> {label}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="relative bg-white px-7 py-9 sm:px-10 flex flex-col overflow-y-auto">
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="Close"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors z-10"
          >
            <X size={16} />
          </button>

          {/* ─── SIGNUP FORM ─── */}
          {screen === 'form' && (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 text-xs font-semibold mb-2">
                  <Bus size={13} /> Travel Agent Registration
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Agent Sign Up</h1>
                <p className="mt-1 text-sm text-slate-500">Create your agent account with representative details.</p>
              </div>

              <form onSubmit={handleSignupInit} className="space-y-4">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Agent First Name">
                    <InputWrapper icon={<User size={15} className="text-slate-400" />}>
                      <input
                        id="agentFirstName"
                        type="text"
                        placeholder="John"
                        required
                        value={formValues.firstName}
                        onChange={set('firstName')}
                        className="flex-1 bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                      />
                    </InputWrapper>
                  </Field>
                  <Field label="Agent Last Name">
                    <InputWrapper icon={<User size={15} className="text-slate-400" />}>
                      <input
                        id="agentLastName"
                        type="text"
                        placeholder="Doe"
                        required
                        value={formValues.lastName}
                        onChange={set('lastName')}
                        className="flex-1 bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                      />
                    </InputWrapper>
                  </Field>
                </div>

                <Field label="Agency / Agent Email">
                  <InputWrapper icon={<Mail size={15} className="text-slate-400" />}>
                    <input
                      id="agentEmail"
                      type="email"
                      autoComplete="email"
                      placeholder="agent@agency.com"
                      required
                      value={formValues.email}
                      onChange={set('email')}
                      className="flex-1 bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                    />
                  </InputWrapper>
                </Field>

                <Field label="Agency Phone (10 digits)">
                  <InputWrapper icon={<Phone size={15} className="text-slate-400" />}>
                    <input
                      id="agentPhone"
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      required
                      value={formValues.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormValues((prev) => ({ ...prev, phone: val }));
                      }}
                      className="flex-1 bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                    />
                  </InputWrapper>
                </Field>

                <Field label="Password">
                  <InputWrapper icon={<Lock size={15} className="text-slate-400" />}>
                    <input
                      id="agentPassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Create a password"
                      required
                      value={formValues.password}
                      onChange={set('password')}
                      className="flex-1 bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </InputWrapper>
                </Field>

                <Field label="Confirm Password">
                  <InputWrapper icon={<Lock size={15} className="text-slate-400" />}>
                    <input
                      id="agentConfirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Re-enter your password"
                      required
                      value={formValues.confirmPassword}
                      onChange={set('confirmPassword')}
                      className="flex-1 bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-slate-400 hover:text-slate-600">
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </InputWrapper>
                </Field>

                <SubmitBtn loading={loading} label="Register As Agent" />
              </form>

              <p className="mt-5 text-center text-xs text-slate-500">
                Already registered as an agent?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="font-bold text-teal-600 hover:text-teal-800"
                >
                  Sign in
                </button>
              </p>

              <p className="mt-3 text-center text-xs text-slate-400">
                Looking for regular passenger signup?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="font-semibold text-teal-600 hover:text-teal-800 underline underline-offset-2"
                >
                  Passenger Sign Up
                </button>
              </p>
            </>
          )}

          {/* ─── OTP VERIFY ─── */}
          {screen === 'verify' && (
            <>
              <div className="mb-7">
                <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-4">
                  <KeyRound size={22} className="text-teal-600" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900">Verify Agent Email</h1>
                <p className="mt-1.5 text-sm text-slate-500">
                  We sent a 6-digit verification code to{' '}
                  <span className="font-semibold text-slate-700">{formValues.email}</span>
                </p>
              </div>
              

              <form onSubmit={handleVerify} className="space-y-4">
                <Field label="Agent Email OTP">
                  <InputWrapper icon={<KeyRound size={15} className="text-slate-400" />}>
                    <input
                      id="agent-otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="6-digit code"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="flex-1 bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400 tracking-widest text-center font-bold text-lg"
                    />
                  </InputWrapper>
                </Field>

                <SubmitBtn loading={loading} label="Verify & Complete Signup" />
              </form>

              <button
                type="button"
                onClick={() => { setScreen('form'); setOtp(''); }}
                className="mt-4 w-full text-xs text-slate-500 hover:text-slate-700 font-medium"
              >
                ← Back to edit details
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ── */
function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-700 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function InputWrapper({ icon, children }) {
  return (
    <div className="flex h-11 items-center gap-2.5 rounded-lg border border-slate-200 px-3 transition-all focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100">
      {icon}
      {children}
    </div>
  );
}

function SubmitBtn({ loading, label }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-teal-600 text-sm font-bold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>{label} <ArrowRight size={16} /></>
      )}
    </button>
  );
}