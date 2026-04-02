// components/dashboard/CombinedGrowthChart.tsx
import { Line } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminDashboard } from "@/hooks/useDashboard";
import { Loader2, TrendingUp } from "lucide-react";
import type { ChartOptions } from "chart.js";

const CombinedGrowthChart = () => {
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
            <div className="flex justify-center items-center h-64 text-red-500 text-sm">
                Không thể tải dữ liệu. Vui lòng thử lại
            </div>
        );
    }

    const labels = data.revenueOverview.labels;

    const chartData = {
        labels: labels.map((l) => l.toUpperCase()),
        datasets: [
            {
                label: 'Doanh thu (₫)',
                data: data.revenueOverview.values,
                yAxisID: 'yRevenue',
                borderColor: '#950101',
                backgroundColor: 'rgba(149, 1, 1, 0.08)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#950101',
                borderWidth: 2,
            },
            {
                label: 'Đơn hàng',
                data: data.orderGrowth.values,
                yAxisID: 'yOrders',
                borderColor: '#0F172A',
                backgroundColor: 'rgba(15, 23, 42, 0.05)',
                fill: false,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#0F172A',
                borderWidth: 2,
                borderDash: [5, 3],
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
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
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        if (ctx.datasetIndex === 0) {
                            return ` Doanh thu: ${Number(ctx.raw).toLocaleString('vi-VN')}₫`;
                        }
                        return ` Đơn hàng: ${ctx.raw}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 9 }, maxRotation: 0 },
            },
            yRevenue: {
                type: 'linear',
                position: 'left',
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: {
                    font: { size: 9 },
                    callback: (v) => `${(Number(v) / 1_000_000).toFixed(1)}M`,
                },
            },
            yOrders: {
                type: 'linear',
                position: 'right',
                grid: { display: false },
                ticks: { font: { size: 9 } },
            },
        },
    };

    return (
        <Card className="rounded-3xl bg-slate-50">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">
                        Tăng trưởng doanh thu & đơn hàng
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div style={{ minHeight: '240px' }}>
                    <Line data={chartData} options={options} />
                </div>
            </CardContent>
        </Card>
    );
};

export default CombinedGrowthChart;
