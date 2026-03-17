/**
 * Invoice DTOs
 */

export interface ViewInvoiceDto {
    invoiceId: number;
    orderId: number;
    issuedAt: string;
    amountDue: number;
    amountPaid: number;
    paidAt?: string | null;
    dueDate: string;
    status: string;
    orderCode: number;
}
