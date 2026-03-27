// pages/EventHistoryPage.tsx
import React, { useEffect, useState } from 'react'
import { getAllOrderEvents, getAllStockEvents, filterOrderEvents, filterStockEvents } from '@/services/eventService'
import { OrderEventDto, StockEventDto, EventFilterDto } from '@/types/EventDto'
import OrderEventCard from '@/components/event/OrderEventCard'
import StockEventCard from '@/components/event/StockEventCard'
import EventFilter from '@/components/event/EventFilter'
import { Loader2, Package, TrendingUp } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/useAuth'

const EventHistoryPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'order' | 'stock'>('order')
    const [orderEvents, setOrderEvents] = useState<OrderEventDto[]>([])
    const [stockEvents, setStockEvents] = useState<StockEventDto[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<EventFilterDto>({})
    const { user } = useAuth()
    const userWarehouseId = user?.warehouseId

    useEffect(() => {
        if (activeTab === 'order') {
            fetchOrderEvents()
        } else {
            fetchStockEvents()
        }
    }, [activeTab, filter])

    const fetchOrderEvents = async () => {
        setLoading(true)
        try {
            const hasFilter = filter.warehouseId || filter.startDate || filter.endDate
            const events = hasFilter
                ? await filterOrderEvents(filter)
                : await getAllOrderEvents()
            setOrderEvents(events || [])
        } catch (error) {
            console.error('Error fetching order events:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchStockEvents = async () => {
        setLoading(true)
        try {
            const hasFilter = filter.warehouseId || filter.startDate || filter.endDate
            const events = hasFilter
                ? await filterStockEvents(filter)
                : await getAllStockEvents()
            setStockEvents(events || [])
        } catch (error) {
            console.error('Error fetching stock events:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFilter = (newFilter: EventFilterDto) => {
        setFilter(newFilter)
    }

    const handleReset = () => {
        setFilter({})
    }

    return (
        <div className="max-w-7xl mx-auto px-4">
            <div className="mb-4">
                <h1 className="text-2xl font-black text-gray-900 mb-2">Lịch sử thay đổi</h1>
            </div>

            <div className="mb-6">
                <EventFilter
                    onFilter={handleFilter}
                    onReset={handleReset}
                    showWarehouseFilter={true}
                    userWarehouseId={userWarehouseId}
                />
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'order' | 'stock')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {orderEvents.map((event) => (
                                <OrderEventCard key={event.id} event={event} />
                            ))}
                        </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {stockEvents.map((event) => (
                                <StockEventCard key={event.id} event={event} />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default EventHistoryPage