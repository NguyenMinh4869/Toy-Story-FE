import type { ProductDTO } from '../types/ProductDTO';
import type { ViewPromotionDto } from '../types/PromotionDTO';

export interface PromotionInfo {
  discountValue: number;
  promotionName: string;
  label: string;
  hasPromotion: boolean;
  promotionType: 'api' | 'brand' | 'category' | 'product' | 'none';
}

/**
 * Find the best active promotion for a product based on its ID, category, or brand.
 */
export const findBestPromotion = (
  product: ProductDTO,
  promotions: ViewPromotionDto[]
): PromotionInfo => {
  // If product already has promotion info from API, use it (it's most accurate for name/price)
  if (product.hasPromotion && (product.finalPrice || product.promotionName)) {
    const discountValue = product.price && product.finalPrice 
      ? Math.round((1 - product.finalPrice / product.price) * 100)
      : 0;
    
    return {
      discountValue,
      promotionName: product.promotionName || 'Giảm Giá',
      label: product.promotionName || 'Giảm Giá',
      hasPromotion: true,
      promotionType: 'api'
    };
  }

  if (!promotions || promotions.length === 0) {
    return { discountValue: 0, promotionName: '', label: '', hasPromotion: false, promotionType: 'none' };
  }

  // Fallback: manually match against provided active promotions
  const applicablePromos = promotions.filter(p => {
    if (!p.isActive) return false;
    
    // 1. Direct product target
    if (p.productId && p.productId === product.productId) return true;
    
    // 2. Category target
    if (p.categoryId && p.categoryId === product.categoryId) return true;
    
    // 3. Brand target
    if (p.brandId && p.brandId === product.brandId) return true;
    
    // 4. Global targets (no specific target fields)
    return !p.productId && !p.categoryId && !p.brandId;
  });

  if (applicablePromos.length === 0) {
    return { discountValue: 0, promotionName: '', label: '', hasPromotion: false, promotionType: 'none' };
  }

  // Find the highest percentage discount
  const bestPromo = applicablePromos
    .filter(p => p.discountType === 0) // type 0 is percentage
    .sort((a, b) => (b.discountValue ?? 0) - (a.discountValue ?? 0))[0];

  if (!bestPromo) {
    return { discountValue: 0, promotionName: '', label: '', hasPromotion: false, promotionType: 'none' };
  }

  // Determine the label based on user request:
  // If brandId -> brand name, if categoryId -> category name, else promo name
  let label = bestPromo.name || 'Khuyến Mãi';
  let promotionType: PromotionInfo['promotionType'] = 'product';

  if (bestPromo.brandId) {
    label = product.brandName || label;
    promotionType = 'brand';
  } else if (bestPromo.categoryId) {
    label = product.categoryName || label;
    promotionType = 'category';
  }

  return {
    discountValue: bestPromo.discountValue ?? 0,
    promotionName: bestPromo.name || 'Khuyến Mãi',
    label,
    hasPromotion: true,
    promotionType
  };
};
