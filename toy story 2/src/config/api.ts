/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

const baseURL = import.meta.env.VITE_API_BASE_URL

if (!baseURL) {
  throw new Error(
    'VITE_API_BASE_URL is not defined. ' +
    'Check your .env file and restart Vite.'
  )
}

if (!baseURL.startsWith('https://')) {
  throw new Error(`Invalid VITE_API_BASE_URL: ${baseURL}`)
}

export const API_CONFIG = {
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
} as const

export const getApiUrl = (endpoint: string): string => {
  const baseUrl = API_CONFIG.baseURL.replace(/\/$/, '')
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${baseUrl}${path}`
}

