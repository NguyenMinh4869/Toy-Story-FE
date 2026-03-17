import { apiGet } from './apiClient'
import type { ViewOrderDto } from '../types/OrderDTO'

/**
 * Service for handling Order-related API operations
 */

export const getOrders = async (): Promise<ViewOrderDto[]> => {
    const response = await apiGet<ViewOrderDto[]>('/accounts/orders')
    return response.data
}

export const getOrderById = async (orderId: number): Promise<ViewOrderDto> => {
    const response = await apiGet<ViewOrderDto>(`/accounts/orders/${orderId}`)
    return response.data
}

export const assignWarehouse = async (orderId: number): Promise<> => {
    const response = await apiPut<>(`/orders/${orderId}`)
    return response.data
}
