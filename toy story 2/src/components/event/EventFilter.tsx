// components/event/EventFilter.tsx
import React, { useState, useEffect } from 'react'
import { Calendar, Warehouse, X, Loader2 } from 'lucide-react'
import { getWarehouses } from '@/services/warehouseService'
import { WarehouseSummaryDto } from '@/types/WarehouseDTO'

interface EventFilterProps {
    onFilter: (filter: EventFilterDto) => void
    onReset: () => void
    showWarehouseFilter?: boolean
    userWarehouseId?: number | null  // Add this prop
}

export interface EventFilterDto {
    warehouseId?: number
    startDate?: string
    endDate?: string
}

const EventFilter: React.FC<EventFilterProps> = ({
    onFilter,
    onReset,
    showWarehouseFilter = true,
    userWarehouseId
}) => {
    const [filter, setFilter] = useState<EventFilterDto>({
        warehouseId: userWarehouseId || undefined,
        startDate: undefined,
        endDate: undefined
    })
    const [warehouses, setWarehouses] = useState<WarehouseSummaryDto[]>([])
    const [loadingWarehouses, setLoadingWarehouses] = useState(false)
    const [isWarehouseManager, setIsWarehouseManager] = useState(false)

    useEffect(() => {
        // Check if user has a specific warehouse (warehouse manager)
        if (userWarehouseId) {
            setIsWarehouseManager(true)
            // Set warehouse filter to user's warehouse
            setFilter(prev => ({ ...prev, warehouseId: userWarehouseId }))
        } else {
            // Fetch all warehouses for admin
            fetchWarehouses()
        }
    }, [userWarehouseId])

    const fetchWarehouses = async () => {
        setLoadingWarehouses(true)
        try {
            const data = await getWarehouses()
            setWarehouses(data)
        } catch (error) {
            console.error('Error fetching warehouses:', error)
        } finally {
            setLoadingWarehouses(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onFilter(filter)
    }

    const handleReset = () => {
        const resetFilter = {
            warehouseId: userWarehouseId || undefined,
            startDate: undefined,
            endDate: undefined
        }
        setFilter(resetFilter)
        onReset()
    }

    const handleWarehouseChange = (value: string) => {
        setFilter({
            ...filter,
            warehouseId: value ? parseInt(value) : undefined
        })
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex flex-wrap gap-4 items-end">
                {showWarehouseFilter && (
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Warehouse size={14} className="inline mr-1" />
                            {isWarehouseManager ? 'Kho của bạn' : 'Chọn kho'}
                        </label>

                        {isWarehouseManager ? (
                            // Read-only display for warehouse manager
                            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                                {loadingWarehouses ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    warehouses.find(w => w.warehouseId === userWarehouseId)?.name || `Kho #${userWarehouseId}`
                                )}
                            </div>
                        ) : (
                            // Dropdown for admin
                            <select
                                value={filter.warehouseId || ''}
                                onChange={(e) => handleWarehouseChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="">Tất cả kho</option>
                                {loadingWarehouses ? (
                                    <option disabled>Đang tải...</option>
                                ) : (
                                    warehouses.map(warehouse => (
                                        <option key={warehouse.warehouseId} value={warehouse.warehouseId}>
                                            {warehouse.name} (ID: {warehouse.warehouseId})
                                        </option>
                                    ))
                                )}
                            </select>
                        )}
                    </div>
                )}

                <div className="flex-1 min-w-[180px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Calendar size={14} className="inline mr-1" />
                        Từ ngày
                    </label>
                    <input
                        type="datetime-local"
                        value={filter.startDate?.slice(0, 16) || ''}
                        onChange={(e) => setFilter({ ...filter, startDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="flex-1 min-w-[180px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Calendar size={14} className="inline mr-1" />
                        Đến ngày
                    </label>
                    <input
                        type="datetime-local"
                        value={filter.endDate?.slice(0, 16) || ''}
                        onChange={(e) => setFilter({ ...filter, endDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Lọc
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-1"
                    >
                        <X size={16} />
                        Xóa
                    </button>
                </div>
            </div>
        </form>
    )
}

export default EventFilter