import React from 'react'
import { CheckCircle, Clock, XCircle, Package } from 'lucide-react'
import { TransferStatus, TransferStatusLabels } from '@/types/TransferDTO'

interface StatusBadgeProps {
    status: TransferStatus
}

const TransferStatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStatusStyle = (s: TransferStatus) => {
        switch (s) {
            case TransferStatus.Pending:
                return 'bg-yellow-100 text-yellow-700'
            case TransferStatus.Accepted:
                return 'bg-blue-100 text-blue-700'
            case TransferStatus.Completed:
                return 'bg-green-100 text-green-700'
            case TransferStatus.Rejected:
                return 'bg-red-100 text-red-700'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    const getStatusIcon = (s: TransferStatus) => {
        switch (s) {
            case TransferStatus.Pending:
                return <Clock size={16} className="text-yellow-600" />
            case TransferStatus.Accepted:
                return <CheckCircle size={16} className="text-blue-600" />
            case TransferStatus.Completed:
                return <CheckCircle size={16} className="text-green-600" />
            case TransferStatus.Rejected:
                return <XCircle size={16} className="text-red-600" />
            default:
                return <Package size={16} className="text-gray-600" />
        }
    }

    return (
        <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyle(status)}`}
        >
            {getStatusIcon(status)}
            {TransferStatusLabels[status]}
        </div>
    )
}

export default TransferStatusBadge
