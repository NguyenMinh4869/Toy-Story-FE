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
      className="min-h-screen w-full bg-gradient-to-br from-white via-[#fde8e8] to-[#b3131b] flex items-center justify-center p-4 sm:p-6 lg:p-8"
      data-name="RegisterPage"
    >
      <div className="relative w-full max-w-[820px] h-[calc(88vh-50px)] min-h-[630px] bg-white rounded-[28px] shadow-2xl overflow-hidden flex max-xl:flex-col max-xl:h-auto max-xl:min-h-0">
        <div className="absolute top-6 left-8 z-50 max-md:left-4 max-md:top-4">
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
          className="relative w-[50%] h-full bg-gradient-to-br from-[#ffa500] to-[#ff8c00] flex items-end justify-center p-10 max-xl:w-full max-xl:h-[280px]"
          data-name="image 11"
        >
          <img
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            src={imgImage11}
          />
        </div>

        <div className="absolute left-[50%] top-0 w-0 h-full flex items-center justify-center z-10 -translate-x-1/2 max-xl:hidden">
          <img
            alt=""
            className="w-screen h-0.5 rotate-90 origin-center"
            src={imgLine38}
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 bg-white overflow-y-auto max-xl:w-full max-xl:p-6 relative">
        <h1 className="font-tienne text-[32px] font-normal text-[#c1121f] text-left m-0 mb-0 w-[460px] max-w-[92%] max-xl:text-[28px] max-md:text-[24px]">
          Create Account
        </h1>
        <p className="font-tienne text-sm font-normal text-[#d46a6a] text-left m-0 mb-0 w-[460px] max-w-[92%]">
          Join us and start your magical journey!
        </p>

        <div className="w-[460px] max-w-[92%] h-px bg-gradient-to-r from-transparent via-black/20 to-transparent mt-5 mb-10" />

        {error && (
          <div className="w-[430px] max-w-[92%] mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="font-tienne text-sm text-red-600 m-0">{error}</p>
          </div>
        )}

        {success && (
          <div className="w-[430px] max-w-[92%] mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-tienne text-sm text-green-600 m-0">
              {success}
            </p>
          </div>
        )}

        <form
          className="w-[430px] max-w-[92%] flex flex-col gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-1.5">
            <label className="font-tienne text-base font-normal text-black m-0">
              Full Name
            </label>
            <input
              type="text"
              className={`w-full h-[28px] px-3 border border-[#2b0000] rounded-[10px] bg-white font-tienne text-sm text-black outline-none box-border focus:border-[#f20000] focus:shadow-[0_0_0_2px_rgba(242,0,0,0.1)] ${errors.name ? "border-[#ff0404]" : ""}`}
              {...register("name")}
            />
            {errors.name && (
              <span className="font-tienne text-xs text-[#ff0404]">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
            <div className="flex flex-col gap-1.5">
              <label className="font-tienne text-base font-normal text-black m-0">
                Email
              </label>
              <input
                type="email"
                className={`w-full h-[28px] px-3 border border-[#2b0000] rounded-[10px] bg-white font-tienne text-sm text-black outline-none box-border focus:border-[#f20000] focus:shadow-[0_0_0_2px_rgba(242,0,0,0.1)] ${errors.email ? "border-[#ff0404]" : ""}`}
                {...register("email")}
              />
              {errors.email && (
                <span className="font-tienne text-xs text-[#ff0404]">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-tienne text-base font-normal text-black m-0">
                Phone Number
              </label>
              <input
                type="tel"
                className={`w-full h-[28px] px-3 border border-[#2b0000] rounded-[10px] bg-white font-tienne text-sm text-black outline-none box-border focus:border-[#f20000] focus:shadow-[0_0_0_2px_rgba(242,0,0,0.1)] ${errors.phoneNumber ? "border-[#ff0404]" : ""}`}
                {...register("phoneNumber")}
              />
              {errors.phoneNumber && (
                <span className="font-tienne text-xs text-[#ff0404]">
                  {errors.phoneNumber.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
            <div className="flex flex-col gap-1.5">
              <label className="font-tienne text-base font-normal text-black m-0">
                Password
              </label>
              <input
                type="password"
                className={`w-full h-[28px] px-3 border border-[#2b0000] rounded-[10px] bg-white font-tienne text-sm text-black outline-none box-border focus:border-[#f20000] focus:shadow-[0_0_0_2px_rgba(242,0,0,0.1)] ${errors.password ? "border-[#ff0404]" : ""}`}
                {...register("password")}
              />
              {errors.password && (
                <span className="font-tienne text-xs text-[#ff0404]">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-tienne text-base font-normal text-black m-0">
                Confirm Password
              </label>
              <input
                type="password"
                className={`w-full h-[28px] px-3 border border-[#2b0000] rounded-[10px] bg-white font-tienne text-sm text-black outline-none box-border focus:border-[#f20000] focus:shadow-[0_0_0_2px_rgba(242,0,0,0.1)] ${errors.confirmPassword ? "border-[#ff0404]" : ""}`}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <span className="font-tienne text-xs text-[#ff0404]">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-[48px] bg-[#f20000] border border-[#2b0000] rounded-[12px] cursor-pointer flex items-center justify-center transition-colors p-0 mt-1 ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#d10000]"}`}
          >
            <span className="font-tienne text-base font-normal text-[#fffafa] m-0">
              {isLoading ? "Creating account..." : "Create Account"}
            </span>
          </button>

          <p className="font-tienne text-sm font-normal text-black text-center m-[10px_0_0_0]">
            Already have an account?{" "}
            <Link
              to={ROUTES.LOGIN}
              className="text-[#ff0404] no-underline transition-opacity hover:opacity-80"
            >
              Login instead
            </Link>
          </p>
        </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
