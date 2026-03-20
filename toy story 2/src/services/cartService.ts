import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'
import type { CartDto } from '../types/CartDTO'
import type { ApiError } from './apiClient'

type LocalCartSyncItem = {
    product: {
        id?: string
        productId?: number
    }
    quantity: number
}

/**
 * Add item to server-side cart
 * POST /api/accounts/carts/items?productId={id}&quantity={qty}
 */
export const addToCartServer = async (
    productId?: number,
    setId?: number,
    quantity: number = 1
): Promise<void> => {
    const params = new URLSearchParams();
    if (productId != null) params.append("productId", String(productId));
    if (setId != null) params.append("setId", String(setId));
    params.append("quantity", String(quantity));

    await apiPost(`/carts?${params.toString()}`, {});
};

export const updateCartServer = async (
    productId?: number,
    setId?: number,
    quantity: number = 1
): Promise<void> => {
    const params = new URLSearchParams();
    if (productId != null) params.append("productId", String(productId));
    if (setId != null) params.append("setId", String(setId));
    params.append("quantity", String(quantity));

    await apiPut(`/carts/items?${params.toString()}`, {});
};

export const removeFromCartServer = async (
    productId?: number,
    setId?: number
): Promise<void> => {
    const params = new URLSearchParams();
    if (productId != null) params.append("productId", String(productId));
    if (setId != null) params.append("setId", String(setId));

    await apiDelete(`/carts/items?${params.toString()}`);
};

/**
 * Clear server-side cart
 * DELETE /api/accounts/carts
 */
export const clearCartServer = async (): Promise<void> => {
    await apiDelete('/carts')
}

/**
 * Get server-side cart
 * GET /api/accounts/carts
 */
export const getCartServer = async (): Promise<CartDto> => {
    const response = await apiGet<CartDto>('/accounts/carts')
    return response.data
}

/**
 * Replace server-side cart with the current local cart contents.
 */
export const syncCartServer = async (items: LocalCartSyncItem[]): Promise<void> => {
    try {
        await clearCartServer()
    } catch (error) {
        const apiError = error as ApiError

        if (apiError.status && apiError.status !== 404 && apiError.status !== 400) {
            throw error
        }
    }

    for (const item of items) {
        const rawProductId = item.product.productId ?? (item.product.id ? Number(item.product.id) : NaN)

        if (!Number.isFinite(rawProductId) || rawProductId <= 0) {
            throw new Error('Không thể đồng bộ giỏ hàng do có sản phẩm không hợp lệ.')
        }

        await addToCartServer(rawProductId, item.quantity)
    }
}
