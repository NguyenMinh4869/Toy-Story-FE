import React from 'react'
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { TransferType, TransferTypeLabels } from '@/types/TransferDTO'

interface TypeBadgeProps {
    type: TransferType
}

const TypeStatusBadge: React.FC<TypeBadgeProps> = ({ type }) => {
    const getTypeStyle = (t: TransferType) => {
        switch (t) {
            case TransferType.TransferOut:
                return 'bg-orange-100 text-orange-700'
            case TransferType.TransferIn:
                return 'bg-indigo-100 text-indigo-700'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    const getTypeIcon = (t: TransferType) => {
        switch (t) {
            case TransferType.TransferOut:
                return <ArrowUpCircle size={16} className="text-orange-600" />
            case TransferType.TransferIn:
                return <ArrowDownCircle size={16} className="text-indigo-600" />
            default:
                return <ArrowUpCircle size={16} className="text-gray-600" />
        }
    }

    return (
        <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getTypeStyle(type)}`}
        >
            {getTypeIcon(type)}
            {TransferTypeLabels[type]}
        </div>
    )
}

export default TypeStatusBadge
