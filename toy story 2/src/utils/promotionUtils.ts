import type { ProductDTO } from '../types/ProductDTO';
import type { ViewPromotionDto } from '../types/PromotionDTO';

export interface PromotionInfo {
  discountValue: number;
  discountType: number; // 0 for Percentage, 1 for Fixed Amount
  reductionAmount: number;
  promotionName: string;
  label: string;
  hasPromotion: boolean;
  promotionType: 'product' | 'category' | 'brand' | 'api' | 'none';
  promotionId?: number;
}

/**
 * Find the best applicable promotion for a product from a list of promotions.
 * 
 * Logic:
 * 1. Filter promotions that actually apply to the product (Matching ID or Global).
 * 2. Calculate the absolute reduction amount for each.
 * 3. Return the one with the highest reduction.
 * 4. Fallback to product's pre-calculated promotion data if no matches found.
 */
export const findBestPromotion = (
  product: ProductDTO,
  promotions: ViewPromotionDto[]
): PromotionInfo => {
  const currentPrice = product.price ?? 0;

  // 1. Filter all promotions that ACTUALLY apply to this product
  const applicable = (promotions || []).filter(p => {
    if (!p.isActive) return false;
    
    // Normalize target IDs (treat 0, null, undefined as "no target")
    const pProdId = Number(p.productId || 0);
    const pCatId = Number(p.categoryId || 0);
    const pBrandId = Number(p.brandId || 0);
    
    const prodId = Number(product.productId || 0);
    const catId = Number(product.categoryId || 0);
    const brandId = Number(product.brandId || 0);

    // DISQUALIFICATION STRATEGY:
    // If a promotion has a specific target (ID > 0), the product MUST match that target.
    // If it doesn't match, the promotion is disqualified for this product.
    
    // 1. Check Product target
    if (pProdId > 0 && pProdId !== prodId) return false;
    
    // 2. Check Brand target
    if (pBrandId > 0 && pBrandId !== brandId) return false;
    
    // 3. Check Category target
    if (pCatId > 0 && pCatId !== catId) return false;

    // If no targets disqualified the promotion, it is applicable (Global or Matching Target)
    return true;
  });

  // 2. Calculate the reduction for each applicable promotion
  const calculatedPromos = applicable.map(p => {
    let reduction = 0;
    const value = p.discountValue ?? 0;
    if (p.discountType === 0) { // Percentage
      reduction = (Math.min(100, value) / 100) * currentPrice;
    } else { // Fixed Amount
      reduction = Math.min(currentPrice, value);
    }
    return { promo: p, reduction };
  });

  // 3. Find the one with the highest reduction (the best deal)
  let best = calculatedPromos.reduce((prev, curr) => 
    (curr.reduction > prev.reduction) ? curr : prev, 
    { promo: null as ViewPromotionDto | null, reduction: -1 }
  );

  // 4. If no applicable promotion found in the list, fall back to backend data
  if (!best.promo || best.reduction <= 0) {
    if (product.hasPromotion && (product.finalPrice || product.promotionName)) {
      const reductionFromApi = currentPrice && product.finalPrice 
        ? Math.max(0, currentPrice - product.finalPrice)
        : 0;
      const discountValue = currentPrice && reductionFromApi > 0
        ? Math.round((reductionFromApi / currentPrice) * 100)
        : 0;
      
      return {
        discountValue,
        discountType: 0,
        reductionAmount: reductionFromApi,
        promotionName: product.promotionName || 'Khuyến Mãi',
        label: product.promotionName || 'Khuyến Mãi',
        hasPromotion: true,
        promotionType: 'api'
      };
    }
    return { discountValue: 0, discountType: 0, reductionAmount: 0, promotionName: '', label: '', hasPromotion: false, promotionType: 'none' };
  }

  // 5. Return the best applicable promotion found
  const bestPromo = best.promo;
  let label = bestPromo.name || 'Khuyến Mãi';
  let promotionType: PromotionInfo['promotionType'] = 'product';

  if (Number(bestPromo.brandId) > 0) {
    label = product.brandName || label;
    promotionType = 'brand';
  } else if (Number(bestPromo.categoryId) > 0) {
    label = product.categoryName || label;
    promotionType = 'category';
  }

  return {
    discountValue: bestPromo.discountType === 0 
      ? Math.min(100, bestPromo.discountValue ?? 0) 
      : (bestPromo.discountValue ?? 0),
    discountType: bestPromo.discountType ?? 0,
    reductionAmount: best.reduction,
    promotionName: bestPromo.name || 'Khuyến Mãi',
    label,
    hasPromotion: true,
    promotionType,
    promotionId: bestPromo.promotionId
  };
};
