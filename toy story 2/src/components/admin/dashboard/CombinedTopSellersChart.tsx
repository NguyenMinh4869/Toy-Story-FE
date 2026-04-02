// components/dashboard/CombinedTopSellersChart.tsx
import { Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminDashboard } from "@/hooks/useDashboard";
import { Loader2, BarChart2 } from "lucide-react";
import type { ChartOptions } from "chart.js";

const CombinedTopSellersChart = () => {
    const { data, isLoading, error } = useAdminDashboard();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex justify-center items-center h-48 text-red-500 text-sm">
                Không thể tải dữ liệu. Vui lòng thử lại
            </div>
        );
    }

    const productData = data.topSellingProducts.slice(0, 5);
    const setData = data.topSellingSets.slice(0, 5);

    // Build unified label list; products first, then sets not already in products
    const allLabels = Array.from(
        new Set([...productData.map((d) => d.label), ...setData.map((d) => d.label)])
    );

    const truncate = (s: string) => (s.length > 20 ? s.slice(0, 20) + '…' : s);

    const productMap = new Map(productData.map((d) => [d.label, d.value]));
    const setMap = new Map(setData.map((d) => [d.label, d.value]));

    const chartData = {
        labels: allLabels.map(truncate),
        datasets: [
            {
                label: 'Sản phẩm',
                data: allLabels.map((l) => productMap.get(l) ?? 0),
                backgroundColor: '#950101',
                borderRadius: 6,
                barThickness: 10,
            },
            {
                label: 'Bộ sưu tập',
                data: allLabels.map((l) => setMap.get(l) ?? 0),
                backgroundColor: '#0F172A',
                borderRadius: 6,
                barThickness: 10,
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 12,
                    font: { size: 10, family: 'Inter' },
                },
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(0,0,0,0.04)' },
                ticks: { font: { size: 9 } },
            },
            y: {
                grid: { display: false },
                ticks: { font: { size: 9 } },
            },
        },
    };

    return (
        <Card className="rounded-3xl bg-slate-50">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                    <BarChart2 className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">
                        Top bán chạy
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div style={{ minHeight: '200px' }}>
                    <Bar data={chartData} options={options} />
                </div>
            </CardContent>
        </Card>
    );
};

export default CombinedTopSellersChart;
