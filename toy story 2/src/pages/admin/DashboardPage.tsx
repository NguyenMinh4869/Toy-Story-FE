import React, { useEffect, useState } from 'react'
import StatCard from '../../components/admin/StatCard'
import { DollarSign, Package, Users, ShoppingBag, Boxes } from 'lucide-react'
import { getAdminDashboardSummary } from '../../services/dashboardService'
import type { AdminWidgetDto } from '../../types/DashboardDTO'
import ChartGrid from '@/components/admin/dashboard/ChartGrid'

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<AdminWidgetDto | null>(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getAdminDashboardSummary()
        setSummary(data)
      } catch (e) {
        console.error(e)
        setError('Khong the tai du lieu dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const stats = [
    {
      title: 'Doanh thu',
      value: summary?.totalRevenue ? `${(summary.totalRevenue / 1000000).toFixed(1)}M` : '0',
      icon: <DollarSign className="text-red-500" />,
    },
    {
      title: 'Đơn hàng',
      value: summary?.totalOrders ?? 0,
      icon: <ShoppingBag className="text-red-500" />,
    },
    {
      title: 'Sản phẩm',
      value: summary?.totalProducts ?? 0,
      icon: <Package className="text-red-500" />,
    },
    {
      title: 'Bộ sưu tập',
      value: summary?.totalSets ?? 0,
      icon: <Boxes className="text-red-500" />,
    },
    {
      title: 'Nhân viên',
      value: summary?.totalStaff ?? 0,
      icon: <Users className="text-red-500" />,
    },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      <ChartGrid />
    </div>
  )
}

export default DashboardPage