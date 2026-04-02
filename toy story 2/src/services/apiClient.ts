/**
 * API Client
 * Centralized HTTP client for making API requests
 */

import { API_CONFIG, getApiUrl } from '../config/api'

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  status?: number
  errors?: Record<string, string[]>
}

// Global toast reference - will be set from your layout/component
let globalToast: ((props: { description: string; variant: "success" | "destructive"; duration: number }) => void) | null = null;

export const setGlobalToast = (toastFn: typeof globalToast) => {
  globalToast = toastFn;
};

const showToast = (message: string, variant: "success" | "destructive" = "success") => {
  if (globalToast) {
    globalToast({
      description: message,
      variant,
      duration: 3000,
    });
  }
};

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0
}

const extractApiErrorMessage = (_status: number, payload: any): string => {
  console.error('RAW API ERROR:', payload)

  // 1. Nested data.message (custom wrapper shape)
  const nestedMessage = payload?.data?.message
  if (isNonEmptyString(nestedMessage)) return nestedMessage

  // 2. .NET ValidationProblemDetails: { errors: { Field: ["msg"] } } — camelCase or PascalCase
  const errors = payload?.errors ?? payload?.Errors
  if (errors && typeof errors === 'object') {
    const flat = (Object.values(errors) as unknown[]).flat().filter(v => typeof v === 'string').join(' | ')
    if (isNonEmptyString(flat)) return flat
  }

  // 3. detail (RFC 7807)
  const detail = payload?.detail ?? payload?.Detail
  if (isNonEmptyString(detail)) return detail

  // 4. title (RFC 7807 / ASP.NET Core ProblemDetails)
  const title = payload?.title ?? payload?.Title
  if (isNonEmptyString(title)) return title

  // 5. Simple message field — camelCase or PascalCase
  const message = payload?.message ?? payload?.Message
  if (isNonEmptyString(message) && message.trim().toLowerCase() !== 'success') return message

  return 'Có lỗi xảy ra, vui lòng thử lại.'
}

const extractSuccessMessage = (payload: any): string | null => {
  const nestedData = payload?.data
  const nestedMessage = nestedData?.message
  const message = payload?.message

  if (isNonEmptyString(nestedMessage)) {
    return nestedMessage
  }

  if (isNonEmptyString(message) && message.trim().toLowerCase() !== 'success') {
    return message
  }

  return null
}

/**
 * Custom fetch wrapper with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  showSuccessToast: boolean = true,
  silent: boolean = false,
  silentError: boolean = false
): Promise<ApiResponse<T>> {
  const url = getApiUrl(endpoint)

  const baseHeaders: Record<string, string> = { ...API_CONFIG.headers }
  // If sending FormData, let the browser set Content-Type with boundary
  if (options.body instanceof FormData) {
    delete baseHeaders['Content-Type']
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...baseHeaders,
      ...options.headers,
      // Add auth token if available
      ...(localStorage.getItem('token') && {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      })
    }
  }

  try {
    const response = await fetch(url, config)

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      if (!response.ok) {
        const errorMsg = 'Có lỗi xảy ra, vui lòng thử lại.'
        if (!silentError && !silent) showToast(errorMsg, "destructive")
        throw { message: errorMsg, status: response.status } as ApiError
      }
      const text = await response.text()
      return { data: text as unknown as T, success: true }
    }

    const data = await response.json()

     if (!response.ok) {
      // Token expired or invalid on a protected endpoint — clear session and redirect
      if (response.status === 401 && !url.includes('/auth/login')) {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('user')
        localStorage.removeItem('accountId')
        window.location.href = '/login'
        throw { message: 'Session expired. Redirecting to login...', status: 401 } as ApiError
      }

    const errorMsg = extractApiErrorMessage(response.status, data)
    if (!silent && !silentError && response.status !== 404) {
      showToast(errorMsg, "destructive")
    }
    const error: ApiError = {
      message: errorMsg,
      status: response.status,
      errors: data.errors || data.data?.errors
    }
    throw error
  }

    // Show success toast if there's a message and we should show it
    if (showSuccessToast) {
      const successMsg = extractSuccessMessage(data)
      if (successMsg) {
        showToast(successMsg, "success")
      }
    }

    return {
      data: data.data || data,
      message: data.message,
      success: true
    }
  } catch (error) {
    // Preserve structured API errors (e.g. { message, status, errors }) thrown above
    if (error && typeof error === 'object' && 'message' in error && 'status' in error) {
      throw error as ApiError
    }

    if (error instanceof Error) {
      const apiError: ApiError = {
        message: error.message,
        status: 0
      }
      if (!silent && !silentError) showToast(apiError.message, "destructive")
      throw apiError
    }

    throw error
  }
}

/**
 * GET request
 */
export const apiGet = <T>(endpoint: string, options?: RequestInit, silent: boolean = false  ): Promise<ApiResponse<T>> => {
  // GET requests usually don't need success toasts (like fetching lists)
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'GET'
  }, false, silent) // Don't show toast for GET requests
}

/**
 * POST request
 */
export const apiPost = <T>(
  endpoint: string,
  body?: unknown,
  options?: RequestInit,
  silentError: boolean = false
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined
  }, true, false, silentError)
}

/**
 * POST multipart/form-data request
 */
export const apiPostForm = <T>(
  endpoint: string,
  formData: FormData,
  options?: RequestInit,
  silentError: boolean = false
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'POST',
    body: formData
  }, true, false, silentError)
}

/**
 * PUT multipart/form-data request
 */
export const apiPutForm = <T>(
  endpoint: string,
  formData: FormData,
  options?: RequestInit,
  silentError: boolean = false
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: formData
  }, true, false, silentError)
}

/**
 * PUT request
 */
export const apiPut = <T>(
  endpoint: string,
  body?: unknown,
  options?: RequestInit
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined
  }, true) // Show toast for PUT
}

/**
 * DELETE request
 */
export const apiDelete = <T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'DELETE'
  }, true) // Show toast for DELETE
}