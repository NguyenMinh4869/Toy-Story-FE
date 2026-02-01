import React, { useEffect, useMemo, useState } from 'react'
import StatCard from '../../components/admin/StatCard'
import { DollarSign, Package, Users } from 'lucide-react'
import { getDashboardLowStock, getDashboardSummary } from '../../services/dashboardService'
import type { DashboardSummaryDto, LowStockItemDto } from '../../types/DashboardDTO'

const DEFAULT_THRESHOLD_FALLBACK = 20

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [summary, setSummary] = useState<DashboardSummaryDto | null>(null)
  const [lowStockRows, setLowStockRows] = useState<LowStockItemDto[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        const [s, low] = await Promise.all([
          getDashboardSummary(),
          // Important: do NOT force threshold=20 here.
          // Backend should apply per-warehouse thresholds and return thresholdUsed per row.
          getDashboardLowStock(),
        ])

        setSummary(s)
        setLowStockRows((low || []).slice().sort((a, b) => (a.quantity || 0) - (b.quantity || 0)))
      } catch (e) {
        console.error(e)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const stats = useMemo(() => {
    return [
      {
        title: 'Live Sales',
        value: 'Coming soon',
        icon: <DollarSign className="text-red-500" />,
      },
      {
        title: 'Total Products',
        value: `${summary?.totalProducts ?? 0} items`,
        icon: <Package className="text-red-500" />,
      },
      {
        title: 'Staff',
        value: `${summary?.totalStaff ?? 0}`,
        icon: <Users className="text-red-500" />,
      },
    ]
  }, [summary?.totalProducts, summary?.totalStaff])

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
          <h2 className="text-base font-semibold text-gray-900">Low Stock</h2>
          <div className="text-sm text-gray-600">{lowStockRows.length} items</div>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : lowStockRows.length === 0 ? (
          <div className="text-sm text-gray-600">No low stock items.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lowStockRows.map((row) => (
                  <tr key={row.productWarehouseId || `${row.warehouseId}-${row.productId}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{row.warehouseName || `Warehouse #${row.warehouseId || ''}`}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.productName || `Product #${row.productId || ''}`}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{row.quantity ?? 0}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{row.thresholdUsed ?? DEFAULT_THRESHOLD_FALLBACK}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
