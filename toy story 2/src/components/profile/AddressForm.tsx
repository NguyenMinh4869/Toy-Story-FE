import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { locationService } from "../../hooks/useLocation";
import type { AddressFormData } from "../../types/Location";

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
  const [provinces, setProvinces] = useState<any[]>([]); 
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue,
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

  // Load provinces on mount using locationService
  useEffect(() => {
    const loadProvinces = async () => {
      setIsLoading(true);
      try {
        const data = await locationService.getAllProvinces();
        // Cast to any to avoid type errors
        setProvinces(data as any[]);
      } catch (error) {
        console.error("Failed to load provinces:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProvinces();
  }, []);

  // Parse initial address when editing
  useEffect(() => {
    if (initialAddress && isEditing) {
      let recipientName = "";
      let addressParts: string[];

      if (initialAddress.includes("|")) {
        const [name, addressString] = initialAddress
          .split("|")
          .map((s) => s.trim());
        recipientName = name;
        addressParts = addressString.split(",").map((p) => p.trim());
      } else {
        addressParts = initialAddress.split(",").map((p) => p.trim());
      }

      if (recipientName) {
        setValue("recipientName", recipientName);
      }

      const specificAddress = addressParts[0]?.trim();
      if (specificAddress) {
        setValue("specificAddress", specificAddress);
      }
    }
  }, [initialAddress, isEditing, setValue]);

  // Load districts when province changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (selectedProvince) {
        try {
          const provinceCode = parseInt(selectedProvince);
          const province =
            await locationService.getProvinceByCode(provinceCode);
          if (province && province.districts) {
            setDistricts(province.districts as any[]);
            setWards([]);
            setValue("district", "");
            setValue("ward", "");
          }
        } catch (error) {
          console.error("Failed to load districts:", error);
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
          const district =
            await locationService.getDistrictByCode(districtCode);
          if (district && district.wards) {
            setWards(district.wards as any[]);
            setValue("ward", "");
          }
        } catch (error) {
          console.error("Failed to load wards:", error);
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
        (p) => p.code.toString() === data.province,
      );
      const district = districts.find(
        (d) => d.code.toString() === data.district,
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

      const fullAddress = data.recipientName
        ? `${data.recipientName} | ${locationParts}`
        : locationParts;

      await updateUser({
        address: fullAddress,
        provinceCode: parseInt(data.province),
        districtCode: parseInt(data.district),
        wardCode: parseInt(data.ward),
      });

      await getCurrentUser();
      refreshUser();

      onSave(fullAddress);
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Có lỗi xảy ra khi lưu địa chỉ");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
     
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
          {...register("recipientName", {
            required: "Vui lòng nhập tên người nhận",
          })}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ab0007] ${
            errors.recipientName ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Tên"
        />
        {errors.recipientName && (
          <p className="mt-1 text-sm text-red-500">
            {errors.recipientName.message}
          </p>
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
          rules={{ required: "Vui lòng chọn tỉnh/thành phố" }}
          render={({ field }) => (
            <select
              {...field}
              disabled={isLoading}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ab0007] bg-white ${
                errors.province ? "border-red-500" : "border-gray-300"
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
          rules={{ required: "Vui lòng chọn quận/huyện" }}
          render={({ field }) => (
            <select
              {...field}
              disabled={!selectedProvince || districts.length === 0}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ab0007] bg-white ${
                errors.district ? "border-red-500" : "border-gray-300"
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
          rules={{ required: "Vui lòng chọn phường/xã" }}
          render={({ field }) => (
            <select
              {...field}
              disabled={!selectedDistrict || wards.length === 0}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ab0007] bg-white ${
                errors.ward ? "border-red-500" : "border-gray-300"
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
          {...register("specificAddress", {
            required: "Vui lòng nhập địa chỉ cụ thể",
          })}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ab0007] ${
            errors.specificAddress ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Số nhà, tên đường"
        />
        {errors.specificAddress && (
          <p className="mt-1 text-sm text-red-500">
            {errors.specificAddress.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className={`px-8 py-3 bg-[#ab0007] text-white rounded-lg justify-center items-center font-medium hover:bg-[#8a0006] transition-colors ${
            isSaving ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSaving
            ? "Đang lưu..."
            : isEditing
              ? "Cập nhật địa chỉ"
              : "Thêm địa chỉ"}
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
  );
};

export default AddressForm;
