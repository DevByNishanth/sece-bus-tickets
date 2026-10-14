
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import busImage from '../assets/busimage.jpeg'

function Icon({ name, className = '' }) {
  const icons = {
    bus: (
      <>
        <path d="M8 6v6m8-6v6M4 12h16" />
        <path d="M6 18h12a2 2 0 0 0 2-2V7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v9a2 2 0 0 0 2 2Z" />
        <path d="M7 18v2m10-2v2M7 15h.01M17 15h.01" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
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
        <path d="m3 3 18 18" />
        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
        <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a15 15 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7c1.3 0 2.5-.3 3.5-.7" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </>
    ),
    ticket: (
      <>
        <path d="M4 7a2 2 0 0 0 0 4v2a2 2 0 0 0 0 4h16v-4a2 2 0 0 1 0-4V5H4v2Z" />
        <path d="M13 5v2m0 4v2m0 4v2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut' },
  },
}

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
}

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setNotice(
      'Sign-in is not connected yet. Please connect your authentication service.'
    )
  }

  return (
    <main className="min-h-screen bg-[#f8f9fc] lg:grid lg:grid-cols-[2.05fr_0.95fr]">

      {/* LEFT: VISUAL EXPERIENCE */}

      <section className="relative isolate flex min-h-[440px] flex-col overflow-hidden bg-[#10134d] px-6 py-7 text-white sm:px-10 sm:py-9 lg:min-h-screen lg:px-12 lg:py-10 xl:px-16">

        {/* Animated background image */}

        <motion.div
          aria-hidden="true"
          className="absolute inset-0 -z-20"
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          style={{
            backgroundImage: `url(${busImage})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-br from-[#171b76]/25 via-[#171b76]/65 to-[#070b24]/85"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Decorative rings */}

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-36 top-20 -z-10 h-[440px] w-[440px] rounded-full border border-white/10 sm:h-[560px] sm:w-[560px]"
          animate={{ rotate: 360 }}
          transition={{
            duration: 90,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className="absolute left-20 top-16 h-3 w-3 rounded-full bg-indigo-300/80 shadow-[0_0_24px_6px_rgba(165,180,252,0.35)]" />
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 top-40 -z-10 h-[330px] w-[330px] rounded-full border border-white/[0.08]"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Brand */}

        <motion.a
          href="/"
          aria-label="SECE Bus home"
          className="relative z-10 flex w-fit items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="grid size-12 place-items-center rounded-2xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-md">
            <Icon name="bus" className="size-6" />
          </span>

          <span>
            <span className="block text-lg font-bold tracking-[0.16em]">
              SECE BUS
            </span>
            <span className="mt-0.5 block text-[10px] tracking-[0.24em] text-indigo-200">
              TRAVEL SMARTER
            </span>
          </span>
        </motion.a>

        {/* Hero content */}

        <motion.div
          className="relative z-10 mt-5 max-w-xl py-1 lg:py-1 "
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={fadeUp}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-medium text-indigo-100 backdrop-blur-md"
          >
            <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
            YOUR JOURNEY, SIMPLIFIED
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="max-w-xl text-5xl leading-[1.08] font-semibold tracking-[-0.045em] sm:text-6xl xl:text-6xl"
          >
            Your next
            <br />
            journey starts
            <br />
            <span className="bg-gradient-to-r from-indigo-300 via-violet-200 to-white bg-clip-text text-transparent">
              right here.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-7 max-w-md text-sm leading-7 text-indigo-100/75 sm:text-base sm:leading-8"
          >
            Skip the queues. Find your ride, book your seat, and make every
            journey a little more effortless with SECE Bus.
          </motion.p>

          {/* Floating travel card */}

          <motion.div
            variants={fadeUp}
            className="mt-10 flex max-w-[350px] items-center gap-4 rounded-2xl border border-white/15 bg-white/[0.09] p-4 shadow-2xl backdrop-blur-xl sm:p-5"
            animate={{ y: [0, -6, 0] }}
            transition={{
              y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-white text-indigo-700">
              <Icon name="ticket" className="size-6" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Your seat awaits</p>
              <p className="mt-1 text-xs text-indigo-100/65">
                A simpler way to get there.
              </p>
            </div>

            <div className="grid size-8 shrink-0 place-items-center rounded-full border border-emerald-300/30 bg-emerald-300/10 text-emerald-300">
              <Icon name="check" className="size-4" />
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}

        <motion.div
          className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-5 text-xs text-indigo-100/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <span>© {new Date().getFullYear()} SECE Bus</span>
          <span>Every journey matters.</span>
        </motion.div>
      </section>

      {/* RIGHT: LOGIN FORM */}

      <section className="relative flex min-h-[600px] items-center justify-center overflow-hidden px-6 py-12 sm:px-10 lg:min-h-screen lg:px-12 lg:py-16">

        {/* Soft decorative glow */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 size-[400px] rounded-full bg-indigo-100/60 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-40 size-[350px] rounded-full bg-violet-100/50 blur-3xl"
        />

        <motion.div
          className="relative z-10 w-full max-w-[410px]"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Mobile brand */}

          <motion.a
            variants={fadeUp}
            href="/"
            className="mb-12 inline-flex items-center gap-3 lg:hidden"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
              <Icon name="bus" className="size-6" />
            </span>
            <span className="text-lg font-bold tracking-wider text-slate-900">
              SECE BUS
            </span>
          </motion.a>

          {/* Heading */}

          <motion.div variants={fadeUp} className="mb-9">
            <div className="mb-5 grid size-12 place-items-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600">
              <Icon name="bus" className="size-6" />
            </div>

            <p className="mb-3 text-sm font-semibold tracking-wide text-indigo-600">
              WELCOME BACK
            </p>

            <h2 className="text-3xl leading-tight font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Let's get you
              <br />
              <span className="text-indigo-600">on the road.</span>
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              Sign in to access your account and manage your bus bookings.
            </p>
          </motion.div>

          {/* Form */}

          <motion.form
            variants={stagger}
            className="space-y-5"
            onSubmit={handleSubmit}
          >
            {/* Email */}

            <motion.div variants={fadeUp}>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>

              <div className="group relative">
                <Icon
                  name="mail"
                  className="absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  className="h-[54px] w-full rounded-xl border border-slate-200 bg-white/80 pr-4 pl-12 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </motion.div>

            {/* Password */}

            <motion.div variants={fadeUp}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setNotice('Password reset is not connected yet.')
                  }
                  className="text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Forgot password?
                </button>
              </div>

              <div className="group relative">
                <Icon
                  name="lock"
                  className="absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                  className="h-[54px] w-full rounded-xl border border-slate-200 bg-white/80 pr-12 pl-12 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />

                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 rounded-md text-slate-400 transition-colors hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <Icon
                    name={showPassword ? 'eyeOff' : 'eye'}
                    className="size-[18px]"
                  />
                </button>
              </div>
            </motion.div>

            {/* Remember me */}

            <motion.div
              variants={fadeUp}
              className="flex items-center gap-2.5"
            >
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="size-4 cursor-pointer rounded border-slate-300 accent-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />

              <label
                htmlFor="remember"
                className="cursor-pointer text-sm text-slate-500"
              >
                Remember me
              </label>
            </motion.div>

            {/* Submit */}

            <motion.button
              variants={fadeUp}
              type="submit"
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.985 }}
              className="group flex h-[54px] w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in to your account

              <Icon
                name="arrow"
                className="size-[18px] transition-transform duration-200 group-hover:translate-x-1"
              />
            </motion.button>
          </motion.form>

          {/* Feedback message */}

          <AnimatePresence mode="wait">
            {notice && (
              <motion.p
                key={notice}
                role="status"
                initial={{ opacity: 0, height: 0, y: 8 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -5 }}
                transition={{ duration: 0.25 }}
                className="mt-5 overflow-hidden rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm leading-6 text-indigo-800"
              >
                {notice}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Registration */}

          <motion.p
            variants={fadeUp}
            className="mt-8 text-center text-sm text-slate-500"
          >
            New to SECE Bus?{' '}
            <button
              type="button"
              onClick={() =>
                setNotice('Account creation is not connected yet.')
              }
              className="font-semibold text-indigo-600 transition-colors hover:text-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create an account
            </button>
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-400"
          >
            <Icon name="lock" className="size-3.5" />
            Your journey starts with a secure sign-in.
          </motion.div>
        </motion.div>
      </section>
    </main>
  )
}

export default LoginPage
