import React, { useEffect, useState } from 'react'
import ProfileLayout from '../layouts/ProfileLayout'
import { ShoppingBag, Package, Search, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react'
import { getAccountInvoices } from '../services/invoiceService'
import { formatPrice } from '../utils/formatPrice'
import { Link } from 'react-router-dom'

const OrderHistoryPage: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await getAccountInvoices()
        setInvoices(data)
      } catch (error) {
        console.error('Error fetching invoices:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchInvoices()
  }, [])

  const filteredInvoices = invoices.filter(inv =>
    inv.invoiceId?.toString().includes(searchTerm) ||
    inv.status?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return <CheckCircle size={16} />
      case 'pending': return <Clock size={16} />
      case 'cancelled': return <XCircle size={16} />
      default: return <Package size={16} />
    }
  }

  return (
    <ProfileLayout>
      <div className="min-h-[500px]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[#00247d] text-2xl font-bold font-tilt-warp">
            Lịch Sử Hóa Đơn & Đơn Hàng
          </h2>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {invoices.length} hóa đơn
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã hóa đơn hoặc trạng thái..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-600 transition-all font-reddit-sans"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-reddit-sans">Đang tải lịch sử của bạn...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Package size={48} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-red-hat">
              {searchTerm ? 'Không tìm thấy hóa đơn nào khớp' : 'Bạn chưa có hóa đơn nào'}
            </h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto font-reddit-sans">
              {searchTerm ? 'Thử tìm kiếm với từ khóa khác nhé!' : 'Khi bạn mua hàng, thông tin hóa đơn sẽ hiển thị tại đây để bạn dễ dàng theo dõi.'}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#ab0007] text-white rounded-xl font-bold hover:bg-[#8a0006] transition-all shadow-lg no-underline"
            >
              <ShoppingBag size={20} />
              Khám phá sản phẩm ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.invoiceId}
                className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-red-100 transition-all cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 shrink-0">
                      <Package size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-1">
                        Hóa đơn #{invoice.invoiceId}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(invoice.issuedAt).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>{invoice.orderCode || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6">
                    <div className="text-right">
                      <div className="text-lg font-black text-red-600 mb-1">
                        {formatPrice(invoice.amountDue)}
                      </div>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyle(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        {invoice.status}
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-300 group-hover:text-red-600 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProfileLayout>
  )
}

export default OrderHistoryPage
