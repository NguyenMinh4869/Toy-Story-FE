// components/staff/LowStockListCard.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLowStockWarehouses } from "@/services/warehouseService";
import { Loader2, AlertTriangle } from "lucide-react";

type ProductStockDto = {
    productId?: number;
    name?: string | null;
    totalQuantity?: number;
};

const getBarColor = (qty: number): string => {
    if (qty <= 1) return 'bg-red-500';
    if (qty <= 5) return 'bg-amber-500';
    return 'bg-green-500';
};

const getBadgeCls = (qty: number): string => {
    if (qty <= 1) return 'bg-red-100 text-red-700';
    if (qty <= 5) return 'bg-amber-100 text-amber-700';
    return 'bg-green-100 text-green-700';
};

const MAX_BAR = 20;

const LowStockListCard = () => {
    const [data, setData] = useState<ProductStockDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLowStock = async () => {
            try {
                setIsLoading(true);
                const stocks = await getLowStockWarehouses();
                setData(stocks);
                setError(null);
            } catch (err) {
                setError("Không thể tải dữ liệu");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLowStock();
    }, []);

    return (
        <Card className="rounded-3xl bg-slate-50" id="zone2-lowstock">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">
                        Sản phẩm tồn kho thấp
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
                    <div className="text-center text-green-600 font-medium py-8 text-sm">
                        Tất cả sản phẩm đủ hàng ✓
                    </div>
                ) : (
                    <div className="overflow-y-auto max-h-72 space-y-3">
                        {data.slice(0, 6).map((product, index) => {
                            const qty = product.totalQuantity ?? 0;
                            const pct = Math.min((qty / MAX_BAR) * 100, 100);
                            return (
                                <div key={product.productId ?? index} className="space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs text-slate-700 font-medium truncate max-w-[65%]">
                                            {product.name ?? 'Không có tên'}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold shrink-0 ${getBadgeCls(qty)}`}>
                                            {qty}
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${getBarColor(qty)}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default LowStockListCard;
