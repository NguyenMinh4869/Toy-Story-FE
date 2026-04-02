// components/staff/TransfersActionCard.tsx
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPendingTransfers, acceptTransfer, completeTransfer } from "@/services/transferService";
import { Loader2, ArrowRightLeft } from "lucide-react";
import { ViewTransSummaryDto, TransferStatus, TransferType } from "@/types/TransferDTO";

const fmtDate = (iso?: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('vi-VN');
};

const statusBadge = (status: TransferStatus) => {
    const configs: Record<TransferStatus, { label: string; cls: string }> = {
        [TransferStatus.Pending]: { label: 'Chờ xác nhận', cls: 'bg-amber-100 text-amber-700' },
        [TransferStatus.Accepted]: { label: 'Đã xác nhận', cls: 'bg-green-100 text-green-700' },
        [TransferStatus.Completed]: { label: 'Hoàn thành', cls: 'bg-blue-100 text-blue-700' },
        [TransferStatus.Rejected]: { label: 'Từ chối', cls: 'bg-red-100 text-red-700' },
    };
    const { label, cls } = configs[status] ?? { label: String(status), cls: 'bg-gray-100 text-gray-700' };
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${cls}`}>
            {label}
        </span>
    );
};

const TransfersActionCard = () => {
    const [data, setData] = useState<ViewTransSummaryDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actioning, setActioning] = useState<number | null>(null);

    const fetchTransfers = useCallback(async () => {
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
    }, []);

    useEffect(() => { fetchTransfers(); }, [fetchTransfers]);

    const handleAction = async (transfer: ViewTransSummaryDto) => {
        setActioning(transfer.transferId);
        try {
            if (transfer.status === TransferStatus.Pending) {
                await acceptTransfer(transfer.transferId);
            } else if (transfer.status === TransferStatus.Accepted) {
                await completeTransfer(transfer.transferId);
            }
            await fetchTransfers();
        } catch (err) {
            console.error(err);
        } finally {
            setActioning(null);
        }
    };

    const getActionLabel = (transfer: ViewTransSummaryDto): string | null => {
        if (transfer.status === TransferStatus.Pending) return 'Xác nhận';
        if (transfer.status === TransferStatus.Accepted) {
            return transfer.type === TransferType.TransferIn ? 'Nhận hàng' : 'Chuyển hàng';
        }
        return null;
    };

    return (
        <Card className="rounded-3xl bg-slate-50" id="zone2-transfers">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">
                        Đơn chuyển kho chờ xử lý
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-8 text-sm">{error}</div>
                ) : data.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 text-sm">
                        Không có đơn chuyển kho chờ xử lý
                    </div>
                ) : (
                    <div className="relative">
                        <div className="overflow-y-auto max-h-[220px] space-y-2">
                        {data.map((transfer) => {
                            const actionLabel = getActionLabel(transfer);
                            return (
                                <div
                                    key={transfer.transferId}
                                    className="flex items-center gap-2 p-3 border rounded-2xl hover:bg-white transition-colors"
                                >
                                    <span className="font-semibold text-sm shrink-0">
                                        #{transfer.transferId}
                                    </span>
                                    {statusBadge(transfer.status)}
                                    <div className="flex-1 min-w-0 text-xs text-slate-600">
                                        <p className="truncate">
                                            {transfer.sourceWarehouseName ?? 'N/A'} → {transfer.destinationWarehouseName ?? 'N/A'}
                                        </p>
                                        <p className="text-slate-400">{fmtDate(transfer.createdAt)}</p>
                                    </div>
                                    {actionLabel && (
                                        <button
                                            onClick={() => handleAction(transfer)}
                                            disabled={actioning === transfer.transferId}
                                            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold bg-[#8B0000] text-white hover:bg-[#6b0000] disabled:opacity-50 transition-colors flex items-center gap-1"
                                        >
                                            {actioning === transfer.transferId
                                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                                : actionLabel}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TransfersActionCard;
