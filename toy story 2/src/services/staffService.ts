import { apiGet, apiPost, apiPut, apiPutForm } from './apiClient'
import type { ViewStaffDto, CreateStaffDto, UpdateStaffDto } from '../types/StaffDTO'

export const getAllStaff = async (): Promise<ViewStaffDto[]> => {
  const response = await apiGet<ViewStaffDto[]>('/staffs')
  return response.data
}

export const createStaff = async (data: CreateStaffDto): Promise<{ message: string }> => {
  const response = await apiPost<{ message: string }>('/staffs', data)
  return response.data
}

export const updateStaff = async (accountId: number, data: UpdateStaffDto): Promise<{ message: string }> => {
  const response = await apiPut<{ message: string }>(`/staffs/${accountId}`, data)
  return response.data
}

export const changeStaffStatus = async (accountId: number): Promise<{ message: string }> => {
  const response = await apiPut<{ message: string }>(`/staffs/status/${accountId}`)
  return response.data
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
  const response = await apiGet<StaffDetailDto>(`/staffs/${accountId}`)
  return response.data
}

/**
 * Get current staff's warehouse ID
 */
export const getCurrentStaffWarehouseId = async (accountId: number): Promise<number> => {
  const staff = await getStaffByAccountId(accountId)
  return staff.warehouseId
}

/**
 * Filter staff — returns ALL staff by default.
 * Pass status=0 (Active) or 1 (Inactive) to filter.
 * GET /api/staffs/filter
 */
export const filterStaff = async (params?: {
  searchTerm?: string
  status?: 0 | 1
}): Promise<ViewStaffDto[]> => {
  const queryParams = new URLSearchParams()
  if (params?.searchTerm) queryParams.append('searchTerm', params.searchTerm)
  if (params?.status !== undefined) queryParams.append('status', String(params.status))

  const endpoint = `/staffs/filter${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await apiGet<ViewStaffDto[]>(endpoint)
  return response.data
}
