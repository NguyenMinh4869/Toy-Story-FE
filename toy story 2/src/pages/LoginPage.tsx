import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData, toLoginDto } from '../types/Auth'
import { login } from '../services/authService'
import { ROUTES } from '../routes/routePaths'

const imgImage11 = "https://www.figma.com/api/mcp/asset/85994e85-ec79-4a37-8966-0df73005c709"
const imgLine38 = "https://www.figma.com/api/mcp/asset/919bffbb-b4c0-4649-a02e-4e37b30e697f"

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFieldError
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false
    }
  })

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      // Convert form data to LoginDto (removes rememberMe)
      const loginDto = toLoginDto(data)
      
      // Call login API (automatically fetches user details via /me)
      const response = await login(loginDto)
      
      // Login successful - token, role, and user data are stored automatically
      console.log('Login successful:', response.message)
      if (response.user) {
        console.log('User data loaded:', response.user)
      }
      
      // Navigate based on role
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

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-white flex overflow-hidden z-[9999] max-xl:flex-col" data-name="LoginPage" data-node-id="51:6">
      <div className="relative w-[40%] h-full bg-gradient-to-br from-[#ffa500] to-[#ff8c00] flex items-end justify-center p-10 max-xl:w-full max-xl:h-[40%]" data-name="image 11" data-node-id="51:11">
        <img alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" src={imgImage11} />
      </div>
      
      <div className="absolute left-[40%] top-0 w-0 h-full flex items-center justify-center z-10 -translate-x-1/2 max-xl:hidden" data-node-id="165:820">
        <img alt="" className="w-screen h-0.5 rotate-90 origin-center" src={imgLine38} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-10 pr-[17px] pl-0 bg-white overflow-y-auto max-xl:w-full max-xl:p-5">
        <h1 className="font-tienne text-[42px] font-normal text-black text-center m-0 mb-[15px] w-[654px] max-w-full max-xl:text-[36px] max-md:text-[32px]" data-node-id="51:13">Welcome Back!</h1>
        <p className="font-tienne text-xl font-normal text-black text-center m-0 mb-10 w-[654px] max-w-full max-xl:text-xl max-md:text-lg" data-node-id="51:14">Ready for more fun? Log in to your account.</p>
        
        {error && (
          <div className="w-[620px] max-w-full mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="font-tienne text-base text-red-600 m-0">{error}</p>
          </div>
        )}
        
        <form className="w-[620px] max-w-full flex flex-col gap-5 max-xl:w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2.5">
            <label className="font-tienne text-xl font-normal text-black m-0" data-node-id="52:2">Email</label>
            <input 
              type="email" 
              className={`w-full h-[60px] px-5 border border-[#2b0000] rounded-[15px] bg-white font-tienne text-base text-black outline-none box-border focus:border-[#f20000] focus:shadow-[0_0_0_2px_rgba(242,0,0,0.1)] ${errors.email ? 'border-[#ff0404] focus:border-[#ff0404] focus:shadow-[0_0_0_2px_rgba(255,4,4,0.2)]' : ''}`}
              data-node-id="51:15"
              {...register('email')}
            />
            {errors.email && (
              <span className="font-tienne text-sm text-[#ff0404] -mt-1">{errors.email.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
              <label className="font-tienne text-xl font-normal text-black m-0" data-node-id="52:3">Password</label>
              <a href="#" className="font-tienne text-base font-normal text-[#ff0404] no-underline transition-opacity hover:opacity-80" data-node-id="52:15">forgot password?</a>
            </div>
            <input 
              type="password" 
              className={`w-full h-[60px] px-5 border border-[#2b0000] rounded-[15px] bg-white font-tienne text-base text-black outline-none box-border focus:border-[#f20000] focus:shadow-[0_0_0_2px_rgba(242,0,0,0.1)] ${errors.password ? 'border-[#ff0404] focus:border-[#ff0404] focus:shadow-[0_0_0_2px_rgba(255,4,4,0.2)]' : ''}`}
              data-node-id="52:5"
              {...register('password')}
            />
            {errors.password && (
              <span className="font-tienne text-sm text-[#ff0404] -mt-1">{errors.password.message}</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <input 
              type="checkbox" 
              id="remember-me" 
              className="w-[30px] h-[30px] border border-[#2b0000] rounded-[5px] bg-white cursor-pointer appearance-none relative flex-shrink-0 checked:bg-[#f20000] checked:border-[#f20000] checked:after:content-['✓'] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-white checked:after:text-xl checked:after:font-bold" 
              data-node-id="52:7"
              {...register('rememberMe')}
            />
            <label htmlFor="remember-me" className="font-tienne text-lg font-normal text-black cursor-pointer m-0" data-node-id="52:9">
              Remember me for 30 days
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full h-[60px] bg-[#f20000] border border-[#2b0000] rounded-[15px] cursor-pointer flex items-center justify-center transition-colors p-0 mt-2.5 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#d10000]'}`}
            data-node-id="52:11"
          >
            <span className="font-tienne text-2xl font-normal text-[#fffafa] m-0" data-node-id="52:13">
              {isLoading ? 'Logging in...' : 'Login to Account'}
            </span>
          </button>

          <p className="font-tienne text-lg font-normal text-black text-center m-[15px_0_0_0]" data-node-id="52:17">
            Don't have an account? <a href="#" className="text-[#ff0404] no-underline transition-opacity hover:opacity-80">Create an account</a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
