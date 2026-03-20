// hooks/useCheckout.ts
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../hooks/useAuth";
import {
  calculatePrice,
  checkout,
  createPayment,
} from "../services/checkoutService";
import { CalculatePriceResponse } from "../types/CheckoutDTO";

interface CheckoutFormData {
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  notes: string;
}

export const useCheckout = () => {
  const { cartItems, getTotalPrice } = useCart();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculating] = useState(false);
  const [calculation, setCalculation] = useState<CalculatePriceResponse | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  const [voucherCode, setVoucherCode] = useState("");
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [voucherData, setVoucherData] = useState<{
    name: string;
    totalDiscount: number;
    finalAmount: number;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
    notes: "",
  });

  // Update form if user data loads
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
        phoneNumber: prev.phoneNumber || user.phoneNumber || "",
        address: prev.address || user.address || "",
      }));
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;

    setIsValidatingVoucher(true);
    setVoucherError(null);

    try {
      const result = await calculatePrice({
        items: cartItems.map((item) => {
          if ("productId" in item.product) {
            return {
              productId: item.product.productId,
              quantity: item.quantity,
            }
          } else {
            return {
              setId: item.product.setId,
              quantity: item.quantity,
            }
          }
        }
        ),
        voucherCode: voucherCode.trim(),
      });

      setCalculation(result);
      setVoucherData({
        name: "Voucher áp dụng",
        totalDiscount: result.discount,
        finalAmount: result.total,
      });
      setError(null);
    } catch (err: any) {
      console.error("Voucher calculation error:", err);
      const detailMsg =
        err.response?.data?.data?.message ||
        err.message ||
        "Mã voucher không hợp lệ hoặc giỏ hàng trống";
      setVoucherError(detailMsg);
      setVoucherData(null);
      setCalculation(null);
    } finally {
      setIsValidatingVoucher(false);
    }
  };

  const handleCheckout = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();

    if (cartItems.length === 0) return;

    // Basic validation
    if (!formData.name || !formData.phoneNumber || !formData.address) {
      setError(
        "Vui lòng nhập đầy đủ thông tin giao hàng (Họ tên, SĐT, Địa chỉ).",
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload =
        voucherData && voucherCode.trim()
          ? { voucherCode: voucherCode.trim() }
          : undefined;

      const checkoutResult = await checkout(payload);

      const invoiceId = checkoutResult?.checkout?.invoiceId;
      if (!invoiceId) {
        throw new Error(
          "Không thể tạo hóa đơn thanh toán. Vui lòng liên hệ hỗ trợ.",
        );
      }

      const paymentResult = await createPayment(invoiceId);
      const checkoutUrl = paymentResult?.data?.paymentUrl;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Không nhận được liên kết thanh toán từ PayOS.");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      const detailMsg = err.errors
        ? Object.values(err.errors).flat().join(", ")
        : "";
      setError(
        detailMsg ||
        err.message ||
        "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.",
      );
      setIsSubmitting(false);
    }
  };

  return {
    // State
    cartItems,
    getTotalPrice,
    formData,
    isSubmitting,
    isCalculating,
    calculation,
    error,
    qrCodeData,
    voucherCode,
    voucherError,
    voucherData,
    isValidatingVoucher,

    // Setters
    setVoucherCode,
    setQrCodeData,
    setError,

    // Handlers
    handleInputChange,
    handleApplyVoucher,
    handleCheckout,
  };
};
