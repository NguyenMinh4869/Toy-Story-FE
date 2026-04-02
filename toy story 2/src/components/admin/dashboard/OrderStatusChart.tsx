// components/charts/OrderStatusChart.tsx
import ChartWidget from "./ChartWidget";
import { useAdminDashboard } from "@/hooks/useDashboard";
import { Loader2 } from "lucide-react";

const ORDER_STATUS_LABEL_MAP: Record<string, string> = {
    'đang chờ thanh toán': 'Chờ thanh toán',
    'đã thanh toán': 'Đã thanh toán',
    'đang xử lý': 'Đang xử lý',
    'đang giao hàng': 'Đang giao hàng',
    'đã giao hàng': 'Đã giao hàng',
    'đã nhận hàng': 'Đã nhận hàng',
    'đã hủy': 'Đã hủy',
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
            title="Phân bố trạng thái đơn hàng"
            data={data.orderStatusDistribution.map((item) => ({
                ...item,
                label: toVietnameseOrderStatus(item.label),
            }))}
            type="pie"
            horizontal={false}
            description="Tỷ lệ đơn hàng theo trạng thái"
        />
    );
};

export default OrderStatusChart;