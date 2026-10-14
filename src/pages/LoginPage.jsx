import { useState } from 'react'
import busImage from '../assets/busimage.jpeg'

function Icon({ name, className = '' }) {
  const icons = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </>
    ),
    bus: (
      <>
        <path d="M8 6v6m8-6v6M4 12h16M6 18h12a2 2 0 0 0 2-2V7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v9a2 2 0 0 0 2 2Z" />
        <path d="M7 18v2m10-2v2M7 15h.01M17 15h.01" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    eyeOff: (
      <>
        <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
        <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a15 15 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7c1.3 0 2.5-.3 3.5-.7" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    ticket: (
      <>
        <path d="M4 7a2 2 0 0 0 0 4v2a2 2 0 0 0 0 4h16v-4a2 2 0 0 1 0-4V5H4v2Z" />
        <path d="M13 5v2m0 4v2m0 4v2" />
      </>
    ),
  }

  const iconSvg = icons[name] ?? icons.bus

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconSvg}
    </svg>
  )
}

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setNotice('Sign-in is not connected yet. Please connect your authentication service.')
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 lg:grid lg:grid-cols-[1.03fr_0.97fr]">
      <section
        className="relative flex min-h-[340px] flex-col overflow-hidden bg-[#2529c8] px-7 py-8 text-white sm:px-12 sm:py-10 lg:min-h-screen lg:px-[clamp(3rem,8vw,8rem)] lg:py-12"
        style={{
          backgroundImage: `linear-gradient(140deg, rgba(37, 41, 200, 0.62), rgba(11, 15, 123, 0.72)), url(${busImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-36 -top-52 h-[600px] w-[600px] rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-36 h-[500px] w-[500px] rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 -top-20 h-[400px] w-[400px] rounded-full border border-white/10"
        />
        <a
          href="/"
          aria-label="SECE Bus home"
          className="relative z-10 inline-flex w-fit items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span className="grid size-11 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20">
            <Icon name="bus" className="size-6" />
          </span>
          {/* <span className="text-lg font-semibold tracking-tight">SECE BUS</span> */}
        </a>

        <div className="relative z-10 my-auto max-w-lg py-12 lg:py-0">
          <span className="mb-7 grid size-12 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            <Icon name="ticket" className="size-6" />
          </span>
          <p className="mb-3 text-sm font-medium tracking-[0.2em] text-blue-100/80 uppercase">
            Your journey starts here
          </p>
          <h1 className="max-w-md text-4xl leading-[1.12] font-semibold tracking-tight sm:text-5xl lg:text-[clamp(3rem,5vw,4.5rem)]">
            Every ride,
            <br />
            a little easier.
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-6 text-blue-100/80 sm:text-base sm:leading-7">
            Book your SECE bus tickets in a few simple steps. Less waiting, more
            time for the journey ahead.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-5 text-xs text-blue-100/65 sm:text-sm">
          <span>© {new Date().getFullYear()} SECE Bus</span>
          <span className="hidden sm:inline">Made for the journey.</span>
        </div>
      </section>

      <section className="flex min-h-[560px] items-center justify-center px-6 py-12 sm:px-10 lg:min-h-screen lg:px-12">
        <div className="w-full max-w-[400px]">
          <a
            href="/"
            aria-label="SECE Bus home"
            className="mb-12 inline-flex items-center gap-2.5 rounded-lg text-lg font-semibold tracking-tight text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 lg:hidden"
          >
            <span className="grid size-9 place-items-center rounded-lg bg-indigo-600 text-white">
              <Icon name="bus" className="size-5" />
            </span>
            SECE BUS
          </a>

          <div className="mb-9">
            <p className="mb-3 text-sm font-medium text-indigo-600">Welcome back</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.1rem]">
              Sign in to your account
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter your details to manage your bookings and get going.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="relative">
                <Icon
                  name="mail"
                  className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-slate-400"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pr-4 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setNotice('Password reset is not connected yet.')}
                  className="rounded text-xs font-medium text-indigo-600 hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Icon
                  name="lock"
                  className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-slate-400"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pr-12 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 rounded text-slate-400 transition hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {showPassword ? (
                    <Icon name="eyeOff" className="size-[18px]" />
                  ) : (
                    <Icon name="eye" className="size-[18px]" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
            >
              Sign in
              <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          {notice && (
            <p role="status" className="mt-4 rounded-lg bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
              {notice}
            </p>
          )}

          <p className="mt-8 text-center text-sm text-slate-500">
            New to SECE Bus?{' '}
            <button
              type="button"
              onClick={() => setNotice('Account creation is not connected yet.')}
              className="rounded font-semibold text-indigo-600 hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create an account
            </button>
          </p>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
