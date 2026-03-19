// components/admin/StaffModal.tsx
import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { Province, District, Ward } from "../../types/LocationDTO";
import { locationService } from "@/hooks/useLocation";

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  currentStaff?: any | null;
  warehouses: any[];
  loading?: boolean;
}

const StaffModal: React.FC<StaffModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentStaff,
  warehouses,
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
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    warehouseId: 0,
    provinceCode: "",
    districtCode: "",
    wardCode: "",
  });

  // Load provinces on mount
  useEffect(() => {
    fetchProvinces();
  }, []);

  // Load initial data when editing
  useEffect(() => {
    const loadEditData = async () => {
      if (isOpen && currentStaff) {
        // Set form data
        setFormData({
          name: currentStaff.name || "",
          email: currentStaff.email || "",
          password: "",
          confirmPassword: "",
          phoneNumber: currentStaff.phoneNumber || "",
          address: currentStaff.address || "",
          warehouseId: currentStaff.warehouseId || 0,
          provinceCode: currentStaff.provinceCode?.toString() || "",
          districtCode: currentStaff.districtCode?.toString() || "",
          wardCode: currentStaff.wardCode?.toString() || "",
        });

        // Load province if code exists
        if (currentStaff.provinceCode) {
          const province = await locationService.getProvinceByCode(
            currentStaff.provinceCode,
          );
          if (province) {
            setSelectedProvince(province.code);
            setSelectedProvinceObj(province);
            setDistricts(province.districts || []);

            // Load district if code exists
            if (currentStaff.districtCode) {
              const district = province.districts?.find(
                (d) => d.code === currentStaff.districtCode,
              );
              if (district) {
                setSelectedDistrict(district.code);
                setSelectedDistrictObj(district);
                setWards(district.wards || []);

                // Load ward if code exists
                if (currentStaff.wardCode) {
                  const ward = district.wards?.find(
                    (w) => w.code === currentStaff.wardCode,
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

    if (isOpen && currentStaff) {
      loadEditData();
    } else if (isOpen) {
      resetForm();
    }
  }, [isOpen, currentStaff]);

  // Load districts when province changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (selectedProvince) {
        const province =
          await locationService.getProvinceByCode(selectedProvince);
        if (province) {
          setSelectedProvinceObj(province);
          setDistricts(province.districts || []);
          setFormData((prev) => ({
            ...prev,
            provinceCode: selectedProvince.toString(),
          }));
        }
      } else {
        setDistricts([]);
        setWards([]);
        setSelectedDistrictObj(null);
        setSelectedWardObj(null);
        setFormData((prev) => ({
          ...prev,
          provinceCode: "",
          districtCode: "",
          wardCode: "",
        }));
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
          setFormData((prev) => ({
            ...prev,
            districtCode: selectedDistrict.toString(),
          }));
        }
      } else {
        setWards([]);
        setSelectedWardObj(null);
        setFormData((prev) => ({ ...prev, districtCode: "", wardCode: "" }));
      }
    };
    loadWards();
  }, [selectedDistrict]);

  // Update selected ward object when ward changes
  useEffect(() => {
    if (selectedWard && wards.length > 0) {
      const ward = wards.find((w) => w.code === selectedWard);
      setSelectedWardObj(ward || null);
      setFormData((prev) => ({ ...prev, wardCode: selectedWard.toString() }));
    } else {
      setSelectedWardObj(null);
      setFormData((prev) => ({ ...prev, wardCode: "" }));
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
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      address: "",
      warehouseId: 0,
      provinceCode: "",
      districtCode: "",
      wardCode: "",
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "warehouseId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match for new staff
    if (!currentStaff && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Build full address from components
    const locationParts = [
      formData.address,
      selectedWardObj?.name,
      selectedDistrictObj?.name,
      selectedProvinceObj?.name,
    ].filter(Boolean);
    const fullAddress = locationParts.join(", ");

    // Prepare staff data
    const staffData: any = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: fullAddress,
      warehouseId: formData.warehouseId,
      provinceCode: formData.provinceCode
        ? parseInt(formData.provinceCode)
        : null,
      districtCode: formData.districtCode
        ? parseInt(formData.districtCode)
        : null,
      wardCode: formData.wardCode ? parseInt(formData.wardCode) : null,
    };

    // Add password for new staff
    if (!currentStaff) {
      staffData.password = formData.password;
      staffData.confirmPassword = formData.confirmPassword;
    }

    await onSubmit(staffData);

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
    formData.address,
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
      title={currentStaff ? "Edit Staff" : "Add New Staff"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={!!currentStaff}
          />
        </div>

        {/* Password fields for new staff */}
        {!currentStaff && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </>
        )}

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Province Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Province/City
          </label>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(Number(e.target.value) || "")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Province</option>
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
            District
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(Number(e.target.value) || "")}
            disabled={!selectedProvince}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select District</option>
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
            Ward/Commune
          </label>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(Number(e.target.value) || "")}
            disabled={!selectedDistrict}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select Ward</option>
            {wards.map((w) => (
              <option key={w.code} value={w.code}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Street Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Số nhà, tên đường"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Address Preview */}
        {previewAddress && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Full Address:</span>{" "}
              {previewAddress}
            </p>
          </div>
        )}

        {/* Warehouse Assignment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Warehouse <span className="text-red-500">*</span>
          </label>
          <select
            name="warehouseId"
            value={formData.warehouseId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value={0}>Select Warehouse</option>
            {warehouses.map((w) => (
              <option key={w.warehouseId} value={w.warehouseId}>
                {w.name} - {w.location}
              </option>
            ))}
          </select>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 min-w-[100px]"
          >
            {loading ? "Saving..." : "Save Staff"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default StaffModal;
