/**
 * Address Book Component
 * Manage delivery addresses with Vietnam location support
 */

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { updateUser, getCurrentUser } from '../../services/authService'
import AddressForm from './AddressForm'

const AddressBook: React.FC = () => {
  const { user, refreshUser } = useAuth()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [addresses, setAddresses] = useState<string[]>([])

  // Parse existing address from user data
  React.useEffect(() => {
    if (user?.address && user.address.trim()) {
      setAddresses([user.address])
    }
  }, [user])

  const handleAddAddress = (newAddress: string) => {
    if (editingIndex !== null) {
      // Update existing address
      const updatedAddresses = [...addresses]
      updatedAddresses[editingIndex] = newAddress
      setAddresses(updatedAddresses)
      setEditingIndex(null)
    } else {
      // Add new address
      setAddresses([...addresses, newAddress])
    }
    setShowAddForm(false)
  }

  const handleEditAddress = (index: number) => {
    setEditingIndex(index)
    setShowAddForm(true)
  }

  const handleCancelEdit = () => {
    setShowAddForm(false)
    setEditingIndex(null)
  }

  const handleSetDefault = async (index: number) => {
    try {
      const selectedAddress = addresses[index]
      // Save to backend
      await updateUser({ address: selectedAddress })
      await getCurrentUser()
      refreshUser()
      
      // Move to first position in local state
      const newAddresses = [...addresses]
      const [removed] = newAddresses.splice(index, 1)
      newAddresses.unshift(removed)
      setAddresses(newAddresses)
    } catch (error) {
      console.error('Error setting default address:', error)
      alert('Có lỗi khi đặt địa chỉ mặc định')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#00247d] text-2xl font-bold font-tilt-warp">
          Địa Chỉ Giao Hàng
        </h2>
        <button
          onClick={() => {
            setEditingIndex(null)
            setShowAddForm(!showAddForm)
          }}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#ab0007] text-white rounded-full font-medium hover:bg-[#8a0006] transition-colors text-sm"
        >
          <Plus size={18} />
          Thêm địa chỉ giao hàng
        </button>
      </div>

      {/* Address Form */}
      {showAddForm && (
        <div className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <AddressForm
            onSave={handleAddAddress}
            onCancel={handleCancelEdit}
            initialAddress={editingIndex !== null ? addresses[editingIndex] : undefined}
            isEditing={editingIndex !== null}
          />
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 && !showAddForm ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Plus size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ nào</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-2.5 bg-[#ab0007] text-white rounded-lg font-medium hover:bg-[#8a0006] transition-colors"
          >
            Thêm địa chỉ mới
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address, index) => (
            <div
              key={index}
              className="p-6 border border-gray-200 rounded-lg hover:border-[#ab0007] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {index === 0 && (
                      <span className="px-2 py-0.5 bg-[#ab0007] text-white text-xs rounded">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="text-gray-900">{address}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button 
                    onClick={() => handleEditAddress(index)}
                    className="px-4 py-2 text-sm text-[#ab0007] border border-[#ab0007] rounded-lg hover:bg-red-50 transition-colors bg-white"
                  >
                    Chỉnh sửa
                  </button>
                  {index !== 0 && (
                    <button
                      onClick={() => handleSetDefault(index)}
                      className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white"
                    >
                      Đặt làm mặc định
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AddressBook
