import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
} from 'chart.js';
import { useStaffDashboard } from '@/hooks/useDashboard';
import { Loader2, Calendar } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const WeeklyOrderVolumeChart = () => {
    const { data, isLoading, error } = useStaffDashboard();

    const baseCardCls = 'bg-white rounded-[2.5rem] border-2 border-slate-50 h-[200px] flex items-center justify-center';

    if (isLoading) {
        return (
            <div className={baseCardCls}>
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className={baseCardCls + ' text-red-500 text-sm'}>
                Không thể tải dữ liệu. Vui lòng thử lại
            </div>
        );
    }

    const labels = data.weeklyOrderVolume.labels;
    const values = data.weeklyOrderVolume.values;
    const isEmpty = values.every((v) => v === 0);

    const chartData = {
        labels,
        datasets: [{
            data: values,
            backgroundColor: '#8B0000',
            hoverBackgroundColor: '#DC143C',
            borderRadius: 8,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false }, ticks: { font: { size: 10 } } },
            y: {
                grid: { color: '#f1f5f9' },
                ticks: { font: { size: 10 }, stepSize: 1 },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="bg-white rounded-[2.5rem] border-2 border-slate-50 h-[200px] p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-3 shrink-0">
                <div className="w-1.5 h-5 bg-[#8B0000] rounded-full" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">
                    Số lượng đơn hàng theo ngày
                </h2>
            </div>
            <div className="flex-1 relative min-h-0">
                {isEmpty ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-slate-400">
                        <Calendar className="w-7 h-7" />
                        <span className="text-xs text-center leading-snug">
                            Chưa có đơn hàng trong tuần này
                        </span>
                    </div>
                ) : (
                    <Bar data={chartData} options={options as any} />
                )}
            </div>
        </div>
    );
};

export default WeeklyOrderVolumeChart;