/**
 * Cart DTOs
 */

export interface CartItemDto {
    cartItemId: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;

    // Product properties
    productId?: number;
    productName?: string;
    productImage?: string;

    // Set properties
    setId?: number;
    setName?: string;
    setImage?: string;

    // Type indicator
    itemType: "product" | "set";
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
