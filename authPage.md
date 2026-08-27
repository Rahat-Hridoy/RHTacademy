import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, Clock3, Eye, EyeOff, GraduationCap, LockKeyhole, Mail, Phone, ShieldCheck, Sparkles, UserRound, X } from 'lucide-react';
import { FloatingNavbar } from './FloatingNavbar';
type AuthView = 'login' | 'register' | 'forgot' | 'admin';
const classes = [{
  value: 'class-9',
  label: 'Class 9'
}, {
  value: 'class-10',
  label: 'Class 10'
}, {
  value: 'class-11',
  label: 'Class 11'
}, {
  value: 'class-12',
  label: 'Class 12'
}];
const passwordRules = [{
  label: 'Minimum 8 characters',
  test: (value: string) => value.length >= 8
}, {
  label: 'One uppercase letter',
  test: (value: string) => /[A-Z]/.test(value)
}, {
  label: 'One number',
  test: (value: string) => /\d/.test(value)
}, {
  label: 'One special character',
  test: (value: string) => /[^A-Za-z0-9]/.test(value)
}];
export const AuthPage = () => {
  const [view, setView] = useState<AuthView>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [registered, setRegistered] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(180);
  useEffect(() => {
    if (view !== 'forgot' || secondsLeft <= 0) return undefined;
    const timer = window.setInterval(() => setSecondsLeft(seconds => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [view, secondsLeft]);
  const passwordStrength = useMemo(() => passwordRules.filter(rule => rule.test(password)).length, [password]);
  const adminChecks = passwordRules.map(rule => ({
    ...rule,
    valid: rule.test(adminPassword)
  }));
  const formattedTime = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;
  const inputClass = 'mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10';
  const labelClass = 'text-sm font-semibold text-slate-700';
  return <main className="min-h-screen bg-[#F9FAFB] px-4 pb-10 pt-24 font-sans text-slate-900 sm:px-6 lg:px-10">
      <FloatingNavbar logoOnly />
      <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)] lg:grid-cols-[0.86fr_1.14fr]">
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#102b78] via-[#1E40AF] to-[#0D9488] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full border-[28px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[38px] border-teal-200/10" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl font-black text-[#1E40AF] shadow-xl">R</div>
              <span className="text-2xl font-extrabold tracking-tight">RHTacademy</span>
            </div>
            <div className="mt-28 max-w-sm">
              <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-teal-200"><Sparkles size={15} /><span>Learn with purpose</span></p>
              <h1 className="text-5xl font-black leading-[1.04] tracking-[-0.06em]">Your next chapter starts here.</h1>
              <p className="mt-7 max-w-xs text-base leading-7 text-blue-100">A focused learning space for curious students, thoughtful teachers, and ambitious futures.</p>
            </div>
          </div>
          <div className="relative flex items-end justify-between">
            <div className="max-w-[210px] text-sm leading-6 text-blue-100"><strong className="block text-white">Built for bright minds.</strong><span>Explore lessons, track progress, and grow every day.</span></div>
            <div className="flex h-24 w-24 rotate-6 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 backdrop-blur-sm"><GraduationCap size={48} strokeWidth={1.3} /></div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-col px-5 py-7 sm:px-10 sm:py-10">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Welcome back</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] text-slate-950">{view === 'admin' ? 'Admin portal' : view === 'forgot' ? 'Recover your account' : 'Student access'}</h2>
            </div>
            <div className="hidden rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-800 sm:block"><span>Secure &amp; simple</span></div>
          </div>

          {view !== 'forgot' && <div className="mb-7 flex rounded-xl bg-slate-100 p-1" role="tablist" aria-label="Student authentication mode">
              <button type="button" role="tab" aria-selected={view === 'login'} onClick={() => {
            setView('login');
            setRegistered(false);
          }} className={`flex-1 rounded-lg py-3 text-sm font-bold transition ${view === 'login' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}><span>Login</span></button>
              <button type="button" role="tab" aria-selected={view === 'register'} onClick={() => {
            setView('register');
            setRegistered(false);
          }} className={`flex-1 rounded-lg py-3 text-sm font-bold transition ${view === 'register' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}><span>Register</span></button>
            </div>}

          {view === 'login' && <form className="space-y-5" onSubmit={event => event.preventDefault()}>
              <label className="block"><span className={labelClass}>Username or Email</span><span className="relative block"><UserRound className="absolute left-4 top-3.5 text-slate-400" size={18} /><input className={`${inputClass} pl-11`} placeholder="Enter your username or email" /></span></label>
              <label className="block"><span className={labelClass}>Password</span><span className="relative block"><LockKeyhole className="absolute left-4 top-3.5 text-slate-400" size={18} /><input className={`${inputClass} pl-11 pr-12`} type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={event => setPassword(event.target.value)} /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 rounded-lg p-1 text-slate-400 hover:text-blue-800">{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></span></label>
              <div className="flex h-[74px] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4"><span className="flex h-7 w-7 items-center justify-center rounded border-2 border-slate-300 bg-white"><Check size={16} className="text-slate-300" /></span><span className="text-sm font-medium text-slate-500">I am not a robot</span><span className="ml-auto text-[10px] leading-3 text-slate-400">reCAPTCHA<br /><span>Privacy · Terms</span></span></div>
              <div className="flex items-center justify-between gap-3 text-sm"><label className="flex items-center gap-2 text-slate-600"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-[#1E40AF]" /><span>Remember me for 30 days</span></label><button type="button" onClick={() => {
              setView('forgot');
              setSecondsLeft(180);
            }} className="font-bold text-blue-800 hover:text-teal-700"><span>Forgot Password?</span></button></div>
              <button type="submit" className="h-12 w-full rounded-xl bg-[#1E40AF] font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-900 active:scale-[.99]"><span>Login</span></button>
            </form>}

          {view === 'register' && !registered && <form className="space-y-4" onSubmit={event => {
          event.preventDefault();
          setRegistered(true);
        }}>
              <label className="block"><span className={labelClass}>Full Name</span><input className={inputClass} placeholder="Your full name" /></label>
              <div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className={labelClass}>Class</span><select className={inputClass} defaultValue=""><option value="" disabled>Select class</option>{classes.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><fieldset><legend className={labelClass}>Gender</legend><div className="mt-2 flex h-12 items-center gap-4">{['Male', 'Female'].map(gender => <label key={gender} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"><input type="radio" name="gender" value={gender} className="accent-[#1E40AF]" /><span>{gender}</span></label>)}</div></fieldset></div>
              <label className="block"><span className={labelClass}>Institute <em className="font-normal not-italic text-slate-400">(optional)</em></span><input className={inputClass} placeholder="Your school/college" /></label>
              <div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className={labelClass}>Phone Number</span><span className="relative block"><Phone className="absolute left-4 top-3.5 text-slate-400" size={17} /><input className={`${inputClass} pl-11`} placeholder="+91 00000 00000" /></span></label><label className="block"><span className={labelClass}>Email</span><span className="relative block"><Mail className="absolute left-4 top-3.5 text-slate-400" size={17} /><input className={`${inputClass} pl-11`} type="email" placeholder="you@example.com" /></span></label></div>
              <label className="block"><span className={labelClass}>Password</span><span className="relative block"><input className={`${inputClass} pr-12`} type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" value={password} onChange={event => setPassword(event.target.value)} /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 rounded-lg p-1 text-slate-400 hover:text-teal-700">{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></span><span className="mt-2 flex gap-1.5">{[1, 2, 3, 4].map(bar => <span key={bar} className={`h-1.5 flex-1 rounded-full ${passwordStrength >= bar ? 'bg-teal-600' : 'bg-slate-200'}`} />)}</span><span className="mt-1 block text-xs text-slate-400">Use 8+ characters with a mix of letters, numbers and symbols.</span></label>
              <button type="submit" className="h-12 w-full rounded-xl bg-[#0D9488] font-bold text-white shadow-lg shadow-teal-900/15 transition hover:bg-teal-700"><span>Register</span></button>
            </form>}

          {view === 'register' && registered && <div className="rounded-2xl border border-teal-100 bg-teal-50 p-7 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-teal-700 shadow-sm"><Clock3 size={28} /></div><h3 className="mt-5 text-xl font-extrabold text-slate-900">Registration received</h3><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">Wait for Admin Review. After confirmation, you will be able to login.</p><button type="button" onClick={() => {
            setView('login');
            setRegistered(false);
          }} className="mt-6 font-bold text-blue-800 hover:text-teal-700"><span>Back to login</span></button></div>}

          {view === 'forgot' && <div className="space-y-5"><button type="button" onClick={() => setView('login')} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-800"><ArrowLeft size={17} /><span>Back to login</span></button><div className="rounded-2xl border border-slate-200 p-5"><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-800">Step 01</p><h3 className="mt-2 text-lg font-extrabold">Find your account</h3><label className="mt-4 block"><span className={labelClass}>Email address</span><input className={inputClass} type="email" placeholder="you@example.com" /></label><button type="button" className="mt-4 h-11 w-full rounded-xl bg-[#1E40AF] text-sm font-bold text-white hover:bg-blue-900"><span>Send OTP</span></button></div><div className="rounded-2xl border border-slate-200 p-5"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-800">Step 02</p><h3 className="mt-2 text-lg font-extrabold">Verify your email</h3></div><span className="text-sm font-bold text-red-600">{formattedTime}</span></div><div className="mt-4 flex gap-2 sm:gap-3">{[1, 2, 3, 4, 5, 6].map(box => <input key={box} aria-label={`OTP digit ${box}`} maxLength={1} inputMode="numeric" className="h-12 min-w-0 flex-1 rounded-xl border border-slate-200 text-center text-lg font-bold outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10" />)}</div></div><div className="rounded-2xl border border-slate-200 p-5"><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-800">Step 03</p><h3 className="mt-2 text-lg font-extrabold">Create a new password</h3><input className={inputClass} type="password" placeholder="New password" /><input className={inputClass} type="password" placeholder="Confirm password" /><button type="button" className="mt-4 h-11 w-full rounded-xl bg-[#0D9488] text-sm font-bold text-white hover:bg-teal-700"><span>Reset Password</span></button></div></div>}

          <div className="mt-auto border-t border-slate-100 pt-6 text-center"><button type="button" onClick={() => setView(view === 'admin' ? 'login' : 'admin')} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-800">{view === 'admin' ? <X size={16} /> : <ShieldCheck size={16} />}<span>{view === 'admin' ? 'Return to student access' : 'Admin Access'}</span></button></div>

          {view === 'admin' && <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-5"><div className="mb-5 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E40AF] text-white"><ShieldCheck size={21} /></div><div><h3 className="font-extrabold text-slate-900">Admin Access</h3><p className="text-xs text-slate-500">Secure administrator sign in</p></div></div><label className="block"><span className={labelClass}>Username</span><input className={inputClass} placeholder="Admin username" /></label><label className="mt-4 block"><span className={labelClass}>Password</span><span className="relative block"><input className={`${inputClass} pr-12`} type={showAdminPassword ? 'text' : 'password'} value={adminPassword} onChange={event => setAdminPassword(event.target.value)} placeholder="Admin password" /><button type="button" aria-label={showAdminPassword ? 'Hide password' : 'Show password'} onClick={() => setShowAdminPassword(!showAdminPassword)} className="absolute right-3 top-3 rounded-lg p-1 text-slate-400 hover:text-blue-800">{showAdminPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></span></label><ul className="mt-4 grid gap-2 sm:grid-cols-2">{adminChecks.map(rule => <li key={rule.label} className={`flex items-center gap-2 text-xs font-medium ${rule.valid ? 'text-emerald-700' : 'text-slate-500'}`}>{rule.valid ? <Check size={15} /> : <X size={15} />}<span>{rule.label}</span></li>)}</ul><label className="mt-5 flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" className="h-4 w-4 accent-[#1E40AF]" /><span>Remember Me for 7 days</span></label><button type="button" className="mt-5 h-12 w-full rounded-xl bg-[#102b78] font-bold text-white shadow-lg shadow-blue-900/20 hover:bg-[#1E40AF]"><span>Login as Admin</span></button><p className="mt-4 text-center text-xs leading-5 text-slate-500">After 5 failed attempts, account will be locked for 5 minutes</p></div>}
        </section>
      </div>
    </main>;
};