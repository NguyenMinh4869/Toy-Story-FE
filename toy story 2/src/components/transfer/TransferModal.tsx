import React, { useState } from 'react'
import { ViewTransDetailDto, TransferStatus } from '@/types/TransferDTO'
import { X, Calendar, User, Package } from 'lucide-react'
import TransferStatusBadge from '../badge/TransferStatusBadge'
import TypeStatusBadge from '../badge/TypeStatusBadge'
import { acceptTransfer, rejectTransfer, completeTransfer } from '@/services/transferService'
import { useAuth } from '@/hooks/useAuth'

interface TransferModalProps {
    transfer: ViewTransDetailDto | null
    onClose: () => void
    onUpdated: () => void // callback to refresh list after action
}

const TransferModal: React.FC<TransferModalProps> = ({ transfer, onClose, onUpdated }) => {
    const [loading, setLoading] = useState(false)
    const { user } = useAuth();
    if (!transfer) return null

    const handleAccept = async () => {
        setLoading(true)
        await acceptTransfer(transfer.transferId)
        setLoading(false)
        onUpdated()
        onClose()
    }

    const handleReject = async () => {
        setLoading(true)
        await rejectTransfer(transfer.transferId)
        setLoading(false)
        onUpdated()
        onClose()
    }

    const handleComplete = async () => {
        setLoading(true)
        await completeTransfer(transfer.transferId)
        setLoading(false)
        onUpdated()
        onClose()
    }

    const getSecondaryDate = (): { label: string; value?: Date } => {
        if (transfer.completedAt) return { label: 'Hoàn thành', value: new Date(transfer.completedAt) }
        if (transfer.rejectedAt) return { label: 'Từ chối', value: new Date(transfer.rejectedAt) }
        if (transfer.acceptedAt) return { label: 'Xác nhận', value: new Date(transfer.acceptedAt) }
        return { label: '', value: undefined }
    }

    const secondary = getSecondaryDate()

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-lg w-full max-w-2xl p-6 relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="text-gray-500 right-4 absolute hover:text-gray-700"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">
                        Chi tiết yêu cầu #{transfer.transferId}
                    </h2>
                    <div className="flex gap-2 mr-7">
                        <TransferStatusBadge status={transfer.status} />
                        <TypeStatusBadge type={transfer.type} />
                    </div>
                </div>

                {/* Warehouses */}
                <div className="mb-4 text-sm text-gray-700">
                    <strong>{transfer.sourceWarehouseName}</strong> → <strong>{transfer.destinationWarehouseName}</strong>
                </div>

                {/* Staff info */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <User size={14} className="text-blue-500" />
                        <span>Người tạo: {transfer.createdByStafName || `#${transfer.createdByStaffId}`}</span>
                    </div>
                    {transfer.acceptedByStaffId && (
                        <div className="flex items-center gap-1">
                            <User size={14} className="text-green-500" />
                            <span>Người xác nhận: {transfer.acceptedByStaffName || `#${transfer.acceptedByStaffId}`}</span>
                        </div>
                    )}
                </div>

                {/* Timeline */}
                <div className="flex flex-col gap-1 mb-4 text-sm text-gray-600">
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

                {/* Items */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Danh sách sản phẩm</h3>
                    <ul className="divide-y divide-gray-200">
                        {transfer.transferItems.map(item => (
                            <li key={item.productId} className="flex items-center justify-between py-2 text-sm">
                                <div className="flex items-center gap-2">
                                    {item.imageUrl && (
                                        <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded object-cover" />
                                    )}
                                    <span>{item.name || `Sản phẩm #${item.productId}`}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-600">
                                    <Package size={14} />
                                    <span>x{item.quantity}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {user?.accountId != transfer.createdByStaffId && (
                    <div className="flex gap-6 mt-6 justify-center">
                        {transfer.status === TransferStatus.Pending && (
                            <>
                                <button
                                    disabled={loading}
                                    onClick={handleAccept}
                                    className="px-3 py-2 bg-blue-600 text-white w-1/2 rounded-3xl font-bold hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Xác nhận
                                </button>
                                <button
                                    disabled={loading}
                                    onClick={handleReject}
                                    className="px-3 py-2 bg-red-600 text-white rounded-3xl font-bold w-1/2 hover:bg-red-700 disabled:opacity-50"
                                >
                                    Từ chối
                                </button>
                            </>
                        )}

                        {transfer.status === TransferStatus.Accepted && (
                            <button
                                disabled={loading}
                                onClick={handleComplete}
                                className="px-3 py-2 bg-green-600 text-white rounded-3xl font-bold w-1/2 hover:bg-green-700 disabled:opacity-50"
                            >
                                Hoàn thành
                            </button>
                        )}

                        {transfer.status === TransferStatus.Rejected && (
                            <span className="text-gray-500 text-sm">Đã bị từ chối</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default TransferModal
