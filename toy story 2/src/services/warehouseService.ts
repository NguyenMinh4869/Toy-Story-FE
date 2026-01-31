import { apiGet, apiPostForm, apiPutForm, apiDelete } from './apiClient'
import type { WarehouseSummaryDto, CreateWarehouseDto, UpdateWarehouseDto, WarehouseDetailDto } from '../types/WarehouseDTO'

export const getWarehouses = async (): Promise<WarehouseSummaryDto[]> => {
  const response = await apiGet<WarehouseSummaryDto[]>('/Warehouse')
  return response.data
}

export const getWarehouseById = async (warehouseId: number): Promise<WarehouseDetailDto> => {
  const response = await apiGet<WarehouseDetailDto>(`/Warehouse/${warehouseId}`)
  return response.data
}

export const createWarehouse = async (data: CreateWarehouseDto): Promise<{ message: string }> => {
  const form = new FormData()
  form.append('Name', data.Name)
  form.append('Location', data.Location)
  const response = await apiPostForm<{ message: string }>('/Warehouse', form)
  return response.data
}

export const updateWarehouse = async (warehouseId: number, data: UpdateWarehouseDto): Promise<{ message: string }> => {
  const form = new FormData()
  if (data.Name) form.append('Name', data.Name)
  if (data.Location) form.append('Location', data.Location)
  const response = await apiPutForm<{ message: string }>(`/Warehouse/${warehouseId}`, form)
  return response.data
}

export const deleteWarehouse = async (warehouseId: number): Promise<{ message: string }> => {
  const response = await apiDelete<{ message: string }>(`/Warehouse/${warehouseId}`)
  return response.data
}

