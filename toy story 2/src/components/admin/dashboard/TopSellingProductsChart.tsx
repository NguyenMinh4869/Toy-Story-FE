// components/charts/TopSellingProductsChart.tsx
import ChartWidget from "./ChartWidget";
import { useAdminDashboard } from "@/hooks/useDashboard";
import { Loader2 } from "lucide-react";

const TopSellingProductsChart = () => {
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
            title="Sản phẩm bán chạy"
            data={data.topSellingProducts}
            type="bar"
            horizontal={true}
            description="Top 5 sản phẩm bán chạy nhất"
        />
    );
};

export default TopSellingProductsChart;