// components/transfer/TransferCard.tsx
import React from 'react'
import TransferStatusBadge from '../badge/TransferStatusBadge'
import { Calendar } from 'lucide-react'
import { ViewTransSummaryDto } from '@/types/TransferDTO'
import { useAuth } from '@/hooks/useAuth'
interface TransferCardProps {
    transfer: ViewTransSummaryDto
}

const TransferCard: React.FC<TransferCardProps> = ({ transfer }) => {
    const getSecondaryDate = (): { label: string; value?: Date } => {
        if (transfer.completedAt) {
            return { label: 'Hoàn thành', value: new Date(transfer.completedAt) }
        }
        if (transfer.rejectedAt) {
            return { label: 'Từ chối', value: new Date(transfer.rejectedAt) }
        }
        if (transfer.acceptedAt) {
            return { label: 'Xác nhận', value: new Date(transfer.acceptedAt) }
        }
        return { label: '', value: undefined }
    }

    const { user } = useAuth()
    const secondary = getSecondaryDate()

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">Mã yêu cầu #{transfer.transferId}</div>
                <div className="flex gap-2">
                    <TransferStatusBadge status={transfer.status} />
                </div>
            </div>

            <div className="text-sm text-gray-700">
                {user?.warehouseId === transfer.sourceWarehouseId ? (
                    <span>
                        <strong>{transfer.sourceWarehouseName}</strong> → <strong>{transfer.destinationWarehouseName}</strong>
                    </span>
                ) : (
                    <span>
                        <strong>{transfer.destinationWarehouseName}</strong> ← <strong>{transfer.sourceWarehouseName}</strong>
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-1 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-blue-500" />
                    <span>Khởi tạo: {new Date(transfer.createdAt).toLocaleString()}</span>
                </div>
                {secondary.value && (
                    <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-green-500" />
                        <span>{secondary.label}: {secondary.value.toLocaleString()}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TransferCard
