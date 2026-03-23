// components/charts/OrderGrowthChart.tsx
import ChartWidget from "./ChartWidget";
import { useAdminDashboard } from "@/hooks/useDashboard";
import { Loader2 } from "lucide-react";

const OrderGrowthChart = () => {
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

    // Convert ChartSeriesDto to ChartPointDto[]
    const chartData = data.orderGrowth.labels.map((label, index) => ({
        label,
        value: data.orderGrowth.values[index]
    }));

    return (
        <ChartWidget
            title="Tang truong don hang"
            data={chartData}
            type="line"
            horizontal={false}
            description="So luong don hang moi moi ngay trong 30 ngay gan nhat"
        />
    );
};

export default OrderGrowthChart;