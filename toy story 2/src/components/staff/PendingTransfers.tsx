// components/transfers/PendingTransfers.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPendingTransfers } from "@/services/transferService";
import { Loader2, ArrowRightLeft } from "lucide-react";
import { ViewTransSummaryDto } from "@/types/TransferDTO";
import TransferStatusBadge from "../badge/TransferStatusBadge";
import TypeStatusBadge from "../badge/TypeStatusBadge";

const PendingTransfers = () => {
    const [data, setData] = useState<ViewTransSummaryDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransfers = async () => {
            try {
                setIsLoading(true);
                const transfers = await getPendingTransfers();
                setData(transfers || []);
                setError(null);
            } catch (err) {
                setError("Không thể tải dữ liệu");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransfers();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <Card className="rounded-3xl bg-slate-50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5" />
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">
                        Đơn chuyển kho chờ xử lý
                    </h2>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.map((transfer) => (
                        <div
                            key={transfer.transferId}
                            className="flex items-center justify-between p-4 shadow-lg border rounded-3xl hover:bg-gray-50 transition-colors"
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">#{transfer.transferId}</span>
                                    <TransferStatusBadge status={transfer.status} />

                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>
                                        Từ: {transfer.sourceWarehouseName || "N/A"} → Đến: {transfer.destinationWarehouseName || "N/A"}
                                    </p>
                                    <p>
                                        Ngày tạo: {transfer.createdAt ? new Date(transfer.createdAt).toLocaleDateString('vi-VN') : '-'}

                                    </p>
                                    {transfer.acceptedAt && (
                                        <p>
                                            Ngày chấp nhận:  {transfer.acceptedAt ? new Date(transfer.acceptedAt).toLocaleDateString('vi-VN') : '-'}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <TypeStatusBadge type={transfer.type} />
                            </div>
                        </div>
                    ))}
                    {data.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                            Không có đơn chuyển kho chờ xử lý
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default PendingTransfers;