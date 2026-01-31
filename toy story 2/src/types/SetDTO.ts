import type { components } from './generated'

export type ViewSetDetailDto = components['schemas']['ViewSetDetailDto']
export type ViewSetProductDto = components['schemas']['ViewSetProductDto']
export type CreateSetProductDto = components['schemas']['CreateSetProductDto']
export type CreateSetResponseDto = components['schemas']['CreateSetResponseDto']

export interface CreateSetDto {
  Name?: string
  Description: string
  DiscountPercent: number
}

export interface UpdateSetDto {
  Name?: string
  Description?: string
  DiscountPercent?: number
}
