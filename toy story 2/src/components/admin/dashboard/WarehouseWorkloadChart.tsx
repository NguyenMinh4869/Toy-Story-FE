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
                Không thể tải dữ liệu. Xin thử lại
            </div>
        );
    }

    return (
        <ChartWidget
            title="Khối lượng công việc theo kho"
            data={data.warehouseWorkload}
            type="bar"
            horizontal={true}
            description="Số đơn hàng đang xử lý theo từng kho"
        />
    );
};

export default WarehouseWorkloadChart;