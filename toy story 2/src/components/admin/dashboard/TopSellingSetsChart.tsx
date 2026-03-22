// components/charts/TopSellingProductsChart.tsx
import ChartWidget from "./ChartWidget";
import { useAdminDashboard } from "@/hooks/useDashboard";
import { Loader2 } from "lucide-react";

const TopSellingSetsChart = () => {
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
                Unable to load data. Please try again
            </div>
        );
    }

    return (
        <ChartWidget
            title="Top Selling Sets"
            data={data.topSellingSets}
            type="bar"
            horizontal={true}
            description="Top 5 best-selling sets"
        />
    );
};

export default TopSellingSetsChart;