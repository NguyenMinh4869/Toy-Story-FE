import ChartWidget from "../admin/dashboard/ChartWidget";
import { useStaffDashboard } from "@/hooks/useDashboard";
import { Loader2 } from "lucide-react";

const ORDER_STATUS_LABEL_MAP: Record<string, string> = {
    'đang chờ thanh toán': 'Cho thanh toan',
    'đã thanh toán': 'Da thanh toan',
    'đang xử lý': 'Dang xu ly',
    'đang giao hàng': 'Dang giao hang',
    'đã giao hàng': 'Da giao hang',
    'đã nhận hàng': 'Da nhan hang',
    'đã hủy': 'Da huy',
};

const toVietnameseOrderStatus = (label: string) => {
    const normalized = label.trim().toLowerCase();
    return ORDER_STATUS_LABEL_MAP[normalized] ?? label;
};

const TodayOrderChart = () => {
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
            title="Phân bố trạng thái đơn hàng"
            data={data.todayOrderStatus.map((item) => ({
                ...item,
                label: toVietnameseOrderStatus(item.label),
            }))}
            type="pie"
            horizontal={false}
            description="Tỷ lệ đơn hàng theo từng trạng thái"
        />
    );
};

export default TodayOrderChart;