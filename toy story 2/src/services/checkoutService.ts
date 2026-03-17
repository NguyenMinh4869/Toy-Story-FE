import { apiPost, apiDelete, apiPut } from './apiClient'
import {
    CalculatePriceRequest,
    CalculatePriceResponse,
    CheckoutResponse,
    CreatePaymentResponse,
    ValidateVoucherResponse
} from '../types/CheckoutDTO'

/**
 * Synchronize local cart with server
 */
export const syncCartToServer = async (items: { productId: number; quantity: number }[]): Promise<void> => {
    try {
        await apiDelete('/carts')
    } catch (err) {
        // Cart might already be empty, continue
    }

    // Add items sequentially to avoid race conditions
    for (const item of items) {
        if (item.productId && item.quantity > 0) {
            await apiPut(`/carts/items?productId=${item.productId}&quantity=${item.quantity}`)
        }
    }
}

/**
 * Calculate order price (preview)
 * POST /api/checkout/calculate
 */
export const calculatePrice = async (request: CalculatePriceRequest): Promise<CalculatePriceResponse> => {
    // Note: If this fails with 404, we'll need to use Cart total as fallback
    const response = await apiPost<CalculatePriceResponse>('/checkout/calculate', request)
    return response.data
}

/**
 * Perform checkout
 * POST /api/checkout
 */
export const checkout = async (data: any): Promise<CheckoutResponse> => {
    // Usually checkout takes no body if it uses the server-side cart
    // But passing data includes form + optional voucherCode
    const response = await apiPost<CheckoutResponse>('/checkout', data)
    return response.data
}

/**
 * Validate voucher code
 * POST /api/checkout/validate-voucher
 */
export const validateVoucher = async (voucherCode: string): Promise<ValidateVoucherResponse> => {
    const response = await apiPost<ValidateVoucherResponse>('/checkout/validate-voucher', { voucherCode })
    return response.data
}

/**
 * Create PayOS payment link
 * POST /api/payments/create
 */
export const createPayment = async (invoiceId: number): Promise<CreatePaymentResponse> => {
    const response = await apiPost<CreatePaymentResponse>('/payments/create', { invoiceId })
    return response.data
}
