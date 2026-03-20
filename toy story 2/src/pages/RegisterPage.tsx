import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  RegisterFormData,
  toCreateUserDto,
} from "../types/Auth";
import { register as registerUser } from "../services/authService";
import { ROUTES } from "../routes/routePaths";
import { LOGO_TOY_STORY } from "../constants/imageAssets";

import imgImage11 from "@/assets/login/image11.png";
const imgLine38 =
  "https://www.figma.com/api/mcp/asset/919bffbb-b4c0-4649-a02e-4e37b30e697f";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFieldError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      // Convert form data to CreateUserDto
      const createUserDto = toCreateUserDto(data);

      // Call register API
      const response = await registerUser(createUserDto);

      console.log("Registration successful:", response.message);
      setSuccess(
        "Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...",
      );

      // Refresh auth state if the backend returns login data (optional but good practice)
      // refreshUser()

      // Navigate to login after a short delay
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (err: any) {
      console.error("Registration error:", err);

      if (err.errors && typeof err.errors === "object") {
        Object.entries(err.errors).forEach(([field, messages]) => {
          const fieldName = field as keyof RegisterFormData;
          setFieldError(fieldName, {
            type: "server",
            message: Array.isArray(messages) ? messages[0] : String(messages),
          });
        });
        if (err.message) {
          setError(err.message);
        }
      } else {
        setError(err.message || "Đăng ký thất bại. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-screen bg-white flex overflow-hidden z-[9999] max-xl:flex-col"
      data-name="RegisterPage"
    >
      <div className="fixed top-6 left-8 z-50">
        <Link
          to="/"
          className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity"
        >
          <img
            src={LOGO_TOY_STORY}
            alt="TOY STORY"
            className="h-[60px] w-auto object-contain"
          />
        </Link>
      </div>

      <div
        className="relative w-[40%] h-full bg-gradient-to-br from-[#ffa500] to-[#ff8c00] flex items-end justify-center p-10 max-xl:w-full max-xl:h-[30%]"
        data-name="image 11"
      >
        <img
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          src={imgImage11}
        />
      </div>

      <div className="absolute left-[40%] top-0 w-0 h-full flex items-center justify-center z-10 -translate-x-1/2 max-xl:hidden">
        <img
          alt=""
          className="w-screen h-0.5 rotate-90 origin-center"
          src={imgLine38}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-10 pr-[17px] pl-0 bg-white overflow-y-auto max-xl:w-full max-xl:p-5 relative">
        <h1 className="font-sans text-3xl font-bold text-black text-center m-0 mb-[10px] w-full max-w-[450px]">
          Create Account
        </h1>
        <p className="font-sans text-sm font-normal text-gray-600 text-center m-0 mb-6 w-full max-w-[450px]">
          Join us and start your magical journey!
        </p>

        {error && (
          <div className="w-full max-w-[450px] mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="font-sans text-sm text-red-600 m-0">{error}</p>
          </div>
        )}

        {success && (
          <div className="w-full max-w-[450px] mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-sans text-sm text-green-600 m-0">
              {success}
            </p>
          </div>
        )}

        <form
          className="w-full max-w-[450px] flex flex-col gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-gray-700 m-0">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your full name"
              className={`w-full h-[45px] px-4 border border-gray-300 rounded-[10px] bg-white font-sans text-sm text-black outline-none box-border focus:border-[#f20000] focus:shadow-[0_0_0_2px_rgba(242,0,0,0.1)] ${errors.name ? "border-[#ff0404]" : ""}`}
              {...register("name")}
            />
            {errors.name && (
              <span className="font-sans text-xs text-[#ff0404]">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-gray-700 m-0">
                Email
              </label>
              <input
                type="email"
                placeholder="example@mail.com"
                className={`w-full h-[45px] px-4 border border-gray-300 rounded-[10px] bg-white font-sans text-sm text-black outline-none box-border focus:border-[#f20000] focus:shadow-[0_0_0_2px_rgba(242,0,0,0.1)] ${errors.email ? "border-[#ff0404]" : ""}`}
                {...register("email")}
              />
              {errors.email && (
                <span className="font-sans text-xs text-[#ff0404]">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-gray-700 m-0">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="09xx xxx xxx"
                className={`w-full h-[45px] px-4 border border-gray-300 rounded-[10px] bg-white font-sans text-sm text-black outline-none box-border focus:border-[#f20000] focus:shadow-[0_0_0_2px_rgba(242,0,0,0.1)] ${errors.phoneNumber ? "border-[#ff0404]" : ""}`}
                {...register("phoneNumber")}
              />
              {errors.phoneNumber && (
                <span className="font-sans text-xs text-[#ff0404]">
                  {errors.phoneNumber.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-gray-700 m-0">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full h-[45px] px-4 border border-gray-300 rounded-[10px] bg-white font-sans text-sm text-black outline-none box-border focus:border-[#f20000] focus:shadow-[0_0_0_2px_rgba(242,0,0,0.1)] ${errors.password ? "border-[#ff0404]" : ""}`}
                {...register("password")}
              />
              {errors.password && (
                <span className="font-sans text-xs text-[#ff0404]">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-gray-700 m-0">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full h-[45px] px-4 border border-gray-300 rounded-[10px] bg-white font-sans text-sm text-black outline-none box-border focus:border-[#f20000] focus:shadow-[0_0_0_2px_rgba(242,0,0,0.1)] ${errors.confirmPassword ? "border-[#ff0404]" : ""}`}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <span className="font-sans text-xs text-[#ff0404]">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 my-1">
            <input
              type="checkbox"
              id="agree-terms"
              className={`w-5 h-5 border border-gray-300 rounded-[4px] bg-white cursor-pointer appearance-none relative flex-shrink-0 checked:bg-[#f20000] checked:border-[#f20000] checked:after:content-['✓'] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-white checked:after:text-xs checked:after:font-bold ${errors.agreeToTerms ? "border-[#ff0404]" : ""}`}
              {...register("agreeToTerms")}
            />
            <label
              htmlFor="agree-terms"
              className="font-sans text-xs font-normal text-gray-600 cursor-pointer m-0"
            >
              I agree to the{" "}
              <a href="#" className="text-[#ff0404] underline hover:opacity-80">
                Terms and Conditions
              </a>
            </label>
            {errors.agreeToTerms && (
              <span className="font-sans text-[10px] text-[#ff0404] block">
                {errors.agreeToTerms.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-[45px] bg-[#f20000] text-white rounded-[10px] font-bold cursor-pointer flex items-center justify-center transition-colors p-0 mt-1 ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#d10000]"}`}
          >
            <span className="font-sans text-base m-0">
              {isLoading ? "Creating account..." : "Create Account"}
            </span>
          </button>

          <p className="font-sans text-sm font-normal text-gray-600 text-center m-2">
            Already have an account?{" "}
            <Link
              to={ROUTES.LOGIN}
              className="text-[#ff0404] font-semibold no-underline transition-opacity hover:opacity-80"
            >
              Login instead
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
