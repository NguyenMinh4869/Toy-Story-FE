/**
 * Brand Service
 * API service for brand-related operations matching .NET backend
 */

import { apiGet, apiPost, apiPostForm, apiPutForm } from './apiClient'
import type { ViewBrandDto, CreateBrandDto, UpdateBrandDto } from '../types/BrandDTO'

// ── Cascading Reactivation types ──────────────────────────────────────────────

export interface AffectedProductDto {
  productId: number
  name: string
  status: string
}

export interface AffectedPromotionDto {
  promotionId: number
  name: string
  isActive: boolean
}

export interface AffectedSetDto {
  setId: number
  name: string
  status: string
}

export interface BrandActionPreviewDto {
  brandId: number
  brandName: string
  affectedProducts: AffectedProductDto[]
  affectedPromotions: AffectedPromotionDto[]
  affectedSets: AffectedSetDto[]
}

export interface BrandReactivateBulkDto {
  brandId: number
  productIds: number[]
  promotionIds: number[]
  setIds: number[]
}

/**
 * Get active brands (public endpoint)
 */
export const getActiveBrands = async (): Promise<ViewBrandDto[]> => {
  const response = await apiGet<ViewBrandDto[]>('/brands/active-brands')
  return response.data
}


/**
 * Get brand by ID
 */
export const getBrandById = async (brandId: number): Promise<ViewBrandDto> => {
  const response = await apiGet<ViewBrandDto>(`/brands/${brandId}`)
  return response.data
}


/**
 * Filter brands (public endpoint with query parameters)
 */
export const filterBrands = async (params?: {
  name?: string
  status?: 'Active' | 'Inactive' | number
}): Promise<ViewBrandDto[]> => {
  const queryParams = new URLSearchParams()
  if (params?.name) queryParams.append('name', params.name)
  if (params?.status !== undefined) queryParams.append('status', params.status.toString())

  const endpoint = `/brands/filter${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await apiGet<ViewBrandDto[]>(endpoint)
  return response.data
}


/**
 * Create brand (Admin only)
 * POST /api/brand
 * multipart/form-data: Name, imageFile
 */
export const createBrand = async (data: CreateBrandDto, imageFile?: File): Promise<{ message: string }> => {
  const form = new FormData()
  if (data.name) form.append('Name', data.name)
  if (imageFile) form.append('imageFile', imageFile)
  const response = await apiPostForm<{ message: string }>('/brands', form)
  return response.data
}


/**
 * Update brand (Admin only)
 * PUT /api/brand/{brandId}
 * multipart/form-data: Name, imageFile
 */
export const updateBrand = async (brandId: number, data: UpdateBrandDto, imageFile?: File): Promise<{ message: string }> => {
  const form = new FormData()
  if (data.name) form.append('Name', data.name as string)
  if (imageFile) form.append('imageFile', imageFile)
  const response = await apiPutForm<{ message: string }>(`/brands/${brandId}`, form)
  return response.data
}


/**
 * Change brand status (toggle Active/Inactive) (Admin only)
 * PUT /api/brand/change-status/{brandId}
 */
export const changeBrandStatus = async (
  brandId: number
): Promise<{
  success: boolean
  message: string
  affectedProducts: string[]
}> => {
  const form = new FormData()
  const response = await apiPutForm<{
    success: boolean
    message: string
    affectedProducts: string[]
  }>(`/brands/status/${brandId}`, form)
  return response.data
}

// ── Cascading Reactivation Endpoints ─────────────────────────────────────────

/**
 * Get preview of what will be deactivated (Active products + Active promotions)
 * GET /api/brands/{id}/deactivate-preview
 */
export const getDeactivatePreview = async (brandId: number): Promise<BrandActionPreviewDto> => {
  const response = await apiGet<{ statusCode: number; message: string; data: BrandActionPreviewDto }>(
    `/brands/${brandId}/deactivate-preview`
  )
  return response.data.data
}

/**
 * Get preview of what can be selectively reactivated (Inactive products + Inactive promotions)
 * GET /api/brands/{id}/reactivate-preview
 */
export const getReactivatePreview = async (brandId: number): Promise<BrandActionPreviewDto> => {
  const response = await apiGet<{ statusCode: number; message: string; data: BrandActionPreviewDto }>(
    `/brands/${brandId}/reactivate-preview`
  )
  return response.data.data
}

/**
 * Selectively reactivate brand + chosen products + chosen promotions in one transaction
 * POST /api/brands/reactivate-bulk
 */
export const reactivateBulk = async (payload: BrandReactivateBulkDto): Promise<{ statusCode: number; message: string }> => {
  const response = await apiPost<{ statusCode: number; message: string }>('/brands/reactivate-bulk', payload)
  return response.data
}