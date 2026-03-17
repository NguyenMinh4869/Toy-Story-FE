import { apiGet } from './apiClient'
import type { ViewInvoiceDto } from '../types/InvoiceDTO'

/**
 * Service for handling Invoice-related API operations
 */

export const getAccountInvoices = async (): Promise<ViewInvoiceDto[]> => {
    const response = await apiGet<ViewInvoiceDto[]>('/accounts/invoices')
    return response.data
}

export const getInvoiceById = async (id: number): Promise<ViewInvoiceDto> => {
    const response = await apiGet<ViewInvoiceDto>(`/accounts/invoices/${id}`)
    return response.data
}
