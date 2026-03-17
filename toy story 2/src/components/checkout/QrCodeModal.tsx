// components/QrCodeModal.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import Modal from "../ui/Modal";
import { ROUTES } from "@/routes/routePaths";

interface QrCodeModalProps {
  isOpen: boolean;
  qrCodeData: string;
  onClose: () => void;
}

const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  qrCodeData,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleViewOrders = () => {
    onClose();
    navigate(ROUTES.PROFILE_ORDERS);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thanh toán qua mã QR"
      size="md"
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <p className="text-gray-600 text-center font-reddit-sans">
          Vui lòng quét mã QR dưới đây để thanh toán:
        </p>
        <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm flex justify-center">
          <img
            src={
              qrCodeData.startsWith("http") || qrCodeData.startsWith("data:")
                ? qrCodeData
                : `data:image/png;base64,${qrCodeData}`
            }
            alt="QR Code"
            className="w-full h-auto max-w-[280px]"
          />
        </div>
        <div className="text-center">
          <p className="font-bold text-lg text-gray-800">
            Thanh toán hoàn tất?
          </p>
          <p className="text-sm text-gray-500">
            Hệ thống sẽ cập nhật sau vài giây khi thanh toán thành công.
          </p>
        </div>
        <button
          onClick={handleViewOrders}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <CreditCard size={20} /> Xem Đơn hàng của tôi
        </button>
      </div>
    </Modal>
  );
};

export default QrCodeModal;
