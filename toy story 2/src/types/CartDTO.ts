/**
 * Cart DTOs
 */

export interface CartItemDto {
    cartItemId: number;
    productId: number;
    productName: string;
    imageUrl: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
}

export interface CartDto {
    cartId: number;
    accountId: number;
    items: CartItemDto[];
    totalPrice: number;
    totalItems: number;
}

// Aliases for backward compatibility
export type CartDTO = CartDto;
export type CartItemDTO = CartItemDto;
