import { apiGet, apiPostForm, apiPutForm, apiDelete, apiPut } from './apiClient'
import type { WarehouseSummaryDto, CreateWarehouseDto, UpdateWarehouseDto, WarehouseDetailDto } from '../types/WarehouseDTO'
import type { components } from '../types/generated'

type CreateWarehouseResponseDto = components['schemas']['CreateWarehouseResponseDto']
type UpdateLowStockThresholdDto = components['schemas']['UpdateLowStockThresholdDto']

export const getWarehouses = async (): Promise<WarehouseSummaryDto[]> => {
  const response = await apiGet<WarehouseSummaryDto[]>('/Warehouse')
  return response.data
}

export const getWarehouseById = async (warehouseId: number): Promise<WarehouseDetailDto> => {
  const response = await apiGet<WarehouseDetailDto>(`/Warehouse/${warehouseId}`)
  return response.data
}

export const createWarehouse = async (data: CreateWarehouseDto): Promise<CreateWarehouseResponseDto> => {
  const form = new FormData()
  form.append('Name', data.Name)
  form.append('Location', data.Location)
  if (typeof data.LowStockThreshold === 'number') {
    form.append('LowStockThreshold', String(data.LowStockThreshold))
  }
  const response = await apiPostForm<CreateWarehouseResponseDto>('/Warehouse', form)
  return response.data
}

export const updateWarehouse = async (warehouseId: number, data: UpdateWarehouseDto): Promise<{ message: string }> => {
  const form = new FormData()
  if (data.Name !== undefined) form.append('Name', String(data.Name))
  if (data.Location !== undefined) form.append('Location', String(data.Location))

  // Some backends ignore LowStockThreshold on this endpoint; the dedicated endpoint below is authoritative.
  if (typeof data.LowStockThreshold === 'number') {
    form.append('LowStockThreshold', String(data.LowStockThreshold))
  }

  const response = await apiPutForm<{ message: string }>(`/Warehouse/${warehouseId}`, form)
  return response.data
}

export const updateWarehouseLowStockThreshold = async (
  warehouseId: number,
  threshold: number
): Promise<{ message: string }> => {
  const dto: UpdateLowStockThresholdDto = { threshold }
  const response = await apiPut<{ message: string }>(`/Warehouse/${warehouseId}/low-stock-threshold`, dto)
  return response.data
}

export const deleteWarehouse = async (warehouseId: number): Promise<{ message: string }> => {
  const response = await apiDelete<{ message: string }>(`/Warehouse/${warehouseId}`)
  return response.data
}
