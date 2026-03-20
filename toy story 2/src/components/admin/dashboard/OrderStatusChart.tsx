// components/charts/OrderStatusChart.tsx
import ChartWidget from "./ChartWidget";
import { useAdminDashboard } from "@/hooks/useDashboard";
import { Loader2 } from "lucide-react";

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
                Không thể tải dữ liệu. Xin thử lại
            </div>
        );
    }

    return (
        <ChartWidget
            title="Phân bố trạng thái đơn hàng"
            data={data.orderStatusDistribution}
            type="pie"
            horizontal={false}
            description="Tỷ lệ đơn hàng theo trạng thái"
        />
    );
};

export default OrderStatusChart;