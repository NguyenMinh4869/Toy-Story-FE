// components/CheckoutForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routePaths";
import { getCurrentUser } from "@/services/authService";
import { ViewUserDto } from "@/types/AccountDTO";

interface CheckoutFormProps {
  formData?: {
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
    notes: string;
  };
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ formData: propFormData }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<ViewUserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const user = await getCurrentUser();
        setUserData(user);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Không thể tải thông tin người dùng");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Check if propFormData has actual values (not just an empty object)
  const hasValidPropData = propFormData && (
    propFormData.name ||
    propFormData.phoneNumber ||
    propFormData.email ||
    propFormData.address
  );

  // Use propFormData ONLY if it has values, otherwise use userData
  const displayData = hasValidPropData ? propFormData : {
    name: userData?.name || "",
    phoneNumber: userData?.phoneNumber || "",
    email: userData?.email || "",
    address: userData?.address || "",
    notes: "",
  };

  if (isLoading) {
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
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-red-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <span className="text-red-600 font-bold">1</span>
          </div>
          <h2 className="text-xl font-tilt-warp text-gray-800">
            Thông tin giao hàng
          </h2>
        </div>
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Thử lại
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-3xl p-6 shadow-lg border border-red-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
          <span className="text-red-600 font-bold">1</span>
        </div>
        <h2 className="text-xl font-tilt-warp text-gray-800">
          Thông tin giao hàng
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-2 mt-2">
        <div>
          <label className="text-sm font-medium text-gray-600 ml-1">
            Họ và tên
          </label>
          <input
            type="text"
            value={displayData.name || ""}
            readOnly
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-reddit-sans"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 ml-1">
            Số điện thoại
          </label>
          <input
            type="tel"
            value={displayData.phoneNumber || ""}
            readOnly
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-reddit-sans"
          />
        </div>

      </div>
      <div className="mb-2 mt-2">
        <label className="text-sm font-medium text-gray-600 ml-1">
          Địa chỉ nhận hàng
        </label>
        <input
          type="text"
          value={displayData.address || ""}
          readOnly
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-reddit-sans"
        />
      </div>
      <div className="">
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