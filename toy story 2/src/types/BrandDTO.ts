/**
 * Brand DTOs - Generated from Swagger/OpenAPI spec
 * Source: https://toy-story-xwni.onrender.com/swagger/v1/swagger.json
 */

import type { components } from './generated'

/**
 * ViewBrandDto - matches backend ViewBrandDto exactly
 */
export type ViewBrandDto = components['schemas']['ViewBrandDto']

/**
 * CreateBrandDto - matches backend CreateBrandDto
 * Note: Not in Swagger spec, manually defined based on backend DTO
 */
export interface CreateBrandDto {
  name: string
}

/**
 * UpdateBrandDto - matches backend UpdateBrandDto
 * Note: Not in Swagger spec, manually defined based on backend DTO
 */
export interface UpdateBrandDto {
  name?: string | null
}

/**
 * FilterBrandDto - matches backend FilterBrandDto
 * Note: Not in Swagger spec, manually defined based on backend DTO
 */
export interface FilterBrandDto {
  name?: string | null
  status?: 'Active' | 'Inactive' | null
}

// Alias for backward compatibility
export type BrandDTO = ViewBrandDto
