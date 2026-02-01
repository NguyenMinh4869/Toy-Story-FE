import { apiGet, apiPost, apiPut, apiPutForm } from './apiClient'
import type { ViewStaffDto, CreateStaffDto, UpdateStaffDto } from '../types/StaffDTO'

export const getAllStaff = async (): Promise<ViewStaffDto[]> => {
  const response = await apiGet<ViewStaffDto[]>('/Staff')
  return response.data
}

export const createStaff = async (data: CreateStaffDto): Promise<{ message: string }> => {
  const response = await apiPost<{ message: string }>('/Staff', data)
  return response.data
}

export const updateStaff = async (accountId: number, data: UpdateStaffDto): Promise<{ message: string }> => {
  const response = await apiPut<{ message: string }>(`/Staff/${accountId}`, data)
  return response.data
}

export const changeStaffStatus = async (accountId: number): Promise<{ message: string }> => {
  const form = new FormData();
  const response = await apiPutForm<{ message: string }>(`/Staff/change-status/${accountId}`, form);
  return response.data;
}

/**
 * Get staff by account ID
 * GET /api/Staff/{accountId}
 * Returns staff details including warehouseId
 */
export interface StaffDetailDto {
  accountId: number
  warehouseId: number
  name?: string
  email?: string
}

export const getStaffByAccountId = async (accountId: number): Promise<StaffDetailDto> => {
  const response = await apiGet<StaffDetailDto>(`/staff/${accountId}`)
  return response.data
}

/**
 * Get current staff's warehouse ID
 */
export const getCurrentStaffWarehouseId = async (accountId: number): Promise<number> => {
  const staff = await getStaffByAccountId(accountId)
  return staff.warehouseId
}
