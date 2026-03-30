/**
 * Auth Service
 * API service for authentication operations
 * Matches AccountController endpoints
 */

import { apiGet, apiPost, apiPut } from './apiClient'
import type { LoginDto, LoginResponse, CreateUserDto, ViewUserDto, UpdateUserDto, ChangePasswordDto, FilterUserDto } from '../types/AccountDTO'
import { UserRole } from '../types/AccountDTO'

/**
 * Helper to normalize role to string
 */
const normalizeRole = (role: string | number | UserRole): string => {
  if (typeof role === 'string') {
    const r = role.trim()
    if (r.toLowerCase() === 'admin' || r === 'Quản trị viên') return 'Admin'
    if (r.toLowerCase() === 'staff' || r === 'Nhân viên') return 'Staff'
    if (r.toLowerCase() === 'member' || r.toLowerCase() === 'customer' || r === 'Người dùng' || r === 'Khách hàng') return 'Member'
    return r
  }

  // Map numeric roles to string names
  // Backend enum: Member=0, Admin=1, Staff=2
  switch (role) {
    case UserRole.Member:
    case 0:
      return 'Member'
    case UserRole.Admin:
    case 1:
      return 'Admin'
    case UserRole.Staff:
    case 2:
      return 'Staff'
    default:
      return String(role)
  }
}

/**
 * Simple JWT decoder to extract claims without external library
 */
const decodeJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.warn('Failed to decode JWT:', error)
    return null
  }
}

/**
 * Login user
 * POST /api/auth/login
 * Automatically fetches user details after successful login
 */
export const login = async (credentials: LoginDto): Promise<LoginResponse & { user?: ViewUserDto }> => {
  const response = await apiPost<any>('/auth/login', credentials)

  // Extract token and role from response - handle various backend patterns
  // (Directly in data, or nested in data.data, or PascalCase)
  const rawData = response.data
  const innerData = rawData?.data || rawData

  const token = innerData?.token || innerData?.accessToken || innerData?.Token || innerData?.AccessToken
  const role = innerData?.role || innerData?.Role

  // Store token and role in localStorage
  if (token) {
    localStorage.setItem('token', token)

    // Normalize and store role
    const normalizedRole = normalizeRole(role)
    localStorage.setItem('role', normalizedRole)

    // Decode token to get user name immediately
    const decoded = decodeJwt(token)
    const displayName = decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || normalizedRole

    // Fetch user details using /auth/me endpoint
    try {
      const user = await getCurrentUser()
      return {
        ...innerData,
        token,
        role: normalizedRole,
        user
      }
    } catch (error) {
      // If /me fails, create a minimal user object so UI still shows authenticated state
      console.warn('Failed to fetch user details after login, using token data:', error)

      const minimalUser: ViewUserDto = {
        accountId: decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
          ? parseInt(decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'], 10)
          : 0,
        email: decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || credentials.email,
        warehouseId: decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/warehouseId'],
        name: displayName,
        role: normalizedRole as any,
        status: 'Active' as any
      }

      localStorage.setItem('user', JSON.stringify(minimalUser))

      return {
        ...innerData,
        token,
        role: normalizedRole,
        user: minimalUser
      }
    }
  }

  return innerData
}

/**
 * Register/Create user
 * POST /api/account
 */
export const register = async (userData: CreateUserDto): Promise<{ message: string }> => {
  const response = await apiPost<{ message: string }>('/auth/signup', userData)
  return response.data
}

/**
 * Get user by ID
 * GET /api/account/{accountId}
 * Requires: Authorization
 */
export const getUserById = async (accountId: number): Promise<ViewUserDto> => {
  const response = await apiGet<ViewUserDto>(`/accounts/${accountId}`)
  return response.data
}

/**
 * Get current user
 * GET /api/account/me
 * Requires: Authorization
 */
export const getCurrentUser = async (): Promise<ViewUserDto> => {
  const response = await apiGet<ViewUserDto>('/accounts/me')

  // Normalize role in user object if present
  if (response.data && response.data.role !== undefined) {
    // We need to cast to any/unknown because ViewUserDto expects string but we might get number
    const rawRole = response.data.role as unknown as string | number
    const normalizedRole = normalizeRole(rawRole)
    // @ts-ignore - We are fixing the type mismatch from backend
    response.data.role = normalizedRole
  }

  // Store user data in localStorage
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
    if (response.data.role) {
      localStorage.setItem('role', normalizeRole(response.data.role as any))
    }
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
  const response = await apiPut<{ message: string }>('/accounts', userData)
  return response.data
}

/**
 * Change password
 * PUT /api/account/change-password
 * Requires: Authorization
 */
export const changePassword = async (passwordData: ChangePasswordDto): Promise<{ message: string }> => {
  const response = await apiPut<{ message: string }>('/accounts/password', passwordData)
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

  const endpoint = `/accounts/filter${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
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
  const role = localStorage.getItem('role')
  if (role && role !== 'undefined' && role !== 'null') return normalizeRole(role)
  
  // Fallback 1: role in stored user object
  const user = getStoredUser()
  if (user?.role) return normalizeRole(user.role as any)
  
  // Fallback 2: Extract from JWT token
  const token = localStorage.getItem('token')
  if (token) {
    const decoded = decodeJwt(token)
    const tokenRole = decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 
                      decoded?.['role'] || 
                      decoded?.['Role']
    if (tokenRole) {
      const normalized = normalizeRole(tokenRole)
      localStorage.setItem('role', normalized) // Heal the storage
      return normalized
    }
  }
  
  return null
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

/**
 * Forgot password — send OTP to email
 * POST /api/auth/forgot-password
 * Always returns 200 (anti-enumeration)
 */
export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await apiPost<{ message: string }>('/auth/forgot-password', { email })
  return response.data
}

/**
 * Reset password with OTP token
 * POST /api/auth/reset-password
 */
export const resetPassword = async (email: string, token: string, newPassword: string): Promise<{ message: string }> => {
  const response = await apiPost<{ message: string }>('/auth/reset-password', { email, token, newPassword })
  return response.data
}

