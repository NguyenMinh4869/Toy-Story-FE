import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import StaffListTable from "../../components/admin/StaffListTable";
import {
  filterStaff,
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
  const [statusFilter, setStatusFilter] = useState<0 | 1 | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState(() => new URLSearchParams(window.location.search).get('q') || '');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const q = searchParams.get("q") || "";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const current = params.get('q') || '';
    if (debouncedSearch === current) return;
    if (debouncedSearch) {
      params.set('q', debouncedSearch);
    } else {
      params.delete('q');
    }
    params.delete('page');
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [debouncedSearch]);

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
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [staffData, warehouseData] = await Promise.all([
        filterStaff({ status: statusFilter }),
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
  if (!window.confirm('Bạn có chắc chắn muốn thay đổi trạng thái nhân viên này?')) return;
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

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {([
          { label: 'Tất cả', value: undefined },
          { label: 'Đang hoạt động', value: 0 },
          { label: 'Ngừng hoạt động', value: 1 },
        ] as { label: string; value: typeof statusFilter }[]).map(tab => (
          <button
            key={tab.label}
            onClick={() => { setStatusFilter(tab.value); navigate(location.pathname); }}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              statusFilter === tab.value
                ? 'bg-red-400 text-white border-red-400'
                : 'bg-white text-gray-600 border-gray-300 hover:border-red-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-red-400 w-56"
          />
        </div>
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
