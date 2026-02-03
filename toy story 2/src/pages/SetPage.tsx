/**
 * SetPage - Danh sách set sản phẩm (FR-5)
 * Lấy danh sách set từ API Set/customer-filter
 */

import React, { useEffect, useState } from 'react'
import { BreadcrumbHeader } from '../components/BreadcrumbHeader'
import { getSetsCustomerFilter } from '../services/setService'
import type { ViewSetDetailDto } from '../types/SetDTO'

const breadcrumbItems = [{ label: 'Set sản phẩm' }]

export const SetPage: React.FC = () => {
  const [sets, setSets] = useState<ViewSetDetailDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSets = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getSetsCustomerFilter()
        setSets(data)
      } catch (err) {
        console.error('Error fetching sets:', err)
        setError('Không thể tải danh sách set. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }
    fetchSets()
  }, [])

  if (error) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <BreadcrumbHeader items={breadcrumbItems} />
        <div className="flex-1 flex items-center justify-center text-red-600 px-4 py-10">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <BreadcrumbHeader items={breadcrumbItems} />

      <main className="flex-1 w-full max-w-[1000px] mx-auto px-4 py-8">
        <h1 className="font-rowdies text-xl text-gray-900 mb-6">Set sản phẩm</h1>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[180px] bg-gray-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : sets.length === 0 ? (
          <p className="font-red-hat text-gray-600">Chưa có set sản phẩm nào.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {sets.map((s) => (
              <li
                key={s.setId}
                className="border border-[#d9d9d9] rounded-xl p-5 hover:border-[#ca002a]/40 transition-colors"
              >
                <div className="flex gap-4">
                  {s.imageUrl ? (
                    <img
                      src={s.imageUrl}
                      alt={s.name ?? ''}
                      className="w-24 h-24 object-cover rounded-lg shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-[#f2f2f2] shrink-0 flex items-center justify-center text-[#888] text-xs">
                      Set
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h2 className="font-tilt-warp text-base text-gray-900">{s.name ?? '—'}</h2>
                    {s.description && (
                      <p className="font-red-hat text-sm text-gray-600 mt-1 line-clamp-2">{s.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {s.discountPercent != null && (
                        <span className="text-sm font-semibold text-[#ca002a]">Giảm {s.discountPercent}%</span>
                      )}
                      {s.price != null && (
                        <span className="font-red-hat text-sm text-gray-700">
                          {s.price.toLocaleString('vi-VN')} ₫
                        </span>
                      )}
                      {s.totalItems != null && (
                        <span className="font-red-hat text-xs text-gray-500">{s.totalItems} sản phẩm</span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}

export default SetPage
