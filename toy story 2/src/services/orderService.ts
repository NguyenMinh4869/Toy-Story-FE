import { apiGet, apiPut } from './apiClient'
import type { OrderDetailDto, ViewOrderDto } from '../types/OrderDTO'

export interface ApiResponse {
    message: string;
}


export const getOrders = async (): Promise<ViewOrderDto[]> => {
    const response = await apiGet<ViewOrderDto[]>('/orders')
    return response.data
}

export const getWarehouseOrders = async (): Promise<ViewOrderDto[]> => {
    const response = await apiGet<ViewOrderDto[]>('/orders/warehouse')
    return response.data
}

export const getAccountOrders = async (): Promise<ViewOrderDto[]> => {
    const response = await apiGet<ViewOrderDto[]>('/accounts/orders')
    return response.data
}

export const getOrderById = async (orderId: number): Promise<OrderDetailDto> => {
    const response = await apiGet<OrderDetailDto>(`/orders/${orderId}`)
    return response.data
}

export const assignWarehouse = async (
    orderId: number,
    warehouseId: number
): Promise<ApiResponse> => {
    const response = await apiPut<ApiResponse>(`/orders/assign-warehouse/${orderId}?warehouseId=${warehouseId}`);
    return response.data;
};

export const updateOrderStatus = async (
    orderId: number
): Promise<ApiResponse> => {
    const response = await apiPut<ApiResponse>(`/orders/status/${orderId}`);
    return response.data;
};
