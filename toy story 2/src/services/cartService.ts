import { apiGet, apiPost, apiDelete } from './apiClient'
import type { CartDto } from '../types/CartDTO'

/**
 * Add item to server-side cart
 * POST /api/accounts/carts/items?productId={id}&quantity={qty}
 */
export const addToCartServer = async (productId: number, quantity: number): Promise<void> => {
    await apiPost(`/accounts/carts/items?productId=${productId}&quantity=${quantity}`, {})
}

/**
 * Clear server-side cart
 * DELETE /api/accounts/carts
 */
export const clearCartServer = async (): Promise<void> => {
    await apiDelete('/accounts/carts')
}

/**
 * Get server-side cart
 * GET /api/accounts/carts
 */
export const getCartServer = async (): Promise<CartDto> => {
    const response = await apiGet<CartDto>('/accounts/carts')
    return response.data
}
