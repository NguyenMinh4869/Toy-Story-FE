// pages/EventHistoryPage.tsx
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { getAllOrderEvents, getAllStockEvents, filterOrderEvents, filterStockEvents } from '@/services/eventService'
import { OrderEventDto, StockEventDto, EventFilterDto } from '@/types/EventDto'
import OrderEventCard from '@/components/event/OrderEventCard'
import StockEventCard from '@/components/event/StockEventCard'
import EventFilter from '@/components/event/EventFilter'
import { Loader2, Package, TrendingUp } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/useAuth'
import Pagination from '@/components/ui/Pagination'
import { useClientPagination } from '@/hooks/useClientPagination'

const ORDER_EVENTS_PAGE_SIZE = 6
const STOCK_EVENTS_PAGE_SIZE = 3

const EventHistoryPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'order' | 'stock'>('order')
    const [orderEvents, setOrderEvents] = useState<OrderEventDto[]>([])
    const [stockEvents, setStockEvents] = useState<StockEventDto[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<EventFilterDto>({})
    const [orderPage, setOrderPage] = useState(1)
    const [stockPage, setStockPage] = useState(1)
    const { user } = useAuth()
    const userWarehouseId = user?.warehouseId
    const {
        paginatedItems: paginatedOrderEvents,
        totalPages: orderTotalPages,
        currentPage: safeOrderPage
    } = useClientPagination(orderEvents, orderPage, ORDER_EVENTS_PAGE_SIZE)
    const {
        paginatedItems: paginatedStockEvents,
        totalPages: stockTotalPages,
        currentPage: safeStockPage
    } = useClientPagination(stockEvents, stockPage, STOCK_EVENTS_PAGE_SIZE)

    // Ref to track if initial filter has been applied
    const isInitialFilterApplied = useRef(false)

    const fetchEvents = useCallback(async (currentFilter: EventFilterDto) => {
        console.log('FETCHING with filter:', currentFilter)
        setLoading(true)
        try {
            if (activeTab === 'order') {
                const hasFilter = currentFilter.warehouseId || currentFilter.startDate || currentFilter.endDate
                const events = hasFilter
                    ? await filterOrderEvents(currentFilter)
                    : await getAllOrderEvents()
                setOrderEvents(events || [])
                setOrderPage(1)
            } else {
                const hasFilter = currentFilter.warehouseId || currentFilter.startDate || currentFilter.endDate
                const events = hasFilter
                    ? await filterStockEvents(currentFilter)
                    : await getAllStockEvents()
                setStockEvents(events || [])
                setStockPage(1)
            }
        } catch (error) {
            console.error('Error fetching events:', error)
        } finally {
            setLoading(false)
        }
    }, [activeTab])

    // Set initial filter for warehouse manager
    useEffect(() => {
        if (userWarehouseId && !isInitialFilterApplied.current) {
            isInitialFilterApplied.current = true
            console.log('Setting initial filter for warehouse manager:', userWarehouseId)
            const initialFilter = {
                warehouseId: userWarehouseId,
                startDate: undefined,
                endDate: undefined
            }
            setFilter(initialFilter)
            // Immediately fetch with the filter
            fetchEvents(initialFilter)
        }
    }, [userWarehouseId, fetchEvents])

    // Fetch when filter changes (but skip if it's the initial load for warehouse manager)
    useEffect(() => {
        // If it's a warehouse manager and the initial filter hasn't been applied yet, skip
        if (userWarehouseId && !isInitialFilterApplied.current) {
            return
        }
        // If filter is empty and we have a warehouse manager, don't fetch yet
        if (userWarehouseId && Object.keys(filter).length === 0) {
            return
        }
        fetchEvents(filter)
    }, [filter, fetchEvents, userWarehouseId])

    const handleFilter = useCallback((newFilter: EventFilterDto) => {
        console.log('Filter changed:', newFilter)
        setFilter(newFilter)
        setOrderPage(1)
        setStockPage(1)
    }, [])

    const handleReset = useCallback(() => {
        console.log('Reset filter')
        if (userWarehouseId) {
            // For warehouse manager, reset to their warehouse filter
            const resetFilter = {
                warehouseId: userWarehouseId,
                startDate: undefined,
                endDate: undefined
            }
            setFilter(resetFilter)
        } else {
            setFilter({})
        }
    }, [userWarehouseId])

    return (
        <div>
            <div className="mb-4">
                <h1 className="text-2xl font-black text-gray-900 mb-2">Lịch sử thay đổi</h1>
            </div>

            <div className="mb-4">
                <EventFilter
                    onFilter={handleFilter}
                    onReset={handleReset}
                    showWarehouseFilter={true}
                    userWarehouseId={userWarehouseId}
                />
            </div>

            <Tabs
                value={activeTab}
                onValueChange={(v) => {
                    setActiveTab(v as 'order' | 'stock')
                    if (v === 'order') setOrderPage(1)
                    if (v === 'stock') setStockPage(1)
                }}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger
                        value="order"
                        className="flex items-center justify-center gap-2 w-full"
                    >
                        <Package size={16} />
                        Lịch sử cập nhật đơn hàng
                        {!loading && orderEvents.length > 0 && (
                            <span className="ml-1 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                                {orderEvents.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="stock"
                        className="flex items-center justify-center gap-2 w-full"
                    >
                        <TrendingUp size={16} />
                        Lịch sử cập nhật kho
                        {!loading && stockEvents.length > 0 && (
                            <span className="ml-1 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                                {stockEvents.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="order">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="animate-spin text-blue-600" size={40} />
                        </div>
                    ) : orderEvents.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-xl">
                            <Package size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Không có thay đổi đơn hàng</h3>
                            <p className="text-gray-500">
                                {filter.warehouseId || filter.startDate || filter.endDate
                                    ? 'Không tìm thấy thay đổi phù hợp với bộ lọc'
                                    : 'Chưa có thay đổi đơn hàng nào được ghi nhận'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-3 gap-2">
                                {paginatedOrderEvents.map((event) => (
                                    <OrderEventCard key={event.id} event={event} />
                                ))}
                            </div>
                            <div className="mt-2">
                                <Pagination
                                    currentPage={safeOrderPage}
                                    totalPages={orderTotalPages}
                                    onPageChange={setOrderPage}
                                />
                            </div>
                        </>
                    )}
                </TabsContent>

                <TabsContent value="stock">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="animate-spin text-blue-600" size={40} />
                        </div>
                    ) : stockEvents.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-xl">
                            <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Không có thay đổi kho</h3>
                            <p className="text-gray-500">
                                {filter.warehouseId || filter.startDate || filter.endDate
                                    ? 'Không tìm thấy thay đổi phù hợp với bộ lọc'
                                    : 'Chưa có thay đổi kho nào được ghi nhận'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {paginatedStockEvents.map((event) => (
                                    <StockEventCard key={event.id} event={event} />
                                ))}
                            </div>
                            <div className="mt-6">
                                <Pagination
                                    currentPage={safeStockPage}
                                    totalPages={stockTotalPages}
                                    onPageChange={setStockPage}
                                />
                            </div>
                        </>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default EventHistoryPage