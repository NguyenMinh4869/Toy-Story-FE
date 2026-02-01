import { apiGet } from './apiClient'
import type { DashboardSummaryDto, LowStockItemDto } from '../types/DashboardDTO'

export const getDashboardSummary = async (): Promise<DashboardSummaryDto> => {
  const response = await apiGet<DashboardSummaryDto>('/Dashboard/summary')
  return response.data
}

export const getDashboardLowStock = async (threshold?: number): Promise<LowStockItemDto[]> => {
  const url = typeof threshold === 'number'
    ? `/Dashboard/low-stock?threshold=${threshold}`
    : '/Dashboard/low-stock'
  const response = await apiGet<LowStockItemDto[]>(url)
  return response.data
}
