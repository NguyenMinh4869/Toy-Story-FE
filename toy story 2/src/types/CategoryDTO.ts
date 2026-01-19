/**
 * Category DTOs - Generated from Swagger/OpenAPI spec
 * Source: https://toy-story-xwni.onrender.com/swagger/v1/swagger.json
 */

import type { components } from './generated'

/**
 * ViewCategoryDto - matches backend ViewCateogoryDto exactly
 * Note: Backend has typo "ViewCateogoryDto" (missing 't'), keeping it as-is
 */
export type ViewCategoryDto = components['schemas']['ViewCateogoryDto']

// Alias for backward compatibility
export type CategoryDTO = ViewCategoryDto
