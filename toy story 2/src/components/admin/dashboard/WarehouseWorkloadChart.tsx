// components/charts/TopSellingProductsChart.tsx
import ChartWidget from "./ChartWidget";
import { useAdminDashboard } from "@/hooks/useDashboard";
import { Loader2 } from "lucide-react";

const WarehouseWorkloadChart = () => {
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
            title="Khoi luong cong viec kho"
            data={data.warehouseWorkload}
            type="bar"
            horizontal={true}
            description="So don hang dang xu ly theo tung kho"
        />
    );
};

export default WarehouseWorkloadChart;