/**
 * Auth Service
 * API service for authentication operations
 * Matches AccountController endpoints
 */

import { apiGet, apiPost, apiPut } from './apiClient'
import type { LoginDto, LoginResponse, CreateUserDto, ViewUserDto, UpdateUserDto, ChangePasswordDto, FilterUserDto } from '../types/AccountDTO'

/**
 * Login user
 * POST /api/account/login
 * Automatically fetches user details after successful login
 */
export const login = async (credentials: LoginDto): Promise<LoginResponse & { user?: ViewUserDto }> => {
  const response = await apiPost<LoginResponse>('/account/login', credentials)
  
  // Store token and role in localStorage
  if (response.data.token) {
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('role', response.data.role)
    
    // Fetch user details using /me endpoint
    try {
      const user = await getCurrentUser()
      return {
        ...response.data,
        user
      }
    } catch (error) {
      // If /me fails, still return login response
      console.warn('Failed to fetch user details after login:', error)
      return response.data
    }
  }
  
  return response.data
}

/**
 * Register/Create user
 * POST /api/account
 */
export const register = async (userData: CreateUserDto): Promise<{ message: string }> => {
  const response = await apiPost<{ message: string }>('/account', userData)
  return response.data
}

/**
 * Get user by ID
 * GET /api/account/{accountId}
 * Requires: Authorization
 */
export const getUserById = async (accountId: number): Promise<ViewUserDto> => {
  const response = await apiGet<ViewUserDto>(`/account/${accountId}`)
  return response.data
}

/**
 * Get current user
 * GET /api/account/me
 * Requires: Authorization
 */
export const getCurrentUser = async (): Promise<ViewUserDto> => {
  const response = await apiGet<ViewUserDto>('/account/me')
  
  // Store user data in localStorage
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
    if (response.data.accountId !== undefined) {
    localStorage.setItem('accountId', response.data.accountId.toString())
    }
  }
  
  return response.data
}

/**
 * Update user profile
 * PUT /api/account
 * Requires: Authorization, Member role
 */
export const updateUser = async (userData: UpdateUserDto): Promise<{ message: string }> => {
  const response = await apiPut<{ message: string }>('/account', userData)
  return response.data
}

/**
 * Change password
 * PUT /api/account/change-password
 * Requires: Authorization
 */
export const changePassword = async (passwordData: ChangePasswordDto): Promise<{ message: string }> => {
  const response = await apiPut<{ message: string }>('/account/change-password', passwordData)
  return response.data
}

/**
 * Filter users (Admin only)
 * GET /api/account/filter
 */
export const filterUsers = async (filter: FilterUserDto): Promise<ViewUserDto[]> => {
  const queryParams = new URLSearchParams()
  if (filter.email) queryParams.append('email', filter.email)
  if (filter.name) queryParams.append('name', filter.name)
  if (filter.phoneNumber) queryParams.append('phoneNumber', filter.phoneNumber)
  if (filter.address) queryParams.append('address', filter.address)
  if (filter.status) queryParams.append('status', filter.status)

  const endpoint = `/account/filter${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await apiGet<ViewUserDto[]>(endpoint)
  return response.data
}

/**
 * Logout user
 */
export const logout = (): void => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('user')
  localStorage.removeItem('accountId')
}

/**
 * Get stored user data from localStorage
 */
export const getStoredUser = (): ViewUserDto | null => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      return JSON.parse(userStr) as ViewUserDto
    } catch {
      return null
    }
  }
  return null
}

/**
 * Get stored user metadata (lightweight)
 */
export const getStoredUserMetadata = (): { accountId?: number; role?: string } | null => {
  const accountId = localStorage.getItem('accountId')
  const role = localStorage.getItem('role')
  
  if (!accountId && !role) return null
  
  return {
    accountId: accountId ? parseInt(accountId, 10) : undefined,
    role: role || undefined
  }
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token')
}

/**
 * Get user role from localStorage
 */
export const getUserRole = (): string | null => {
  return localStorage.getItem('role')
}

/**
 * Check if user has specific role
 */
export const hasRole = (role: string): boolean => {
  return getUserRole() === role
}

/**
 * Store account ID after login
 * Call this after successful login and fetching user details
 */
export const storeAccountId = (accountId: number): void => {
  localStorage.setItem('accountId', accountId.toString())
}

