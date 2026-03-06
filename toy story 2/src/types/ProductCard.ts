/**
 * ProductCard - Display format for product cards
 * Used in ProductSection component for formatted display
 */
export interface ProductCard {
  id: string
  image: string
  name: string
  price: string // Formatted price string (e.g., "1.245.300 Đ")
  originalPrice: string // Formatted original price string
  discount: string // Formatted discount (e.g., "-30%")
}

