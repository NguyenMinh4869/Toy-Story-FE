import { apiGet } from "./apiClient"
import { OrderEventDto, StockEventDto } from "@/types/EventDto"
/**
 * Get all order events
 * GET /api/eventstore/order
 */
export const getAllOrderEvents = async (): Promise<OrderEventDto[] | null> => {
    try {
        const response = await apiGet<OrderEventDto[]>('/eventstore/order', undefined, true)
        return response.data
    } catch (error: any) {
        return null
    }
}

/**
 * Get order events by orderId
 * GET /api/eventstore/order/{orderId}
 */
export const getOrderEventsByOrderId = async (orderId: number): Promise<OrderEventDto[] | null> => {
    try {
        const response = await apiGet<OrderEventDto[]>(`/eventstore/order/${orderId}`, undefined, true)
        return response.data
    } catch (error: any) {
        return null
    }
}

/**
 * Get order events by warehouseId
 * GET /api/eventstore/order/warehouse/{warehouseId}
 */
export const getOrderEventsByWarehouseId = async (warehouseId: number): Promise<OrderEventDto[] | null> => {
    try {
        const response = await apiGet<OrderEventDto[]>(`/eventstore/order/warehouse/${warehouseId}`, undefined, true)
        return response.data
    } catch (error: any) {
        return null
    }
}

/**
 * Get stock events by productId
 * GET /api/eventstore/stock/product/{productId}
 */
export const getStockEventsByProductId = async (productId: number): Promise<StockEventDto[] | null> => {
    try {
        const response = await apiGet<StockEventDto[]>(`/eventstore/stock/product/${productId}`, undefined, true)
        return response.data
    } catch (error: any) {
        return null
    }
}

/**
 * Get stock events by warehouseId
 * GET /api/eventstore/stock/warehouse/{warehouseId}
 */
export const getStockEventsByWarehouseId = async (warehouseId: number): Promise<StockEventDto[] | null> => {
    try {
        const response = await apiGet<StockEventDto[]>(`/eventstore/stock/warehouse/${warehouseId}`, undefined, true)
        return response.data
    } catch (error: any) {
        return null
    }
}
