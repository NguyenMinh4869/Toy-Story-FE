/**
 * Request for price calculation
 */
export interface CalculatePriceItem {
    productId?: number
    setId?: number
    quantity: number
}

export interface CalculatePriceRequest {
    items: CalculatePriceItem[]
    voucherCode?: string
}

/**
 * Response from price calculation
 */
export interface CalculatePriceResponse {
    subtotal: number
    discount: number
    total: number
    message: string
}

/**
 * Response from checkout
 */
export interface CheckoutResponse {
    message: string;
    checkout: {
        orderId: number;
        invoiceId: number;
        totalAmount: number;
        status: string;
    }
}

/**
 * Request for payment creation
 */
export interface CreatePaymentRequest {
    invoiceId: number
}

/**
 * Response from payment creation (PayOS link)
 */
export interface CreatePaymentResponse {
    message: string;
    data: {
        paymentUrl: string;
        qrCode: string;
        orderCode: number;
        status: string;
        invoiceId: number;
        amount: number;
    }
}
/**
 * Request for voucher validation
 */
export interface ValidateVoucherRequest {
    voucherCode: string
}

/**
 * Response from voucher validation
 */
export interface ValidateVoucherResponse {
    discounts: {
        name: string
    }[]
    totalDiscount: number
    finalAmount: number
}


// types/CheckoutDTO.ts
export interface DiscountDetailDto {
    id: number;
    name: string;
    code?: string;
    amount: number;
    type: "Promotion" | "Voucher";
    description?: string;
}

export interface CheckoutSummaryDto {
    originalTotal: number;
    subTotal?: number;
    totalDiscount: number;
    finalAmount: number;
    discounts: DiscountDetailDto[];
}

export interface CalculatePriceRequest {
    items: CalculatePriceItem[];
    voucherCode?: string;
}

export interface CalculatePriceResponse {
    message: string;
    summary: CheckoutSummaryDto;
}

export interface ValidateVoucherResponse {
    message: string;
    summary: CheckoutSummaryDto;
}

export interface CheckoutResponse {
    message: string;
    checkout: {
        orderId: number;
        invoiceId: number;
        totalAmount: number;
        status: string;
    };
}

export interface CreatePaymentResponse {
    paymentUrl: string;
    qrCode: string;
    orderCode: number;
    status: string;
    invoiceId: number;
    amount: number;
}

export interface VoucherData {
    id: number;
    name: string;
    code: string;
    discountAmount: number;
    discountType: string;
}

export interface PromotionData {
    id: number;
    name: string;
    description: string;
    discountAmount: number;
    discountType: string;
}