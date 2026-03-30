export enum TransferStatus {
    Pending = 0,     // Đang chờ xác nhận
    Accepted = 1,    // Đã xác nhận
    Completed = 2,   // Đã hoàn thành
    Rejected = 3     // Bị từ chối
}

export enum TransferType {
    TransferOut = 0, // Chuyển hàng
    TransferIn = 1   // Nhận hàng
}

export interface ViewTransSummaryDto {
    transferId: number;
    sourceWarehouseName?: string;
    destinationWarehouseName?: string;
    status: TransferStatus;
    type: TransferType;
    createdAt: string;
    acceptedAt?: string;
    completedAt?: string;
    rejectedAt?: string;
}

export interface ViewTransDetailDto {
    transferId: number;
    sourceWarehouseId: number;
    sourceWarehouseName?: string;
    destinationWarehouseId: number;
    destinationWarehouseName?: string;
    status: TransferStatus;
    type: TransferType;
    createdByStaffId: number;
    createdByStafName?: string;
    acceptedByStaffId?: number;
    acceptedByStaffName?: string;
    createdAt: Date;
    completedAt?: Date;
    rejectedAt?: Date;
    acceptedAt?: Date;
    transferItems: ViewTransferItemDto[];
}

export interface ViewTransferItemDto {
    productId: number;
    name?: string;
    imageUrl?: string;
    quantity: number;
}

export interface CreateTransferDto {
    warehouseId?: number;
    type: TransferType;
    transferItems: CreateTransferItemDto[];
}

export interface CreateTransferItemDto {
    productId: number;
    quantity: number;
}

export const TransferStatusLabels: Record<TransferStatus, string> = {
    [TransferStatus.Pending]: "Đang chờ xác nhận",
    [TransferStatus.Accepted]: "Đã xác nhận",
    [TransferStatus.Completed]: "Đã hoàn thành",
    [TransferStatus.Rejected]: "Bị từ chối"
};

export const TransferTypeLabels: Record<TransferType, string> = {
    [TransferType.TransferOut]: "Chuyển hàng",
    [TransferType.TransferIn]: "Nhận hàng"
};

export interface TransferFilterDto {
    warehouseId?: number;
    status?: TransferStatus;
    type?: TransferType;
}