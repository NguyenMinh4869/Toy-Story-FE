/**
 * Brand Service
 * API service for brand-related operations matching .NET backend
 */

import { apiGet } from './apiClient'
import type { ViewBrandDto } from '../types/BrandDTO'

/**
 * Get active brands (public endpoint)
 */
export const getActiveBrands = async (): Promise<ViewBrandDto[]> => {
  const response = await apiGet<ViewBrandDto[]>('/brand/active-brands')
  return response.data
}

/**
 * Get brand by ID
 */
export const getBrandById = async (brandId: number): Promise<ViewBrandDto> => {
  const response = await apiGet<ViewBrandDto>(`/brand/${brandId}`)
  return response.data
}

/**
 * Filter brands (public endpoint with query parameters)
 */
export const filterBrands = async (params?: {
  name?: string
  status?: 'Active' | 'Inactive'
}): Promise<ViewBrandDto[]> => {
  const queryParams = new URLSearchParams()
  if (params?.name) queryParams.append('name', params.name)
  if (params?.status) queryParams.append('status', params.status)

  const endpoint = `/brand/filter${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await apiGet<ViewBrandDto[]>(endpoint)
  return response.data
}

