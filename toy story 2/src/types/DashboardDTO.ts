import type { components } from './generated'

export type DashboardSummaryDto = components['schemas']['DashboardSummaryDto']
export type LowStockItemDto = components['schemas']['LowStockItemDto']

export interface ChartPointDto {
    label: string;
    value: number;
}

export interface ChartSeriesDto {
    labels: string[];
    values: number[];
}

export interface StaffDashboardViewModel {
    todayOrderStatus: ChartPointDto[];
    lowStockAlerts: ChartPointDto[];
    weeklyOrderVolume: ChartSeriesDto;
    topPickProducts: ChartPointDto[];
}

export interface DashboardViewModel {
    revenueOverview: ChartSeriesDto;
    orderStatusDistribution: ChartPointDto[];
    topSellingProducts: ChartPointDto[];
    topSellingSets: ChartPointDto[];
    warehouseWorkload: ChartPointDto[];
    orderGrowth: ChartSeriesDto;
}

export interface AdminWidgetDto{
    totalRevenue: number;
    totalWarehouses: number;
    totalStaff: number;
    totalOrders: number;
    totalProducts: number;
    totalSets: number;
}