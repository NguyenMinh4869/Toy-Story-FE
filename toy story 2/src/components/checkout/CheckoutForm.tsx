// components/CheckoutForm.tsx
import React from "react";

interface CheckoutFormProps {
  formData: {
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
    notes: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  formData,
  onChange,
  onSubmit,
}) => {
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

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={onSubmit}
      >
        <div className="space-y-2">
          <label className="text-sm font-reddit-sans font-medium text-gray-600 ml-1">
            Họ và tên *
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-4 focus:ring-red-50 outline-none transition-all font-reddit-sans"
            placeholder="Nguyễn Văn A"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-reddit-sans font-medium text-gray-600 ml-1">
            Số điện thoại *
          </label>
          <input
            type="tel"
            name="phoneNumber"
            required
            value={formData.phoneNumber}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-4 focus:ring-red-50 outline-none transition-all font-reddit-sans"
            placeholder="09xx xxx xxx"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-reddit-sans font-medium text-gray-600 ml-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-4 focus:ring-red-50 outline-none transition-all font-reddit-sans"
            placeholder="example@mail.com"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-reddit-sans font-medium text-gray-600 ml-1">
            Địa chỉ nhận hàng *
          </label>
          <input
            type="text"
            name="address"
            required
            value={formData.address}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-4 focus:ring-red-50 outline-none transition-all font-reddit-sans"
            placeholder="Số nhà, tên đường, phường/xã..."
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-reddit-sans font-medium text-gray-600 ml-1">
            Ghi chú (Tùy chọn)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={onChange}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-4 focus:ring-red-50 outline-none transition-all font-reddit-sans resize-none"
            placeholder="Giao vào giờ hành chính, gọi trước khi đến..."
          />
        </div>
      </form>
    </section>
  );
};

export default CheckoutForm;
