// components/charts/OrderStatusChart.tsx
import ChartWidget from "./ChartWidget";
import { useAdminDashboard } from "@/hooks/useDashboard";
import { Loader2 } from "lucide-react";

const ORDER_STATUS_LABEL_MAP: Record<string, string> = {
    'đang chờ thanh toán': 'Cho thanh toan',
    'đã thanh toán': 'Da thanh toan',
    'đang xử lý': 'Dang xu ly',
    'đang giao hàng': 'Dang giao hang',
    'đã giao hàng': 'Da giao hang',
    'đã nhận hàng': 'Da nhan hang',
    'đã hủy': 'Da huy',
};

const toVietnameseOrderStatus = (label: string) => {
    const normalized = label.trim().toLowerCase();
    return ORDER_STATUS_LABEL_MAP[normalized] ?? label;
};

const OrderStatusChart = () => {
    const { data, isLoading, error } = useAdminDashboard();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex justify-center items-center h-64 text-red-500">
                Khong the tai du lieu. Vui long thu lai
            </div>
        );
    }

    return (
        <ChartWidget
            title="Phan bo trang thai don hang"
            data={data.orderStatusDistribution.map((item) => ({
                ...item,
                label: toVietnameseOrderStatus(item.label),
            }))}
            type="pie"
            horizontal={false}
            description="Ty le don hang theo tung trang thai"
        />
    );
};

export default OrderStatusChart;