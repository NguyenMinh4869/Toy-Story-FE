import ChartWidget from "../admin/dashboard/ChartWidget";
import { useStaffDashboard } from "@/hooks/useDashboard";
import { Loader2 } from "lucide-react";

// Rename to reflect what it actually shows
const WeeklyOrderVolumeChart = () => {
    const { data, isLoading, error } = useStaffDashboard();

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

    // Convert ChartSeriesDto to ChartPointDto[] for the widget
    const chartData = data.weeklyOrderVolume.labels.map((label, index) => ({
        label,
        value: data.weeklyOrderVolume.values[index]
    }));

    return (
        <ChartWidget
            title="Khối lượng đơn hàng theo ngày"
            data={chartData}
            type="bar" // Changed from pie to bar since it's weekly volume
            horizontal={false}
            description="Số lượng đơn hàng trong tuần này"
        />
    );
};

export default WeeklyOrderVolumeChart;