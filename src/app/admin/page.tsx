'use client'

import { useState, useTransition } from 'react'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { loginAdmin } from '@/app/actions/auth'

export default function AdminLogin() {
  const router = useRouter()
  
  const [showAdminPassword, setShowAdminPassword] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState('')

  const inputClass = 'mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10 disabled:opacity-60'
  const labelClass = 'text-sm font-semibold text-slate-700'

  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg('')
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const res = await loginAdmin(formData)
      if (res?.error) {
        setErrorMsg(res.error)
      } else {
        router.push('/admin/dashboard')
      }
    })
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-8 sm:py-12 grid place-items-center font-sans">
      <div className="w-full max-w-md my-auto">
        <div className="text-center mb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1E40AF] text-white shadow-xl mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-950 font-heading">Admin Portal</h1>
          <p className="text-sm text-slate-500 mt-2">Secure access for RHTacademy administrators</p>
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 font-medium">
            {errorMsg}
          </div>
        )}

        <form className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)]" onSubmit={handleAdminLogin}>
          <label className="block">
            <span className={labelClass}>Username or Email</span>
            <input name="username" className={inputClass} placeholder="Admin username/email" required disabled={isPending} />
          </label>
          <label className="mt-5 block">
            <span className={labelClass}>Password</span>
            <span className="relative block">
              <input name="password" className={`${inputClass} pr-12`} type={showAdminPassword ? 'text' : 'password'} value={adminPassword} onChange={event => setAdminPassword(event.target.value)} placeholder="Admin password" required disabled={isPending} />
              <button type="button" onClick={() => setShowAdminPassword(!showAdminPassword)} className="absolute right-3 top-3 rounded-lg p-1 text-slate-400 hover:text-blue-800">
                {showAdminPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </span>
          </label>
          
          <label className="mt-6 flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-[#1E40AF]" />
            <span>Remember Me for 7 days</span>
          </label>
          
          <button type="submit" disabled={isPending} className="mt-6 h-12 w-full rounded-xl bg-[#102b78] font-bold text-white shadow-lg shadow-blue-900/20 hover:bg-[#1E40AF] disabled:opacity-50 transition active:scale-[.99]">
            <span>{isPending ? 'Authenticating...' : 'Login as Admin'}</span>
          </button>
          
          <p className="mt-6 text-center text-xs leading-5 text-slate-400">
            Protected by advanced security systems.<br />
            After 5 failed attempts, your account will be temporarily locked.
          </p>
        </form>
      </div>
    </main>
  )
}
