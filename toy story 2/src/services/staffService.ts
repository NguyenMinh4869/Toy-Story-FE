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

