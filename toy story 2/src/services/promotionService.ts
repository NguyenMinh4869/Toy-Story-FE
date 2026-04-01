/**
 * Promotion Service
 * API service for promotion-related operations matching .NET backend
 *
 * NOTE: PromotionController requires Admin authorization for most endpoints.
 * customer-filter is public.
 */

import { apiGet, apiPostForm, apiPutForm } from './apiClient'
import type { ViewPromotionDto, ViewPromotionSummaryDto } from '../types/PromotionDTO'
import type { CreatePromotionDto, UpdatePromotionDto } from '../types/PromotionDTO'

/**
 * Get all promotions (Admin only - requires authentication)
 */
export const getPromotions = async (): Promise<ViewPromotionSummaryDto[]> => {
  const response = await apiGet<ViewPromotionSummaryDto[]>('/promotions')
  return response.data
}

/**
 * Get promotions for customer listing (public endpoint)
 * GET /api/promotions/customer-filter
 * Optional query: name, discountType, productId, categoryId, brandId
 */
export const getPromotionsCustomerFilter = async (params?: {
  name?: string
  discountType?: number
  productId?: number
  categoryId?: number
  brandId?: number
}): Promise<ViewPromotionDto[]> => {
  const queryParams = new URLSearchParams()
  if (params?.name) queryParams.append('name', params.name)
  if (params?.discountType !== undefined) queryParams.append('discountType', String(params.discountType))
  if (params?.productId !== undefined) queryParams.append('productId', String(params.productId))
  if (params?.categoryId !== undefined) queryParams.append('categoryId', String(params.categoryId))
  if (params?.brandId !== undefined) queryParams.append('brandId', String(params.brandId))

  const endpoint = `/promotions/customer-filter${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await apiGet<ViewPromotionDto[]>(endpoint)
  return response.data
}

/**
 * Get promotion by ID (Admin only - requires authentication)
 */
export const getPromotionById = async (promotionId: number): Promise<ViewPromotionDto> => {
  const response = await apiGet<ViewPromotionDto>(`/promotions/${promotionId}`)
  return response.data
}

/**
 * Get active promotions — filters client-side from all promotions
 */
export const getActivePromotions = async (): Promise<ViewPromotionSummaryDto[]> => {
  const allPromotions = await getPromotions()
  return allPromotions.filter(p => p.isActive)
}

/**
 * Create promotion (Admin only)
 * POST /api/promotions
 */
export const createPromotion = async (data: CreatePromotionDto, imageFile?: File): Promise<{ message: string }> => {
  const form = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, String(value))
  })
  if (imageFile) form.append('imageFile', imageFile)
  const response = await apiPostForm<{ message: string }>('/promotions', form)
  return response.data
}

/**
 * Update promotion (Admin only)
 * PUT /api/promotions/{promotionId}
 */
export const updatePromotion = async (promotionId: number, data: UpdatePromotionDto, imageFile?: File): Promise<{ message: string }> => {
  const form = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, String(value))
  })
  if (imageFile) form.append('imageFile', imageFile)
  const response = await apiPutForm<{ message: string }>(`/promotions/${promotionId}`, form)
  return response.data
}

/**
 * Change promotion status (Admin only)
 * PUT /api/promotions/status/{promotionId}
 */
export const changePromotionStatus = async (promotionId: number): Promise<{ message: string }> => {
  const form = new FormData()
  const response = await apiPutForm<{ message: string }>(`/promotions/status/${promotionId}`, form)
  return response.data
}

/**
 * Delete promotion (alias to change-status to deactivate)
 */
export const deletePromotion = async (promotionId: number): Promise<{ message: string }> => {
  return changePromotionStatus(promotionId)
}

/**
 * Admin filter — returns ALL promotions (active + inactive) by default.
 * Pass isActive=true/false to filter by status.
 * GET /api/promotions/admin-filter
 */
export const adminFilterPromotions = async (params?: {
  name?: string
  discountType?: number
  productId?: number
  categoryId?: number
  brandId?: number
  startDate?: string
  endDate?: string
  isActive?: boolean
}): Promise<ViewPromotionSummaryDto[]> => {
  const queryParams = new URLSearchParams()
  if (params?.name) queryParams.append('name', params.name)
  if (params?.discountType !== undefined) queryParams.append('discountType', String(params.discountType))
  if (params?.productId !== undefined) queryParams.append('productId', String(params.productId))
  if (params?.categoryId !== undefined) queryParams.append('categoryId', String(params.categoryId))
  if (params?.brandId !== undefined) queryParams.append('brandId', String(params.brandId))
  if (params?.startDate) queryParams.append('startDate', params.startDate)
  if (params?.endDate) queryParams.append('endDate', params.endDate)
  if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive))

  const endpoint = `/promotions/admin-filter${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await apiGet<ViewPromotionSummaryDto[]>(endpoint)
  return response.data
}
