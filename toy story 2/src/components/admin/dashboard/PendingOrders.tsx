// components/orders/PendingOrders.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPending } from "@/services/orderService";
import { Loader2, Truck } from "lucide-react";
import { ViewOrderDto } from "@/types/OrderDTO";

const PendingOrders = () => {
    const [data, setData] = useState<ViewOrderDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const orders = await getPending();
                setData(orders);
                setError(null);
            } catch (err) {
                setError("Không thể tải dữ liệu");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

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
        <Card className="rounded-3xl bg-slate-50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">
                        Đơn hàng chờ xử lý
                    </h2>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.map((order) => (
                        <div
                            key={order.orderId}
                            className="flex items-center justify-between p-4 shadow-lg border rounded-3xl hover:bg-gray-50 transition-colors"
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">#{order.orderId}</span>

                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>Khách hàng: {order.accountName}</p>
                                    <p>Ngày đặt: {order.orderDate}</p>
                                    {order.warehouseName && (
                                        <p>Kho: {order.warehouseName}</p>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-primary">
                                    {(order.finalAmount ?? order.totalAmount ?? 0).toLocaleString('vi-VN')}₫
                                </p>
                            </div>
                        </div>
                    ))}
                    {data.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                            Không có đơn hàng chờ xử lý
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default PendingOrders;