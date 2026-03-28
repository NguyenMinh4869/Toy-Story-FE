import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { locationService } from "../../hooks/useLocation";
import type { AddressFormData } from "../../types/Location";
import type { Province, District, Ward } from "@/types/LocationDTO";

import { updateUser, getCurrentUser } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

interface AddressFormProps {
  onSave: (address: string) => void;
  onCancel: () => void;
  initialAddress?: string;
  isEditing?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  onSave,
  onCancel,
  initialAddress,
  isEditing = false,
}) => {
  const { refreshUser } = useAuth();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue,
    reset
  } = useForm<AddressFormData>({
    defaultValues: {
      recipientName: "",
      province: "",
      district: "",
      ward: "",
      specificAddress: "",
    },
  });

  const selectedProvince = watch("province");
  const selectedDistrict = watch("district");

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      setIsLoading(true);
      try {
        const data = await locationService.getAllProvinces();
        setProvinces(data);
      } catch (error) {
        console.error("Failed to load provinces:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProvinces();
  }, []);

  // Load districts when province changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (selectedProvince) {
        try {
          const provinceCode = parseInt(selectedProvince);
          const province = await locationService.getProvinceByCode(provinceCode);
          if (province && province.districts) {
            setDistricts(province.districts);
            setWards([]);
            setValue("district", "");
            setValue("ward", "");
          }
        } catch (error) {
          console.error("Failed to load districts:", error);
          setDistricts([]);
        }
      } else {
        setDistricts([]);
        setWards([]);
      }
    };
    loadDistricts();
  }, [selectedProvince, setValue]);

  // Load wards when district changes
  useEffect(() => {
    const loadWards = async () => {
      if (selectedDistrict) {
        try {
          const districtCode = parseInt(selectedDistrict);
          const district = await locationService.getDistrictByCode(districtCode);
          if (district && district.wards) {
            setWards(district.wards);
            setValue("ward", "");
          }
        } catch (error) {
          console.error("Failed to load wards:", error);
          setWards([]);
        }
      } else {
        setWards([]);
      }
    };
    loadWards();
  }, [selectedDistrict, setValue]);

  const onSubmit = async (data: AddressFormData) => {
    try {
      setIsSaving(true);

      const province = provinces.find(
        (p) => p.code.toString() === data.province
      );
      const district = districts.find(
        (d) => d.code.toString() === data.district
      );
      const ward = wards.find((w) => w.code.toString() === data.ward);

      const locationParts = [
        data.specificAddress,
        ward?.name,
        district?.name,
        province?.name,
      ]
        .filter(Boolean)
        .join(", ");

      const fullAddress = locationParts;

      await updateUser({
        address: fullAddress,
        provinceCode: parseInt(data.province),
        districtCode: parseInt(data.district),
        wardCode: parseInt(data.ward),
      });

      await getCurrentUser();
      refreshUser();

      onSave(fullAddress);
      reset(); // Reset form after successful save
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Có lỗi xảy ra khi lưu địa chỉ");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} >
      {isEditing && initialAddress && (
        <div className="mb-4 rounded-lg">
          <p className="text-md text-gray-600">
            <strong>Địa chỉ hiện tại:</strong> {initialAddress}
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tỉnh/Thành phố <span className="text-red-500">*</span>
        </label>
        <Controller
          name="province"
          control={control}
          rules={{ required: "Vui lòng chọn tỉnh/thành phố" }}
          render={({ field }) => (
            <select
              {...field}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              disabled={isLoading}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ab0007] bg-white ${errors.province ? "border-red-500" : "border-gray-300"
                }`}
            >
              <option value="">-- Chọn tỉnh/thành phố --</option>
              {provinces.map((province) => (
                <option key={province.code} value={province.code.toString()}>
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

      {/* District Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
          Quận/Huyện <span className="text-red-500">*</span>
        </label>
        <Controller
          name="district"
          control={control}
          rules={{ required: "Vui lòng chọn quận/huyện" }}
          render={({ field }) => (
            <select
              {...field}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              disabled={!selectedProvince || districts.length === 0}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ab0007] bg-white ${errors.district ? "border-red-500" : "border-gray-300"
                }`}
            >
              <option value="">-- Chọn quận/huyện --</option>
              {districts.map((district) => (
                <option key={district.code} value={district.code.toString()}>
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

      {/* Ward Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
          Phường/Xã <span className="text-red-500">*</span>
        </label>
        <Controller
          name="ward"
          control={control}
          rules={{ required: "Vui lòng chọn phường/xã" }}
          render={({ field }) => (
            <select
              {...field}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              disabled={!selectedDistrict || wards.length === 0}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ab0007] bg-white ${errors.ward ? "border-red-500" : "border-gray-300"
                }`}
            >
              <option value="">-- Chọn phường/xã --</option>
              {wards.map((ward) => (
                <option key={ward.code} value={ward.code.toString()}>
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
        <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
          Địa chỉ cụ thể <span className="text-red-500">*</span>
        </label>
        <Controller
          name="specificAddress"
          control={control}
          rules={{ required: "Vui lòng nhập địa chỉ cụ thể" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ab0007] ${errors.specificAddress ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="Số nhà, tên đường"
            />
          )}
        />
        {errors.specificAddress && (
          <p className="mt-1 text-sm text-red-500">
            {errors.specificAddress.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className={`min-w-[220px] px-8 py-3 bg-[#ab0007] text-white rounded-lg font-medium hover:bg-[#8a0006] transition-colors ${isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          {isSaving
            ? "Đang lưu..."
            : isEditing
              ? "Cập nhật địa chỉ"
              : "Thêm địa chỉ"}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;