/**
 * Staff Dashboard Page
 * Displays overview statistics for staff warehouse
 */
import React, { useEffect, useState } from 'react';
import { Package, AlertTriangle, Tag, Layers, Percent } from 'lucide-react'; // kept for type safety; removed from JSX
import { getWarehouseProductsWithDetails } from '../../services/warehouseService';
import { getStoredUserMetadata } from '../../services/authService';
import { getCurrentStaffWarehouseId } from '../../services/staffService';
import { filterBrands } from '../../services/brandService';
import { getSetsCustomerFilter } from '../../services/setService';
import { getPromotionsCustomerFilter } from '../../services/promotionService';
import { getPendingTransfers } from '../../services/transferService';
import { getPending } from '../../services/orderService';
import { TransferStatus } from '../../types/TransferDTO';
import ChartGrid from '@/components/staff/ChartGrid';
import StaffAlertBar from '@/components/staff/StaffAlertBar';
import { calculateStockStats } from '@/components/staff/stockCalculations';

const StaffDashboardPage: React.FC = () => {
  const [totalStock, setTotalStock] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [totalBrands, setTotalBrands] = useState(0);
  const [totalSets, setTotalSets] = useState(0);
  const [activePromotions, setActivePromotions] = useState(0);
  const [pendingTransfersCount, setPendingTransfersCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeStaffContext();
  }, []);

  const initializeStaffContext = async () => {
    try {
      setLoading(true);

      const metadata = getStoredUserMetadata();
      if (!metadata?.accountId) {
        setError('Không tìm thấy tài khoản. Vui lòng đăng nhập lại.');
        return;
      }

      const staffWarehouseId = await getCurrentStaffWarehouseId(metadata.accountId);

      const [products, brands, sets, promotions, transfers, pendingOrds] = await Promise.all([
        getWarehouseProductsWithDetails(staffWarehouseId),
        filterBrands({}),
        getSetsCustomerFilter(),
        getPromotionsCustomerFilter(),
        getPendingTransfers(),
        getPending(),
      ]);

      // Use helper function for calculations
      const { totalQuantity, lowStock, outOfStock } = calculateStockStats(products);

      setTotalStock(totalQuantity);
      setLowStockCount(lowStock);
      setOutOfStockCount(outOfStock);

      setTotalBrands(brands.length);
      setTotalSets(sets.length);
      setActivePromotions(promotions.filter(p => p.isActive).length);

      setPendingTransfersCount(
        (transfers ?? []).filter(t => t.status === TransferStatus.Pending).length
      );
      setPendingOrdersCount((pendingOrds ?? []).length);

    } catch (error) {
      console.error('Failed to initialize staff context:', error);
      setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Zone 1 — Alert bar */}
      <StaffAlertBar
        pendingOrdersCount={pendingOrdersCount}
        lowStockCount={lowStockCount}
        pendingTransfersCount={pendingTransfersCount}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Zones 2–4 */}
      <ChartGrid
        totalStock={totalStock}
        lowStockCount={lowStockCount}
        outOfStockCount={outOfStockCount}
        totalBrands={totalBrands}
        totalSets={totalSets}
        activePromotions={activePromotions}
        loading={loading}
      />
    </div>
  );
};

export default StaffDashboardPage;
