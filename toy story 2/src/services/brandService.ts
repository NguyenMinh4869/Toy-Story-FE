/**
 * Brand Service
 * API service for brand-related operations matching .NET backend
 */

import { apiGet, apiPostForm, apiPutForm } from './apiClient'
import type { ViewBrandDto, CreateBrandDto, UpdateBrandDto } from '../types/BrandDTO'

/**
 * Get active brands (public endpoint)
 */
export const getActiveBrands = async (): Promise<ViewBrandDto[]> => {
  const response = await apiGet<ViewBrandDto[]>('/Brand/active-brands')
  return response.data
}

/**
 * Get brand by ID
 */
export const getBrandById = async (brandId: number): Promise<ViewBrandDto> => {
  const response = await apiGet<ViewBrandDto>(`/Brand/${brandId}`)
  return response.data
}

/**
 * Filter brands (public endpoint with query parameters)
 */
export const filterBrands = async (params?: {
  name?: string
  status?: 'Active' | 'Inactive' | number
}): Promise<ViewBrandDto[]> => {
  const queryParams = new URLSearchParams()
  if (params?.name) queryParams.append('name', params.name)
  if (params?.status !== undefined) queryParams.append('status', params.status.toString())

  const endpoint = `/Brand/filter${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await apiGet<ViewBrandDto[]>(endpoint)
  return response.data
}

/**
 * Create brand (Admin only)
 * POST /api/brand
 * multipart/form-data: Name, imageFile
 */
export const createBrand = async (data: CreateBrandDto, imageFile?: File): Promise<{ message: string }> => {
  const form = new FormData()
  if (data.name) form.append('Name', data.name)
  if (imageFile) form.append('imageFile', imageFile)
  const response = await apiPostForm<{ message: string }>('/Brand', form)
  return response.data
}

/**
 * Update brand (Admin only)
 * PUT /api/brand/{brandId}
 * multipart/form-data: Name, imageFile
 */
export const updateBrand = async (brandId: number, data: UpdateBrandDto, imageFile?: File): Promise<{ message: string }> => {
  const form = new FormData()
  if (data.name) form.append('Name', data.name as string)
  if (imageFile) form.append('imageFile', imageFile)
  const response = await apiPutForm<{ message: string }>(`/Brand/${brandId}`, form)
  return response.data
}

/**
 * Change brand status (toggle Active/Inactive) (Admin only)
 * PUT /api/brand/change-status/{brandId}
 */
export const changeBrandStatus = async (brandId: number): Promise<{ message: string }> => {
  const form = new FormData()
  const response = await apiPutForm<{ message: string }>(`/Brand/change-status/${brandId}`, form)
  return response.data
}

