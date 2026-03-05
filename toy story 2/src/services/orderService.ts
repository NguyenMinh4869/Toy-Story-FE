import { apiGet } from './apiClient'

/**
 * Service for handling Order-related API operations
 */

export const getOrders = async (): Promise<any[]> => {
    const response = await apiGet<any[]>('/accounts/orders')
    return response.data
}

export const getOrderById = async (orderId: number): Promise<any> => {
    const response = await apiGet<any>(`/order/${orderId}`)
    return response.data
}
