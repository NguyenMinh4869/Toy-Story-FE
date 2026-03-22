// components/charts/OrderStatusChart.tsx
import ChartWidget from "./ChartWidget";
import { useAdminDashboard } from "@/hooks/useDashboard";
import { Loader2 } from "lucide-react";

const ORDER_STATUS_LABEL_MAP: Record<string, string> = {
    'đang chờ thanh toán': 'Pending Payment',
    'đã thanh toán': 'Paid',
    'đang xử lý': 'Processing',
    'đang giao hàng': 'Shipping',
    'đã giao hàng': 'Delivered',
    'đã nhận hàng': 'Completed',
    'đã hủy': 'Cancelled',
};

const toEnglishOrderStatus = (label: string) => {
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
                Unable to load data. Please try again
            </div>
        );
    }

    return (
        <ChartWidget
            title="Order Status Distribution"
            data={data.orderStatusDistribution.map((item) => ({
                ...item,
                label: toEnglishOrderStatus(item.label),
            }))}
            type="pie"
            horizontal={false}
            description="Share of orders by status"
        />
    );
};

export default OrderStatusChart;