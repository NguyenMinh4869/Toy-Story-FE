/**
 * Category Service
 * API service for category-related operations matching .NET backend
 */

import { apiGet } from './apiClient'
import type { ViewCategoryDto } from '../types/CategoryDTO'

/**
 * Get all categories (public endpoint)
 */
export const getCategories = async (): Promise<ViewCategoryDto[]> => {
  const response = await apiGet<ViewCategoryDto[]>('/category')
  return response.data
}

/**
 * Get category by ID (public endpoint)
 */
export const getCategoryById = async (categoryId: number): Promise<ViewCategoryDto> => {
  const response = await apiGet<ViewCategoryDto>(`/category/${categoryId}`)
  return response.data
}

