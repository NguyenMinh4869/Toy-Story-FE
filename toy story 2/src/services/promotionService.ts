/**
 * Promotion Service
 * API service for promotion-related operations matching .NET backend
 * 
 * NOTE: PromotionController requires Admin authorization.
 * If you need public access to active promotions, consider adding a public endpoint
 * like [HttpGet("active")] in your PromotionController.
 */

import { apiGet, apiPostForm, apiPutForm } from './apiClient'
import type { ViewPromotionDto, ViewPromotionSummaryDto } from '../types/PromotionDTO'
import type { CreatePromotionDto, UpdatePromotionDto } from '../types/PromotionDTO'

/**
 * Get all promotions (Admin only - requires authentication)
 */
export const getPromotions = async (): Promise<ViewPromotionSummaryDto[]> => {
  const response = await apiGet<ViewPromotionSummaryDto[]>('/Promotion')
  return response.data
}

/**
 * Get promotions using customer-filter endpoint (no auth required)
 * Use this for staff/public access
 */
export const getPromotionsCustomerFilter = async (): Promise<ViewPromotionSummaryDto[]> => {
  const response = await apiGet<ViewPromotionSummaryDto[]>('/Promotion/customer-filter')
  return response.data
}

/**
 * Get promotion by ID (Admin only - requires authentication)
 */
export const getPromotionById = async (promotionId: number): Promise<ViewPromotionDto> => {
  const response = await apiGet<ViewPromotionDto>(`/Promotion/${promotionId}`)
  return response.data
}

/**
 * Get active promotions (Admin only - requires authentication)
 * 
 * NOTE: This filters client-side. For better performance, consider adding
 * a public endpoint in your backend like:
 * [HttpGet("active")]
 * public async Task<ActionResult<List<ViewPromotionSummaryDto>>> GetActivePromotionsAsync()
 */
export const getActivePromotions = async (): Promise<ViewPromotionSummaryDto[]> => {
  const allPromotions = await getPromotions()
  return allPromotions.filter(p => p.isActive)
}

/**
 * Create promotion (Admin only)
 * POST /api/promotion
 */
export const createPromotion = async (data: CreatePromotionDto, imageFile?: File): Promise<{ message: string }> => {
  const form = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, String(value))
  })
  if (imageFile) form.append('imageFile', imageFile)
  const response = await apiPostForm<{ message: string }>('/Promotion', form)
  return response.data
}

/**
 * Update promotion (Admin only)
 * PUT /api/promotion/{promotionId}
 */
export const updatePromotion = async (promotionId: number, data: UpdatePromotionDto, imageFile?: File): Promise<{ message: string }> => {
  const form = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, String(value))
  })
  if (imageFile) form.append('imageFile', imageFile)
  const response = await apiPutForm<{ message: string }>(`/Promotion/${promotionId}`, form)
  return response.data
}

/**
 * Change promotion status (Admin only)
 * PUT /api/promotion/change-status/{promotionId}
 */
export const changePromotionStatus = async (promotionId: number): Promise<{ message: string }> => {
  const form = new FormData()
  const response = await apiPutForm<{ message: string }>(`/Promotion/change-status/${promotionId}`, form)
  return response.data
}

/**
 * Delete promotion (alias to change-status to deactivate)
 * Backend does not expose delete, so we toggle status
 */
export const deletePromotion = async (promotionId: number): Promise<{ message: string }> => {
  return changePromotionStatus(promotionId)
}

