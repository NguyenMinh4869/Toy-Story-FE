export interface OrderEventDto {
    id: number;
    orderId: number;
    warehouseId?: number;
    warehouseName?: string;
    eventType: string;
    payload?: any;   // Deserialized payload
    createdAt: Date;
}

export interface StockEventDto {
    id: number;
    productId: number;
    productName?: string;
    warehouseId?: number;
    warehouseName?: string;
    quantityChanged: number;
    oldQuantity: number;
    newQuantity: number;
    eventType: string;
    referenceId?: string;
    payload?: any;   // Deserialized payload
    createdAt: Date;
}

export interface EventFilterDto {
    warehouseId?: number;
    startDate?: string;
    endDate?: string;
}