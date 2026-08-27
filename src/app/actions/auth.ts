'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function registerStudent(formData: FormData, recaptchaToken: string) {
  const name = formData.get('name') as string
  const classValue = formData.get('class') as string
  const gender = formData.get('gender') as string
  const institute = formData.get('institute') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!name || !classValue || !gender || !phone || !email || !password) {
    return { error: 'Missing required fields' }
  }
  if (!recaptchaToken) {
    return { error: 'Please complete the reCAPTCHA' }
  }

  // Verify reCAPTCHA
  const recaptchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
  })
  
  const recaptchaData = await recaptchaRes.json()
  if (!recaptchaData.success) {
    return { error: 'reCAPTCHA verification failed' }
  }

  const supabase = await createClient()

  // Verify if email is already taken in auth (this might fail if email exists)
  // To keep it simple, we just insert into registration_requests
  const { error } = await supabase.from('registration_requests').insert([
    {
      name,
      class: classValue,
      gender,
      institute,
      phone,
      email,
      password, // Password temporarily stored here securely (hopefully hashed, but plain text as per user requirement for phase 1-2 bridging)
      status: 'pending',
    },
  ])

  if (error) {
    console.error('Registration error:', error)
    return { error: error.message }
  }

  return { success: true }
}

export async function loginStudent(formData: FormData) {
  const identifier = formData.get('identifier') as string // Email or Username
  const password = formData.get('password') as string

  if (!identifier || !password) return { error: 'Missing credentials' }

  const supabase = await createClient()
  const supabaseAdmin = await createAdminClient()

  let email = identifier

  // If it's a username (no @), we need to fetch the email
  if (!identifier.includes('@')) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('username', identifier)
      .single()

    if (!profile || !profile.email) {
      return { error: 'Invalid username or password' }
    }
    email = profile.email
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Check if profile is approved
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_approved, role')
    .eq('id', data.user.id)
    .single()

  if (!profile?.is_approved && profile?.role !== 'admin') {
    await supabase.auth.signOut()
    return { error: 'Your account is pending admin approval' }
  }

  return { success: true, userId: data.user.id }
}

export async function loginAdmin(formData: FormData) {
  const identifier = formData.get('username') as string // Admin username or email
  const password = formData.get('password') as string

  if (!identifier || !password) return { error: 'Missing credentials' }

  const supabaseAdmin = await createAdminClient()
  const supabase = await createClient()

  let email = identifier

  if (!identifier.includes('@')) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('username', identifier)
      .single()

    if (profile?.email) {
      email = profile.email
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (profile?.role !== 'admin') {
    await supabase.auth.signOut()
    return { error: 'Unauthorized access. Admin role required.' }
  }

  return { success: true }
}

export async function sendOtp(formData: FormData) {
  const email = formData.get('email') as string
  if (!email) return { error: 'Email is required' }

  const supabaseAdmin = await createAdminClient()
  
  // Check if user exists (profiles)
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()
    
  if (!profile) {
    return { error: 'No user found with this email' }
  }

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  
  // Expiry in 3 minutes
  const expiresAt = new Date(Date.now() + 3 * 60 * 1000).toISOString()

  // Save to DB
  const { error: dbError } = await supabaseAdmin
    .from('otps')
    .upsert({ email, otp, expires_at: expiresAt })

  if (dbError) {
    return { error: 'Failed to generate OTP' }
  }

  // Send Email
  try {
    await resend.emails.send({
      from: 'RHTacademy <noreply@rhtacademy.com>', // MUST USE VERIFIED DOMAIN IN PRODUCTION
      to: [email],
      subject: 'Your Password Reset OTP',
      html: `<p>Your OTP to reset your password is <strong>${otp}</strong>. It expires in 3 minutes.</p>`,
    })
  } catch (error: any) {
    return { error: error.message || 'Failed to send email' }
  }

  return { success: true }
}

export async function verifyOtpAndResetPassword(formData: FormData) {
  const email = formData.get('email') as string
  const otp = formData.get('otp') as string
  const newPassword = formData.get('password') as string

  if (!email || !otp || !newPassword) return { error: 'Missing information' }

  const supabaseAdmin = await createAdminClient()
  
  // Verify OTP
  const { data: otpRecord } = await supabaseAdmin
    .from('otps')
    .select('*')
    .eq('email', email)
    .eq('otp', otp)
    .single()
    
  if (!otpRecord) return { error: 'Invalid OTP' }
  
  if (new Date(otpRecord.expires_at) < new Date()) {
    return { error: 'OTP has expired' }
  }

  // Find User ID
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  if (!profile) return { error: 'User not found' }

  // Reset Password via Admin API
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(profile.id, {
    password: newPassword,
  })

  if (updateError) {
    return { error: updateError.message }
  }
  
  // Delete used OTP
  await supabaseAdmin.from('otps').delete().eq('email', email)

  return { success: true }
}
