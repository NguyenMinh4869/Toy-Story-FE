/**
 * Address Form Component
 * Form for adding/editing address with Vietnam location dropdowns
 */

import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { fetchProvinces, fetchProvinceWithDetails, fetchDistrictWithWards } from '../../services/locationService'
import type { AddressFormData, Province, District, Ward } from '../../types/Location'
import { updateUser, getCurrentUser } from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'

interface AddressFormProps {
  onSave: (address: string) => void
  onCancel: () => void
  initialAddress?: string
  isEditing?: boolean
}

const AddressForm: React.FC<AddressFormProps> = ({ onSave, onCancel, initialAddress, isEditing = false }) => {
  const { refreshUser } = useAuth()
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue
  } = useForm<AddressFormData>({
    defaultValues: {
      recipientName: '',
      province: '',
      district: '',
      ward: '',
      specificAddress: ''
    }
  })

  const selectedProvince = watch('province')
  const selectedDistrict = watch('district')

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      setIsLoading(true)
      const data = await fetchProvinces()
      setProvinces(data)
      setIsLoading(false)
    }
    loadProvinces()
  }, [])

  // Parse initial address when editing
  useEffect(() => {
    if (initialAddress && isEditing) {
      let recipientName = ''
      let addressParts: string[]
      
      // Check if address contains recipient name (separated by |)
      if (initialAddress.includes('|')) {
        const [name, addressString] = initialAddress.split('|').map(s => s.trim())
        recipientName = name
        addressParts = addressString.split(',').map(p => p.trim())
      } else {
        addressParts = initialAddress.split(',').map(p => p.trim())
      }
      
      // Set recipient name if exists
      if (recipientName) {
        setValue('recipientName', recipientName)
      }
      
      // Set specific address (first part)
      const specificAddress = addressParts[0]?.trim()
      if (specificAddress) {
        setValue('specificAddress', specificAddress)
      }
    }
  }, [initialAddress, isEditing, setValue])

  // Load districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      const loadDistricts = async () => {
        const provinceCode = parseInt(selectedProvince)
        const provinceData = await fetchProvinceWithDetails(provinceCode)
        if (provinceData && provinceData.districts) {
          setDistricts(provinceData.districts)
          setWards([])
          setValue('district', '')
          setValue('ward', '')
        }
      }
      loadDistricts()
    } else {
      setDistricts([])
      setWards([])
    }
  }, [selectedProvince, setValue])

  // Load wards when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const loadWards = async () => {
        const districtCode = parseInt(selectedDistrict)
        const districtData = await fetchDistrictWithWards(districtCode)
        if (districtData && districtData.wards) {
          setWards(districtData.wards)
          setValue('ward', '')
        }
      }
      loadWards()
    } else {
      setWards([])
    }
  }, [selectedDistrict, setValue])

  const onSubmit = async (data: AddressFormData) => {
    try {
      setIsSaving(true)

      // Find the selected location names
      const province = provinces.find(p => p.code.toString() === data.province)
      const district = districts.find(d => d.code.toString() === data.district)
      const ward = wards.find(w => w.code.toString() === data.ward)

      // Combine into a single address string with recipient name
      const locationParts = [
        data.specificAddress,
        ward?.name,
        district?.name,
        province?.name
      ].filter(Boolean).join(', ')
      
      const fullAddress = data.recipientName 
        ? `${data.recipientName} | ${locationParts}`
        : locationParts

      // Save to backend
      await updateUser({
        address: fullAddress
      })

      // Refresh user data
      await getCurrentUser()
      refreshUser()

      onSave(fullAddress)
    } catch (error) {
      console.error('Error saving address:', error)
      alert('Có lỗi xảy ra khi lưu địa chỉ')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <h3 className="text-[#00247d] text-lg font-bold mb-2">
          {isEditing ? 'Chỉnh Sửa Địa Chỉ' : 'Thêm Địa Chỉ Giao Hàng'}
        </h3>
        {isEditing && initialAddress && (
          <p className="text-sm text-gray-600 mb-4">
            <strong>Địa chỉ hiện tại:</strong> {initialAddress}
          </p>
        )}
      </div>

      {/* Recipient Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tên người nhận <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('recipientName', { required: 'Vui lòng nhập tên người nhận' })}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ab0007] ${
            errors.recipientName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Tên"
        />
        {errors.recipientName && (
          <p className="mt-1 text-sm text-red-500">{errors.recipientName.message}</p>
        )}
      </div>

      {/* Province */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tỉnh/Thành phố <span className="text-red-500">*</span>
        </label>
        <Controller
          name="province"
          control={control}
          rules={{ required: 'Vui lòng chọn tỉnh/thành phố' }}
          render={({ field }) => (
            <select
              {...field}
              disabled={isLoading}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ab0007] bg-white ${
                errors.province ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Chọn tỉnh/thành phố</option>
              {provinces.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </select>
          )}
        />
        {errors.province && (
          <p className="mt-1 text-sm text-red-500">{errors.province.message}</p>
        )}
      </div>

      {/* District */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quận/Huyện <span className="text-red-500">*</span>
        </label>
        <Controller
          name="district"
          control={control}
          rules={{ required: 'Vui lòng chọn quận/huyện' }}
          render={({ field }) => (
            <select
              {...field}
              disabled={!selectedProvince || districts.length === 0}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ab0007] bg-white ${
                errors.district ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Chọn quận/huyện</option>
              {districts.map((district) => (
                <option key={district.code} value={district.code}>
                  {district.name}
                </option>
              ))}
            </select>
          )}
        />
        {errors.district && (
          <p className="mt-1 text-sm text-red-500">{errors.district.message}</p>
        )}
      </div>

      {/* Ward */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phường/Xã <span className="text-red-500">*</span>
        </label>
        <Controller
          name="ward"
          control={control}
          rules={{ required: 'Vui lòng chọn phường/xã' }}
          render={({ field }) => (
            <select
              {...field}
              disabled={!selectedDistrict || wards.length === 0}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ab0007] bg-white ${
                errors.ward ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Chọn phường/xã</option>
              {wards.map((ward) => (
                <option key={ward.code} value={ward.code}>
                  {ward.name}
                </option>
              ))}
            </select>
          )}
        />
        {errors.ward && (
          <p className="mt-1 text-sm text-red-500">{errors.ward.message}</p>
        )}
      </div>

      {/* Specific Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Địa chỉ cụ thể <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('specificAddress', { required: 'Vui lòng nhập địa chỉ cụ thể' })}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ab0007] ${
            errors.specificAddress ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Số nhà, tên đường"
        />
        {errors.specificAddress && (
          <p className="mt-1 text-sm text-red-500">{errors.specificAddress.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className={`px-8 py-3 bg-[#ab0007] text-white rounded-lg font-medium hover:bg-[#8a0006] transition-colors ${
            isSaving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSaving ? 'Đang lưu...' : isEditing ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Hủy
        </button>
      </div>
    </form>
  )
}

export default AddressForm
