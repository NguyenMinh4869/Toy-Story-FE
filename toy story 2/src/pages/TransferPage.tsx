// pages/TransferPage.tsx
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { createTransfer, getAllTransfers, getFilteredTransfers, getTransferById } from '@/services/transferService'
import { ViewTransDetailDto, ViewTransSummaryDto, TransferFilterDto, CreateTransferDto } from '@/types/TransferDTO'
import TransferFilter from '@/components/transfer/TransferFilter'
import TransferCard from '@/components/transfer/TransferCard'
import TransferModal from '@/components/transfer/TransferModal'
import { Loader2 } from 'lucide-react'
import CreateTransferModal from '@/components/transfer/CreateTransferModal'
import { useAuth } from '@/hooks/useAuth'
import Pagination from '@/components/ui/Pagination'
import { useClientPagination } from '@/hooks/useClientPagination'
import { useNotifications } from '@/context/NotificationContext'

const TRANSFERS_PAGE_SIZE = 6

const TransferPage: React.FC = () => {
  const [transfers, setTransfers] = useState<ViewTransSummaryDto[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTransfer, setSelectedTransfer] = useState<ViewTransDetailDto | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filter, setFilter] = useState<TransferFilterDto>({})
  const [currentPage, setCurrentPage] = useState(1)
  const { user } = useAuth()
  const userWarehouseId = user?.warehouseId
  const { lastTransferUpdate, unreadCount, markAllRead } = useNotifications()

  // Auto-clear notification badge while on this page
  useEffect(() => {
    if (unreadCount > 0) {
      markAllRead()
    }
  }, [unreadCount, markAllRead])

  // Pagination
  const {
    paginatedItems: paginatedTransfers,
    totalPages,
    currentPage: safeCurrentPage
  } = useClientPagination(transfers, currentPage, TRANSFERS_PAGE_SIZE)

  // Track if initial filter has been applied
  const isInitialFilterApplied = useRef(false)

  const fetchTransfers = useCallback(async (currentFilter: TransferFilterDto) => {
    console.log('FETCHING transfers with filter:', currentFilter)
    setLoading(true)
    try {
      const hasFilter = currentFilter.warehouseId || currentFilter.status || currentFilter.type
      const data = hasFilter
        ? await getFilteredTransfers(currentFilter)
        : await getAllTransfers()
      if (data) {
        setTransfers(data)
        setCurrentPage(1) // Reset to first page when new data arrives
      }
    } catch (error) {
      console.error('Error fetching transfers:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Set initial filter for warehouse manager
  useEffect(() => {
    if (userWarehouseId && !isInitialFilterApplied.current) {
      isInitialFilterApplied.current = true
      console.log('Setting initial filter for warehouse manager:', userWarehouseId)
      const initialFilter: TransferFilterDto = {
        warehouseId: userWarehouseId,
        status: undefined,
        type: undefined
      }
      setFilter(initialFilter)
      // Immediately fetch with the filter
      fetchTransfers(initialFilter)
    }
  }, [userWarehouseId, fetchTransfers])

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
    fetchTransfers(filter)
  }, [filter, fetchTransfers, userWarehouseId, lastTransferUpdate])

  const handleFilter = useCallback((newFilter: TransferFilterDto) => {
    console.log('Filter changed:', newFilter)
    setFilter(newFilter)
    setCurrentPage(1) // Reset to first page when filter changes
  }, [])

  const handleReset = useCallback(() => {
    console.log('Reset filter')
    if (userWarehouseId) {
      // For warehouse manager, reset to their warehouse filter
      const resetFilter: TransferFilterDto = {
        warehouseId: userWarehouseId,
        status: undefined,
        type: undefined
      }
      setFilter(resetFilter)
    } else {
      setFilter({})
    }
    setCurrentPage(1) // Reset to first page when resetting filter
  }, [userWarehouseId])

  const handleOpenModal = () => setShowCreateModal(true)
  const handleCloseModal = () => setShowCreateModal(false)

  const handleSubmitTransfer = async (dto: CreateTransferDto) => {
    try {
      const result = await createTransfer(dto)
      console.log('Transfer created:', result)
      // Refresh with current filter
      fetchTransfers(filter)
    } catch (error) {
      console.error('Error creating transfer:', error)
    }
  }

  const openTransferModal = async (transferId: number) => {
    try {
      const detail = await getTransferById(transferId)
      if (detail) setSelectedTransfer(detail)
    } catch (error) {
      console.error('Error fetching transfer detail:', error)
    }
  }

  const closeTransferModal = () => {
    setSelectedTransfer(null)
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-black">Quản lý yêu cầu chuyển kho</h1>
        {userWarehouseId != null && (
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-3xl font-bold hover:bg-blue-700"
          >
            Tạo yêu cầu chuyển kho
          </button>
        )}
      </div>

      {/* Filter */}
      <TransferFilter
        onFilter={handleFilter}
        onReset={handleReset}
        userWarehouseId={userWarehouseId}
      />

      {/* List */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 size={24} className="animate-spin text-blue-600" />
        </div>
      ) : transfers.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl mt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-1">Không có yêu cầu chuyển kho</h3>
          <p className="text-gray-500">
            {filter.warehouseId || filter.status || filter.type
              ? 'Không tìm thấy yêu cầu phù hợp với bộ lọc'
              : 'Chưa có yêu cầu chuyển kho nào được tạo'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {paginatedTransfers.map(t => (
              <div key={t.transferId} onClick={() => openTransferModal(t.transferId)} className="cursor-pointer">
                <TransferCard transfer={t} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-2">
              <Pagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {selectedTransfer && (
        <TransferModal transfer={selectedTransfer} onClose={closeTransferModal} onUpdated={() => fetchTransfers(filter)} />
      )}

      {showCreateModal && (
        <CreateTransferModal
          onClose={handleCloseModal}
          onSubmit={handleSubmitTransfer}
        />
      )}
    </div>
  )
}

export default TransferPage