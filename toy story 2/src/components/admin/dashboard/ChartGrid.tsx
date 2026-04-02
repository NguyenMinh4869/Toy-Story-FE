// components/charts/ChartGrid.tsx
import React from 'react'
import OrdersTabCard from './OrdersTabCard'
import CombinedGrowthChart from './CombinedGrowthChart'
import CombinedTopSellersChart from './CombinedTopSellersChart'
import OrderStatusChart from './OrderStatusChart'

const ChartGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-4">
                <OrdersTabCard />
                <OrderStatusChart />
            </div>
            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-4">
                <CombinedGrowthChart />
                <CombinedTopSellersChart />
            </div>
        </div>
    )
}

export default ChartGrid