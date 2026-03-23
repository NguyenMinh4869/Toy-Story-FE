/**
 * Staff Dashboard Page
 * Displays overview statistics for staff warehouse
 */
import React, { useEffect, useState } from 'react';
import StatCard from '../../components/admin/StatCard';
import { Package, AlertTriangle, Tag, Layers, Percent } from 'lucide-react';
import { getWarehouseProductsWithDetails } from '../../services/warehouseService';
import { getStoredUserMetadata } from '../../services/authService';
import { getCurrentStaffWarehouseId } from '../../services/staffService';
import { filterBrands } from '../../services/brandService';
import { getSetsCustomerFilter } from '../../services/setService';
import { getPromotionsCustomerFilter } from '../../services/promotionService';
import ChartGrid from '@/components/staff/ChartGrid';
import { calculateStockStats } from '@/components/staff/stockCalculations';

const StaffDashboardPage: React.FC = () => {
  const [totalStock, setTotalStock] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [totalBrands, setTotalBrands] = useState(0);
  const [totalSets, setTotalSets] = useState(0);
  const [activePromotions, setActivePromotions] = useState(0);
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

      const [products, brands, sets, promotions] = await Promise.all([
        getWarehouseProductsWithDetails(staffWarehouseId),
        filterBrands({}),
        getSetsCustomerFilter(),
        getPromotionsCustomerFilter()
      ]);

      // Use helper function for calculations
      const { totalQuantity, lowStock, outOfStock } = calculateStockStats(products);

      setTotalStock(totalQuantity);
      setLowStockCount(lowStock);
      setOutOfStockCount(outOfStock);

      setTotalBrands(brands.length);
      setTotalSets(sets.length);
      setActivePromotions(promotions.filter(p => p.isActive).length);

    } catch (error) {
      console.error('Failed to initialize staff context:', error);
      setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Tổng tồn kho',
      value: loading ? 'Đang tải...' : `${totalStock} sản phẩm`,
      icon: <Package className="text-emerald-500" />
    },
    {
      title: 'Sản phẩm sắp hết',
      value: loading ? 'Đang tải...' : `${lowStockCount}`,
      icon: <AlertTriangle className="text-orange-500" />
    },
    {
      title: 'Sản phẩm hết hàng',
      value: loading ? 'Đang tải...' : `${outOfStockCount}`,
      icon: <AlertTriangle className="text-red-500" />
    },
    {
      title: 'Thương hiệu đang hoạt động',
      value: loading ? 'Đang tải...' : `${totalBrands}`,
      icon: <Tag className="text-blue-500" />
    },
    {
      title: 'Bộ sản phẩm hiện có',
      value: loading ? 'Đang tải...' : `${totalSets}`,
      icon: <Layers className="text-purple-500" />
    },
    {
      title: 'Khuyến mãi đang hoạt động',
      value: loading ? 'Đang tải...' : `${activePromotions}`,
      icon: <Percent className="text-pink-500" />
    },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>


      <ChartGrid />
    </div>
  );
};

export default StaffDashboardPage;
