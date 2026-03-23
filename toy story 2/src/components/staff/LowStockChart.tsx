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
                Khong the tai du lieu. Vui long thu lai
            </div>
        );
    }

    return (
        <ChartWidget
            title="Canh bao ton kho thap"
            data={data.lowStockAlerts}
            type="pie"
            horizontal={false}
            description="Ty le san pham sap het hang"
        />
    );
};

export default LowStockChart;