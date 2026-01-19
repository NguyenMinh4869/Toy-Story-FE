/**
 * Product DTOs - Generated from Swagger/OpenAPI spec
 * Source: https://toy-story-xwni.onrender.com/swagger/v1/swagger.json
 */

import type { components } from './generated'

/**
 * ViewProductDto - matches backend ViewProductDto exactly
 */
export type ViewProductDto = components['schemas']['ViewProductDto']

// Alias for backward compatibility
export type ProductDTO = ViewProductDto

// Note: CartItem is now in CartDTO.ts

export interface StoreLocation {
  name: string
  address: string
  phone: string
  stock: number
}
