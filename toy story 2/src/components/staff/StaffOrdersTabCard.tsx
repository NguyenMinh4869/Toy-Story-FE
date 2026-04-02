// components/staff/StaffOrdersTabCard.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPending, getDelivery } from "@/services/orderService";
import { Loader2, ClipboardList } from "lucide-react";
import { ViewOrderDto } from "@/types/OrderDTO";

const fmtDate = (iso?: string | null) => {
    if (!iso) return 'N/A';
    return new Date(iso).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const StaffOrdersTabCard = () => {
    const [activeTab, setActiveTab] = useState<'pending' | 'delivery'>('pending');
    const [pendingOrders, setPendingOrders] = useState<ViewOrderDto[]>([]);
    const [deliveryOrders, setDeliveryOrders] = useState<ViewOrderDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const [pending, delivery] = await Promise.all([getPending(), getDelivery()]);
                setPendingOrders(pending);
                setDeliveryOrders(delivery);
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

    const orders = activeTab === 'pending' ? pendingOrders : deliveryOrders;

    return (
        <Card className="rounded-3xl bg-slate-50 h-[200px] overflow-hidden flex flex-col" id="zone4-orders">
            <CardHeader className="pb-2 shrink-0">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ClipboardList className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">
                            Đơn hàng
                        </span>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                                activeTab === 'pending'
                                    ? 'bg-[#8B0000] text-white'
                                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                        >
                            Chờ xử lý
                            {pendingOrders.length > 0 && (
                                <span className="ml-1 opacity-80">({pendingOrders.length})</span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('delivery')}
                            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                                activeTab === 'delivery'
                                    ? 'bg-[#0F172A] text-white'
                                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                        >
                            Đang giao
                            {deliveryOrders.length > 0 && (
                                <span className="ml-1 opacity-80">({deliveryOrders.length})</span>
                            )}
                        </button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex-1 overflow-hidden flex flex-col min-h-0">
                {isLoading ? (
                    <div className="flex justify-center items-center flex-1">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center flex-1 text-red-500 text-sm">{error}</div>
                ) : orders.length === 0 ? (
                    <div className="flex justify-center items-center flex-1 text-gray-500 text-sm">
                        Không có đơn hàng {activeTab === 'pending' ? 'chờ xử lý' : 'đang giao'}
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto min-h-0">
                        <table className="w-full text-xs">
                            <thead className="sticky top-0 bg-slate-50">
                                <tr className="border-b text-slate-500 text-left">
                                    <th className="pb-2 font-semibold">Đơn</th>
                                    <th className="pb-2 font-semibold">Khách hàng</th>
                                    <th className="pb-2 font-semibold">Ngày đặt</th>
                                    <th className="pb-2 font-semibold">Kho</th>
                                    <th className="pb-2 font-semibold text-right">Tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr
                                        key={order.orderId}
                                        className="border-b border-slate-100 hover:bg-slate-100 transition-colors"
                                    >
                                        <td className="py-1.5 font-medium">#{order.orderId}</td>
                                        <td className="py-1.5 text-slate-600 max-w-[80px] truncate">
                                            {order.accountName}
                                        </td>
                                        <td className="py-1.5 text-slate-600 whitespace-nowrap">
                                            {fmtDate(order.orderDate)}
                                        </td>
                                        <td className="py-1.5 text-slate-600 max-w-[80px] truncate">
                                            {order.warehouseName ?? '—'}
                                        </td>
                                        <td className="py-1.5 font-semibold text-[#8B0000] text-right whitespace-nowrap">
                                            {Number(order?.finalAmount ?? 0).toLocaleString('vi-VN')}₫
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default StaffOrdersTabCard;
