/**
 * Profile Info Component
 * Editable personal information form
 */

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { User, Upload, CheckCircle, AlertCircle, X } from 'lucide-react'
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

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(timer)
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

  useEffect(() => {
    if (!user) return

    reset({
      name: user.name || '',
      phoneNumber: user.phoneNumber || '',
      email: user.email || ''
    })

    if (user.address && user.address.trim()) {
      setAddresses([user.address])
    } else {
      setAddresses([])
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
      await updateUser({ address: newAddress })
      await getCurrentUser()
      refreshUser()
      setAddresses([newAddress])
      setShowAddressForm(false)
      setEditingAddress(false)
      showToast('success', 'Cập nhật địa chỉ thành công!')
    } catch (error: any) {
      showToast('error', 'Có lỗi khi cập nhật địa chỉ')
    }
  }

  const handleEditAddress = () => {
    setEditingAddress(true)
    setShowAddressForm(true)
  }

  const handleAddNewAddress = () => {
    setEditingAddress(false)
    setShowAddressForm(true)
  }

  const handleCancelAddress = () => {
    setShowAddressForm(false)
    setEditingAddress(false)
  }

  const addressPreview = addresses[0] || ''

  return (
    <div>
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
        <div className="flex flex-col items-center gap-3 pb-6 border-b text-center">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
            <User size={48} className="text-gray-400" />
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white cursor-pointer"
          >
            <Upload size={14} />
            Tải ảnh lên
          </button>
          <p className="text-[11px] text-gray-500">JPG, PNG hoặc GIF (Tối đa 2MB)</p>
        </div>

        <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('name', { required: 'Vui lòng nhập họ tên' })}
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ab0007] focus:border-transparent transition-all shadow-sm ${
                errors.name ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Nhập họ và tên"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
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
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ab0007] focus:border-transparent transition-all shadow-sm ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Nhập số điện thoại"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-xs text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              disabled
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed shadow-inner"
            />
            <p className="mt-1.5 text-[11px] text-gray-400 italic">
              Email là định danh tài khoản và không thể thay đổi
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Địa chỉ giao hàng
            </label>
            <div className="w-full min-h-[44px] px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 shadow-inner flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                {addressPreview ? (
                  addressPreview.includes('|') ? (
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {addressPreview.split('|')[0].trim()}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {addressPreview.split('|')[1].trim()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-gray-900 truncate">{addressPreview}</p>
                  )
                ) : (
                  <p className="text-sm text-gray-400 italic">Chưa có địa chỉ giao hàng</p>
                )}
              </div>
              <button
                type="button"
                onClick={addressPreview ? handleEditAddress : handleAddNewAddress}
                className="shrink-0 px-4 py-2 text-xs text-[#ab0007] border border-[#ab0007] rounded-lg hover:bg-red-50 transition-colors bg-white font-medium"
              >
                {addressPreview ? 'Chỉnh sửa' : 'Thêm địa chỉ'}
              </button>
            </div>
          </div>
        </div>

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

      {showAddressForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200"
          onClick={handleCancelAddress}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-[#00247d] font-tilt-warp">
                {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
              </h3>
              <button
                onClick={handleCancelAddress}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <AddressForm
                onSave={handleAddAddress}
                onCancel={handleCancelAddress}
                initialAddress={editingAddress ? addresses[0] : undefined}
                isEditing={editingAddress}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileInfo
