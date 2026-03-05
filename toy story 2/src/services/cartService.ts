import { apiGet, apiPost, apiDelete } from './apiClient'

/**
 * Add item to server-side cart
 * POST /api/cart/items?productId={id}&quantity={qty}
 */
export const addToCartServer = async (productId: number, quantity: number): Promise<void> => {
    await apiPost(`/accounts/carts/items?productId=${productId}&quantity=${quantity}`, {})
}

/**
 * Clear server-side cart
 * DELETE /api/cart
 */
export const clearCartServer = async (): Promise<void> => {
    await apiDelete('/accounts/carts')
}

/**
 * Get server-side cart
 * GET /api/cart
 */
export const getCartServer = async (): Promise<any> => {
    const response = await apiGet('/accounts/carts')
    return response.data
}
