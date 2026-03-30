import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData, toLoginDto } from '../types/Auth'
import { login, forgotPassword, resetPassword } from '../services/authService'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../routes/routePaths'
import { LOGO_TOY_STORY } from '../constants/imageAssets'

import imgImage11 from "@/assets/login/image11.png"
const imgLine38 = "https://www.figma.com/api/mcp/asset/919bffbb-b4c0-4649-a02e-4e37b30e697f"

// ─── Eye icons ──────────────────────────────────────────────────────────────
const EyeOff = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
)
const EyeOn = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

// Shared input class matching the login design
const INPUT = 'w-full h-[42px] px-3.5 rounded-2xl bg-white text-sm text-black placeholder:text-gray-400 outline-none box-border shadow-md focus:ring-2 focus:ring-[#f20000]/40 transition-all'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFieldError
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      const loginDto = toLoginDto(data)
      const response = await login(loginDto)

      // Login successful - token, role, and user data are stored automatically
      console.log('Login successful:', response.message)
      if (response.user) {
        console.log('User data loaded:', response.user)
      }

      // Update global auth state
      refreshUser()
      if (response.role === 'Admin' || response.role === 'Staff') {
        navigate(ROUTES.ADMIN_DASHBOARD)
      } else {
        navigate(ROUTES.HOME)
      }
    } catch (err: any) {
      // Handle backend validation/error messages
      console.error('Login error:', err)

      // If backend returns field-specific validation errors
      if (err.errors && typeof err.errors === 'object') {
        Object.entries(err.errors).forEach(([field, messages]) => {
          const fieldName = field as keyof LoginFormData
          if (fieldName === 'email' || fieldName === 'password') {
            setFieldError(fieldName, {
              type: 'server',
              message: Array.isArray(messages) ? messages[0] : String(messages)
            })
          }
        })
        // Also show general error if available
        if (err.message) {
          setError(err.message)
        }
      } else {
        // Show general backend error message (e.g., "Sai mật khẩu!", "Không tìm thấy tài khoản!")
        setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ─── Forgot Password state ────────────────────────────────────────────────
  const [showForgot, setShowForgot] = useState(false)
  const [fpStep, setFpStep] = useState<'email' | 'otp' | 'reset' | 'done'>('email')
  const [fpEmail, setFpEmail] = useState('')
  const [fpOtp, setFpOtp] = useState(['', '', '', '', '', ''])
  const [fpNewPw, setFpNewPw] = useState('')
  const [fpConfirmPw, setFpConfirmPw] = useState('')
  const [fpLoading, setFpLoading] = useState(false)
  const [fpError, setFpError] = useState<string | null>(null)
  const [fpSuccess, setFpSuccess] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)

  const openForgot = () => {
    setShowForgot(true); setFpStep('email')
    setFpEmail(''); setFpOtp(['', '', '', '', '', ''])
    setFpNewPw(''); setFpConfirmPw('')
    setFpError(null); setFpSuccess(null); setCountdown(0)
  }
  const closeForgot = () => setShowForgot(false)

  const startCountdown = () => {
    setCountdown(60)
    const t = setInterval(() => setCountdown(p => { if (p <= 1) { clearInterval(t); return 0 } return p - 1 }), 1000)
  }

  const handleSendOtp = async () => {
    if (!fpEmail.trim()) { setFpError('Vui lòng nhập email.'); return }
    setFpLoading(true); setFpError(null)
    try {
      await forgotPassword(fpEmail.trim())
      setFpStep('otp'); startCountdown()
    } catch (e: any) {
      setFpError(e.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
    } finally { setFpLoading(false) }
  }

  const handleResendOtp = async () => {
    if (countdown > 0) return
    setFpLoading(true); setFpError(null)
    try {
      await forgotPassword(fpEmail.trim())
      setFpOtp(['', '', '', '', '', '']); startCountdown()
      setFpSuccess('Đã gửi lại mã OTP!'); setTimeout(() => setFpSuccess(null), 3000)
    } catch (e: any) {
      setFpError(e.message || 'Có lỗi xảy ra.')
    } finally { setFpLoading(false) }
  }

  const handleOtpChange = (i: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return
    const next = [...fpOtp]; next[i] = val; setFpOtp(next)
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus()
  }

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !fpOtp[i] && i > 0) document.getElementById(`otp-${i - 1}`)?.focus()
  }

  const handleVerifyOtp = () => {
    if (fpOtp.join('').length < 6) { setFpError('Vui lòng nhập đủ 6 ký tự OTP.'); return }
    setFpError(null); setFpStep('reset')
  }

  const handleResetPassword = async () => {
    if (!fpNewPw || fpNewPw.length < 6) { setFpError('Mật khẩu mới phải có ít nhất 6 ký tự.'); return }
    if (fpNewPw !== fpConfirmPw) { setFpError('Mật khẩu xác nhận không khớp.'); return }
    setFpLoading(true); setFpError(null)
    try {
      await resetPassword(fpEmail.trim(), fpOtp.join(''), fpNewPw)
      setFpStep('done')
    } catch (e: any) {
      setFpError(e.message || 'Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.')
    } finally { setFpLoading(false) }
  }

  // Step indicator
  const STEPS = ['email', 'otp', 'reset'] as const
  const stepIdx = fpStep === 'done' ? 2 : STEPS.indexOf(fpStep as any)

  return (
    <div className="!font-sans min-h-screen w-full bg-gradient-to-br from-white via-[#ffc703] to-[#ff4200] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="relative w-full max-w-[820px] h-[calc(88vh-50px)] min-h-[550px] bg-white rounded-[28px] shadow-2xl overflow-hidden flex max-xl:flex-col max-xl:h-auto max-xl:min-h-0">

        {/* Logo */}
        <div className="absolute top-6 left-8 z-50 max-md:left-4 max-md:top-4">
          <Link to="/" className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity">
            <img src={LOGO_TOY_STORY} alt="TOY STORY" className="h-[60px] w-auto object-contain" />
          </Link>
        </div>

        {/* Left image panel */}
        <div className="relative w-[50%] h-full bg-gradient-to-br from-[#ffa500] to-[#ff8c00] flex items-end justify-center p-10 max-xl:w-full max-xl:h-[280px]">
          <img alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" src={imgImage11} />
        </div>

        {/* Divider line */}
        <div className="absolute left-[50%] top-0 w-0 h-full flex items-center justify-center z-10 -translate-x-1/2 max-xl:hidden">
          <img alt="" className="w-screen h-0.5 rotate-90 origin-center" src={imgLine38} />
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 bg-white overflow-y-auto max-xl:w-full max-xl:p-6 relative">

          {/* ════════════ FORGOT PASSWORD OVERLAY ════════════ */}
          {showForgot && (
            <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center px-8 py-10 overflow-y-auto">

              {/* Back */}
              <button
                onClick={fpStep === 'done' ? closeForgot : fpStep === 'email' ? closeForgot : () => setFpStep(fpStep === 'reset' ? 'otp' : 'email')}
                className="absolute top-5 left-5 flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#f20000] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                {fpStep === 'done' ? 'Đăng nhập' : 'Quay lại'}
              </button>

              {/* Step dots */}
              {fpStep !== 'done' && (
                <div className="flex items-center gap-2 mb-7 mt-4">
                  {STEPS.map((s, i) => {
                    const active = i <= stepIdx
                    const done = i < stepIdx
                    return (
                      <React.Fragment key={s}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${active ? 'bg-[#f20000] text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {done
                            ? <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            : i + 1}
                        </div>
                        {i < 2 && <div className={`w-10 h-0.5 rounded transition-all duration-300 ${i < stepIdx ? 'bg-[#f20000]' : 'bg-gray-200'}`} />}
                      </React.Fragment>
                    )
                  })}
                </div>
              )}

              {/* ── Step 1: Email ── */}
              {fpStep === 'email' && (
                <div className="w-full max-w-[320px] flex flex-col gap-5 animate-[fadeIn_0.2s_ease]">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3 ring-4 ring-red-50/60">
                      <svg className="w-7 h-7 text-[#f20000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-black text-[#c1121f] m-0">Quên mật khẩu?</h2>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">Nhập email của bạn — chúng tôi sẽ gửi mã OTP 6 chữ số để đặt lại mật khẩu.</p>
                  </div>

                  {fpError && <p className="text-xs text-[#f20000] bg-red-50 border border-red-200 rounded-xl px-3 py-2">{fpError}</p>}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-black">Email</label>
                    <input
                      type="email" placeholder="email@example.com"
                      value={fpEmail} onChange={e => setFpEmail(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                      className={INPUT} autoFocus
                    />
                  </div>

                  <button onClick={handleSendOtp} disabled={fpLoading}
                    className="w-full h-[48px] bg-[#f20000] rounded-3xl text-white font-bold text-sm hover:bg-[#d10000] disabled:opacity-60 transition-colors shadow-md shadow-red-200">
                    {fpLoading ? 'Đang gửi...' : 'Gửi mã OTP →'}
                  </button>
                </div>
              )}

              {/* ── Step 2: OTP ── */}
              {fpStep === 'otp' && (
                <div className="w-full max-w-[320px] flex flex-col gap-5 animate-[fadeIn_0.2s_ease]">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3 ring-4 ring-red-50/60">
                      <svg className="w-7 h-7 text-[#f20000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-black text-[#c1121f] m-0">Nhập mã OTP</h2>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Mã đã gửi đến <span className="font-semibold text-gray-700">{fpEmail}</span>.<br />Hiệu lực trong 15 phút.
                    </p>
                  </div>

                  {fpError && <p className="text-xs text-[#f20000] bg-red-50 border border-red-200 rounded-xl px-3 py-2">{fpError}</p>}
                  {fpSuccess && <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">{fpSuccess}</p>}

                  {/* 6-box OTP */}
                  <div className="flex justify-center gap-2.5">
                    {fpOtp.map((digit, i) => (
                      <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        className={`w-10 h-12 text-center text-xl font-black border-2 rounded-xl outline-none shadow-sm transition-all
                          ${digit ? 'border-[#f20000] bg-red-50/40 text-[#c1121f]' : 'border-gray-200 bg-white text-black'}
                          focus:border-[#f20000] focus:ring-2 focus:ring-[#f20000]/20`}
                      />
                    ))}
                  </div>

                  {/* Countdown */}
                  <p className="text-center text-xs text-gray-400 m-0">
                    {countdown > 0
                      ? <>Gửi lại sau <span className="font-bold text-[#f20000] tabular-nums">{countdown}s</span></>
                      : <button onClick={handleResendOtp} disabled={fpLoading}
                        className="text-[#f20000] font-semibold hover:underline bg-transparent border-0 p-0 cursor-pointer disabled:opacity-50">
                        Gửi lại mã OTP
                      </button>
                    }
                  </p>

                  <button onClick={handleVerifyOtp} disabled={fpLoading || fpOtp.join('').length < 6}
                    className="w-full h-[48px] bg-[#f20000] rounded-3xl text-white font-bold text-sm hover:bg-[#d10000] disabled:opacity-60 transition-colors shadow-md shadow-red-200">
                    Xác nhận →
                  </button>
                </div>
              )}

              {/* ── Step 3: New password ── */}
              {fpStep === 'reset' && (
                <div className="w-full max-w-[320px] flex flex-col gap-5 animate-[fadeIn_0.2s_ease]">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3 ring-4 ring-red-50/60">
                      <svg className="w-7 h-7 text-[#f20000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-black text-[#c1121f] m-0">Tạo mật khẩu mới</h2>
                    <p className="text-xs text-gray-500 mt-1">Nhập mật khẩu mới cho tài khoản của bạn.</p>
                  </div>

                  {fpError && <p className="text-xs text-[#f20000] bg-red-50 border border-red-200 rounded-xl px-3 py-2">{fpError}</p>}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-black">Mật khẩu mới</label>
                    <div className="relative">
                      <input type={showNewPw ? 'text' : 'password'} placeholder="Tối thiểu 6 ký tự"
                        value={fpNewPw} onChange={e => setFpNewPw(e.target.value)}
                        className={INPUT + ' pr-10'} />
                      <button type="button" onClick={() => setShowNewPw(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#f20000] transition-colors">
                        {showNewPw ? <EyeOff /> : <EyeOn />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-black">Xác nhận mật khẩu</label>
                    <div className="relative">
                      <input type={showConfirmPw ? 'text' : 'password'} placeholder="Nhập lại mật khẩu mới"
                        value={fpConfirmPw} onChange={e => setFpConfirmPw(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleResetPassword()}
                        className={INPUT + ' pr-10'} />
                      <button type="button" onClick={() => setShowConfirmPw(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#f20000] transition-colors">
                        {showConfirmPw ? <EyeOff /> : <EyeOn />}
                      </button>
                    </div>
                    {/* Match indicator */}
                    {fpConfirmPw && (
                      <p className={`text-xs mt-0.5 ${fpNewPw === fpConfirmPw ? 'text-green-600' : 'text-[#f20000]'}`}>
                        {fpNewPw === fpConfirmPw ? '✓ Mật khẩu khớp' : '✗ Mật khẩu chưa khớp'}
                      </p>
                    )}
                  </div>

                  <button onClick={handleResetPassword} disabled={fpLoading}
                    className="w-full h-[48px] bg-[#f20000] rounded-3xl text-white font-bold text-sm hover:bg-[#d10000] disabled:opacity-60 transition-colors shadow-md shadow-red-200">
                    {fpLoading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
                  </button>
                </div>
              )}

              {/* ── Done ── */}
              {fpStep === 'done' && (
                <div className="w-full max-w-[320px] flex flex-col items-center gap-5 text-center animate-[fadeIn_0.2s_ease]">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center ring-4 ring-green-50/60">
                    <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#c1121f] m-0">Thành công! 🎉</h2>
                    <p className="text-sm text-gray-500 mt-2">Mật khẩu của bạn đã được đặt lại thành công. Hãy đăng nhập với mật khẩu mới.</p>
                  </div>
                  <button onClick={closeForgot}
                    className="w-full h-[48px] bg-[#f20000] rounded-3xl text-white font-bold text-sm hover:bg-[#d10000] transition-colors shadow-md shadow-red-200">
                    Đăng nhập ngay →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ════════════ LOGIN FORM ════════════ */}
          <h1 className="text-[32px] font-black text-[#c1121f] text-left m-0 mb-0 w-[460px] max-w-[92%] max-xl:text-[28px] max-md:text-[24px]">
            Chào mừng trở lại!
          </h1>
          <p className="text-sm font-bold text-[#d46a6a] text-left m-0 mb-0 w-[460px] max-w-[92%]">
            Sẵn sàng cho nhiều niềm vui hơn? Đăng nhập vào tài khoản của bạn.
          </p>

          <div className="w-[460px] max-w-[92%] h-px bg-gradient-to-r from-transparent via-black/20 to-transparent mt-5 mb-10" />

          {error && (
            <div className="w-[430px] max-w-[92%] mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 m-0">{error}</p>
            </div>
          )}

          <form className="w-[430px] max-w-[92%] flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2.5 mb-2">
              <label className="text-base font-bold text-black m-0">Email</label>
              <input
                type="email"
                placeholder="Nhập địa chỉ email của bạn"
                className="w-full h-[40px] px-3.5 rounded-2xl bg-white text-sm text-black placeholder:text-gray-400 outline-none box-border focus:border-[#f20000] shadow-md"
                {...register('email')}
              />
              {errors.email && <span className="text-xs text-[#ff0404] -mt-1">{errors.email.message}</span>}
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-base font-bold text-black m-0">Mật khẩu</label>
              <input
                type="password" placeholder="Nhập mật khẩu của bạn"
                className="w-full h-[40px] px-3.5 rounded-2xl bg-white text-sm text-black placeholder:text-gray-400 outline-none box-border focus:border-[#f20000] shadow-md"
                {...register('password')}
              />
              {errors.password && <span className="text-xs text-[#ff0404] -mt-1">{errors.password.message}</span>}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={openForgot}
                  className="text-xs font-normal text-[#ff0404] bg-transparent border-0 p-0 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  Quên mật khẩu?
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={isLoading}
              className={`w-full h-[52px] bg-[#f20000] rounded-3xl cursor-pointer flex items-center justify-center transition-colors p-0 mt-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#d10000]'}`}
            >
              <span className="text-lg font-bold text-[#fffafa] m-0">
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </span>
            </button>

            <p className="text-sm font-bold text-black text-center m-[15px_0_0_0]">
              Chưa có tài khoản?{' '}
              <Link to={ROUTES.REGISTER} className="text-[#ff0404] no-underline hover:opacity-80 transition-opacity">
                Tạo tài khoản
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
