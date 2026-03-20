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
    warehouseId?: number | null;
    manuallyAssign: boolean;
    warehouseName?: string | null;
}


export interface OrderItemDto {
  orderItemId: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  imageUrl?: string | null;
}

export interface ViewInvoiceDto {
  invoiceId: number;
  orderId: number;
  issuedAt: string;        // DateTime → string
  amountDue: number;
  amountPaid?: number | null;
  paidAt?: string | null;
  dueDate?: string | null;
  status: string;
  orderCode?: number | null;
}

export interface OrderDetailDto {
  orderId: number;
  orderDate: string; // DateTime → string in TS
  status: string;
  cancelledAt?: string | null;
  totalAmount: number;
  accountId: number;
  accountName: string;
  phoneNumber: string;
  warehouseId?: number | null;
  warehouseName?: string | null;
  address?: string | null;
  provinceCode?: number | null;
  districtCode?: number | null;
  wardCode?: number | null;
  items: OrderItemDto[];
  invoice?: ViewInvoiceDto | null;
}
