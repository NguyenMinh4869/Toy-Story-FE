import { apiGet } from './apiClient'
import type { DashboardSummaryDto, LowStockItemDto } from '../types/DashboardDTO'

export const getDashboardSummary = async (): Promise<DashboardSummaryDto> => {
  const response = await apiGet<DashboardSummaryDto>('/dashboard/summary')
  return response.data
}

export const getDashboardLowStock = async (threshold?: number): Promise<LowStockItemDto[]> => {
  const url = typeof threshold === 'number'
    ? `/dashboard/low-stock?threshold=${threshold}`
    : '/dashboard/low-stock'
  const response = await apiGet<LowStockItemDto[]>(url)
  return response.data
}
