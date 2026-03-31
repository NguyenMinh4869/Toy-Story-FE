// components/transfer/TransferFilter.tsx
import React, { useState, useEffect, useRef } from 'react'
import { Warehouse, X, Filter, Loader2 } from 'lucide-react'
import { getWarehouses } from '@/services/warehouseService'
import { WarehouseSummaryDto } from '@/types/WarehouseDTO'
import { TransferFilterDto, TransferStatus, TransferStatusLabels, TransferType, TransferTypeLabels } from '@/types/TransferDTO'

interface TransferFilterProps {
    onFilter: (filter: TransferFilterDto) => void
    onReset: () => void
    showWarehouseFilter?: boolean
    userWarehouseId?: number | null
}

const TransferFilter: React.FC<TransferFilterProps> = ({
    onFilter,
    onReset,
    showWarehouseFilter = true,
    userWarehouseId
}) => {
    const [filter, setFilter] = useState<TransferFilterDto>({
        warehouseId: userWarehouseId || undefined,
        status: undefined,
        type: undefined
    })
    const [warehouses, setWarehouses] = useState<WarehouseSummaryDto[]>([])
    const [loadingWarehouses, setLoadingWarehouses] = useState(false)
    const isWarehouseManager = !!userWarehouseId

    // Track if initial filter has been applied
    const isInitialFilterApplied = useRef(false)

    // Force filter on mount if user is warehouse manager
    useEffect(() => {
        if (userWarehouseId && !isInitialFilterApplied.current) {
            isInitialFilterApplied.current = true
            const forcedFilter: TransferFilterDto = {
                warehouseId: userWarehouseId,
                status: undefined,
                type: undefined
            }
            console.log('FORCING FILTER for warehouse manager:', forcedFilter)
            setFilter(forcedFilter)
            onFilter(forcedFilter)
        }
    }, [userWarehouseId, onFilter])

    useEffect(() => {
        if (!userWarehouseId) {
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
        const resetFilter: TransferFilterDto = {
            warehouseId: userWarehouseId || undefined,
            status: undefined,
            type: undefined
        }
        setFilter(resetFilter)
        onReset()
    }

    const handleWarehouseChange = (value: string) => {
        const newFilter = {
            ...filter,
            warehouseId: value ? parseInt(value) : undefined
        }
        setFilter(newFilter)
        onFilter(newFilter)
    }

    const handleStatusChange = (value: string) => {
        const nextStatus = value ? parseInt(value, 10) as unknown as TransferStatus : undefined
        const newFilter = {
            ...filter,
            status: nextStatus
        }
        setFilter(newFilter)
        onFilter(newFilter)
    }

    const handleTypeChange = (value: string) => {
        const nextType = value ? parseInt(value, 10) as unknown as TransferType : undefined
        const newFilter = {
            ...filter,
            type: nextType
        }
        setFilter(newFilter)
        onFilter(newFilter)
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
                            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                                {loadingWarehouses ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    warehouses.find(w => w.warehouseId === userWarehouseId)?.name || `Kho #${userWarehouseId}`
                                )}
                            </div>
                        ) : (
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
                        Trạng thái
                    </label>
                    <select
                        value={filter.status ?? ''}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        <option value="">Tất cả</option>
                        {Object.values(TransferStatus)
                            .filter((v): v is number => typeof v === 'number')
                            .map((s) => (
                                <option key={s} value={s}>
                                    {TransferStatusLabels[s as TransferStatus]}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="flex-1 min-w-[180px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Loại yêu cầu
                    </label>
                    <select
                        value={filter.type ?? ''}
                        onChange={(e) => handleTypeChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        <option value="">Tất cả</option>
                        {Object.values(TransferType)
                            .filter((v): v is number => typeof v === 'number')
                            .map((t) => (
                                <option key={t} value={t}>
                                    {TransferTypeLabels[t as TransferType]}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                    >
                        <Filter size={16} />
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

export default TransferFilter