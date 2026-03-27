import React from 'react'
import { OrderEventDto } from '@/types/EventDto'

type Props = {
    orderId: number
    events: OrderEventDto[]
    onClose: () => void
}

const OrderEventsModal: React.FC<Props> = ({ orderId, events, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                <h2 className="text-xl font-bold mb-4">Lịch sử trạng thái đơn #{orderId}</h2>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {events.map(ev => (
                        <div key={ev.id} className="border rounded p-3">
                            <p className="font-semibold">{ev.eventType}</p>
                            {ev.payload?.UpdatedAt && (
                                <p className="text-xs text-gray-500">
                                    Cập nhật: {new Date(ev.payload.UpdatedAt).toLocaleString()}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OrderEventsModal
