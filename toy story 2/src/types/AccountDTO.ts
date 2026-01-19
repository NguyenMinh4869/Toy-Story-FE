/**
 * Account DTOs - Generated from Swagger/OpenAPI spec
 * Source: https://toy-story-xwni.onrender.com/swagger/v1/swagger.json
 */

import type { components } from './generated'

/**
 * ViewUserDto - matches backend ViewUserDto exactly
 */
export type ViewUserDto = components['schemas']['ViewUserDto']

/**
 * CreateUserDto - matches backend CreateUserDto
 */
export type CreateUserDto = components['schemas']['CreateUserDto']

/**
 * UpdateUserDto - matches backend UpdateUserDto
 */
export type UpdateUserDto = components['schemas']['UpdateUserDto']

/**
 * ChangePasswordDto - matches backend ChangePasswordDto
 */
export type ChangePasswordDto = components['schemas']['ChangePasswordDto']

/**
 * FilterUserDto - matches backend FilterUserDto
 * Note: Not in Swagger spec, defined manually based on backend DTO
 */
export interface FilterUserDto {
  email?: string
  name?: string
  phoneNumber?: string
  address?: string
  status?: string
}

/**
 * LoginDto - matches backend LoginDto
 */
export type LoginDto = components['schemas']['LoginDto']

/**
 * LoginResponse - matches backend login response
 * Note: This is not in Swagger, but matches the actual API response
 */
export interface LoginResponse {
  token: string
  role: string
  message: string
}

