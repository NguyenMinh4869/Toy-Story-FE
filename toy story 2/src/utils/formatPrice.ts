/**
 * Format price number to Vietnamese currency string
 * @param price - Price as number
 * @returns Formatted price string (e.g., "1.245.300 Đ")
 */
export const formatVND = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price).replace('₫', 'Đ')
}

export const formatPrice = formatVND;

/**
 * Format discount percentage
 * @param discount - Discount as number (e.g., 30 for 30%)
 * @returns Formatted discount string (e.g., "-30%")
 */
export const formatDiscount = (discount: number): string => {
  return `-${discount}%`
}

