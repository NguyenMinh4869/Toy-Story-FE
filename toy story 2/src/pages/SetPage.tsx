import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BreadcrumbHeader } from '../components/BreadcrumbHeader'
import { getSetsCustomerFilter } from '../services/setService'
import type { ViewSetDetailDto } from '../types/SetDTO'
import { useCart } from '@/context/CartContext'
import { ROUTES } from '../routes/routePaths'
import { useAuth } from '@/hooks/useAuth'
const breadcrumbItems = [{ label: 'Set sản phẩm' }]

export const SetPage: React.FC = () => {
  const [sets, setSets] = useState<ViewSetDetailDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addToCart } = useCart()
  const { user } = useAuth()
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
        <h1 className="font-rowdies text-2xl text-gray-900 mb-8 border-b border-gray-100 pb-4">Bộ sưu tập đặc biệt</h1>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[200px] bg-gray-50 animate-pulse rounded-2xl border border-gray-100" />
            ))}
          </div>
        ) : sets.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="font-red-hat text-gray-500">Chưa có bộ sưu tập nào được mở bán.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {sets.map((s) => (
              <Link
                key={s.setId}
                to={ROUTES.SET_DETAIL.replace(':id', String(s.setId))}
                className="group relative border border-[#d9d9d9] rounded-2xl p-6 bg-white hover:border-[#ca002a]/40 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 block overflow-hidden"
              >
                <div className="flex gap-6">
                  {s.imageUrl ? (
                    <div className="relative group/img overflow-hidden rounded-xl shadow-md border border-gray-100">
                      <img
                        src={s.imageUrl}
                        alt={s.name ?? ''}
                        className="w-32 h-32 object-cover transition-transform duration-500 group-hover/img:scale-110"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shrink-0 flex items-center justify-center text-gray-400 text-xs border border-gray-100">
                      Set Image
                    </div>
                  )}
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="font-tilt-warp text-lg text-gray-900 group-hover:text-[#ca002a] transition-colors line-clamp-1">{s.name ?? '—'}</h2>
                      {s.description && (
                        <p className="font-red-hat text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">{s.description}</p>
                      )}
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        {s.price != null && (
                          <span className="font-tilt-warp text-xl text-[#ca002a]">
                            {s.price.toLocaleString('vi-VN')} ₫
                          </span>
                        )}
                        {s.discountPercent != null && s.discountPercent > 0 && (
                          <span className="text-xs font-bold bg-[#ca002a]/10 text-[#ca002a] px-2 py-1 rounded-full">
                            -{s.discountPercent}%
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs font-red-hat text-gray-500">
                        {s.totalItems != null && (
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                            {s.totalItems} sản phẩm
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {user && user.role === "Member" && (
                    <div className="flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          addToCart(undefined, s.setId!, 1)
                        }}
                        className="w-12 h-12 flex items-center justify-center bg-[#ca002a] hover:bg-[#a00022] text-white rounded-full transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 group-hover:rotate-[360deg]"
                        title="Thêm vào giỏ hàng"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default SetPage
