/**
 * VoucherPage - Danh sách voucher (FR-3)
 * Lấy danh sách voucher từ API Voucher/customer-filter
 * UI theo design Figma: Cơ hội cuối - Rước quà hút tế (gold banner, nền vàng kem, thẻ viền đỏ)
 */

import React, { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { BreadcrumbHeader } from '../components/BreadcrumbHeader'
import { getCustomerFilterVouchers } from '../services/voucherService'
import type { ViewVoucherSummaryDto } from '../types/VoucherDTO'

const breadcrumbItems = [{ label: 'Voucher' }]

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return dateStr
  }
}

/** Trang trí góc thẻ kiểu phong bì lì xì (Figma) */
const CornerOrnament = ({ side }: { side: 'left' | 'right' }) => (
  <div
    className={`absolute top-0 w-8 h-8 overflow-hidden ${side === 'left' ? 'left-0 rounded-br-[999px]' : 'right-0 rounded-bl-[999px]'}`}
  >
    <div
      className={`absolute w-6 h-6 bg-[#c40029] rounded-full ${side === 'left' ? '-top-2 -left-2' : '-top-2 -right-2'}`}
    />
    <div
      className={`absolute w-2 h-2 bg-[#ffd700]/40 rounded-full ${side === 'left' ? 'top-1 left-1' : 'top-1 right-1'}`}
    />
  </div>
)

export const VoucherPage: React.FC = () => {
  const [vouchers, setVouchers] = useState<ViewVoucherSummaryDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getCustomerFilterVouchers()
        setVouchers(data)
      } catch (err) {
        console.error('Error fetching vouchers:', err)
        setError('Không thể tải danh sách voucher. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }
    fetchVouchers()
  }, [])

  if (error) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <BreadcrumbHeader items={breadcrumbItems} />
        <div className="flex-1 flex items-center justify-center text-red-600 px-4 py-10 font-red-hat">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <BreadcrumbHeader items={breadcrumbItems} />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-8 md:py-12">
        {/* Khối tiêu đề theo Figma: Cơ hội cuối - Rước quà hút tế */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="font-tilt-warp text-3xl md:text-4xl lg:text-5xl bg-gradient-to-b from-[#8b6914] via-[#b8860b] to-[#ffd700] bg-clip-text text-transparent leading-tight m-0">
            CƠ HỘI CUỐI
          </h1>
          <p className="font-tilt-warp text-lg md:text-xl text-[#b20000] mt-1 md:mt-2">
            RƯỚC QUÀ HÚT TẾ
          </p>
          <div className="flex items-center justify-center gap-3 md:gap-4 mt-4 md:mt-6">
            <div className="w-32 md:w-48 h-0.5 bg-[#d8c59e] border border-black/10" />
            <div className="w-10 h-10 md:w-14 md:h-14 rotate-[13deg] bg-[#d8c59e] rounded-sm border border-black/10" />
            <div className="w-32 md:w-48 h-0.5 bg-[#d8c59e] border border-black/10" />
          </div>
        </div>

        {/* Nội dung trong nền vàng kem (Figma) */}
        <section className="bg-gradient-to-b from-[#f8e3b8] via-[#f8e3b8] to-[#e2b663] rounded-[28px] md:rounded-[36px] py-8 md:py-10 px-4 md:px-6 lg:px-8">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-[180px] bg-white/60 animate-pulse rounded-[17px] border border-[#d08856]/40"
                />
              ))}
            </div>
          ) : vouchers.length === 0 ? (
            <p className="font-red-hat text-gray-700 text-center py-8">Chưa có voucher nào.</p>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-1 md:grid-cols-2">
              {vouchers.map((v) => (
                <li
                  key={v.voucherId ?? v.code}
                  className="relative border-2 border-[#d08856] rounded-[17px] bg-white p-4 md:p-5 hover:border-[#c40029] hover:shadow-md transition-all"
                >
                  <CornerOrnament side="left" />
                  <CornerOrnament side="right" />
                  <div className="flex gap-4">
                    {v.imageUrl ? (
                      <img
                        src={v.imageUrl}
                        alt={v.name ?? v.code ?? ''}
                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl shrink-0 border border-[#d08856]/30"
                      />
                    ) : (
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-[#f8e3b8] border border-[#d08856]/40 shrink-0 flex items-center justify-center text-[#b20000] font-tilt-warp text-sm">
                        Mã
                      </div>
                    )}
                    <div className="min-w-0 flex-1 pr-6">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-tilt-warp text-base text-[#1500b1]">{v.code ?? '—'}</span>
                        {v.isActive !== false && (
                          <span className="text-xs px-2 py-0.5 rounded bg-[#c40029] text-white font-red-hat">
                            Đang áp dụng
                          </span>
                        )}
                      </div>
                      <h2 className="font-tilt-warp text-gray-900 mt-1 text-base md:text-lg">{v.name ?? '—'}</h2>
                      {v.description && (
                        <p className="font-red-hat text-sm text-gray-600 mt-1 line-clamp-2">{v.description}</p>
                      )}
                      <div className="font-red-hat text-xs text-gray-500 mt-2">
                        Từ {formatDate(v.validFrom)}
                        {v.validTo != null && ` → ${formatDate(v.validTo)}`}
                        {v.usedCount != null && ` · Đã dùng: ${v.usedCount}`}
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          type="button"
                          className="bg-[#c40029] hover:bg-[#a00022] text-white font-tilt-warp text-xs md:text-sm py-2 px-4 rounded-lg border-none cursor-pointer transition-colors"
                        >
                          Xem chi tiết
                        </button>
                        <button
                          type="button"
                          className="w-8 h-8 rounded-full bg-[#c40029] flex items-center justify-center text-white border-none cursor-pointer hover:bg-[#a00022] transition-colors"
                          aria-label="Yêu thích"
                        >
                          <Heart size={16} strokeWidth={2} fill="currentColor" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

export default VoucherPage
