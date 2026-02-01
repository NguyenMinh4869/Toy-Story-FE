/**
 * Product Service
 * API service for product-related operations matching .NET backend
 */

import { apiGet, apiPostForm, apiPutForm } from './apiClient'
import type { ViewProductDto } from '../types/ProductDTO'
import type { CreateProductDto, UpdateProductDto } from '../types/ProductDTO'

/**
 * Get active products (public endpoint)
 */
export const getActiveProducts = async (): Promise<ViewProductDto[]> => {
  return filterProducts({ status: 'Active' })
}

/**
 * Get product by ID
 */
export const getProductById = async (productId: number): Promise<ViewProductDto> => {
  const response = await apiGet<ViewProductDto>(`/Product/${productId}`)
  return response.data
}

/**
 * Filter products (admin endpoint with query parameters)
 */
export const filterProducts = async (params?: {
  searchTerm?: string
  origin?: string
  material?: string
  genderTarget?: 'Boy' | 'Girl' | 'Unisex'
  ageRange?: 'ZeroToSixMonths' | 'SixToTwelveMonths' | 'OneToThreeYears' | 'ThreeToSixYears' | 'AboveSixYears'
  categoryId?: number
  brandId?: number
  status?: 'Active' | 'Inactive' | 'OutOfStock'
  promotionId?: number
}): Promise<ViewProductDto[]> => {
  const queryParams = new URLSearchParams()
  if (params?.searchTerm) queryParams.append('searchTerm', params.searchTerm)
  if (params?.origin) queryParams.append('origin', params.origin)
  if (params?.material) queryParams.append('material', params.material)
  if (params?.genderTarget) queryParams.append('genderTarget', params.genderTarget)
  if (params?.ageRange) queryParams.append('ageRange', params.ageRange)
  if (params?.categoryId) queryParams.append('categoryId', params.categoryId.toString())
  if (params?.brandId) queryParams.append('brandId', params.brandId.toString())
  if (params?.status) queryParams.append('status', params.status)
  if (params?.promotionId) queryParams.append('promotionId', params.promotionId.toString())

  const endpoint = `/Product/admin-filter${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
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
  return filterProducts({ searchTerm: searchTerm, status: 'Active' })
}

/**
 * Create product (Admin only)
 * POST /api/product
 * multipart/form-data with fields aligned to backend DTO
 */
export const createProduct = async (data: CreateProductDto, imageFile?: File): Promise<{ message: string }> => {
  const form = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, String(value))
  })
  if (imageFile) form.append('imageFile', imageFile)
  const response = await apiPostForm<{ message: string }>('/Product', form)
  return response.data
}

/**
 * Update product (Admin only)
 * PUT /api/product/{productId}
 */
export const updateProduct = async (productId: number, data: UpdateProductDto, imageFile?: File): Promise<{ message: string }> => {
  const form = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, String(value))
  })
  if (imageFile) form.append('imageFile', imageFile)
  const response = await apiPutForm<{ message: string }>(`/Product/${productId}`, form)
  return response.data
}

/**
 * Change product status (Admin only)
 * PUT /api/product/change-status/{productId}
 */
export const changeProductStatus = async (productId: number): Promise<{ message: string }> => {
  const form = new FormData()
  const response = await apiPutForm<{ message: string }>(`/Product/change-status/${productId}`, form)
  return response.data
}
