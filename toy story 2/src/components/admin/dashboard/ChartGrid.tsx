// components/charts/ChartGrid.tsx
import React from 'react'
import RevenueOverviewChart from './RevenueOverviewChart'
import OrderStatusChart from './OrderStatusChart'
import TopSellingProductsChart from './TopSellingProductsChart'
import TopSellingSetsChart from './TopSellingSetsChart'
import WarehouseWorkloadChart from './WarehouseWorkloadChart'
import OrderGrowthChart from './OrderGrowthChart'
import PendingOrders from './PendingOrders'
import DeliveryOrders from './DeliveryOrders'

const ChartGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-2 gap-6">
            <PendingOrders />
            <DeliveryOrders />
            <RevenueOverviewChart />
            <OrderStatusChart />
            <TopSellingProductsChart />
            <TopSellingSetsChart />
            <WarehouseWorkloadChart />
            <OrderGrowthChart />
        </div>
    )
}

export default ChartGrid