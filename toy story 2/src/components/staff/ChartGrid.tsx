import React from 'react'
import TodayOrderChart from './TodayOrderChart'
import LowStockChart from './LowStockChart'
import WeeklyOrderVolumeChart from './WeeklyOrderChart'
import TopPickChart from './TopPickChart'
const ChartGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-2 gap-6">
            <TodayOrderChart />
            <LowStockChart />
            <WeeklyOrderVolumeChart />
            <TopPickChart />
        </div>
    )
}

export default ChartGrid