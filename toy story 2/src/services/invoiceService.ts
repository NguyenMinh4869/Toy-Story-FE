import { apiGet } from './apiClient'

/**
 * Service for handling Invoice-related API operations
 */

export const getAccountInvoices = async (): Promise<any[]> => {
    const response = await apiGet<any[]>('/accounts/invoices')
    return response.data
}

export const getInvoiceById = async (id: number): Promise<any> => {
    const response = await apiGet<any>(`/invoice/${id}`)
    return response.data
}
