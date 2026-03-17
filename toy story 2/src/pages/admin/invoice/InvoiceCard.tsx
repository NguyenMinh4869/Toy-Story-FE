import React from 'react'
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'
import { ViewInvoiceDto } from '@/types/OrderDTO'

interface InvoiceCardProps {
    invoice: ViewInvoiceDto
    onClick?: () => void
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, onClick }) => {
    const getStatusStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'đã thanh toán': return 'bg-green-100 text-green-700'
            case 'đang chờ': return 'bg-yellow-100 text-yellow-700'
            case 'đã hủy': return 'bg-red-100 text-red-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'đã thanh toán': return <CheckCircle size={16} />
            case 'đang chờ': return <Clock size={16} />
            case 'đã hủy': return <XCircle size={16} />
            default: return <Package size={16} />
        }
    }

    return (
        <div
            onClick={onClick}
            className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-red-100 transition-all cursor-pointer"
        >
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 shrink-0">
                    <Package size={24} />
                </div>
                <div className="flex-1">
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

            <div className="mt-4 flex items-center justify-between">
                <div className="text-right">
                    <div className="text-lg font-black text-red-600 mb-1">
                        {formatPrice(invoice.amountDue)}
                    </div>
                    <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyle(invoice.status)}`}
                    >
                        {getStatusIcon(invoice.status)}
                        {invoice.status}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvoiceCard
