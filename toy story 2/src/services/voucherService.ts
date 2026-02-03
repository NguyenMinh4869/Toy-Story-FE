import { apiGet, apiPostForm, apiPutForm } from './apiClient'
import type { ViewVoucherDto, ViewVoucherSummaryDto, CreateVoucherDto, UpdateVoucherDto } from '../types/VoucherDTO'

/**
 * Get vouchers for customer listing (public endpoint)
 * GET /api/Voucher/customer-filter
 * Optional query: name, type (DiscountType 0|1|2|3)
 */
export const getCustomerFilterVouchers = async (params?: {
  name?: string
  type?: number
}): Promise<ViewVoucherSummaryDto[]> => {
  const queryParams = new URLSearchParams()
  if (params?.name) queryParams.append('name', params.name)
  if (params?.type !== undefined) queryParams.append('type', String(params.type))

  const endpoint = `/Voucher/customer-filter${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await apiGet<ViewVoucherSummaryDto[]>(endpoint)
  return response.data
}

export const getVouchers = async (): Promise<ViewVoucherSummaryDto[]> => {
  const response = await apiGet<ViewVoucherSummaryDto[]>('/Voucher')
  return response.data
}

export const getVoucherById = async (voucherId: number): Promise<ViewVoucherDto> => {
  const response = await apiGet<ViewVoucherDto>(`/Voucher/${voucherId}`)
  return response.data
}

export const createVoucher = async (data: CreateVoucherDto, imageFile?: File): Promise<{ message: string }> => {
  const form = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, String(value))
  })
  if (imageFile) form.append('imageFile', imageFile)
  const response = await apiPostForm<{ message: string }>('/Voucher', form)
  return response.data
}

export const updateVoucher = async (voucherId: number, data: UpdateVoucherDto, imageFile?: File): Promise<{ message: string }> => {
  const form = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, String(value))
  })
  if (imageFile) form.append('imageFile', imageFile)
  const response = await apiPutForm<{ message: string }>(`/Voucher/${voucherId}`, form)
  return response.data
}

export const changeVoucherStatus = async (voucherId: number): Promise<{ message: string }> => {
  const form = new FormData()
  const response = await apiPutForm<{ message: string }>(`/Voucher/change-status/${voucherId}`, form)
  return response.data
}

export const deleteVoucher = async (voucherId: number): Promise<{ message: string }> => {
  return changeVoucherStatus(voucherId)
}

