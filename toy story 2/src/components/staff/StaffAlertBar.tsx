// components/staff/StaffAlertBar.tsx
import React from 'react';

interface StaffAlertBarProps {
    pendingOrdersCount: number;
    lowStockCount: number;
    pendingTransfersCount: number;
}

const StaffAlertBar: React.FC<StaffAlertBarProps> = ({
    pendingOrdersCount,
    lowStockCount,
    pendingTransfersCount,
}) => {
    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const chips = [
        {
            label: 'Đơn chờ xử lý',
            count: pendingOrdersCount,
            activeColor: 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200',
            mutedColor: 'bg-gray-100 text-gray-400 border-gray-200',
            dot: pendingOrdersCount > 0 ? 'bg-red-500' : 'bg-gray-300',
            anchor: 'zone4-orders',
        },
        {
            label: 'Sản phẩm sắp hết',
            count: lowStockCount,
            activeColor: 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200',
            mutedColor: 'bg-gray-100 text-gray-400 border-gray-200',
            dot: lowStockCount > 0 ? 'bg-orange-500' : 'bg-gray-300',
            anchor: 'zone2-lowstock',
        },
        {
            label: 'Chuyển kho chờ xác nhận',
            count: pendingTransfersCount,
            activeColor: 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200',
            mutedColor: 'bg-gray-100 text-gray-400 border-gray-200',
            dot: pendingTransfersCount > 0 ? 'bg-yellow-500' : 'bg-gray-300',
            anchor: 'zone2-transfers',
        },
    ];

    return (
        <div className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-sm px-1 py-3 flex items-center gap-3 flex-wrap">
            {chips.map((chip) => {
                const isActive = chip.count > 0;
                return (
                    <button
                        key={chip.label}
                        onClick={() => scrollTo(chip.anchor)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-colors ${
                            isActive ? chip.activeColor : chip.mutedColor
                        }`}
                    >
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${chip.dot}`} />
                        <span className="font-bold">{chip.count}</span>
                        <span>{chip.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default StaffAlertBar;
