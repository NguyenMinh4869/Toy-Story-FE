// components/CheckoutForm.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routePaths";

interface CheckoutFormProps {
  formData: {
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
    notes: string;
  };
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ formData }) => {
  const navigate = useNavigate();

  return (
    <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-red-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
          <span className="text-red-600 font-bold">1</span>
        </div>
        <h2 className="text-xl font-tilt-warp text-gray-800">
          Thông tin giao hàng
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600 ml-1">
            Họ và tên
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            readOnly
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-reddit-sans"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600 ml-1">
            Số điện thoại
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            readOnly
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-reddit-sans"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-gray-600 ml-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-reddit-sans"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-gray-600 ml-1">
            Địa chỉ nhận hàng
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            readOnly
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-reddit-sans"
          />
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-600 mb-3">
          Nếu bạn muốn thay đổi địa chỉ giao hàng, vui lòng chỉnh sửa trong trang hồ sơ.
        </p>
        <button
          type="button"
          onClick={() => navigate(ROUTES.PROFILE)}
          className="w-full md:w-auto px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all"
        >
          Đi tới Hồ sơ
        </button>
      </div>
    </section>
  );
};

export default CheckoutForm;
