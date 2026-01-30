import React from 'react';
import StatCard from '../../components/admin/StatCard';
import ProductListTable from '../../components/admin/ProductListTable';
import { DollarSign, Package, Users } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const stats = [
    { title: 'Live Sales', value: '$12,500.00', icon: <DollarSign className="text-red-500" /> },
    { title: 'Total Products', value: '1,248 items', icon: <Package className="text-red-500" /> },
    { title: 'Staff', value: '12', icon: <Users className="text-red-500" /> },
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
          <button className="py-2 px-4 text-sm font-medium text-red-600 border-b-2 border-red-600">
            All Products
          </button>
          <button className="py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700">
            Low Stock
          </button>
        </div>
        <ProductListTable />
      </div>
    </div>
  );
};

export default DashboardPage;
