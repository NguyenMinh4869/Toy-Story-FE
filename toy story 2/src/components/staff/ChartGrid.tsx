import React from 'react'
import TodayOrderChart from './TodayOrderChart'
import LowStockChart from './LowStockChart'
import WeeklyOrderVolumeChart from './WeeklyOrderChart'
import TopPickChart from './TopPickChart'
import PendingOrders from '../admin/dashboard/PendingOrders'
import DeliveryOrders from '../admin/dashboard/DeliveryOrders'
import PendingTransfers from './PendingTransfers'
import LowStockWarehouses from './LowStockWarehouses'
const ChartGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-2 gap-6">
            <PendingOrders />
            <DeliveryOrders />
            <LowStockWarehouses />
            <PendingTransfers />
            <TodayOrderChart />
            <LowStockChart />
            <WeeklyOrderVolumeChart />
            <TopPickChart />
        </div>
    )
}

export default ChartGrid