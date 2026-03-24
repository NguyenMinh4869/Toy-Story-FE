// components/admin/WarehouseModal.tsx
import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { Province, District, Ward } from "../../types/LocationDTO";
import { locationService } from "@/hooks/useLocation";

interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  currentWarehouse?: any | null;
  loading?: boolean;
}

const WarehouseModal: React.FC<WarehouseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentWarehouse,
  loading = false,
}) => {
  // Location states
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<number | "">("");
  const [selectedDistrict, setSelectedDistrict] = useState<number | "">("");
  const [selectedWard, setSelectedWard] = useState<number | "">("");

  // Store the actual location objects for preview
  const [selectedProvinceObj, setSelectedProvinceObj] =
    useState<Province | null>(null);
  const [selectedDistrictObj, setSelectedDistrictObj] =
    useState<District | null>(null);
  const [selectedWardObj, setSelectedWardObj] = useState<Ward | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    Name: "",
    Location: "",
  });

  // Load provinces on mount
  useEffect(() => {
    fetchProvinces();
  }, []);

  // Load initial data when editing
  useEffect(() => {
    const loadEditData = async () => {
      if (isOpen && currentWarehouse) {
        // Set form data
        setFormData({
          Name: currentWarehouse.name || "",
          Location: currentWarehouse.location || "",
        });

        // Load province if code exists
        if (currentWarehouse.provinceCode) {
          const province = await locationService.getProvinceByCode(
            currentWarehouse.provinceCode,
          );
          if (province) {
            setSelectedProvince(province.code);
            setSelectedProvinceObj(province);

            // Load districts for this province
            if (province.districts) {
              setDistricts(province.districts);
            }

            // Load district if code exists
            if (currentWarehouse.districtCode) {
              const district = province.districts?.find(
                (d) => d.code === currentWarehouse.districtCode,
              );
              if (district) {
                setSelectedDistrict(district.code);
                setSelectedDistrictObj(district);

                // Load wards for this district
                if (district.wards) {
                  setWards(district.wards);
                }

                // Load ward if code exists
                if (currentWarehouse.wardCode) {
                  const ward = district.wards?.find(
                    (w) => w.code === currentWarehouse.wardCode,
                  );
                  if (ward) {
                    setSelectedWard(ward.code);
                    setSelectedWardObj(ward);
                  }
                }
              }
            }
          }
        }
      }
    };

    if (isOpen && currentWarehouse) {
      loadEditData();
    } else if (isOpen) {
      resetForm();
    }
  }, [isOpen, currentWarehouse]);

  // Load districts when province changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (selectedProvince) {
        const province =
          await locationService.getProvinceByCode(selectedProvince);
        if (province) {
          setSelectedProvinceObj(province);
          setDistricts(province.districts || []);
        }
      } else {
        setDistricts([]);
        setWards([]);
        setSelectedDistrictObj(null);
        setSelectedWardObj(null);
      }
    };
    loadDistricts();
  }, [selectedProvince]);

  // Load wards when district changes
  useEffect(() => {
    const loadWards = async () => {
      if (selectedDistrict) {
        const district =
          await locationService.getDistrictByCode(selectedDistrict);
        if (district) {
          setSelectedDistrictObj(district);
          setWards(district.wards || []);
        }
      } else {
        setWards([]);
        setSelectedWardObj(null);
      }
    };
    loadWards();
  }, [selectedDistrict]);

  // Update selected ward object when ward changes
  useEffect(() => {
    if (selectedWard && wards.length > 0) {
      const ward = wards.find((w) => w.code === selectedWard);
      setSelectedWardObj(ward || null);
    } else {
      setSelectedWardObj(null);
    }
  }, [selectedWard, wards]);

  const fetchProvinces = async () => {
    try {
      const data = await locationService.getAllProvinces();
      setProvinces(data);
    } catch (err) {
      console.error("Failed to load provinces:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      Name: "",
      Location: "",
    });
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setSelectedProvinceObj(null);
    setSelectedDistrictObj(null);
    setSelectedWardObj(null);
    setDistricts([]);
    setWards([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const locationParts = [
      formData.Location,
      selectedWardObj?.name,
      selectedDistrictObj?.name,
      selectedProvinceObj?.name,
    ].filter(Boolean);

    const fullLocation = locationParts.join(", ");

    const warehouseData = {
      Name: formData.Name,
      Location: fullLocation,
      ProvinceCode: selectedProvince || null,
      DistrictCode: selectedDistrict || null,
      WardCode: selectedWard || null,
    };

    await onSubmit(warehouseData);

    // Only close if not in loading state
    if (!loading) {
      handleClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Preview address
  const previewAddress = [
    formData.Location,
    selectedWardObj?.name,
    selectedDistrictObj?.name,
    selectedProvinceObj?.name,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={currentWarehouse ? "Chỉnh sửa kho" : "Thêm kho mới"}
      size="xxl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Warehouse Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên kho <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              required
              placeholder="Nhập tên kho"
            />
          </div>

          {/* Province Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tỉnh/Thành phố
            </label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(Number(e.target.value) || "")}
              className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            >
              <option value="">Chọn Tỉnh/Thành phố</option>
              {provinces.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* District Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quận/Huyện
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(Number(e.target.value) || "")}
              disabled={!selectedProvince}
              className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Chọn Quận/Huyện</option>
              {districts.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ward Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phường/Xã
            </label>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(Number(e.target.value) || "")}
              disabled={!selectedDistrict}
              className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Chọn Phường/Xã</option>
              {wards.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* Street Address */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ cụ thể
            </label>
            <input
              type="text"
              name="Location"
              value={formData.Location}
              onChange={handleInputChange}
              placeholder="Số nhà, tên đường"
              className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            />
          </div>

          {/* Address Preview */}
          {previewAddress && (
            <div className="lg:col-span-2 bg-gray-50 p-3 rounded-2xl">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Địa chỉ đầy đủ:</span>{" "}
                {previewAddress}
              </p>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-red-400 text-white px-4 py-2 rounded-3xl flex items-center gap-2 hover:bg-red-600 font-black disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : "Lưu kho"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default WarehouseModal;
