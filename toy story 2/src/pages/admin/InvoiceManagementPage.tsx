import React, { useEffect, useState } from 'react'
import { Package } from 'lucide-react'
import { getInvoices } from '@/services/invoiceService'
import { ViewInvoiceDto } from '@/types/OrderDTO'
import InvoiceList from './invoice/InvoiceList'
const InvoiceManagementPage: React.FC = () => {
    const [invoices, setInvoices] = useState<ViewInvoiceDto[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const data = await getInvoices()
                setInvoices(data)
            } catch (error) {
                console.error('Error fetching invoices:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchInvoices()
    }, [])

    return (
        <div className="min-h-[500px]">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold font-tilt-warp">
                    Quản lý Hóa Đơn
                </h2>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {invoices.length} hóa đơn
                </span>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500">Đang tải danh sách hóa đơn...</p>
                </div>
            ) : invoices.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <Package size={48} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Bạn chưa có hóa đơn nào
                    </h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        Khi bạn mua hàng, thông tin hóa đơn sẽ hiển thị tại đây để bạn dễ dàng theo dõi.
                    </p>
                </div>
            ) : (
                <InvoiceList invoices={invoices} />
            )}
        </div>
    )
}

export default InvoiceManagementPage
