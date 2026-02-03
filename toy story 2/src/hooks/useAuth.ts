/**
 * useAuth Hook
 * Custom hook for managing authentication state across the application
 * Provides real-time auth status, user data, and auth actions
 */

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  isAuthenticated, 
  getStoredUser, 
  getUserRole,
  logout as authServiceLogout 
} from '../services/authService'
import type { ViewUserDto } from '../types/AccountDTO'
import { ROUTES } from '../routes/routePaths'

interface UseAuthReturn {
  /** Whether user is currently authenticated */
  isAuthenticated: boolean
  /** Current user data (null if not authenticated) */
  user: ViewUserDto | null
  /** User's role (null if not authenticated) */
  role: string | null
  /** Loading state during auth check */
  isLoading: boolean
  /** Logout function that clears state and redirects to home */
  logout: () => void
  /** Manually refresh user data from localStorage */
  refreshUser: () => void
}

/**
 * Hook to manage authentication state with auto-refresh on storage changes
 * 
 * Features:
 * - Auto-detects authentication status from localStorage
 * - Provides user data and role
 * - Listens for storage changes (e.g., login in another tab)
 * - Provides logout function with navigation
 * 
 * @example
 * ```tsx
 * const { isAuthenticated, user, role, logout } = useAuth()
 * 
 * if (isAuthenticated) {
 *   return <div>Xin chào, {user?.name}</div>
 * }
 * ```
 */
export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState<ViewUserDto | null>(null)
  const [role, setRole] = useState<string | null>(null)

  /**
   * Check and update authentication state
   */
  const checkAuth = useCallback(() => {
    const isAuth = isAuthenticated()
    const userData = getStoredUser()
    const userRole = getUserRole()

    setAuthenticated(isAuth)
    setUser(userData)
    setRole(userRole)
    setIsLoading(false)
  }, [])

  /**
   * Handle logout - clear auth state and redirect to home
   */
  const logout = useCallback(() => {
    authServiceLogout()
    setAuthenticated(false)
    setUser(null)
    setRole(null)
    navigate(ROUTES.HOME)
  }, [navigate])

  /**
   * Manually refresh user data from localStorage
   * Useful after profile updates
   */
  const refreshUser = useCallback(() => {
    checkAuth()
  }, [checkAuth])

  // Initial auth check on mount
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Listen for storage changes (e.g., login/logout in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user' || e.key === 'role') {
        checkAuth()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [checkAuth])

  return {
    isAuthenticated: authenticated,
    user,
    role,
    isLoading,
    logout,
    refreshUser
  }
}
