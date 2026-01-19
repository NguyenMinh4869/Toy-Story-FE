/**
 * Product Service
 * API service for product-related operations matching .NET backend
 */

import { apiGet } from './apiClient'
import type { ViewProductDto } from '../types/ProductDTO'

/**
 * Get active products (public endpoint)
 */
export const getActiveProducts = async (): Promise<ViewProductDto[]> => {
  const response = await apiGet<ViewProductDto[]>('/product/active-brands')
  return response.data
}

/**
 * Get product by ID
 */
export const getProductById = async (productId: number): Promise<ViewProductDto> => {
  const response = await apiGet<ViewProductDto>(`/product/${productId}`)
  return response.data
}

/**
 * Filter products (public endpoint with query parameters)
 */
export const filterProducts = async (params?: {
  name?: string
  origin?: string
  material?: string
  genderTarget?: 'Boy' | 'Girl' | 'Unisex'
  ageRange?: 'ZeroToSixMonths' | 'SixToTwelveMonths' | 'OneToThreeYears' | 'ThreeToSixYears' | 'AboveSixYears'
  categoryId?: number
  brandId?: number
  status?: 'Active' | 'Inactive' | 'OutOfStock'
}): Promise<ViewProductDto[]> => {
  const queryParams = new URLSearchParams()
  if (params?.name) queryParams.append('name', params.name)
  if (params?.origin) queryParams.append('origin', params.origin)
  if (params?.material) queryParams.append('material', params.material)
  if (params?.genderTarget) queryParams.append('genderTarget', params.genderTarget)
  if (params?.ageRange) queryParams.append('ageRange', params.ageRange)
  if (params?.categoryId) queryParams.append('categoryId', params.categoryId.toString())
  if (params?.brandId) queryParams.append('brandId', params.brandId.toString())
  if (params?.status) queryParams.append('status', params.status)

  const endpoint = `/product/filter${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await apiGet<ViewProductDto[]>(endpoint)
  return response.data
}

/**
 * Get products by category ID
 */
export const getProductsByCategoryId = async (categoryId: number): Promise<ViewProductDto[]> => {
  return filterProducts({ categoryId, status: 'Active' })
}

/**
 * Get products by brand ID
 */
export const getProductsByBrandId = async (brandId: number): Promise<ViewProductDto[]> => {
  return filterProducts({ brandId, status: 'Active' })
}

/**
 * Search products by name
 */
export const searchProducts = async (searchTerm: string): Promise<ViewProductDto[]> => {
  return filterProducts({ name: searchTerm, status: 'Active' })
}

