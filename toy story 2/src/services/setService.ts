import { apiGet, apiPostForm, apiPutForm, apiPost, apiDelete, apiPut } from './apiClient'
import type { ViewSetDetailDto, CreateSetDto, UpdateSetDto, CreateSetProductDto, CreateSetResponseDto } from '../types/SetDTO'

export const getSets = async (): Promise<ViewSetDetailDto[]> => {
  const response = await apiGet<ViewSetDetailDto[]>('/Set')
  return response.data
}

export const getSetsCustomerFilter = async (): Promise<ViewSetDetailDto[]> => {
  const response = await apiGet<ViewSetDetailDto[]>('/Set/customer-filter')
  return response.data
}

export const getSetById = async (id: number): Promise<ViewSetDetailDto> => {
  const response = await apiGet<ViewSetDetailDto>(`/Set/${id}`)
  return response.data
}

export const createSet = async (data: CreateSetDto, imageFile?: File): Promise<CreateSetResponseDto> => {
  const form = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, String(value))
  })
  if (imageFile) form.append('imageFile', imageFile)
  const response = await apiPostForm<CreateSetResponseDto>('/Set', form)
  return response.data
}

export const updateSet = async (id: number, data: UpdateSetDto, imageFile?: File): Promise<{ message: string }> => {
  const form = new FormData()
  if (data.Name !== undefined) form.append('Name', String(data.Name))
  if (data.Description !== undefined) form.append('Description', String(data.Description))
  if (data.DiscountPercent !== undefined) form.append('DiscountPercent', String(data.DiscountPercent))
  if (imageFile) form.append('imageFile', imageFile)
  const response = await apiPutForm<{ message: string }>(`/Set/${id}`, form)
  return response.data
}

export const addProductToSet = async (setId: number, payload: CreateSetProductDto): Promise<{ message: string }> => {
  const response = await apiPost<{ message: string }>(`/Set/${setId}`, payload)
  return response.data
}

export const removeProductFromSet = async (setId: number, productId: number): Promise<{ message: string }> => {
  const response = await apiDelete<{ message: string }>(`/Set/${setId}/products/${productId}`)
  return response.data
}

export const updateSetProductQuantity = async (setId: number, productId: number, quantity: number): Promise<{ message: string }> => {
  const response = await apiPut<{ message: string }>(`/Set/${setId}/products/${productId}?quantity=${quantity}`)
  return response.data
}

export const deleteSet = async (id: number): Promise<{ message: string }> => {
  const response = await apiDelete<{ message: string }>(`/Set/${id}`)
  return response.data
}
