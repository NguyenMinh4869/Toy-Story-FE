/**
 * Profile Info Component
 * Editable personal information form
 */

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { User, Upload, Plus, CheckCircle, AlertCircle, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { updateUser, getCurrentUser } from '../../services/authService'
import type { UpdateUserDto } from '../../types/AccountDTO'
import AddressForm from './AddressForm'

interface ProfileFormData {
  name: string
  phoneNumber: string
  email: string
}

const ProfileInfo: React.FC = () => {
  const { user, refreshUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(false)
  const [addresses, setAddresses] = useState<string[]>([])

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
  }

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [toast])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      phoneNumber: user?.phoneNumber || '',
      email: user?.email || ''
    }
  })

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        phoneNumber: user.phoneNumber || '',
        email: user.email || ''
      })
      // Initialize address
      if (user.address && user.address.trim()) {
        setAddresses([user.address])
      }
    }
  }, [user, reset])

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true)

      const updateDto: UpdateUserDto = {
        name: data.name,
        phoneNumber: data.phoneNumber
      }

      await updateUser(updateDto)
      
      // Refresh user data
      await getCurrentUser()
      refreshUser()

      showToast('success', 'Cập nhật thông tin thành công!')
    } catch (error: any) {
      showToast('error', error.message || 'Có lỗi xảy ra khi cập nhật thông tin')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAddress = async (newAddress: string) => {
    try {
      if (editingAddress) {
        // Update existing address
        await updateUser({ address: newAddress })
        await getCurrentUser()
        refreshUser()
        setAddresses([newAddress])
        setEditingAddress(false)
      } else {
        // Add new address
        await updateUser({ address: newAddress })
        await getCurrentUser()
        refreshUser()
        setAddresses([newAddress])
      }
      setShowAddressForm(false)
      showToast('success', 'Cập nhật địa chỉ thành công!')
    } catch (error: any) {
      showToast('error', 'Có lỗi khi cập nhật địa chỉ')
    }
  }

  const handleEditAddress = () => {
    setEditingAddress(true)
    setShowAddressForm(true)
  }

  const handleCancelAddress = () => {
    setShowAddressForm(false)
    setEditingAddress(false)
  }

  return (
    <div>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-md ${
              toast.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={20} className="flex-shrink-0" />
            ) : (
              <AlertCircle size={20} className="flex-shrink-0" />
            )}
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <h2 className="text-[#00247d] text-2xl font-bold mb-6 font-tilt-warp">
        Thông Tin Tài Khoản
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar Upload (Optional) */}
        <div className="flex items-center gap-6 pb-6 border-b">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
            <User size={48} className="text-gray-400" />
          </div>
          <div>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white cursor-pointer"
            >
              <Upload size={16} />
              Tải ảnh lên
            </button>
            <p className="text-xs text-gray-500 mt-2">
              JPG, PNG hoặc GIF (Tối đa 2MB)
            </p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('name', { required: 'Vui lòng nhập họ tên' })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ab0007] focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nhập họ và tên"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            {...register('phoneNumber', {
              required: 'Vui lòng nhập số điện thoại',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Số điện thoại không hợp lệ (10 chữ số)'
              }
            })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ab0007] focus:border-transparent ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nhập số điện thoại"
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Email (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            {...register('email')}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">
            Email không thể thay đổi
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-8 py-3 bg-[#ab0007] text-white rounded-lg font-medium hover:bg-[#8a0006] transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>

      {/* Address Management Section - Outside the form to avoid nesting */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[#00247d] text-xl font-bold font-tilt-warp">
            Địa Chỉ Giao Hàng
          </h3>
          {addresses.length === 0 && (
            <button
              type="button"
              onClick={() => setShowAddressForm(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#ab0007] text-white rounded-full font-medium hover:bg-[#8a0006] transition-colors text-sm"
            >
              <Plus size={18} />
              Thêm địa chỉ
            </button>
          )}
        </div>

        {/* Address Form */}
        {showAddressForm && (
          <div className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
            <AddressForm
              onSave={handleAddAddress}
              onCancel={handleCancelAddress}
              initialAddress={editingAddress ? addresses[0] : undefined}
              isEditing={editingAddress}
            />
          </div>
        )}

        {/* Address Display */}
        {addresses.length === 0 && !showAddressForm ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ giao hàng</p>
          </div>
        ) : (
          !showAddressForm && addresses.length > 0 && (
            <div className="p-6 border border-gray-200 rounded-lg hover:border-[#ab0007] transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Display address with proper formatting */}
                  {addresses[0].includes('|') ? (
                    <div>
                      <p className="text-gray-900 font-medium mb-1">
                        {addresses[0].split('|')[0].trim()}
                      </p>
                      <p className="text-gray-700">
                        {addresses[0].split('|')[1].trim()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-900">{addresses[0]}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button 
                    type="button"
                    onClick={handleEditAddress}
                    className="px-4 py-2 text-sm text-[#ab0007] border border-[#ab0007] rounded-lg hover:bg-red-50 transition-colors bg-white"
                  >
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default ProfileInfo
