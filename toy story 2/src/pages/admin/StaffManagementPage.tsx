import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import StaffListTable from "../../components/admin/StaffListTable";
import {
  getAllStaff,
  createStaff,
  updateStaff,
  changeStaffStatus,
} from "../../services/staffService";
import { getWarehouses } from "../../services/warehouseService";
import type {
  ViewStaffDto,
  CreateStaffDto
} from "../../types/StaffDTO";
import type { WarehouseSummaryDto } from "../../types/WarehouseDTO";
import Pagination from "../../components/ui/Pagination";
import StaffModal from "@/components/staff/StaffModal";

const PAGE_SIZE = 10;

const StaffManagementPage: React.FC = () => {
  const [staffList, setStaffList] = useState<ViewStaffDto[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const q = searchParams.get("q") || "";

  const filteredStaff = useMemo(() => {
    if (!q) return staffList;
    return staffList.filter(
      (staff) =>
        staff.name?.toLowerCase().includes(q.toLowerCase()) ||
        staff.email?.toLowerCase().includes(q.toLowerCase()) ||
        staff.phoneNumber?.toLowerCase().includes(q.toLowerCase()),
    );
  }, [staffList, q]);

  const paginatedStaff = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredStaff.slice(start, start + PAGE_SIZE);
  }, [filteredStaff, page]);

  const totalPages = Math.ceil(filteredStaff.length / PAGE_SIZE);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<ViewStaffDto | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [staffData, warehouseData] = await Promise.all([
        getAllStaff(),
        getWarehouses(),
      ]);
      setStaffList(staffData);
      setWarehouses(warehouseData);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number) => {
    try {
      await changeStaffStatus(id);
      fetchData();
    } catch (err) {
      console.error(err);
      setError("Failed to change staff status");
    }
  };

  const openCreateModal = () => {
    setCurrentStaff(null);
    setIsModalOpen(true);
  };

  const openEditModal = (staff: ViewStaffDto) => {
    setCurrentStaff(staff);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: CreateStaffDto | Partial<ViewStaffDto>) => {
    try {
      setLoading(true);
      if (currentStaff && currentStaff.accountId) {
        await updateStaff(currentStaff.accountId, data);
      } else {
        await createStaff(data as CreateStaffDto);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setError("Failed to save staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-gray-800">Quản lý nhân viên</h1>
        <button
          onClick={openCreateModal}
          className="bg-red-400 text-white px-4 py-2 rounded-3xl flex items-center gap-2 hover:bg-red-600 font-black"
        >
          <Plus size={20} />
          Thêm nhân viên
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && !isModalOpen ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <StaffListTable
              staffList={paginatedStaff}
              onEdit={openEditModal}
              onStatusChange={handleStatusChange}
            />
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(nextPage) => {
              const next = new URLSearchParams(location.search);
              next.set("page", String(nextPage));
              navigate(`${location.pathname}?${next.toString()}`);
            }}
          />
        </>
      )}

      <StaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        currentStaff={currentStaff}
        warehouses={warehouses}
        loading={loading}
      />
    </div>
  );
};

export default StaffManagementPage;
