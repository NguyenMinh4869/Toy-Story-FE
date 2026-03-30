import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData, toLoginDto } from '../types/Auth'
import { login } from '../services/authService'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../routes/routePaths'
import { LOGO_TOY_STORY } from '../constants/imageAssets'

import imgImage11 from "@/assets/login/image11.png"
const imgLine38 = "https://www.figma.com/api/mcp/asset/919bffbb-b4c0-4649-a02e-4e37b30e697f"

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      // Convert form data to LoginDto
      const loginDto = toLoginDto(data)

      // Call login API (automatically fetches user details via /me)
      const response = await login(loginDto)

      // Update global auth state
      refreshUser()

      // Navigate based on role
      if (response.role === 'Admin' || response.role === 'Staff') {
        navigate(ROUTES.ADMIN_DASHBOARD)
      } else {
        navigate(ROUTES.HOME)
      }
    } catch (err: any) {
      // Handle backend validation/error messages
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="!font-sans min-h-screen w-full bg-gradient-to-br from-white via-[#ffc703] to-[#ff4200] flex items-center justify-center p-4 sm:p-6 lg:p-8" data-name="LoginPage" data-node-id="51:6">
      <div className="relative w-full max-w-[820px] h-[calc(88vh-50px)] min-h-[550px] bg-white rounded-[28px] shadow-2xl overflow-hidden flex max-xl:flex-col max-xl:h-auto max-xl:min-h-0">
        <div className="absolute top-6 left-8 z-50 max-md:left-4 max-md:top-4">
          <Link to="/" className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity">
            <img src={LOGO_TOY_STORY} alt="TOY STORY" className="h-[60px] w-auto object-contain" />
          </Link>
        </div>

        <div className="relative w-[50%] h-full bg-gradient-to-br from-[#ffa500] to-[#ff8c00] flex items-end justify-center p-10 max-xl:w-full max-xl:h-[280px]" data-name="image 11" data-node-id="51:11">
          <img alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" src={imgImage11} />
        </div>

        <div className="absolute left-[50%] top-0 w-0 h-full flex items-center justify-center z-10 -translate-x-1/2 max-xl:hidden" data-node-id="165:820">
          <img alt="" className="w-screen h-0.5 rotate-90 origin-center" src={imgLine38} />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 bg-white overflow-y-auto max-xl:w-full max-xl:p-6 relative">
          <h1 className=" text-[32px] font-black text-[#c1121f] text-left m-0 mb-0 w-[460px] max-w-[92%] max-xl:text-[28px] max-md:text-[24px]" data-node-id="51:13">Chào mừng trở lại!</h1>
          <p className="text-sm font-bold text-[#d46a6a] text-left m-0 mb-0 w-[460px] max-w-[92%]" data-node-id="51:14">Sẵn sàng cho nhiều niềm vui hơn? Đăng nhập vào tài khoản của bạn.</p>

          <div className="w-[460px] max-w-[92%] h-px bg-gradient-to-r from-transparent via-black/20 to-transparent mt-5 mb-10" />

          {error && (
            <div className="w-[430px] max-w-[92%] mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 m-0">{error}</p>
            </div>
          )}

          <form className="w-[430px] max-w-[92%] flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2.5 mb-2">
              <label className="text-base font-bold text-black m-0" data-node-id="52:2">Email</label>
              <input
                placeholder="Nhập địa chỉ email của bạn"
                className={`w-full h-[40px] px-3.5 rounded-2xl bg-white text-sm text-black placeholder:text-gray-400 outline-none box-border focus:border-[#f20000] shadow-md`}
                data-node-id="51:15"
                {...register('email')}
              />
              {errors.email && (
                <span className="text-xs text-[#ff0404] -mt-1">{errors.email.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <label className=" text-base font-bold text-black m-0" data-node-id="52:3">Mật khẩu</label>
              </div>
              <input
                type="password"
                placeholder="Nhập mật khẩu của bạn"
                className={`w-full h-[40px] px-3.5 rounded-2xl bg-white text-sm text-black placeholder:text-gray-400 outline-none box-border focus:border-[#f20000] shadow-md`}
                data-node-id="52:5"
                {...register('password')}
              />
              {errors.password && (
                <span className=" text-xs text-[#ff0404] -mt-1">{errors.password.message}</span>
              )}
              <div className="flex justify-end">
                <a href="#" className="text-xs font-normal text-[#ff0404] no-underline transition-opacity hover:opacity-80" data-node-id="52:15">Quên mật khẩu?</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full h-[52px] bg-[#f20000] rounded-3xl cursor-pointer flex items-center justify-center transition-colors p-0 mt-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#d10000]'}`}
              data-node-id="52:11"
            >
              <span className="text-lg font-bold text-[#fffafa] m-0" data-node-id="52:13">
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </span>
            </button>

            <p className="text-sm font-bold text-black text-center m-[15px_0_0_0]" data-node-id="52:17">
              Chưa có tài khoản? <Link to={ROUTES.REGISTER} className="text-[#ff0404] no-underline transition-opacity hover:opacity-80">Tạo tài khoản</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
