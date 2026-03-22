import ChartWidget from "../admin/dashboard/ChartWidget";
import { useStaffDashboard } from "@/hooks/useDashboard";
import { Loader2 } from "lucide-react";

const LowStockChart = () => {
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
                Unable to load data. Please try again
            </div>
        );
    }

    return (
        <ChartWidget
            title="Low Stock Alerts"
            data={data.lowStockAlerts}
            type="pie"
            horizontal={false}
            description="Share of low-stock products"
        />
    );
};

export default LowStockChart;