import React from 'react'
import TransfersActionCard from './TransfersActionCard'
import LowStockListCard from './LowStockListCard'
import StaffKpiCard from './StaffKpiCard'
import WeeklyOrderVolumeChart from './WeeklyOrderChart'
import StaffOrdersTabCard from './StaffOrdersTabCard'

interface ChartGridProps {
    totalStock: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalBrands: number;
    totalSets: number;
    activePromotions: number;
    loading: boolean;
}

const ChartGrid: React.FC<ChartGridProps> = (props) => {
    return (
        <div className="space-y-4">
            {/* Zone 2 — KPI horizontal strip */}
            <StaffKpiCard {...props} />

            {/* Zone 3 — Action zone: Transfers + Low Stock */}
            <div className="grid grid-cols-2 gap-4">
                <TransfersActionCard />
                <LowStockListCard />
            </div>

            {/* Zone 4 — Info zone: Chart + Orders tab */}
            <div className="grid grid-cols-2 gap-4">
                <WeeklyOrderVolumeChart />
                <StaffOrdersTabCard />
            </div>
        </div>
    )
}

export default ChartGrid