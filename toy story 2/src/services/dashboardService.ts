import { apiGet } from './apiClient'
import type { AdminWidgetDto, DashboardSummaryDto, LowStockItemDto } from '../types/DashboardDTO'

export const getStaffDashboardSummary = async (): Promise<DashboardSummaryDto> => {
  const response = await apiGet<DashboardSummaryDto>('/dashboard/staff/summary')
  return response.data
}

export const getAdminDashboardSummary = async (): Promise<AdminWidgetDto> => {
  const response = await apiGet<AdminWidgetDto>('/dashboard/admin/summary')
  return response.data
}

export const getDashboardLowStock = async (threshold?: number): Promise<LowStockItemDto[]> => {
  const url = typeof threshold === 'number'
    ? `/dashboard/low-stock?threshold=${threshold}`
    : '/dashboard/low-stock'
  const response = await apiGet<LowStockItemDto[]>(url)
  return response.data
}