/**
 * Staff Dashboard Page
 * Displays overview statistics for staff warehouse
 */
import React, { useEffect, useState } from 'react';
import StatCard from '../../components/admin/StatCard';
import { Package, AlertTriangle, CheckCircle, Tag, Layers, Percent } from 'lucide-react';
import { getWarehouseProductsWithDetails, WarehouseProductDto } from '../../services/warehouseService';
import { getStoredUserMetadata } from '../../services/authService';
import { getCurrentStaffWarehouseId } from '../../services/staffService';
import { filterBrands } from '../../services/brandService';
import { getSetsCustomerFilter } from '../../services/setService';
import { getPromotionsCustomerFilter } from '../../services/promotionService';

const StaffDashboardPage: React.FC = () => {
  const [totalStock, setTotalStock] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [totalBrands, setTotalBrands] = useState(0);
  const [totalSets, setTotalSets] = useState(0);
  const [activePromotions, setActivePromotions] = useState(0);
  const [recentProducts, setRecentProducts] = useState<WarehouseProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [warehouseId, setWarehouseId] = useState<number | null>(null);

  useEffect(() => {
    initializeStaffContext();
  }, []);

  const initializeStaffContext = async () => {
    try {
      setLoading(true);
      
      // Get accountId from stored metadata
      const metadata = getStoredUserMetadata();
      if (!metadata?.accountId) {
        console.error('No account ID found');
        return;
      }

      // Fetch staff's warehouseId
      const staffWarehouseId = await getCurrentStaffWarehouseId(metadata.accountId);
      setWarehouseId(staffWarehouseId);

      // Fetch all data in parallel
      const [products, brands, sets, promotions] = await Promise.all([
        getWarehouseProductsWithDetails(staffWarehouseId),
        filterBrands({}), // Get all brands for staff view
        getSetsCustomerFilter(),
        getPromotionsCustomerFilter()
      ]);
      
      // Calculate total stock
      const totalQuantity = products.reduce((sum, product) => sum + (product.quantity || 0), 0);
      setTotalStock(totalQuantity);

      // Calculate stock status counts
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

      setLowStockCount(lowStock);
      setOutOfStockCount(outOfStock);

      // Set counts for other resources
      setTotalBrands(brands.length);
      setTotalSets(sets.length);
      setActivePromotions(promotions.filter(p => p.isActive).length);

      // Get 5 most recent or low stock products
      const sortedProducts = [...products]
        .sort((a, b) => (a.quantity || 0) - (b.quantity || 0))
        .slice(0, 5);
      setRecentProducts(sortedProducts);
    } catch (error) {
      console.error('Failed to initialize staff context:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      title: 'Total Stock', 
      value: loading ? 'Loading...' : `${totalStock} items`, 
      icon: <Package className="text-emerald-500" /> 
    },
    { 
      title: 'Low Stock Products', 
      value: loading ? 'Loading...' : `${lowStockCount}`, 
      icon: <AlertTriangle className="text-orange-500" /> 
    },
    { 
      title: 'Out of Stock', 
      value: loading ? 'Loading...' : `${outOfStockCount}`, 
      icon: <AlertTriangle className="text-red-500" /> 
    },
    { 
      title: 'Active Brands', 
      value: loading ? 'Loading...' : `${totalBrands}`, 
      icon: <Tag className="text-blue-500" /> 
    },
    { 
      title: 'Available Sets', 
      value: loading ? 'Loading...' : `${totalSets}`, 
      icon: <Layers className="text-purple-500" /> 
    },
    { 
      title: 'Active Promotions', 
      value: loading ? 'Loading...' : `${activePromotions}`, 
      icon: <Percent className="text-pink-500" /> 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center border-b border-gray-200 mb-4">
          <button className="py-2 px-4 text-sm font-medium text-emerald-600 border-b-2 border-emerald-600">
            Warehouse Overview
          </button>
          <button className="py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700">
            Low Stock Alert
          </button>
        </div>
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Use the Warehouse menu to manage your inventory. View Brands, Sets, and Promotions from the sidebar.
          </div>

          {/* Products Requiring Attention */}
          {!loading && recentProducts.length > 0 && (
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-3">Products Requiring Attention</h3>
              <div className="space-y-2">
                {recentProducts.map((product) => (
                  <div key={product.productWarehouseId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.imageUrl || 'https://via.placeholder.com/40'} 
                        alt={product.productName}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{product.productName}</p>
                        <p className="text-xs text-gray-500">{product.brandName} - {product.categoryName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{product.quantity} units</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.quantity === 0 
                          ? 'bg-red-100 text-red-800'
                          : product.quantity <= 10
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {product.quantity === 0 ? 'Out of Stock' : product.quantity <= 10 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardPage;
