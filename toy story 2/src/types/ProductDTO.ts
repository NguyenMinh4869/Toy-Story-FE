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
export type ProductDTO = ViewProductDto & {
  id?: string
  originalPrice?: number
  discount?: number
  images?: string[]
  sku?: string
  manufacturer?: string
  storeName?: string
  storeAddress?: string
  storePhone?: string
  stock?: number
}

// Note: CartItem is now in CartDTO.ts

export interface StoreLocation {
  name: string
  address: string
  phone: string
  stock: number
}

export type GenderTarget = components['schemas']['GenderTarget']
export type AgeRange = components['schemas']['AgeRange']

export interface CreateProductDto {
  Name: string
  Description: string
  Price: number

  Origin: string
  Material?: string
  Gender?: GenderTarget
  AgeRange?: AgeRange
  CategoryId: number
  BrandId: number
}

export interface UpdateProductDto {
  Name?: string
  Description?: string
  Price?: number

  Origin?: string
  Material?: string
  Gender?: GenderTarget
  AgeRange?: AgeRange
  CategoryId?: number
  BrandId?: number
}
