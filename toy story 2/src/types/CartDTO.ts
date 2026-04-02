/**
 * Cart DTOs
 */

export interface SetSubItemDto {
    productId: number;
    productName: string;
    quantity: number;
}

export interface CartItemDto {
    cartItemId: number;
    quantity: number;
    unitPrice: number;
    originalUnitPrice: number;
    totalPrice: number;
    originalTotalPrice: number;

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

    // Sub-items for Set type
    subItems?: SetSubItemDto[];
}

export interface CartDto {
    cartId: number;
    accountId: number;
    items: CartItemDto[];
    totalPrice: number;
    originalTotalPrice: number;
    totalItems: number;
}

// Aliases for backward compatibility
export type CartDTO = CartDto;

export type CartItemDTO = CartItemDto;
interface ProductCart {
  productId: number
  name: string
  imageUrl?: string
  price: number
}

interface SetCart {
  setId: number
  name: string
  imageUrl?: string
  price: number
  subItems?: SetSubItemDto[]
}

export type CartProduct = ProductCart | SetCart

export interface CartItem {
  product: CartProduct
  quantity: number
}
