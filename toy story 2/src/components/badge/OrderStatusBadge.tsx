import React from 'react'
import { CheckCircle, Clock, XCircle, Package } from 'lucide-react'

interface StatusBadgeProps {
    status: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStatusStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'đã thanh toán': return 'bg-green-100 text-green-700'
            case 'đang chờ': return 'bg-yellow-100 text-yellow-700'
            case 'đang giao hàng': return 'bg-blue-100 text-blue-700'
            case 'đã nhận hàng': return 'bg-purple-100 text-purple-700'
            case 'đã hủy': return 'bg-red-100 text-red-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'đã thanh toán': return <CheckCircle size={16} />
            case 'đang chờ': return <Clock size={16} />
            case 'đang giao hàng': return <Package size={16} />
            case 'đã nhận hàng': return <CheckCircle size={16} className="text-purple-600" />
            case 'đã hủy': return <XCircle size={16} />
            default: return <Package size={16} />
        }
    }

    return (
        <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyle(status)}`}
        >
            {getStatusIcon(status)}
            {status}
        </div>
    )
}

export default StatusBadge
