import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  X,
  Bus,
  KeyRound,
  RotateCcw,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

// Helper to decode JWT safely
function decodeJwt(token) {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// ── Role → redirect path map (all lowercase normalized) ─────────────────────
const ROLE_PATHS = {
  admin: "/admin",
  travelagent: "/travelagent",
  operationcrew: "/crew",
  user: "/",
};

function getRoleRedirect(token, user) {
  let role = "";

  // 1. Try from fetched user object (from fetchMe: e.g. "travelAgent")
  if (user) {
    role = user.role ?? user.userType ?? user.roleName ?? "";
  }

  // 2. Fallback to token decoded role if user object didn't have it
  if (!role && token) {
    const payload = decodeJwt(token);
    if (payload) {
      role = payload.role ?? payload.userType ?? payload.roleName ?? "";
    }
  }

  // Normalize (e.g. "travelAgent" -> "travelagent")
  const normalized = String(role)
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "");
  return ROLE_PATHS[normalized] ?? "/";
}

// Screens: 'login' | 'otp' | 'forgot-init' | 'forgot-otp'
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveToken, fetchMe, BASE_URL } = useAuth();

  const from = location.state?.from || "/";

  // ─── Login state ────────────────────────────────────────────────
  const [screen, setScreen] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // ─── Forgot password state ──────────────────────────────────────
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [fpNewPass, setFpNewPass] = useState("");
  const [fpConfirm, setFpConfirm] = useState("");
  const [showFpPass, setShowFpPass] = useState(false);

  const close = () => navigate(from, { replace: true });

  // ─── Step 1: Login init ─────────────────────────────────────────
  const handleLoginInit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/login-init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, otpMethod: "email" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      toast.success("OTP sent to your email!");
      setScreen("otp");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 2: Login verify OTP ───────────────────────────────────
  const handleLoginVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/login-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");

      const token = data.token ?? data.accessToken ?? data.access_token;
      if (token) saveToken(token);

      // Fetch user profile then inspect role and firsttimelogin
      const updatedUser = await fetchMe();
      toast.success("Welcome back! Logged in successfully.");

      // Check user role
      const rawRole =
        updatedUser?.role ??
        updatedUser?.userType ??
        updatedUser?.roleName ??
        data?.role ??
        data?.user?.role ??
        "";
      const normalizedRole = String(rawRole).trim().toLowerCase().replace(/[^a-z]/g, "");

      // Check first-time login flag across common backend naming variations
      const isFirstTime = Boolean(
        updatedUser?.firsttimelogin ??
        updatedUser?.firstTimeLogin ??
        updatedUser?.isFirstTimeLogin ??
        updatedUser?.firstLogin ??
        data?.firsttimelogin ??
        data?.firstTimeLogin ??
        data?.isFirstTimeLogin ??
        data?.user?.firsttimelogin ??
        data?.user?.firstTimeLogin
      );

      const redirectTo = getRoleRedirect(token, updatedUser);

      if (normalizedRole === "travelagent") {
        // Navigate to the travel agent dashboard and pass firstTimeLogin state
        navigate(redirectTo, {
          replace: true,
          state: { showFirstTimeModal: isFirstTime, isFirstTime, email },
        });
      } else {
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Forgot: init ───────────────────────────────────────────────
  const handleForgotInit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/forgot-password-init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      toast.success("Reset OTP sent to your email!");
      setScreen("forgot-otp");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Forgot: verify + new password ─────────────────────────────
  const handleForgotVerify = async (e) => {
    e.preventDefault();
    if (fpNewPass !== fpConfirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/forgot-password-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fpEmail,
          otp: fpOtp,
          newPassword: fpNewPass,
          confirmPassword: fpConfirm,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");
      toast.success("Password reset successfully! Please sign in.");
      // Auto-navigate back to login screen after success
      setEmail(fpEmail);
      setScreen("login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-[900px] overflow-hidden rounded-2xl bg-white shadow-2xl grid md:grid-cols-2 animate-fadeIn">
        {/* ── Left decorative panel — bus photo style ── */}
        <div
          className="relative hidden md:flex flex-col justify-between overflow-hidden text-white"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1100&q=85')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-slate-950/25" />

          {/* Brand badge — top */}
          <div className="relative z-10 p-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
              <Bus size={13} className="text-teal-300" /> Premium Travel
              Experience
            </span>
          </div>

          {/* Content — bottom */}
          <div className="relative z-10 p-8">
            <h2 className="max-w-xs text-2xl font-extrabold leading-snug">
              &ldquo;Travel comfortably across{" "}
              <span className="text-teal-300">500+ scenic routes.</span>&rdquo;
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-6 text-teal-100/80">
              Discover amazing destinations and enjoy a premium travel
              experience with us.
            </p>
            <div className="mt-6 space-y-2.5 text-sm font-medium">
              {[
                { icon: "🛡️", label: "Secure online booking" },
                { icon: "📍", label: "Live GPS tracking" },
                { icon: "🎫", label: "Guaranteed seats" },
              ].map(({ icon, label }) => (
                <p
                  key={label}
                  className="flex items-center gap-3 text-white/90"
                >
                  <span>{icon}</span> {label}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="relative bg-white px-7 py-9 sm:px-10 flex flex-col justify-center">
          {/* Close button */}
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X size={16} />
          </button>

          {/* ─────────────── LOGIN SCREEN ─────────────── */}
          {screen === "login" && (
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back
                </h1>
                <p className="mt-1.5 text-sm text-slate-500">
                  Sign in to continue your journey.
                </p>
              </div>

              <form onSubmit={handleLoginInit} className="space-y-4">
                <Field label="Email address">
                  <InputWrapper
                    icon={<Mail size={16} className="text-slate-400" />}
                  >
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                    />
                  </InputWrapper>
                </Field>

                <Field
                  label="Password"
                  aside={
                    <button
                      type="button"
                      onClick={() => {
                        setFpEmail(email);
                        setScreen("forgot-init");
                      }}
                      className="text-xs font-semibold text-teal-600 hover:text-teal-800 transition-colors"
                    >
                      Forgot password?
                    </button>
                  }
                >
                  <InputWrapper
                    icon={<Lock size={16} className="text-slate-400" />}
                  >
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </InputWrapper>
                </Field>

                <SubmitBtn loading={loading} label="Sign In" />
              </form>

              <p className="mt-5 text-center text-xs text-slate-500">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="font-bold text-teal-600 hover:text-teal-800"
                >
                  Sign up
                </button>
              </p>
            </>
          )}

          {/* ─────────────── OTP VERIFY SCREEN ─────────────── */}
          {screen === "otp" && (
            <>
              <div className="mb-7">
                <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-4">
                  <KeyRound size={22} className="text-teal-600" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Verify your login
                </h1>
                <p className="mt-1.5 text-sm text-slate-500">
                  We sent a 6-digit OTP to{" "}
                  <span className="font-semibold text-slate-700">{email}</span>
                </p>
              </div>

              <form onSubmit={handleLoginVerify} className="space-y-4">
                <Field label="One-time passcode (OTP)">
                  <InputWrapper
                    icon={<KeyRound size={16} className="text-slate-400" />}
                  >
                    <input
                      id="login-otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="6-digit code"
                      required
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                      className="flex-1 bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400 tracking-widest"
                    />
                  </InputWrapper>
                </Field>

                <SubmitBtn loading={loading} label="Verify & Sign In" />
              </form>

              <button
                type="button"
                onClick={() => {
                  setScreen("login");
                  setOtp("");
                }}
                className="mt-4 w-full text-xs text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1"
              >
                <RotateCcw size={12} /> Back to login
              </button>
            </>
          )}

          {/* ─────────────── FORGOT PASSWORD: INIT ─────────────── */}
          {screen === "forgot-init" && (
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Reset password
                </h1>
                <p className="mt-1.5 text-sm text-slate-500">
                  Enter your email and we&apos;ll send you a reset OTP.
                </p>
              </div>

              <form onSubmit={handleForgotInit} className="space-y-4">
                <Field label="Email address">
                  <InputWrapper
                    icon={<Mail size={16} className="text-slate-400" />}
                  >
                    <input
                      id="fp-email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      required
                      value={fpEmail}
                      onChange={(e) => setFpEmail(e.target.value)}
                      className="flex-1 bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                    />
                  </InputWrapper>
                </Field>

                <SubmitBtn loading={loading} label="Send OTP" />
              </form>

              <button
                type="button"
                onClick={() => setScreen("login")}
                className="mt-4 w-full text-xs text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1"
              >
                <RotateCcw size={12} /> Back to login
              </button>
            </>
          )}

          {/* ─────────────── FORGOT PASSWORD: OTP + NEW PASS ─────────────── */}
          {screen === "forgot-otp" && (
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Set new password
                </h1>
                <p className="mt-1.5 text-sm text-slate-500">
                  OTP sent to{" "}
                  <span className="font-semibold text-slate-700">
                    {fpEmail}
                  </span>
                </p>
              </div>

              <form onSubmit={handleForgotVerify} className="space-y-4">
                <Field label="OTP code">
                  <InputWrapper
                    icon={<KeyRound size={16} className="text-slate-400" />}
                  >
                    <input
                      id="fp-otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="6-digit code"
                      required
                      value={fpOtp}
                      onChange={(e) =>
                        setFpOtp(e.target.value.replace(/\D/g, ""))
                      }
                      className="flex-1 bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400 tracking-widest"
                    />
                  </InputWrapper>
                </Field>

                <Field label="New password">
                  <InputWrapper
                    icon={<Lock size={16} className="text-slate-400" />}
                  >
                    <input
                      id="fp-new-pass"
                      type={showFpPass ? "text" : "password"}
                      placeholder="New password"
                      required
                      value={fpNewPass}
                      onChange={(e) => setFpNewPass(e.target.value)}
                      className="flex-1 bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFpPass(!showFpPass)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {showFpPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </InputWrapper>
                </Field>

                <Field label="Confirm new password">
                  <InputWrapper
                    icon={<Lock size={16} className="text-slate-400" />}
                  >
                    <input
                      id="fp-confirm-pass"
                      type={showFpPass ? "text" : "password"}
                      placeholder="Confirm password"
                      required
                      value={fpConfirm}
                      onChange={(e) => setFpConfirm(e.target.value)}
                      className="flex-1 bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                    />
                  </InputWrapper>
                </Field>

                <SubmitBtn loading={loading} label="Reset Password" />
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───── small reusable helpers ───── */

function Field({ label, aside, children }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-800">{label}</label>
        {aside}
      </div>
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
        <>
          {label} <ArrowRight size={16} />
        </>
      )}
    </button>
  );
}
