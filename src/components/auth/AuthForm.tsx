'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { useAuthStore } from '@/store'
import { validateEmail, validatePhone, cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface AuthFormProps {
  mode: 'login' | 'register'
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.email) newErrors.email = 'Email is required'
    else if (!validateEmail(form.email)) newErrors.email = 'Enter a valid email address'
    if (!form.password) newErrors.password = 'Password is required'
    else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (mode === 'register') {
      if (!form.fullName.trim()) newErrors.fullName = 'Full name is required'
      if (!form.phone) newErrors.phone = 'Phone number is required'
      else if (!validatePhone(form.phone)) newErrors.phone = 'Enter a valid Indonesian phone number'
      if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
      else if (form.confirmPassword !== form.password) newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    // Simulate API call (replace with Supabase Auth)
    await new Promise(r => setTimeout(r, 1200))

    if (mode === 'login') {
      // Demo: any valid email/pass logs in as customer
      setUser({
        id: 'demo-user-' + Date.now(),
        email: form.email,
        full_name: form.email.split('@')[0],
        role: form.email.includes('admin') ? 'admin' : form.email.includes('seller') ? 'seller' : 'customer',
      })
      toast.success('Welcome back!', { style: { background: '#111', color: '#fff', border: '1px solid #C6A66B' } })
      router.push('/dashboard')
    } else {
      setUser({
        id: 'demo-user-' + Date.now(),
        email: form.email,
        full_name: form.fullName,
        role: 'customer',
      })
      toast.success('Account created successfully!', { style: { background: '#111', color: '#fff', border: '1px solid #C6A66B' } })
      router.push('/dashboard')
    }

    setLoading(false)
  }

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-3xl text-[#111111] tracking-[0.2em]">
            <span className="text-[#C6A66B]">É</span>LÉGANCE
          </Link>
          <p className="text-[#6b7280] text-sm font-light mt-2">
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        <div className="bg-white border border-[#e5e1d8] p-8">
          {/* Demo Notice */}
          <div className="bg-[#C6A66B]/10 border border-[#C6A66B]/30 p-3 mb-6 text-xs text-[#6b7280]">
            <strong className="text-[#111111]">Demo Mode:</strong> Authentication simulated locally.
            Connect Supabase Auth for production use.
            {mode === 'login' && ' Use any email/password to log in.'}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name (register only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-[#111111] tracking-wider uppercase mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => update('fullName', e.target.value)}
                    placeholder="Your full name"
                    className={cn(
                      'w-full pl-10 pr-4 py-3 border text-sm bg-white focus:border-[#C6A66B] transition-colors',
                      errors.fullName ? 'border-red-400' : 'border-[#e5e1d8]'
                    )}
                  />
                </div>
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[#111111] tracking-wider uppercase mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="your@email.com"
                  className={cn(
                    'w-full pl-10 pr-4 py-3 border text-sm bg-white focus:border-[#C6A66B] transition-colors',
                    errors.email ? 'border-red-400' : 'border-[#e5e1d8]'
                  )}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Phone (register only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-[#111111] tracking-wider uppercase mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className={cn(
                      'w-full pl-10 pr-4 py-3 border text-sm bg-white focus:border-[#C6A66B] transition-colors',
                      errors.phone ? 'border-red-400' : 'border-[#e5e1d8]'
                    )}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[#111111] tracking-wider uppercase mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="Minimum 8 characters"
                  className={cn(
                    'w-full pl-10 pr-10 py-3 border text-sm bg-white focus:border-[#C6A66B] transition-colors',
                    errors.password ? 'border-red-400' : 'border-[#e5e1d8]'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#111111]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password (register only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-[#111111] tracking-wider uppercase mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={(e) => update('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    className={cn(
                      'w-full pl-10 pr-10 py-3 border text-sm bg-white focus:border-[#C6A66B] transition-colors',
                      errors.confirmPassword ? 'border-red-400' : 'border-[#e5e1d8]'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#111111]"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            {/* Forgot Password */}
            {mode === 'login' && (
              <div className="text-right">
                <Link href="/forgot-password" className="text-xs text-[#C6A66B] hover:text-[#a8873d] transition-colors">
                  Forgot password?
                </Link>
              </div>
            )}

            {/* Terms (register only) */}
            {mode === 'register' && (
              <p className="text-xs text-[#6b7280] font-light leading-relaxed">
                By registering, you agree to our{' '}
                <Link href="/terms" className="text-[#C6A66B] hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-[#C6A66B] hover:underline">Privacy Policy</Link>.
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 text-xs flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center border-t border-[#e5e1d8] pt-6">
            <p className="text-sm text-[#6b7280] font-light">
              {mode === 'login' ? (
                <>Don&rsquo;t have an account?{' '}
                  <Link href="/register" className="text-[#C6A66B] hover:text-[#a8873d] font-medium transition-colors">
                    Create Account
                  </Link>
                </>
              ) : (
                <>Already have an account?{' '}
                  <Link href="/login" className="text-[#C6A66B] hover:text-[#a8873d] font-medium transition-colors">
                    Sign In
                  </Link>
                </>
              )}
            </p>
          </div>

          {/* Become Seller */}
          {mode === 'register' && (
            <div className="mt-4 p-4 bg-[#f8f7f4] border border-[#e5e1d8] text-center">
              <p className="text-xs text-[#6b7280] font-light mb-2">Want to sell on ÉLÉGANCE?</p>
              <Link href="/seller/register" className="text-xs text-[#C6A66B] font-medium hover:underline">
                Apply as a Seller →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
