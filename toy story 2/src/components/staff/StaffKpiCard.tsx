// components/staff/StaffKpiCard.tsx
import React from 'react';
import { Package, AlertTriangle, Tag, Layers, Percent, XCircle } from 'lucide-react';

interface StaffKpiCardProps {
    totalStock: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalBrands: number;
    totalSets: number;
    activePromotions: number;
    loading: boolean;
}

const StaffKpiCard: React.FC<StaffKpiCardProps> = ({
    totalStock,
    lowStockCount,
    outOfStockCount,
    totalBrands,
    totalSets,
    activePromotions,
    loading,
}) => {
    const v = (n: number) => (loading ? '…' : n);

    const stats = [
        { label: 'Tổng tồn kho', value: v(totalStock), icon: <Package className="w-4 h-4 text-emerald-500" /> },
        { label: 'Sắp hết hàng', value: v(lowStockCount), icon: <AlertTriangle className="w-4 h-4 text-orange-500" /> },
        { label: 'Hết hàng', value: v(outOfStockCount), icon: <XCircle className="w-4 h-4 text-red-500" /> },
        { label: 'Thương hiệu', value: v(totalBrands), icon: <Tag className="w-4 h-4 text-blue-500" /> },
        { label: 'Bộ sản phẩm', value: v(totalSets), icon: <Layers className="w-4 h-4 text-purple-500" /> },
        { label: 'Khuyến mãi', value: v(activePromotions), icon: <Percent className="w-4 h-4 text-pink-500" /> },
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-100 h-[80px] flex items-stretch divide-x divide-slate-100">
            {stats.map((stat) => (
                <div key={stat.label} className="flex-1 flex flex-col items-center justify-center px-2 gap-0.5">
                    <div className="flex items-center gap-1 leading-none">
                        {stat.icon}
                        <span className="text-xl font-bold text-slate-900 leading-none">{stat.value}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 leading-none mt-0.5">{stat.label}</span>
                </div>
            ))}
        </div>
    );
};

export default StaffKpiCard;
