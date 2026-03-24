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
                Không thể tải dữ liệu. Vui lòng thử lại
            </div>
        );
    }

    return (
        <ChartWidget
            title="Cảnh báo hàng tồn kho thấp"
            data={data.lowStockAlerts}
            type="pie"
            horizontal={false}
            description="Tỷ lệ sản phẩm sắp hết hàng"
        />
    );
};

export default LowStockChart;