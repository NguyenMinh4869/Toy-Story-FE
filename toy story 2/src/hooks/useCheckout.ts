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
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculation, setCalculation] = useState<CalculatePriceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchPrice = async () => {
      if (cartItems.length === 0) {
        setCalculation(null);
        return;
      }

      setIsCalculating(true);
      setError(null);

      try {
        // Don't send items - backend gets cart from account
        const result = await calculatePrice();
        setCalculation(result);
        console.log("Price calculation:", result);
      } catch (err: any) {
        console.error("Failed to calculate price:", err);
        setError(err.message || "Không thể tính toán giá trị đơn hàng");
      } finally {
        setIsCalculating(false);
      }
    };

    fetchPrice();
  }, [cartItems]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // hooks/useCheckout.ts - Remove items from checkout
  const handleCheckout = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();

    if (cartItems.length === 0) {
      setError("Giỏ hàng trống");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Don't send items - backend gets cart from account
      const checkoutResult = await checkout({});

      const invoiceId = checkoutResult?.checkout?.invoiceId;
      if (!invoiceId) {
        throw new Error("Không thể tạo hóa đơn thanh toán. Vui lòng liên hệ hỗ trợ.");
      }

      const paymentResult = await createPayment(invoiceId);
      const checkoutUrl = paymentResult?.data?.paymentUrl || paymentResult?.paymentUrl;

      if (checkoutUrl) {
        setTimeout(() => {
          window.location.href = checkoutUrl;
        }, 1000);
      } else {
        throw new Error("Không nhận được liên kết thanh toán từ PayOS.");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      const detailMsg = err.errors ? Object.values(err.errors).flat().join(", ") : "";
      setError(detailMsg || err.message || "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.");
    } finally {
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

    // Setters
    setQrCodeData,
    setError,

    // Handlers
    handleInputChange,
    handleCheckout,
  };
};