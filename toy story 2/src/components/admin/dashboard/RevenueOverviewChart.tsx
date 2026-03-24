// components/charts/RevenueOverviewChart.tsx
import ChartWidget from "./ChartWidget";
import { useAdminDashboard } from "@/hooks/useDashboard";
import { Loader2 } from "lucide-react";

const RevenueOverviewChart = () => {
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
                Không thể tải dữ liệu. Vui lòng thử lại
            </div>
        );
    }

    // Convert ChartSeriesDto to format expected by ChartWidget
    const chartData = data.revenueOverview.labels.map((label, index) => ({
        label,
        value: data.revenueOverview.values[index]
    }));

    return (
        <ChartWidget
            title="Tổng quan doanh thu"
            data={chartData}
            type="line"
            horizontal={false}
            description="Doanh thu theo ngày trong 30 ngày gần nhất"
        />
    );
};

export default RevenueOverviewChart;