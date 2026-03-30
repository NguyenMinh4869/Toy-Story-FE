// components/transfer/CreateTransferModal.tsx
import React, { useEffect, useState } from 'react'
import { X, PlusCircle, MinusCircle } from 'lucide-react'
import { getWarehouseProductsForStaff, getWarehouses } from '@/services/warehouseService'
import { WarehouseSummaryDto } from '@/types/WarehouseDTO'
import { TransferType, TransferTypeLabels, CreateTransferDto, CreateTransferItemDto } from '@/types/TransferDTO'
import { ViewProductDto } from '@/types/ProductDTO'

interface CreateTransferModalProps {
    onClose: () => void
    onSubmit: (dto: CreateTransferDto) => void
}

const CreateTransferModal: React.FC<CreateTransferModalProps> = ({ onClose, onSubmit }) => {
    const [warehouses, setWarehouses] = useState<WarehouseSummaryDto[]>([])
    const [loadingWarehouses, setLoadingWarehouses] = useState(false)

    const [warehouseId, setWarehouseId] = useState<number | undefined>(undefined)
    const [type, setType] = useState<TransferType>(TransferType.TransferOut)
    const [transferItems, setTransferItems] = useState<CreateTransferItemDto[]>([
        { productId: 0, quantity: 1 }
    ])

    const [products, setProducts] = useState<ViewProductDto[]>([])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getWarehouseProductsForStaff()
                setProducts(data)
            } catch (error) {
                console.error('Error fetching products:', error)
            }
        }
        fetchProducts()
    }, [])


    useEffect(() => {
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
        fetchWarehouses()
    }, [])

    const handleAddItem = () => {
        setTransferItems([...transferItems, { productId: 0, quantity: 1 }])
    }

    const handleRemoveItem = (index: number) => {
        setTransferItems(transferItems.filter((_, i) => i !== index))
    }

    const handleItemChange = (index: number, field: keyof CreateTransferItemDto, value: any) => {
        const updated = [...transferItems]
        updated[index][field] = value
        setTransferItems(updated)
    }

    const handleSubmit = () => {
        const dto: CreateTransferDto = {
            warehouseId,
            type,
            transferItems
        }
        onSubmit(dto)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    <X size={20} />
                </button>

                <h2 className="text-lg font-bold mb-4">Tạo yêu cầu chuyển kho</h2>

                {/* Warehouse select */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kho</label>
                    <select
                        value={warehouseId || ''}
                        onChange={(e) => setWarehouseId(e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Chọn kho</option>
                        {loadingWarehouses ? (
                            <option disabled>Đang tải...</option>
                        ) : (
                            warehouses.map(w => (
                                <option key={w.warehouseId} value={w.warehouseId}>
                                    {w.name} ({w.location})
                                </option>
                            ))
                        )}
                    </select>
                </div>

                {/* Transfer type */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại yêu cầu</label>
                    <select
                        value={type}
                        onChange={(e) => setType(Number(e.target.value) as TransferType)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        {Object.values(TransferType)
                            .filter((v) => typeof v === 'number') // only keep numeric values
                            .map((t) => (
                                <option key={t} value={t}>
                                    {TransferTypeLabels[t as TransferType]}
                                </option>
                            ))}
                    </select>
                </div>

                {/* Transfer items */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sản phẩm</label>
                    {transferItems.map((item, index) => (
                        <div key={index} className="flex gap-2 mb-2 items-center">
                            <select
                                value={item.productId || ''}
                                onChange={(e) => handleItemChange(index, 'productId', parseInt(e.target.value))}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">Chọn sản phẩm</option>
                                {products.map((p) => (
                                    <option key={p.productId} value={p.productId}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Số lượng"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <MinusCircle size={20} />
                            </button>
                        </div>
                    ))}


                    <button
                        type="button"
                        onClick={handleAddItem}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 mt-2"
                    >
                        <PlusCircle size={20} /> Thêm sản phẩm
                    </button>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Tạo yêu cầu
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateTransferModal
