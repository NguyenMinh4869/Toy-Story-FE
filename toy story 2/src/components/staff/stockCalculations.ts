// utils/stockCalculations.ts
import { ProductStockDto } from '../../services/warehouseService';

export function calculateStockStats(products: ProductStockDto[]) {
    const totalQuantity = products.reduce((sum, product) => sum + (product.quantity || 0), 0);

    let lowStock = 0;
    let outOfStock = 0;

    products.forEach((product) => {
        const quantity = product.quantity || 0;
        if (quantity === 0) {
            outOfStock++;
        } else if (quantity <= 10) {
            lowStock++;
        }
    });

    const recentProducts = [...products]
        .sort((a, b) => (a.quantity || 0) - (b.quantity || 0))
        .slice(0, 5);

    return {
        totalQuantity,
        lowStock,
        outOfStock,
        recentProducts
    };
}
