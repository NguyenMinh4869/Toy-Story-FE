/**
 * Promotion Service
 * API service for promotion-related operations matching .NET backend
 * 
 * NOTE: PromotionController requires Admin authorization.
 * If you need public access to active promotions, consider adding a public endpoint
 * like [HttpGet("active")] in your PromotionController.
 */

import { apiGet } from './apiClient'
import type { ViewPromotionDto, ViewPromotionSummaryDto } from '../types/PromotionDTO'

/**
 * Get all promotions (Admin only - requires authentication)
 */
export const getPromotions = async (): Promise<ViewPromotionSummaryDto[]> => {
  const response = await apiGet<ViewPromotionSummaryDto[]>('/promotion')
  return response.data
}

/**
 * Get promotion by ID (Admin only - requires authentication)
 */
export const getPromotionById = async (promotionId: number): Promise<ViewPromotionDto> => {
  const response = await apiGet<ViewPromotionDto>(`/promotion/${promotionId}`)
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

