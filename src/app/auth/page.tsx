'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { ArrowLeft, Check, Clock3, Eye, EyeOff, GraduationCap, LockKeyhole, Mail, Phone, Sparkles, UserRound, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ReCAPTCHA from 'react-google-recaptcha'

import { registerStudent, loginStudent, sendOtp, verifyOtpAndResetPassword } from '@/app/actions/auth'

type AuthView = 'login' | 'register' | 'forgot'

const classes = [
  { value: 'class-9', label: 'Class 9' },
  { value: 'class-10', label: 'Class 10' },
  { value: 'class-11', label: 'Class 11' },
  { value: 'class-12', label: 'Class 12' },
]

const passwordRules = [
  { label: 'Minimum 8 characters', test: (value: string) => value.length >= 8 },
  { label: 'One uppercase letter', test: (value: string) => /[A-Z]/.test(value) },
  { label: 'One number', test: (value: string) => /\d/.test(value) },
  { label: 'One special character', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
]

export default function AuthPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialView = searchParams.get('view') as AuthView | null

  const [view, setView] = useState<AuthView>(initialView === 'forgot' || initialView === 'register' ? initialView : 'login')
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')

  const [registered, setRegistered] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(180)

  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)

  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState('')

  // OTP State
  const [resetEmail, setResetEmail] = useState('')
  const [otpStep, setOtpStep] = useState<1 | 2 | 3>(1)
  const [otpValue, setOtpValue] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (view !== 'forgot' || secondsLeft <= 0 || otpStep !== 2) return undefined
    const timer = window.setInterval(() => setSecondsLeft(seconds => Math.max(0, seconds - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [view, secondsLeft, otpStep])

  const passwordChecks = passwordRules.map(rule => ({
    ...rule,
    valid: rule.test(password)
  }))
  const passwordStrength = useMemo(() => passwordChecks.filter(r => r.valid).length, [passwordChecks])

  const formattedTime = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`
  const inputClass = 'mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10 disabled:opacity-60'
  const labelClass = 'text-sm font-semibold text-slate-700'

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg('')
    if (!recaptchaToken) {
      setErrorMsg('Please complete the reCAPTCHA')
      return
    }

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await registerStudent(formData, recaptchaToken)
      if (res?.error) {
        setErrorMsg(res.error)
      } else {
        setRegistered(true)
      }
    })
  }

  const handleStudentLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg('')

    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await loginStudent(formData)
      if (res?.error) {
        setErrorMsg(res.error)
      } else {
        router.push(`/portal/${res?.userId}`)
      }
    })
  }

  const handleSendOtp = async () => {
    if (!resetEmail) {
      setErrorMsg('Enter your email address first.')
      return
    }
    setErrorMsg('')
    const fd = new FormData()
    fd.append('email', resetEmail)

    startTransition(async () => {
      const res = await sendOtp(fd)
      if (res?.error) {
        setErrorMsg(res.error)
      } else {
        setOtpStep(2)
        setSecondsLeft(180)
      }
    })
  }

  const handleResetPassword = async () => {
    setErrorMsg('')
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match')
      return
    }
    const fd = new FormData()
    fd.append('email', resetEmail)
    fd.append('otp', otpValue)
    fd.append('password', password)

    startTransition(async () => {
      const res = await verifyOtpAndResetPassword(fd)
      if (res?.error) {
        setErrorMsg(res.error)
      } else {
        alert('Password reset successfully! Please login.')
        setView('login')
      }
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4 py-8 sm:py-12 font-sans text-slate-900 sm:px-6 lg:px-10">
      <div className="w-full max-w-6xl rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)] overflow-hidden flex flex-col lg:flex-row max-h-[95vh] lg:max-h-[92vh]">

        {/* Left Side (Hidden on Mobile) — fixed height, doesn't scroll */}
        <aside className="relative hidden lg:flex lg:w-[42%] xl:w-[38%] flex-shrink-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#102b78] via-[#1E40AF] to-[#0D9488] p-8 text-white">
          <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full border-[28px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[38px] border-teal-200/10" />
          <div className="relative">
            <Link href="/" className="flex items-center gap-3 group w-fit cursor-pointer">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl font-black text-[#1E40AF] shadow-xl group-hover:scale-105 transition-transform">R</div>
              <span className="text-xl font-extrabold tracking-tight font-heading group-hover:text-teal-200 transition-colors">RHTacademy</span>
            </Link>
            <div className="mt-16 max-w-sm">
              <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-teal-200">
                <Sparkles size={14} /><span>Learn with purpose</span>
              </p>
              <h1 className="text-4xl font-black leading-[1.08] tracking-[-0.05em] font-heading">Your next chapter starts here.</h1>
              <p className="mt-5 max-w-xs text-sm leading-6 text-blue-100">A focused learning space for curious students, thoughtful teachers, and ambitious futures.</p>
            </div>
          </div>
          <div className="relative flex items-end justify-between">
            <div className="max-w-[180px] text-sm leading-6 text-blue-100">
              <strong className="block text-white">Built for bright minds.</strong>
              <span>Explore lessons, track progress, and grow every day.</span>
            </div>
            <div className="flex h-20 w-20 rotate-6 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 backdrop-blur-sm">
              <GraduationCap size={40} strokeWidth={1.3} />
            </div>
          </div>
        </aside>

        {/* Right Side (Form Section) — scrollable */}
        <section className="flex-1 flex flex-col overflow-y-auto px-6 py-8 sm:px-12 sm:py-10 w-full max-w-xl mx-auto lg:max-w-none">
          {/* Back to Home Button & Mobile Header */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 -ml-2.5 text-sm font-semibold text-slate-600 hover:text-blue-800 hover:bg-slate-100 transition-all group"
            >
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>

            {/* Mobile Logo Link */}
            <Link href="/" className="flex items-center gap-2 lg:hidden group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1E40AF] text-xs font-black text-white group-hover:scale-105 transition-transform">R</div>
              <span className="text-sm font-bold text-slate-900 font-heading">RHTacademy</span>
            </Link>
          </div>

          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Welcome back</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] text-slate-950 font-heading">
                {view === 'forgot' ? 'Recover your account' : 'Student access'}
              </h2>
            </div>
            <div className="hidden rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-800 sm:block">
              <span>Secure &amp; simple</span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 font-medium">
              {errorMsg}
            </div>
          )}

          {view !== 'forgot' && (
            <div className="mb-8 flex rounded-xl bg-slate-100 p-1" role="tablist">
              <button type="button" role="tab" aria-selected={view === 'login'} onClick={() => { setView('login'); setRegistered(false); setErrorMsg('') }} className={`flex-1 rounded-lg py-3 text-sm font-bold transition ${view === 'login' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}><span>Login</span></button>
              <button type="button" role="tab" aria-selected={view === 'register'} onClick={() => { setView('register'); setRegistered(false); setErrorMsg('') }} className={`flex-1 rounded-lg py-3 text-sm font-bold transition ${view === 'register' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}><span>Register</span></button>
            </div>
          )}

          {view === 'login' && (
            <form className="space-y-6" onSubmit={handleStudentLogin}>
              <label className="block">
                <span className={labelClass}>Username or Email</span>
                <span className="relative block">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <UserRound className="text-slate-400" size={18} />
                  </span>
                  <input name="identifier" className={`${inputClass} pl-11`} placeholder="Enter your username or email" required disabled={isPending} />
                </span>
              </label>

              <label className="block">
                <span className={labelClass}>Password</span>
                <span className="relative block">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <LockKeyhole className="text-slate-400" size={18} />
                  </span>
                  <input name="password" className={`${inputClass} pl-11 pr-12`} type={showPassword ? 'text' : 'password'} placeholder="Enter your password" required disabled={isPending} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 rounded-lg text-slate-400 hover:text-blue-800">
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </span>
              </label>

              <div className="flex items-center justify-between gap-3 text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-[#1E40AF]" /><span>Remember me</span>
                </label>
                <button type="button" onClick={() => { setView('forgot'); setSecondsLeft(180); setOtpStep(1); setErrorMsg('') }} className="font-bold text-blue-800 hover:text-teal-700">
                  <span>Forgot Password?</span>
                </button>
              </div>
              <button type="submit" disabled={isPending} className="h-12 w-full rounded-xl bg-[#1E40AF] font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-900 active:scale-[.99] disabled:opacity-70">
                <span>{isPending ? 'Logging in...' : 'Login'}</span>
              </button>
            </form>
          )}

          {view === 'register' && !registered && (
            <form className="space-y-5" onSubmit={handleRegister}>
              <label className="block">
                <span className={labelClass}>Full Name</span>
                <input name="name" className={inputClass} placeholder="Your full name" required disabled={isPending} />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Class</span>
                  <select name="class" className={inputClass} defaultValue="" required disabled={isPending}>
                    <option value="" disabled>Select class</option>
                    {classes.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </label>
                <fieldset>
                  <legend className={labelClass}>Gender</legend>
                  <div className="mt-2 flex h-12 items-center gap-4">
                    {['Male', 'Female'].map(g => (
                      <label key={g} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                        <input type="radio" name="gender" value={g} className="accent-[#1E40AF]" required disabled={isPending} /><span>{g}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
              <label className="block">
                <span className={labelClass}>Institute <em className="font-normal not-italic text-slate-400">(optional)</em></span>
                <input name="institute" className={inputClass} placeholder="Your school/college" disabled={isPending} />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Phone Number</span>
                  <span className="relative block">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Phone className="text-slate-400" size={17} />
                    </span>
                    <input name="phone" className={`${inputClass} pl-11`} placeholder="+88 01..." required disabled={isPending} />
                  </span>
                </label>
                <label className="block">
                  <span className={labelClass}>Email</span>
                  <span className="relative block">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Mail className="text-slate-400" size={17} />
                    </span>
                    <input name="email" className={`${inputClass} pl-11`} type="email" placeholder="you@example.com" required disabled={isPending} />
                  </span>
                </label>
              </div>
              <label className="block">
                <span className={labelClass}>Password</span>
                <span className="relative block">
                  <input name="password" className={`${inputClass} pr-12`} type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" value={password} onChange={event => setPassword(event.target.value)} required disabled={isPending} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 rounded-lg text-slate-400 hover:text-teal-700">
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </span>

                {/* Visual Password Checker for Registration */}
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {passwordChecks.map(rule => (
                    <li key={rule.label} className={`flex items-center gap-2 text-xs font-medium ${rule.valid ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {rule.valid ? <Check size={15} /> : <X size={15} />}<span>{rule.label}</span>
                    </li>
                  ))}
                </ul>
              </label>

              <div className="overflow-hidden rounded-lg">
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                  onChange={(val: string | null) => setRecaptchaToken(val)}
                />
              </div>

              {/* Does not prevent submission based on password check */}
              <button type="submit" disabled={isPending} className="h-12 w-full rounded-xl bg-[#0D9488] font-bold text-white shadow-lg shadow-teal-900/15 transition hover:bg-teal-700 disabled:opacity-50">
                <span>{isPending ? 'Submitting...' : 'Register'}</span>
              </button>
            </form>
          )}

          {view === 'register' && registered && (
            <div className="rounded-2xl border border-teal-100 bg-teal-50 p-8 text-center ">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-teal-700 shadow-sm">
                <Clock3 size={32} />
              </div>
              <h3 className="mt-6 text-xl font-extrabold text-slate-900 font-heading">Registration received</h3>
              <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-600">Wait for Admin Review. After confirmation, you will be able to login.</p>
              <button type="button" onClick={() => { setView('login'); setRegistered(false); }} className="mt-8 font-bold text-blue-800 hover:text-teal-700">
                <span>Back to login</span>
              </button>
            </div>
          )}

          {view === 'forgot' && (
            <div className="space-y-6">
              <button type="button" onClick={() => setView('login')} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-800">
                <ArrowLeft size={17} /><span>Back to login</span>
              </button>

              <div className={`rounded-2xl border ${otpStep === 1 ? 'border-blue-300 shadow-sm' : 'border-slate-200 opacity-50'} p-6 transition`}>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-800">Step 01</p>
                <h3 className="mt-2 text-lg font-extrabold font-heading">Find your account</h3>
                <label className="mt-4 block">
                  <span className={labelClass}>Email address</span>
                  <input className={inputClass} type="email" placeholder="you@example.com" value={resetEmail} onChange={e => setResetEmail(e.target.value)} disabled={otpStep !== 1 || isPending} />
                </label>
                {otpStep === 1 && (
                  <button type="button" onClick={handleSendOtp} disabled={isPending} className="mt-5 h-11 w-full rounded-xl bg-[#1E40AF] text-sm font-bold text-white hover:bg-blue-900 disabled:opacity-70">
                    <span>{isPending ? 'Sending...' : 'Send OTP'}</span>
                  </button>
                )}
              </div>

              {otpStep >= 2 && (
                <div className={`rounded-2xl border ${otpStep === 2 ? 'border-blue-300 shadow-sm' : 'border-slate-200'} p-6 transition`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-800">Step 02</p>
                      <h3 className="mt-2 text-lg font-extrabold font-heading">Verify your email</h3>
                    </div>
                    <span className="text-sm font-bold text-red-600">{formattedTime}</span>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <input className={`${inputClass} text-center tracking-[0.5em] font-bold text-xl`} maxLength={6} placeholder="123456" value={otpValue} onChange={e => {
                      setOtpValue(e.target.value)
                      if (e.target.value.length === 6) setOtpStep(3)
                    }} disabled={otpStep !== 2 || isPending || secondsLeft === 0} />
                  </div>
                </div>
              )}

              {otpStep === 3 && (
                <div className="rounded-2xl border border-blue-300 shadow-sm p-6 transition">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-800">Step 03</p>
                  <h3 className="mt-2 text-lg font-extrabold font-heading">Create a new password</h3>
                  <input className={inputClass} type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} />
                  <input className={inputClass} type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  <button type="button" onClick={handleResetPassword} disabled={isPending} className="mt-5 h-11 w-full rounded-xl bg-[#0D9488] text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-70">
                    <span>{isPending ? 'Updating...' : 'Reset Password'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </section>
      </div>
    </main>
  )
}
