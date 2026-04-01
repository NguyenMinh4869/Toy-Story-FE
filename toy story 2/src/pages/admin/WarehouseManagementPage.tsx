// pages/admin/WarehouseManagementPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import WarehouseListTable from "../../components/admin/WarehouseListTable";
import WarehouseModal from "@/components/warehouse/WarehouseModal";
import Pagination from "../../components/ui/Pagination";
import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "../../services/warehouseService";
import type { WarehouseSummaryDto } from "../../types/WarehouseDTO";
import { confirmAction } from "../../utils/confirmAction";
import { runAsync } from "../../utils/runAsync";

const PAGE_SIZE = 10;

const WarehouseManagementPage: React.FC = () => {
  const [warehouses, setWarehouses] = useState<WarehouseSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWarehouse, setCurrentWarehouse] =
    useState<WarehouseSummaryDto | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const q = searchParams.get("q") || "";

  // Filter and pagination
  const filteredWarehouses = useMemo(() => {
    if (!q) return warehouses;
    return warehouses.filter(
      (w) =>
        w.name?.toLowerCase().includes(q.toLowerCase()) ||
        w.location?.toLowerCase().includes(q.toLowerCase()),
    );
  }, [warehouses, q]);

  const paginatedWarehouses = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredWarehouses.slice(start, start + PAGE_SIZE);
  }, [filteredWarehouses, page]);

  const totalPages = Math.ceil(filteredWarehouses.length / PAGE_SIZE);

  // Load data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getWarehouses();
      setWarehouses(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load warehouses");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (warehouseData: any) => {
    try {
      setModalLoading(true);

      if (currentWarehouse?.warehouseId) {
        await updateWarehouse(currentWarehouse.warehouseId, warehouseData);
      } else {
        await createWarehouse(warehouseData);
      }

      setIsModalOpen(false);
      setCurrentWarehouse(null);
      await fetchData();
    } catch (err) {
      console.error(err);
      setError("Failed to save warehouse");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteWarehouse = async (id: number) => {
  const confirmed = await confirmAction(
    "Are you sure you want to delete this warehouse?"
  );

  if (!confirmed) return;

  try {
    setError(null);
    await deleteWarehouse(id);
    await fetchData();
  } catch (err) {
    console.error(err);
    setError("Failed to delete warehouse");
  }
};

  const openCreateModal = () => {
    setCurrentWarehouse(null);
    setIsModalOpen(true);
  };

  const openEditModal = (warehouse: WarehouseSummaryDto) => {
    setCurrentWarehouse(warehouse);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-gray-800">
          Quản lý kho
        </h1>
        <button
          onClick={openCreateModal}
          className="bg-red-400 text-white px-4 py-2 rounded-3xl flex items-center gap-2 hover:bg-red-600 font-black"
        >
          <Plus size={20} />
          Thêm kho mới
        </button>
      </div>

      {/* {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )} */}
      
      {loading && !isModalOpen ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <WarehouseListTable
              warehouses={paginatedWarehouses}
              onEdit={openEditModal}
              onDelete={handleDeleteWarehouse}
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

      {/* Modal is now a separate component */}
      <WarehouseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentWarehouse(null);
        }}
        onSubmit={handleSubmit}
        currentWarehouse={currentWarehouse}
        loading={modalLoading}
      />
    </div>
  );
};

export default WarehouseManagementPage;
