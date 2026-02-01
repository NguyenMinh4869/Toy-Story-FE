import type { components } from './generated'

export type WarehouseSummaryDto = components['schemas']['WarehouseSummaryDto']
export type WarehouseDetailDto = components['schemas']['WarehouseDetailDto']
export type CreateWarehouseResponseDto = components['schemas']['CreateWarehouseResponseDto']

export interface CreateWarehouseDto {
  Name: string
  Location: string
  LowStockThreshold?: number
}

export interface UpdateWarehouseDto {
  Name?: string
  Location?: string
  LowStockThreshold?: number
}
