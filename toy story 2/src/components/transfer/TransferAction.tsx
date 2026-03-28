import React from 'react'
import { acceptTransfer, rejectTransfer, completeTransfer } from '@/services/transferService'
import { TransferStatus, ViewTransDetailDto } from '@/types/TransferDTO'

interface TransferActionsProps {
    transfer: ViewTransDetailDto
    onUpdated: () => void // callback to refresh list after action
}

const TransferActions: React.FC<TransferActionsProps> = ({ transfer, onUpdated }) => {
    const handleAccept = async () => {
        const res = await acceptTransfer(transfer.transferId)
        if (res) {
            console.log(res.message)
            onUpdated()
        }
    }

    const handleReject = async () => {
        const res = await rejectTransfer(transfer.transferId)
        if (res) {
            console.log(res.message)
            onUpdated()
        }
    }

    const handleComplete = async () => {
        const res = await completeTransfer(transfer.transferId)
        if (res) {
            console.log(res.message)
            onUpdated()
        }
    }

    return (
        <div className="flex gap-2 mt-4">
            {transfer.status === TransferStatus.Pending && (
                <>
                    <button
                        onClick={handleAccept}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Xác nhận
                    </button>
                    <button
                        onClick={handleReject}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Từ chối
                    </button>
                </>
            )}

            {transfer.status === TransferStatus.Accepted && (
                <button
                    onClick={handleComplete}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Hoàn thành
                </button>
            )}

            {transfer.status === TransferStatus.Rejected && (
                <span className="text-gray-500 text-sm">Đã bị từ chối</span>
            )}
        </div>
    )
}

export default TransferActions
