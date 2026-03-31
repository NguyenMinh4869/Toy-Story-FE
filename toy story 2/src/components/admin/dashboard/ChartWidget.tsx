import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler
} from "chart.js";

import { ChartPointDto } from "@/types/DashboardDTO";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler
);

interface ChartWidgetProps {
    title: string;
    data: ChartPointDto[];
    type: "line" | "bar" | "pie" | "doughnut";
    horizontal?: boolean;
    description?: string;
}

const ChartWidget = ({ title, data, type, horizontal = false, description }: ChartWidgetProps) => {
    // Premium Editorial Palette
    const colors = [
        "#950101", // Nailify Red
        "#0F172A", // Slate 900
        "#64748B", // Slate 500
        "#F43F5E", // Rose 500
        "#FB7185", // Rose 400
        "#E2E8F0", // Slate 200
    ];

    const chartData = {
        labels: data.map((d) => d.label.toUpperCase()),
        datasets: [
            {
                label: title,
                data: data.map((d) => d.value),
                backgroundColor: type === "line" ? "rgba(149, 1, 1, 0.1)" : colors,
                borderColor: type === "line" ? "#950101" : "transparent",
                borderWidth: type === "line" ? 3 : 0,
                fill: type === "line",
                tension: 0.4, // Smooth editorial curves
                pointRadius: 4,
                pointBackgroundColor: "#950101",
                hoverOffset: 20,
                borderRadius: type === "bar" ? 12 : 0, // Rounded bars
            },
        ],
    };

    const options = {
        indexAxis: horizontal ? ("y" as const) : ("x" as const),
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: type === "pie" || type === "doughnut",
                position: "bottom" as const,
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        family: "Inter",
                        size: 10,
                        weight: "bold" as const,
                    },
                },
            },
            tooltip: {
                backgroundColor: "#0F172A",
                padding: 12,
                titleFont: { size: 12, weight: "bold" as const },
                bodyFont: { size: 12 },
                cornerRadius: 12,
                displayColors: false,
            },
        },
        scales: type === "line" || type === "bar" ? {
            x: {
                grid: { display: false },
                ticks: {
                    font: { size: 10, weight: "bold" as const },
                    color: "#94A3B8",
                },
            },
            y: {
                border: { display: false },
                grid: { color: "#F1F5F9" },
                ticks: {
                    font: { size: 10, weight: "bold" as const },
                    // Avoid generating tens of thousands of ticks on large ranges
                    autoSkip: true,
                    maxTicksLimit: 8,
                    color: "#94A3B8",
                },
            },
        } : {},
    };

    const ChartComponent =
        type === "line" ? Line : type === "bar" ? Bar : type === "pie" ? Pie : Doughnut;

    return (
        <div className="group relative bg-white rounded-[2.5rem] p-8 border-2 border-slate-50 transition-all duration-500 hover:border-[#950101]/20 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-[#950101] rounded-full" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">
                    {title}
                </h2>
            </div>

            <div className="flex-1 min-h-[300px]">
                <ChartComponent data={chartData} options={options as any} />
            </div>
            {description && (
                <p className="mt-4 text-[12px] text-center font-medium text-slate-500 italic leading-relaxed border-l-2 border-slate-100 pl-4">
                    {description}
                </p>
            )}
        </div>
    );
};

export default ChartWidget;