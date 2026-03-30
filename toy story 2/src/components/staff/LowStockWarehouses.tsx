// components/warehouses/LowStockWarehouses.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLowStockWarehouses } from "@/services/warehouseService";
import { Loader2, AlertTriangle } from "lucide-react";

type ProductStockDto = {
    productId?: number;
    name?: string | null;
    totalQuantity?: number;
};

const LowStockWarehouses = () => {
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
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">
                        Sản phẩm tồn kho thấp
                    </h2>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.map((product, index) => (
                        <div
                            key={product.productId || index}
                            className="flex items-center justify-between p-4 shadow-lg border rounded-3xl hover:bg-gray-50 transition-colors"
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{product.name || "Không có tên"}</span>
                                    {product.productId && (
                                        <span className="text-xs text-gray-500">ID: {product.productId}</span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                Tồn kho: {product.totalQuantity || 0}
                            </div>
                        </div>
                    ))}
                    {data.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                            Không có sản phẩm tồn kho thấp
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default LowStockWarehouses;