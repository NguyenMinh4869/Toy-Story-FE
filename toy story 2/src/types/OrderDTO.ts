/**
 * Order DTOs
 */

export interface ViewOrderDto {
    orderId: number;
    orderDate: string;
    status: string;
    cancelledAt?: string | null;
    totalAmount: number;
    accountId: number;
    accountName: string;
}
