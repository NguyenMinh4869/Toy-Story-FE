import { ViewTransSummaryDto, TransferFilterDto, ViewTransDetailDto, CreateTransferDto } from "@/types/TransferDTO"
import { apiGet, apiPost, apiPut } from "./apiClient"

/**
 * Get all transfers
 * GET /api/transfers
 */
export const getAllTransfers = async (): Promise<ViewTransSummaryDto[] | null> => {
    try {
        const response = await apiGet<ViewTransSummaryDto[]>('/transfers', undefined, true)
        return response.data
    } catch (error: any) {
        console.error("Error fetching transfers:", error)
        return null
    }
}

export const getPendingTransfers = async (): Promise<ViewTransSummaryDto[] | null> => {
    try {
        const response = await apiGet<ViewTransSummaryDto[]>('/transfers/pending', undefined, true)
        return response.data
    } catch (error: any) {
        console.error("Error fetching transfers:", error)
        return null
    }
}

const buildQueryString = (params: Record<string, any>): string => {
    const query = Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== null)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&")
    return query ? `?${query}` : ""
}

/**
 * Get filtered transfers
 * GET /api/transfers/filter?warehouseId=...&status=...&type=...
 */
export const getFilteredTransfers = async (
    filter: TransferFilterDto
): Promise<ViewTransSummaryDto[] | null> => {
    try {
        const queryString = buildQueryString(filter)
        const response = await apiGet<ViewTransSummaryDto[]>(`/transfers/filter${queryString}`)
        return response.data
    } catch (error: any) {
        console.error("Error filtering transfers:", error)
        return null
    }
}

/**
 * Get transfer by ID
 * GET /api/transfers/{transferId}
 */
export const getTransferById = async (
    transferId: number
): Promise<ViewTransDetailDto | null> => {
    try {
        const response = await apiGet<ViewTransDetailDto>(`/transfers/${transferId}`, undefined, true)
        return response.data
    } catch (error: any) {
        console.error("Error fetching transfer:", error)
        return null
    }
}

/**
 * Create a new transfer
 * POST /api/transfers
 */
export const createTransfer = async (
    dto: CreateTransferDto
): Promise<{ message: string } | null> => {
    try {
        const response = await apiPost<{ message: string }>('/transfers', dto, undefined)
        return response.data
    } catch (error: any) {
        console.error("Error creating transfer:", error)
        return null
    }
}

/**
 * Accept transfer request
 * PUT /api/transfers/accept/{transferId}
 */
export const acceptTransfer = async (
    transferId: number
): Promise<{ message: string } | null> => {
    try {
        const response = await apiPut<{ message: string }>(`/transfers/accept/${transferId}`, undefined)
        return response.data
    } catch (error: any) {
        console.error("Error accepting transfer:", error)
        return null
    }
}

/**
 * Complete transfer request
 * PUT /api/transfers/complete/{transferId}
 */
export const completeTransfer = async (
    transferId: number
): Promise<{ message: string } | null> => {
    try {
        const response = await apiPut<{ message: string }>(`/transfers/complete/${transferId}`, undefined)
        return response.data
    } catch (error: any) {
        console.error("Error completing transfer:", error)
        return null
    }
}

/**
 * Reject transfer request
 * PUT /api/transfers/reject/{transferId}
 */
export const rejectTransfer = async (
    transferId: number
): Promise<{ message: string } | null> => {
    try {
        const response = await apiPut<{ message: string }>(`/transfers/reject/${transferId}`, undefined)
        return response.data
    } catch (error: any) {
        console.error("Error rejecting transfer:", error)
        return null
    }
}
